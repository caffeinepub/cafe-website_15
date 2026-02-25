import Array "mo:core/Array";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Migration "migration";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

// Run migration on upgrade
(with migration = Migration.run)
actor {
  include MixinStorage();

  // Initialize access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  type UserProfile = {
    username : Text;
    balance : Nat;
  };

  type Task = {
    id : Nat;
    title : Text;
    description : Text;
    reward : Nat;
    category : Category;
    status : TaskStatus;
  };

  type TaskCompletion = {
    taskId : Nat;
    userId : Principal;
    completedAt : Time.Time;
    approved : Bool;
  };

  type ContactSubmission = {
    name : Text;
    email : Text;
    message : Text;
  };

  type WithdrawalRequest = {
    userId : Principal;
    amount : Nat;
    timestamp : Time.Time;
  };

  type Category = {
    #coffee;
    #tea;
    #snacks;
    #meals;
  };

  type TaskStatus = {
    #available;
    #inProgress;
    #completed;
  };

  // Persistent State
  let userProfiles = Map.empty<Principal, UserProfile>();
  let tasks = Map.empty<Nat, Task>();
  let taskCompletions = List.empty<TaskCompletion>();
  let contactSubmissions = Map.empty<Nat, ContactSubmission>();
  let withdrawalRequests = List.empty<WithdrawalRequest>();

  // -----------------------------------------------------------------------
  // Required profile functions (per instructions)
  // -----------------------------------------------------------------------

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // -----------------------------------------------------------------------
  // User Management
  // -----------------------------------------------------------------------

  /// Register a new user. Any non-anonymous principal may call this.
  public shared ({ caller }) func registerUser(username : Text) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous principal not allowed");
    };

    if (userProfiles.containsKey(caller)) {
      Runtime.trap("User already registered for this principal");
    };

    let profile : UserProfile = {
      username;
      balance = 0;
    };

    userProfiles.add(caller, profile);

    // Assign the #user role so the caller gains user-level permissions
    AccessControl.assignRole(accessControlState, caller, caller, #user);
  };

  public query ({ caller }) func getMyProfile() : async UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their profile");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) { profile };
    };
  };

  // -----------------------------------------------------------------------
  // Task Management
  // -----------------------------------------------------------------------

  /// Add a new task. Admin only.
  public shared ({ caller }) func addTask(title : Text, description : Text, reward : Nat, category : Category) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add tasks");
    };
    let id = tasks.size() + 1;
    let task : Task = {
      id;
      title;
      description;
      reward;
      category;
      status = #available;
    };
    tasks.add(id, task);
  };

  /// List all available tasks. Public — no auth required.
  public query func listAvailableTasks() : async [Task] {
    tasks.values().toArray().filter(
      func(task : Task) : Bool { task.status == #available }
    );
  };

  /// Submit a task completion record. Authenticated users only.
  public shared ({ caller }) func submitTaskCompletion(taskId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit task completions");
    };

    switch (tasks.get(taskId)) {
      case (null) { Runtime.trap("Task not found") };
      case (?task) {
        if (task.status != #available) {
          Runtime.trap("Task is not available");
        };

        let completion : TaskCompletion = {
          taskId;
          userId = caller;
          completedAt = Time.now();
          approved = false;
        };

        taskCompletions.add(completion);
      };
    };
  };

  /// Get the caller's task completions. Authenticated users only.
  public query ({ caller }) func getMyCompletions() : async [TaskCompletion] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their completions");
    };
    taskCompletions.toArray().filter(
      func(completion : TaskCompletion) : Bool { completion.userId == caller }
    );
  };

  /// Get the caller's current balance. Authenticated users only.
  public query ({ caller }) func getMyBalance() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their balance");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) { profile.balance };
    };
  };

  // -----------------------------------------------------------------------
  // Contact and Withdrawal Requests
  // -----------------------------------------------------------------------

  /// Submit a contact form. Public — no auth required.
  public shared func submitContactForm(name : Text, email : Text, message : Text) : async () {
    let id = contactSubmissions.size() + 1;
    let submission : ContactSubmission = {
      name;
      email;
      message;
    };
    contactSubmissions.add(id, submission);
  };

  /// Request a withdrawal. Authenticated users only.
  public shared ({ caller }) func requestWithdrawal(amount : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can request withdrawals");
    };

    if (amount == 0) {
      Runtime.trap("Amount must be greater than 0");
    };

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) {
        if (profile.balance < amount) {
          Runtime.trap("Insufficient balance");
        };

        let withdrawal : WithdrawalRequest = {
          userId = caller;
          amount;
          timestamp = Time.now();
        };

        withdrawalRequests.add(withdrawal);
      };
    };
  };

  // -----------------------------------------------------------------------
  // Admin helpers
  // -----------------------------------------------------------------------

  /// Approve a task completion and credit the user's balance. Admin only.
  public shared ({ caller }) func approveTaskCompletion(taskId : Nat, userId : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve task completions");
    };

    // Find the task reward
    let reward = switch (tasks.get(taskId)) {
      case (null) { Runtime.trap("Task not found") };
      case (?task) { task.reward };
    };

    // Update the completion record to approved
    let updatedCompletions = taskCompletions.toArray().map(
      func(c : TaskCompletion) : TaskCompletion {
        if (c.taskId == taskId and c.userId == userId and not c.approved) {
          { c with approved = true };
        } else {
          c;
        };
      }
    );
    // Replace list contents
    taskCompletions.clear();
    for (c in updatedCompletions.vals()) {
      taskCompletions.add(c);
    };

    // Credit the user's balance
    switch (userProfiles.get(userId)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        let updated : UserProfile = {
          profile with balance = profile.balance + reward
        };
        userProfiles.add(userId, updated);
      };
    };
  };

  /// Assign a role to a user. Admin only (enforced inside AccessControl.assignRole).
  public shared ({ caller }) func assignUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    // AccessControl.assignRole already enforces admin-only internally
    AccessControl.assignRole(accessControlState, caller, user, role);
  };
};

import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

module {
  // Old Types
  type OldMenuItem = {
    name : Text;
    description : Text;
    price : Float;
    category : OldCategory;
  };

  type OldContactSubmission = {
    name : Text;
    email : Text;
    message : Text;
  };

  type OldCategory = {
    #coffee;
    #tea;
    #snacks;
    #meals;
  };

  type OldContactInfo = {
    address : Text;
    phone : Text;
    email : Text;
    openingHours : Text;
  };

  // Old actor type
  type OldActor = {
    menuItems : Map.Map<Text, OldMenuItem>;
    contactSubmissions : Map.Map<Nat, OldContactSubmission>;
    cafeContactInfo : OldContactInfo;
  };

  // New Types
  type UserProfile = {
    username : Text;
    balance : Nat;
  };

  type Task = {
    id : Nat;
    title : Text;
    description : Text;
    reward : Nat;
    category : NewCategory;
    status : TaskStatus;
  };

  type TaskCompletion = {
    taskId : Nat;
    userId : Principal;
    completedAt : Time.Time;
    approved : Bool;
  };

  type WithdrawalRequest = {
    userId : Principal;
    amount : Nat;
    timestamp : Time.Time;
  };

  type NewCategory = {
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

  type ContactSubmission = {
    name : Text;
    email : Text;
    message : Text;
  };

  // New actor type
  type NewActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    tasks : Map.Map<Nat, Task>;
    taskCompletions : List.List<TaskCompletion>;
    contactSubmissions : Map.Map<Nat, ContactSubmission>;
    withdrawalRequests : List.List<WithdrawalRequest>;
  };

  // Migration function called by the main actor via the with-clause
  public func run(old : OldActor) : NewActor {
    {
      userProfiles = Map.empty<Principal, UserProfile>();
      tasks = Map.empty<Nat, Task>();
      taskCompletions = List.empty<TaskCompletion>();
      contactSubmissions = old.contactSubmissions;
      withdrawalRequests = List.empty<WithdrawalRequest>();
    };
  };
};

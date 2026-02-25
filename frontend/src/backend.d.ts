import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface TaskCompletion {
    completedAt: Time;
    userId: Principal;
    taskId: bigint;
    approved: boolean;
}
export interface Task {
    id: bigint;
    status: TaskStatus;
    reward: bigint;
    title: string;
    description: string;
    category: Category;
}
export interface UserProfile {
    username: string;
    balance: bigint;
}
export enum Category {
    tea = "tea",
    meals = "meals",
    snacks = "snacks",
    coffee = "coffee"
}
export enum TaskStatus {
    completed = "completed",
    available = "available",
    inProgress = "inProgress"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    /**
     * / Add a new task. Admin only.
     */
    addTask(title: string, description: string, reward: bigint, category: Category): Promise<void>;
    /**
     * / Approve a task completion and credit the user's balance. Admin only.
     */
    approveTaskCompletion(taskId: bigint, userId: Principal): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    /**
     * / Assign a role to a user. Admin only (enforced inside AccessControl.assignRole).
     */
    assignUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    /**
     * / Get the caller's current balance. Authenticated users only.
     */
    getMyBalance(): Promise<bigint>;
    /**
     * / Get the caller's task completions. Authenticated users only.
     */
    getMyCompletions(): Promise<Array<TaskCompletion>>;
    getMyProfile(): Promise<UserProfile>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    /**
     * / List all available tasks. Public — no auth required.
     */
    listAvailableTasks(): Promise<Array<Task>>;
    /**
     * / Register a new user. Any non-anonymous principal may call this.
     */
    registerUser(username: string): Promise<void>;
    /**
     * / Request a withdrawal. Authenticated users only.
     */
    requestWithdrawal(amount: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    /**
     * / Submit a contact form. Public — no auth required.
     */
    submitContactForm(name: string, email: string, message: string): Promise<void>;
    /**
     * / Submit a task completion record. Authenticated users only.
     */
    submitTaskCompletion(taskId: bigint): Promise<void>;
}

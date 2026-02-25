# Specification

## Summary
**Goal:** Replace the existing cafe site with a micro-task earning platform called TaskEarn, where users can browse tasks, complete them for rewards, and manage their earnings.

**Planned changes:**
- Replace the cafe Motoko backend with a new actor supporting user profiles (keyed by principal with balance), task definitions, task completion records, and withdrawal requests; expose functions: `registerUser`, `getMyProfile`, `listAvailableTasks`, `submitTaskCompletion`, `getMyCompletions`, `getMyBalance`, `requestWithdrawal`
- Replace the homepage with a TaskEarn landing page featuring a hero section (platform name, tagline, CTA button), a "How It Works" three-step section, and a footer with links to Tasks, Dashboard, and Contact
- Add a Tasks page (`/tasks`) that lists available task cards (title, description snippet, reward, category badge) with a category filter bar; clicking a card opens a detail view/modal with a "Complete This Task" button that submits a completion record
- Implement Internet Identity authentication: show Sign In/Sign Out in the nav, call `registerUser` on login, gate task completion behind authentication
- Add a Dashboard page (`/dashboard`, authenticated only) showing earned balance, completed tasks list, summary card (total tasks/earnings), and a Request Withdrawal form
- Update site-wide navigation to links: Home, Tasks, Dashboard with active-route highlighting and a responsive mobile hamburger menu; remove all cafe-specific links
- Apply a modern deep-indigo and vibrant-green theme across all pages, replacing all cafe earthy styles; use modern sans-serif typography and card-with-shadow layouts

**User-visible outcome:** Users can visit the TaskEarn platform, sign in with Internet Identity, browse and complete small tasks to earn token rewards, view their balance and completed tasks on a personal dashboard, and request a withdrawal.

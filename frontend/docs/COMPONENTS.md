# Components Overview

A quick guide to key UI components and what they do.

## Shared UI (src/components)

- Button: Primary button with disabled/hover states. Accepts native props.
- Input: Styled text input with focus ring; passes native props.
- Toggle: Simple on/off switch with animated knob.
- Toast: Transient notification that auto-dismisses after 3s.
- ProcessingBox: Full-screen overlay with spinner and message.
- Avatar: Circular image with emoji fallback; accepts base64.
- SharePopup: Inline popover with social share actions and "Copy Link".

## Layouts

- AppLayout: App shell with sidebar (desktop), top bar (mobile), and content slot. Handles mobile drawer and logout.

## Routing

- AppRoutes: Public auth routes, protected app routes under `RequireAuth`.
- RequireAuth: Route guard; redirects to `/login` if no token.

## Feature Components (examples)

- Clubs
  - AboutTab: Club details with editable fields (admin only).
  - EventsTab: Calendar + CRUD for events; CSV export of attendees.
  - PostsTab: Composer + list with like/comment/share/bookmark.
  - MembersTab: Grid/list of members, search, and role management.
  - ThreadDetail / PostDetail: Dedicated views for forum threads/posts.
- Feed
  - FeedPage: Infinite feed combining events and posts with actions.
- Bookmarks
  - BookmarksPage: List of saved posts with quick actions.
- Notifications
  - NotificationsPage: List and mark-as-read actions.
- Auth
  - LoginPage / RegisterPage: Forms for authentication flows.
- Profile
  - ProfilePage: Current user profile with inline edit and avatar upload.
  - UserProfilePage: Read-only view for another user's profile.
- Admin
  - AdminPage, ManageUsersPage, AnalyticsPage, ModerationPage: Admin tools.


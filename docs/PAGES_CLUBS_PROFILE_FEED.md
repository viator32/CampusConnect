# Pages: Clubs, Profile, Feed

This document describes the key pages in the Clubs, Profile, and Feed features: how they’re built, which components they compose, and the most commonly used service methods.

## Clubs

### ExplorePage (`src/features/clubs/pages/ExplorePage.tsx`)
- Purpose: Discover clubs with search, filters, sorting, pagination; switchable grid/list views.
- Composition: `Input`, `Button`, `ClubGrid`, `ClubList`, icons (`Search`, `Filter`, etc.).
- Data flow: Uses `useClubs` hook (which calls `ClubService.getAll`) and local state for filters and pagination.
- Frequent methods:
  - `clubService.getAll(params)` – fetch clubs with query params.
  - `joinClub(id)` / `leaveClub(id)` – join/leave actions on a club.
- Notes: Keeps filter state local, resets page when filters change, navigates to `ClubDetailPage` on select.

### ClubDetailPage (`src/features/clubs/pages/ClubDetailPage.tsx`)
- Purpose: Single-club view with tabs for About, Events, Forum, Posts, Members. Handles join/leave and routes to single post/thread views.
- Composition: Tab components (`AboutTab`, `EventsTab`, `ForumTab`, `PostsTab`, `MembersTab`), sub-views (`PostDetail`, `ThreadDetail`), `Button`.
- Data flow: Fetch club via `clubService.getById(clubId)`; local tab state synced with `useSearchParams`.
- Frequent methods:
  - `clubService.getById(id)` – fetch club details.
  - `joinClub(id)` / `leaveClub(id)` – toggle membership with optimistic UI.
- Notes: Determines membership from server data and profile memberships; maintains `activeTab` in URL params.

Tabs within ClubDetail:
- AboutTab (`components/AboutTab.tsx`)
  - Shows and (for admins) edits club metadata.
  - Methods: `updateClub(id, data)`, `updateAvatar(id, file)`.
- EventsTab (`components/EventsTab.tsx`)
  - Mini-calendar, event list, CRUD, join, CSV export of attendees.
  - Methods: `createEvent`, `updateEvent`, `deleteEvent`, `joinEvent`.
- ForumTab (`components/ForumTab.tsx`)
  - Thread creation and server-backed listing with pagination.
  - Fetches fresh threads when the tab mounts (offset=0, limit=10), then supports Load More via `ClubService.listThreadsPage`.
  - Methods: `createThread(clubId, title, content)`, `listThreadsPage(clubId, offset, limit)`.
- PostsTab (`components/PostsTab.tsx`)
  - Composer + list with like, comment (opens detail), share, bookmark.
  - Infinite scroll using an `IntersectionObserver` sentinel; loads pages of 10 via `ClubService.listPostsPage`.
  - Role restriction: only `ADMIN` and `MODERATOR` can create posts in a club.
  - Images: attach a single `picture` (multipart) up to 100MB; rendered responsively in lists and detail.
  - Methods: `createPost`, `likePost`, `unlikePost`; bookmarks via `bookmarksService.add/remove`.
- MembersTab (`components/MembersTab.tsx`)
  - Grid/list views, search, role management for admins.
  - Methods: `updateMemberRole(clubId, memberId, role)`.

Sub-views:
- PostDetail (`components/PostDetail.tsx`)
  - Dedicated post page: loads comments, allows adding comments and liking/unliking comments.
  - Comment authors are structured as `{ id, username, avatar }`.
  - Methods: `listCommentsPage(postId, offset, limit)`, `addComment(postId, content)`, `likeComment(commentId)`, `unlikeComment(commentId)`.
  - Pagination: Load more comments via `GET /api/posts/{postId}/comments?offset=&limit=`.
- ThreadDetail (`components/ThreadDetail.tsx`)
  - Dedicated forum thread view displaying replies; includes share popup and voting.
  - Replies are fetched from the backend with pagination: `GET /api/threads/{threadId}/replies?offset=&limit=`.
  - Posting a reply: `POST /api/threads/{threadId}/replies`; replies and threads are sorted by score (upvotes − downvotes).
  - Voting: upvote/downvote with mutual exclusion on threads and replies.

### MyClubsPage (`src/features/clubs/pages/MyClubsPage.tsx`)
- Purpose: List of user’s joined clubs with Leave action; create new club modal.
- Composition: `Button`, `ProcessingBox`, local create form (name, description, avatar, etc.).
- Data flow: Pulls membership from `useProfile`; fetches each club via `clubService.getById`.
- Frequent methods: `leaveClub`, `createClub`, `updateAvatar`.
- Notes: Uses optimistic updates and refreshes profile after changes.

## Profile

### ProfilePage (`src/features/profile/pages/ProfilePage.tsx`)
- Purpose: Current user profile with inline editing and avatar upload.
- Composition: `Button`, inputs, image upload overlay.
- Data flow: `useProfile` for `user`, `updateUser`, `updateAvatar`.
- Frequent methods: `profileService.updateCurrent(id, partial)`, `profileService.updateAvatar(id, file)` through the hook.
- Notes: Uses `Subject` and `Preference` enums; click-outside handling for dropdowns; trims user name on save.

### UserProfilePage (`src/features/profile/pages/UserProfilePage.tsx`)
- Purpose: Read-only view of another user’s profile.
- Data flow: `profileService.getById(userId)` and local state.
- Notes: Simple loading state and helper to format enums.

## Feed

### FeedPage (`src/features/feed/pages/FeedPage.tsx`)
- Purpose: Infinite feed combining upcoming events and recent posts. Tabbed view toggles between Events and Posts.
- Composition: `Avatar`, `SharePopup`, `Toast`, `Button`, intersection observer sentinel for infinite scroll.
- Data flow: `feedService.getPage(offset, limit)` normalizes varying responses; integrates with `bookmarksService` and selected `clubService` actions.
- Frequent methods:
  - `feedService.getPage(offset, limit)` – fetch feed items (offset/limit), normalized to an array.
  - Post actions: `clubService.likePost(id)`, `clubService.unlikePost(id)`.
  - Bookmarks: `bookmarksService.add(id)`, `bookmarksService.remove(id)`.
  - Events: `clubService.joinEvent(clubId, eventId)`.
- Notes: Maintains sets for bookmarks and joined events; optimistic updates with error rollback; share URL generation.

## Common Page Patterns

- Services + Mappers: All network work happens in services; UI uses mapped models.
- Optimistic UI: Like/join/bookmark actions update state first, rollback on error.
- Error Handling: Catch `ApiError` and show user-friendly messages via inline text or `Toast`.
- Loading: Show spinners (`Loader2`) and/or skeletons while fetching.
- Routing: Use `Navigate` and `useNavigate`; guard protected routes via `RequireAuth`.
- URL State: Store tab or filter state in URL (`useSearchParams`) when it benefits deep linking.
- File Uploads: For avatars, `Content-Type: application/octet-stream` with raw blob. For post pictures, use multipart `FormData` with field `picture`.

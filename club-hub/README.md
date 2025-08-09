# ClubHub Application

This directory contains the source code for the ClubHub web application built with React, TypeScript and Tailwind CSS.

## Architecture Overview
- **Routes** in `src/routes` map URL paths to pages using React Router.
- **Features** in `src/features` bundle pages, components, hooks and services for each domain (e.g. clubs, feed, profile, notifications, admin).
- **Services** under `src/services` provide a thin API layer for HTTP requests.
- **Layouts** in `src/layouts` supply shared page shells.
- Shared UI building blocks live in `src/components`.

### Main Modules
- `auth` – user sign in and registration flows
- `profile` – profile viewing and editing
- `clubs` – club discovery and detail pages
- `feed` – aggregate updates from followed clubs
- `bookmarks` – saved items for quick access
- `notifications` – alerts about activity
- `admin` – management tools for club content
- `settings` and `support` – account preferences and help resources

## Key Functionality
- User authentication and profile management
- Browse clubs and view a personalized feed
- Bookmark content and receive notifications
- Administrative tools for managing club content

## Available Scripts

```bash
npm start        # run the development server
npm test         # execute the test suite
npm run build    # create a production build
```

Refer to the repository root README for additional details.

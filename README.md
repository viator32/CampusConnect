# ClubHub Backend

Backend service for ClubHub built with [Quarkus](https://quarkus.io/).

## Setup and Running

### Requirements

- Docker and Docker Compose
- Java 21 (if running without Docker)

### Environment configuration

Copy the example environment file and set a secret pepper used for password hashing:

```bash
cp .env.example .env
```

Edit `.env` and replace the placeholder value:

```bash
AUTH_PEPPER=CHANGE_ME
```

### Start with Docker

```bash
docker compose up --build
```

The API will be available at <http://localhost:8080>.

### Development mode

Alternatively, start the application directly (requires a running PostgreSQL instance):

```bash
./mvnw quarkus:dev
```

### Database migrations

Schema changes are managed with [Flyway](https://flywaydb.org/). Migration scripts
reside in `src/main/resources/db/migration` and are executed automatically on
application startup. When modifying the database schema, create a new migration
script following the `V<version>__description.sql` naming convention.

## Roles and Permissions

Each club member is assigned one of the following roles, which determine what actions are allowed inside a club:

- **Member** – Default role for new members. Can view club content, create posts and comments, interact with posts (like, share, bookmark) and comments (like), update or delete only their own posts and comments, and join events. Members cannot create, update or delete events, and they cannot modify other members' roles.
- **Moderator** – Inherits all member abilities and can additionally create, update and delete events, update or delete any post, and delete any comment.
- **Admin** – Highest privilege level. In addition to moderator capabilities, admins can change the roles of other members. At least one admin must remain in every club.

## API Endpoints

Unless noted otherwise, requests require an `Authorization: Bearer <token>` header.

### Authentication

- **Register** – `POST /api/auth/register` (201 Created)

  ```bash
  curl -X POST http://localhost:8080/api/auth/register \
       -H "Content-Type: application/json" \
       -d '{"email":"user@study.thws.de","username":"alice","password":"secret"}'
  ```

- **Login** – `POST /api/auth/login` (200 OK)

  ```bash
  curl -X POST http://localhost:8080/api/auth/login \
       -H "Content-Type: application/json" \
       -d '{"email":"user@study.thws.de","password":"secret"}'
  ```

- **Refresh token** – `POST /api/auth/refresh` (200 OK)

  ```bash
  curl -X POST http://localhost:8080/api/auth/refresh \
       -H "Content-Type: application/json" \
       -d '{"token":"<jwt>"}'
  ```

- **Logout** – `POST /api/auth/logout` (200 OK)

  ```bash
  curl -X POST http://localhost:8080/api/auth/logout \
       -H "Content-Type: application/json" \
       -d '{"token":"<jwt>"}'
  ```

### Users

- **List users** – `GET /api/users` (200 OK)

  ```bash
  curl -H "Authorization: Bearer <token>" http://localhost:8080/api/users
  ```

- **Get current user** – `GET /api/users/me` (200 OK)

  ```bash
  curl -H "Authorization: Bearer <token>" \
       http://localhost:8080/api/users/me
  ```

- **Get user** – `GET /api/users/{id}` (200 OK)

  ```bash
  curl -H "Authorization: Bearer <token>" \
       http://localhost:8080/api/users/<userId>
  ```

- **Update user profile** – `PUT /api/users/{id}` (200 OK)

  ```bash
  curl -X PUT http://localhost:8080/api/users/<userId> \\
       -H "Content-Type: application/json" \\
       -H "Authorization: Bearer <token>" \\
       -d '{"username":"newName","description":"New bio","preferences":["PROGRAMMING","MUSIC"],"subject":"COMPUTER_SCIENCE"}'
  ```

  The `preferences` field accepts an array of values from the `Preference` enum.

- **Update user avatar** – `PUT /api/users/{id}/avatar` (200 OK)

  ```bash
  curl -X PUT http://localhost:8080/api/users/<userId>/avatar \\
       -H "Authorization: Bearer <token>" \\
       -H "Content-Type: application/octet-stream" \\
       --data-binary "@avatar.png"
  ```

  The endpoint expects raw image bytes in the request body. Avatars are returned as Base64-encoded strings in user profiles.

- **Change password** – `PUT /api/users/{id}/password` (200 OK)

  ```bash
  curl -X PUT http://localhost:8080/api/users/<userId>/password \
       -H "Content-Type: application/json" \
       -H "Authorization: Bearer <token>" \
       -d '{"currentPassword":"oldSecret","newPassword":"newSecret"}'
  ```

- **Delete user** – `DELETE /api/users/{id}` (200 OK)

  ```bash
  curl -X DELETE -H "Authorization: Bearer <token>" \
       http://localhost:8080/api/users/<userId>
  ```

### Clubs

- **List clubs** – `GET /api/clubs` (200 OK)

  ```bash
  curl http://localhost:8080/api/clubs
  ```

- **Get club** – `GET /api/clubs/{id}` (200 OK)

  ```bash
  curl -H "Authorization: Bearer <token>" \
       http://localhost:8080/api/clubs/<clubId>
  ```

- **Create club** – `POST /api/clubs` (201 Created)

  ```bash
  curl -X POST http://localhost:8080/api/clubs \
       -H "Content-Type: application/json" \
       -H "Authorization: Bearer <token>" \
       -d '{"name":"Chess Club","description":"Play chess","category":"Games","image":""}'
  ```

- **Update club** – `PUT /api/clubs/{id}` (200 OK)

  ```bash
  curl -X PUT http://localhost:8080/api/clubs/<clubId> \
       -H "Content-Type: application/json" \
       -H "Authorization: Bearer <token>" \
       -d '{"description":"Updated description"}'
  ```

- **Update club avatar** – `PUT /api/clubs/{id}/avatar` (200 OK)

  ```bash
  curl -X PUT http://localhost:8080/api/clubs/<clubId>/avatar \
       -H "Authorization: Bearer <token>" \
       --data-binary "@avatar.png"
  ```

- **Delete club** – `DELETE /api/clubs/{id}` (200 OK)

  ```bash
  curl -X DELETE -H "Authorization: Bearer <token>" \
       http://localhost:8080/api/clubs/<clubId>
  ```

- **Join club** – `POST /api/clubs/{clubId}/join` (200 OK)

  ```bash
  curl -X POST -H "Authorization: Bearer <token>" \
       http://localhost:8080/api/clubs/<clubId>/join
  ```

- **Leave club** – `POST /api/clubs/{clubId}/leave` (200 OK)

  ```bash
  curl -X POST -H "Authorization: Bearer <token>" \
       http://localhost:8080/api/clubs/<clubId>/leave
  ```

- **Update member role** – `PUT /api/clubs/{clubId}/members/{memberId}/role` (200 OK)

  ```bash
  curl -X PUT http://localhost:8080/api/clubs/<clubId>/members/<memberId>/role \
       -H "Content-Type: application/json" \
       -H "Authorization: Bearer <token>" \
       -d '{"role":"ADMIN"}'
  ```

- **List posts of a club** – `GET /api/clubs/{clubId}/posts` (200 OK)

  ```bash
  curl -H "Authorization: Bearer <token>" \
       http://localhost:8080/api/clubs/<clubId>/posts
  ```

- **Create post in a club** – `POST /api/clubs/{clubId}/posts` (201 Created)

  ```bash
  curl -X POST http://localhost:8080/api/clubs/<clubId>/posts \
       -H "Content-Type: application/json" \
       -H "Authorization: Bearer <token>" \
       -d '{"content":"Hello Club!"}'
  ```

- **Update post in a club** – `PUT /api/clubs/{clubId}/posts/{postId}` (200 OK)

  ```bash
  curl -X PUT http://localhost:8080/api/clubs/<clubId>/posts/<postId> \
       -H "Content-Type: application/json" \
       -H "Authorization: Bearer <token>" \
       -d '{"content":"Updated content"}'
  ```

- **Delete post in a club** – `DELETE /api/clubs/{clubId}/posts/{postId}` (200 OK)

  ```bash
  curl -X DELETE -H "Authorization: Bearer <token>" \
       http://localhost:8080/api/clubs/<clubId>/posts/<postId>
  ```

### Events

Events have a `status` field with values `SCHEDULED`, `COMPLETED`, or `CANCELLED`.

- **List events of a club** – `GET /api/clubs/{clubId}/events` (200 OK)

  ```bash
  curl -H "Authorization: Bearer <token>" \
       http://localhost:8080/api/clubs/<clubId>/events
  ```

- **Create event in a club** – `POST /api/clubs/{clubId}/events` (201 Created)

  ```bash
  curl -X POST http://localhost:8080/api/clubs/<clubId>/events \
       -H "Content-Type: application/json" \
       -H "Authorization: Bearer <token>" \
       -d '{"title":"Kickoff","description":"Season start","date":"2024-05-01","time":"18:00"}'
  ```

- **Update event in a club** – `PUT /api/clubs/{clubId}/events/{eventId}` (200 OK)

  ```bash
  curl -X PUT http://localhost:8080/api/clubs/<clubId>/events/<eventId> \
       -H "Content-Type: application/json" \
       -H "Authorization: Bearer <token>" \
       -d '{"title":"Kickoff","description":"Season start","date":"2024-05-01","time":"19:00"}'
  ```

- **Delete event** – `DELETE /api/clubs/{clubId}/events/{eventId}` (200 OK)

  ```bash
  curl -X DELETE -H "Authorization: Bearer <token>" \
       http://localhost:8080/api/clubs/<clubId>/events/<eventId>
  ```

 - **Join event** – `POST /api/clubs/{clubId}/events/{eventId}/join` (200 OK)

  ```bash
  curl -X POST http://localhost:8080/api/clubs/<clubId>/events/<eventId>/join \
       -H "Authorization: Bearer <token>"
  ```

 - **Get single event of a club** – `GET /api/clubs/{clubId}/events/{eventId}` (200 OK)

  ```bash
  curl -H "Authorization: Bearer <token>" \
       http://localhost:8080/api/clubs/<clubId>/events/<eventId>
  ```

 - **Get event** – `GET /api/events/{eventId}` (200 OK)

  ```bash
  curl -H "Authorization: Bearer <token>" \
       http://localhost:8080/api/events/<eventId>
  ```

 - **Download event attendees (CSV)** – `GET /api/events/{eventId}/attendees/csv` (200 OK)

  ```bash
  curl -H "Authorization: Bearer <token>" \
       http://localhost:8080/api/events/<eventId>/attendees/csv
  ```

### Comments

- **List comments of a post** – `GET /api/posts/{postId}/comments` (200 OK)

  ```bash
  curl -H "Authorization: Bearer <token>" \
       http://localhost:8080/api/posts/<postId>/comments
  ```

- **Add comment to a post** – `POST /api/posts/{postId}/comments` (201 Created)

  ```bash
  curl -X POST http://localhost:8080/api/posts/<postId>/comments \
       -H "Content-Type: application/json" \
       -H "Authorization: Bearer <token>" \
       -d '{"content":"Nice post!"}'
  ```

- **Like comment** – `POST /api/comments/{commentId}/like` (200 OK)

  ```bash
  curl -X POST http://localhost:8080/api/comments/<commentId>/like \
       -H "Authorization: Bearer <token>"
  ```

- **Unlike comment** – `DELETE /api/comments/{commentId}/like` (200 OK)

  ```bash
  curl -X DELETE http://localhost:8080/api/comments/<commentId>/like \
       -H "Authorization: Bearer <token>"
  ```

### Feed

- **Get feed** – `GET /api/feed` (200 OK)

  ```bash
  curl -H "Authorization: Bearer <token>" \
       "http://localhost:8080/api/feed?page=0&size=10"
  ```
  Returns posts and events from clubs the user follows. Pagination is controlled
  via `page` (default `0`) and `size` (default `10`) query parameters.

### Posts

- **Get post** – `GET /api/posts/{postId}` (200 OK)

  ```bash
  curl -H "Authorization: Bearer <token>" \
       http://localhost:8080/api/posts/<postId>
  ```

- **List bookmarked posts** – `GET /api/posts/bookmarks` (200 OK)

  ```bash
  curl -H "Authorization: Bearer <token>" \
       http://localhost:8080/api/posts/bookmarks
  ```

### Post actions

- **Like post** – `POST /api/posts/{postId}/like` (200 OK)

  ```bash
  curl -X POST http://localhost:8080/api/posts/<postId>/like \
       -H "Authorization: Bearer <token>"
  ```

- **Unlike post** – `DELETE /api/posts/{postId}/like` (200 OK)

  ```bash
  curl -X DELETE http://localhost:8080/api/posts/<postId>/like \
       -H "Authorization: Bearer <token>"
  ```

- **Bookmark post** – `POST /api/posts/{postId}/bookmark` (200 OK)

  ```bash
  curl -X POST http://localhost:8080/api/posts/<postId>/bookmark \
       -H "Authorization: Bearer <token>"
  ```

- **Share post** – `POST /api/posts/{postId}/share` (200 OK)

  ```bash
  curl -X POST http://localhost:8080/api/posts/<postId>/share \
       -H "Authorization: Bearer <token>"
  ```

## Error Codes

All API errors return a structured JSON payload. A typical error looks like:

```json
{
  "errorCode": "CLB-00-0000-0001",
  "title": "User not found",
  "details": "The specified user does not exist",
  "messageParameters": {
    "userId": "123"
  },
  "sourcePointer": "/api/users/123"
}
```

The `errorCode` format is `CLB-XX-XXXX-XXXX` where `CLB` identifies the ClubHub module.
The following codes are currently in use:

| Code | HTTP Status | Meaning |
|------|-------------|---------|
| `CLB-00-0000-0001` | 404 Not Found | User not found |
| `CLB-00-0000-0002` | 404 Not Found | Club not found |
| `CLB-00-0000-0003` | 404 Not Found | Post not found |
| `CLB-00-0000-0004` | 400 Bad Request | User is not a member of the club |
| `CLB-00-0000-0005` | 400 Bad Request | User is already a member of the club |
| `CLB-00-0000-0006` | 400 Bad Request | Invalid credentials provided |
| `CLB-00-0000-0007` | 404 Not Found | Comment not found |
| `CLB-00-0000-0008` | 404 Not Found | Event not found |
| `CLB-00-0000-0009` | 400 Bad Request | User already exists |
| `CLB-00-0000-0010` | 404 Not Found | Member not found |
| `CLB-00-0000-0011` | 403 Forbidden | Insufficient permissions |
| `CLB-00-0000-0012` | 400 Bad Request | Last admin cannot leave |
| `CLB-00-0000-0013` | 400 Bad Request | Last admin cannot change own role |
| `CLB-00-0000-0014` | 401 Unauthorized | Invalid or expired token |

The `title` gives a brief summary while `details` can contain a human-readable
description. `messageParameters` provides contextual values, and `sourcePointer`
points to the request element that caused the error.


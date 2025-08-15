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

## API Endpoints

Unless noted otherwise, requests require an `Authorization: Bearer <token>` header.

### Authentication

- **Register** – `POST /api/auth/register`

  ```bash
  curl -X POST http://localhost:8080/api/auth/register \
       -H "Content-Type: application/json" \
       -d '{"email":"user@study.thws.de","username":"alice","studentId":"123456","password":"secret"}'
  ```

- **Login** – `POST /api/auth/login`

  ```bash
  curl -X POST http://localhost:8080/api/auth/login \
       -H "Content-Type: application/json" \
       -d '{"email":"user@study.thws.de","password":"secret"}'
  ```

- **Refresh token** – `POST /api/auth/refresh`

  ```bash
  curl -X POST http://localhost:8080/api/auth/refresh \
       -H "Content-Type: application/json" \
       -d '{"token":"<jwt>"}'
  ```

### Users

- **List users** – `GET /api/users`

  ```bash
  curl -H "Authorization: Bearer <token>" http://localhost:8080/api/users
  ```

- **Get user** – `GET /api/users/{id}`

  ```bash
  curl -H "Authorization: Bearer <token>" \
       http://localhost:8080/api/users/<userId>
  ```

- **Update user** – `PUT /api/users/{id}`

  ```bash
  curl -X PUT http://localhost:8080/api/users/<userId> \
       -H "Content-Type: application/json" \
       -H "Authorization: Bearer <token>" \
       -d '{"username":"newName"}'
  ```

- **Delete user** – `DELETE /api/users/{id}`

  ```bash
  curl -X DELETE -H "Authorization: Bearer <token>" \
       http://localhost:8080/api/users/<userId>
  ```

### Clubs

- **List clubs** – `GET /api/clubs`

  ```bash
  curl http://localhost:8080/api/clubs
  ```

- **Get club** – `GET /api/clubs/{id}`

  ```bash
  curl -H "Authorization: Bearer <token>" \
       http://localhost:8080/api/clubs/<clubId>
  ```

- **Create club** – `POST /api/clubs`

  ```bash
  curl -X POST http://localhost:8080/api/clubs \
       -H "Content-Type: application/json" \
       -H "Authorization: Bearer <token>" \
       -d '{"name":"Chess Club","description":"Play chess","category":"Games","image":""}'
  ```

- **Update club** – `PUT /api/clubs/{id}`

  ```bash
  curl -X PUT http://localhost:8080/api/clubs/<clubId> \
       -H "Content-Type: application/json" \
       -H "Authorization: Bearer <token>" \
       -d '{"description":"Updated description"}'
  ```

- **Delete club** – `DELETE /api/clubs/{id}`

  ```bash
  curl -X DELETE -H "Authorization: Bearer <token>" \
       http://localhost:8080/api/clubs/<clubId>
  ```

- **Join club** – `POST /api/clubs/{clubId}/join`

  ```bash
  curl -X POST -H "Authorization: Bearer <token>" \
       http://localhost:8080/api/clubs/<clubId>/join
  ```

- **List posts of a club** – `GET /api/clubs/{clubId}/posts`

  ```bash
  curl -H "Authorization: Bearer <token>" \
       http://localhost:8080/api/clubs/<clubId>/posts
  ```

- **Create post in a club** – `POST /api/clubs/{clubId}/posts`

  ```bash
  curl -X POST http://localhost:8080/api/clubs/<clubId>/posts \
       -H "Content-Type: application/json" \
       -H "Authorization: Bearer <token>" \
       -d '{"content":"Hello Club!"}'
  ```

### Events

- **List events of a club** – `GET /api/clubs/{clubId}/events`

  ```bash
  curl -H "Authorization: Bearer <token>" \
       http://localhost:8080/api/clubs/<clubId>/events
  ```

- **Create event in a club** – `POST /api/clubs/{clubId}/events`

  ```bash
  curl -X POST http://localhost:8080/api/clubs/<clubId>/events \
       -H "Content-Type: application/json" \
       -H "Authorization: Bearer <token>" \
       -d '{"title":"Kickoff","description":"Season start","date":"2024-05-01","time":"18:00"}'
  ```

### Comments

- **List comments of a post** – `GET /api/posts/{postId}/comments`

  ```bash
  curl -H "Authorization: Bearer <token>" \
       http://localhost:8080/api/posts/<postId>/comments
  ```

- **Add comment to a post** – `POST /api/posts/{postId}/comments`

  ```bash
  curl -X POST http://localhost:8080/api/posts/<postId>/comments \
       -H "Content-Type: application/json" \
       -H "Authorization: Bearer <token>" \
       -d '{"content":"Nice post!"}'
  ```

- **Like comment** – `POST /api/comments/{commentId}/like`

  ```bash
  curl -X POST http://localhost:8080/api/comments/<commentId>/like \
       -H "Authorization: Bearer <token>"
  ```

### Feed

- **Get feed** – `GET /api/feed`

  ```bash
  curl -H "Authorization: Bearer <token>" \
       "http://localhost:8080/api/feed?page=0&size=10"
  ```
  Returns posts and events from clubs the user follows. Pagination is controlled
  via `page` (default `0`) and `size` (default `10`) query parameters.

### Post actions

- **Like post** – `POST /api/posts/{postId}/like`

  ```bash
  curl -X POST http://localhost:8080/api/posts/<postId>/like \
       -H "Authorization: Bearer <token>"
  ```

- **Bookmark post** – `POST /api/posts/{postId}/bookmark`

  ```bash
  curl -X POST http://localhost:8080/api/posts/<postId>/bookmark \
       -H "Authorization: Bearer <token>"
  ```

- **Share post** – `POST /api/posts/{postId}/share`

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

| Code | Meaning |
|------|---------|
| `CLB-00-0000-0001` | User not found |
| `CLB-00-0000-0002` | Club not found |
| `CLB-00-0000-0003` | Post not found |
| `CLB-00-0000-0004` | User is not a member of the club |
| `CLB-00-0000-0005` | User is already a member of the club |
| `CLB-00-0000-0006` | Invalid credentials provided |
| `CLB-00-0000-0007` | Comment not found |
| `CLB-00-0000-0008` | Event not found |
| `CLB-00-0000-0009` | User already exists |

The `title` gives a brief summary while `details` can contain a human-readable
description. `messageParameters` provides contextual values, and `sourcePointer`
points to the request element that caused the error.


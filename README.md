### SharePlay Backend App

- to fix vercel api deployment, move the package.json file to src/

## Auth Routes

root: /api/auth

/signup
/signin
/google

# User Routes

root: /api/users

/users/:id (PUT method)
/users/:id (DELETE method)
/users/find/:id (GET method)
/users/sub/:id (PUT method)
/users/unsub/:id (PUT method)
/users/like/:videoId (PUT method)
/users/dislike/:videoId (PUT method)

# Video Routes

root: /api/videos

POST /videos
PUT /videos/:id
DELETE /videos/:id
GET /videos/find/:id
PUT /videos/view/:id
GET /videos/trend
GET /videos/random
GET /videos/sub
GET /videos/tags
GET /videos/search

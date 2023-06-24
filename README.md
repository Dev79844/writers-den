# Writer's Den 

This repo contains the backend code for a blog application with user authentication and authorization using cookies.
A user can create articles, read them, update and delete the article. A user can view and follow other users and favourite and unfavourite articles. Also user can add comments to articles and delete those comments.

## Technologies used:
- NodeJS
- ExpressJS
- MongoDB
- Mongoose
- Docker

## API endpoints
- POST `/api/users` - Register User
- POST `/api/users/login` - Login
- GET `/api/user` - Get logged in user
- PUT `/api/user` - Update the logged in user
- GET `/api/profiles/:username` - Get profile
- POST `/api/profiles/:username/follow` - Follow a user
- DELETE `/api/profiles/:username/follow` - Unfollow a user
- GET `/api/articles` - Get list of articles
- GET `/api/articles/feed` - Get articles of the users you follow
- GET `/api/articles/:slug` - Get a article
- POST `/api/articles` - Add an article
- PUT `/api/articles/:slug` - Update an article
- DELETE `/api/articles/:slug` - Delete an article
- POST `/api/articles/:slug/comments` - Add comments to an article
- GET `/api/articles/:slug/comments` - Get comments from an article
- DELETE `/api/articles/:slug/comments/:id` - Delete a comment
- POST `/api/articles/:slug/favorite` - Favourite an article
- DELETE `/api/articles/:slug/favorite` - Unfavourite an article
- GET `/api/tags` - Get all distinct tags

## Installation and Set Up
- Using docker
  ```bash
  # clone the repo
  git clone https://github.com/Dev79844/automatiks-backend.git

  # run the command to start the application. -d will start application in detached mode
  docker compose up -d
  ```
- Without docker
  ```bash
  # clone the repo
  git clone https://github.com/Dev79844/automatiks-backend.git
  
  # install all the dependencies
  npm install
  
  # copy .env.example to .env and enter all the details
  cp .env.example .env
  
  # start the server
  npm run start
  ```



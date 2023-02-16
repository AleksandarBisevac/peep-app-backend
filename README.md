### Folder structure

Monolithic app.

- src - all our app codes is inside src folder
  - app.ts - entry file for our application
  - config.ts - configuration file for our application
  - routes.ts - definition for all the routes inside the application
  - setupDatabase.ts - setup for the mongodb (connecting to mongodb)
  - setupServer.ts - setup configuration for server (starting server, adding global handlers,...)
  - features - all decoupled logic resides inside this folder, parts of the business logic, and each feature contains next:
    - controller
    - interfaces
    - models
    - routes
  - shared - all the code that is reusable and shared across the all application
    - globals - helper files and folders inside here
    - services - everything related to the DB is inside the services
      - db - contains code related to the connecting to the DB
      - queues - code related to the queues is inside this folder
      - emails - email service
      - redis - caching logic for redis service
    - socket - socket.io implementation goes here
    - workers - configure workers for services, like redis and message queue

#### packages for the security and standard middleware

- cors / security middleware
- helmet / security middleware
- hpp / security middleware
- cookie-session / standard middleware
- compression / standard middleware
- express-async-errors / middleware for catching async errors
- http-status-codes

npm i cors helmet hpp cookie-session compression express-async-errors http-status-codes

#### packages for the dev env

- nodemon
- ts-node
- tsconfig-paths / gives as possibility to use named relative paths

#### mongodb packages

- mongoose

#### socket io packages

- @socket.io/redis-adapter / allows to broadcast events between several Socket.IO servers
- socket.io
- redis

#### logger package

- bunyan

#### ESLINT packages

- eslint
- eslint-config-prettier
- @typescript-eslint/eslint-plugin
- @typescript-eslint/parser

#### transform paths packages

- ttypescript // helps us to build the app (because of the changed paths)
- typescript-transform-paths // help us to transform the paths after the build to normal absolute paths (reverse process)

#### file storage

- we use cloudinary to store our files (images)
- use "cloudinary" package ( npm i cloudinary )

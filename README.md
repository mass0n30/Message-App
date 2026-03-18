# PERN-Starter-Template
Starter template, using PERN stack, keeping backend and frontend in seperate directories. 
Real Time messaging using websockets in the context of using React: https://ably.com/blog/websockets-react-tutorial 

Bugs: 
  - Chatroom messages not updating upon refresh after signed user sends message?
  - time tag in messages with absolute position overlays on avatar, flex avatar at top?
  - refresh 404s on deployment 

ToDo:
  - debug image dm route
  - add Global/Saved Rooms/Explore Rooms sidebar toggle
  - add Global displays main room and created users
  - created users add search bar
  - add profile img for users and rooms (clean default icons)
    *clear all tables local and deployed (prevent any issues)
    *! update prisma schema (update deployed DATABASE_URL as well)
  - position fix message send box bottom of chat bodys
    * enlarge input and button across container
  - Real time messaging ?


Done:
 - Plan Feautures (user settings, board rooms, ect)
  - Online Status, Profile data, Icon Picture, Friends
 - Plan API Routes (following REST)
 - Plan Router Routes and start making Pages (setting appropiate children and parents)
 - Update Prisma Schema
  - User(status, profile data, cloudify picture link?, Friends[])
 - Setup Tests to test API Routes
  - setup Guest logic
  - add banners for guest features
  Display UserFriend (who we added) all Friends under Friends in message box
  Display Pending messages for users not added under Friends in message box
  - create message in update
  - return updated messages like userProfile

  - add user messages tab in nav (amount of new messages, *default message for signing up)
  - add popup module for message directs (toggling on parent component)
  - display messages with time stamp

BACKEND directory:

Commands:
Commands in BACKEND directory!
npm install (installs all dependencies found in package.json)

npm install supertest --save-dev (for testing) (scripts in package.json)


PRISMA:
npm install prisma --save-dev
npm install @prisma/client
npx prisma init  (makes prisma folder)
npm install @quixo3/prisma-session-store  https://github.com/kleydon/prisma-session-store#readme   (set up Session Model in Prisma) 


npx prisma generate (after making schema)
npx prisma migrate dev (after making changes to schema)
 ----------------------------------------------------------------------
FRONTEND directory:

Design: Keep CSS inline or modular

npm install - sets up all node modules (installs all dependencies)

npm run dev - starts vite server

If using React to setup up default frontend directory run: 
npm create vite@latest . -- --template react


This template uses Prisma ORM supporting PostgreSQL. 
Prisma Setup Guide: https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-node-postgresql 
or use quick commands: 
 ---> npx prisma init  (then after adding DATABASE_URL to .env)  ---> npx prisma migrate dev --name init  ---> npx prisma generate

Don't forget to setup .env where variables such as DATABASE_URL(where data is being served) will go
.gitignore has .env and /generated/schema to ignore from public 

Using PostMan Web Agent (for full API functionality): https://learning.postman.com/docs/getting-started/installation/installation-and-updates/#install-postman-on-linux   (after installing with snap command, just run 'postman' as a command to launch)

npm install -g nodemon --live view? 

Linter & Prettier Commands
npm install --save-dev eslint
npx eslint --init   (Optional for configuration)  

Linting commands
- Run: npx eslint .
- Fix: npx eslint . --fix

Prettier commands
- npm install --save-dev prettier
- touch .prettierrc  (Optional config file for tab space, ect. )
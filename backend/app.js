require('dotenv').config();
const express = require('express');
const expressSession = require("express-session");
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('./generated/prisma/client');
const passport = require("passport");
require("./config/passport"); // booting strategy before any initializing
const pgPool = require("./config/pool");
const cors = require('cors');


const {indexRouter} = require('./routes/index');
const {signupRouter} = require('./routes/signup');
const {homeRouter} = require('./routes/home');

const app = express();
const server = createServer(app);

console.log('DATABASE_URL:', process.env.DATABASE_URL)


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  expressSession({
    cookie: {
     maxAge: 7 * 24 * 60 * 60 * 1000 // ms
    },
    secret: 'cats',
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
      new PrismaClient(),
      {
        pool: pgPool,
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);

app.use(passport.session());  //enables persistent login sessions

app.use('/', indexRouter);



app.use('/sign-up', signupRouter);

app.use('/home', homeRouter);

// all mount level routes below here require authentication for every request 
const profileRouter = require('./routes/profile').profileRouter;

app.use('/profile', passport.authenticate('jwt', { session: false }), profileRouter);  

const chatRouter = require('./routes/chats').chatRouter;

app.use('/chats', chatRouter);

const {friendDetailsRouter} = require('./routes/frienddetails');

app.use('/friends', passport.authenticate('jwt', { session: false }), friendDetailsRouter);  

app.post("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return res.status(400);
    } 
    res.status(200).json({ message: "Logged out successfully" });
  });
});

// app level error handler for client side from next(errors) in any route
app.use((err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || 'Something went wrong!',
  });
});



app.listen(5000, () => console.log('Server started on port 5000'));
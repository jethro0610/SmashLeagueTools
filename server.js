if (process.env.NODE_ENV !== 'production')
    require('dotenv').config({ path:'./.env.' + process.env.NODE_ENV});
    
const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const socketIO = require('socket.io');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const SocketManager = require('./socketprocesses/socketmanager');
const initFromMongo = require('./socketprocesses/smashgg').initFromMongo
require('./config/passport')(passport);

// Set CORS options
const corsOptions = {
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true
};

// Router requires
const usersRouter = require('./routes/users.js');
const authRouter = require('./routes/auth.js');
const tournamentRouter = require('./routes/tournament');

// Setup the express app
const app = express();
const port = process.env.PORT || 5000;
app.use(cors(corsOptions));
app.use(express.json());

// Setup session middleware
var sessionMiddleware = session({
    secret: process.env.SECRET_KEY,
    cookie: {
        maxAge: 60000 * 60 * 24
    },
    resave: false,
    saveUninitialized: false,
    name: 'discord-oauth2',
    store: MongoStore.create({
        mongoUrl: process.env.ATLAS_URI
    })
});
app.use(sessionMiddleware);

// Setup SocketIO
const http = require('http').createServer(app);
const io = socketIO(http, { 
    cors: corsOptions
});
var socketManager = new SocketManager(io, sessionMiddleware); // Create the socket manager with the new io

// Setup MongoDB connection
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { 
    useNewUrlParser: true, 
    useCreateIndex: true, 
    useFindAndModify: false});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Connected to MongoDB database');
    initFromMongo(); // Initalize the smash.gg manager upon connection
});

// Setup passport
app.use(passport.initialize());
app.use(passport.session());

// Wrapper for passport and SocketIO
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

// Router middleware
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/tournament', tournamentRouter);
app.use('/favicon.ico', express.static('./images/favicon.ico'));

// Route the fronted end when in non-development enviornment
if (process.env.NODE_ENV !== 'development') {
    app.use(express.static('client/build'));
    app.get('/*', function(req,res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

// Start listening on the given port
http.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});
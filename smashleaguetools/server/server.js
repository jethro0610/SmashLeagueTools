require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const socketIO = require('socket.io');
const session = require('express-session');
const passport = require('passport');
const SocketManager = require('./socketmanager');
require('./config/passport')(passport);

// Router requires
const usersRouter = require('./routes/users.js');
const authRouter = require('./routes/auth.js');

// Setup the express app
const app = express()
const port = process.env.PORT || 5000;
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(session({
    secret: process.env.SECRET_KEY,
    cookie: {
        maxAge: 60000 * 60 * 24
    },
    saveUninitialized: false,
    name: 'discord-oauth2'
}));

// Setup MongoDB connection
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Connected to MongoDB database');
});

// Setup passport
app.use(passport.initialize());
app.use(passport.session());

// Setup Socket.IO
const http = require('http').createServer(app);
const io = socketIO(http, { 
    cors: {
        origin: "http://localhost:3000"
    }
});
var socketManager = new SocketManager(io); // Create the socket manager with the new io

// Output the default server index
app.get('/', (req, res) => {
    return res.send('This is the server.');
});

// Router middleware
app.use('/users', usersRouter);
app.use('/auth', authRouter);

// Start listening on the given port
http.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});
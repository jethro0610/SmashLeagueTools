const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const socketIO = require('socket.io');
require('dotenv').config();

// Setup the express app
const app = express()
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// Setup MongoDB connection
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Connected to MongoDB database');
});

// Setup Socket.IO
const http = require('http').createServer(app);
const io = socketIO(http, { 
    cors: {
        origin: "*"
    }
});
require('./socketmanager')(io); // Use the socket manager with the newly create IO connection

// Output the default server index
app.get('/', (req, res) => {
    return res.end('This is the server.');
});

// User router
const usersRouter = require('./routes/users.js');
app.use('/users', usersRouter);

// Start listening on the given port
http.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});
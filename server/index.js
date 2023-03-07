const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = process.env.PORT || 3000;
const path = require("path");


app.use(express.static("../app"));

app.get('/', (req, res) => {
    const filePath = path.resolve(__dirname, '../app', 'index.html');
    res.sendFile(filePath);
});

io.on('connection', (socket) => {

    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg)
    })


    socket.on('typing', (username) => {
        socket.broadcast.emit('typing', `${username} is typing...`);
    });


    // Event to handle user stopped typing notifications
    socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing');
    });


    // Join a room based on user's input
    socket.on('join room', (roomName) => {
        socket.join(roomName); // Join the specified room
        console.log(`User ${socket.id} joined room ${roomName}`);
    });

    // Leave a room based on user's input
    socket.on('leave room', (roomName) => {
        socket.leave(roomName); // Leave the specified room
        console.log(`User ${socket.id} left room ${roomName}`);
    });

    // When a client sends a message
    socket.on('send message', (data) => {
        // Send the message to all clients in the same room
        io.to(data.room).emit('new message', {
            message: data.message.message,
            sender: data.message.sender
        });
    });

});


server.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});

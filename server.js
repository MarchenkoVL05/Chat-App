const express = require('express');
const app = express();

const http = require('http');
const cors = require('cors');

const { Server } = require('socket.io');

const port = process.env.PORT || 3001;

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join_room', (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on('send_message', (data) => {
        socket.to(data.roomID).emit('receive_message', data);
    });

    socket.on('disconnect', (socket) => {
        console.log('User disconnected:', socket.id);
    });
});

app.use(express.static(__dirname + "/build/"));

app.get(/.*/, function (req, res) {
    res.sendFile(__dirname + '/build/index.html');
});

server.listen(port, () => {
    console.log('Server is working :)');
});

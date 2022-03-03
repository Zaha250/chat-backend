const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const rooms = require("./db/rooms.js");
const io = new Server(server);
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoute');
const roomsRoutes = require('./routes/roomsRoutes');

const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/rooms', roomsRoutes);

io.on('connection', (socket) => {
    socket.on('join', ({roomId, userName}) => {
        socket.join(roomId);
        const users = rooms[roomId].users;
        users.push({id: socket.id, name: userName});

        socket.broadcast.to(roomId).emit('setUsers', users);
    });

    socket.on('newMessage', ({roomId, userName, content}) => {
        const messageContent = {userName, content};
        rooms[roomId].messages.push(messageContent);
        socket.broadcast.to(roomId).emit('sendMessage', messageContent);
    });

    socket.on('disconnect', (reason) => {
        Object.values(rooms).forEach(room => {
            const newRoom = {
                ...room,
                users: room.users.filter(user => user.id !== socket.id)
            };
            rooms[newRoom.id] = newRoom;
            socket.broadcast.to(newRoom.id).emit('setUsers', newRoom.users);
        });
    });
});

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    mongoose.connect('mongodb+srv://zaha250:alex@cluster0.jlc9c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', (error) => {
        if(error) {
            console.log('Error connected mongodb: ' + error);
        }
        console.log('Connected mongodb')
    })
});
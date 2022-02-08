const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const rooms = require("./db/rooms.js");
const io = new Server(server);

const PORT = process.env.PORT || 3001;

app.use(express.json());

app.post('/rooms', (req, res) => {
   const {roomId, userName} = req.body;
   if(!roomId || !userName) {
       return res.json({message: 'Не заполнено одно из полей'});
   }

   if(!rooms[roomId]) {
       rooms[roomId] = {
           id: roomId,
           users: [],
           messages: []
       }
   }
   res.json({message: 'ok', rooms})
});

app.get('/rooms/:id', (req, res) => {
   const {id: roomId} = req.params;
   if(rooms[roomId]) {
        const data = {users: rooms[roomId].users, messages: rooms[roomId].messages};
        res.json(data);
   } else {
       res.json({users: [], messages: []});
   }
});

io.on('connection', (socket) => {
    socket.on('join', ({roomId, userName}) => {
        socket.join(roomId);
        const users = rooms[roomId].users;
        // const users = Object.values(rooms).filter(room => room.id === roomId)[0].users;
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
});
const router = require('express').Router();
const rooms = require("../db/rooms.js");

router.post('/', (req, res) => {
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

router.get('/:id', (req, res) => {
    const {id: roomId} = req.params;
    if(rooms[roomId]) {
        const data = {users: rooms[roomId].users, messages: rooms[roomId].messages};
        res.json(data);
    } else {
        res.json({users: [], messages: []});
    }
});

module.exports = router;
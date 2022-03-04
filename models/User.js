const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    secondName: {
        type: String
    },
    photo: {
        type: String
    }
});

module.exports = mongoose.model('User', UserSchema);
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
    },

    balance: {
        type: Number,
        default: 0
    },

    profileImage: {
        type: String
    },

    isRidingBike: {
        type: Boolean,
        default: false,
    },

    bikes: [],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
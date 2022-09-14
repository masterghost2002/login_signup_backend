const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullName : {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    }
});

module.exports = mongoose.model('user', userSchema);
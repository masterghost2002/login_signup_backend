const mongoose = require('mongoose');
const Blog = require('./models/userModel');
mongoose.connect("URI");
const dataBase = mongoose.connection;
dataBase.on('error', console.error.bind("Connection With Datanbse Failed"));
dataBase.once('open', function(){
    console.log("Database Connected");
});

module.exports = dataBase;
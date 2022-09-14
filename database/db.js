const mongoose = require('mongoose');
const Blog = require('./models/userModel');
mongoose.connect("mongodb+srv://masterghost:R%40kesh050317@cluster0.npotuys.mongodb.net/monkey-site?retryWrites=true&w=majority");
const dataBase = mongoose.connection;
dataBase.on('error', console.error.bind("Connection With Datanbse Failed"));
dataBase.once('open', function(){
    console.log("Database Connected");
});

module.exports = dataBase;
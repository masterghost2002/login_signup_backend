const express = require('express');
require('./database/db');
const app = express();
const bodyParser = require('body-parser');
const usercredential = require('./routes/usercredential');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(usercredential);
app.listen(3000, (req, res)=>{
    console.log("Listening to port: 3000");
});
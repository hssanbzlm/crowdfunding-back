var express = require('express');
var app = express();
var db = require('./db/crowdFundingDB');
var passeport = require('./passeport');
var cors = require('cors');

app.use(cors());
var session = require("express-session"),
bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(session({ secret: "cats", saveUninitialized: true, resave: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passeport.initialize());
app.use(passeport.session());





var clientApi = require('./api/clientApi');
var adminApi = require('./api/adminApi');
var investorApi = require('./api/investorApi');
var userApi = require('./api/userApi');
var authApi = require('./api/authApi');
var feedbackApi = require('./api/feedbackApi');
var chatApi=require('./api/chatApi');
app.use('/client', clientApi)
app.use('/admin', adminApi)
app.use('/investor', investorApi)
app.use('/user', userApi);
app.use('/auth', authApi);
app.use('/feed', feedbackApi);
app.use('/chat',chatApi);

const server=app.listen(3000);



const io=require('socket.io')(server); 
io.on('connection',(socket)=>{ 

    console.log("a client is connected");  

    socket.on('message', (message) => {
        console.log(message);
         var d=Date.now(); 
        message.date=d;
        io.emit("message",message)
      });
    
    })

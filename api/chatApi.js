var express=require('express');
var router=express.Router();
var chat=require('../models/chatModel');
var message=require('../models/messageModel'); 
var user=require('../models/userModel');
var passport = require('passport');


router.get('/existChatClient/:idProject/:idClient',passport.authenticate('bearer'), (req,res)=>{ 
  
   chat.find({idProject:req.params.idProject,idClient:req.params.idClient}).populate('idInvestors').populate('idMessages').exec((err,ch)=>{
   
    if(err)
    res.send(err)
    res.send(ch[0])

  })  

}) 
 
router.get('/existChatInvestor/:idProject/:idInvestor',passport.authenticate('bearer'),(req,res)=>{ 
  
  chat.find({idProject:req.params.idProject,idInvestors:{$in:[req.params.idInvestor]}}).populate('idMessages').populate('idInvestors').exec((err,ch)=>{
   
    if(err)
    res.send(err)
    res.send(ch)

  })

}) 


router.post('/addMessage/:idChat',passport.authenticate('bearer'),(req,res)=>{

   var msg =new message(req.body);
   msg.save((err,ms)=>{
     if(err)
     res.send(err)
     if(ms){  
       chat.findByIdAndUpdate(req.params.idChat,{ $addToSet: { idMessages: ms._id}},(err,cht)=>{ 

        if(err)
        res.send(err) 
        res.send(msg)
       })
     }

   })

})


module.exports=router;
var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var user = require('../models/userModel');
var investor=require('../models/investorModel');
var setting = require('../models/settingsModel');
var project=require('../models/projectModel');
var passport = require('passport');
const jsonwebtoken = require('jsonwebtoken');
const secretKey = "SECRET";
var uuidv1 = require('uuid/v1');
var sendEmail = require('../sendEmail');  
var chat=require('../models/chatModel');


router.post('/registre', (req, res) => {
    var passPlainText = req.body.password;
    bcrypt.hash(passPlainText, 10, (err, hash) => {
        if (err)
            res.send(err);
        else {
            req.body.password = hash;
            req.body.state = "notactivated";
            var inv = new investor (req.body);
            inv.save((err, rslt) => {
                if (err) { res.send(err) }
                else {
                    usr = new user();
                    usr.email = req.body.email;
                    usr.password = hash;
                    usr.idInvestor = rslt._id;
                    usr.role = 'investor';
                    usr.state = 'notactivated';
                    usr.save((err, rslt) => {
                        if (err) { res.send(err); }
                        else {
                            set = new setting();
                            set.idUser = rslt._id;
                            set.code = uuidv1();
                            var emailHtml="http://localhost:4200/user/activation/"+set.code;
                            sendEmail(emailHtml,usr.email)
                            set.save((err, rslt) => {
                                if (err)
                                    res.send(err);
                                res.send(rslt);
                            })
                        }
                    })

                }

            })

        }
    })

})


router.get('/allProjects',passport.authenticate('bearer'),(req,res)=>{ 

project.find({},(err,prj)=>{
if(err)
res.send(err)
res.send(prj)

})

})

router.post('/invest/:idInvestor/:idProject',passport.authenticate('bearer'),(req,res)=>{   

    project.findByIdAndUpdate(req.params.idProject,req.body,(err,pr)=>{
        if(err)
        res.send(err)
        if(pr)
        { //add project to innvestor
        investor.findByIdAndUpdate(req.params.idInvestor,{$addToSet:{project:req.params.idProject}},{new:true},(err,inv)=>{
         if(err)
         res.send(err)
         if(inv) 
         {   //find the id of the client
            user.find({projects:{$in:[req.params.idProject]}},(err,usr)=>{
             if(err)
             res.send(err)
             if(usr[0]) 
             {  //we create the chat after we find the id of the client  
                chat.find({idClient:usr[0].idClient,idProject:req.params.idProject},(err,c)=>{ 
                    if(err)
                    res.send(err)
                    if(Object.keys(c).length!=0) //the client already has a discussion with other investor(s)
                    {  
                        chat.findByIdAndUpdate(c[0]._id,{ $addToSet: { idInvestors: req.params.idInvestor}},(err,cht)=>{
                        if(err)
                        res.send(err)
                        res.send(cht);
                        })

                    }  
                    else 
                    {  //this is the first discussion  

                     var ch=new chat({idClient:usr[0].idClient,idProject:req.params.idProject});
                     ch.save((err,rslt)=>{ 
                         if(err)
                         res.send(err)
                         if(rslt)
                         {
                        chat.findByIdAndUpdate(rslt._id,{$addToSet:{idInvestors:req.params.idInvestor}},(err,cht)=>{
                            if(err)
                            res.send(err)
                            res.send(cht)
                        })
                       }
                     })// 
                    }
                })
            }  
            })
         } })}})}) 
          

           
         router.get('/verifInvest/:idInvestor/:idProject',passport.authenticate('bearer'),(req,res)=>{ 

            investor.find({project:req.params.idProject,_id:{$in:[req.params.idInvestor]}},(err,inv)=>{

           if(err)
           res.send(err)
           if(inv)
           res.send(inv[0])
 
            })

        })
           

        router.get('/getInvestorByIdUser/:idUser',passport.authenticate('bearer'), (req,res)=>{

         user.findById(req.params.idUser).populate('idInvestor').exec((err,inv)=>{
           if(err)
          res.send(err)
          if(inv)
          res.send(inv);


        })

        }) 

        router.get('/getInvestorById/:idInvestor',passport.authenticate('bearer'),(req,res)=>{

             investor.findById(req.params.idInvestor,(err,inv)=>{
                 if(err)
                 res.send(err)
                 res.send(inv)
             })


        }) 


        
        router.put('/updateInvestor/:idInvestor',passport.authenticate('bearer'),(req,res)=>{
        investor.findByIdAndUpdate(req.params.idInvestor,req.body,(err,inv)=>{

            if(err)
            res.send(err)
            res.send(inv)
        })


        })
                     
          

module.exports = router;
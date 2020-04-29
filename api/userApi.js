var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var user = require('../models/userModel');
var client = require('../models/clientModel');
var setting = require('../models/settingsModel');
var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jsonwebtoken = require('jsonwebtoken');
const secretKey = "SECRET";
var objectId = require('mongodb').objectId;
var uuidv1 = require('uuid/v1');
var sendEmail = require('../sendEmail');  
var Project=require('../models/projectModel');



router.get('/Activation/:code', (req, res) => { 
    setting.findOne({code:req.params.code}).populate('idUser').exec((err,rslt)=>{ 
        if(err)
        {res.send(err);}
        else {  
            u=new user(rslt.idUser);
            u.state="activated";
            u.save((err,rslt)=>{ 
                if(err)
                {res.send(err);}
                else{  
                    setting.deleteOne({code:req.params.code},(err,rslt)=>{

                        if(err)
                        res.send(err);
                        res.send(rslt);
                    }) 
                }
            });
        }
    })
})


router.put('/updatePass',(req,res)=>{ 
    console.log(req.body);
    var e=req.body.email;
    var passPlainText=req.body.password;
    bcrypt.hash(passPlainText,10,(err,hash)=>{ 
    if(err)
    {res.send(err);} 
    else{  
        req.body.password=hash;
        user.findOneAndUpdate({email:e},req.body,(err,usr)=>{
            if(err)
            {
            res.send(err);
            }
            if(usr){  
                
            res.send(usr);
            }
          })
    }
    })
  }) 

  router.post('/sendLinkForgotPass',(req,res)=>{ 
       var randomCode=Math.floor(Math.random() * Math.floor(99999999)); 
       var stringOfRandomCode=randomCode.toString();
      user.findOne({email:req.body.email},(err,rslt)=>{ 
       if(err)
       {res.send(err)}
       else{ 
           var idUser=rslt._id;
           set =new setting();
           set.idUser=idUser;
           set.code=stringOfRandomCode;
           set.save((err,rslt)=>{
               if(err)
               res.send(err);
               res.send(rslt);
           })
       }
      })
    
      sendEmail(stringOfRandomCode,req.body.email);
     



  }) 

  router.post("/verifCode",(req,res)=>{ 
    setting.findOne({code:req.body.code}).populate('idUser').exec((err,rslt)=>{ 
    
        if(err)
        { 
        res.send(err)
        }
        else if(rslt){  
             
            if(rslt.idUser.email.localeCompare(req.body.email)==0)
            { 
            setting.deleteOne({code:req.body.code},(err,rslt)=>{
           if(err)
           res.send(err);
           else 
           {
            if(rslt.deletedCount==1) 
            {
                res.send(true)
            } 
            else
            res.send(false)

           }
            })
        }else {
            res.send(false);
        }
        }
    })

  })  


  router.get('/getProjectById/:idProject',passport.authenticate('bearer'), async (req,res)=>{ 
     
    const proj=await Project.findById(req.params.idProject).populate('feedback').exec()
    if(proj)
    res.send(proj)

   })


module.exports = router;
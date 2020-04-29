var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var user = require('../models/userModel');
var passport = require('passport');
var setting = require('../models/settingsModel');
var uuidv1 = require('uuid/v1');
var sendEmail = require('../sendEmail');  
var client =require('../models/clientModel');
var investor=require('../models/investorModel');
var project=require('../models/projectModel');




router.post('/registre', (req, res) => {
    var passPlainText = req.body.password;
    bcrypt.hash(passPlainText, 10, (err, hash) => {
        if (err)
            res.send(err);
        else {
                    req.body.password = hash;
                    usr = new user();
                    usr.email = req.body.email;
                    usr.password = hash;
                    usr.role = 'admin';
                    usr.state = 'notactivated';
                    usr.save((err, rslt) => {
                        if (err) { res.send(err); }
                        else {
                            set = new setting();
                            set.idUser = rslt._id;
                            set.code = uuidv1();
                            var emailHtml='http://localhost:3000/user/activation/'.concat(set.code)
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

})


 


router.get('/dashboard',passport.authenticate('bearer'),async (req,res)=>{ 
    data = {};
    data.clients = await client.countDocuments();
    data.projects = await project.countDocuments();
    data.investors =  await investor.countDocuments({});
    data.numberOfInvestment= await project.count().$where('this.totalFund>0');
    data.projectTotallyFund=await project.count().$where('this.totalFund==this.budget');
    res.send({ msg: 'OK', data });

})



module.exports = router;
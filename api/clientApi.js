var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var user = require('../models/userModel');
var client = require('../models/clientModel');
var setting = require('../models/settingsModel');
var Project = require('../models/projectModel');
var passport = require('passport');
var sendEmail = require('../sendEmail');
var uuidv1 = require('uuid/v1');
var multer = require('multer');

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) { 
        cb(null, file.originalname)
    }
})

var upload = multer({ storage: storage })

router.post('/registre', (req, res) => {
    console.log(req.body);
    var passPlainText = req.body.password;
    bcrypt.hash(passPlainText, 10, (err, hash) => {
        if (err) { res.send(err); }
        else {
            req.body.password = hash;
            req.body.state = "notactivated";
            var cl = new client(req.body);
            cl.save((err, rslt) => {
                if (err) { res.send(err) }
                else {
                    usr = new user();
                    usr.email = req.body.email;
                    usr.password = hash;
                    usr.idClient = rslt._id;
                    usr.role = 'client';
                    usr.state = 'notactivated';
                    usr.save((err, rslt) => {
                        if (err) { res.send(err); }
                        else {
                            set = new setting();
                            set.idUser = rslt._id;
                            set.code = uuidv1();
                            sendEmail(set.code, usr.email)
                            set.save((err, rslt) => {
                                if (err)
                                    res.send(err);
                                res.send(rslt);
                            })
                        }
                    })
                }
            }) }
    })
})

router.post('/addProject/:idUser',passport.authenticate('bearer'), (req, res) => {
    var project = new Project(req.body);
    project.save((err, rslt) => {
        if (err)
            res.send(err);
        if (rslt) {
            idProject = rslt._id;
            user.findByIdAndUpdate(req.params.idUser, { $addToSet: { projects: idProject } }, { new: true }, (err, usr) => {
                if (err) { res.send(err) }
                if (!usr) { res.send({ notfound: "not found" }) }
                if (usr) {
                    res.send(usr);
                }

            })
        }
    })
})

router.delete('/deleteProject/:idUser/:idProject', (req, res) => {
    user.findByIdAndUpdate(req.params.idUser, { $pull: { projects: { $in: [req.params.idProject] } } }, (err, usr) => {
        if (err) { res.send(err) }
        Project.findByIdAndDelete(req.params.idProject, (err, proj) => {
            if (err)
                res.send(err)
        })
        res.send(usr);
    })
})

router.put('/updateProject/:idProject',passport.authenticate('bearer'), (req, res) => {
    Project.findByIdAndUpdate(req.params.idProject, req.body, (err, prj) => {
        if (err)
            res.send(err);
        res.send(prj);
    })

})

router.get('/myprojects/:idUser',passport.authenticate('bearer'), (req, res) => {

    user.findById(req.params.idUser).populate('projects').exec((err, rslt) => {
        if (err)
            res.send(err)
        res.send(rslt.projects);
    })
})

router.post('/update/:idClient',passport.authenticate('bearer'), (req, res) => {

    client.findByIdAndUpdate(req.params.idClient, req.body, (err, rslt) => {
        if (err)
            res.send(err)
        res.send(rslt)
    })
})

router.get('/details/:idClient',passport.authenticate('bearer'), (req, res) => {

    client.findById(req.params.idClient, (err, cl) => {

        if (err)
            res.send(err)
        res.send(cl);

    })

})

router.post('/uploadImg/:idClient', upload.single('avatar'),passport.authenticate('bearer'), (req, res, next) => {
    client.findByIdAndUpdate(req.params.idClient, { img: req.file.originalname }, (err, cl) => {
        if (err)
            res.send(err)
        res.send(cl)
    })

}) 

router.get('/clientImg/:idClient',passport.authenticate('bearer'),(req,res)=>{

    client.findById(req.params.idClient,(err,cl)=>{
    if(err)
    {res.send(err)}
    if(cl.img)
    { 
        cl.img="uploads/"+cl.img;
        var fs=require('fs');
        var bitmap=fs.readFileSync(cl.img);
        cl.img=new Buffer(bitmap).toString('base64');
        res.send(cl);
    }

    })

}) 


router.get('/getClientByIdProject/:idProject',passport.authenticate('bearer'),(req,res)=>{

   user.find({projects:{$in:[req.params.idProject]}},(err,us)=>{ //search client in user to get idClient
   if(err)
   res.send(err)
   if(us[0])
   {   
  client.findById(us[0].idClient,(err,cl)=>{  // return the client
    if(err)
    res.send(err)
    res.send(cl)
  })
   }

  })

})


module.exports = router;
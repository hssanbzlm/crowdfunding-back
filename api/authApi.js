var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var user = require('../models/userModel');
const jsonwebtoken = require('jsonwebtoken');
const secretKey = "SECRET";

router.post('/login/:user', function (req, res) {
    user.findOne({ email: req.body.email }, (err, usr) => {
        if (err) {
            res.send(err);
        }
        if (usr) { 
            bcrypt.compare(req.body.password, usr.password, (err, passsucce) => {
            
                if (passsucce) {
                    if (usr.role == req.params.user) {
                        res.send({
                            token: jsonwebtoken.sign(usr.toJSON(), secretKey)
                        })
                    }
                    else res.send({ error: "verif your credential" });
                } 
                else{ res.send({error:"verify your credentials"})}
            })

        }
        if (!usr) {
            res.send({ error: "verif your credential" });

        }

    })

})


module.exports = router;
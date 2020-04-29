var express=require('express');
var router=express.Router();  
var project=require('../models/projectModel');
var feedback=require('../models/feedbackModel')
var passport = require('passport');

//add feedback
router.post('/addFeedback/:idProject',passport.authenticate('bearer'),(req,res)=>{    
    var d=Date.now(); 
    var feed=new feedback(req.body);
    feed.date=d;
    feed.save((err,fd)=>{
        if(err)
        res.send(err)
        if(fd)
        { 
            project.findByIdAndUpdate(req.params.idProject,{$addToSet:{feedback:fd._id}},{new:true},(err,prj)=>{
             if(err)
             res.send(err)
             res.send(prj)
            })
        }

    })

})



//all feedback of a project 
router.get('/feedback/:idProject',passport.authenticate('bearer'),(req,res)=>{

    project.findById(req.params.idProject).populate('feedback').exec((err,prj)=>{
    if(err)
    res.send(err);
    res.send(prj.feedback);

    })

})

//delete feedback
router.post('/deleteFeedback/:idFeedback/:idProject',(req,res)=>{   

    feedback.findByIdAndRemove(req.params.idFeedback,(err,rslt)=>{

        if(err)
        res.send(err);
        if(rslt)
        {
            project.findByIdAndUpdate(req.params.idProject,{$pull:{feedback:{$in:[req.params.idFeedback]}}},{new:true},(err,rslt)=>{ 

                if(err)
                res.send(err)
                if(rslt)
                {
                    res.send(rslt);
                }
            })
        }
    })

}) 


//update feedback
router.put('/updateFeedback/:idFeedback',(req,res)=>{
feedback.findByIdAndUpdate(req.params.idFeedback,req.body,{new:true},(err,feed)=>{
    if(err)
    res.send(err)
    if(feed)
    res.send(feed)
})

})
module.exports=router;
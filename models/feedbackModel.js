var mongoose=require('mongoose');
var feedbackShema=new mongoose.Schema({

   idInvestor:{type:mongoose.Schema.Types.ObjectId,ref:'investor'},
   content:String,
   date:{type:Date,default:Date.now()}

}) 


module.exports=mongoose.model('feedback',feedbackShema);
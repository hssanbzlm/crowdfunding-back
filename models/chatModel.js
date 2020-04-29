var mongoose=require('mongoose');
var chatSchema=new mongoose.Schema({ 
   idClient:{type:mongoose.Schema.Types.ObjectId,ref:"client"},
   idProject:{type:mongoose.Schema.Types.ObjectId,ref:"project"},
   idInvestors:[{type:mongoose.Schema.Types.ObjectId,ref:"investor"}],
   idMessages:[{type:mongoose.Schema.Types.ObjectId,ref:"message"}]

}) 

module.exports=mongoose.model('chat',chatSchema);
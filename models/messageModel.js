var mongoose=require('mongoose');
var messageSchema=new mongoose.Schema({ 
    idUser:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
    message:String,
    date:{type : Date,
          default:Date.now()
    
     }


}) 

module.exports=mongoose.model('message',messageSchema);
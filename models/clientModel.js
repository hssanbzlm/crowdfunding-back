var mongoose=require('mongoose');
var clientShema= new mongoose.Schema({ 
    firstName:String,
    lastName:String,
    birthday:Date,
    img:String

}); 

module.exports=mongoose.model('client',clientShema);
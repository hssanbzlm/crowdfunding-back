var mongoose=require('mongoose');
var investorSchema=new mongoose.Schema({ 

    enterprise:String,
    address:String,
    project:[{type:mongoose.Schema.Types.ObjectId,ref:"project"}]


}) 

module.exports=mongoose.model('investor',investorSchema);
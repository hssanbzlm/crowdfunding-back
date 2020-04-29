var mongoose=require('mongoose');
var userSchema=new mongoose.Schema({
email:String,
password:String,
idClient:{type:'objectId',ref:'client'},
idInvestor:{type:'objectId',ref:'investor'},
projects:[{type:mongoose.Schema.Types.ObjectId,ref:'project'}],
role:String,
state:String

});

module.exports=mongoose.model('user',userSchema);
var mongoose=require('mongoose');
var projectShema=new mongoose.Schema({
    
    title:String,
    description:String,
    totalFund:Number,
    budget:Number,
    feedback:[{type:mongoose.Schema.Types.ObjectId,ref:'feedback'}]

})


module.exports=mongoose.model('project',projectShema);
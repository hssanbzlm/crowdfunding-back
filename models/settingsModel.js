var mongoose=require('mongoose');
var settingsSchema=new mongoose.Schema({
idUser:{
    type:'objectId',ref:'user'
}, 
code:String
 
}) 

module.exports=mongoose.model('settings',settingsSchema)
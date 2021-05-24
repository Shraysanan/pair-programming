var mongoose=require("mongoose");
const UserSchema=new mongoose.Schema({
  name:String,
  email:{ type : String , unique : true, required : true},
  password:String
});
module.exports = User = mongoose.model('User', UserSchema);

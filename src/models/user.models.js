const mongoose= require("mongoose");
const {Schema} = require("mongoose");


const userSchema = new Schema({
    userId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        index:true
    },
    username:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        // index:true
    },
    groupId:{
        type:String,
        required:true,
        trim:true,
        // index:true
    },
},{timestamps:true})

userSchema.index({ groupId: 1, username: 1 }, { unique: true });

const User = mongoose.model("User",userSchema)
module.exports = {User}
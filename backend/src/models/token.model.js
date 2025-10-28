import mongoose from "mongoose"

const tokenSchema = new mongoose.Schema({
    token:{
        type:String,
        required:true
    },
    otp : {
        type:String
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    verified: {
        type: Boolean,
        default: false
      },
    createdAt: {
        type:Date,
        default:Date.now(),
        expires:600
    }
})
 const Token = mongoose.model('Token', tokenSchema)
 export default Token


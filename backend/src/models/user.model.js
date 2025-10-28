import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: {
    type : String,
    required : true,
},
  email: { type: String, unique: true, required:true },
  password: {
    type: String,
    required: true,
  },
  phone:{type:String},
  role: {
    type: String,
    enum: ["admin", "doctor", "patient"],
    default: "patient",
  },
  specialization: { type: String },
  profilePic:String,
  isVerified : {
    type:Boolean,
    default : false
},

  failedAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
});


const User = mongoose.model("User", userSchema);
export default User;

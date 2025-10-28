import {Schema, model} from "mongoose";

const appointmentSchema = new Schema({
    user :{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    doctor:{
         type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    description:{
        type:String,
        required:true
    },
    timeSlot:{type:String},
    priority:{
        type:String,
        enum:["low", "medium", "high"],
        default:"low"
    },
    status:{
        type:String,
        enum:['pending', 'approved', 'completed','cancelled'],
        default:'pending'
    },
    prescription:{type:String}
},{timestamps:true})
const Appointment = model("Appointment", appointmentSchema)
export default Appointment
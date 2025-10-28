import {Schema, model} from "mongoose"

const slotSchema = new Schema({
    start:{type:String, required:true},
    end:{type:String, required:true},
    booked:{type:Boolean, default:false},
    bookedBy:{
        type:Schema.Types.ObjectId,
         ref:"User"
        }
})

const scheduleSchema = new Schema({
    doctor:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    date:{type:string, required:true},
    slots:[slotSchema],
},{timestamps:true})

const Schedule = model("Schedule", scheduleSchema)
export default Schedule;
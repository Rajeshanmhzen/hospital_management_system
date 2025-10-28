import {Schema, model} from "mongoose"

const notificationSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    from:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    message:{
        type:String,
        required:true,
    },
    isRead:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const Notification = model("Notification", notificationSchema)
export default Notification
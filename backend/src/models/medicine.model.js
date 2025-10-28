import {Schema, model} from "mongoose"

const medicineSchema = new Schema({
    name:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    expiryDate:{
        type:Date
    },
    manufacture:{type:Date},
    price:{type:Number},
    quantity:{type:Number}
},{timestamps:true})

const Medicine = model("Medicine", medicineSchema)
export default Medicine;
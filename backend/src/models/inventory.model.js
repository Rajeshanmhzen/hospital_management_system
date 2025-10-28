import {Schema, model} from "mongoose"

const inventorySchema = new Schema({
    medicine:{
        type:Schema.Types.ObjectId,
        ref:"Medicine"
    },
    stock:{type:Number, required:true},
    lastUpdate:{type:Date, default:Date.now()}
}, {timestamps:true})

const Inventory = model("Inventory", inventorySchema)
export default Inventory;
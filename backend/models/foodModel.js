const mongoose = require('mongoose')
const foodSchema = new mongoose.Schema(
    {
        name:{
            type:String, required:true
        },
        description:{
            type:String, required:true
        },
        price:{
            type:"Number", required:true
        },
        image:{
            type:String,
            required:true
        },
        category:{
            type:String,
            required:true
        },
        no_of_favorites:{
            type: Number,
            default: 0
        }
    }
)
const foodModel = mongoose.models.food || mongoose.model("Food",foodSchema)
module.exports = foodModel
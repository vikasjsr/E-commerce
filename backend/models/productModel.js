const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter the name of product!"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"Please enter the description of product!"]
    },
    price:{
        type:Number,
        required:[true,"Plz enter the price of product"],
        maxLength:[8,"Price can't exceed 8 characters"]
    },
    rating:{
        type:Number,
        default:0
    },
    // images will bwe array of objects becz there would be more tha one image
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:[true,"Please enter the product category"]
    },
    Stock:{
        type:Number,
        required:[true,"Please enter the product stocks"],
        maxLength:[4,"Stock can't exceed 4 characters"],
        default:1
    },
    numberOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
              {
                name:{
                    type:String,
                    required:true,
                },
                rating:{
                    type:Number,
                    required:true,
                },
                comment:{
                    type:String,
                    required:true,
                }
            }
         ],

    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    },

    createdAt:{
        type:Date,
        default:Date.now
    }


})

module.exports = mongoose.model("Product",productSchema);
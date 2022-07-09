const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");// inbuilt module in nodejs to generate a cryptographically well-built artificial
                                //  random data and the number of bytes to be generated in the written code.

                                

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true,"please enter your name!"],
        maxLength:[30,"Length of name can't exceed than 30 characters.."],
        minLength:[4,"Length of name can't less than 4 characters.."]
    },
    email:{
        type:String,
        required:[true,"Please enter your email"],
        unique:true,
        validate:[validator.isEmail,"Please enter a valid e-mail"]
    },
    password:{
        type:String,
        required:[true,"Please enter your password"],
        minLength:[8,"Length of password can't exceed than 8 characters.."],
        select:false
    },
    avatar:{
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
});


// encrypting password of user by hashing
// since we are using normal function keyword here because we are trying to access this here 
// and in arrow function we cant't access "this".
userSchema.pre("save", async function(next){

    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// using jsonwebtoken to create token and store them in cookie

userSchema.methods.getJWTToken = function(){
    return jwt.sign( { id : this._id }, process.env.JWT_SECRET ,{
        expiresIn : process.env.JWT_EXPIRES
    });

}

// compare password function!

userSchema.methods.comparePassword = async function(enterPassword){
    
    return await bcrypt.compare(enterPassword ,this.password);
}

// generating password reset token
userSchema.methods.getResetPasswordToken = function(){

    // generating token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // hashing and adding reset password to userScehma
    this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;

}

module.exports = mongoose.model("User",userSchema);
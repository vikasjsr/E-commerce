const ErrorHandler = require("../utils/errorHandler");
const catchAssynceErors = require("./catchAssynceErors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticateUser = catchAssynceErors( async(req, res, next) => {
    const { token } = req.cookies;
    // console.log(token);

    if(!token){
        return next(new ErrorHandler("plz login to access this resource",401))
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    next();
})

// ...roles is an array 
// let array1 = ['h', 'e', 'l', 'l', 'o'];
// let array2 = [...array1];
// console.log(array2);
// ['h', 'e', 'l', 'l', 'o'] // output

exports.authorizeRole = (...roles) =>{
    return  (req, res, next) =>{
        if (!roles.includes(req.user.role)) {
        return next ( new ErrorHandler(
            `Role : ${req.user.role} is not allowed to access this resource`,
            403
          ) )
        }

        next();
    };

};
const ErrorHandler = require("../utils/errorHandler");
const catchAssyncError = require("../middleware/catchAssynceErors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtTokens");
// const sendEmail = require("../utils/sendEmail"); 

// register a user;
exports.registerUser = catchAssyncError(async (req ,res ,next) => {
    const { name, email, password } = req.body;
     
    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:"this is a simple id",
            url:"profilepicUrl"
        }
    })

    sendToken(user,201,res);
})

// login user

exports.loginUser = catchAssyncError(async (req, res, next) =>{

    const { email,password } = req.body;

    // check that user had given both email as well as password

    if(!email || !password){
        return next(new ErrorHandler("Please enter email and password",400));
    }

    const user = await User.findOne( { email } ).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    sendToken(user,200,res);
});

// logout a user
exports.logout = catchAssyncError(async (req, res, next) =>{

    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        success:true,
        message : "logged oout!"
    })
})

// creating forget password section

// exports.forgotPassword = catchAssyncError( async (req, res, next) =>{

//     // extracting user  from userschema by email
//     const user = await User.findOne( { email : req.body.email } );

//     if(!user){
//         return next(new ErrorHandler("User not found",404));
//     }

//     // get resetPasswordToken
//     const resetToken = user.getResetPasswordToken();

//     await user.save( { validateBeforeSave : false } );

//     const resetPasswordUrl = `${ req.protocol }://${req.get(
//         "host"
//         )}/api/v1/password/reset/${resetToken}`;

//      const message = `Your password reset token is :- \n \n ${resetPasswordUrl} and in case if you have not requested for this email,
//                         please ignore it;`   
    
//     try{
//         await sendEmail({
//             email : user.email,
//             subject : "Ecommerce password recovery",
//             message
//         });

//         res.status(200).json({
//             success:true,
//             message:`e-mail is sent to ${user.email} successfully!`
//         })

//     }catch(error){
//         user.resetPasswordToken = undefined;
//         user.resetPasswordExpire = undefined;

//         await user.save( {validateBeforeSave : false} );
//         // console.log(error.message);
//         return next(new ErrorHandler(error.message,500));
//     }
    

    
// })

// get useredetail

exports.getUserDetail = catchAssyncError(async (req,res,next) => {


    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user
    });
})

// update old password

exports.updatePassword = catchAssyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old password is incorrect",400));
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("password is not matching",400));
    }

    user.password = req.body.newPassword;

    await user.save();
    sendToken(user,200,res);
});

// update user profile 

exports.updateProfile = catchAssyncError( async (req, res, next) => {
    const newUserData = {
        name:req.body.name,
        email:req.body.email
    };

    // we will further add cloudinary

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success : true,
    })
});

// get all user by admin

exports.getAllUser = catchAssyncError(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success:true,
        users
    });
})

// get single user by admin
exports.getAllUser = catchAssyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`user does not match with requie ${req.params.id} id`));
    }

    res.status(200).json({
        success:true,
        user
    });
})
const express = require("express");
const { 
    registerUser, 
    loginUser, 
    logout, 
    forgotPassword, 
    getUserDetail,
    updatePassword,
    updateProfile
} = require("../controller/userController");

const {isAuthenticateUser,authorizeRole} = require("../middleware/auth")

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// router.route("/password/forgot").post(forgotPassword);

router.route("/logout").get(logout);
router.route("/me").get(isAuthenticateUser, getUserDetail);
router.route("/password/update").put(isAuthenticateUser, updatePassword);
router.route("/me/update").put(isAuthenticateUser, updateProfile);


module.exports = router;
const express = require("express");
const { 
    registerUser, 
    loginUser, 
    logout, 
    forgotPassword, 
    getUserDetail,
    updatePassword,
    updateProfile,
    getAllUser,
    getSingleUser,
    updateProfileByAdmin,
    deleteUserByAdmin
} = require("../controller/userController");

const {isAuthenticateUser,authorizeRole} = require("../middleware/auth")

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

// router.route("/password/forgot").post(forgotPassword);

router.route("/logout").get(logout);

router.route("/me").get(isAuthenticateUser, getUserDetail);

router
    .route("/password/update")
    .put(isAuthenticateUser, updatePassword);

router
    .route("/me/update")
    .put(isAuthenticateUser, updateProfile);

router
    .route("/admin/users")
    .get(isAuthenticateUser, authorizeRole("admin"), getAllUser);

router
    .route("/admin/user/:id")
    .get(isAuthenticateUser, authorizeRole("admin"), getSingleUser)
    .put(isAuthenticateUser, authorizeRole("admin"), updateProfileByAdmin)
    .delete(isAuthenticateUser, authorizeRole("admin"), deleteUserByAdmin);

module.exports = router;
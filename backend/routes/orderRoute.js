const express = require("express");

const {
    newOrder,
    getSingleOrder,
    myOrders,
    getAllOrders,
    updatOrder,
    deleteOrder

} = require("../controller/orderController");
const { isAuthenticateUser,authorizeRole } = require("../middleware/auth");

const router = express.Router();

router.route("/order/new").post(isAuthenticateUser, newOrder);

router
    .route("/order/:id") 
    .get(isAuthenticateUser, authorizeRole("admin"), getSingleOrder);

router.route("/orders/me").get(isAuthenticateUser, myOrders);

router
    .route("/admin/orders")
    .get(isAuthenticateUser, authorizeRole("admin"), getAllOrders);

router.route("/admin/order/:id")
.put(isAuthenticateUser, authorizeRole("admin"), updatOrder)
.delete(isAuthenticateUser, authorizeRole("admin"), deleteOrder); 


module.exports = router;
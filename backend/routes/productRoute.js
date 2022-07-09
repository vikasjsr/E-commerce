const express = require("express");
const { 
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getSingleProduct 
} = require("../controller/productController");

const { isAuthenticateUser,authorizeRole } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllProducts);

router.route("/admin/products/new").post(isAuthenticateUser, authorizeRole("admin"), createProduct);

// if routes are same then we can do this also
router.route("/admin/products/:id")
.put(isAuthenticateUser, authorizeRole("admin"), updateProduct)
.delete(isAuthenticateUser, authorizeRole("admin"), deleteProduct);

router.route("/products/:id").get(getSingleProduct);




module.exports = router;
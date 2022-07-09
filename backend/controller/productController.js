const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAssyncError = require("../middleware/catchAssynceErors");
const apiFeatures = require("../utils/apiFeatures");

//create Product only for admin:
exports.createProduct = catchAssyncError(

    async(req,res,next) =>{
        // schema me se user nikalna
        req.body.user = req.user.id;
  
        const product = await Product.create(req.body);
        res.status(201).json({
            success:true,
            product
        })
});


//to get all the product
exports.getAllProducts = async(req,res) => {
    const resultPerPage = 5;

    const productCount = await Product.countDocuments();

    const ApiFeature = new apiFeatures(Product.find(),req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

        const products = await ApiFeature.query;
        res.status(200).json({
            success:true,
            products
        })
}

// get explicitly a single product!
exports.getSingleProduct = catchAssyncError(async(req,res,next) =>{
    const product = await Product.findById(req.params.id);
    
    if(!product){
        return next(new ErrorHandler("Product is not found", 404));
    }

    res.status(200).json({
        success:true,
        product,
        productCount
    })
})

// to udate the data of product
exports.updateProduct = catchAssyncError(
    async(req,res,next) =>{
        let product = await Product.findById(req.params.id);
        if(!product){
            return next(new ErrorHandler("Product is not found", 404));
        }
    
        product = await Product.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidaters:true,
            useFindAndModify:false
        });
    
        res.status(200).json({
            success:true,
            product
        })
    })

// for delete the product

exports.deleteProduct = catchAssyncError(async(req,res,next) =>{

    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product is not found", 404));
    }    

    await product.remove();
    res.status(200).json({
        success:true,
        message:"product is deleted successfully!"
    })

})
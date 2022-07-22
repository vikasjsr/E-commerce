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
    const resultPerPage = 8;

    const productCount = await Product.countDocuments();

    const ApiFeature = new apiFeatures(Product.find(),req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

        const products = await ApiFeature.query;
        res.status(200).json({
            success:true,
            products,
            productCount
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


// create and update new review

exports.createProductReview = catchAssyncError(async (req, res, next) => {
    const { rating, comment, productId } = req.body;


    const review = {
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    );

    if(isReviewed){
        product.reviews.forEach((rev) => {
            if(rev.user.toString() === req.user._id.toString())
                (rev.rating = rating) ,(rev.comment = comment);
        });
    }else{
        product.reviews.push(review);
        product.numberOfReviews = product.reviews.length;
    }

    let avg = 0;
    product.ratings = product.reviews.forEach(rev => {
        avg += rev.rating;
    })
    product.ratings = avg / product.reviews.length;

    await product.save({validateBeforesave : true});

    res.status(200).json({
        success:true,
        message:"review is added successfully!"
    });
});

// get all reviews of product

exports.getAllReviews = catchAssyncError(async (req, res, next) => {

    const product = await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHandler("Product is not found",404));
    }

    res.status(200).json({
        success:true,
        reviews:product.reviews
    });

});

// delete a sppecific review 

exports.deleteReview = catchAssyncError(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);

    if(!product){
        return next(new ErrorHandler("Product is not found",404));
    }

    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() === req.query.id.toString()
    );

    let avg = 0;

    reviews.forEach((rev)=>{
        avg += rev.rating;
    })

    const ratings = avg / reviews.length;
    const numOfRevies = reviews.length;

    await product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfRevies
    },{
        new:true,
        runValidators:true,
        userFindAndModify:false
    })

    res.status(200).json({
        success:true,
        reviews:product.reviews
    });

});
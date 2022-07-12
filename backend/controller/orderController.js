const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAssynceErors = require("../middleware/catchAssynceErors");

// create a new order

exports.newOrder = catchAssynceErors(async (req, res, neext) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id
    });

    res.status(201).json({
        success:true,
        order
    })
});

// get singleorder

exports.getSingleOrder = catchAssynceErors(async (req, res, next) => {

    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    )

    if(!order){
        return next(new ErrorHandler("order is not found with this id",404));
    }

    res.status(200).json({
        success:true,
        order
    });
});

// get all order of logged user

exports.myOrders = catchAssynceErors(async (req, res, next) => {

    const orders = await Order.find({ user:req.user._id });
    if(!orders){
        return next(new ErrorHandler("order is not found",404));
    }

    res.status(200).json({
        success:true,
        orders
    });
});

// get all orders

exports.getAllOrders = catchAssynceErors(async(req, res, next) => {

    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach((order)=>{
        totalAmount += order.totalPrice;
    })

    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
});

// updateOrder status by admin

exports.updatOrder = catchAssynceErors(async(req, res, next) => {

    const order = await Order.findById(req.params.id);

    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("you had already ordered this order!"));
    }

    order.orderItems.forEach(async(order) => {
        await updateStock(order.product,order.quantity);
    })

    order.orderStatus = req.body.status;

    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now() 
    }

    await order.save( {validateBeforeSave:false} );

    res.status(200).json({
        success:true,
        message:"status updated successfully!"
    })
});

async function updateStock(id,quantity){
    const product = await Product.findById(id);
    product.Stock -= quantity;
    await product.save({validateBeforeSave : false});
}

// deleteOrder by Admin ;

exports.deleteOrder = catchAssynceErors(async (req, res, next) => {

    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order is not found with this id",404));
    }

    await order.remove();

    res.status(200).json({
        success:true,
        message:"order is deleted successfully"
    });

});

// 
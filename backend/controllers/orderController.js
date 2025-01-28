const catchAsyncError = require("../middleware/catchAsyncError");
const Product = require("../models/productModel");
const Order = require("../models/orderModal");
const Errorhandler = require("../utils/errorHandler");

exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    shippingPrice,
    paymentInfo,
    totalPrice,
    itemPrice,
    taxPrice,
  } = req.body;

  const order = await Order.create({
    orderItems,
    shippingInfo,
    shippingPrice,
    paymentInfo,
    totalPrice,
    itemPrice,
    taxPrice,
    paidAt: Date.now(),
    user: req.user.id,
  });

  res.status(200).json({ success: true, order });
});

exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(
      new Errorhandler(`Order not found with this id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    order,
  });
});

exports.myOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });
  res.status(200).json({
    success: true,
    orders,
  });
});

exports.orders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });
  res.status(200).json({
    success: true,
    orders,
    totalAmount,
  });
});

exports.updateOrder = catchAsyncError(async (req, res, next) => {
  const orders = await Order.findById(req.params.id);

  if (orders.orderStatus == "Devlivered") {
    return next(new Errorhandler("Order has been already delivered ", 400));
  }

  orders.orderItems.forEach(async (orderItem) => {
    await updateStock(orderItem.product, orderItem.quantity);
  });

  orders.orderStatus = req.body.orderStatus;

  orders.deliveredAt = Date.now();

  await orders.save();

  res.status(200).json({
    success: true,
  });
});

async function updateStock(productId, quantity) {
  const product = await Product.findById(productId);
  product.stock = product.stock - quantity;
  product.save({ validateBeforeSave: false });
}

exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) {
    new Errorhandler(`Order not found with this id ${req.params.id}`, 404);
  }
  // await order.remove();
  res.status(200).json({
    success: true,
  });
});

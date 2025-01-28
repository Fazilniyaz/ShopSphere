const Product = require("../models/productModel");
const Errorhandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const APIFeatures = require("../utils/apiFeatures");

exports.getProducts = async (req, res, next) => {
  // console.log("Get products called");
  // const resPerPage = 3;
  // const apiFeatures = new APIFeatures(Product.find(), req.query)
  //   .search()
  //   .filter()
  //   .paginate(resPerPage);
  // const products = await apiFeatures.query;

  // const totalProductsCount = await Product.countDocuments({});
  // // return next(new Errorhandler("Samosa", 400));
  // res.status(200).json({
  //   success: true,
  //   count: totalProductsCount,
  //   products,
  //   resPerPage,
  // });

  const resPerPage = 3;

  let buildQuery = () => {
    return new APIFeatures(Product.find(), req.query).search().filter();
  };

  const filteredProductsCount = await buildQuery().query.countDocuments({});

  const totalProductsCount = await Product.countDocuments({});

  let productsCount = totalProductsCount;

  if (filteredProductsCount !== totalProductsCount) {
    productsCount = filteredProductsCount;
  }

  const products = await buildQuery().paginate(resPerPage).query;

  res.status(200).json({
    success: true,
    count: productsCount,
    resPerPage,
    products,
  });
};

exports.newProduct = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

exports.getSingleProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new Errorhandler("Product Not Found", 400)); // Trigger error middleware
    }
    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error); // Pass unexpected errors to error handler
  }
};

exports.updateProduct = async (req, res, next) => {
  let products = await Product.findById(req.params.id);

  if (!products) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    product,
  });
  console.log("product updated");
};

exports.deleteProduct = async (req, res, next) => {
  try {
    // Use findByIdAndDelete to delete the product directly
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createReview = catchAsyncError(async (req, res, next) => {
  const { productId, comment, rating } = req.body;

  const review = {
    user: req.user.id,
    rating,
    comment,
  };

  const product = await Product.findById(productId);
  console.log(product);
  const isReviewed = product.reviews.forEach((review) => {
    return review.user.toString() == req.user.id.toString();
  });
  if (isReviewed) {
    product.reviews.find((review) => {
      if (review.user.toString() == req.user.id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  product.ratings =
    product.reviews.reduce((acc, values) => {
      return review.rating + acc;
    }, 0) / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({ success: true });
});

exports.getReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  res.status(200).json({ success: true, reviews: product.reviews });
});

//Delete Review - api/v1/review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  //filtering the reviews which does match the deleting review id
  const reviews = product.reviews.filter((review) => {
    return review._id.toString() !== req.query.id.toString();
  });
  //number of reviews
  const numOfReviews = reviews.length;

  //finding the average with the filtered reviews
  let ratings =
    reviews.reduce((acc, review) => {
      return review.rating + acc;
    }, 0) / reviews.length;
  ratings = isNaN(ratings) ? 0 : ratings;

  //save the product document
  await Product.findByIdAndUpdate(req.query.productId, {
    reviews,
    numOfReviews,
    ratings,
  });
  res.status(200).json({
    success: true,
  });
});

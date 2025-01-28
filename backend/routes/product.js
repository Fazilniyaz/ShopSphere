const express = require("express");
const {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createReview,
  getReview,
  deleteReview,
} = require("../controllers/productController");
const {
  isAuthenticatedUsers,
  authorizeRoles,
} = require("../middleware/authenticate");

const router = express.Router();

// router.route("/products").get(isAuthenticatedUsers, getProducts);
router.route("/products").get(getProducts);

router
  .route("/product/:id")
  .get(getSingleProduct)
  .put(updateProduct)
  .delete(deleteProduct);

router.route("/review").put(isAuthenticatedUsers, createReview);
router.route("/reviews").get(getReview);
router.route("/review").delete(deleteReview);

//Admin :

router
  .route("admin/product/new")
  .post(isAuthenticatedUsers, authorizeRoles("admin"), newProduct);

module.exports = router;

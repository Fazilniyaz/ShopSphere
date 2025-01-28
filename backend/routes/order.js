const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  orders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const router = express.Router();

const {
  isAuthenticatedUsers,
  authorizeRoles,
} = require("../middleware/authenticate");
const { updateProfile } = require("../controllers/authController");

router.route("/order/new").post(isAuthenticatedUsers, newOrder);
router.route("/order/:id").get(isAuthenticatedUsers, getSingleOrder);
router.route("/myorders/").get(isAuthenticatedUsers, myOrders);

//Admin routes
router
  .route("/orders/")
  .get(isAuthenticatedUsers, authorizeRoles("admin"), orders);
router
  .route("/order/:id")
  .put(isAuthenticatedUsers, authorizeRoles("admin"), updateOrder);
router
  .route("/order/:id")
  .delete(isAuthenticatedUsers, authorizeRoles("admin"), deleteOrder);

module.exports = router;

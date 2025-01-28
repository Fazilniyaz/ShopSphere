const express = require("express");
const router = express.Router();

const {
  isAuthenticatedUsers,
  authorizeRoles,
} = require("../middleware/authenticate.js");

const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  changePassword,
  updateProfile,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/authController");
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/myprofile").get(isAuthenticatedUsers, getUserProfile);
router.route("/password/change").post(isAuthenticatedUsers, changePassword);
router.route("/update").post(isAuthenticatedUsers, updateProfile);

//Admin

router
  .route("/admin/users")
  .get(isAuthenticatedUsers, authorizeRoles("admin"), getAllUsers);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUsers, authorizeRoles("admin"), getUser);
router
  .route("/admin/user/:id")
  .put(isAuthenticatedUsers, authorizeRoles("admin"), updateUser);
router
  .route("/admin/user/:id")
  .delete(isAuthenticatedUsers, authorizeRoles("admin"), deleteUser);

module.exports = router;

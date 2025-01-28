const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModal");
const Errorhandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwt");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

//Registering the user - /api/v1/register
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password, avatar } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar,
  });

  sendToken(user, 201, res);
});

//User Login - /api/v1/login
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new Errorhandler("Please enter all the credintials", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new Errorhandler("Invalid credintials", 401));
  }

  if (!(await user.isValidPassword(password))) {
    return next(new Errorhandler("Invalid credintials", 401));
  }

  sendToken(user, 201, res);
});

//User Logout - /api/v1/logout
exports.logoutUser = (req, res, next) => {
  res.cookie("token", null),
    {
      expires: new Date(Date.now()),
      httpOnly: true,
    };
  res.status(200).json({
    success: true,
    message: "Logged out",
  });
};

//forgotPassword | resetLink : /api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new Errorhandler("user not found", 404));
  }
  const resetToken = user.getResetToken();
  await user.save({ validationBeforeSave: false });
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  var message = `Your password reset url is as follow\n\n${resetUrl}\n\n If you have not requested then Ignore it.`;

  try {
    sendEmail({
      email: user.email,
      subject: "ShopSphere password link",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new Errorhandler(error.message), 500);
  }
});

//resetPassword - /api/v1/password/reset/8fcbcf29eebf2af729544e5a11eaba148d208fd4
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new Errorhandler("Password reset link expired"));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  await user.save({ validateBeforeSave: false });
  sendToken(user, 201, res);
});

exports.getUserProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

exports.changePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  if (!(await user.isValidPassword(req.body.oldPassword))) {
    return next(new Errorhandler("Old password is incorrect!", 401));
  }

  user.password = req.body.password;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Password changed Successfully!",
  });
});

exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

//Admin Routes :

exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const user = await User.find({});
  res.status(200).json({
    success: true,
    user,
  });
});

exports.getUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new Errorhandler(`User not found with this id : ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

exports.updateUser = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  console.log("User deleted:", user); // Debug log

  if (!user) {
    return next(
      new Errorhandler(`User not found with this id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

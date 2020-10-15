const User = require('../models/userModel');

const catchAsyncErrors = require('../utils/catchAsync');

exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',

    data: {
      users,
    },
  });
});
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'success',
    message: 'route not defined',
  });
};
exports.deleteUser = (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'route not defined',
  });
};
exports.createUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'route not defined',
  });
};
exports.updateUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'route not defined',
  });
};

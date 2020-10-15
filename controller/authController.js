const { promisify } = require('util');

const jwt = require('jsonwebtoken');
const AppError = require('../utils/errorClass');

const User = require('../models/userModel');

const catchAsyncErrors = require('../utils/catchAsync');
const sendEmail = require('../utils/email');

const Jtoken = (id) =>
  jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRESIN,
  });

exports.signup = catchAsyncErrors(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = Jtoken(newUser._id);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  //check whether there they exist on the body sent
  if (!email || !password)
    return next(new AppError('Please provide email and password', 400));
  //.Check whether the  user exist  and password matches
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('Invalid email or password', 401));

  //.Send the JWT if everthing goes Ok.
  const loginToken = Jtoken(user.password);
  res.status(200).json({
    status: 'success',
    loginToken,
    data: {
      user: user,
    },
  });
};

exports.protect = catchAsyncErrors(async (req, res, next) => {
  //check the token in headers by first checking whether it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return next(new AppError('Please login to get access!', 401));

  //Verifying the token to check its integrity

  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError('The user does not exist', 401));
  }

  //check if user changed password

  if (currentUser.passwordChanged(decoded.iat))
    return next(new AppError('This password was recently changed', 401));
  req.user = currentUser;

  next();
});

exports.restrict = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You dont have the permission to perfom the action', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  //1. Get the user according to the posted Email
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError('Provide an Email please', 404));
  //2.Generate Random Reset Token
  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });
  //3.Send it to the user Email

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Please click the link below to reset your password ${resetURL}.\nIgnore if you didnt forget the password.`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your link expires in 15mins time',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent',
    });
  } catch (errors) {
    user.createPasswordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('Please try again later.A problem occured during reset', 500)
    );
  }
});

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {});

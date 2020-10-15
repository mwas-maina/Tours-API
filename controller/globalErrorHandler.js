const AppError = require('../utils/errorClass');

const handleCastDbError = (err) => {
  const msg = `Invalid ${err.path}:${err.value}`;
  return new AppError(msg, 400);
};

const handleDuplicateDb = (err) => {
  const value = err.keyValue.name;

  const msg = `A duplicate field /${value}/ identified.Use onother name istead `;
  return new AppError(msg, 400);
};

const handleValidationDb = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const msg = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(msg, 400);
};

const handleJsonWebTokenErr = () =>
  new AppError('Invalid  Token.Please login again', 401);

const handleTokenExpError = () => new AppError('The token  has expired ', 401);

const sendErrDev = (res, err) => {
  res.json({
    status: err.status,
    message: err.message,
    err: err,
    stack: err.stack,
  });
};

const sendErrProd = (res, err) => {
  if (err.isOperational) {
    res.json({
      status: err.status,
      message: err.message,
    });
  } else {
    //console.log(err);
    //SEND A GENERIC ERROR
    //AVOID LEAKING MUCH DATA TO CLIENT
    res.json({
      status: '500',
      message: 'Something went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  /*   console.log(err.statusCode); */

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';
  if (process.env.NODE_ENV === 'development') {
    sendErrDev(res, err);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.kind === 'ObjectId') error = handleCastDbError(error);

    if (error.code === 11000) error = handleDuplicateDb(error);
    if (error._message === 'Validation failed')
      error = handleValidationDb(error);
    if (error.name === 'JsonWebTokenError') error = handleJsonWebTokenErr();
    if (error.name === 'TokenExpiredError') error = handleTokenExpError();
    sendErrProd(res, error);
  }
};

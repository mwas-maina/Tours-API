const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/errorClass');

const globalErrCtrl = require('./controller/globalErrorHandler');

const tourRouter = require('./routes/tourRoutes');

const userRouter = require('./routes/userRoutes');

const app = express();

//MIDDLEWARES
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //logging
}

app.use(express.static(`${__dirname}/public`));

//MAPS OUR ROUTERS

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(` Could not get ${req.originalUrl} in the server!`, 404));
});
app.use(globalErrCtrl);

//Server
module.exports = app;

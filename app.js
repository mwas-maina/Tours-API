const express = require('express');
const morgan = require('morgan');
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

//Server
module.exports = app;

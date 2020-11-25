const mongoose = require('mongoose');

const dotenv = require('dotenv');

process.on('uncaughtException', () => {
  console.log(' Uncaught Exception.Exiting the panel.....');
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('connection established'));

//START OUR SERVER
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`listening at port:${port}`);
});

process.on('unhandledRejection', () => {
  console.log('Unhandled Rejection.The server is Shuttng down  .....');
  server.close(() => {
    process.exit(1);
  });
});

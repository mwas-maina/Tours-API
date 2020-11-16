const mongoose = require('mongoose');

const dotenv = require('dotenv');

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
app.listen(port, () => {
  //console.log(`listening at port:${port}`);
});

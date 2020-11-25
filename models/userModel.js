const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'You must include a Name'],
  },
  email: {
    type: String,
    required: [true, 'You must include an Email'],
    unique: true,
    lowercase: true,
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'You must include a password'],
    minlength: [4, 'A password must atleast have 4 characters'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Must include password Confirmation'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;

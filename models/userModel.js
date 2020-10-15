const mongoose = require('mongoose');
const crpto = require('crypto');
const bcrypt = require('bcryptjs');

const validator = require('validator');

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
    validate: [validator.isEmail, 'Must be be an email'],
  },
  photo: String,

  role: {
    type: String,
    enum: ['user', 'guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'You must include a password'],
    minlength: [4, 'A password must atleast have 4 characters'],
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, 'Must include password Confirmation'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password mismatch!Make sure sure the two passwords are same!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  enteredPassword,
  userPassword
) {
  return await bcrypt.compare(enteredPassword, userPassword);
};

userSchema.methods.passwordChanged = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimeStamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crpto.randomBytes(32).toString('hex');
  this.passwordResetToken = crpto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

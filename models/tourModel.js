const mongoose = require('mongoose');

//MONGOOSE SCHEMA
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'You must provide a name to continue'],
    unique: true,
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'Provide a price tag to continue'],
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have duration '],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have group size'],
  },
  description: {
    type: String,
    required: [true],
  },
  difficulty: {
    type: String,
    trim: true,
    required: [true, 'A tour must have the difficulty level'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description.summary'],
  },
  imageCover: {
    type: String,
    required: [true, 'Must have an image cover name'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});

const Tours = mongoose.model('Tour', tourSchema);

module.exports = Tours;

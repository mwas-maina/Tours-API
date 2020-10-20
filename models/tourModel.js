const mongoose = require('mongoose');

//const slugify = require('slugify');

//MONGOOSE SCHEMA
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'You must provide a name to continue'],
      unique: true,
      maxlength: [40, 'A tour name must be equal to 40 characters or less'],
      minlength: [10, 'A tour name must be atleast 10 characters'],
    },
    secretTour: {
      type: Boolean,
      default: false,
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Must have a rating greater 1.0'],
      max: [5, 'Must have a rating less than 5.0'],
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
      enum: {
        values: ['easy', 'difficult', 'medium'],
        message: 'A tour must have a difficulty',
      },
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return this.price > val;
        },
        message: ': {VALUE} is greater than the actual price ',
      },
    },
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
      select: false,
    },
    startDates: [Date],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
//DOCUMENT MIDDLEWARE BEFORE SAVING

/* tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
}); */

//QUERY MIDDLEWARE

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

//AGGREGATION MIDDLEWAREE

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tours = mongoose.model('Tour', tourSchema);

module.exports = Tours;

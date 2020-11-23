const Tour = require('../models/tourModel');

const AppError = require('../utils/errorClass');

const APIfeatures = require('../utils/apiFeatures');

const catchAsyncErrors = require('../utils/catchAsync');

exports.aliasTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,difficulty,duration,description';
  next();
};

exports.PostTours = catchAsyncErrors(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tours: newTour,
    },
  });
});

exports.GetTour = catchAsyncErrors(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  // Tour.findOne({ _id: req.params.id })

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.DeleteTour = catchAsyncErrors(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    const tourErr = next(new AppError('not found', 404));
    return tourErr;
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.UpdateTour = catchAsyncErrors(async (req, res, next) => {
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({
    status: 'success',
    data: {
      tour: updatedTour,
    },
  });
});

exports.GetAll = catchAsyncErrors(async (req, res, next) => {
  //AWAIT THE QUERY
  const features = new APIfeatures(
    Tour.find() /* Gets all in database */,
    req.query //the parameters in url after ?
  )
    .filter()
    .sort()
    .limitFields()
    .pagination();
  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    count: tours.length,
    data: {
      tours,
    },
  });
});

exports.getStats = catchAsyncErrors(async (req, res, next) => {
  const Stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        num: { $sum: 1 },
        avgRatings: {
          $avg: '$ratingsAverage',
        },
        price: {
          $avg: '$price',
        },
        maxPrice: {
          $max: '$price',
        },
        minPrice: {
          $min: '$price',
        },
      },
    },
    {
      $sort: { avgRatings: 1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    //count: tours.length,
    data: {
      Stats,
    },
  });
});

exports.getMonthlyPlan = catchAsyncErrors(async (req, res, next) => {
  const year = req.params.year * 1;

  const Plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}/01/01`),
          $lte: new Date(`${year}/12/31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    { $addFields: { month: '$_id' } },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numTours: -1,
      },
    },
  ]);
  res.status(200).json({
    status: 'success',

    data: {
      Plan,
    },
  });
});

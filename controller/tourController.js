const Tour = require('../models/tourModel');
const APIfeatures = require('../utils/apiFeatures');

exports.aliasTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,difficulty,duration,description';
  next();
};

exports.PostTours = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tours: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.GetTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};
exports.DeleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
exports.UpdateTour = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      message: error,
    });
  }
};

exports.GetAll = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      message: error,
    });
  }
};

exports.getStats = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      message: error,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  const year = req.params.year * 1;
  try {
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
  } catch (error) {
    res.status(404).json({
      message: error,
    });
  }
};

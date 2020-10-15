const express = require('express');

const authController = require('../controller/authController');

const router = express.Router();
const tourController = require('../controller/tourController');

//router.param('id', tourController.checkId);
router.route('/tour-stats').get(tourController.getStats);
router
  .route('/top-5-cheap')
  .get(tourController.aliasTours, tourController.GetAll);

router
  .route('/')
  .get(authController.protect, tourController.GetAll)
  .post(tourController.PostTours);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/:id')
  .get(tourController.GetTour)
  .delete(
    authController.protect,
    authController.restrict('admin'),
    tourController.DeleteTour
  )
  .patch(tourController.UpdateTour);
module.exports = router;

const express = require('express');

const router = express.Router();
const tourController = require('../controller/tourController');

//router.param('id', tourController.checkId);
router.route('/').get(tourController.GetAll).post(tourController.PostTours);
router
  .route('/:id')
  .get(tourController.GetTour)
  .delete(tourController.DeleteTour)
  .patch(tourController.UpdateTour);
module.exports = router;

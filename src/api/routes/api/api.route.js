const router = require('express').Router();
const apiController = require('./api.controller');
const authorize = require('../../middlewares/api_authorize');

router.route('/booking-request')
.post(authorize,apiController.createBookingRequest)

router.route('/trip')
.post(authorize,apiController.createTrip)

module.exports = router;
const router = require('express').Router();
const controller = require('./trucker-clearance.controller')
const authorize = require('../../middlewares/authorize');

router.route('/')
.post(authorize,controller.submitTrip)

router.route('/select')
.get(authorize,controller.getTruckersSelect)

router.route('/trucker')
.get(authorize,controller.getTruckers)

module.exports = router;
const router = require('express').Router();
const controller = require('./select.controller');

router.route('/role')
.get(controller.getRole)

module.exports = router;
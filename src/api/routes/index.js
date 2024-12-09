const router = require('express').Router();
const auth = require('./auth/auth.route');
const truckerClearance = require('./trucker-clearance/trucker-clearance.route')

router.use('/auth',auth )
router.use('/trucker-clearance', truckerClearance)

module.exports = router;
const router = require('express').Router();
const auth = require('./auth/auth.route');
const user = require('./user/user.route');
const role = require('./role/role.route')
const select = require('./select/select.route');

const api = require('./api/api.route');

router.use('/auth',auth )
router.use('/user',user )
router.use('/role', role)
router.use('/select', select)

router.use('/api', api)


module.exports = router;
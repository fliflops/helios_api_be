const router = require('express').Router();
const controller = require('./auth.controller');

router.post('/login',controller.login)
router.post('/token', controller.apiLogin)
router.post('/token/refresh', controller.refreshToken)


module.exports = router;
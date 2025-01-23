const router = require('express').Router();
const controller = require('./user.controller');
const authorize = require('../../middlewares/authorize');

router.get('/',controller.getPaginatedUser);
router.post('/',authorize,controller.createUser);

router.put('/details/:id', authorize, controller.updateUser);
router.put('/password/:username', authorize, controller.updatePassword);

router.post('/app-key', controller.generateAppKey);
router.post('/password', controller.generatePassword);

router.get('/session', authorize, controller.getRedisSession);
router.delete('/session', authorize, controller.killSession)

router.get('/routes', authorize, controller.getAssignedRoutes);
router.get('/logs', authorize, controller.getUserRequestLogs)


module.exports = router;
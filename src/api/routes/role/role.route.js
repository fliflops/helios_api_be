const router = require('express').Router();
const roleController = require('./role.controller');
const authorize = require('../../middlewares/authorize');

router.route('/')
.get(authorize,roleController.getPaginatedRole)
.post(authorize,roleController.createRole);


router.get('/routes', authorize, roleController.getRoutes);

router.get('/routes/:role_id',authorize,roleController.getRoleDetails);
router.put('/routes/:role_id',authorize, roleController.updateRole);

module.exports = router;
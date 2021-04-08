const express = require('express');

const router = express.Router();

const PreUserController = require('../controllers/preUser.controller');

const permission = require('../middlewares/permission.middleware');
const { ADMIN } = require('../enums/permission.enum');

router.post('/', permission(ADMIN), PreUserController.create);
router.get('/', permission(ADMIN), PreUserController.getAll);
router.get('/:preUserId', permission(ADMIN), PreUserController.getById);
router.delete('/:preUserId', permission(ADMIN), PreUserController.remove);

module.exports = router;

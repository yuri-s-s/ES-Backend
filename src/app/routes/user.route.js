const express = require('express');

const router = express.Router();

const UserController = require('../controllers/user.controller');

const permission = require('../middlewares/permission.middleware');
const { ADMIN } = require('../enums/permission.enum');

router.get('/', permission(ADMIN), UserController.getAll);
router.get('/:userId', permission(ADMIN), UserController.getById);
router.delete('/:userId', permission(ADMIN), UserController.remove);
router.put('/:userId', permission(ADMIN), UserController.update);

module.exports = router;

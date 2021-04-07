const express = require('express');

const router = express.Router();

const UserController = require('../controllers/user.controller');

router.post('/', UserController.createUser);
router.get('/', UserController.getAll);
router.get('/:userId', UserController.getById);
router.delete('/:userId', UserController.remove);
router.put('/:userId', UserController.update);

module.exports = router;

const express = require('express');

const router = express.Router();

const PreUserController = require('../controllers/preUser.controller');

router.post('/', PreUserController.create);
router.get('/', PreUserController.getAll);
router.get('/:preUserId', PreUserController.getById);
router.delete('/:preUserId', PreUserController.remove);

module.exports = router;

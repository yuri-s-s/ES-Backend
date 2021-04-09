const express = require('express');

const router = express.Router();

const SlotController = require('../controllers/slot.controller');

const permission = require('../middlewares/permission.middleware');
const { MANAGER } = require('../enums/permission.enum');

router.post(
  '/calendar/:calendarId',
  permission(MANAGER),
  SlotController.create,
);

router.get(
  '/calendar/:calendarId/existSlot',
  permission(MANAGER),
  SlotController.verifySlot,
);

module.exports = router;

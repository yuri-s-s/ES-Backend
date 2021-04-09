const express = require('express');

const router = express.Router();

const SlotController = require('../controllers/slot.controller');

const permission = require('../middlewares/permission.middleware');
const { MANAGER, CLIENT } = require('../enums/permission.enum');

router.post(
  '/calendar/:calendarId',
  permission(MANAGER),
  SlotController.create,
);

router.post(
  '/:slotId/calendar/:calendarId/user/:userId/firstAssociate',
  permission(CLIENT),
  SlotController.associateUserFirstSlot,
);

router.get(
  '/calendar/:calendarId/existSlot',
  permission(MANAGER),
  SlotController.verifySlot,
);

module.exports = router;

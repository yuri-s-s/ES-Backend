const express = require('express');

const router = express.Router({ mergeParams: true });

const SlotController = require('../controllers/slot.controller');

const permission = require('../middlewares/permission.middleware');
const { MANAGER, CLIENT } = require('../enums/permission.enum');

router.post('/', permission(MANAGER), SlotController.create);

router.post(
  '/:slotId/user/:userId/firstAssociate',
  permission(CLIENT),
  SlotController.associateUserFirstSlot,
);

router.delete(
  '/:slotId/removeSlot',
  permission(MANAGER),
  SlotController.removeSlot,
);

router.post(
  '/:slotId/user/:userId/secondAssociate',
  permission(CLIENT),
  SlotController.associateUserSecondSlot,
);

router.get('/existSlot', permission(MANAGER), SlotController.verifySlot);
router.get('/', permission(CLIENT), SlotController.getSlotsByCalendar);

module.exports = router;

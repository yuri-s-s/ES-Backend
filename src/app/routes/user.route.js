const express = require('express');

const router = express.Router();

const UserController = require('../controllers/user.controller');
const SlotController = require('../controllers/slot.controller');

const permission = require('../middlewares/permission.middleware');
const { ADMIN, CLIENT } = require('../enums/permission.enum');

router.get('/', permission(ADMIN), UserController.getAll);
router.get('/:userId', permission(ADMIN), UserController.getById);
router.get(
  '/:userId/station',
  permission(ADMIN),
  UserController.getStationByUser,
);
router.delete('/:userId', permission(ADMIN), UserController.remove);
router.put('/:userId', permission(ADMIN), UserController.update);
router.put(
  '/:userId/alterPassword',
  permission(CLIENT),
  UserController.alterPassword,
);
router.put(
  '/:userId/associateStation/:stationId',
  permission(ADMIN),
  UserController.associateManagerStation,
);
router.put(
  '/:userId/removeAssociateStation',
  permission(ADMIN),
  UserController.removeAssociateManagerStation,
);
router.put(
  '/:userId/cancel/:slotId/',
  permission(CLIENT),
  SlotController.cancelAppointment,
);

module.exports = router;

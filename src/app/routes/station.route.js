const express = require('express');

const router = express.Router();

const StationController = require('../controllers/station.controller');

const permission = require('../middlewares/permission.middleware');
const { ADMIN, CLIENT } = require('../enums/permission.enum');

router.post('/', permission(ADMIN), StationController.create);
router.get('/:stationId', permission(CLIENT), StationController.getById);
router.get(
  '/:stationId/details',
  permission(CLIENT),
  StationController.getWithCalendar,
);
router.get('/', permission(CLIENT), StationController.getAll);
router.put('/:stationId', permission(ADMIN), StationController.update);
router.delete('/:stationId', permission(ADMIN), StationController.remove);

module.exports = router;

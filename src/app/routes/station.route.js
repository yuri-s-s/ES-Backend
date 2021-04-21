const express = require('express');

const router = express.Router();

const StationController = require('../controllers/station.controller');

const VaccineRoute = require('./vaccine.route');
const CalendarRoute = require('./calendar.route');

const permission = require('../middlewares/permission.middleware');
const { ADMIN, CLIENT } = require('../enums/permission.enum');

router.use('/:stationId/vaccine/', VaccineRoute);
router.use('/:stationId/calendar/', CalendarRoute);

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
router.post(
  '/:stationId/vaccine/:vaccineId/user/:userId/firstVaccine',
  permission(CLIENT),
  StationController.insertFirstVaccine,
);
router.post(
  '/:stationId/vaccine/:vaccineId/user/:userId/secondVaccine',
  permission(CLIENT),
  StationController.insertSecondVaccine,
);
module.exports = router;

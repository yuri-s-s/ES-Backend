const express = require('express');

const router = express.Router({ mergeParams: true });

const CalendarController = require('../controllers/calendar.controller');

const SlotRoute = require('./slot.route');

const permission = require('../middlewares/permission.middleware');
const { CLIENT } = require('../enums/permission.enum');

router.use('/:calendarId/slot/', SlotRoute);

router.get(
  '/:calendarId',
  permission(CLIENT),
  CalendarController.getCalendarWithSlots,
);

module.exports = router;

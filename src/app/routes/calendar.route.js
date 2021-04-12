const express = require('express');

const router = express.Router();

const CalendarController = require('../controllers/calendar.controller');

const permission = require('../middlewares/permission.middleware');
const { MANAGER, CLIENT } = require('../enums/permission.enum');

router.post('/', permission(MANAGER), CalendarController.create);
router.get(
  '/:calendarId',
  permission(CLIENT),
  CalendarController.getCalendarWithSlots,
);

module.exports = router;

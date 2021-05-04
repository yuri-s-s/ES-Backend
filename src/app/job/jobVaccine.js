const cron = require('node-cron');

const SlotController = require('../controllers/slot.controller');

const jobVaccine = cron.schedule('0 23 * * *', SlotController.expiredJob);

module.exports = {
  jobVaccine,
};

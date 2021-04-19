const express = require('express');

const router = express.Router({ mergeParams: true });

const VaccineController = require('../controllers/vaccine.controller');

const permission = require('../middlewares/permission.middleware');
const { MANAGER } = require('../enums/permission.enum');

router.post('/', permission(MANAGER), VaccineController.create);

router.put(
  '/:vaccineId/add',
  permission(MANAGER),
  VaccineController.addVaccines,
);

module.exports = router;

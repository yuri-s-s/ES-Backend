const express = require('express');

const router = express.Router({ mergeParams: true });

const VaccineController = require('../controllers/vaccine.controller');

const permission = require('../middlewares/permission.middleware');
const { MANAGER } = require('../enums/permission.enum');

router.post('/', permission(MANAGER), VaccineController.create);

router.get('/', permission(MANAGER), VaccineController.getByStation);

router.put(
  '/:vaccineId/add',
  permission(MANAGER),
  VaccineController.addVaccines,
);

router.put(
  '/:vaccineId/edit',
  permission(MANAGER),
  VaccineController.editVaccine,
);

module.exports = router;

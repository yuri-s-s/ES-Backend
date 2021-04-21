const { Vaccine } = require('../models');

const create = async (data) => {
  console.log(data);
  const vaccine = await Vaccine.create(data);

  if (!vaccine) {
    return null;
  }

  return vaccine;
};

const getById = async (vaccineId) => {
  const vaccine = await Vaccine.findByPk(vaccineId);

  if (!vaccine) {
    return null;
  }

  return vaccine;
};

const addVaccines = async (data) => {
  const { stationId, vaccineId, quantity } = data;

  const vaccine = await Vaccine.findOne({
    where: {
      stationId,
      id: vaccineId,
    },
  });

  if (!vaccine) {
    return null;
  }

  let quantityVaccines = vaccine.dataValues.quantity;

  quantityVaccines += quantity;

  await vaccine.update({
    quantity: quantityVaccines,
  });

  return vaccine;
};

const decrementVaccines = async (vaccineId) => {
  const vaccine = await Vaccine.findByPk(vaccineId);

  if (!vaccine) {
    return null;
  }

  let quantityVaccines = vaccine.dataValues.quantity;

  quantityVaccines -= 1;

  await vaccine.update({
    quantity: quantityVaccines,
  });

  return vaccine;
};

module.exports = {
  create,
  getById,
  addVaccines,
  decrementVaccines,
};

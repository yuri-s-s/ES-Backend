const { Vaccine } = require('../models');

const create = async (data) => {
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

const editVaccine = async (data) => {
  const { stationId, vaccineId, name } = data;

  const vaccine = await Vaccine.findOne({
    where: {
      stationId,
      id: vaccineId,
    },
  });

  if (!vaccine) {
    return null;
  }

  await vaccine.update({
    name,
  });

  return vaccine;
};

const getByStation = async (stationId, query) => {
  const page = parseInt(query.page, 10);
  const pageSize = parseInt(query.pageSize, 10);
  let offset = null;
  let vaccines = null;

  if (page && pageSize) offset = (page - 1) * pageSize;

  if (offset !== null) {
    const options = {
      limit: pageSize,
      offset,
      distinct: true,
      order: [['id', 'ASC']],
      where: {
        stationId,
      },
    };
    vaccines = await Vaccine.findAndCountAll(options);

    vaccines.pages = Math.ceil(vaccines.count / pageSize);
  } else {
    vaccines = await Vaccine.findAll({
      where: {
        stationId,
      },
      order: [['id', 'ASC']],
    });
  }

  if (!vaccines) {
    return null;
  }

  return vaccines;
};

module.exports = {
  create,
  getById,
  addVaccines,
  decrementVaccines,
  editVaccine,
  getByStation,
};

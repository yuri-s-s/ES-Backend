const { Op } = require('sequelize');

const {
  Station, Calendar, Slot, User, Vaccine,
} = require('../models');

const create = async (data) => {
  const station = await Station.create(data);

  if (!station) {
    return null;
  }

  return station;
};

const getById = async (stationId) => {
  const station = await Station.findByPk(stationId, {
    include: [
      {
        model: Calendar,
        as: 'calendar',
      },
      {
        model: Vaccine,
        as: 'vaccines',
      },
    ],
  });

  if (!station) {
    return null;
  }

  return station;
};

const getWithCalendar = async (stationId) => {
  const station = await Station.findByPk(stationId, {
    include: [
      {
        model: Calendar,
        as: 'calendar',
        include: [
          {
            model: Slot,
            as: 'slots',
            attributes: ['id', 'initialDate', 'finalDate', 'qtdVaccine'],
            include: [
              {
                model: User,
                as: 'users',
                attributes: ['id', 'name', 'cpf'],
              },
            ],
          },
        ],
      },
      {
        model: Vaccine,
        as: 'vaccines',
      },
    ],
  });

  if (!station) {
    return null;
  }

  return station;
};

const update = async (stationId, data) => {
  const station = await Station.findByPk(stationId);

  if (!station) {
    return null;
  }

  await station.update(data);

  return station;
};

const getAll = async (query) => {
  const {
    name, zipCode, state, city, district, address,
  } = query;

  let where = {};

  if (name) {
    where = {
      ...where,
      name: {
        [Op.iLike]: `%${name}%`,
      },
    };
  }

  if (zipCode) {
    where = {
      ...where,
      zipCode: {
        [Op.iLike]: `%${zipCode}%`,
      },
    };
  }

  if (state) {
    where = {
      ...where,
      state: {
        [Op.iLike]: `%${state}%`,
      },
    };
  }

  if (city) {
    where = {
      ...where,
      city: {
        [Op.iLike]: `%${city}%`,
      },
    };
  }

  if (district) {
    where = {
      ...where,
      district: {
        [Op.iLike]: `%${district}%`,
      },
    };
  }

  if (address) {
    where = {
      ...where,
      address: {
        [Op.iLike]: `%${address}%`,
      },
    };
  }

  const page = parseInt(query.page, 10);
  const pageSize = parseInt(query.pageSize, 10);
  let offset = null;
  let station = null;

  if (page && pageSize) offset = (page - 1) * pageSize;

  if (offset !== null) {
    const options = {
      limit: pageSize,
      offset,
      distinct: true,
      where,
    };
    station = await Station.findAndCountAll(options);

    station.pages = Math.ceil(station.count / pageSize);
  } else {
    station = await Station.findAll({
      where,
    });
  }

  if (!station) {
    return null;
  }

  return station;
};

const remove = async (stationId) => {
  const station = await Station.findByPk(stationId);

  if (!station) {
    return null;
  }

  await station.destroy();

  return station;
};

const addVaccines = async (data) => {
  const { stationId, quantity } = data;

  const station = await Station.findByPk(stationId);

  if (!station) {
    return null;
  }

  let quantityVaccines = station.dataValues.qtdVaccine;

  quantityVaccines += quantity;

  await station.update({
    qtdVaccine: quantityVaccines,
  });

  return station;
};

const removeVaccines = async (data) => {
  const { stationId, quantity } = data;

  const station = await Station.findByPk(stationId);

  if (!station) {
    return null;
  }

  let quantityVaccines = station.dataValues.qtdVaccine;

  quantityVaccines -= quantity;

  await station.update({
    qtdVaccine: quantityVaccines,
  });

  return station;
};

module.exports = {
  create,
  getById,
  update,
  getAll,
  remove,
  getWithCalendar,
  addVaccines,
  removeVaccines,
};

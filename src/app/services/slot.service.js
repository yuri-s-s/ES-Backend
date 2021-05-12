const dayjs = require('dayjs');
const { Op } = require('sequelize');
const { Slot, User } = require('../models');

const create = async (data) => {
  const slot = await Slot.create(data);

  if (!slot) {
    return null;
  }

  return slot;
};

const verifySlotExist = async (calendarId, initialDate) => {
  const slot = await Slot.findOne({
    where: {
      calendarId,
      initialDate,
    },
  });

  if (!slot) {
    return null;
  }

  return slot;
};

const getSlot = async (calendarId, slotId) => {
  const slot = await Slot.findOne({
    where: {
      calendarId,
      id: slotId,
    },
  });

  if (!slot) {
    return null;
  }

  return slot;
};

const removeSlot = async (slotId) => {
  const slot = await Slot.findByPk(slotId, {
    include: {
      model: User,
      as: 'users',
    },
  });

  if (slot.users.length > 0) {
    return null;
  }

  await slot.destroy();

  return slot;
};

const getVaccineAvailableBySlot = async (slotId) => {
  const slot = await Slot.findOne({
    where: {
      id: slotId,
    },
    include: [
      {
        model: User,
        as: 'users',
        attributes: ['id'],
      },
    ],
  });

  const quantity = slot.qtdVaccine - slot.users.length;

  if (quantity <= 0) {
    return false;
  }

  return true;
};

const updateVaccineQuantity = async (slotId) => {
  const slot = Slot.findOne({
    where: {
      id: slotId,
    },
  });

  if (!slot) {
    return null;
  }

  const vaccineAvailable = slot.qtdVaccine + 1;
  await slot.update({
    quantity: vaccineAvailable,
  });

  return slot;
};

async function getSlotsByDate() {
  const date = dayjs(new Date()).subtract(3, 'hour');
  const endDate = dayjs(date).subtract(1, 'day').toDate();
  const initialDate = dayjs(date).subtract(2, 'day').toDate();

  const slots = await Slot.findAll({
    where: {
      [Op.and]: [
        {
          finalDate: {
            [Op.lte]: endDate,
          },
        },
        {
          initialDate: {
            [Op.gte]: initialDate,
          },
        },
      ],
    },
  });

  return slots;
}

async function getSlotsByCalendar(calendarId, query) {
  const { initialDate, endDate } = query;

  const newInitialDate = dayjs(
    dayjs(initialDate).format('YYYY-MM-DD 00:00:00.000 +00:00'),
  )
    .add(1, 'day')
    .toDate();
  const newEndDate = dayjs(
    dayjs(endDate).format('YYYY-MM-DD 00:00:00.000 +00:00'),
  )
    .add(1, 'day')
    .toDate();

  let where = {
    calendarId,
  };

  if (initialDate && endDate) {
    where = {
      ...where,
      [Op.and]: [
        {
          initialDate: {
            [Op.between]: [newInitialDate, newEndDate],
          },
        },
      ],
    };
  }

  const page = parseInt(query.page, 10);
  const pageSize = parseInt(query.pageSize, 10);
  let offset = null;
  let slots = null;

  if (page && pageSize) offset = (page - 1) * pageSize;

  if (offset !== null) {
    const options = {
      limit: pageSize,
      offset,
      distinct: true,
      order: [['id', 'ASC']],
      where,
    };
    slots = await Slot.findAndCountAll(options);

    slots.pages = Math.ceil(slots.count / pageSize);
  } else {
    slots = await Slot.findAll({
      where,
      order: [['id', 'ASC']],
    });
  }

  if (!slots) {
    return null;
  }

  return slots;
}

module.exports = {
  create,
  verifySlotExist,
  getSlot,
  getVaccineAvailableBySlot,
  updateVaccineQuantity,
  getSlotsByDate,
  removeSlot,
  getSlotsByCalendar,
};

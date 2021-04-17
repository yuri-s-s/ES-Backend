const { Calendar, Slot, User } = require('../models');

const create = async (stationId) => {
  const calendar = await Calendar.create({ stationId });

  if (!calendar) {
    return null;
  }

  return calendar;
};

const getById = async (calendarId) => {
  const calendar = await Calendar.findByPk(calendarId);

  if (!calendar) {
    return null;
  }

  return calendar;
};

const getCalendarWithSlots = async (calendarId) => {
  const calendar = await Calendar.findByPk(calendarId, {
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
  });

  if (!calendar) {
    return null;
  }

  return calendar;
};

module.exports = {
  create,
  getById,
  getCalendarWithSlots,
};

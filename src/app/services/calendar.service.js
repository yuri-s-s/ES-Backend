const { Calendar, Slot } = require('../models');

const create = async () => {
  const calendar = await Calendar.create();

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

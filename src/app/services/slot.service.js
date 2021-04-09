const { Slot } = require('../models');

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

module.exports = {
  create,
  verifySlotExist,
};

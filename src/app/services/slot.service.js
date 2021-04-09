const { Slot } = require('../models');

const create = async (data) => {
  const slot = await Slot.create(data);

  if (!slot) {
    return null;
  }

  return slot;
};

module.exports = {
  create,
};

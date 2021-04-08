const { PreUser } = require('../models');

const create = async (data) => {
  const preUser = await PreUser.create(data);

  if (!preUser) {
    return null;
  }

  return preUser;
};

const getAll = async () => {
  const users = await PreUser.findAll({
    attributes: ['id', 'cpf', 'completed'],
  });

  if (!users) {
    return null;
  }

  return users;
};

const getById = async (id) => {
  const preUser = await PreUser.findByPk(id, {
    attributes: ['id', 'cpf', 'completed'],
  });

  if (!preUser) {
    return null;
  }

  return preUser;
};

const getByCpf = async (cpf) => {
  const preUser = await PreUser.findOne({
    attributes: ['id', 'cpf', 'completed'],
    where: {
      cpf,
    },
  });

  if (!preUser) {
    return null;
  }

  return preUser;
};

const remove = async (id) => {
  const preUser = await PreUser.findByPk(id, {
    attributes: ['id', 'cpf', 'completed'],
  });

  if (!preUser) {
    return null;
  }

  await preUser.destroy();

  return preUser;
};

const update = async (id) => {
  const preUser = await PreUser.findByPk(id);

  if (!preUser) {
    return null;
  }

  await preUser.update({ completed: true });

  return preUser;
};

module.exports = {
  create,
  getAll,
  getById,
  getByCpf,
  remove,
  update,
};

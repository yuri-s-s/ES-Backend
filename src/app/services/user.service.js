const { User } = require('../models');

const createUser = async (data) => {
  const user = await User.create(data);

  if (!user) {
    return null;
  }

  delete user.dataValues.passwordHash;
  delete user.dataValues.password;

  return user;
};

const getAll = async () => {
  const users = await User.findAll({
    attributes: ['id', 'name', 'email', 'cpf'],
  });

  if (!users) {
    return null;
  }

  return users;
};

const getById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: ['id', 'name', 'email', 'cpf'],
  });

  if (!user) {
    return null;
  }

  return user;
};

const getByCpf = async (cpf) => {
  const user = await User.findOne({
    attributes: ['id', 'name', 'email', 'cpf'],
    where: {
      cpf,
    },
  });

  if (!user) {
    return null;
  }

  return user;
};

const remove = async (id) => {
  const user = await User.findByPk(id, {
    attributes: ['id', 'name', 'email', 'cpf'],
  });

  if (!user) {
    return null;
  }

  await user.destroy();

  return user;
};

const update = async (id, name) => {
  const user = await User.findByPk(id, {
    attributes: ['id', 'name', 'email', 'cpf'],
  });

  if (!user) {
    return null;
  }

  await user.update({ name });

  return user;
};

module.exports = {
  createUser,
  getAll,
  getById,
  getByCpf,
  remove,
  update,
};

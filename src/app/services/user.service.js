const { Op } = require('sequelize');

const { User } = require('../models');
const util = require('./util.service');

const create = async (data) => {
  const user = await User.create(data);

  if (!user) {
    return null;
  }

  delete user.dataValues.passwordHash;
  delete user.dataValues.password;

  return {
    user,
    token: util.generateToken({ id: user.id, email: user.email }),
  };
};

const getAll = async (query) => {
  const {
    name, email, cpf, role,
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

  if (email) {
    where = {
      ...where,
      email: {
        [Op.iLike]: `%${email}%`,
      },
    };
  }

  if (cpf) {
    where = {
      ...where,
      cpf: {
        [Op.iLike]: `%${cpf}%`,
      },
    };
  }

  if (role) {
    where = {
      ...where,
      role,
    };
  }

  const page = parseInt(query.page, 10);
  const pageSize = parseInt(query.pageSize, 10);
  let offset = null;
  let users = null;

  if (page && pageSize) offset = (page - 1) * pageSize;

  if (offset !== null) {
    const options = {
      limit: pageSize,
      offset,
      distinct: true,
      attributes: ['id', 'name', 'email', 'cpf', 'role', 'preUserId'],
      where,
    };
    users = await User.findAndCountAll(options);

    users.pages = Math.ceil(users.count / pageSize);
  } else {
    users = await User.findAll({
      attributes: ['id', 'name', 'email', 'cpf', 'role', 'preUserId'],
      where,
    });
  }

  if (!users) {
    return null;
  }

  return users;
};

const getById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: ['id', 'name', 'email', 'cpf', 'role'],
  });

  if (!user) {
    return null;
  }

  return user;
};

const getByCpf = async (cpf) => {
  const user = await User.findOne({
    attributes: ['id', 'name', 'email', 'cpf', 'role'],
    where: {
      cpf,
    },
  });

  if (!user) {
    return null;
  }

  return user;
};

const getByEmail = async (email) => {
  const user = await User.findOne({
    attributes: ['id'],
    where: {
      email,
    },
  });

  if (!user) {
    return null;
  }

  return user;
};

const remove = async (id) => {
  const user = await User.findByPk(id, {
    attributes: ['id', 'name', 'email', 'cpf', 'role'],
  });

  if (!user) {
    return null;
  }

  await user.destroy();

  return user;
};

const update = async (id, name) => {
  const user = await User.findByPk(id, {
    attributes: ['id', 'name', 'email', 'cpf', 'role'],
  });

  if (!user) {
    return null;
  }

  await user.update({ name });

  return user;
};

const updateRole = async (id, role, preUserId) => {
  const user = await User.findByPk(id, {
    attributes: ['id', 'name', 'email', 'cpf', 'role'],
  });

  if (!user) {
    return null;
  }

  await user.update({ role, preUserId });

  return user;
};

module.exports = {
  create,
  getAll,
  getById,
  getByCpf,
  getByEmail,
  remove,
  update,
  updateRole,
};

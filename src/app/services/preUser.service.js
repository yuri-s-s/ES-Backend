const { Op } = require('sequelize');

const { PreUser } = require('../models');

const create = async (data) => {
  const preUser = await PreUser.create(data);

  if (!preUser) {
    return null;
  }

  return preUser;
};

const getAll = async (query) => {
  const { cpf, completed } = query;

  let where = {};

  if (cpf) {
    where = {
      ...where,
      cpf: {
        [Op.iLike]: `%${cpf}%`,
      },
    };
  }

  if (completed !== undefined) {
    where = {
      ...where,
      completed: completed === 'true',
    };
  }

  const page = parseInt(query.page, 10);
  const pageSize = parseInt(query.pageSize, 10);
  let offset = null;
  let preUsers = null;

  if (page && pageSize) offset = (page - 1) * pageSize;

  if (offset !== null) {
    const options = {
      limit: pageSize,
      offset,
      distinct: true,
      attributes: ['id', 'cpf', 'completed'],
      where,
    };
    preUsers = await PreUser.findAndCountAll(options);

    preUsers.pages = Math.ceil(preUsers.count / pageSize);
  } else {
    preUsers = await PreUser.findAll({
      attributes: ['id', 'cpf', 'completed'],
      where,
    });
  }

  if (!preUsers) {
    return null;
  }

  return preUsers;
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

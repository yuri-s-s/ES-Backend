const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { User, Station } = require('../models');
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
      attributes: [
        'id',
        'name',
        'email',
        'cpf',
        'role',
        'preUserId',
        'stationId',
      ],
      where,
      order: [['id', 'ASC']],
    };
    users = await User.findAndCountAll(options);

    users.pages = Math.ceil(users.count / pageSize);
  } else {
    users = await User.findAll({
      attributes: [
        'id',
        'name',
        'email',
        'cpf',
        'role',
        'preUserId',
        'stationId',
      ],
      where,
      order: [['id', 'ASC']],
    });
  }

  if (!users) {
    return null;
  }

  return users;
};

const getById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: [
      'id',
      'name',
      'email',
      'cpf',
      'role',
      'firstSlotId',
      'secondSlotId',
      'stationId',
      'firstVaccine',
      'secondVaccine',
      'firstVaccineDate',
      'secondVaccineDate',
    ],
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

const getByToken = async (token) => {
  const user = await User.findOne({
    attributes: ['id', 'passwordResetExpires'],
    where: {
      passwordResetToken: token,
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

const removeFirstSlotId = async (id) => {
  const user = await User.findByPk(id, {
    attributes: ['id', 'name', 'firstSlotId', 'secondSlotId'],
  });

  if (!user) {
    return null;
  }

  await user.update({ firstSlotId: null });

  return user;
};

const removeSecondSlotId = async (id) => {
  const user = await User.findByPk(id, {
    attributes: ['id', 'name', 'firstSlotId', 'secondSlotId'],
  });

  if (!user) {
    return null;
  }

  await user.update({ secondSlotId: null });

  return user;
};

const associateUserFirstSlot = async (slotId, userId) => {
  const user = await User.findByPk(userId);

  await user.update({
    firstSlotId: slotId,
  });

  return user;
};

const associateUserSecondSlot = async (slotId, userId) => {
  const user = await User.findByPk(userId);

  await user.update({
    secondSlotId: slotId,
  });

  return user;
};

const checkPassword = async (password, id) => {
  const user = await User.findByPk(id);

  const verifyPassword = await bcrypt.compare(password, user.passwordHash);

  if (!verifyPassword) {
    return null;
  }

  return true;
};

const alterPassword = async (id, password) => {
  const user = await User.findByPk(id);

  if (!user) {
    return null;
  }

  await user.update({
    passwordResetToken: null,
    passwordResetExpires: null,
    password,
  });

  delete user.dataValues.password;
  delete user.dataValues.passwordHash;
  delete user.dataValues.updatedAt;
  delete user.dataValues.createdAt;
  delete user.dataValues.passwordResetToken;
  delete user.dataValues.passwordResetExpires;

  return user;
};

const updateToken = async (id, data) => {
  const user = await User.findByPk(id);
  const { passwordResetToken, passwordResetExpires } = data;

  if (!user) {
    return null;
  }

  await user.update({ passwordResetToken, passwordResetExpires });

  delete user.dataValues.password;
  delete user.dataValues.passwordHash;
  delete user.dataValues.updatedAt;
  delete user.dataValues.createdAt;
  delete user.dataValues.passwordResetToken;
  delete user.dataValues.passwordResetExpires;

  return user;
};

const associateManagerStation = async (userId, stationId) => {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'name', 'email', 'cpf', 'role', 'stationId'],
  });

  if (!user) {
    return null;
  }

  await user.update({ stationId });

  return user;
};

const removeAssociateManagerStation = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'name', 'email', 'cpf', 'role', 'stationId'],
  });

  if (!user) {
    return null;
  }

  await user.update({ stationId: null });

  return user;
};

const getStationByUser = async (id) => {
  const user = await User.findByPk(id, {
    attributes: [
      'id',
      'name',
      'email',
      'cpf',
      'role',
      'firstSlotId',
      'stationId',
    ],
    include: [
      {
        model: Station,
        as: 'managerStation',
      },
    ],
  });

  if (!user) {
    return null;
  }

  return user;
};

const insertFirstVaccine = async (id, vaccineName) => {
  const user = await User.findByPk(id, {
    attributes: [
      'id',
      'name',
      'email',
      'cpf',
      'role',
      'firstVaccine',
      'secondVaccine',
      'firstVaccineDate',
      'secondVaccineDate',
    ],
  });

  if (!user) {
    return null;
  }

  await user.update({
    firstVaccine: vaccineName,
    firstVaccineDate: new Date(),
  });

  return user;
};

const insertSecondVaccine = async (id, vaccineName) => {
  const user = await User.findByPk(id, {
    attributes: [
      'id',
      'name',
      'email',
      'cpf',
      'role',
      'firstVaccine',
      'secondVaccine',
      'firstVaccineDate',
      'secondVaccineDate',
    ],
  });

  if (!user) {
    return null;
  }

  await user.update({
    secondVaccine: vaccineName,
    secondVaccineDate: new Date(),
  });

  return user;
};

const updateFirstSlotId = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    return null;
  }

  await user.update({
    firstSlotId: null,
  });

  return user;
};

const updateSecondSlotId = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    return null;
  }

  await user.update({
    secondSlotId: null,
  });

  return user;
};

const getBySlot = async (slotId) => {
  const users = await User.findAndCountAll({
    where: {
      [Op.or]: [{ firstSlotId: slotId }, { secondSlotId: slotId }],
    },
  });

  return users;
};

module.exports = {
  create,
  getAll,
  getById,
  getByCpf,
  getByEmail,
  getByToken,
  remove,
  update,
  updateRole,
  removeFirstSlotId,
  removeSecondSlotId,
  associateUserFirstSlot,
  checkPassword,
  alterPassword,
  updateToken,
  associateManagerStation,
  removeAssociateManagerStation,
  getStationByUser,
  insertFirstVaccine,
  associateUserSecondSlot,
  insertSecondVaccine,
  updateFirstSlotId,
  updateSecondSlotId,
  getBySlot,
};

const bcrypt = require('bcryptjs');

const util = require('./util.service');
const { User } = require('../models');

const authenticate = async (data) => {
  try {
    const { email, password } = data;

    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'name', 'cpf', 'email', 'passwordHash'],
    });

    if (!user) {
      throw new Error('Usuário passado não encontrado');
    }

    if (!(await bcrypt.compare(password, user.dataValues.passwordHash))) {
      throw new Error('Senha incorreta');
    }

    delete user.dataValues.passwordHash;

    return {
      user,
      token: util.generateToken({ id: user.id, email: user.email }),
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  authenticate,
};

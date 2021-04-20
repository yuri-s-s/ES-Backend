const crypto = require('crypto');
const UserService = require('../services/user.service');
const PreUserService = require('../services/preUser.service');
const EmailService = require('../services/email.service');
const StationService = require('../services/station.service');

function validateEmail(email) {
  const validate = /\S+@\S+\.\S+/;

  return validate.test(email);
}

function validateCpf(cpf) {
  const newCpf = cpf.replace(/[^\d]/g, '');

  return newCpf;
}

function validatePassword(password) {
  if (password.length < 8) {
    return false;
  }
  if (/^[a-zA-Z0-9]+$/.test(password)) {
    return true;
  }
  return false;
}

const create = async (req, res) => {
  try {
    const {
      name, email, cpf, password,
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'O nome é obrigatório' });
    }

    if (!email) {
      return res.status(400).json({ error: 'O email é obrigatório' });
    }

    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({ error: 'O formato do email passado está invalido' });
    }

    if (!cpf) {
      return res.status(400).json({ error: 'O cpf é obrigatório' });
    }

    const newCpf = validateCpf(cpf);

    if (newCpf.length !== 11) {
      return res.status(400).json({ error: 'O cpf passado está invalido' });
    }

    if (!password) {
      return res.status(400).json({ error: 'A senha é obrigatória' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        error:
          'A senha deve conter pelo menos 8 caracteres, uma letra maiuscula e um numero',
      });
    }

    const verifyUser = await UserService.getByCpf(newCpf);

    if (verifyUser) {
      return res
        .status(400)
        .json({ error: 'Já existe um usuário com esse cpf' });
    }

    const verifyUserByEmail = await UserService.getByEmail(email);

    if (verifyUserByEmail) {
      return res
        .status(400)
        .json({ error: 'Já existe um usuário com esse email' });
    }

    let data = {
      name,
      email,
      cpf: newCpf,
      password,
    };

    const verifyPreUser = await PreUserService.getByCpf(newCpf);

    if (verifyPreUser && !verifyPreUser.completed) {
      data = {
        ...data,
        role: 'manager',
        preUserId: verifyPreUser.id,
      };

      await PreUserService.update(verifyPreUser.id);
    } else {
      data = {
        ...data,
        role: 'client',
      };
    }

    const user = await UserService.create(data);

    if (!user) {
      return res
        .status(400)
        .json({ error: 'Não foi possível criar o novo usuário' });
    }

    return res.status(201).json({ user });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

const getAll = async (req, res) => {
  try {
    const users = await UserService.getAll(req.query);

    if (!users) {
      return res.status(404).json({ error: 'Nenhum usuário foi encontrado' });
    }

    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

const getById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await UserService.getById(userId);

    if (!user) {
      return res.status(404).json({ error: 'O usuário não foi encontrado' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

const remove = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await UserService.remove(userId);

    if (!user) {
      return res.status(404).json({ error: 'O usuário não foi encontrado' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

const update = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name } = req.body;

    const user = await UserService.update(userId, name);

    if (!user) {
      return res.status(404).json({ error: 'O usuário não foi encontrado' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

const alterPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { password, newPassword } = req.body;

    const user = await UserService.getById(userId);

    if (!user) {
      return res.status(404).json({ error: 'O usuário não foi encontrado' });
    }

    const verifyPassword = await UserService.checkPassword(password, userId);

    if (!verifyPassword) {
      return res
        .status(401)
        .json({ error: 'A senha informada não corresponde a senha atual.' });
    }

    const validation = validatePassword(newPassword);

    if (!validation) {
      return res.status(400).json({
        error:
          'A senha deve conter pelo menos 8 caracteres, uma letra maiuscula e um numero',
      });
    }

    const newUser = await UserService.alterPassword(userId, newPassword);

    return res.status(200).json({ newUser });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserService.getByEmail(email);

    if (!user) {
      return res.status(404).json({ error: 'O usuário não foi encontrado' });
    }

    const token = await crypto.randomBytes(20).toString('hex');
    const now = new Date();
    now.setHours(now.getHours() + 1);

    const data = {
      passwordResetToken: token,
      passwordResetExpires: now,
    };

    await UserService.updateToken(user.id, data);

    await EmailService.sendEmail(email, token);

    return res.status(200).json({ msg: 'Email enviado para o usuario' });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.query;
    const { password } = req.body;

    const user = await UserService.getByToken(token);

    if (!user) {
      return res.status(401).json({ error: 'O token passado é inválido' });
    }

    const now = new Date();

    if (now > user.dataValues.passwordResetExpires) {
      return res.status(401).json({ error: 'O token passado expirou' });
    }

    const validation = validatePassword(password);

    if (!validation) {
      return res.status(400).json({
        error:
          'A senha deve conter pelo menos 8 caracteres, uma letra maiuscula e um numero',
      });
    }

    const newUser = await UserService.alterPassword(
      user.dataValues.id,
      password,
    );

    if (!newUser) {
      return res
        .status(500)
        .json({ error: 'Erro ao atualizar a senha do usuario' });
    }

    return res.status(200).json({ newUser });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

const associateManagerStation = async (req, res) => {
  try {
    const { userId, stationId } = req.params;

    const user = await UserService.getById(userId);

    if (!user) {
      return res.status(404).json({ error: 'O usuário não foi encontrado' });
    }

    if (user.stationId) {
      return res
        .status(404)
        .json({ error: 'O usuário já é gerente de outro posto' });
    }

    if (user.role !== 'manager') {
      return res
        .status(404)
        .json({ error: 'O tipo do usuário deve ser gerente' });
    }

    const station = await StationService.getById(stationId);

    if (!station) {
      return res.status(404).json({ error: 'O posto não foi encontrado' });
    }

    const newAssociate = await UserService.associateManagerStation(
      userId,
      stationId,
    );

    return res.status(200).json({ newAssociate });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

const removeAssociateManagerStation = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await UserService.getById(userId);

    if (!user) {
      return res.status(404).json({ error: 'O usuário não foi encontrado' });
    }

    const removeAssociate = await UserService.removeAssociateManagerStation(
      userId,
    );

    return res.status(200).json({ removeAssociate });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

const getStationByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await UserService.getStationByUser(userId);

    if (!user) {
      return res.status(404).json({ error: 'O usuário não foi encontrado' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  remove,
  update,
  alterPassword,
  forgotPassword,
  resetPassword,
  associateManagerStation,
  removeAssociateManagerStation,
  getStationByUser,
};

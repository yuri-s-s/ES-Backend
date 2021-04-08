const PreUserService = require('../services/preUser.service');
const UserService = require('../services/user.service');

function validateCpf(cpf) {
  const newCpf = cpf.replace(/[^\d]/g, '');

  return newCpf;
}

const create = async (req, res) => {
  try {
    const { cpf } = req.body;

    if (!cpf) {
      return res.status(400).json({ error: 'O cpf é obrigatório' });
    }

    const newCpf = validateCpf(cpf);

    if (newCpf.length !== 11) {
      return res.status(400).json({ error: 'O cpf passado está invalido' });
    }

    const verifyPreUser = await PreUserService.getByCpf(newCpf);

    if (verifyPreUser) {
      return res
        .status(400)
        .json({ error: 'Já existe um pre usuário com esse cpf' });
    }

    let data = {
      cpf: newCpf,
    };

    const verifyUser = await UserService.getByCpf(newCpf);

    if (verifyUser) {
      data = {
        ...data,
        completed: true,
      };
    } else {
      data = {
        ...data,
        completed: false,
      };
    }

    const preUser = await PreUserService.create(data);

    if (!preUser) {
      return res
        .status(400)
        .json({ error: 'Não foi possível criar o novo pre usuário' });
    }

    if (verifyUser) {
      await UserService.updateRole(verifyUser.id, 'manager', preUser.id);
    }

    return res.status(201).json({ preUser });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

const getAll = async (req, res) => {
  try {
    const preUsers = await PreUserService.getAll(req.query);

    if (!preUsers) {
      return res
        .status(404)
        .json({ error: 'Nenhum pre usuário foi encontrado' });
    }

    return res.status(200).json({ preUsers });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

const getById = async (req, res) => {
  try {
    const { preUserId } = req.params;

    const preUser = await PreUserService.getById(preUserId);

    if (!preUser) {
      return res
        .status(404)
        .json({ error: 'O pre usuário não foi encontrado' });
    }

    return res.status(200).json({ preUser });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

const remove = async (req, res) => {
  try {
    const { preUserId } = req.params;

    const preUser = await PreUserService.remove(preUserId);

    if (!preUser) {
      return res
        .status(404)
        .json({ error: 'O pre usuário não foi encontrado' });
    }

    const verifyUser = await UserService.getByCpf(preUser.cpf);

    if (verifyUser) {
      await UserService.updateRole(verifyUser.id, 'client', null);
    }

    return res.status(200).json({ preUser });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  remove,
};

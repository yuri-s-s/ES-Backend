/* eslint-disable consistent-return */

const jwt = require('jsonwebtoken');

const { User } = require('../models');

const authConfig = require('../../config/auth');

const login = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).send({
        error: 'O token é obrigatório',
      });
    }

    const parts = authHeader.split(' ');

    if (!parts.lenght === 2) {
      return res.status(401).send({
        error: 'token error ',
      });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).send({
        error: 'token malformatted',
      });
    }

    if (!token) {
      return res.status(401).send({
        error: 'O token é obrigatório',
      });
    }
    const decoded = await jwt.verify(token, authConfig.secret);

    if (decoded) {
      await User.findByPk(decoded.id).then((user) => {
        req.user = user;
        return next();
      });
    }
  } catch (error) {
    return res.status(401).send({
      error: 'Você não está autorizado a realizar esta ação',
    });
  }
};

module.exports = { login };

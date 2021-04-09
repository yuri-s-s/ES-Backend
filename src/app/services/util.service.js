const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const authConfig = require('../../config/auth.js');

const generateToken = (params = {}) => jwt.sign(params, authConfig.secret, {
  expiresIn: 5086400,
});

const isValidDate = (date) => dayjs(date).isValid();

const isCurrentDate = (initialDate, finalDate) => dayjs(initialDate).isAfter(finalDate);

module.exports = { generateToken, isValidDate, isCurrentDate };

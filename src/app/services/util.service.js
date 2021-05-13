const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const authConfig = require('../../config/auth.js');

const generateToken = (params = {}) => jwt.sign(params, authConfig.secret, {
  expiresIn: 5086400,
});

const isValidDate = (date) => dayjs(date).isValid();

const isCurrentDate = (initialDate, finalDate) => dayjs(initialDate).isAfter(finalDate);

const paginate = (array, pageSize, page) => array.slice((page - 1) * pageSize, page * pageSize);

module.exports = {
  generateToken, isValidDate, isCurrentDate, paginate,
};

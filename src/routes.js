const express = require('express');

const router = express.Router();

const UserRoute = require('./app/routes/user.route');

router.get('/', (req, res) => {
  res.send(`API rodando em ${process.env.BASE_URL || 3000}`);
});

router.use('/user', UserRoute);

module.exports = router;

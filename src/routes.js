const express = require('express');

const router = express.Router();

const UserRoute = require('./app/routes/user.route');
const PreUserRoute = require('./app/routes/preUser.route');

router.get('/', (req, res) => {
  res.send(`API rodando em ${process.env.BASE_URL || 3000}`);
});

router.use('/user', UserRoute);
router.use('/preUser', PreUserRoute);

module.exports = router;

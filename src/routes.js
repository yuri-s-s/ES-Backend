const express = require('express');

const router = express.Router();

const AuthMiddleware = require('./app/middlewares/auth.middleware');

const AuthRoute = require('./app/routes/auth.route');
const RegisterRoute = require('./app/routes/register.route');
const UserRoute = require('./app/routes/user.route');
const PreUserRoute = require('./app/routes/preUser.route');
const ResetPassword = require('./app/routes/resetPassword.route');
const StationRoute = require('./app/routes/station.route');

// public routes

router.get('/', (req, res) => {
  res.send(`API rodando em ${process.env.BASE_URL || 3000}`);
});

router.use('/auth', AuthRoute);
router.use('/user', RegisterRoute);
router.use('/password', ResetPassword);

// private routes

router.use(AuthMiddleware.login);
router.use('/user', UserRoute);
router.use('/preUser', PreUserRoute);
router.use('/station', StationRoute);

module.exports = router;

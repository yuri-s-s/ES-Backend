const Roles = require('../enums/role.enum');

module.exports = function (permissionValue) {
  return async function (req, res, next) {
    try {
      switch (req.user.role) {
        case Roles.CLIENT:
          if (permissionValue <= 1) return next();
          break;
        case Roles.MANAGER:
          if (permissionValue <= 2) return next();
          break;
        case Roles.ADMIN:
          return next();
        default:
          break;
      }
      return res
        .status(401)
        .json({ erro: 'Você não tem permissão para realizar esta ação' });
    } catch (e) {
      return res
        .status(401)
        .json({ erro: 'Você não tem permissão para realizar esta ação' });
    }
  };
};

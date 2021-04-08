const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PreUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PreUser.hasOne(models.User, { foreignKey: 'preUserId', as: 'user' });
    }
  }
  PreUser.init(
    {
      cpf: DataTypes.STRING,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'PreUser',
    },
  );
  return PreUser;
};

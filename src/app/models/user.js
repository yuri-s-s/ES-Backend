/* eslint no-param-reassign: "error" */

const bcrypt = require('bcryptjs');

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.PreUser, {
        foreignKey: 'preUserId',
        as: 'preUser',
      });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      cpf: DataTypes.STRING,
      passwordHash: DataTypes.STRING,
      role: DataTypes.STRING,
      password: DataTypes.VIRTUAL,
    },

    {
      sequelize,
      modelName: 'User',
    },
  );

  User.addHook('beforeSave', async (user) => {
    if (user.password) {
      user.passwordHash = await bcrypt.hash(user.password, 5);
    }

    return user;
  });

  return User;
};

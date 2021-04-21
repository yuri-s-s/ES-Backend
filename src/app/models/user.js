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
      User.belongsTo(models.Slot, {
        foreignKey: 'firstSlotId',
        as: 'slot',
      });
      User.belongsTo(models.Slot, {
        foreignKey: 'secondSlotId',
        as: 'secondSlot',
      });
      User.belongsTo(models.Station, {
        foreignKey: 'stationId',
        as: 'managerStation',
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
      passwordResetToken: DataTypes.STRING,
      passwordResetExpires: DataTypes.DATE,
      firstVaccine: DataTypes.STRING,
      secondVaccine: DataTypes.STRING,
      firstVaccineDate: DataTypes.DATE,
      secondVaccineDate: DataTypes.DATE,
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

  User.prototype.checkPassword = function (password) {
    return bcrypt.compare(password, this.passwordHash);
  };

  return User;
};

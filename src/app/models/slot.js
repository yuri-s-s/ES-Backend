const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Slot extends Model {
    static associate(models) {
      Slot.belongsTo(models.Calendar, {
        foreignKey: 'calendarId',
        as: 'calendar',
      });
      Slot.hasMany(models.User, {
        foreignKey: 'firstSlotId',
        as: 'users',
      });
    }
  }
  Slot.init(
    {
      initialDate: DataTypes.DATE,
      finalDate: DataTypes.DATE,
      qtdVaccine: DataTypes.INTEGER,
      priority: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Slot',
    },
  );
  return Slot;
};

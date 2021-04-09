const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Slot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Slot.belongsTo(models.Calendar, {
        foreignKey: 'calendarId',
        as: 'calendar',
      });
    }
  }
  Slot.init(
    {
      initialDate: DataTypes.DATE,
      finalDate: DataTypes.DATE,
      qtdVaccine: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Slot',
    },
  );
  return Slot;
};

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Calendar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Calendar.hasMany(models.Slot, { foreignKey: 'calendarId', as: 'slots' });
      Calendar.belongsTo(models.Station, {
        foreignKey: 'stationId',
        as: 'station',
      });
    }
  }
  Calendar.init(
    {
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Calendar',
    },
  );
  return Calendar;
};

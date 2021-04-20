const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Station extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Station.hasOne(models.Calendar, {
        foreignKey: 'stationId',
        as: 'calendar',
      });
      Station.hasMany(models.Vaccine, {
        foreignKey: 'stationId',
        as: 'vaccines',
      });
      Station.hasMany(models.User, {
        foreignKey: 'stationId',
        as: 'users',
      });
    }
  }
  Station.init(
    {
      name: DataTypes.STRING,
      zipCode: DataTypes.STRING,
      state: DataTypes.STRING,
      city: DataTypes.STRING,
      district: DataTypes.STRING,
      address: DataTypes.STRING,
      qtdVaccine: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Station',
    },
  );
  return Station;
};

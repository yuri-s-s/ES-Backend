const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Vaccine extends Model {
    static associate(models) {
      Vaccine.belongsTo(models.Station, {
        foreignKey: 'stationId',
        as: 'station',
      });
    }
  }
  Vaccine.init(
    {
      name: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Vaccine',
    },
  );
  return Vaccine;
};

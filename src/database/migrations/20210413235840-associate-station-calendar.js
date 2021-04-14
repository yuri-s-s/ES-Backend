module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Calendars', 'stationId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Stations',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Calendars', 'stationId');
  },
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'stationId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Stations',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Users', 'stationId');
  },
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Slots', 'priority', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Slots', 'priority');
  },
};

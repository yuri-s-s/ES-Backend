module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'firstSlotId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Slots',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Users', 'firstSlotId');
  },
};

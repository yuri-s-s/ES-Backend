module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'role', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'client',
    });
    await queryInterface.addColumn('Users', 'preUserId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'PreUsers',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('Users', 'role');
    await queryInterface.removeColumn('Users', 'preUserId');
  },
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'firstVaccine', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'secondVaccine', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'firstVaccineDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'secondVaccineDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Users', 'firstVaccine');
    await queryInterface.removeColumn('Users', 'secondVaccine');
    await queryInterface.removeColumn('Users', 'firstVaccineDate');
    await queryInterface.removeColumn('Users', 'secondVaccineDate');
  },
};

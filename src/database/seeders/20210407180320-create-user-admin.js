/* eslint-disable no-console */

const bcrypt = require('bcryptjs');

const ADMIN_USER = {
  role: 'admin',
  name: 'ADMIN VACINIMIN',
  email: 'admin@vacinimin.com',
  cpf: '00000000000',
  createdAt: new Date(),
  updatedAt: new Date(),
};

module.exports = {
  up: async (queryInterface) => {
    ADMIN_USER.passwordHash = await bcrypt.hash('12345', 5);
    const existingUsers = await queryInterface.rawSelect(
      'Users',
      { where: { cpf: ADMIN_USER.cpf } },
      ['id'],
    );
    if (!existingUsers || existingUsers.length === 0) {
      await queryInterface.bulkInsert('Users', [ADMIN_USER], {});
    } else {
      console.log(
        `Usuário '${ADMIN_USER.name}' com o cpf '${ADMIN_USER.cpf}' já existe.`,
      );
    }
  },

  down: (queryInterface) => queryInterface.bulkDelete('Users', null, {}),
};

'use strict'
const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashPassword = await bcrypt.hash('12345678', 10)
    await queryInterface.bulkInsert('Admins', [{
      name: 'root',
      email: 'root@example.com',
      password: hashPassword,
      created_at: new Date(),
      updated_at: new Date()
    }])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Admins', null)
  }
}

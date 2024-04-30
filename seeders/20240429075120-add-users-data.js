'use strict'
const bcrypt = require('bcryptjs')
const { faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const getHashPassword = await bcrypt.hash('123456', 10)

    const users = Array.from({ length: 15 }).map((_, index) => ({
      name: `user-${index + 1}`,
      email: `user-${index + 1}@example.com`,
      password: getHashPassword,
      nation: faker.location.country(),
      avatar: faker.image.avatar(),
      introduction: faker.lorem.paragraph({ min: 1, max: 3 }),
      is_teacher: true,
      created_at: new Date(),
      updated_at: new Date()
    }))

    const randomIndexes = new Set()

    for (let i = 0; i < 5; i++) {
      let randomIndex
      do {
        randomIndex = Math.floor(Math.random() * users.length)
      } while (randomIndexes.has(randomIndex))

      users[randomIndex].is_teacher = false

      randomIndexes.add(randomIndex)
    }

    await queryInterface.bulkInsert('Users', users)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null)
  }
}

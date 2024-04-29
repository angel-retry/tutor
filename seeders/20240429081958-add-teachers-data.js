'use strict'
const { faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 取得在資料庫中使用者為老師的資料
    const users = await queryInterface.sequelize.query('SELECT id FROM Users WHERE is_teacher = true', { type: queryInterface.sequelize.QueryTypes.SELECT })

    // 塞入假資料
    const teachers = users.map(user => (
      {
        id: user.id,
        course_description: faker.lorem.paragraph({ min: 1, max: 3 }),
        teaching_method: faker.lorem.paragraph({ min: 1, max: 3 }),
        video_link: 'https://meet.google.com/',
        lesson_duration: faker.helpers.arrayElement([30, 60]),
        available_days: JSON.stringify(faker.helpers.arrayElements([0, 1, 2, 3, 4, 5, 6], { min: 2, max: 5 })),
        created_at: new Date(),
        updated_at: new Date()
      }
    ))

    await queryInterface.bulkInsert('Teachers', teachers)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Teachers', null)
  }
}

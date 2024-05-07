'use strict'
const { faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 取得lessons資料，當中包含id、teacher_id、student_id
    // 在lesson取得最後20筆資料(在lesson data最後匯入的20筆即是為了給ratings用的)
    const historyLessons = await queryInterface.sequelize.query('SELECT id, teacher_id, student_id FROM Lessons WHERE Lessons.start_time < CURDATE() ORDER BY id DESC LIMIT 20', { type: queryInterface.sequelize.QueryTypes.SELECT })

    // 對過去課程做處理
    const RatingData = historyLessons.map(lesson => ({
      lesson_id: lesson.id,
      teacher_id: lesson.teacher_id,
      student_id: lesson.student_id,
      rating: faker.number.float({ min: 1.0, max: 5.0, multipleOf: 0.1 }),
      comment: faker.lorem.sentence(),
      created_at: new Date(),
      updated_at: new Date()
    }))
    await queryInterface.bulkInsert('Ratings', RatingData)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Ratings', null)
  }
}

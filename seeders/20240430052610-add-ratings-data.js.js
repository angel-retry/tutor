'use strict'
const { faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 取得lessons資料，當中包含id、teacher_id、student_id
    const historyLessons = await queryInterface.sequelize.query('SELECT id, teacher_id, student_id FROM Lessons WHERE Lessons.start_time < CURDATE()', { type: queryInterface.sequelize.QueryTypes.SELECT })

    // 存取放入rating資料
    const RatingData = []
    // 建立map，檢查teacherIds有沒有超過兩個
    const checkTeacherRatingIds = new Map()

    // 對過去課程做處理
    historyLessons.forEach(lesson => {
      // 取得checkTeacherRatingIds存放的teacher_id
      const teacherRatingIds = checkTeacherRatingIds.get(lesson.teacher_id) || 0
      if (teacherRatingIds < 2) {
        // 設定checkTeacherRatingIds存放teacher_id與它的次數
        checkTeacherRatingIds.set(lesson.teacher_id, teacherRatingIds + 1)
        RatingData.push(
          {
            lesson_id: lesson.id,
            teacher_id: lesson.teacher_id,
            student_id: lesson.student_id,
            rating: faker.number.float({ min: 1.0, max: 5.0, precision: 0.1 }),
            comment: faker.lorem.sentence(),
            created_at: new Date(),
            updated_at: new Date()
          })
      }
    })
    await queryInterface.bulkInsert('Ratings', RatingData)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Ratings', null)
  }
}

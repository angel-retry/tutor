'use strict'
const { faker } = require('@faker-js/faker')
const dayjs = require('dayjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 取得老師
    const teachers = await queryInterface.sequelize.query(
      'SELECT id , lesson_duration FROM Teachers',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const students = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE is_teacher = false',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const getStudentRandomId = (students) => {
      return students[Math.floor(Math.random() * students.length)].id
    }

    const getTeacherRandomId = (teachers) => {
      return teachers[Math.floor(Math.random() * teachers.length)].id
    }

    const yesterday = dayjs().subtract(1, 'day').toDate()
    const nextTwoWeekDate = dayjs().add(14, 'day').toDate()

    const getStartTimeAndEndTime = (date, duration) => {
      const year = date.getFullYear()
      const month = date.getMonth()
      const day = date.getDate()
      const hour = faker.helpers.arrayElement([18, 19, 20])
      const minute = '00'
      const lessonDuration = duration || faker.helpers.arrayElement([30, 60])
      const startTime = new Date(year, month, day, hour, minute, 0)
      const endTime = dayjs(startTime).add(lessonDuration, 'minutes').toDate()
      return { startTime, endTime }
    }

    // 每個老師未來至少有2個new lesson
    for (let i = 0; i < 2; i++) {
      // 取得老師未來兩周的新課程
      const nextTwoWeeksLessons = teachers.map(teacher => {
        const teacherId = teacher.id
        const studentId = getStudentRandomId(students)
        // 取得隨機日期(從今天到未來兩周)
        const randomDate = faker.date.between({ from: new Date(), to: nextTwoWeekDate })

        // 取得startTime和endTime，加入目前老師的lesson_duration，算出上課結束時間(endTime)
        const { startTime, endTime } = getStartTimeAndEndTime(randomDate, teacher.lesson_duration)

        // 回傳以下資料
        return {
          teacher_id: teacherId,
          student_id: studentId,
          start_time: startTime,
          end_time: endTime,
          created_at: new Date(),
          updated_at: new Date()
        }
      })
      await queryInterface.bulkInsert('Lessons', nextTwoWeeksLessons, {})
    }

    // 檢查學生不能重覆到老師，型態為物件陣列，{studentId: [teacherId1, teacherId2]}
    const checkStudentTeacherRecords = {}

    // 每位同學都有兩堂課可以評分
    for (let i = 0; i < 2; i++) {
      const studentHistoryLessons = students.map(student => {
        const studentId = student.id
        const randomDate = faker.date.between({ from: new Date('2023-01-01'), to: yesterday })
        const { startTime, endTime } = getStartTimeAndEndTime(randomDate)

        // 取得隨機老師Id，檢查學生不可以重複抽選到同一位老師
        let teacherId
        do {
          // 取得隨機老師ID
          teacherId = getTeacherRandomId(teachers)
          // 有重複就再次隨機一次
        } while (checkStudentTeacherRecords[studentId] && checkStudentTeacherRecords[studentId].includes(teacherId))
        // 假如目前checkStudentTeacherRecords沒有學生Id資料(key值)，先初始化，值為空陣列(才能塞value值)
        if (!checkStudentTeacherRecords[studentId]) {
          checkStudentTeacherRecords[studentId] = []
        }
        // 將隨機抽到的老師塞入value陣列值
        checkStudentTeacherRecords[studentId].push(teacherId)

        return {
          student_id: studentId,
          teacher_id: teacherId,
          start_time: startTime,
          end_time: endTime,
          created_at: new Date(),
          updated_at: new Date()
        }
      })
      await queryInterface.bulkInsert('Lessons', studentHistoryLessons)
    }

    // 每個老師都有兩個評價，為ratings使用而累積的資料
    for (let i = 0; i < 2; i++) {
      // 取得每位老師過去課程資料
      const teacherHistoryLessons = teachers.map(teacher => {
        const teacherId = teacher.id
        const randomDate = faker.date.between({ from: new Date('2023-01-01'), to: yesterday })
        const { startTime, endTime } = getStartTimeAndEndTime(randomDate)

        // 取得隨機學生Id，檢查學生不可以重複抽選到同一位老師
        let studentId
        do {
          studentId = getStudentRandomId(students)
        } while (checkStudentTeacherRecords[studentId] && checkStudentTeacherRecords[studentId].includes(teacherId))
        if (!checkStudentTeacherRecords[studentId]) {
          checkStudentTeacherRecords[studentId] = []
        }
        checkStudentTeacherRecords[studentId].push(teacherId)

        return {
          teacher_id: teacherId,
          student_id: studentId,
          start_time: startTime,
          end_time: endTime,
          created_at: new Date(),
          updated_at: new Date()
        }
      })

      await queryInterface.bulkInsert('Lessons', teacherHistoryLessons)
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Lessons', null)
  }
}

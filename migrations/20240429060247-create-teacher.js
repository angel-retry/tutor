'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Teachers', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      course_description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      teaching_method: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      video_link: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lesson_duration: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      available_days: {
        type: Sequelize.JSON,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Teachers')
  }
}

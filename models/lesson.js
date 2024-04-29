'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Lesson extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Lesson.belongsTo(models.Teacher, { foreignKey: 'teacher_id' })
      Lesson.belongsTo(models.User, { foreignKey: 'student_id' })
      Lesson.hasMany(models.Rating, { foreignKey: 'lesson_id' })
    }
  }
  Lesson.init({
    teacherId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Teachers',
        key: 'id'
      }
    },
    studentId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Lesson',
    tableName: 'Lessons',
    underscored: true
  })
  return Lesson
}

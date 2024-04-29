'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Rating.belongsTo(models.Teacher, { foreignKey: 'teacherId' })
      Rating.belongsTo(models.User, { foreignKey: 'studentId' })
      Rating.belongsTo(models.Lesson, { foreignKey: 'lessonId' })
    }
  }
  Rating.init({
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
    lessonId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Lessons',
        key: 'id'
      }
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Rating',
    tableName: 'Ratings',
    underscored: true
  })
  return Rating
}

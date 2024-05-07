'use strict'
const {
  Model
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Teacher.belongsTo(models.User, { foreignKey: 'id' })
      Teacher.hasMany(models.Lesson, { foreignKey: 'teacherId' })
      Teacher.hasMany(models.Rating, { foreignKey: 'teacherId' })
    }
  }
  Teacher.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false,
      allowNull: false
    },
    courseDescription: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    teachingMethod: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    videoLink: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lessonDuration: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    availableDays: {
      type: DataTypes.JSON,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Teacher',
    tableName: 'Teachers',
    underscored: true
  })

  return Teacher
}

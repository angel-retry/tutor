const { Rating, Lesson, Teacher, User } = require('../models')

const ratingControllers = {
  postRating: (req, res, next) => {
    const userId = req.user.id
    const teacherId = Number(req.params.teacherId)
    const { rating, comment, lessonId } = req.body
    if (!rating || !comment) throw new Error('請評分和寫評論!')
    if (!lessonId) throw new Error('沒有取得課堂資料!')
    console.log({ userId, teacherId, rating: Number(rating), comment, lessonId })
    Promise.all([
      Rating.findOne({
        where: {
          studentId: userId,
          teacherId,
          lessonId
        }
      }),
      Lesson.findByPk(lessonId)
    ])

      .then(([ratingData, lesson]) => {
        if (ratingData) throw new Error('已評過這位老師了!')
        if (!lesson) throw new Error('沒有這堂課資料!')
        return Rating.create({
          studentId: userId,
          teacherId,
          rating: Number(rating),
          comment,
          lessonId
        })
      })
      .then(() => {
        Lesson.findByPk(lessonId, {
          attributes: ['start_time', 'end_time'],
          include: [
            {
              model: Teacher,
              attributes: ['id'],
              include: [
                { model: User, attributes: ['id', 'name'] }
              ]
            }
          ]
        })
          .then(newRatingLessonData => {
            newRatingLessonData = newRatingLessonData.toJSON()
            console.log('newRatingLessonData', newRatingLessonData)
            const newRatingData = {
              teacherId: newRatingLessonData.Teacher.id,
              teacherName: newRatingLessonData.Teacher.User.name,
              startTime: newRatingLessonData.start_time,
              endTime: newRatingLessonData.end_time,
              rating,
              comment
            }
            const ratingJsonString = JSON.stringify(newRatingData)
            const ratingJson = JSON.parse(ratingJsonString)
            console.log('ratingJsonString', ratingJsonString)
            console.log('ratingJson', ratingJson)
            req.flash('add_rating_success', ratingJsonString)
            return res.redirect(`/users/${userId}`)
          })
      })
      .catch(err => next(err))
  }
}

module.exports = ratingControllers

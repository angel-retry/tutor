const { Rating, Lesson, Teacher, User } = require('../models')

const ratingControllers = {
  postRating: (req, res, next) => {
    const userId = req.user.id
    const teacherId = Number(req.params.teacherId)
    const { rating, comment, lessonId } = req.body
    if (!rating || !comment) throw new Error('請評分和寫評論!')
    if (!lessonId) throw new Error('沒有取得課堂資料!')

    Promise.all([
      Rating.findOne({
        where: {
          studentId: userId,
          teacherId,
          lessonId
        }
      }),
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
    ])
      .then(([ratingData, lesson]) => {
        if (ratingData) throw new Error('已評過這位老師了!')
        if (!lesson) throw new Error('沒有這堂課資料!')
        // 查出沒有評分過這位老師且有這堂課就可以評分這位老師
        Rating.create({
          studentId: userId,
          teacherId,
          rating: Number(rating),
          comment,
          lessonId
        })
          .then(() => {
            // 回傳評分成功的資料
            const newRatingLessonData = lesson.toJSON()
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
          .catch(err => next(err))
      })
      .catch(err => next(err))
  }
}

module.exports = ratingControllers

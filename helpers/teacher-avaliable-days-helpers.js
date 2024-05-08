const dayjs = require('dayjs')

const getTeacherAvailableDates = (days) => {
  const today = dayjs()
  // 未來兩周後的日子
  const nextTwoWeeksDate = today.add(2, 'week')

  // 老師未來兩周可以上課的日子
  const futureDates = []

  // 迴圈繞出今天到未來兩周的天數，是否符合老師可以上課的時間
  for (let currentDate = today; currentDate.isBefore(nextTwoWeeksDate); currentDate = currentDate.add(1, 'day')) {
    days.forEach(day => {
      if (currentDate.day() === day && currentDate.isAfter(today)) {
        futureDates.push(currentDate.toDate())
      }
    })
  }
  return futureDates
}

const getStartTimeAndEndTime = (date, durationTime, startHour = 18, endHours = 21) => {
  const startTime = dayjs(date).hour(startHour).minute(0).second(0)
  const endTime = dayjs(date).hour(endHours).minute(0).second(0)

  const timeSlots = []

  let currentStartTime = startTime

  while (currentStartTime.isBefore(endTime)) {
    const nextEndTime = currentStartTime.add(durationTime, 'minutes')

    timeSlots.push({
      startTime: currentStartTime.toDate(),
      endTime: nextEndTime.toDate()
    })

    currentStartTime = nextEndTime
  }

  return timeSlots
}

// 可預約課程去掉已預約課程
const getFilterAvailableSlots = (availableSlots, bookedLessons) => {
  // 取得無重疊時段，把老師的課程一一檢查
  const nonOverLappingSlots = availableSlots.filter(slot => {
    // 取得重疊時段，將老師的課程與已預約課程時段檢查
    const isOverLappingSlots = bookedLessons.some(lesson => {
      return (
        // 課程開始時間>=已預約課程開始時間 並且 課程結束時間 小於 已預約課程結束時間
        (slot.startTime >= lesson.startTime && slot.startTime < lesson.endTime) ||
        // 課程結束時間 > 已預約課程開始時間 並且 課程結束時間 <= 已預約課程結束時間
        (slot.endTime > lesson.startTime && slot.endTime <= lesson.endTime) ||
        (slot.startTime <= lesson.startTime && slot.endTime >= lesson.endTime)
      )
    })
    // 回傳不重疊的時間點
    return !isOverLappingSlots
  })

  return nonOverLappingSlots
}

module.exports = {
  getTeacherAvailableDates,
  getStartTimeAndEndTime,
  getFilterAvailableSlots
}

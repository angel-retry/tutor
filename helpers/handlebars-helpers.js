const dayjs = require('dayjs')
const localeZh = require('dayjs/locale/zh-cn')

dayjs.locale(localeZh)

module.exports = {
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },
  specifiedStartTime: function (date) {
    date = dayjs(date)
    const formattedDate = date.format('YYYY/MM/DD dddd HH:mm')
    return formattedDate
  },
  specifiedEndTime: function (date) {
    date = dayjs(date)
    const formattedDate = date.format('HH:mm')
    return formattedDate
  },
  ifIncludes: function (arrs, index, options) {
    if (!arrs) arrs = []
    return arrs.includes(index) ? options.fn(this) : options.inverse(this)
  },
  postStartTimeAndEndTime: function (startTime, endTime) {
    const dates = []
    dates.push(startTime)
    dates.push(endTime)

    return dates
  },
  formattedText: function (text) {
    console.log('text', text.replace(/\r\n/g, '<br>').replace(/\r/g, '&nbsp;'))
    return text.replace(/\r\n/g, '<br>').replace(/\r/g, '&nbsp;')
  }
}

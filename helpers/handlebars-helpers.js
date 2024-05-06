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
    return arrs.includes(index) ? options.fn(this) : options.inverse(this)
  }
}

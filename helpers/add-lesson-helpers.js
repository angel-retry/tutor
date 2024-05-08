const getAddLessonMessage = (jsonString) => {
  return jsonString.length > 0 ? JSON.parse(jsonString) : null
}

module.exports = {
  getAddLessonMessage
}

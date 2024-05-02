const getOffset = (page = 1, limit = 6) => {
  const offset = (page - 1) * limit
  return offset
}

const getPagination = (page = 1, limit = 6, total = 50) => {
  const totalPage = Math.ceil(total / limit)
  const pages = Array.from({ length: totalPage }).map((_, i) => i + 1)
  const currentPage = page < 1 ? 1 : page > totalPage ? totalPage : page
  const prevPage = currentPage - 1 > 0 ? currentPage - 1 : 1
  const nextPage = currentPage + 1 <= totalPage ? currentPage + 1 : totalPage

  return {
    totalPage,
    currentPage,
    prevPage,
    nextPage,
    pages
  }
}

module.exports = {
  getOffset,
  getPagination
}

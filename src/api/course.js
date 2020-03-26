import request from '@/utils/httpRequest'

class Course {
  static list (page, limit, courseName) {
    return request({
      url: '/cou/course/list',
      method: 'get',
      params: { page, limit, courseName }
    })
  }

  static info (data) {
    return request({
      url: '/cou/course/info/' + data,
      method: 'get',
    })
  }

  static save(data) {
    return request({
      url: '/cou/course/save',
      method: 'post',
      data
    })
  }

  static update(data) {
    return request({
      url: '/cou/course/update',
      method: 'post',
      data
    })
  }

  static delete(data) {
    return request({
      url: '/cou/course/delete/' + data,
      method: 'get',
    })
  }

}

export default Course
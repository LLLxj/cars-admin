import request from '@/utils/httpRequest'

class ClassType {

  static list(page, limit, classTypeName) {
    return request({
      url: '/cou/classType/list',
      method: 'get',
      params: { page, limit, classTypeName }
    })
  }

  static allList() {
    return request({
      url: '/cou/classType/classTypeList',
      method: 'get',
    })
  }

  static info(data) {
    return request({
      url: '/cou/classType/info/' + data,
      method: 'get',
    })
  }

  static save(data) {
    return request({
      url: '/cou/classType/save',
      method: 'post',
      data
    })
  }

  static update(data) {
    return request({
      url: '/cou/classType/update',
      method: 'post',
      data
    })
  }

  static delete(data) {
    return request({
      url: '/cou/classType/delete',
      method: 'post',
      data
    })
  }
}

export default ClassType





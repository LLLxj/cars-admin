
import request from '@/utils/httpRequest'
const baseUrl = '/apiPro'


class Users{

  static list(params) {
    return request({
      url: `${baseUrl}/sys/user/list`,
      method: 'get',
      params: params
    })
  }

  static disList(params) {
    return request({
      url: `${baseUrl}/sys/user/disableList`,
      method: 'get',
      params: params
    })
  }

  static disable(data) {
    return request({
      url: `${baseUrl}/sys/user/disable/` + data,
      method: 'get',
    })
  }

  static awake(data) {
    return request({
      url: `${baseUrl}/sys/user/normal/` + data,
      method: 'get',
    })
  }


  static info(data) {
    return request({
      url: `${baseUrl}/sys/user/info/` + data,
      method: 'get',
    })
  }

  static save(data) {
    return request({
      url: `${baseUrl}/sys/user/save`,
      method: 'post',
      data
    })
  }

  static update(data) {
    return request({
      url: `${baseUrl}/sys/user/update`,
      method: 'post',
      data
    })
  }

  static checkPhone(params) {
    return request({
      url: `${baseUrl}/sys/user/check`,
      method: 'get',
      params: params
    })
  }


}

export default Users
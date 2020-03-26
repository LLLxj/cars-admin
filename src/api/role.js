
import request from '@/utils/httpRequest'
const baseUrl = '/apiPro'


class Role{

  static norList(params) {
    return request({
      url: `${baseUrl}/sys/role/normalList`,
      method: 'get',
      params: params
    })
  }

  static disList(params) {
    return request({
      url: `${baseUrl}/sys/role/disableList`,
      method: 'get',
      params: params
    })
  }

  static disable(data) {
    return request({
      url: `${baseUrl}/sys/role/disable/` + data,
      method: 'get',
    })
  }

  static awake(data) {
    return request({
      url: `${baseUrl}/sys/role/nomarl/` + data,
      method: 'get',
    })
  }


  static info(data) {
    return request({
      url: `${baseUrl}/sys/role/info/` + data,
      method: 'get',
    })
  }

  static save(data) {
    return request({
      url: `${baseUrl}/sys/role/save`,
      method: 'post',
      data
    })
  }

  static update(data) {
    return request({
      url: `${baseUrl}/sys/role/update`,
      method: 'post',
      data
    })
  }

  static delete(data) {
    return request({
      url: `${baseUrl}/sys/role/delete/` + data,
      method: 'get',
    })
  }

}

export default Role
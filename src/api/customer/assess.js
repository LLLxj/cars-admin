
import request from '@/utils/httpRequest'
const baseUrl = '/apiPro'


class Assess{

  static list(params) {
    return request({
      url: `${baseUrl}/deal/assess/list`,
      method: 'get',
      params: params
    })
  }

  static disable(data) {
    return request({
      url: `${baseUrl}/deal/assess/disable/` + data,
      method: 'get',
    })
  }

  static waste(data) {
    return request({
      url: `${baseUrl}/deal/assess/waste/` + data,
      method: 'get',
    })
  }

  static awake(data) {
    return request({
      url: `${baseUrl}/deal/assess/normal/` + data,
      method: 'get',
    })
  }


  static info(data) {
    return request({
      url: `${baseUrl}/deal/assess/info/` + data,
      method: 'get',
    })
  }

  static save(data) {
    return request({
      url: `${baseUrl}/deal/assess/save`,
      method: 'post',
      data
    })
  }

  static update(data) {
    return request({
      url: `${baseUrl}/deal/assess/update`,
      method: 'post',
      data
    })
  }

  static delete(data) {
    return request({
      url: `${baseUrl}/deal/assess/delete/` + data,
      method: 'get',
    })
  }

}

export default Assess
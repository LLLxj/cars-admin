
import request from '@/utils/httpRequest'
const baseUrl = '/apiPro'

class Advertise {
  static list (params) {
    return request({
      url: `${baseUrl}/conf/advertising/list`,
      method: 'get',
      params: params
    })
  }

  static disList (params) {
    return request({
      url: `${baseUrl}/conf/advertising/disableList`,
      method: 'get',
      params: params
    })
  }

  static disable (data) {
    return request({
      url: `${baseUrl}/conf/advertising/disable/` + data,
      method: 'get'
    })
  }

  static normal (data) {
    return request({
      url: `${baseUrl}/conf/advertising/normal/` + data,
      method: 'get'
    })
  }

  static info (data) {
    return request({
      url: `${baseUrl}/conf/advertising/info/` + data,
      method: 'get'
    })
  }

  static save (data) {
    return request({
      url: `${baseUrl}/conf/advertising/save`,
      method: 'post',
      data
    })
  }

  static update (data) {
    return request({
      url: `${baseUrl}/conf/advertising/update`,
      method: 'post',
      data
    })
  }
}

export default Advertise

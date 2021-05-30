
import request from '@/utils/httpRequest'
const baseUrl = '/apiPro'

class Business {
  static list (params) {
    return request({
      url: `${baseUrl}/loan/user/list`,
      method: 'get',
      params: params
    })
  }

  static disable (data) {
    return request({
      url: `${baseUrl}/loan/user/disable/` + data,
      method: 'get'
    })
  }

  static normal (data) {
    return request({
      url: `${baseUrl}/loan/user/normal/` + data,
      method: 'get'
    })
  }

  static fixUpdate (data) {
    return request({
      url: `${baseUrl}/loan/user/fixedTimeUpdate`,
      method: 'get'
    })
  }

  static save (data) {
    return request({
      url: `${baseUrl}/loan/user/save`,
      method: 'post',
      data
    })
  }

  static update (data) {
    return request({
      url: `${baseUrl}/loan/user/update`,
      method: 'post',
      data
    })
  }
}

export default Business

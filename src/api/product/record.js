
import request from '@/utils/httpRequest'
const baseUrl = '/apiPro'

class Record {
  static list (params) {
    return request({
      url: `${baseUrl}/loan/record/list`,
      method: 'get',
      params: params
    })
  }

  static info (data) {
    return request({
      url: `${baseUrl}/loan/record/info/` + data,
      method: 'get'
    })
  }

  static disable (data) {
    return request({
      url: `${baseUrl}/loan/record/disable/` + data,
      method: 'get'
    })
  }

  static normal (data) {
    return request({
      url: `${baseUrl}/loan/record/normal/` + data,
      method: 'get'
    })
  }

  static save (data) {
    return request({
      url: `${baseUrl}/loan/record/save`,
      method: 'post',
      data
    })
  }

  static update (data) {
    return request({
      url: `${baseUrl}/loan/record/update`,
      method: 'post',
      data
    })
  }

  static getAllList () {
    return request({
      url: `${baseUrl}/loan/record/getRecordList`,
      method: 'get'
    })
  }
}

export default Record

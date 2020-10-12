
import request from '@/utils/httpRequest'
const baseUrl = '/apiPro'

class ComApply{

  static list(params) {
    return request({
      url: `${baseUrl}/deal/user/store/listPage`,
      method: 'get',
      params: params
    })
  }

  static getBusinessList() {
    return request({
      url: `${baseUrl}/sys/user/getSaleUser`,
      method: 'get'
    })
  }

  static fail(data) {
    return request({
      url: `${baseUrl}/deal/user/store/fail/` + data,
      method: 'get',
    })
  }

  static success(data) {
    return request({
      url: `${baseUrl}/deal/user/store/success`,
      method: 'post',
      data
    })
  }

  static waste(data) {
    return request({
      url: `${baseUrl}/deal/user/store/waste/` + data,
      method: 'get',
    })
  }


  static info(data) {
    return request({
      url: `${baseUrl}/deal/user/store/info/` + data,
      method: 'get',
    })
  }

  static save(data) {
    return request({
      url: `${baseUrl}/deal/user/store/save`,
      method: 'post',
      data
    })
  }

  static update(data) {
    return request({
      url: `${baseUrl}/deal/user/store/update`,
      method: 'post',
      data
    })
  }

}

export default ComApply
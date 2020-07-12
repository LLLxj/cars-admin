
import request from '@/utils/httpRequest'
const baseUrl = '/apiPro'

class Refund{

  static list(params) {
    return request({
      url: `${baseUrl}/deal/user/store/refund/list`,
      method: 'get',
      params: params
    })
  }


  static reject(data) {
    return request({
      url: `${baseUrl}/deal/user/store/refund/reject`,
      method: 'post',
      data
    })
  }

  static manager(data) {
    return request({
      url: `${baseUrl}/deal/user/store/refund/manager`,
      method: 'post',
      data
    })
  }

  static success(data) {
    return request({
      url: `${baseUrl}/deal/user/store/refund/success`,
      method: 'post',
      data
    })
  }

  static info(data) {
    return request({
      url: `${baseUrl}/deal/user/store/refund/info/` + data,
      method: 'get',
    })
  }

  static recordList(data) {
    return request({
      url: `${baseUrl}/deal/user/store/refund/getExamineList/` + data,
      method: 'get',
    })
  }

  static save(data) {
    return request({
      url: `${baseUrl}/deal/user/store/refund/save`,
      method: 'post',
      data
    })
  }

  static update(data) {
    return request({
      url: `${baseUrl}/deal/user/store/refund/update`,
      method: 'post',
      data
    })
  }

}

export default Refund
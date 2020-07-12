
import request from '@/utils/httpRequest'
const baseUrl = '/apiPro'

class Sell{

  static list(params) {
    return request({
      url: `${baseUrl}/deal/assess/sell/list`,
      method: 'get',
      params: params
    })
  }


  static reject(data) {
    return request({
      url: `${baseUrl}/deal/assess/sell/reject`,
      method: 'post',
      data
    })
  }

  static manager(data) {
    return request({
      url: `${baseUrl}/deal/assess/sell/manager`,
      method: 'post',
      data
    })
  }

  static success(data) {
    return request({
      url: `${baseUrl}/deal/assess/sell/success`,
      method: 'post',
      data
    })
  }

  static info(data) {
    return request({
      url: `${baseUrl}/deal/assess/sell/info/` + data,
      method: 'get',
    })
  }

  static recordList(data) {
    return request({
      url: `${baseUrl}/deal/assess/sell/getExamineList/` + data,
      method: 'get',
    })
  }

  static save(data) {
    return request({
      url: `${baseUrl}/deal/assess/sell/save`,
      method: 'post',
      data
    })
  }

  static update(data) {
    return request({
      url: `${baseUrl}/deal/assess/sell/update`,
      method: 'post',
      data
    })
  }

}

export default Sell
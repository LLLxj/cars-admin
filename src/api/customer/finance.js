
import request from '@/utils/httpRequest'
const baseUrl = '/apiPro'

class Finance{

  static list(params) {
    return request({
      url: `${baseUrl}/deal/user/store/finance/list`,
      method: 'get',
      params: params
    })
  }


  static checking(data) {
    return request({
      url: `${baseUrl}/deal/user/store/finance/checkpending`,
      method: 'post',
      data
    })
  }

  static waste(data) {
    return request({
      url: `${baseUrl}/deal/user/store/finance/waste/` + data,
      method: 'get',
    })
  }

  static success(data) {
    return request({
      url: `${baseUrl}/deal/user/store/finance/success`,
      method: 'post',
      data
    })
  }

  static info(data) {
    return request({
      url: `${baseUrl}/deal/user/store/finance/info/` + data,
      method: 'get',
    })
  }

  static save(data) {
    return request({
      url: `${baseUrl}/deal/user/store/finance/save`,
      method: 'post',
      data
    })
  }

  static update(data) {
    return request({
      url: `${baseUrl}/deal/user/store/finance/update`,
      method: 'post',
      data
    })
  }

  static recordList(data) {
    return request({
      url: `${baseUrl}/deal/user/store/finance/getExamineList/` + data,
      method: 'get',
    })
  }

}

export default Finance
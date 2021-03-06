
import request from '@/utils/httpRequest'
const baseUrl = '/apiPro'

class Baozhengjin{

  static list(params) {
    return request({
      url: `${baseUrl}/deal/user/store/deposit/list`,
      method: 'get',
      params: params
    })
  }


  static reject(data) {
    return request({
      url: `${baseUrl}/deal/user/store/deposit/reject`,
      method: 'post',
      data
    })
  }

  static manager(data) {
    return request({
      url: `${baseUrl}/deal/user/store/deposit/manager`,
      method: 'post',
      data
    })
  }

  static success(data) {
    return request({
      url: `${baseUrl}/deal/user/store/deposit/success`,
      method: 'post',
      data
    })
  }

  static info(data) {
    return request({
      url: `${baseUrl}/deal/user/store/deposit/info/` + data,
      method: 'get',
    })
  }

  static recordList(data) {
    return request({
      url: `${baseUrl}/deal/user/store/deposit/getExamineList/` + data,
      method: 'get',
    })
  }

  static save(data) {
    return request({
      url: `${baseUrl}/deal/user/store/deposit/save`,
      method: 'post',
      data
    })
  }

  static update(data) {
    return request({
      url: `${baseUrl}/deal/user/store/deposit/update`,
      method: 'post',
      data
    })
  }

}

export default Baozhengjin
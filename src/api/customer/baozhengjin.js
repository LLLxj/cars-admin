
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


  static cancle(data) {
    return request({
      url: `${baseUrl}/deal/user/store/deposit/cancle/` + data,
      method: 'get',
    })
  }

  static awake(data) {
    return request({
      url: `${baseUrl}/deal/user/store/deposit/normal/` + data,
      method: 'get',
    })
  }


  static info(data) {
    return request({
      url: `${baseUrl}/deal/user/store/deposit/info/` + data,
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
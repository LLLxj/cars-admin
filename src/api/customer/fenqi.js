
import request from '@/utils/httpRequest'
const baseUrl = '/apiPro'


class Fenqi{

  static list(params) {
    return request({
      url: `${baseUrl}/deal/wares/installment/list`,
      method: 'get',
      params: params
    })
  }


  static success(data) {
    return request({
      url: `${baseUrl}/deal/wares/installment/success` ,
      method: 'post',
      data
    })
  }

  static waste(data) {
    return request({
      url: `${baseUrl}/deal/wares/installment/waste`,
      method: 'post',
      data
    })
  }


  static info(data) {
    return request({
      url: `${baseUrl}/deal/wares/installment/info/` + data,
      method: 'get',
    })
  }

  static save(data) {
    return request({
      url: `${baseUrl}/deal/wares/installment/save`,
      method: 'post',
      data
    })
  }

  static update(data) {
    return request({
      url: `${baseUrl}/deal/wares/installment/update`,
      method: 'post',
      data
    })
  }

  static delete(data) {
    return request({
      url: `${baseUrl}/deal/wares/installment/delete/` + data,
      method: 'get',
    })
  }

}

export default Fenqi
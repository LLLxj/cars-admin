
import request from '@/utils/httpRequest'
const baseUrl = '/apiPro'

class Products{

  static list(params) {
    return request({
      url: `${baseUrl}/deal/wares/list`,
      method: 'get',
      params: params
    })
  }

  static getProductList(data) {
    return request({
      url: `${baseUrl}/cou/wares/getCouWaresList/` + data,
      method: 'get'
    })
  }

  static disList(params) {
    return request({
      url: `${baseUrl}/deal/wares/disableList`,
      method: 'get',
      params: params
    })
  }

  static disable(data) {
    return request({
      url: `${baseUrl}/deal/wares/disable/` + data,
      method: 'get',
    })
  }

  static awake(data) {
    return request({
      url: `${baseUrl}/deal/wares/normal/` + data,
      method: 'get',
    })
  }


  static info(data) {
    return request({
      url: `${baseUrl}/deal/wares/info/` + data,
      method: 'get',
    })
  }

  static save(data) {
    return request({
      url: `${baseUrl}/deal/wares/save`,
      method: 'post',
      data
    })
  }

  static update(data) {
    return request({
      url: `${baseUrl}/deal/wares/update`,
      method: 'post',
      data
    })
  }

}

export default Products
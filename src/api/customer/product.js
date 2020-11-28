
import request from '@/utils/httpRequest'
const baseUrl = '/apiPro'
class Products {
  static list (params) {
    return request({
      url: `${baseUrl}/deal/wares/list`,
      method: 'get',
      params: params
    })
  }

  static getProductList (data) {
    return request({
      url: `${baseUrl}/cou/wares/getCouWaresList/` + data,
      method: 'get'
    })
  }

  static disList (params) {
    return request({
      url: `${baseUrl}/deal/wares/disableList`,
      method: 'get',
      params: params
    })
  }

  static disable (data) {
    return request({
      url: `${baseUrl}/deal/wares/disable/` + data,
      method: 'get'
    })
  }

  static awake (data) {
    return request({
      url: `${baseUrl}/deal/wares/normal/` + data,
      method: 'get'
    })
  }

  static info (data) {
    return request({
      url: `${baseUrl}/deal/wares/info/` + data,
      method: 'get'
    })
  }

  static success (data) {
    return request({
      url: `${baseUrl}/deal/wares/success`,
      method: 'post',
      data
    })
  }

  static reject (data) {
    return request({
      url: `${baseUrl}/deal/wares/reject`,
      method: 'post',
      data
    })
  }

  static manage (data) {
    return request({
      url: `${baseUrl}/deal/wares/manager`,
      method: 'post',
      data
    })
  }

  static onLine (data) {
    return request({
      url: `${baseUrl}/deal/wares/onLine`,
      method: 'post',
      data
    })
  }

  static unLine (data) {
    return request({
      url: `${baseUrl}/deal/wares/unLine`,
      method: 'post',
      data
    })
  }

  static sale (data) {
    return request({
      url: `${baseUrl}/deal/wares/sale/` + data,
      method: 'get'
    })
  }

  static waste (data) {
    return request({
      url: `${baseUrl}/deal/wares/waste`,
      method: 'post',
      data
    })
  }

  static delete (data) {
    return request({
      url: `${baseUrl}/deal/wares/delete`,
      method: 'post',
      data
    })
  }

  static save (data) {
    return request({
      url: `${baseUrl}/deal/wares/save`,
      method: 'post',
      data
    })
  }

  static update (data) {
    return request({
      url: `${baseUrl}/deal/wares/update`,
      method: 'post',
      data
    })
  }
}

export default Products

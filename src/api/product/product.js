
import request from '@/utils/httpRequest'
const baseUrl = '/apiPro'

class Product {
  static list (params) {
    return request({
      url: `${baseUrl}/loan/product/list`,
      method: 'get',
      params: params
    })
  }

  static info (data) {
    return request({
      url: `${baseUrl}/loan/product/info/` + data,
      method: 'get'
    })
  }

  static disable (data) {
    return request({
      url: `${baseUrl}/loan/product/disable/` + data,
      method: 'get'
    })
  }

  static normal (data) {
    return request({
      url: `${baseUrl}/loan/product/normal/` + data,
      method: 'get'
    })
  }

  static save (data) {
    return request({
      url: `${baseUrl}/loan/product/save`,
      method: 'post',
      data
    })
  }

  static update (data) {
    return request({
      url: `${baseUrl}/loan/product/update`,
      method: 'post',
      data
    })
  }
}

export default Product

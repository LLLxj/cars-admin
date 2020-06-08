
import request from '@/utils/httpRequest'
const baseUrl = '/apiPro'

class Products{

  static list(params) {
    return request({
      url: `${baseUrl}/cou/wares/list`,
      method: 'get',
      params: params
    })
  }

  static disList(params) {
    return request({
      url: `${baseUrl}/cou/wares/disableList`,
      method: 'get',
      params: params
    })
  }

  static disable(data) {
    return request({
      url: `${baseUrl}/cou/wares/disable/` + data,
      method: 'get',
    })
  }

  static awake(data) {
    return request({
      url: `${baseUrl}/cou/wares/normal/` + data,
      method: 'get',
    })
  }


  static info(data) {
    return request({
      url: `${baseUrl}/cou/wares/info/` + data,
      method: 'get',
    })
  }

  static save(data) {
    return request({
      url: `${baseUrl}/cou/wares/save`,
      method: 'post',
      data
    })
  }

  static update(data) {
    return request({
      url: `${baseUrl}/cou/wares/update`,
      method: 'post',
      data
    })
  }

}

export default Products
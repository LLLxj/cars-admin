
import request from '@/utils/httpRequest'
const baseUrl = '/apiPro'


class Brand{

  static list(params) {
    return request({
      url: `${baseUrl}/cou/wares/brand/list`,
      method: 'get',
      params: params
    })
  }

  static listAll() {
    return request({
      url: `${baseUrl}/cou/wares/brand/getCouBrandList`,
      method: 'get'
    })
  }

  static disList(params) {
    return request({
      url: `${baseUrl}/cou/wares/brand/disableList`,
      method: 'get',
      params: params
    })
  }

  static disable(data) {
    return request({
      url: `${baseUrl}/cou/wares/brand/disable/` + data,
      method: 'get',
    })
  }

  static awake(data) {
    return request({
      url: `${baseUrl}/cou/wares/brand/normal/` + data,
      method: 'get',
    })
  }


  static info(data) {
    return request({
      url: `${baseUrl}/cou/wares/brand/info/` + data,
      method: 'get',
    })
  }

  static save(data) {
    return request({
      url: `${baseUrl}/cou/wares/brand/save`,
      method: 'post',
      data
    })
  }

  static update(data) {
    return request({
      url: `${baseUrl}/cou/wares/brand/update`,
      method: 'post',
      data
    })
  }

}

export default Brand
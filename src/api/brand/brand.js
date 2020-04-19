
import request from '@/utils/httpRequest'
const baseUrl = '/apiPro'


class Brand{

  static norList(params) {
    return request({
      url: `${baseUrl}/deal/wares/brand/normalList`,
      method: 'get',
      params: params
    })
  }

  static disList(params) {
    return request({
      url: `${baseUrl}/deal/wares/brand/disableList`,
      method: 'get',
      params: params
    })
  }

  static disable(data) {
    return request({
      url: `${baseUrl}/deal/wares/brand/disable/` + data,
      method: 'get',
    })
  }

  static awake(data) {
    return request({
      url: `${baseUrl}/deal/wares/brand/normal/` + data,
      method: 'get',
    })
  }


  static info(data) {
    return request({
      url: `${baseUrl}/deal/wares/brand/info/` + data,
      method: 'get',
    })
  }

  static save(data) {
    return request({
      url: `${baseUrl}/deal/wares/brand/save`,
      method: 'post',
      data
    })
  }

  static update(data) {
    return request({
      url: `${baseUrl}/deal/wares/brand/update`,
      method: 'post',
      data
    })
  }

}

export default Brand
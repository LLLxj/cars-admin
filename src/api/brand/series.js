
import request from '@/utils/httpRequest'
const baseUrl = '/apiPro'


class Series{

  static norList(params) {
    return request({
      url: `${baseUrl}/deal/wares/brand/series/normalList`,
      method: 'get',
      params: params
    })
  }

  static disList(params) {
    return request({
      url: `${baseUrl}/deal/wares/brand/series/disableList`,
      method: 'get',
      params: params
    })
  }

  static disable(data) {
    return request({
      url: `${baseUrl}/deal/wares/brand/series/disable/` + data,
      method: 'get',
    })
  }

  static awake(data) {
    return request({
      url: `${baseUrl}/deal/wares/brand/series/normal/` + data,
      method: 'get',
    })
  }


  static info(data) {
    return request({
      url: `${baseUrl}/deal/wares/brand/series/info/` + data,
      method: 'get',
    })
  }

  static save(data) {
    return request({
      url: `${baseUrl}/deal/wares/brand/series/save`,
      method: 'post',
      data
    })
  }

  static update(data) {
    return request({
      url: `${baseUrl}/deal/wares/brand/series/update`,
      method: 'post',
      data
    })
  }

}

export default Series
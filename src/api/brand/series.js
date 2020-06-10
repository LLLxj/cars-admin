
import request from '@/utils/httpRequest'
const baseUrl = '/apiPro'


class Series{

  static list(params) {
    return request({
      url: `${baseUrl}/cou/wares/series/list`,
      method: 'get',
      params: params
    })
  }

  static disList(params) {
    return request({
      url: `${baseUrl}/cou/wares/series/disableList`,
      method: 'get',
      params: params
    })
  }

  static disable(data) {
    return request({
      url: `${baseUrl}/cou/wares/series/disable/` + data,
      method: 'get',
    })
  }

  static awake(data) {
    return request({
      url: `${baseUrl}/cou/wares/series/normal/` + data,
      method: 'get',
    })
  }


  static info(data) {
    return request({
      url: `${baseUrl}/cou/wares/series/info/` + data,
      method: 'get',
    })
  }

  static save(data) {
    return request({
      url: `${baseUrl}/cou/wares/series/save`,
      method: 'post',
      data
    })
  }

  static update(data) {
    return request({
      url: `${baseUrl}/cou/wares/series/update`,
      method: 'post',
      data
    })
  }

}

export default Series
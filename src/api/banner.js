
import request from '@/utils/httpRequest'
const baseUrl = '/apiPro'


class Banner{

  static list(params) {
    return request({
      url: `${baseUrl}/conf/banner/list`,
      method: 'get',
      params: params
    })
  }

  static disList(params) {
    return request({
      url: `${baseUrl}/conf/banner/disableList`,
      method: 'get',
      params: params
    })
  }

  static disable(data) {
    return request({
      url: `${baseUrl}/conf/banner/disable/` + data,
      method: 'get',
    })
  }

  static awake(data) {
    return request({
      url: `${baseUrl}/conf/banner/normal/` + data,
      method: 'get',
    })
  }


  static info(data) {
    return request({
      url: `${baseUrl}/conf/banner/info/` + data,
      method: 'get',
    })
  }

  static save(data) {
    return request({
      url: `${baseUrl}/conf/banner/save`,
      method: 'post',
      data
    })
  }

  static update(data) {
    return request({
      url: `${baseUrl}/conf/banner/update`,
      method: 'post',
      data
    })
  }

}

export default Banner
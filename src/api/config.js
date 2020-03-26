import request from '@/utils/httpRequest'
const baseUrl = '/apiPro'


class Config{


  static list(params) {
    return request({
      url: `${baseUrl}/sys/config/list`,
      method: 'get',
      params: params
    })
  }

  static info(data) {
    return request({
      url: `${baseUrl}/sys/config/info/` + data,
      method: 'get',
    })
  }

  static save(data) {
    return request({
      url: `${baseUrl}/sys/config/save`,
      method: 'post',
      data
    })
  }

  static update(data) {
    return request({
      url: `${baseUrl}/sys/config/update`,
      method: 'post',
      data
    })
  }

  static disable(data) {
    return request({
      url: `${baseUrl}/sys/config/disable/` + data,
      method: 'get',
    })
  }

  static awake(data) {
    return request({
      url: `${baseUrl}/sys/config/normal/` + data,
      method: 'get',
    })
  }
}

export default Config
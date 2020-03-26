import request from '@/utils/httpRequest'
const baseUrl = '/apiPro'


class Menu{

  static navList() {
    return request({
      url: `${baseUrl}/sys/menu/nav`,
      method: 'get',
    })
  }

  static list(params) {
    return request({
      url: `${baseUrl}/sys/menu/list`,
      method: 'get',
      params: params
    })
  }

  static pageList(params) {
    return request({
      url: `${baseUrl}/sys/menu/pageList`,
      method: 'get',
      params: params
    })
  }

  static select() {
    return request({
      url: `${baseUrl}/sys/menu/select`,
      method: 'get',
    })
  }

  static info(data) {
    return request({
      url: `${baseUrl}/sys/menu/info/` + data,
      method: 'get',
    })
  }

  static save(data) {
    return request({
      url: `${baseUrl}/sys/menu/save`,
      method: 'post',
      data
    })
  }

  static update(data) {
    return request({
      url: `${baseUrl}/sys/menu/update`,
      method: 'post',
      data
    })
  }

  static delete(data) {
    return request({
      url: `${baseUrl}/sys/menu/delete/` + data,
      method: 'get',
    })
  }
}

export default Menu
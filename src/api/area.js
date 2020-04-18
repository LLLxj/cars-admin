
import request from '@/utils/httpRequest'
const baseUrl = '/apiPro'


class Areas{

  static list(params) {
    return request({
      url: `${baseUrl}/cust/area/list`,
      method: 'get',
      params: params
    })
  }

  static treeList() {
    return request({
      url: `${baseUrl}/cust/area/treeList`,
      method: 'get',
    })
  }

  static proList() {
    return request({
      url: `${baseUrl}/cust/area/province`,
      method: 'get',
    })
  }

  static cityList(data) {
    return request({
      url: `${baseUrl}/cust/area/city/` + data,
      method: 'get',
    })
  }

  static couList(data) {
    return request({
      url: `${baseUrl}/cust/area/county/` + data,
      method: 'get',
    })
  }


}

export default Areas
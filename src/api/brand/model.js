
import request from '@/utils/httpRequest'
const baseUrl = '/apiPro'

class Models{

  static list(params) {
    return request({
      url: `${baseUrl}/cou/wares/model/list`,
      method: 'get',
      params: params
    })
  }

  static listAll() {
    return request({
      url: `${baseUrl}/cou/wares/model/getCouModelList`,
      method: 'get'
    })
  }

  static disList(params) {
    return request({
      url: `${baseUrl}/cou/wares/model/disableList`,
      method: 'get',
      params: params
    })
  }

  static disable(data) {
    return request({
      url: `${baseUrl}/cou/wares/model/disable/` + data,
      method: 'get',
    })
  }

  static awake(data) {
    return request({
      url: `${baseUrl}/cou/wares/model/normal/` + data,
      method: 'get',
    })
  }


  static info(data) {
    return request({
      url: `${baseUrl}/cou/wares/model/info/` + data,
      method: 'get',
    })
  }

  static selectModelList(data) { // 根据系列选择型号
    return request({
      url: `${baseUrl}/cou/wares/model/info/` + data,
      method: 'get',
    })
  }
  

  static save(data) {
    return request({
      url: `${baseUrl}/cou/wares/model/save`,
      method: 'post',
      data
    })
  }

  static update(data) {
    return request({
      url: `${baseUrl}/cou/wares/model/update`,
      method: 'post',
      data
    })
  }

}

export default Models
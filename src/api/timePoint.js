import request from '@/utils/httpRequest'

export function timePointList( page, limit, wepName) {
    return request({
      url: '/cos/wep/list',
      method: 'get',
      params: { page, limit, wepName }
    })
}

export function timePointInfo(data) {
    return request({
      url: '/cos/wep/info' + data,
      method: 'get',
    })
}

export function timePointSave(data) {
    return request({
      url: '/cos/wep/save',
      method: 'post',
      data
    })
}

export function timePointUpdate(data) {
    return request({
      url: '/cos/wep/update',
      method: 'post',
      data
    })
}

export function timePointDelete(data) {
    return request({
      url: '/cos/wep/delete',
      method: 'post',
      data
    })
}
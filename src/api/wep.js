import request from '@/utils/httpRequest'

export function wepList( page, limit, wepName) {
    return request({
      url: '/cos/wep/list',
      method: 'get',
      params: { page, limit, wepName }
    })
}

export function wepInfo(data) {
    return request({
      url: '/cos/wep/info/' + data,
      method: 'get',
    })
}

export function wepInfoSave(data) {
    return request({
      url: '/cos/wep/save',
      method: 'post',
      data
    })
}

export function wepInfoUpdate(data) {
    return request({
      url: '/cos/wep/update',
      method: 'post',
      data
    })
}

export function wepInfoDelete(data) {
    return request({
      url: '/cos/wep/delete',
      method: 'post',
      data
    })
}
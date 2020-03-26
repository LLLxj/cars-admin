import request from '@/utils/httpRequest'

export function wepWeekList( page, limit, wepId ) {
    return request({
      url: '/cos/wep/week/list',
      method: 'get',
      params: { page, limit, wepId}
    })
}

export function wepWeekInfo(data) {
    return request({
      url: '/cos/wep/week/info/' + data,
      method: 'get',
    })
}

export function wepWeekSave(data) {
    return request({
      url: '/cos/wep/week/save',
      method: 'post',
      data
    })
}

export function wepWeekUpdate(data) {
    return request({
      url: '/cos/wep/week/update',
      method: 'post',
      data
    })
}

export function wepWeekDelete(data) {
    return request({
      url: '/cos/wep/week/delete',
      method: 'post',
      data
    })
}
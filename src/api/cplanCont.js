import request from '@/utils/httpRequest'

export function cplanList(page, limit, startDateTime, endDateTime, cplanContName, lectuerId, ptype, croomId, order, orderColumns) {
    return request({
      url: '/cou/cplanCont/list',
      method: 'get',
      params: { page, limit, startDateTime, endDateTime, cplanContName, lectuerId, ptype, croomId, order, orderColumns }
    })
}

export function cplanInfo(data) {
  return request({
    url: '/cou/cplanCont/info/' + data,
    method: 'get'
  })
}

export function cplanUpdate(data) {
  return request({
    url: '/cou/cplanCont/update',
    method: 'post',
    data
  })
}
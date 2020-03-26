
import request from '@/utils/httpRequest'

export function schoolList( page, limit, schoolName ) {
    return request({
      url: '/cos/school/list',
      method: 'get',
      params: { page, limit, schoolName }
    })
}

export function schoolInfo( data ) {
  return request({
    url: '/cos/school/info/' + data,
    method: 'get',
  })
}

export function schoolListSave(data) {
    return request({
      url: '/cos/school/save',
      method: 'post',
      data
    })
}

export function schoolListUpdate(data) {
    return request({
      url: '/cos/school/update',
      method: 'post',
      data
    })
}

export function schoolListDelete(data) {
    return request({
      url: '/cos/school/delete',
      method: 'post',
      data
    })
}
import request from '@/utils/httpRequest'

export function classRoomList( page, limit, croomName, schoolId ) {
    return request({
      url: '/cos/croom/list',
      method: 'get',
      params: { page, limit, croomName, schoolId  }
    })
}

export function classRoomInfo(data) {
  return request({
    url: '/cos/croom/info/' + data,
    method: 'get',
  })
}

export function classRoomSave(data) {
  return request({
    url: '/cos/croom/save',
    method: 'post',
    data
  })
}

export function classRoomUpdate(data) {
  return request({
    url: '/cos/croom/update',
    method: 'post',
    data
  })
}

export function classRoomDelete(data) {
    return request({
      url: '/cos/croom/delete',
      method: 'post',
      data
    })
}

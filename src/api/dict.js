import request from '@/utils/httpRequest'

export function dictTreeList () {
  return request({
    url: '/dict/dir/list',
    method: 'get'
  })
}

export function dictList (page, limit, code) {
  return request({
    url: '/dict/list',
    method: 'get',
    params: { page, limit, code }
  })
}

export function dictInfo (data) {
  return request({
    url: '/dict/dir/' + data,
    method: 'get',
  })
}

export function dictSave (data) {
  return request({
    url: '/dict/dir',
    method: 'post',
    data
  })
}

export function dictUpdate (data) {
  return request({
    url: '/dict/dir',
    method: 'put',
    data
  })
}

export function dictDelete (data) {
  return request({
    url: '/dict/dir/' + data,
    method: 'delete',
  })
}

export function dictInfoDelete (data) {
  return request({
    url: '/dict/' + data,
    method: 'delete',
  })
}

export function dictInfosGet (data) {
  return request({
    url: '/dict/' + data,
    method: 'get',
  })
}

export function dictInfoSave (data) {
  return request({
    url: '/dict',
    method: 'post',
    data
  })
}

export function dictInfoUpdate (data) {
  return request({
    url: '/dict',
    method: 'put',
    data
  })
}



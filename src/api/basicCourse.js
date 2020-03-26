import request from '@/utils/httpRequest'

export function courseContList( page, limit, courseId, order ) {
    return request({
      url: '/cou/courseCont/list',
      method: 'get',
      params: { page, limit, courseId, order }
    })
}

export function courseInfo(data) {
  return request({
    url: '/cou/courseCont/info/' + data,
    method: 'get',
  })
}

export function courseContSave(data) {
  return request({
    url: '/cou/courseCont/save',
    method: 'post',
    data
  })
}

export function courseContUpdate(data) {
  return request({
    url: '/cou/courseCont/update',
    method: 'post',
    data
  })
}

export function courseContDelete(data) {
    return request({
      url: '/cou/courseCont/delete',
      method: 'post',
      data
    })
}
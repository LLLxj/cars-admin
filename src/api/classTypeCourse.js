import request from '@/utils/httpRequest'

export function classTypeCourseList(page,limit,classTypeId) {
    return request({
      url: '/cou/classTypeCourse/list',
      method: 'get',
      params: { page, limit, classTypeId }
    })
}
export function classTypeCourseInfo(data) {
  return request({
    url: '/cou/classTypeCourse/info/' + data,
    method: 'get',
  })
}

export function classTypeCourseSave(data) {
  return request({
    url: '/cou/classTypeCourse/save',
    method: 'post',
    data
  })
}

export function classTypeCourseListUpdate(data) {
  return request({
    url: '/cou/classTypeCourse/update',
    method: 'post',
    data
  })
}

export function classTypeCourseListDelete(data) {
  return request({
    url: '/cou/classTypeCourse/delete',
    method: 'post',
    data
  })
}
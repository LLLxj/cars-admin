import request from '@/utils/httpRequest'

export function classList( className, schoolId, page, limit ) {
    return request({
      url: '/cos/class/list',
      method: 'get',
      params: { className, schoolId, page, limit }
    })
}

export function classStatusDefault(data) {
  return request({
    url: '/cos/class/TacitlyApprove/' + data,
    method: 'get',
  })
}

export function classStatusNormal(data) {
  return request({
    url: '/cos/class/normal/' + data,
    method: 'get',
  })
}

export function classInfo(data) {
  return request({
    url: '/cos/class/info/' + data,
    method: 'get',
  })
}

export function classGetStuInfo (classId, page, limit) {
  return request({
    url: '/cos/class/getStu',
    method: 'get',
    params: { classId: classId, page: page, limit: limit }
  })
}

export function classListSave(data) {
  return request({
    url: '/cos/class/save',
    method: 'post',
    data
  })
}



export function classListUpdate(data) {
  return request({
    url: '/cos/class/update',
    method: 'post',
    data
  })
}

export function classListDelete(data) {
  return request({
    url: '/cos/class/delete',
    method: 'post',
    data
  })
}

import request from '@/utils/httpRequest'

export function cplanList( page, limit, cplanName, schoolId ) {
    return request({
      url: '/cou/cplan/list',
      method: 'get',
      params: { page, limit, cplanName, schoolId }
    })
}

export function cplanInfo(data) {
    return request({
      url: '/cou/cplan/info/' + data,
      method: 'get',
    })
}

export function cplanContInfo (cplanId) {
  return request({
    url: '/cou/cplan/cplanContInfo/' + cplanId,
    method: 'get'
  })
}

export function loadCplanCont( cplanId, cplanOpenDate, croomId, teacherId, wepId, tutorTeacherId ) {
  return request({
    url: '/cou/cplan/loadCplanCont',
    method: 'get',
    params: { cplanId, cplanOpenDate, croomId, teacherId, wepId, tutorTeacherId }
  })
}

export function cplanSave( data ) {
  return request({
    url: '/cou/cplan/save',
    method: 'post',
    data
  })
}

export function cplanUpdate( data ) {
  return request({
    url: '/cou/cplan/update',
    method: 'post',
    data
  })
}

export function cplanContSave( data ) {
  return request({
    url: '/cou/cplan/cplanContSave',
    method: 'post',
    data
  })
}

export function cplanDelete( data ) {
  return request({
    url: '/cou/cplan/delete',
    method: 'post',
    data
  })
}


// 作废的学员接口(排课)
// export function cplanStuListInfo(data) {
//   return request({
//     url: '/cou/cplan/stuList/' + data,
//     method: 'get',
//   })
// }

export function cplanStuListInfo( page, limit, cplanId ) {
  return request({
    url: '/cou/cplan/stuList',
    method: 'get',
    params: { page, limit, cplanId }
  })
}

export function cplanNeedClassStuListInfo( page, limit, cplanId, classTypeId, classTypeName, stuPhone, stuName ) {
  return request({
    url: '/cou/cplan/selectUnCplanRegStuByCourseId',
    method: 'get',
    params: { page, limit, cplanId, classTypeId, classTypeName, stuPhone, stuName }
  })
}






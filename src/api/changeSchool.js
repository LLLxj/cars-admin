import request from '@/utils/httpRequest'

// 转校管理列表
export function changeSchoolList (page, limit, regNo, stuName, stuPhone, contractNo, oldSchoolId, classTypeId, payStatus, ddingCode, startDateTime, endDateTime) {
  return request({
    url: '/stu/reg/transfer/list',
    method: 'get',
    params: {page, limit, regNo, stuName, stuPhone, contractNo, oldSchoolId, classTypeId, payStatus, ddingCode, startDateTime, endDateTime}
  })
}

// 精准查询
export function getChangeSchoolList (data) {
  return request({
    url: '/stu/reg/transfer/getStuRegTransfer',
    method: 'post',
    data
  })
}

export function changeSchoolInfo (data) {
  return request({
    url: '/stu/reg/transfer/info/' + data,
    method: 'get',
  })
}

// 转校模块操作
export function getChangeSchoolDetail (data) {
  return request({
    url: '/stu/reg/transfer/getStuRegTransfer/' + data,
    method: 'get',
  })
}

// 转校成功
export function changeSchoolSuc (data) {
  return request({
    url: '/stu/reg/transfer/adopt/' + data,
    method: 'get',
  })
}

// 转校失败 
export function changeSchoolFail (data) {
  return request({
    url: '/stu/reg/transfer/forbidden/' + data,
    method: 'get',
  })
}

// 新增转校

export function addChangeSchool (data) {
  return request({
    url: '/stu/reg/transfer/save',
    method: 'post',
    data
  })
}


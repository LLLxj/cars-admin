import request from '@/utils/httpRequest'

// 查看休学档案
export function stopList (page, limit, stuPhone, stuName, schoolId, regNo, stopStatus) {
  return request({
    url: '/stu/stop/list',
    method: 'get',
    params: {page, limit, stuPhone, stuName, schoolId, regNo, stopStatus}
  })
}

// 休学档案添加报名表弹窗
export function regPopList (page, limit, stuName, stuPhone) {
  return request({
    url: '/stu/stop/getStuRegList',
    method: 'get',
    params: {page, limit, stuName, stuPhone}
  })
}

// 修改休学档案通过状态
export function stopAdopt (data) {
  return request({
    url: '/stu/stop/adopt/' + data,
    method: 'post'
  })
}

// 修改休学档案作废状态
export function stopForbidden (data) {
  return request({
    url: '/stu/stop/forbidden/' + data,
    method: 'post'
  })
}

// 修改休学档案为待审核状态
export function stopCheckPending (data) {
  return request({
    url: '/stu/stop/checkPending/' + data,
    method: 'post'
  })
}

// 查看复课时间信息
export function stopInfo (data) {
  return request({
    url: '/stu/stop/info/' + data,
    method: 'post'
  })
}

// 修改复课时间
export function stopResumeClasses (data) {
  return request({
    url: '/stu/stop/resumeClasses',
    method: 'post',
    data
  })
}

export function stopCheckRegNo (regNo) {
  return request({
    url: '/stu/stop/checkRegNo',
    method: 'get',
    params: { regNo }
  })
}

// 保存休学档案
export function stopSave (data) {
  return request({
    url: '/stu/stop/save',
    method: 'post',
    data
  })
}

import request from '@/utils/httpRequest'

// 展开查询
export function getBenefitList(page, limit, offNo, stuName, stuPhone, schoolId, classTypeId, status, ddingCode, spreadUserId, recruitUserId, startDateTime, endDateTime) {
  return request({
    url: '/stu/reg/off/list',
    method: 'get',
    params: { page, limit, offNo, stuName, stuPhone, schoolId, classTypeId, status, ddingCode, spreadUserId, recruitUserId, startDateTime, endDateTime }
  })
}

// 生成优惠单
export function putBenefitNo() {
  return request({
    url: '/stu/reg/off/getOffNo',
    method: 'get',
  })
}

// 优惠单的报名表查询
export function getBenefitRegList(page, limit, stuName, stuPhone) {
  return request({
    url: 'stu/reg/getOffStuReg',
    method: 'get',
    params: { page, limit, stuName, stuPhone }
  })
}


// 折叠查询
export function benefitList(data) {
  return request({
    url: '/stu/reg/off/getOff',
    method: 'post',
    data
  })
}

// 获取缴费单信息
export function getBenefitInfo(data) {
  return request({
    url: '/stu/reg/off/info/' + data,
    method: 'get',
  })
}

// 新增优惠单
export function benefitSave(data) {
  return request({
    url: '/stu/reg/off/save',
    method: 'post',
    data
  })
}

// 同意优惠
export function acceptBenefit(data) {
  return request({
    url: '/stu/reg/off/adopt',
    method: 'post',
    data
  })
}

// 拒绝优惠
export function refuseBenefit(data) {
  return request({
    url: '/stu/reg/off/notPass',
    method: 'post',
    data
  })
}

// 修改为待审核
export function uncheckBenefit(data) {
  return request({
    url: '/stu/reg/off/checkPending/' + data,
    method: 'get'
  })
}

// 检验优惠单钉钉单号
export function checkBenfitDing(ddingCode) {
  return request({
    url: '/stu/reg/off/checkDdingCode',
    method: 'get',
    params: { ddingCode }
  })
}


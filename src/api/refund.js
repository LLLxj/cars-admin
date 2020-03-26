import request from '@/utils/httpRequest'

// 退费查询
export function getRefundList(page, limit, refundNo, stuName, stuPhone, schoolId,
    classTypeId, status, ddingCode, statusUserId, recruitUserId, spreadUserId, startDateTime, endDateTime) {
   return request({
     url: '/stu/reg/refund/list',
     method: 'get',
     params: { page, limit, refundNo, stuName, stuPhone, schoolId, classTypeId, status, ddingCode, statusUserId, recruitUserId, spreadUserId, startDateTime, endDateTime }
   })
 }
 
 // 退费查询
 export function refundList(data) {
  return request({
    url: '/stu/reg/refund/getRefund',
    method: 'post',
    data
  })
 }

//  获取学员信息
export function refundInfo(data) {
  return request({
    url: '/stu/reg/refund/info/' + data,
    method: 'get'
 })
}

// 生成退费单号
export function getRefundNo() {
  return request({
    url: '/stu/reg/refund/getRefundNo' ,
    method: 'get'
  })
}

// 新增退费
export function saveRefund(data) {
  return request({
    url: '/stu/reg/refund/save',
    method: 'post',
    data
  })
}

// 通过操作
export function acceptRefund(data) {
  return request({
    url: '/stu/reg/refund/adopt/' + data,
    method: 'get',
  })
}

// 失败操作
export function refuseRefund(data) {
  return request({
    url: '/stu/reg/refund/notPass/' + data,
    method: 'get',
  })
}

// 反审核操作
export function uncheckRefund(data) {
  return request({
    url: '/stu/reg/refund/checkPending/' + data,
    method: 'get',
  })
}

// 出纳确认打款
export function getMoney(data) {
  return request({
    url: '/stu/reg/refund/refundMoney/' + data,
    method: 'get',
  })
}

// 检验退费单钉钉单号
export function checkRefundDing(ddingCode) {
  return request({
    url: '/stu/reg/refund/checkDdingCode',
    method: 'get',
    params: { ddingCode }
  })
}



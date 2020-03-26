import request from '@/utils/httpRequest'

export function getPaymentNo() {
  return request({
    url: '/stu/reg/payment/getPaymentNo',
    method: 'get',
  })
}

// 获取支付方式

export function getPayType() {
  return request({
    url: '/stu/reg/pay/type/getPayType',
    method: 'get',
  })
}

// 缴费单查询
export function getPaymentList(page, limit, paymentNo, stuName, stuPhone, channeId, schoolId,
   classTypeId, paymentType, status, startDateTime, endDateTime, recruitUserId, spreadUserId) {
  return request({
    url: '/stu/reg/payment/list',
    method: 'get',
    params: { page, limit, paymentNo, stuName, stuPhone, channeId, schoolId, classTypeId, paymentType, status, startDateTime, endDateTime, recruitUserId, spreadUserId }
  })
}

// 缴费单查询
export function paymentList(data) {
 return request({
   url: '/stu/reg/payment/getStuRegPayment',
   method: 'post',
   data
 })
}

// 缴费获得缴费信息
export function paymentInfo(data) {
  return request({
    url: '/stu/reg/payment/info/' + data,
    method: 'get'
  })
}

export function addPayment(data) {
  return request({
    url: '/stu/reg/payment/save',
    method: 'post',
    data
  })
}

// 通过操作
export function acceptPayment(data) {
  return request({
    url: '/stu/reg/payment/adopt/' + data,
    method: 'get',
  })
}

// 收款失败操作
export function refusePayment(data) {
  return request({
    url: '/stu/reg/payment/notPass/' + data,
    method: 'get',
  })
}

// 反审核操作
export function uncheckPayment(data) {
  return request({
    url: '/stu/reg/payment/checkPending/' + data,
    method: 'get',
  })
}



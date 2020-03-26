import request from '@/utils/httpRequest'
// 校区 成交金额 日报表
export function payTotalDay (num) {
  return request({
    url: '/stu/reg/schoolLog/payTotal/day/' + num,
    method: 'get'
  })
}
// 校区 成交金额 周报表
export function payTotalWeek (num) {
  return request({
    url: '/stu/reg/schoolLog/payTotal/week/' + num,
    method: 'get'
  })
}
// 校区 成交金额 月报表
export function payTotalMonth (num) {
  return request({
    url: '/stu/reg/schoolLog/payTotal/month/' + num,
    method: 'get'
  })
}

// 校区 回款额 日报表
export function paymentDay (num) {
  return request({
    url: '/stu/reg/schoolLog/payment/day/' + num,
    method: 'get'
  })
}
// 校区 回款额 周报表
export function paymentWeek (num) {
  return request({
    url: '/stu/reg/schoolLog/payment/week/' + num,
    method: 'get'
  })
}
// 校区 回款额 月报表
export function paymentMonth (num) {
  return request({
    url: '/stu/reg/schoolLog/payment/month/' + num,
    method: 'get'
  })
}

// 校区 退费额 日报表
export function offPriceDay (num) {
  return request({
    url: '/stu/reg/schoolLog/offPrice/day/' + num,
    method: 'get'
  })
}
// 校区 退费额 周报表
export function offPriceWeek (num) {
  return request({
    url: '/stu/reg/schoolLog/offPrice/week/' + num,
    method: 'get'
  })
}
// 校区 退费额 月报表
export function offPriceMonth (num) {
  return request({
    url: '/stu/reg/schoolLog/offPrice/month/' + num,
    method: 'get'
  })
}

// 当天成交信息
export function infoDay () {
  return request({
    url: '/stu/reg/schoolLog/info/day',
    method: 'get'
  })
}
// 本周成交信息
export function infoWeek () {
  return request({
    url: '/stu/reg/schoolLog/info/week',
    method: 'get'
  })
}
// 本月成交信息
export function infoMonth () {
  return request({
    url: '/stu/reg/schoolLog/info/month',
    method: 'get'
  })
}

// 电邀老师日报
export function dyTeacherDayInfo (date) {
  return request({
    url: '/stu/reg/userLog/dianyao/day',
    method: 'get',
    params: { date }
  })
}
// 电邀老师周报
export function dyTeacherWeekInfo (date) {
  return request({
    url: '/stu/reg/userLog/dianyao/week',
    method: 'get',
    params: { date }
  })
}
// 电邀老师月报
export function dyTeacherMonthInfo (date) {
  return request({
    url: '/stu/reg/userLog/dianyao/month',
    method: 'get',
    params: { date }
  })
}

// 招生老师日报
export function zsTeacherDayInfo (date) {
  return request({
    url: '/stu/reg/userLog/zhaosheng/day',
    method: 'get',
    params: { date }
  })
}
// 电邀老师周报
export function zsTeacherWeekInfo (date) {
  return request({
    url: '/stu/reg/userLog/zhaosheng/week',
    method: 'get',
    params: { date }
  })
}
// 电邀老师月报
export function zsTeacherMonthInfo (date) {
  return request({
    url: '/stu/reg/userLog/zhaosheng/month',
    method: 'get',
    params: { date }
  })
}

import request from '@/utils/httpRequest'


// 当天成交信息
export function infoDay () {
    return request({
      url: '/stu/reg/userLog/getOnePayTotalDay',
      method: 'get'
    })
  }
  // 本周成交信息
  export function infoWeek () {
    return request({
      url: '/stu/reg/userLog/getOnePayTotalWeek',
      method: 'get'
    })
  }
  // 本月成交信息
  export function infoMonth () {
    return request({
      url: '/stu/reg/userLog/getOnePayTotalMonth',
      method: 'get'
    })
  }

// 教师 成交金额 日报表
export function payTotalDay (num) {
  return request({
    url: '/stu/reg/userLog/payTotalDayEcharts/' + num,
    method: 'get'
  })
}
// 教师 成交金额 周报表
export function payTotalWeek (num) {
  return request({
    url: '/stu/reg/userLog/payTotalWeekEcharts/' + num,
    method: 'get'
  })
}
// 教师 成交金额 月报表
export function payTotalMonth (num) {
  return request({
    url: '/stu/reg/userLog/payTotalMonthEcharts/' + num,
    method: 'get'
  })
}

// 教师 回款额 日报表
export function paymentDay (num) {
  return request({
    url: '/stu/reg/userLog/paymentDayEcharts/' + num,
    method: 'get'
  })
}
// 教师 回款额 周报表
export function paymentWeek (num) {
  return request({
    url: '/stu/reg/userLog/paymentWeekEcharts/' + num,
    method: 'get'
  })
}
// 教师 回款额 月报表
export function paymentMonth (num) {
  return request({
    url: '/stu/reg/userLog/paymentMonthEcharts/' + num,
    method: 'get'
  })
}

// 教师 退费额 日报表
export function offPriceDay (num) {
  return request({
    url: '/stu/reg/userLog/offPriceDayEcharts/' + num,
    method: 'get'
  })
}
// 教师 退费额 周报表
export function offPriceWeek (num) {
  return request({
    url: '/stu/reg/userLog/offPriceWeekEcharts/' + num,
    method: 'get'
  })
}
// 教师 退费额 月报表
export function offPriceMonth (num) {
  return request({
    url: '/stu/reg/userLog/offPriceMonthEcharts/' + num,
    method: 'get'
  })
}




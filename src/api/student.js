import request from '@/utils/httpRequest'

export function stuList(page,limit,stuName,stuPhone,cardId) {
    return request({
      url: '/stu/user/list',
      method: 'get',
      params: { page,limit,stuName,stuPhone,cardId }
    })
}

export function stuInfo(data) {
  return request({
    url: '/stu/user/info/' + data,
    method: 'get'
  })
}

export function stuListSave(data) {
    return request({
      url: '/stu/user/save',
      method: 'post',
      data
    })
}

export function stuListUpdate(data) {
    return request({
      url: '/stu/user/update',
      method: 'post',
      data
    })
}

export function stuListDelete(data) {
    return request({
      url: '/stu/user/delete',
      method: 'post',
      data
    })
}

export function stuProcess(page, limit, monthDate, stuUserName, stuPhone, schoolId) {
  return request({
    url: '/cou/attend/stuMonth/list',
    method: 'get',
    params: { page, limit, monthDate, stuUserName, stuPhone, schoolId }
  })
}


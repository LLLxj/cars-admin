
import request from '@/utils/httpRequest'

export function jobList(page, limit, jobName) {
    return request({
      url: '/cos/job/list',
      method: 'get',
      params: { page, limit, jobName }
    })
}

export function jobInfo(data) {
  return request({
    url: '/cos/job/info/' + data,
    method: 'get'
  })
}

export function jobSave(data) {
  return request({
    url: '/cos/job/save',
    method: 'post',
    data
  })
}

export function jobUpdate(data) {
  return request({
    url: '/cos/job/update',
    method: 'post',
    data
  })
}

export function jobListDelete(data) {
  return request({
    url: '/cos/job/delete',
    method: 'post',
    data
  })
}
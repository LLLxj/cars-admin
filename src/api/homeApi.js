
import request from '@/utils/httpRequest'

export function cplanContCount () {
  return request({
    url: '/home/cplanContCount',
    method: 'get'
  })
}

export function stuRegCount () {
  return request({
    url: '/home/stuRegCount',
    method: 'get'
  })
}

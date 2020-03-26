import request from '@/utils/httpRequest'

export function login(username, password, captcha, uuid) {
  return request({
    url: '/sys/login',
    method: 'get',
    params: { username, password, captcha, uuid }
  })
}
/**
 * 开发环境
 */
;(function () {
  window.SITE_CONFIG = {}

  // api接口请求地址
  // window.SITE_CONFIG['baseUrl'] = 'http://admin.school.heigrace.com/api'
  // window.SITE_CONFIG['baseUrl'] = 'http://120.78.143.29:8080/'
  // window.SITE_CONFIG['baseUrl'] = 'http://192.168.1.102:9080'
  window.SITE_CONFIG['baseUrl'] = 'http://47.106.102.93:8086'
  // window.SITE_CONFIG['baseUrl'] = 'http://192.168.1.26:8080'
  // window.SITE_CONFIG['baseUrl'] = 'http://localhost:9080'

  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain'] = './' // 域名
  window.SITE_CONFIG['version'] = ''   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl'] = window.SITE_CONFIG.domain + window.SITE_CONFIG.version
})()

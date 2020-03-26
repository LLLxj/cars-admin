import request from '@/utils/httpRequest'

// const baseUrl = 'http://192.168.1.107:9080'
const baseUrl = ''

class MessageApi {
  /**
   * 消息中心
   */
// 加载消息中心列表数据
  static list (params) {
    return request({
      url: `${baseUrl}/sys/message/list`,
      method: 'get',
      params: params
    })
  }
  /**
   * 阅读一条消息
   */
  static hasReadOne (msgId) {
    return request({
      url: `${baseUrl}/sys/message/info/` + msgId,
      method: 'get',
    })
  }
  /**
   * 阅读同类型所有消息
   */
  static hasReadAll (msgId) {
    return request({
      url: `${baseUrl}/sys/message/info/all` + msgId,
      method: 'get',
    })
  }

  /**
   * 删除一条消息
   */
  static delete (msgId) {
    return request({
      url: `${baseUrl}/sys/message/delete/` + msgId,
      method: 'delete',
    })
  }
  /**
   * 清空类型消息
   */
  static clear (type) {
    return request({
      url: `${baseUrl}/sys/message/delete/all/` + type ,
      method: 'delete',
    })
  }
  /**
   * 查询消息数量信息
   */
  static checkCountInfo () {
    return request({
      url: `${baseUrl}/sys/message/countInfo`,
      method: 'get',
    })
  }
  /**
   * 查询数量信息总量
   */
  static checkTotalCount () {
    return request({
      url: `${baseUrl}/sys/message/totalCount`,
      method: 'get',
    })
  }
  
  /**
   * websocket地址
   */
  static webSocketUrl () {
    return request({
      url: `${baseUrl}/sys/message/websocketUrl`,
      method: 'get',
    })
  }

  static websocket () {
    return request({
      url: 'ws://192.168.1.107:9588/websocket',
    })
  }
}

export default MessageApi

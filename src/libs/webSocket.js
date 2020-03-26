/**
 * @class Socket
 *  重连Socket 机制
 *  by wang
 */
class Socket {
  constructor (option) {
    this.websocket = null
    this.lockReconnect = false
    this.socketUrl = option.socketUrl + option.token
    this.callback = option.soketCallback
    this.websocket = null
    this.lockReconnect = false
    this.timeout = 10000
    this.createWebSocket()
  }

  createWebSocket () {
    try {
      this.websocket = new WebSocket(this.socketUrl)
      this.initEventHandle()
    } catch (e) {
      this.reconnect(this.socketUrl, this.timeout)
    }
  }

  initEventHandle () {
    let that = this
    this.websocket.onopen = (evt) => {
      that.websocket.send('socket已经打开...')
    }
    this.websocket.onmessage = (evt) => {
      that.socketData = evt.data
      let data = JSON.parse(that.socketData)
      switch (data.type) {
        case 1000:// token验证失败
          that.lockReconnect = true
          break
        case 1001: // 主动断开
          that.lockReconnect = true
          break
        default:
          if (typeof that.callback === 'function') {
            that.callback(data)
          }
      }
    }
    this.websocket.onclose = (evt) => {
      that.reconnect(that.timeout)
    }
    this.websocket.onerror = (error) => {
      that.reconnect(that.timeout)
      console.log('socket连接错误' + error)
    }
  }

  reconnect (url, timeout) {
    if (this.lockReconnect) return
    this.lockReconnect = true
    // 没连接上会一直重连，设置延迟避免请求过多
    setTimeout(() => {
      this.createWebSocket()
      this.lockReconnect = false
    }, timeout)
  }
}

export default Socket

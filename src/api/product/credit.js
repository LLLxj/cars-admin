
import request from '@/utils/httpRequest'
const baseUrl = '/apiPro'

class Credit {
  static create (data) {
    return request({
      url: `${baseUrl}/loan/credit/assessCredit`,
      method: 'post',
      data
    })
  }
}

export default Credit

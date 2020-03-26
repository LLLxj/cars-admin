import request from '@/utils/httpRequest'

const baseUrl = '/apiPro'

class Dept {
   
  static list(params) {
    return request({
      url: `${baseUrl}/sys/dept/list`,
      method: 'get',
      params: params
    })
  }

  static norList(params) {
    return request({
      url: `${baseUrl}/sys/dept/normalList`,
      method: 'get',
      params: params
    })
  }

  static disList(params) {
    return request({
      url: `${baseUrl}/sys/dept/disableList`,
      method: 'get',
      params: params
    })
  }
  

  static treeList() {
    return request({
      url: `${baseUrl}/sys/dept/treeList`,
      method: 'get',
    })
  }

  static info(data) {
    return request({
      url: `${baseUrl}/sys/dept/info/` + data,
      method: 'get',
    })
  }

  static update(data) {
    return request({
      url: `${baseUrl}/sys/dept/update`,
      method: 'post',
      data
    })
  }

  static save(data) {
    return request({
      url: `${baseUrl}/sys/dept/save`,
      method: 'post',
      data
    })
  }

  static disable(data) {
    return request({
      url: `${baseUrl}/sys/dept/disable/` + data,
      method: 'get',
    })
  }

  static awake(data) {
    return request({
      url: `${baseUrl}/sys/dept/nomarl/` + data,
      method: 'get',
    })
  }

  static delete(data) {
    return request({
      url: `${baseUrl}/sys/dept/delete/` + data,
      method: 'get',
    })
  }

}

export default Dept



export function deptList (page, limit, deptId) {
  return request({
    url: '/sys/dept/list',
    method: 'get',
    params: { page, limit, deptId }
  })
}

export function deptInfo (data) {
  return request({
    url: '/sys/dept/info/' + data,
    method: 'get',
  })
}

export function treeList () {
  return request({
    url: '/sys/dept/treeList',
    method: 'get',
  })
}

export function getTreeList () {
  return request({
    url: '/sys/dept/getDeptList',
    method: 'get',
  })
}


export function saveDept (data) {
  return request({
    url: '/sys/dept/save',
    method: 'post',
    data
  })
}

export function updateDept (data) {
  return request({
    url: '/sys/dept/update',
    method: 'post',
    data
  })
}


export function deleteDept (data) {
  return request({
    url: '/sys/dept/delete/' + data,
    method: 'post',
  })
}



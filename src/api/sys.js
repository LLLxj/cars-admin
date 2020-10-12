import request from '@/utils/httpRequest'
const baseUrl = '/apiPro'

export function allDyTeacher() {
  return request({
    url: '/sys/user/selectSpread',
    method: 'get',
  })
}

export function allZsTeacher() {
  return request({
    url: '/sys/user/selectRecruit',
    method: 'get',
  })
}

export function jxTeacherList(page, limit, username) {
    return request({
      url: '/sys/user/queryJiaoXuePage',
      method: 'get',
      params: { page, limit, username }
    })
}

export function xsTeacherList( page, limit, username ) {
  return request({
    url: '/sys/user/queryXiaoShouPage',
    method: 'get',
    params: { page, limit, username }
  })
}

export function jwTeacherList( page, limit, username ) {
  return request({
    url: '/sys/user/queryJiaoWuPage',
    method: 'get',
    params: { page, limit, username }
  })
}

export function tgTeacherList( page, limit, username ) {
  return request({
    url: '/sys/user/getSpreadTeacher',
    method: 'get',
    params: { page, limit, username }
  })
}

export function tgTeacherAuthList( page, limit, username ) {
  return request({
    url: '/sys/user/selectSpreadSysUser',
    method: 'get',
    params: { page, limit, username }
  })
}


export function zsTeacherList( page, limit, username ) {
  return request({
    url: '/sys/user/getRecruitTeacher',
    method: 'get',
    params: { page, limit, username }
  })
}

export function zsTeacherAuthList( page, limit, username ) {
  return request({
    url: '/sys/user/selectRecruitSysUser',
    method: 'get',
    params: { page, limit, username }
  })
}

export function userList( page, limit, username, deptId) {
  return request({
    url: '/sys/user/list',
    method: 'get',
    params: { page, limit, username, deptId }
  })
}

export function userAuthList( page, limit, username) {
  return request({
    url: '/sys/user/selectStautsSysUser',
    method: 'get',
    params: { page, limit, username }
  })
}

// 创建人不带权限
export function creatotAuthList( page, limit, username) {
  return request({
    url: '/sys/user/selectCreateSysUser',
    method: 'get',
    params: { page, limit, username }
  })
}


export function login ( data ) {
  return request({
    url: `${baseUrl}/login`,
    method: 'post',
    data
  })
}

export function resourceList() {
  return request({
    url: '/cust/channe/selectList',
    method: 'get',
  })
}

// 获得所有职位列表
export function getAllTeacherList(page, limit, username) {
  return request({
    url: '/sys/user/getUpdateClassRecruitTeacher',
    method: 'get',
    params: { page, limit, username }
  })
}

// 获取审核人
export function getAllCheckList(page, limit, username) {
  return request({
    url: '/sys/user/getStautsUser',
    method: 'get',
    params: { page, limit, username }
  })
}

// 所有校区
export function allSchoolList() {
  return request({
    url: '/cos/school/transferSchoolList',
    method: 'get',
  })
}

// 部门对应角色
export function getNewRoleList(deptId) {
  return request({
    url: '/sys/dept/role/list',
    method: 'get',
    params: { deptId }
  })
}

// 获取菜单路由
export function getMenuRoute(data) {
  return request({
    url: '/sys/menu/getMenuId/' + data,
    method: 'get',
  })
}

// 获取所有职务
export function getAllPosition() {
  return request({
    url: '/cos/job/jobList',
    method: 'get',
  })
}

// 根据数据字典编码获取数据
export function getDateByDict() {
  return request({
    url: '/cos/job/jobList',
    method: 'get',
  })
}

class System{

  static login (data) {
    return request({
      url: `${baseUrl}/login`,
      method: 'post',
      data
    })
  }

  static loginOut () {
    return request({
      url: `${baseUrl}/logout`,
      method: 'post',
    })
  }

  static getInfo (data) {
    return request({
      url: `${baseUrl}/sys/user/info/` + data,
      method: 'get',
    })
  }

}

export default System



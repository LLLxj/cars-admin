/**
 * 邮箱
 * @param {*} s
 */
export function isEmail (s) {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile (s) {
  return /^1[0-9]{10}$/.test(s)
}

export function isUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone (s) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL (s) {
  return /^http[s]?:\/\/.*/.test(s)
}

/**
 * 去除两头空格
 * @param {*} s
 */
export function removeBlank (s) {
  return s.replace(/^\s+|\s+$/g,"")
}

/**
 * 去除所有空格
 * @param {*} s
 */
export function removAllBlank (s) {
  return s.replace(/\s+/g,"");  
}

/**
 * 去除左空格
 * @param {*} s
 */
export function removeLeftBlank (s) {
  return s.replace( /^\s*/, ''); 
}

/**
 * 去除右空格
 * @param {*} s
 */
export function removeRightBlank (s) {
  return s.replace(/(\s*$)/g, "");  
}

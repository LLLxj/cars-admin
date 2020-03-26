/**
 * 获取学历列表
 */
export function getDateTypeList (isSelect) {
  const dateTypeOptions = [
    {value: 0,label: '字符串'}, 
    {value: 1,label: '整型'}, 
    {value: 2,label: '浮点型'}, 
    {value: 3, label: '布尔'},
    {value: 4,label: 'json对象'}
  ]
  // 如果不是查询条件
  if (!isSelect) {
    // shift() 方法用于把数组的第一个元素从其中删除，并返回第一个元素的值。
    dateTypeOptions.shift()
  }
  return dateTypeOptions
}

/**
 * 根据value获取label
 * @param val
 * @returns {string}
 */
export function getDateTypeLabelByVal (val) {
  let label = '-'
  let options = getDateTypeList()
  for (let i = 0; i < options.length; i++) {
    let item = options[i]
    if (item.value === val) {
      label = item.label
      break
    }
  }
  return label
}

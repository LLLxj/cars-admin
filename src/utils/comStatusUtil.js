/**
 * 获取审核状态列表
 */
export function getComStatusList (isSelect) {
  const list = [
    {value: '', label: '全部'},
    {value: 1, label: '待审核'},
    {value: 2, label: '通过'},
    {value: 0, label: '作废'}
  ]
  // 如果不是查询条件
  if (!isSelect) {
    // shift() 方法用于把数组的第一个元素从其中删除，并返回第一个元素的值。
    list.shift()
  }
  return list
}

/**
 * 根据value获取label
 * @param val
 * @returns {string}
 */
export function getComStatusLabelByVal (val) {
  let label = '-'
  let options = getComStatusList()
  for (let i = 0; i < options.length; i++) {
    let item = options[i]
    if (item.value === val) {
      label = item.label
      break
    }
  }
  return label
}


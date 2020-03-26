/**
 * 获取学历列表
 */
export function getEduTypeList (isSelect) {
  const educTypeOptions = [
    {value: '', label: '全部'},
    {value: 5, label: '本科以上'},
    {value: 0, label: '本科'},
    {value: 1, label: '专科'},
    {value: 6, label: '高中'},
    {value: 2, label: '职高'},
    {value: 3, label: '初中'},
    {value: 4, label: '初中以下'},
    {value: 7, label: '中专'},
  ]
  // 如果不是查询条件
  if (!isSelect) {
    // shift() 方法用于把数组的第一个元素从其中删除，并返回第一个元素的值。
    educTypeOptions.shift()
  }
  return educTypeOptions
}

/**
 * 根据value获取label
 * @param val
 * @returns {string}
 */
export function getEduTypeLabelByVal (val) {
  let label = '-'
  let options = getEduTypeList()
  for (let i = 0; i < options.length; i++) {
    let item = options[i]
    if (item.value === val) {
      label = item.label
      break
    }
  }
  return label
}

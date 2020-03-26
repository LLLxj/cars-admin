/**
 * 获取学历列表
 */
export function getInClassStatusList (isSelect) {
    const classStatus = [
      {value: '', label: '全部'},
      {value: 1, label: '在读'},
      {value: 2, label: '休学'},
      {value: 3, label: '毕业'},
      {value: 4, label: '作废'},
    ]
    // 如果不是查询条件
    if (!isSelect) {
      // shift() 方法用于把数组的第一个元素从其中删除，并返回第一个元素的值。
      classStatus.shift()
    }
    return classStatus
  }
  
  /**
   * 根据value获取label
   * @param val
   * @returns {string}
   */
  export function getInClassStatusByVal (val) {
    let label = '-'
    let options = getInClassStatusList()
    for (let i = 0; i < options.length; i++) {
      let item = options[i]
      if (item.value === val) {
        label = item.label
        break
      }
    }
    return label
  }
  
export default {
  namespaced: true,
  state: {
    // 页面文档可视高度(随窗口改变大小)
    documentClientHeight: 0,
    // 导航条, 布局风格, defalut(默认) / inverse(反向)
    navbarLayoutType: 'default',
    // 侧边栏, 布局皮肤, light(浅色) / dark(黑色)
    sidebarLayoutSkin: 'dark',
    // 侧边栏, 折叠状态
    sidebarFold: false,
    // 侧边栏, 菜单
    menuList: [],
    menuActiveName: '',
    // 主入口标签页
    mainTabs: [],
    mainTabsActiveName: '',
    // 消息数量
    messageCount: 0,
    // 通知数量
    noticeCount: 0,
    // 消息通知总数
    totalCount: 0,
    //报名表
    regSearchNo: '',
    //缴费单
    paymentSearchNo: '',
    //优惠单
    offSearchNo: '',
    // 退费单
    refundSearchNo: '',
    // 转校
    changeSchoolSearchNo: ''
  },
  mutations: {
    updateDocumentClientHeight (state, height) {
      state.documentClientHeight = height
    },
    updateNavbarLayoutType (state, type) {
      state.navbarLayoutType = type
    },
    updateSidebarLayoutSkin (state, skin) {
      state.sidebarLayoutSkin = skin
    },
    updateSidebarFold (state, fold) {
      state.sidebarFold = fold
    },
    updateMenuList (state, list) {
      state.menuList = list
    },
    updateMenuActiveName (state, name) {
      state.menuActiveName = name
    },
    updateMainTabs (state, tabs) {
      state.mainTabs = tabs
    },
    updateMainTabsActiveName (state, name) {
      state.mainTabsActiveName = name
    },
    setMessageCount (state, count) {
      state.messageCount = count
    },
    setNoticeCount (state, count) {
      state.noticeCount = count
    },
    setTotalCount (state, count) {
      state.totalCount = count
    },
    setPaymentNo (state, count) {
      state.paymentSearchNo = count
    },
    setRegSearchNo (state, count) {
      state.regSearchNo = count
    },
    setOffSearchNo (state, count) {
      state.offSearchNo = count
    },
    setRefundSearchNo (state, count) {
      state.refundSearchNo = count
    },
    setChangeSchoolSearchNo (state, count) {
      state.changeSchoolSearchNo = count
    },
  }
}

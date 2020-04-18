<template>
  <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
    <!-- <div class="site-navbar__header">
      <h1 class="site-navbar__brand" @click="$router.push({ name: 'home' })">
        <a class="site-navbar__brand-lg" href="javascript:;"><img src="~@/assets/img/menu_long.png" style="width: 156px;height: 40px;"/></a>
        <a class="site-navbar__brand-mini" href="javascript:;"><img src="~@/assets/img/menu_short.png" style="width: 40px;height: 38px;"/></a>
      </h1>
    </div> -->
    <div class="site-navbar__body clearfix">
      <el-menu class="site-navbar__menu" mode="horizontal">
        <el-menu-item class="site-navbar__switch" index="0" @click="sidebarFold = !sidebarFold">
          <icon-svg name="zhedie"></icon-svg>
        </el-menu-item>
      </el-menu>

      <el-menu class="site-navbar__menu" mode="horizontal">
        <el-menu-item class="site-navbar__switch" index="2">
          <breadCrumb></breadCrumb>
        </el-menu-item>
      </el-menu>

      <!--右侧按钮组-->
      <el-menu class="site-navbar__menu site-navbar__menu--right" mode="horizontal">
        <!-- 消息中心 -->
        <!-- <el-menu-item index="0" style="position:relative;z-index:100">
          <el-popover placement="bottom-end" width="350" trigger="click">
            <div class="message-wrap">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane name="first">
                  <div slot="label" class="tab-title">
                    消息
                    <div class="tab-title-abs" >
                      <el-badge  :value="mesCount || ''" class="item">
                      </el-badge>
                    </div>
                  </div>
                  <div class="messageList-wrap" v-if="mesList.length !== 0">
                    <div :class="item.readFlag === 1 ? 'message-list hasRead': 'message-list noRead'" v-for="item in mesList" :key="item.msgId">
                      <el-row :gutter="24" style="margin-left:0;margin-right:0;">
                        <el-col :span="3" style="margin-top:10px;">
                          <i class="el-icon-message"></i>
                        </el-col>
                        <el-col :span="14">
                          <div class="getDetail" @click="getMessageDetail(item)">
                            <div>来自{{item.sourceName}}</div>
                            <div>内容：{{item.content}}</div>
                          </div>
                        </el-col>
                        <el-col :span="3" style="margin-top:10px;text-align:center" v-if="item.readFlag === 0">
                          <i class="el-icon-news" @click="hasRead(item)"></i>
                        </el-col>
                        <el-col :span="3" style="margin-top:10px;text-align:center" v-else>
                        </el-col>
                        <el-col :span="3" style="margin-top:10px;text-align:center">
                          <i class="el-icon-close" @click="deleteMes(item)"></i>
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                  <div class="messageList-wrap" v-else>
                    <div class="noData">暂无消息</div>
                  </div>
                  <div class="loadPart">
                    <a type="text" v-if="loadMoreMesBtn" @click="loadMore">加载更多</a>
                    <div v-if="mesLoading">正在加载。。。</div>
                  </div>
                  <div class="clearMes" @click="clearMessage" v-if="mesList.length !== 0">清空消息</div>
                </el-tab-pane>
                <el-tab-pane name="second">
                  <div slot="label" class="tab-title">
                    通知
                    <div class="tab-title-abs" >
                      <el-badge  :value="noticeCount || ''" class="item">
                      </el-badge>
                    </div>
                  </div>
                    <div class="messageList-wrap" v-if="noticeList.length !== 0">
                      <div :class="item.readFlag === 1 ? 'message-list hasRead': 'message-list noRead'" v-for="item in noticeList" :key="item.msgId">
                        <el-row :gutter="24" style="margin-left:0;margin-right:0;">
                          <el-col :span="3" style="margin-top:10px;">
                            <i class="el-icon-message"></i>
                          </el-col>
                          <el-col :span="14">
                            <div class="getDetail" @click="getMessageDetail(item)">
                              <div>来自{{item.sourceName}}</div>
                              <div>内容：{{item.content}}</div>
                            </div>
                          </el-col>
                          <el-col :span="3" style="margin-top:10px;text-align:center" v-if="item.readFlag === 0">
                            <i class="el-icon-news" @click="hasRead(item)"></i>
                          </el-col>
                          <el-col :span="3" style="margin-top:10px;text-align:center" v-else>
                          </el-col>
                          <el-col :span="3" style="margin-top:10px;text-align:center">
                            <i class="el-icon-close" @click="deleteMes(item)"></i>
                          </el-col>
                        </el-row>
                      </div>
                    </div>
                    <div class="messageList-wrap" v-else>
                      <div class="noData">暂无消息</div>
                    </div>
                    <div class="loadPart">
                      <a type="text" v-if="loadMoreNocBtn" @click="loadMore">加载更多</a>
                      <div v-if="nocLoading">正在加载。。。</div>
                    </div>
                    <div class="clearMes" @click="clearMessage" v-if="noticeList.length !== 0">清空消息</div>
                </el-tab-pane>
              </el-tabs>
              
              
            </div>
            <icon-svg slot="reference" icon-class="message" name="message"></icon-svg>
          </el-popover>
          <div class="message-box" style="position:absolute;top:0px;width:100%;right:0;z-index:-1">
            <el-badge :value="totalCount || ''" class="item" style="margin-left:25px;">
            </el-badge>
          </div>
        </el-menu-item> -->

        <!-- 全屏 -->
        <el-menu-item index="1" @click="changeFullScreen()">
          <icon-svg :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" name="fullscreen"></icon-svg>
        </el-menu-item>

        <el-menu-item class="site-navbar__avatar" index="3">
          <el-dropdown :show-timeout="0" placement="bottom">
            <span class="el-dropdown-link">
            {{ name }}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
  </nav>
</template>

<script>
  import { Notification } from 'element-ui';
  import { mapGetters } from 'vuex'
  import UpdatePassword from './main-navbar-update-password'
  // import screenfull from '@/components/screenFull'
  import screenfull from 'screenfull'
  import breadCrumb from '@/components/bread-crumb'
  import { clearLoginInfo } from '@/utils'
  import Socket from '@/libs/webSocket'
  import MessageApi from '@/api/message'
  import System from '@/api/sys'
  import { getUserId } from '@/utils/userInfoUtil'
  import Vue from 'vue'
  export default {
    data () {
      return {
        updatePassowrdVisible: false,
        isFullscreen: false,
        activeName: 'first',
        loadMoreMesBtn: true,
        loadMoreNocBtn: true,
        mesLoading: false,
        nocLoading: false,
        // 消息分页查询参数
        pageParam: {
          page: 1,
          limit: 10,
          type: 2001
        },
        mesList: [],
        noticeList: [],
        messageCount: '',
        type: 2001,
        // 消息通知总数
        // totalCount: '',
        messageNoticeShow: false 
      }
    },
    components: {
      UpdatePassword, screenfull, breadCrumb
    },
    mounted() {
      // this.getUserInfo()
      // this.$nextTick(function () {
      //   this.getUserInfo()
      // })
      // 保证完全挂载
      // this.$nextTick(function () {
      //   this.socket()
      // })
      // this.$store.commit('common/setMessageCount', 11)
    },
    computed: {
      ...mapGetters([
        'name'
      ]),
      navbarLayoutType: {
        get () { return this.$store.state.common.navbarLayoutType }
      },
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold },
        set (val) { this.$store.commit('common/updateSidebarFold', val) }
      },
      menuActiveName: {
        get () { return this.$store.state.common.menuActiveName },
        set (val) { this.$store.commit('common/updateMenuActiveName', val) }
      },
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      },
      mainTabsActiveName: {
        get () { return this.$store.state.common.mainTabsActiveName },
        set (val) { this.$store.commit('common/updateMainTabsActiveName', val) }
      },
      // userName: {
      //   get () { return this.$store.state.user.name }
      // },
      // userName: {
      //   get () { return this.$store.state.user.name },
      //   set (val) { this.$store.commit('user/updateName', val) }
      // },
      mesCount: {
        get () { return this.$store.state.common.messageCount },
        set (val) { this.$store.commit('common/setMessageCount', val) }
      },
      totalCount: {
        get () { return this.$store.state.common.totalCount },
        set (val) { this.$store.commit('common/setTotalCount', val) }
      },
      noticeCount: {
        get () { return this.$store.state.common.noticeCount },
        set (val) { this.$store.commit('common/setNoticeCount', val) }
      },
      paymentSearchNo: {
        get () { return this.$store.state.common.paymentSearchNo },
        set (val) { this.$store.commit('common/setPaymentNo', val) }
      },
      regSearchNo: {
        get () { return this.$store.state.common.regSearchNo },
        set (val) { this.$store.commit('common/setRegSearchNo', val) }
      },
      offSearchNo: {
        get () { return this.$store.state.common.offSearchNo },
        set (val) { this.$store.commit('common/setOffSearchNo', val) }
      },
      refundSearchNo: {
        get () { return this.$store.state.common.refundSearchNo },
        set (val) { this.$store.commit('common/setRefundSearchNo', val) }
      },
      changeSchoolSearchNo: {
        get () { return this.$store.state.common.changeSchoolSearchNo },
        set (val) { this.$store.commit('common/setChangeSchoolSearchNo', val) }
      },
    },
    init() {
      if (screenfull.enabled) {
        screenfull.on('change', () => {
          this.isFullscreen = screenfull.isFullscreen
        })
      }
      // this.socket()
    },
    created () {
    },
    methods: {
      changeFullScreen() {
        if (!screenfull.enabled) {
          this.$message({
            message: '你的浏览器不支持此功能',
            type: 'warning'
          })
          return false
        }
        screenfull.toggle()
      },
      // 修改密码
      updatePasswordHandle () {
        this.updatePassowrdVisible = true
        this.$nextTick(() => {
          this.$refs.updatePassowrd.init()
        })
      },
      handleClick(tab, event) {
        let actName = this.activeName
        if(actName == 'second'){
          this.type = 2000
          this.getNoticeList()
        } else {
          this.type = 2001
        }
      },
      // 退出
      logoutHandle () {
        this.$confirm(`确定进行[退出]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          clearLoginInfo()
          this.$router.push({ name: 'login' })
          // this.$http({
          //   url: this.$http.adornUrl('/sys/logout'),
          //   method: 'post',
          //   data: this.$http.adornData()
          // }).then(({data}) => {
          //   if (data && data.code === 0) {
          //     clearLoginInfo()
          //     this.$router.push({ name: 'login' })
          //   }
          // })
        }).catch(() => {})
      },
      // websocket
      // socket() {
      //   // let this = this
      //   MessageApi.webSocketUrl().then(({data}) => {
      //     let {code, msg, result} = data
      //     if (code === 0) {
      //       new Socket({
      //         // soket服务地址
      //         socketUrl: result,
      //         token: Vue.cookie.get('token'),
      //         // 回调data
      //         soketCallback: (data) => {
      //           this.soketCallback(data)
      //         }
      //       })
      //     } else {
      //       this.$message.error(msg)
      //     }
      //   })
      // },
      //  soket回调
      // soketCallback(data) {
      //   let {type, msg, result} = data
      //   if(result !== undefined){
      //     var json = JSON.parse(result)
      //     var path = ''
      //     switch (json.path) {
      //       case 0: // 无跳转
      //         break
      //       case 1: // 报名表
      //         path = '报名表'
      //         break
      //       case 2: // 缴费管理
      //         path = '缴费单'
      //         break
      //       case 3: // 优惠管理
      //         path = '优惠单'
      //         break
      //       case 4: // 退费管理
      //         path = '退费单'
      //         break
      //       case 5: // 转校管理
      //         path = '转校申请'
      //         break
      //       default:
      //         break
      //     } 
      //   }
      //   switch (type) {
      //     case 1002:
      //       // 连接成功
      //       // this.$message.success(msg)
      //       // 加载消息数量
      //       this.getMessageNum()
      //       // 加载消息列表
      //       this.getMessageList()
      //       break
      //     case 2001: // 消息
      //       this.getMessageNum()
      //       let mynote = this.$notify({
      //         title: '来自' + json.receive + '的一条' + path,
      //         message: json.message,
      //         position: 'bottom-right',
      //         duration: 0,
      //         onClick: () => {
      //           this.getMessageDetail(json)
      //           mynote.close()
      //         }
      //       });
      //       // 加载消息数量
      //       this.getMessageNum()
      //       break
      //     case 2000: // 通知
      //       this.getMessageNum()
      //       let mynote1 = this.$notify({
      //         title: '来自' + json.receive + '的一条' + path,
      //         message: json.message,
      //         position: 'bottom-right',
      //         duration: 0,
      //         onClick: () => {
      //           this.getMessageDetail(json)
      //           mynote1.close()
      //         }
      //       });
      //       // 加载消息数量
      //       this.getMessageNum()
      //       break
      //     case 2002: // 待办
      //       break
      //     default:
      //       console.log('无法处理的websocket消息:', data)
      //   }
      // },
      // getMessageList () {
      //   this.pageParam.type = '2001'
      //   MessageApi.list(this.pageParam).then(({data}) => {
      //     let {code, msg, result } = data
      //     if(code === 0){
      //       this.mesLoading = false
      //       if(result.list.length < result.totalCount){
      //         this.loadMoreMesBtn = true
      //       } else {
      //         this.loadMoreMesBtn = false
      //       }
      //       this.mesList = result.list
      //       // this.getNoticeList()
      //     }
      //   })
      // },
      // getNoticeList () {
      //   this.pageParam.type = '2000'
      //   MessageApi.list(this.pageParam).then(({data}) => {
      //     let {code, msg, result } = data
      //     if(code === 0){
      //       this.nocLoading = false
            
      //       if(result.list.length < result.totalCount){
      //         this.loadMoreNocBtn = true
      //       } else {
      //         this.loadMoreNocBtn = false
      //       }
      //       this.noticeList = result.list
      //     }
      //   })
      // },
      // // 获取消息总数
      // getMessageNum () {
      //   MessageApi.checkCountInfo().then(({data}) => {
      //     let {code, msg, result } = data
      //     if(code === 0){
      //       this.$store.commit('common/setTotalCount', result.total)
      //       this.$store.commit('common/setMessageCount', result.message)
      //       this.$store.commit('common/setNoticeCount', result.notice)
      //     } else {
      //       this.messageNoticeShow = false
      //     }
      //   })
      // },
      // loadMore() {
      //   this.pageParam.limit = this.pageParam.limit + 10
      //   let type = this.type
      //   switch (type) {
      //     case 2001: // 消息
      //       this.mesLoading = true
      //       this.loadMoreMesBtn = false
      //       this.getMessageList()
      //       break
      //     case 2000: // 通知
      //       this.nocLoading = true
      //       this.loadMoreNocBtn = false
      //       this.getNoticeList()
      //       break
      //     default:
      //       this.getMessageList()
      //       break
      //   } 
      // },
      // // 已读消息
      // hasRead (data) {
      //   MessageApi.hasReadOne(data.msgId).then(({data}) => {
      //     let {code, msg} = data
      //     if(code === 0){
      //       let type = this.type
      //       this.getMessageNum()
      //       switch (type) {
      //         case 2001: // 消息
      //           this.getMessageList()
      //           break
      //         case 2000: // 通知
      //           this.getNoticeList()
      //           break
      //         default:
      //           this.getMessageList()
      //           break
      //       }  
      //     } else {
      //       this.$message.error(msg)
      //     }
      //   })
      // },
      // // 删除消息
      // deleteMes (data) {
      //   MessageApi.delete(data.msgId).then(({data}) => {
      //     let {code, msg} = data
      //     if(code === 0){
      //       this.getMessageNum()
      //       this.getNoticeList()
      //       this.getMessageList()
      //     }
      //   })
      // },
      // // 清空消息 
      // clearMessage () {
      //   MessageApi.clear(this.type).then(({data}) => {
      //     let {code, msg} = data
      //     if (code === 0) {
      //       let type = this.type
      //       this.getMessageNum()
      //       switch (type) {
      //         case 2001: // 消息
      //           this.mesList = []
      //           break
      //         case 2000: // 通知
      //           this.noticeList = []
      //           break
      //         default:
      //           this.mesList = []
      //           break
      //       }
      //     } else {
      //       this.$message.error(msg)
      //     }
      //   })
      // },
      // 获取消息详情
      getMessageDetail (data) {
        this.hasRead(data)
        let tabNo = data.tableNo
        let type = data.path 
        switch (type) {
          case 0: // 无跳转
            break
          case 1: // 报名表
            this.toReg(tabNo)
            break
          case 2: // 缴费管理
            this.toPayment(tabNo)
            break
          case 3: // 优惠管理
            this.toBenefit(tabNo)
            break
          case 4: // 退费管理
            this.toRefund(tabNo)
            break
          case 5: // 转校管理
            this.toChangeSchool(tabNo)
            break
          default:
            break
        }
      },
      // 报名表
      toReg (data) {
        this.regSearchNo = data
        this.$router.push({
          name: 'stu-reg',
        })
      },
      // 缴费管理
      toPayment (data) {
        this.paymentSearchNo = data
        this.$router.push({
          name: 'stu-payment',
        })
      },
      // 优惠管理
      toBenefit (data) {
        this.offSearchNo = data
        this.$router.push({
          name: 'stu-benefit',
        })
      },
      // 退费管理
      toRefund (data) {
        this.refundSearchNo = data
        this.$router.push({
          name: 'stu-refund',
        })
      }, 
      // 转校管理
      toChangeSchool (data) {
        this.changeSchoolSearchNo = data
        this.$router.push({
          name: 'stu-changeSchool',
        })
      },
    }
  }
</script>
<style lang="scss" scoped>
  .message-wrap{
    padding:5px 15px;
    .item{
      margin-top: 5px;
      margin-right: 40px;
      width:100%;
    }
    .tab-title{
      width:100%;
      display:block;
      text-align: center;
      padding:0 20px;
      position:relative;
    }
    .tab-title-abs{
      position: absolute;
      top:0;
      left:30px;
    }
    .el-badge{
      vertical-align: top;
    }
    .messageList-wrap{
      max-height:220px;
      overflow: auto;
    }
    .messageList-wrap .message-list{
      margin-top:5px
    }
    .messageList-wrap .message-list:nth-of-type(1){
      margin-top:0px
    }
    .message-list{
      // background: #E8F9F0;
      padding:5px 0;
      border-radius:2px;
      p{
        font-size:10px;
        padding:0;
        margin:0;
      }
      p:nth-of-type(1){
        font-size:15px;
      }
    }
    .loadPart{
      padding:10px 0;
      text-align: center;
    }
    mes-wrap{
      position:relative;
    }
    .message-box{
      border:1px solid red;
      position: absolute!important;
      width:100%;
      left:0;
      top:100px;
    }
  }
  .noData{
    color:#495060;
    text-align: center;
  }
  .clearMes{
    color: #fff;
    background-color: #19be6b;
    border-color: #19be6b;
    padding:8px 0;
    text-align: center;
    border-radius:5px;
    cursor: pointer;
  }
  .hasRead{
    background: #eaf4fe;
  }
  .noRead{
    background: #E8F9F0;
  }
  .getDetail{
    cursor: pointer;
  }
</style>




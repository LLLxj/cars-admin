<template>
 
    <!-- <el-breadcrumb class="app-breadcrumb" separator="/">
     <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.menuId">
          <span class="no-redirect">{{ item.name }}</span>
          <router-link>{{ item.name }}</router-link>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb> -->
  <!-- <div>

  
    <div v-if="levelList.length === 1">

      <el-breadcrumb class="app-breadcrumb" separator="/" >
          <el-breadcrumb-item>
            <span class="l-bread">首页</span>
          </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div  v-else> -->

      <el-breadcrumb class="app-breadcrumb" separator="/">
        <transition-group name="breadcrumb">
          <el-breadcrumb-item v-for="item in levelList" v-bind:key="item.name">
            <span class="l-bread" v-if="levelList.length === 1">首页</span>
            <span class="l-bread" v-else>{{ item.name }}</span>
          </el-breadcrumb-item>
        </transition-group>
      </el-breadcrumb>

    <!-- </div>
  </div> -->
  
</template>

<script>
import Menu from '@/api/menu'

export default {
  data() {
    return {
      levelList: null,
      isHome: false
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  computed: {
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
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)
      // const first = matched[0]
      // if (first && first.name.trim().toLocaleLowerCase() !== 'home'.toLocaleLowerCase()) {
      //   matched = [{ path: '/dashboard', meta: { title: 'dashboard' }}].concat(matched)
      // }
      this.getDataList(matched[1].meta.menuId)
      // this.levelList = matched
      
    },
    getDataList (data) {
      if(data !== undefined){
        Menu.info(data).then(res => {
          let obj = {}
          obj.menuId = -100
          obj.name = '首页'
          let tempDate = []
          tempDate.push(obj)
          if(res.data && res.data.code === 0){
            if (res.data.data) {
              let resDate = res.data.data.sysMenuCallVoList
              for(var i in resDate){
                tempDate.push(resDate[i])
              }
              this.levelList = tempDate
              }  
          } else {
            this.$message.error(res.data.msg)
          }
        })
      } else {
        let obj = {}
        obj.menuId = -100
        obj.name = '首页'
        let tempDate = []
        tempDate.push(obj)
        this.levelList = tempDate
      }
    } 
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .l-bread{
    display:inline-block;
    line-height:43px;
    cursor: text;
    color:#000000;
  }
  
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    // font-size: 14px;
    line-height: 40px;
    margin-left: 10px;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
  /*breadcrumb transition*/
  .breadcrumb-enter-active,
  .breadcrumb-leave-active {
    transition: all .5s;
  }

  .breadcrumb-enter,
  .breadcrumb-leave-active {
    opacity: 0;
    transform: translateX(0px);
  }

  .breadcrumb-move {
    transition: all .8s;
  }

  .breadcrumb-leave-active {
    position: absolute;
    // opacity: 0;
  }
</style>

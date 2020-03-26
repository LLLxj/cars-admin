<template>
  <div class="mod-user">
    <!--布局容器-->
    <el-container>
      <!--左侧-->
      <el-aside width="320px">
        <school-all-sidebar ref="schoolAllSidebar" @school-sidebar-node-change-event="schoolTreeChangeEvent" @node-contextmenu="schoolTreeHandle"
        @node-addHandle="addHandle" @node-updateHandle="updateHandle" @node-deleteHandle="deleteHandle" />
      </el-aside>
      <!--右侧-->
      <el-main style="padding:0px 20px;">
        <!-- 部门列表 -->
        <partList v-if="partListVisible" ref="partList" @refresTreeList="getRefresh"></partList>
       
        <!-- 新增 -->
        <!-- <partEdit v-if="partEditVisible" ref="partEdit"></partEdit> -->

        <!-- 编辑 -->
        <partUpdate v-if="partUpdateVisible" ref="partUpdate"></partUpdate>

      </el-main>
    </el-container>
  </div>
</template>
<script>

  import { userList } from '@/api/sys'
  import schoolAllSidebar from '../../common-sidebar/school-all-sidebar'
  import ElContainer from 'element-ui/packages/container/index'
  import ElAside from 'element-ui/packages/aside/index'
  import ElMain from 'element-ui/packages/main/index'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  // 部门列表部分
  import partList from './dept-list'
  // 新增部分
  import partEdit from './dept-add'
  // 编辑部门
  import partUpdate from './dept-update'

  export default {
    data () {
      return {
        dataForm: {
          deptId: undefined,
          deptName: undefined
        },
        dataList: [],
        isShow: true,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        downloadLoading: false,
        dataListLoading: false,
        dataListSelections: [],
        // 新增模块
        partEditVisible: false,
        // 列表模块
        partListVisible: true,
        // 编辑模块
        partUpdateVisible: false,
       
      }
    },
    components: {
      ElContainer,
      ElAside,
      ElMain,
      schoolAllSidebar,
      partList,
      partEdit,
      partUpdate
    },
    activated () {
      this.getAllDept()
    },
    methods: {
      // 获取数据列表
      // getDataList () {
      //   this.dataListLoading = true
      //   userList(this.pageIndex,this.pageSize,this.dataForm.userName,this.dataForm.schoolId).then(res => {
      //     if (res.data && res.data.code === 0) {
      //       this.dataList = res.data.page.list
      //       this.totalPage = res.data.page.totalCount
      //       if(this.dataList !== null){
      //         this.isShow = false
      //       }
      //     } else {
      //       this.dataList = []
      //       this.totalPage = 0
      //     }
      //     this.dataListLoading = false
      //   })
      // },
      // 回调刷新树组件
      getRefresh () {
        this.$nextTick(() => {
          this.$refs.schoolAllSidebar.init()
        })
      },
      // 新增操作
      addHandle (data) {
        this.partListVisible = false
        this.partEditVisible = true
        this.partUpdateVisible = false
         this.$nextTick(() => {
          this.$refs.partEdit.init(data)
        })
      },
      // 编辑操作
      updateHandle (data) {
        this.partListVisible = false
        this.partEditVisible = false
        this.partUpdateVisible = true 
         this.$nextTick(() => {
          this.$refs.partUpdate.init(data)
        })
      },
      // 删除操作
      deleteHandle () {
        console.log('删除操作')
      },
      schoolTreeChangeEvent (deptId, deptName) {
        this.dataForm.deptId = deptId
        this.partListVisible = true
        this.$nextTick(() => {
          this.$refs.partList.init(deptId)
        })
      },
      getAllDept () {
        this.partListVisible = true
        this.$nextTick(() => {
          this.$refs.partList.init(0)
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      schoolTreeHandle (event, data, node, handle) {
        
      },
      refreshTreeList () {
        console.log(1)
      }
    }
  }
</script>

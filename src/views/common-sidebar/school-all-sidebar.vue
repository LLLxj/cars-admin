<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span>部门</span>
    </div>
    <!-- <el-tree :data="dataList" :props="defaultProps" v-loading="dataListLoading" @node-click="handleNodeClick" @current-change="currentChange" 
    @node-contextmenu="oncontextmenu"  default-expand-all @node-addHandle="addHandle" @node-updateHandle="updateHandle"
    @node-deleteHandle="deleteHandle" :expand-on-click-node="false"> -->
    <el-tree :data="dataList" :props="defaultProps" v-loading="dataListLoading" @node-click="handleNodeClick" @current-change="currentChange" 
    @node-contextmenu="oncontextmenu"  default-expand-all :expand-on-click-node="false" style="height:70vh;overflow:auto">
      <!-- <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span style="margin-left:15px;" v-if="currData===data">
          <i class="el-icon-plus" @click="addHandle(data)"></i>
          <i class="el-icon-edit-outline"  @click="updateHandle(data)"></i>
          <i class=" el-icon-delete" @click="deleteHandle(data)"></i>
        </span>
      </span> -->
    </el-tree>  
  </el-card>
</template>

<style>
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>

<script>
  import { treeDataTranslate } from '@/utils'
  import Dept from '@/api/dept'
  export default {
    data () {
      return {
        dataListLoading: false,
        dataList: null,
        defaultProps: {
          children: 'children',
          label: 'deptName'
        },
        handlePartVisible: false,
        schoolId: '',
        // currData: [],
        event:[],
        node: [],
        canClick: true
      }
    },
    components: {
    },
    computed: {
    },
    watch: {
    },
    created () {
      this.getDataList()
    },
    activated () {
      // this.getDataList()
    },
    methods: {
      init () {
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        // 加载图标
        this.dataListLoading = true
        // 数据
        this.dataList = null
        Dept.treeList().then(res => {
          this.dataListLoading = false
          console.log(res)
          if (res.data.code == 0) {
            this.dataList = treeDataTranslate(res.data.data, 'deptId')
          } else {
            this.dataList = []
          }
        }).catch(err => {
          this.dataListLoading = false
          console.log(err)
          this.$message({
            message: err || '读取接口失败！',
            type: 'error',
            duration: 1500
          })
        })
        // this.$http({
        //   url: this.$http.adornUrl('/sys/dept/treeList'),
        //   method: 'get'
        // }).then(({data}) => {
        //   if (data && data.code === 0) {
        //     this.dataList = treeDataTranslate(data.data, 'deptId')
        //   } else {
        //     this.dataList = []
        //   }
        //   this.dataListLoading = false
        // })
      },
      // getTopObj () {
      //   return {'deptId': 0, 'deptName': '全部', 'children': []}
      // },
      handleNodeClick (data) {
        this.$emit('school-sidebar-node-click-event', data.deptId, data.deptName)
      },
      currentChange (nodeData, nodeObj) {
        this.$emit('school-sidebar-node-change-event', nodeData.deptId, nodeData.deptName)
      },
      oncontextmenu (event, data, node) {
        this.currData = data
        this.$emit('node-contextmenu', event, data, node)
      },
      // 新增
      addHandle (data) {
        this.canClick = false
        this.$emit('node-addHandle',data)
      },
      updateHandle (data) {
        this.canClick = false
        this.$emit('node-updateHandle',data)
      },
      deleteHandle (data) {
        this.canClick = false
        this.$emit('node-deleteHandle',data)
      }
    }
  }
</script>

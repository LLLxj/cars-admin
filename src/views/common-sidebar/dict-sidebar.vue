<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span>字典管理</span>
    </div>
    <!-- <el-input v-model="filterText" style="padding:0px 0px 5px 0px "
              placeholder="输入关键字进行过滤"
              icon="ios-clock-outline">
      <el-dropdown transfer slot="prepend">
        <el-button type="primary">
          操作
          <i class="el-icon-arrow-down"></i>
        </el-button>
        <el-dropdown-menu slot="list">
          <el-dropdown-item name="saveDir">添加</el-dropdown-item>
          <el-dropdown-item name="updateDir">编辑</el-dropdown-item>
          <el-dropdown-item name="deleteDir">删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      
    </el-input> -->
    <el-input v-model="filterText" style="padding:0px 0px 5px 0px "
              placeholder="输入关键字进行过滤"
              icon="ios-clock-outline">
      <el-dropdown trigger="click" slot="prepend" @command="handleCommand">
        <span class="el-dropdown-link">
          操作<i class="el-icon-arrow-down"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="saveDir">添加</el-dropdown-item>
          <el-dropdown-item command="updateDir" :disabled="this.selectData.length === 0">编辑</el-dropdown-item>
          <el-dropdown-item command="deleteDir" :disabled="this.selectData.length === 0">删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button slot="append" icon="el-icon-close" @click.prevent="filterText=''"></el-button>
    </el-input>
    <!-- <el-tree :data="dataList" :props="defaultProps" v-loading="dataListLoading" @node-click="handleNodeClick" @current-change="currentChange" 
    @node-contextmenu="oncontextmenu"  default-expand-all @node-addHandle="addHandle" @node-updateHandle="updateHandle"
    @node-deleteHandle="deleteHandle" :expand-on-click-node="false"> -->
    <el-tree  ref="dataTree" :data="treeData" node-key="id" :props="defaultProps" v-loading="dataListLoading" @node-click="handleNodeClick" @current-change="currentChange"
       default-expand-all :expand-on-click-node="false" :filter-node-method="filterNode" style="height:70vh;overflow:auto">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ data.name }}{{ data.id > 0 ? '('+data.code+')' : '' }}</span>
      </span>
    </el-tree>  

    <editDict ref="editDict" v-if="editDictVisible" @refreshDataList="init"></editDict>
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
  import { dictTreeList, dictDelete } from '@/api/dict'
  import editDict from '@/views/modules/sys/dict-add-or-update'
  export default {
    data () {
      return {
        filterText: '',
        dataListLoading: false,
        dataList: null,
        defaultProps: {
          children: 'children',
          label: 'code'
        },
        handlePartVisible: false,
        editDictVisible: false,
        schoolId: '',
        // currData: [],
        event:[],
        node: [],
        canClick: true,
        treeData: [],
        selectData: []
      }
    },
    components: {
      editDict
    },
    computed: {
    },
    watch: {
      filterText (val) {
        this.$refs.dataTree.filter(val)
      }
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
        dictTreeList().then(res => {
          if (res.data && res.data.code === 0) {
            // this.dataList = treeDataTranslate(res.data.data, 'id')
            // console.log(this.dataList)
            let arr = []
            let obj = {}
            obj.id = '0'
            obj.name = '字典目录'
            obj.code = 'root'
            obj.children = res.data.data
            arr[0] = obj
            this.treeData = arr
          } else {
            this.dataList = []
          }
          this.dataListLoading = false
        })
      },
      // 过滤节点
      filterNode (value, data) {
        if (!value) return true
        // this.$emit('filterNode', value, data)
        return data.name.indexOf(value) !== -1 || data.code.indexOf(value) !== -1
      },
      // getTopObj () {
      //   return {'deptId': 0, 'deptName': '全部', 'children': []}
      // },
      handleNodeClick (data) {
        this.selectData = data
        this.$emit('dict-sidebar-node-click-event', data)
      },
      currentChange (nodeData, nodeObj) {
        this.$emit('dict-sidebar-node-change-event', nodeData)
      },
      // 字典目录信息操作界面
      handleCommand (command) {
        if (command === 'saveDir') {
          this.openSaveDir()
        } else if (command === 'updateDir') {
          this.openEditDir()
        } else if (command === 'deleteDir') {
          this.openDeleteDir()
        }
      },
      openSaveDir () {
        this.editDictVisible = true
        this.$nextTick(() => {
          this.$refs.editDict.init()
        })
      },
      openEditDir () {
        this.editDictVisible = true
        this.$nextTick(() => {
          this.$refs.editDict.init(this.selectData.id)
        })
      },
      openDeleteDir () {
        this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          dictDelete(this.selectData.id).then(res => {
            if (res.data && res.data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }).catch(() => {})
      }
    }
  }
</script>

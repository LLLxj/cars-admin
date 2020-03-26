<template>
  <el-card style="height: 750px">

    <!-- <div slot="header" class="clearfix">
      <span>部门管理</span>
    </div> -->
    <el-button type="primary" @click="addHandle()">新增</el-button>
    <el-table :data="dataList" border stripe v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;margin-top:10px;" id="dataListUser" >
      <el-table-column type="index" align="center" header-align="center" width="80" label="NO" fixed/>
      <el-table-column prop="deptName" header-align="center" align="center" label="部门名称">
      </el-table-column>
      <el-table-column prop="status" header-align="center" align="center" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small" type="danger">禁用</el-tag>
          <el-tag v-else size="small">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" min-width="180" label="创建时间">
      </el-table-column>
      <!-- <el-table-column prop="createUserName" header-align="center" align="center" width="180" label="创建人">
      </el-table-column> -->
      <el-table-column fixed="right" header-align="center"  align="center"  min-width="150"  label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-if="scope.row.status === 0" @click="norHandle(scope.row)">启用</el-button>
          <el-button type="text" size="small" v-if="scope.row.status === 1" @click="disHandle(scope.row)">禁用</el-button>
          <el-button v-if="isAuth('sys:dept:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.deptId)">编辑</el-button>
          <el-button v-if="isAuth('sys:dept:delete')" type="text" size="small" @click="deleteHandle(scope.row.deptId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle" background
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <!-- 新增 -->
    <partEdit v-if="partEditVisible" ref="partEdit" @refreshDataList="getDataList1"></partEdit>
    <!-- 编辑 -->
    <partUpdate v-if="partUpdateVisible" ref="partUpdate" @refreshDataList="getDataList1"></partUpdate>
  </el-card>   

  
         
</template>
<script>

  import Dept from '@/api/dept'
  // 新增部分
  import partEdit from './dept-add'
  // 编辑部门
  import partUpdate from './dept-update'
  
  export default {
    data () {
      return {
        dataForm: {
          deptId: ''
        },
        searchData: {
          deptId: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        downloadLoading: false,
        dataListLoading: false,
        dataListSelections: [],
        // 新增
        partEditVisible: false,
        // 编辑
        partUpdateVisible: false
      }
    },
    components: {
      partEdit, partUpdate
    },
    methods: {
      init (id) {
        this.searchData.deptId = id
        this.getDataList(this.searchData)
      },
      getDataList1 () {
        this.$emit('refresTreeList')
        this.getDataList(this.searchData)
      },
      // 获取数据列表
      getDataList (params) {
        this.dataListLoading = true
        this.params = this.searchData || null
        Dept.disList(params).then(res => {
          if (res.data && res.data.code === 0) {
            this.dataList = res.data.data.list
            this.totalPage = res.data.data.totalCount
            if(this.dataList !== null){
              this.isShow = false
            }
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
        
      },
      // 禁用
      disHandle (data) {
        // console.log('禁用操作')
        // console.log(data)
        Dept.disable(data.deptId).then(res => {
          if(res.data && res.data.code === 0){
            this.$message({
              message: res.data.msg,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          }else{
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          this.listLoading = false
          console.log(err)
          this.$message({
            message: err || '读取接口失败！',
            type: 'error',
            duration: 1500
          })
        })
        // disable
      },
      // 启用
      norHandle (data) {
        // console.log('启用操作')
        Dept.awake(data.deptId).then(res => {
          if(res.data && res.data.code === 0){
            this.$message({
              message: res.data.msg,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          }else{
            this.$message.error(res.data.msg)
          }
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
      // 编辑
      addOrUpdateHandle (id) {
        this.partUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.partUpdate.init(id)
        })
      },
      // 新增
      addHandle () {
        this.partEditVisible = true
        this.$nextTick(() => {
          this.$refs.partEdit.init()
        })
      },
      // 删除
      deleteHandle (id) {
        this.$confirm(`确定删除部门?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Dept.delete(id).then(({data}) => {
            if (data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList1()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>

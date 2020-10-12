<template>
  <div class="mod-role">
    <el-form :inline="true" :model="searchData" @keyup.enter.native="getDataList()">
      <el-form-item label="角色名称">
        <el-input v-model="searchData.roleName" placeholder="角色名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <SelectStatus v-model="searchData.status" placeholder="用户名" clearable></SelectStatus>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('sys:role:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="primary" @click="resetForm()">重置</el-button>
        <!-- <el-button v-if="isAuth('sys:role:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border stripe
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column prop="roleId" header-align="center" align="center" width="80" label="ID">
      </el-table-column>
      <el-table-column prop="roleName" header-align="center" align="center" label="角色名称">
      </el-table-column>
      <el-table-column prop="remake" header-align="center" align="center" label="备注">
      </el-table-column>
      <el-table-column prop="status" header-align="center" align="center" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small" type="info">禁用</el-tag>
          <el-tag v-else size="small">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" width="180" label="创建时间">
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:role:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.roleId)">修改</el-button>
          <el-button v-if="isAuth('sys:role:delete')" type="text" size="small" @click="deleteHandle(scope.row.roleId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex" background
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './role-add-or-update'
  import SelectStatus from '@/views/common-select/select-status'
  import Role from '@/api/role'
  export default {
    data () {
      return {
        searchData: {
          roleName: '',
          status: '',
          page: 1,
          limit: 10
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate,
      SelectStatus
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList (params) {
        this.dataListLoading = true
        this.searchData.page = this.pageIndex
        this.searchData.pageSize = this.pageSize
        params = this.searchData || null
        Role.list(params).then(({data}) => {
          if (data && data.code === 0) {
            this.dataListLoading = false
            this.dataList = data.data.list
            this.totalPage = data.data.totalCount
          } else {
            this.$message.error(data.msg)
          }
        }).catch(err => {
          this.dataListLoading = false
          console.log(err)
          this.$message({
            message: err,
            type: 'error',
            duration: 1500
          })
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
      resetForm() {
        this.searchData = {
          roleName: '',
          status: '',
          page: 1,
          limit: 10
        }
        this.getDataList()
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Role.delete(id).then(({data}) => {
            if(data.code === 0){
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            }else{
              this.$message.error(data.msg)
            }
          })
        }).catch((err) => {
          console.log(err)
        })
        // var ids = id ? [id] : this.dataListSelections.map(item => {
        //   return item.roleId
        // })
        // this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   this.$http({
        //     url: this.$http.adornUrl('/sys/role/delete'),
        //     method: 'post',
        //     data: this.$http.adornData(ids, false)
        //   }).then(({data}) => {
        //     if (data && data.code === 0) {
        //       this.$message({
        //         message: '操作成功',
        //         type: 'success',
        //         duration: 1500,
        //         onClose: () => {
        //           this.getDataList()
        //         }
        //       })
        //     } else {
        //       this.$message.error(data.msg)
        //     }
        //   })
        // }).catch(() => {})
      }
    }
  }
</script>

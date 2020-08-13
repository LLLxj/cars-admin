<template>
  <div class="mod-config">
    <!-- <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()"> -->
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="配置名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border stripe v-loading="dataListLoading" @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <!-- <el-table-column type="selection" header-align="center" align="center" width="50">
      </el-table-column> -->
      <el-table-column type="index" header-align="center" align="center" width="80" label="ID">
      </el-table-column>
      <!-- <el-table-column prop="configId" header-align="center" align="center" width="80" label="ID">
      </el-table-column> -->
      <el-table-column prop="name" header-align="center" align="center" label="配置名称">
      </el-table-column>
      <el-table-column prop="code" header-align="center" align="center" label="配置编码">
      </el-table-column>
      <el-table-column  prop="value" header-align="center" align="center" label="配置值">
      </el-table-column>
      <el-table-column prop="memo" header-align="center" align="center" label="配置显示值">
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.configId)">编辑</el-button>
          <el-button type="text" size="small" v-if="scope.row.status === 0" @click="norHandle(scope.row)">启用</el-button>
          <el-button type="text" size="small" v-if="scope.row.status === 1" @click="disHandle(scope.row)">禁用</el-button>
          <!-- <el-button type="text" size="small" @click="deleteHandle(scope.row.configId)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
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
  import AddOrUpdate from './config-add-or-update'
  import Config from '@/api/config'
  export default {
    data () {
      return {
        dataForm: {
          key: ''
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
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        // this.params = this.dataForm || null
        Config.list(this.dataForm).then(({data}) => {
          if (data.code === 0) {
            this.dataList = data.data.list
            this.totalPage = data.data.totalCount
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
      // 每页数
      sizeChangeHandle (val) {
        this.dataForm.limit = val
        this.dataForm.page = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.dataForm.page = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (code) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(code)
        })
      },
      norHandle(data) {
        Config.awake(data.configId).then(({data}) => {
          if (data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
      },
      disHandle(data) {
        Config.disable(data.configId).then(({data}) => {
          if (data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
      },
      
      // 删除
      deleteHandle (id) {
        // var ids = id ? [id] : this.dataListSelections.map(item => {
        //   return item.id
        // })
        // this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   this.$http({
        //     url: this.$http.adornUrl('/sys/config/delete'),
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
        this.$confirm(`确定删除配置?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Config.delete(id).then(({data}) => {
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

<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-button v-if="isAuth('sys:menu:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border stripe style="width: 100%;">
      <el-table-column prop="menuId" header-align="center" align="center" width="80" label="ID" fixed>
      </el-table-column>
      <!-- <table-tree-column prop="menuName" header-align="center" treeKey="menuId" width="150" label="名称">
      </table-tree-column> -->
      <el-table-column prop="name" header-align="center" align="center" width="120" label="菜单名称">
      </el-table-column>
      <el-table-column prop="parentName" header-align="center" align="center" width="120" label="上级菜单">
      </el-table-column>
      <el-table-column header-align="center" align="center"
        label="图标">
        <template slot-scope="scope">
          <icon-svg :name="scope.row.icon || ''"></icon-svg>
        </template>
      </el-table-column>
      <el-table-column prop="type" header-align="center" align="center" label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
          <el-tag v-else-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.type === 2" size="small" type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" header-align="center" align="center" label="排序号">
      </el-table-column>
      <el-table-column prop="url" header-align="center" align="center" width="150" :show-overflow-tooltip="true" label="菜单URL">
      </el-table-column>
      <el-table-column prop="perms" header-align="center" align="center" width="150" :show-overflow-tooltip="true" label="授权标识">
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:menu:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.menuId)">修改</el-button>
          <el-button v-if="isAuth('sys:menu:delete')" type="text" size="small" @click="deleteHandle(scope.row.menuId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="x-pagination">
        <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum">
        </el-pagination>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import TableTreeColumn from '@/components/table-tree-column'
  import AddOrUpdate from './menu-add-or-update'
  import { treeDataTranslate } from '@/utils'
  import Menu from '@/api/menu'
  export default {
    data () {
      return {
        dataForm: {},
        dataList: [],
        dataListLoading: false,
        addOrUpdateVisible: false,
        //  分页参数
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        currentPage: 1,
        totalNum: 100,
        searchData: {
        },
      }
    },
    components: {
      TableTreeColumn,
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList(param) {
        this.listLoading = true
        this.params = this.searchData || null
        Menu.pageList(param).then(res => {
          if (res.data.code === 0) {
            // 处理数据
            this.listLoading = false
            this.dataList = res.data.data.list
            this.totalNum = res.data.data.totalCount
          } else {
            this.listLoading = false
            this.$message({
              message: res.data.msg,
              type: 'error',
              duration: 1500
            })
          }
        }).catch(err => {
          this.listLoading = false
          console.log(err)
          this.$message({
            message: '读取接口失败！',
            type: 'error',
            duration: 1500
          })
        })
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
          Menu.delete(id).then(({data}) => {
            if(data.code == 0){
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
        }).catch(() => {})
        // this.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   this.$http({
        //     url: this.$http.adornUrl(`/sys/menu/delete/${id}`),
        //     method: 'post',
        //     data: this.$http.adornData()
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
      },
        // 搜索
      search() {
        this.searchData.page = 1
        this.getDataList(this.searchData)
      },
      // 置空搜索
      resetSearch() {
        this.searchData = {
          // title: '',
          // content: ''
        }
        this.getDataList(this.searchData)
      },
      // 分页事件
      handleSizeChange(row) {
      // 每页显示数改变
        this.searchData.limit = row
        this.getDataList(this.searchData)
      },
      handleCurrentChange(row) {
        // 当前页改变
        this.searchData.page = row
        this.getDataList(this.searchData)
      },
    }
  }
</script>

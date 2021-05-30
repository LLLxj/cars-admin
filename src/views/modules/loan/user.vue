<template>
  <div class="mod-user">
    <!--布局容器-->
    <el-container>
      <!--右侧-->
      <el-main>
        <!-- <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" @submit.native.prevent> -->
        <el-form :inline="true" :model="dataForm">
          <!-- <el-form-item label="客户手机号">
            <el-input v-model="dataForm.dealPhone" placeholder="请输入手机号" clearable></el-input>
          </el-form-item> -->
          <el-form-item label="选择员工">
            <BusinessSelect v-model="dataForm.sysUserId" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="dataForm.status" placeholder="请选择" clearable>
              <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getDataList1()">查询</el-button>
            <el-button v-if="isAuth('loan:user:save')" type="primary" @click="addHandle()">新增</el-button>
            <el-button v-if="isAuth('loan:user:restore')" @click="fixUpdateHandle()">定时恢复</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="dataList" border stripe v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;" id="dataListUser">
          <el-table-column type="index" align="center" header-align="center" width="80" label="NO" fixed/>
          <el-table-column prop="sysUserName" header-align="center" align="center" label="员工名称" min-width="140px" />
          <el-table-column prop="usageCount" header-align="center" align="center" label="剩余条数" />
          <el-table-column prop="unUsageCount" header-align="center" align="center" label="初始化查询总条数" />
          <el-table-column prop="remark" header-align="center" align="center" label="备注">
            <template slot-scope="scope">
              <el-tag type="info" v-if="scope.row.status === 0">禁用</el-tag>
              <el-tag v-else>正常</el-tag>
            </template>
					</el-table-column>
					
          <el-table-column fixed="right" header-align="center" align="center" width="230" label="操作">
            <template slot-scope="scope">
              <el-button v-if="isAuth('loan:user:normal') && scope.row.status === 0" type="text" size="small" @click="normalHandle(scope.row.loanUserId)">启用</el-button>
              <el-button v-if="isAuth('loan:user:disable') &&  scope.row.status === 1" type="text" size="small" @click="disableHandle(scope.row.loanUserId)">禁用</el-button>
              <el-button v-if="isAuth('loan:user:restore')" type="text" size="small" @click="addHandle(scope.row.loanUserId)">恢复查询</el-button>
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
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" />
				<!-- <recordList v-if="recordListVisible" ref="recordList"></recordList> -->
        <!-- 弹窗, 上传文件 -->
        <!-- <uploadPop v-if="uploadPopVisible" ref="uploadPop" @refreshDataList="getDataList"></uploadPop> -->
      </el-main>
    </el-container>
  </div>
</template>
<script>
  import Business from '@/api/product/business'
  import TypeSelect from '@/views/common-select/customer-type-select'
	import AddOrUpdate from './user-add'
	// import recordList from './finance-record'
  import uploadPop from '@/views/common-pop/upload-user-pop'
  import ElContainer from 'element-ui/packages/container/index'
  import ElAside from 'element-ui/packages/aside/index'
  import ElMain from 'element-ui/packages/main/index'
  import BusinessSelect from '@/views/common-select/all-business-select'
  import Vue from 'vue'
  export default {
    data () {
      return {
        dataForm: {
          sysUserId: '',
          page: 1,
          limit: 10
        },
        statusList: [
          { label: '禁用', value: 0 },
          { label: '正常', value: 1 }
        ],
        dataList: [],
        isShow: true,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        downloadLoading: false,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
				uploadPopVisible: false,
				recordListVisible: false,
        searchData: {
        },
      }
    },
    components: {
      AddOrUpdate,
      TypeSelect,
      ElContainer,
      ElAside,
      ElMain,
			uploadPop,
      BusinessSelect
			// recordList
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList1() {
        this.pageIndex = 1
        this.dataForm.page = 1
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        Business.list(this.dataForm).then(res => {
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
      schoolTreeChangeEvent (deptId) {
        this.dataForm.deptId = deptId
        this.getDataList()
      },
      addHandle (data) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(data)
        })
      },
      normalHandle (data) { // 处理中
        Business.normal(data).then(res => {
          if(res.data && res.data.code === 0){
            this.$message({
              message: '操作成功',
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
      disableHandle (data) { // 完成
        Business.disable(data).then(res => {
          if(res.data && res.data.code === 0){
            this.$message({
              message: '操作成功',
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
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.dataForm.limit = val
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.dataForm.page = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        console.log(id)
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
			},
      fixUpdateHandle () {
        Business.fixUpdate().then(res => {
          console.log(res)
          const { code, msg } = res.data
          if (code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(msg)
          }
        })
      },
			getRecord (id) {
        this.recordListVisible = true
        this.$nextTick(() => {
          this.$refs.recordList.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        // var userIds = id ? [id] : this.dataListSelections.map(item => {
        //   return item.userId
        // })
        this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Customer.delete(id).then(({data}) => {
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
        }).catch(() => {})
      },
    }
  }
</script>

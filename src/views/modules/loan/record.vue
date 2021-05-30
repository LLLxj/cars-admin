<template>
  <div class="mod-user">
    <!--布局容器-->
    <el-container>
      <!--右侧-->
      <el-main>
        <!-- <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" @submit.native.prevent> -->
        <el-form :inline="true" :model="searchData">
          <!-- <el-form-item label="客户手机号">
            <el-input v-model="dataForm.dealPhone" placeholder="请输入手机号" clearable></el-input>
          </el-form-item> -->
          <el-form-item label="风险名称" prop="recordName">
            <el-input v-model="searchData.recordName" placeholder="请输入风险名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchData.status" placeholder="请选择" clearable>
              <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getDataList1()">查询</el-button>
            <el-button v-if="isAuth('loan:record:save')" type="primary" @click="addHandle()">新增</el-button>
            <el-button @click="resetFrom()">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="dataList" border stripe v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;" id="dataListUser">
          <el-table-column type="index" align="center" header-align="center" width="80" label="NO" fixed/>
          <el-table-column prop="recordName" header-align="center" align="center" label="记录名称" min-width="140px" />
          <el-table-column header-align="center" align="center" label="状态" min-width="140px"> 
            <template slot-scope="scope">
              <el-tag type="info" v-if="scope.row.status === 0">禁用</el-tag>
              <el-tag v-else>正常</el-tag>
            </template>
					</el-table-column>
          <el-table-column fixed="right" header-align="center" align="center" width="230" label="操作">
            <template slot-scope="scope">
              <el-button v-if="isAuth('loan:record:normal') && scope.row.status === 0" type="text" size="small" @click="normalHandle(scope.row.recordId)">启用</el-button>
              <el-button v-if="isAuth('loan:record:disable') &&  scope.row.status === 1" type="text" size="small" @click="disableHandle(scope.row.recordId)">禁用</el-button>
              <el-button v-if="isAuth('loan:record:update')" type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
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
        <!-- <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update> -->
				<!-- <recordList v-if="recordListVisible" ref="recordList"></recordList> -->
        <!-- 弹窗, 上传文件 -->
        <!-- <uploadPop v-if="uploadPopVisible" ref="uploadPop" @refreshDataList="getDataList"></uploadPop> -->
      </el-main>
    </el-container>
    <el-dialog
      :title="!id ? '新增' : '编辑'"
      :close-on-click-modal="false"
      :visible.sync="visible" @close="cancle"
      width="500px">
      <el-form :model="dataForm" ref="dataForm" label-width="120px">
        <el-form-item label="风险记录名称" prop="recordName">
          <el-input v-model="dataForm.recordName" placeholder="请输入风险记录名称" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancle()">取消</el-button>
        <el-button :disabled="!dataForm.recordName ? true : false" type="primary" @click="dataFormSubmit()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import Record from '@/api/product/record'
  import TypeSelect from '@/views/common-select/customer-type-select'
	import AddOrUpdate from '@/views/modules/customer/user-finance'
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
        searchData: {
          recordName: '',
          page: 1,
          limit: 10,
          status: ''
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
        id: '',
        visible: false,
        dataForm: {
          recordId: '',
          recordName: ''
        },
      }
    },
    components: {
      // AddOrUpdate,
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
        Record.list(this.searchData).then(res => {
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
      addHandle () {
        this.visible = true
      },
      cancle () {
        this.visible = false
        this.dataForm = {
          recordId: '',
          recordName: ''
        }
      },
      editHandle (data) {
        this.visible = true
        this.id = data.recordId
        this.dataForm = {
          ...data
        }
      },
      normalHandle (data) { // 处理中
        Record.normal(data).then(res => {
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
        Record.disable(data).then(res => {
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
      resetFrom () {
        this.searchData = {
          recordName: '',
          page: 1,
          limit: 10,
          status: ''
        }
        this.getDataList()
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
			getRecord (id) {
        this.recordListVisible = true
        this.$nextTick(() => {
          this.$refs.recordList.init(id)
        })
      },
      dataFormSubmit () {
        Record[this.id ? 'update' : 'save'](this.dataForm).then(({data})=> {
          if (data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.cancle()
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
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

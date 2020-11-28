<template>
  <div class="mod-user">
    <!--布局容器-->
    <el-container>
      <!--右侧-->
      <el-main>
        <!-- <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" @submit.native.prevent> -->
        <el-form :inline="true" :model="dataForm">
          <!-- <el-form-item label="请输入用户名">
            <el-input v-model="dataForm.dealUserName" placeholder="请输入用户名" clearable></el-input>
          </el-form-item> -->
          <el-form-item label="请输入客户手机">
            <el-input v-model="dataForm.dealUserPhone" placeholder="请输入客户手机" clearable></el-input>
          </el-form-item>
          <el-form-item label="客户">
            <!-- <CustomerSelect v-model="dataForm.dealUser" @get-val="getCustomerVal"></CustomerSelect> -->
            <CustomerSelect v-model="dataForm.dealUserId"></CustomerSelect>
          </el-form-item>
          <el-form-item label="审核状态">
            <el-select v-model="dataForm.examine" placeholder="请选择">
              <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="提交日期" prop="rangeTime">
            <el-date-picker v-model="dataForm.rangeTime" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
              value-format="yyyy-MM-dd 00:00:00"
              :clearable="true"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList1()">查询</el-button>
            <!-- <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button> -->
            <el-button @click="resetFrom()" type="primary">重置</el-button>
            <!-- <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
            <el-button type="info" :disabled="isShow" :loading="downloadLoading" @click="exportHandle()">导出</el-button>
            <el-button type="danger" :loading="downloadLoading" @click="downFile()">下载模板</el-button>
            <el-button type="primary" :loading="downloadLoading" @click="uploadHandle()">上传文件</el-button> -->
            
          </el-form-item>
        </el-form>
        <el-table :data="dataList" border stripe v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;" id="dataListUser">
          <el-table-column type="index" align="center" header-align="center" width="80" label="NO" fixed/>
          <el-table-column prop="dealStoreName" header-align="center" align="center" label="客户企业名称" />
          <el-table-column prop="dealUserJob" header-align="center" align="center" label="客户职位" >
            <template slot-scope="scope">
              <span>{{scope.row.dealUserJob || '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="sysUserName" header-align="center" align="center" label="所属用户名称">
            <template slot-scope="scope">
              <span>{{scope.row.sysUserName || '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="examine" header-align="center" align="center" label="审核状态">
            <template slot-scope="scope">
              <span v-if="scope.row.examine === 0">失败</span>
              <span v-if="scope.row.examine === 1">审核中</span>
              <span v-if="scope.row.examine === 2">通过</span>
              <span v-if="scope.row.examine === 3">作废</span>
            </template>
          </el-table-column>
          <el-table-column prop="examineTime" header-align="center" align="center" label="审核时间">
            <template slot-scope="scope">
              <span>{{scope.row.examineTime || '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" header-align="center"  align="center"  width="200"  label="操作">
            <template slot-scope="scope">
              <el-button type="text" v-if="scope.row.examine === 1 && isAuth('deal:user:store:fail')" size="small" @click="failHandle(scope.row.dealStoreId)">驳回</el-button> 
              <el-button type="text" v-if="scope.row.examine === 1 && isAuth('deal:user:store:success')" size="small" @click="successHandle(scope.row.dealStoreId)">通过</el-button>
              <el-button type="text" v-if="(scope.row.examine === 1 || scope.row.examine === 2) && isAuth('deal:user:store:waste')" size="small" @click="disHandle(scope.row.dealStoreId)">作废</el-button>
              <el-button type="text" v-if="scope.row.examine === 1 || scope.row.examine === 0 && isAuth('deal:user:store:update')" size="small" @click="addOrUpdateHandle(scope.row.dealUserId, scope.row.dealStoreId, 2)">编辑</el-button>
              <!-- <el-button type="text" size="small" @click="deleteHandle(scope.row.userId)">删除</el-button> -->
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
        <!-- 弹窗, 上传文件 -->
        <!-- <uploadPop v-if="uploadPopVisible" ref="uploadPop" @refreshDataList="getDataList"></uploadPop> -->
        <el-dialog
          title="分配业务员"
          :close-on-click-modal="false"
          :visible.sync="visible">
          <el-form :model="form" ref="form" label-width="120px">
            <el-form-item label="选择业务员" prop="sysUserId">
              <BusinessSelect v-model="form.sysUserId"></BusinessSelect>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取消</el-button>
            <el-button :disabled="!form.sysUserId" type="primary" @click="dataFormSubmit()">确定</el-button>
          </span>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>
<script>

  import ComApply from '@/api/customer/com-apply'
  import CustomerSelect from '@/views/common-select/customer/all-customer'
  import AddOrUpdate from './user-com-auth'
  import uploadPop from '@/views/common-pop/upload-user-pop'
  import ElContainer from 'element-ui/packages/container/index'
  import ElAside from 'element-ui/packages/aside/index'
  import ElMain from 'element-ui/packages/main/index'
  import BusinessSelect from '@/views/common-select/business-select'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  import Vue from 'vue'
  export default {
    data () {
      return {
        dataForm: {
          dealUserPhone: '',
          dealUserId: '',
          examine: '',
          startTime: '',
          endTime: '',
          rangeTime: []
        },
        form: {
          sysUserId: ''
        },
        statusList: [
          // <span v-if="scope.row.examine === 0">失败</span>
          //     <span v-if="scope.row.examine === 1">审核中</span>
          //     <span v-if="scope.row.examine === 2">通过</span>
          //     <span v-if="scope.row.examine === 3">作废</span>
          { label: '失败', value: '0' },
          { label: '审核中', value: 1 },
          { label: '通过', value: 2 },
          { label: '作废', value: 3 }
        ],
        id: '',
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
        searchData: {
        },
        visible: false
      }
    },
    components: {
      AddOrUpdate,
      CustomerSelect,
      ElContainer,
      ElAside,
      ElMain,
      uploadPop,
      BusinessSelect
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
      getDataList (params) {
        this.dataListLoading = true
        params = {
          startTime: this.dataForm.rangeTime ? this.dataForm.rangeTime[0] : '',
          endTime: this.dataForm.rangeTime ? this.dataForm.rangeTime[1] : '',
          dealUserId: this.dataForm.dealUserId ? this.dataForm.dealUserId : '',
          dealUserPhone: this.dataForm.dealUserPhone ? this.dataForm.dealUserPhone : '',
          examine: this.dataForm.examine ? this.dataForm.examine : '',
          page: this.dataForm.page,
          limit: this.dataForm.limit
        }
        ComApply.list(params).then(res => {
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
       getCustomerVal(val) { // 选择客户回调
        this.dataForm.dealUserId = val.dealUserId
      },
      schoolTreeChangeEvent (deptId) {
        this.dataForm.deptId = deptId
        this.getDataList()
      },
      failHandle (data) { // 失败
        ComApply.fail(data).then(res => {
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
      successHandle (data) { // 成功
        this.visible = true
        this.id = data
      },
      disHandle (data) { // 作废
        ComApply.waste(data).then(res => {
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
        })
      },
      dataFormSubmit() {
        const obj = { 
          belongUserId: this.form.sysUserId,
          storeId: this.id
        }
        ComApply.success(obj).then(res => {
          if(res.data && res.data.code === 0){
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
                this.visible = false
                this.id = ''
                this.form.sysUserId = ''
              }
            })
          }else{
            this.$message.error(res.data.msg)
          }
        })
      },
      resetFrom () {
        this.dataForm = {
          dealUserPhone: '',
          dealUserId: '',
          examine: '',
          startTime: '',
          endTime: '',
          rangeTime: []
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
      addOrUpdateHandle (id, id1, id2) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, id1, id2)
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

<template>
  <div class="mod-user">
    <!--布局容器-->
    <el-container>
      <!--右侧-->
      <el-main>
        <!-- <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" @submit.native.prevent> -->
        <el-form :inline="true" :model="dataForm">
          <el-form-item label="咨询人名称">
            <el-input v-model="dataForm.contactName" placeholder="咨询人名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="商品标题">
            <el-input v-model="dataForm.dealWaresTitle" placeholder="请输入商品标题" clearable></el-input>
          </el-form-item>
          <el-form-item label="所属客户名称">
            <el-input v-model="dataForm.dealUserName" placeholder="请输入客户名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="所属客户手机">
            <el-input v-model="dataForm.dealUserPhone" placeholder="请输入客户手机" clearable></el-input>
          </el-form-item>
          <el-form-item label="所属企业名称">
            <el-input v-model="dataForm.dealStoreName" placeholder="请输入企业名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="跟进状态">
            <followStatusSelect v-model="dataForm.followStatus"></followStatusSelect>
          </el-form-item>
          <el-form-item label="创建日期" prop="dateTime">
            <el-date-picker v-model="dataForm.dateTime" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
              value-format="yyyy-MM-dd 00:00:00"
              :clearable="true"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList1()">查询</el-button>
            <el-button v-if="isAuth('deal:wares:installment:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
            <el-button @click="resetFrom()">重置</el-button>
            <!-- <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
            <el-button type="info" :disabled="isShow" :loading="downloadLoading" @click="exportHandle()">导出</el-button>
            <el-button type="danger" :loading="downloadLoading" @click="downFile()">下载模板</el-button>
            <el-button type="primary" :loading="downloadLoading" @click="uploadHandle()">上传文件</el-button> -->
            
          </el-form-item>
        </el-form>
        <el-table :data="dataList" border stripe v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;" id="dataListUser">
          <el-table-column type="index" align="center" header-align="center" width="80" label="NO" fixed/>
          <el-table-column prop="contactName" header-align="center" align="center" label="咨询人名称" />
          <el-table-column prop="submitTime" header-align="center" align="center" label="咨询时间" />
          <el-table-column prop="dealWaresTitle" header-align="center" align="center" label="资讯商品标题" />
          <el-table-column prop="dealStoreName" header-align="center" align="center" label="所属企业名称" />
          <el-table-column prop="dealUserName" header-align="center" align="center" label="所属客户名称" />
          <el-table-column prop="dealUserPhone" header-align="center" align="center" label="所属客户手机" />
          <el-table-column prop="followStatus" header-align="center" align="center" label="跟进状态">
            <template slot-scope="scope">
              <span v-if="scope.row.followStatus === 0">作废</span>
              <span v-if="scope.row.followStatus === 1">待处理</span>
              <span v-if="scope.row.followStatus === 2">已处理</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="contactPhone" header-align="center" align="center" label="联系电话">
          </el-table-column> -->
          <!-- <el-table-column prop="sex" header-align="center" align="center" label="性别" width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.sex === 0">先生</span>
              <span v-if="scope.row.sex === 1">小姐</span>
            </template>
          </el-table-column> -->
          <el-table-column prop="sysUserName" header-align="center" align="center" label="跟进人">
            <template slot-scope="scope">
              <span>{{scope.row.sysUserName || '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="followRemark" header-align="center" align="center" label="处理意见">
            <template slot-scope="scope">
              <span>{{scope.row.followRemark || '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="followTime" header-align="center" align="center" label="跟进时间" width="150">
            <template slot-scope="scope">
              <span>{{scope.row.followTime || '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" header-align="center"  align="center"  width="150"  label="操作">
            <template slot-scope="scope">
              <el-button v-if="isAuth('deal:wares:installment:waste') && scope.row.followStatus === 1" type="text" size="small" @click="checkOrder(scope.row, 1)">作废</el-button> 
              <el-button v-if="isAuth('deal:wares:installment:processing') && scope.row.followStatus === 1" type="text" size="small" @click="checkOrder(scope.row, 3)">处理中</el-button>
              <el-button v-if="isAuth('deal:wares:installment:success') && scope.row.followStatus === 2" type="text" size="small" @click="successHandle(scope.row, 2)">已处理</el-button>
              <!-- <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.installmentId)">查看</el-button> -->
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
        <CheckOrder v-if="checkOrderVisible" ref="checkOrder" @refreshDataList="getDataList"></CheckOrder>
        <FollowList v-if="followListVisible" ref="followList" @refreshDataList="getDataList"/>
        <!-- 弹窗, 上传文件 -->
        <!-- <uploadPop v-if="uploadPopVisible" ref="uploadPop" @refreshDataList="getDataList"></uploadPop> -->
      </el-main>
    </el-container>
  </div>
</template>
<script>

  import Fenqi from '@/api/customer/fenqi'
  import TypeSelect from '@/views/common-select/customer-type-select'
  import followStatusSelect from '@/views/common-select/follow-status-select'
  import AddOrUpdate from './fenqi-add'
  import CheckOrder from './fenqi-check'
  import FollowList from './fenqi-follow'
  import uploadPop from '@/views/common-pop/upload-user-pop'
  import ElContainer from 'element-ui/packages/container/index'
  import ElAside from 'element-ui/packages/aside/index'
  import ElMain from 'element-ui/packages/main/index'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  import Vue from 'vue'
  export default {
    data () {
      return {
        dataForm: {
          contactName: '',
          dealWaresTitle: '',
          dealUserName: '',
          dealUserPhone: '',
          dealStoreName: '',
          followStatus: '',
          dateTime: '',
          startTime: '',
          endTime: ''
        },
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
        checkOrderVisible: false,
        followListVisible: false,
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
      followStatusSelect,
      CheckOrder,
      FollowList
    },
    activated () {
      this.getDataList()
    },
    methods: {
      getDataList1() {
        this.pageIndex = 1
        this.dataForm.page = 1
        this.getDataList()
      },
      // 获取数据列表
      getDataList (params) {
        this.dataForm.startTime = this.dataForm.dateTime[0]
        this.dataForm.endTime = this.dataForm.dateTime[1]
        let dataForm = {
          contactName: this.dataForm.contactName,
          dealWaresTitle: this.dataForm.dealWaresTitle,
          dealUserName: this.dataForm.dealUserName,
          dealUserPhone: this.dataForm.dealUserPhone,
          dealStoreName: this.dataForm.dealStoreName,
          followStatus: this.dataForm.followStatus,
          // dealUserName: this.dataForm.dealUserName,
          // contactPhone: this.dataForm.contactPhone,
          // contactName: this.dataForm.contactName,
          // dealWaresTitle: this.dataForm.dealWaresTitle,
          // contactName: this.dataForm.contactName,
          startTime: this.dataForm.dateTime[0],
          endTime: this.dataForm.dateTime[1],
          page: this.dataForm.page,
          limit: this.dataForm.limit
        }
        this.dataListLoading = true
        params = dataForm || null
        Fenqi.list(params).then(res => {
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
      // 作废
      disHandle (data) {
        Fenqi.waste(data).then(res => {
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
      // 已跟进
      norHandle (data) {
        Fenqi.success(data).then(res => {
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
      successHandle (item) {
        Fenqi.success(item.installmentId).then(res => {
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
      },
      resetFrom () {
        this.dataForm = {
          contactName: '',
          dealWaresTitle: '',
          dealUserName: '',
          dealUserPhone: '',
          dealStoreName: '',
          followStatus: '',
          dateTime: '',
          startTime: '',
          endTime: '',
          page: 1,
          limit: 10
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
      // 下载模板
      downFile () {
         window.open(this.$http.adornUrl('/sys/user/down?token=' + Vue.cookie.get('token')), '_blank')
      },
       // 上传操作
      uploadHandle () {
        this.uploadPopVisible = true
        this.$nextTick(() => {
          this.$refs.uploadPop.init()
        })
      },
      checkOrder (item, index) {
        if (index === 3) {
          this.followListVisible = true
          this.$nextTick(() => {
            this.$refs.followList.init(item, index)
          })
        } else {
          this.checkOrderVisible = true
          this.$nextTick(() => {
            this.$refs.checkOrder.init(item, index)
          })
        }
        
      },
      // 导出操作
      exportHandle () {
        var fix = document.querySelector('.el-table__fixed');
        var wb;
        if (fix) {
          wb = XLSX.utils.table_to_book(document.querySelector('#dataListUser').removeChild(fix));
          document.querySelector('#dataListUser').appendChild(fix);
        } else {
          wb = XLSX.utils.table_to_book(document.querySelector('#dataListUser'));
        }
        /* get binary string as output */
        var wbout = XLSX.write(wb, {
          bookType: 'xlsx',
          bookSST: true,
          type: 'array'
        });
        try {
          FileSaver.saveAs(
            new Blob([wbout], {
              type: 'application/octet-stream'
            }),
            '管理员列表.xlsx'
          );
        } catch (e) {
          if (typeof console !== 'undefined') console.log(e, wbout);
        }
        return wbout;
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        console.log(id)
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
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

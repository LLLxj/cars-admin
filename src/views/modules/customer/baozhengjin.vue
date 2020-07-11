<template>
  <div class="mod-user">
    <!--布局容器-->
    <el-container>
      <!--右侧-->
      <el-main>
        <!-- <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" @submit.native.prevent> -->
        <el-form :inline="true" :model="dataForm">
          <el-form-item label="请输入客户手机号">
            <el-input v-model="dataForm.dealPhone" placeholder="请输入手机号" clearable></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <TypeSelect v-model="dataForm.status"></TypeSelect>
          </el-form-item>
          <el-form-item label="创建日期" prop="rangeTime">
            <el-date-picker v-model="dataForm.rangeTime" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
              value-format="yyyy-MM-dd 00:00:00"
              :clearable="true"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList()">查询</el-button>
            <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
            <el-button @click="resetFrom()">重置</el-button>
            
          </el-form-item>
        </el-form>
        <el-table :data="dataList" border stripe v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;" id="dataListUser">
          <el-table-column type="index" align="center" header-align="center" width="80" label="NO" fixed/>
          <el-table-column prop="depositNo" header-align="center" align="center" label="保证金单编号">
          </el-table-column>
					<el-table-column prop="dealUserName" header-align="center" align="center" label="客户名称" />
					<el-table-column prop="depositPrice" header-align="center" align="center" label="保证金金额" />
					<el-table-column prop="remark" header-align="center" align="center" label="备注">
						<template slot-scope="scope">
              <span>{{scope.row.remark || '--'}}</span>
            </template>
					</el-table-column>
					<el-table-column prop="status" header-align="center" align="center" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0">放弃</span>
              <span v-if="scope.row.status === 1">驳回</span>
              <span v-if="scope.row.status === 2">财务审核中</span>
              <span v-if="scope.row.status === 3">经理审核中</span>
              <span v-if="scope.row.status === 4">通过</span>
            </template>
          </el-table-column>
					<el-table-column prop="submitTime" header-align="center" align="center" label="提交时间">
						<template slot-scope="scope">
              <span>{{scope.row.submitTime || '--'}}</span>
            </template>
					</el-table-column>
					<el-table-column prop="examineUserName" header-align="center" align="center" label="审核人名称">
						<template slot-scope="scope">
              <span>{{scope.row.examineUserName || '--'}}</span>
            </template>
					</el-table-column>
					<el-table-column prop="examineTime" header-align="center" align="center" label="审核时间">
						<template slot-scope="scope">
              <span>{{scope.row.examineTime || '--'}}</span>
            </template>
					</el-table-column>
          <el-table-column fixed="right" header-align="center"  align="center"  width="150"  label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" v-if="scope.row.status === 1" @click="disHandle(scope.row)">禁用</el-button> 
              <el-button type="text" size="small" v-if="scope.row.status === 0" @click="norHandle(scope.row)">启用</el-button>
              <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.dealUserId)">编辑</el-button>
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
      </el-main>
    </el-container>
  </div>
</template>
<script>

  import Baozhengjin from '@/api/customer/baozhengjin'
  import TypeSelect from '@/views/common-select/customer-type-select'
  import AddOrUpdate from './user-add'
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
          userName: '',
          phone: '',
          type: ''
        },
        // 审核状态 0.放弃 1.驳回 2.财务审核中 3.经理审核中 4.通过
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
      }
    },
    components: {
      AddOrUpdate,
      TypeSelect,
      ElContainer,
      ElAside,
      ElMain,
      uploadPop
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList (params) {
        this.dataListLoading = true
        params = this.dataForm || null
        Baozhengjin.list(params).then(res => {
          if (res.data && res.data.code === 0) {
            this.dataList = res.data.list
            this.totalPage = res.data.totalCount
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
      // 禁用
      disHandle (data) {
        Baozhengjin.disable(data.userId).then(res => {
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
      // 启用
      norHandle (data) {
        Baozhengjin.awake(data.userId).then(res => {
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
      resetFrom () {
        this.dataForm = {
          userName: '',
          phone: '',
          type: ''
        }
        this.getDataList()
      },
      // 每页数
      sizeChangeHandle (val) {
        this.dataForm.page = val
        this.dataForm.limit = 1
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

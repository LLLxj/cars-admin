<template>
  <div class="mod-user">
    <!-- 布局容器 -->
    <el-container>

      <!-- 左侧 -->
      <el-aside width="320px">
        <schoolAllSidebar ref="schoolAllSidebar" @school-sidebar-node-change-event="schoolTreeChangeEvent" />
      </el-aside>

      <!-- 右侧 -->
      <el-main>
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item label="手机" prop="stuPhone">
            <el-input v-model="dataForm.stuPhone" placeholder="请输入手机号码" clearable></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="stuName">
            <el-input v-model="dataForm.stuName" placeholder="请输入学员名字" clearable></el-input>
          </el-form-item>
          <el-form-item label="报名表号" prop="regNo">
            <el-input v-model="dataForm.regNo" placeholder="请输入报名表号" clearable></el-input>
          </el-form-item>
          <el-form-item label="单据状态" prop="regStatus">
              <el-select v-model="dataForm.stopStatus" placeholder="全部">
                <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
              </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList()">查询</el-button>
            <el-button @click="resetSearch()">重置</el-button>
            <el-button v-if="isAuth('stu:stop:save')" type="primary" @click="info()">新增</el-button>
            <el-button  type="info" :loading="downloadLoading" @click="exportHandle()">导出</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="dataList" border stripe v-loading="dataListLoading" style="width: 100%;" :row-class-name="tableRowClassName" id="dataListStop">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form label-position="left" class="demo-table-expand">
                <el-form-item label="最近用户Id" ><span>{{ scope.row.updateUserId }}</span></el-form-item>
                <el-form-item label="最近更新时间"><span>{{ scope.row.updateTime }}</span></el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column type="index" align="center" header-align="center" width="48" label="NO" fixed/>
          <el-table-column prop="stopCode" header-align="center" align="center"  width="140" label="单号" fixed/>
          <el-table-column prop="stuName" header-align="center" align="center"  label="学员"/>
          <el-table-column prop="regNo" header-align="center" align="center" label="报名表号"/>
          <el-table-column prop="classTypeName" header-align="center" align="center" label="报读班型"/>
          <el-table-column prop="stopStatus" header-align="center" align="center" label="状态" width="80">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.stopStatus === 1" size="small" type="danger">待审核</el-tag>
                <el-tag v-if="scope.row.stopStatus === 2" size="small" type="success">通过</el-tag>
                <el-tag v-if="scope.row.stopStatus === 0" size="small" type="info">作废</el-tag>
              </template>
          </el-table-column>
          <el-table-column prop="stopStartDate" header-align="center" align="center" label="休学日期" :formatter="stopStartDateFormatter"/>
          <el-table-column prop="endStartDate" header-align="center" align="center" label="预计复课日期" :formatter="endStartDateFormatter"/>
          <el-table-column prop="stopBackDate" header-align="center" align="center" label="实际复课日期" :formatter="stopBackDateFormatter"/>
          <el-table-column prop="remark" header-align="center" align="center" label="休学原因"/>
          <el-table-column fixed="right" header-align="center" align="center" label="操作">
            <template slot-scope="scope">
              <el-button v-if="scope.row.stopStatus === 1" type="text" size="small" @click="changeStatus(scope.row.stopId)">通过</el-button>
              <el-button v-if="scope.row.stopStatus === 1" type="text" size="small" @click="stopHandle(scope.row.stopId)">作废</el-button>
              <el-button v-if="scope.row.stopStatus === 2" type="text" size="small" @click="changeUnstatus(scope.row.stopId)">反审核</el-button>
              <el-button v-if="scope.row.stopStatus === 2 && scope.row.stopBackDate == null" type="text" size="small" @click="resumeClasses(scope.row.stopId)">复课</el-button>
              <el-button v-if="scope.row.stopStatus === 0" type="text" size="small"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" background :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
          :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <Add v-if="addVisible" ref="Add" @refreshDataList="getDataList"></Add>
      </el-main>
    </el-container>
    <!-- 复课时间表弹窗 -->
    <resumeClasses v-if="resumeClassesAddVisible" ref="resumeClasses" @refreshDataList="getDataList"></resumeClasses>
    <stopAdd v-if="stopAddVisible" ref="stopAdd" @refreshDataList="getDataList"></stopAdd>
  </div>

</template>

<script>
  import resumeClasses from './stop-resumeClasses'
  import stopAdd from './stop-add'
  import schoolAllSidebar from '@/views/common-sidebar/school-all-sidebar'
  import { stopList, stopAdopt, stopForbidden, stopCheckPending } from '@/api/stop'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'

  export default {
    data () {
      return {
        visible: false,
        stopAddVisible: false,
        resumeClassesAddVisible: false,
        roleList: [],
        value: '',
        regPopVisible: false,
        dataForm: {
          stuPhone: undefined,
          stuName: undefined,
          regNo: undefined,
          schoolId: undefined,
          schoolName: undefined,
          stopStatus: undefined
        },
        status: [
          { value: 1, label: '待审核' },
          { value: 2, label: '通过' },
          { value: 0, label: '作废' }
        ],
        stuSearch: '',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        downloadLoading: false,
        studentDisable: false,
        dataListLoading: false,
        dataListSelections: [],
        addVisible: false,
        dialogFormVisible: false,
        courseListVisible: false
      }
    },
    components: {
      schoolAllSidebar, stopAdd, resumeClasses
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 表格样式
      tableRowClassName ({row, rowIndex}) {
        if (row.stopStatus === 2) {
          // 通过
          return 'success-row'
        } else if (row.stopStatus === 0) {
          // 作废样式
          return 'warning-row'
        }
        return ''
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        stopList(
          this.pageIndex, this.pageSize,
          this.dataForm.stuPhone, this.dataForm.stuName, this.dataForm.schoolId,
          this.dataForm.regNo, this.dataForm.stopStatus).then(res => {
            if (res.data && res.data.code === 0) {
              this.dataList = res.data.data.list
              this.totalPage = res.data.data.totalCount
              if (this.dataList !== null) {
                this.isShow = false
              }
            } else {
              this.dataList = []
              this.totalPage = 0
            }
            this.dataListLoading = false
          }).catch(err => {
            console.log(err)
          })
      },
      // 重置查询条件
      resetSearch () {
        this.dataForm.stuName = undefined
        this.dataForm.stuPhone = undefined
        this.dataForm.cardId = undefined
        this.dataForm.regNo = undefined
        this.dataForm.ptype = ''
        this.isShow = true
        this.getDataList()
      },
      schoolTreeChangeEvent (schoolId, schoolName, schoolCode) {
        this.dataForm.schoolId = schoolId
        this.getDataList()
      },

      // 新增操作
      info () {
        this.stopAddVisible = true
        this.$nextTick(() => {
          this.$refs.stopAdd.init()
        })
      },
      resumeClasses (id) {
        this.resumeClassesAddVisible = true
        this.$nextTick(() => {
          this.$refs.resumeClasses.init(id)
        })
      },
      // 导出操作
      exportHandle () {
        /* generate workbook object from table */
       // 判断要导出的节点中是否有fixed的表格，如果有，转换excel时先将该dom移除，然后append回去，
        var fix = document.querySelector('.el-table__fixed');
        var wb;
        if (fix) {
          wb = XLSX.utils.table_to_book(document.querySelector('#dataListStop').removeChild(fix));
          document.querySelector('#dataListStop').appendChild(fix);
        } else {
          wb = XLSX.utils.table_to_book(document.querySelector('#dataListStop'));
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
            '休学档案.xlsx'
          );
        } catch (e) {
          if (typeof console !== 'undefined') console.log(e, wbout);
        }
        return wbout;
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
      //   通过操作
      changeStatus (id) {
        stopAdopt(id).then(res => {
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
        }).catch(err => {
          console.log(err)
        })
      },
      // 反审核
      changeUnstatus (id) {
        this.$confirm(`确定反审核吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          stopCheckPending(id).then(res => {
            if (res.data && res.data.code === 0) {
              console.log(res)
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
        }).catch(err => {
          console.log(err)
        })
      },
      // 作废
      stopHandle (id) {
        this.$confirm(`确定作废吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          stopForbidden(id).then(res => {
            if (res.data && res.data.code === 0) {
              console.log(res)
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
        }).catch(err => {
          console.log(err)
        })
      },
      stopBackDateFormatter (row, data) {
        return this.dateFormatter(row.stopBackDate)
      },
      stopStartDateFormatter (row, data) {
        return this.dateFormatter(row.stopStartDate)
      },
      endStartDateFormatter (row, data) {
        return this.dateFormatter(row.endStartDate)
      },
      dateFormatter (dateStr) {
        return dateStr == null ? '' : dateStr.substring(0, 10)
      }
    }
  }
</script>

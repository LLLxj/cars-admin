<template>
  <div class="mod-user">
    <!-- 布局容器 -->
    <el-container>
      <!-- 左侧 -->
      <el-aside width="320px">
        <schoolAllSidebar ref="schoolAllSidebar" @school-sidebar-node-change-event="schoolTreeChangeEvent"/>
      </el-aside>
      <!-- 右侧 -->
      <el-main>
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item label="日期" prop="monthDate">
            <el-date-picker v-model="dataForm.monthDate" type="month" placeholder="选择月" value-format="yyyyMM">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="学生姓名" prop="stuUserName">
            <el-input v-model="dataForm.stuUserName" placeholder="请输入学生姓名" clearable></el-input>
          </el-form-item>
          <el-form-item label="学生手机" prop="stuPhone">
            <el-input v-model="dataForm.stuPhone" placeholder="请输入手机号" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-if="isAuth('cou:attend:stuMonth:list')" @click="getDataList()">查询</el-button>
            <el-button :disabled="isShow" @click="resetSearch()">重置</el-button>
            <el-button type="info" :disabled="isShow" :loading="downloadLoading" @click="exportHandle()">导出</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="dataList" border stripe v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;" id="dataListProcess">
          <!--展示列-->
          <el-table-column type="index" align="center" header-align="center" width="80" label="NO" fixed/>
          <el-table-column label="报名信息" header-align="center" align="center">
            <el-table-column prop="stuUserName" header-align="center" align="center" label="姓名"/>
            <el-table-column prop="stuUserPhone" header-align="center" align="center" label="手机号"/>
            <el-table-column prop="payDate" header-align="center" align="center" label="报名时间" :formatter="dateFormatter"/>
            <el-table-column prop="payPrice" header-align="center" align="center" label="学费"/>
          </el-table-column>
          <el-table-column label="开班信息" header-align="center" align="center">
            <el-table-column prop="classTypeName" header-align="center" align="center" label="课程项目"/>
            <el-table-column prop="openSchoolDate" header-align="center" align="center" label="开班时间" :formatter="dateFormatter"/>
            <el-table-column prop="classTypeTotalKc" header-align="center" align="center" label="课程总课时"/>
            <el-table-column prop="monthStuKc" header-align="center" align="center" label="本月上课时间"/>
            <el-table-column prop="totalStuKc" header-align="center" align="center" label="累计上课时间"/>
            <el-table-column prop="leftKc" header-align="center" align="center" label="剩余课时"/>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
                       :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" background
                       :total="totalPage"
                       layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </el-main>
      <schoolPopSearch v-if="schoolPopSearchVisible" ref="schoolPopSearch"
                       @school-pop-event="callBackSchoolPopSearch"></schoolPopSearch>
    </el-container>
  </div>
</template>
<style>
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
</style>
<script>
  import {stuProcess} from '@/api/student'
  import {dateSubstring} from '@/utils/index'
  import { parseTime } from '@/utils'
  import schoolPopSearch from '@/views/common-pop/school-pop'
  import schoolAllSidebar from '@/views/common-sidebar/school-all-sidebar'
  import {getInClassStatusList} from '@/utils/inClassStatus'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'

  export default {
    data () {
      return {
        dataForm: {
          monthDate: this.getLastMonth(),
          stuUserName: undefined,
          stuPhone: undefined,
          schoolId: undefined,
          schoolName: undefined
        },
        stuSearch: '',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        isShow: true,
        downloadLoading: false,
        studentDisable: false,
        dataListLoading: false,
        dataListSelections: [],
        dialogFormVisible: false,
        schoolPopSearchVisible: false,
        classList: getInClassStatusList(true)
      }
    },
    components: {
      schoolPopSearch, schoolAllSidebar
    },
    methods: {
      getDataList () {
        this.dataListLoading = true
        stuProcess(this.pageIndex, this.pageSize, this.dataForm.monthDate, this.dataForm.stuUserName, this.dataForm.stuPhone, this.dataForm.schoolId).then(res => {
          if (res.data && res.data.code === 0) {
            this.dataList = res.data.data.list
            this.totalPage = res.data.data.totalCount
            this.isShow = false
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
        this.dataForm.monthDate = this.getLastMonth()
        this.dataForm.stuUserName = undefined
        this.dataForm.stuPhone = undefined
        this.dataForm.schoolId = undefined
        this.dataForm.schoolName = undefined
        this.isShow = true
        this.dataList = []
        this.getDataList()
      },
      schoolTreeChangeEvent (schoolId, schoolName, schoolCode) {
        this.dataForm.schoolId = schoolId
        this.dataForm.schoolName = schoolName
        this.getDataList()
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
      // 搜索选择校区弹窗
      searchSchoolHandle () {
        this.schoolPopSearchVisible = true
        this.$nextTick(() => {
          this.$refs.schoolPopSearch.init()
        })
      },
      callBackSchoolPopSearch (schoolId, schoolName) {
        this.dataForm.schoolId = schoolId
        this.dataForm.schoolName = schoolName
      },
      exportHandle () {
        var fix = document.querySelector('.el-table__fixed')
        var wb
        if (fix) {
          wb = XLSX.utils.table_to_book(document.querySelector('#dataListProcess').removeChild(fix))
          document.querySelector('#dataListProcess').appendChild(fix)
        } else {
          wb = XLSX.utils.table_to_book(document.querySelector('#dataListProcess'))
        }
        /* get binary string as output */
        var wbout = XLSX.write(wb, {
          bookType: 'xlsx',
          bookSST: true,
          type: 'array'
        })
        try {
          FileSaver.saveAs(
            new Blob([wbout], {
              type: 'application/octet-stream'
            }),
            '学习进度.xlsx'
          )
        } catch (e) {
          if (typeof console !== 'undefined') console.log(e, wbout)
        }
        return wbout
      },
      formatJson (filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      dateFormatter (row, column, cellValue) {
        return dateSubstring(cellValue)
      },
      getLastMonth () {
        let date = new Date()
        date.setMonth(date.getMonth() - 1)
        return parseTime(date, '{y}{m}')
      }
    }
  }
</script>

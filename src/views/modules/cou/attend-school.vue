<template>
  <div class="mod-user">
    <!-- 布局容器 -->
    <el-container>

      <!-- 右侧 -->
      <el-main>
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <!-- <el-form-item label="校区" prop="schoolName">
            <el-input v-model="dataForm.schoolName" placeholder="点击选择校区" readonly @click.native="searchSchoolHandle()" prefix-icon="el-icon-search"></el-input>
          </el-form-item> -->
          <el-form-item label="校区" prop="schoolId">
            <school-select v-model="dataForm.schoolId"/>
          </el-form-item>
          <el-form-item label="报表类型" prop="logType">
              <el-select v-model="dataForm.logType" placeholder="全部">
                <el-option v-for="item in logType" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
              </el-select>
          </el-form-item>
          <el-form-item prop="dateTime">
            <el-date-picker  v-model="dataForm.dateTime"  type="daterange"  range-separator="-"  start-placeholder="开始日期"  end-placeholder="结束日期"  value-format="yyyy-MM-dd"
              :clearable="false"
              :picker-options="datePickerOptions"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button v-if="isAuth('cou:attend:school:list')" @click="getDataList()">查询</el-button>
            <el-button :disabled="isShow" @click="resetSearch()">重置</el-button>
            <el-button  type="info" :disabled="isShow" :loading="downloadLoading" @click="exportHandle()">导出</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="dataList" border stripe v-loading="dataListLoading" style="width: 100%;" @sort-change='listenProp' id="dataListSchoolAttend">
          <el-table-column type="index" align="center" header-align="center" width="80" label="NO" fixed/>
          <el-table-column prop="name" header-align="center" align="center" width="210" label="报表名称"/>
          <el-table-column prop="schoolName" column-key="school_id" sortable='custom' header-align="center" align="center" width="150" label="校区"/>
          <el-table-column prop="stuNum" column-key="stu_num" sortable='custom' header-align="center" align="center" label="学员数"/>
          <el-table-column prop="cplanContNum" column-key="cplan_cont_num" sortable='custom' header-align="center" align="center" label="课次数"/>
          <el-table-column prop="cplanContStu" column-key="cplan_cont_stu" sortable='custom' header-align="center" align="center" label="应出勤人课次" width="135"/>
          <el-table-column prop="cplanContStuNormal" column-key="cplan_cont_stu_normal" sortable='custom' header-align="center" align="center" label="实际出勤人课次" width="145"/>
          <el-table-column prop="cplanContStuLeave" column-key="cplan_cont_stu_leave" sortable='custom' header-align="center" align="center" label="请假人课次"/>
          <el-table-column prop="cplanContStuOff" column-key="cplan_cont_stu_off" sortable='custom' header-align="center" align="center" label="缺勤人课次"/>
          <el-table-column prop="cplanContStuUn" column-key="cplan_cont_stu_un" sortable='custom' header-align="center" align="center" label="未统计人课次" width="130"/>
          <el-table-column prop="cplanContStuStop" column-key="cplan_cont_stu_stop" sortable='custom' header-align="center" align="center" label="休学人课次"/>
          <el-table-column prop="createTime" column-key="create_time" sortable='custom' header-align="center" align="center" label="生成时间" :formatter="dateFormatter"/>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" background :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
          :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </el-main>
    </el-container>

   <!-- 校区弹窗弹窗 -->
   <schoolPop v-if="schoolPopVisible" ref="schoolPop" @school-pop-event="callBackSchoolPop"></schoolPop>
  </div>

</template>

<script>
  // import schoolPop from '@/views/common-pop/school-pop'
  import schoolSelect from '@/views/common-select/school-select'
  import { parseTime } from '@/utils'
  import { attendSchoolList } from '@/api/attend'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'

  export default {
    data () {
      return {
        datePickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        dataForm: {
          schoolId: undefined,
          schoolName: undefined,
          logType: '',
          order: true,
          orderColumns: undefined,
          dateTime: [parseTime(new Date(new Date().getTime() - 3600 * 1000 * 24 * 7), '{y}-{m}-{d}'), parseTime(new Date(), '{y}-{m}-{d}')]
        },
        logType: [
          {value: '', label: '全部'},
          {value: 1, label: '周报'},
          {value: 2, label: '月报'}
        ],
        downloadLoading: false,
        // 保存回调的classId
        changeClassId: '',
        // 保存报名表和班级表信息的id
        regClassId: '',
        stuSearch: '',
        dataList: [],
        isShow: true,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        schoolPopVisible: false,
        dataListLoading: false,
        dataListSelections: [],
        dialogFormVisible: false
      }
    },
    components: {
      // schoolPop
      schoolSelect
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        attendSchoolList(this.pageIndex, this.pageSize,
          this.dataForm.schoolId, this.dataForm.logType,
          this.dataForm.dateTime[0], this.dataForm.dateTime[1], this.dataForm.order, this.dataForm.orderColumns)
          .then(res => {
            if (res.data && res.data.code === 0) {
              this.dataList = res.data.page.list
              if (this.dataList.length !== 0) {
                this.isShow = false
              }else{
                this.isShow = true
              }
              this.totalPage = res.data.page.totalCount
            } else {
              this.dataList = []
              this.totalPage = 0
            }
            this.dataListLoading = false
          }).catch(err => {
            console.log(err)
          })
      },
      //排序查询
      listenProp (column, prop, order) {
        if(this.dataList.length !== 0){
          this.dataForm.orderColumns = column.column.columnKey
          this.dataForm.order = column.order
          if(this.dataForm.order == 'ascending'){
            this.dataForm.order = true
          }else{
            this.dataForm.order = false
          }
          this.getDataList()
        }else{
          
        }   
      },
      // 重置查询条件
      resetSearch () {
        this.dataForm.schoolId = undefined
        this.dataForm.schoolName = undefined
        this.dataForm.logType = ''
        // this.dataForm.dateTime = [parseTime(new Date()), parseTime(new Date().getTime() - 3600 * 1000 * 24 * 7)]
        this.dataForm.order = false
        this.dataForm.orderColumus = undefined
        this.dataList = []
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
      // 导出操作
      exportHandle () {
        var fix = document.querySelector('.el-table__fixed');
        var wb;
        if (fix) {
          wb = XLSX.utils.table_to_book(document.querySelector('#dataListSchoolAttend').removeChild(fix));
          document.querySelector('#dataListSchoolAttend').appendChild(fix);
        } else {
          wb = XLSX.utils.table_to_book(document.querySelector('#dataListSchoolAttend'));
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
            '校区考勤统计.xlsx'
          );
        } catch (e) {
          if (typeof console !== 'undefined') console.log(e, wbout);
        }
        return wbout;
      },
      // 搜索选择校区弹窗
      searchSchoolHandle () {
        this.schoolPopVisible = true
        this.$nextTick(() => {
          this.$refs.schoolPop.init()
        })
      },
      callBackSchoolPop (schoolId, schoolName) {
        this.dataForm.schoolId = schoolId
        this.dataForm.schoolName = schoolName
      },
      dateFormatter (row, column, cellValue) {
        return cellValue ? cellValue.substring(0, 10) : '-'
      }
    }
  }
</script>

<template>
  <div class="mod-user">
    <!-- 布局容器 -->
    <el-container>
      <!-- 右侧 -->
      <el-main>
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item label="教务老师" prop="teacherName">
            <el-input v-model="dataForm.teacherName" placeholder="点击选择教务老师" readonly @click.native="searchTeacherHandle()" prefix-icon="el-icon-search"></el-input>
          </el-form-item>
          <el-form-item label="报表类型" prop="logType">
              <el-select v-model="dataForm.logType" placeholder="全部">
                <el-option v-for="item in logType" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
              </el-select>
          </el-form-item>
          <el-form-item prop="dateTime">
            <el-date-picker
              v-model="dataForm.dateTime"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :clearable="false"
              :picker-options="datePickerOptions"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button v-if="isAuth('cou:attend:teacher:list')" @click="getDataList()">查询</el-button>
            <el-button @click="resetSearch()">重置</el-button>
            <el-button  type="info" :disabled="isShow" :loading="downloadLoading" @click="exportHandle()">导出</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="dataList" border stripe v-loading="dataListLoading" style="width: 100%;" @sort-change='listenProp' id="dataListTeacherAttend">
          <el-table-column type="index" align="center" header-align="center" width="80" label="NO" fixed/>
          <el-table-column prop="name" header-align="center" align="center" width="210" label="报表名称"/>
          <el-table-column prop="teacherName" column-key="teacher_id" header-align="center" align="center" sortable='custom' label="老师"/>
          <el-table-column prop="stuNum" column-key="stu_num" header-align="center" align="center" sortable='custom' label="学员数"/>
          <el-table-column prop="cplanContNum" column-key="cplan_cont_num" header-align="center" align="center" sortable='custom' label="课次数"/>
          <el-table-column prop="cplanContStu" column-key="cplan_cont_stu" header-align="center" align="center" sortable='custom' label="应出勤人课次" width="135"/>
          <el-table-column prop="cplanContStuNormal" column-key="cplan_cont_stu_normal" header-align="center" align="center" sortable='custom' label="实际出勤人课次" width="145"/>
          <el-table-column prop="cplanContStuLeave" column-key="cplan_cont_stu_leave" header-align="center" align="center" sortable='custom' label="请假人课次"/>
          <el-table-column prop="cplanContStuOff" column-key="cplan_cont_stu_off" header-align="center" align="center" sortable='custom' label="缺勤人课次"/>
          <el-table-column prop="cplanContStuUn" column-key="cplan_cont_stu_un" header-align="center" align="center" sortable='custom' label="未统计人课次" width="130"/>
          <el-table-column prop="cplanContStuStop" column-key="cplan_cont_stu_stop" header-align="center" align="center" sortable='custom' label="休学人课次"/>
          <el-table-column prop="createTime" column-key="create_time" header-align="center" align="center" sortable='custom' label="生成时间" :formatter="dateFormatter"/>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" background :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
          :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </el-main>
    </el-container>
   <!-- 教务老师弹窗弹窗 -->
   <teacherPop v-if="teacherPopVisible" ref="teacherPop" @jx-pop-event="callBackTeacherPop"></teacherPop>
  </div>
</template>

<script>
  import teacherPop from '@/views/common-pop/jx-teacher-pop'
  import { parseTime } from '@/utils'
  import { attendTeacherList } from '@/api/attend'
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
          teacherId: undefined,
          teacherName: undefined,
          logType: '',
          dateTime: [parseTime(new Date(new Date().getTime() - 3600 * 1000 * 24 * 7),'{y}-{m}-{d}'), parseTime(new Date(),'{y}-{m}-{d}')],
          order: true,
          orderColumns: undefined
        },
        logType: [
          {value: '', label: '全部'},
          {value: 1, label: '周报'},
          {value: 2, label: '月报'}
        ],
        isShow: true,
        downloadLoading: false,
        // 保存回调的classId
        changeClassId: '',
        // 保存报名表和班级表信息的id
        regClassId: '',
        stuSearch: '',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        // classPopVisible: false,
        teacherPopVisible: false,
        dataListLoading: false,
        dataListSelections: [],
        dialogFormVisible: false
      }
    },
    components: {
      teacherPop
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        attendTeacherList(this.pageIndex, this.pageSize,
          this.dataForm.teacherId, this.dataForm.logType,
          this.dataForm.dateTime[0], this.dataForm.dateTime[1], this.dataForm.order, this.dataForm.orderColumns)
          .then(res => {
            if (res.data && res.data.code === 0) {
              this.dataList = res.data.page.list
              if (this.dataList.length !== 0) {
                this.isShow = false
              } else {
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
      // 排序查询
      listenProp (column, prop, order) {
        if (this.dataList.length !== 0) {
          this.dataForm.orderColumns = column.column.columnKey
          this.dataForm.order = column.order
          if (this.dataForm.order === 'ascending') {
            this.dataForm.order = true
          } else {
            this.dataForm.order = false
          }
          this.getDataList()
        }
      },
      // 重置查询条件
      resetSearch () {
        this.dataForm.teacherId = undefined
        this.dataForm.teacherName = undefined
        this.dataForm.logType = ''
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
          wb = XLSX.utils.table_to_book(document.querySelector('#dataListTeacherAttend').removeChild(fix));
          document.querySelector('#dataListTeacherAttend').appendChild(fix);
        } else {
          wb = XLSX.utils.table_to_book(document.querySelector('#dataListTeacherAttend'));
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
            '教室考勤统计.xlsx'
          );
        } catch (e) {
          if (typeof console !== 'undefined') console.log(e, wbout);
        }
        return wbout;
      },
      // 选择教务老师弹窗
      searchTeacherHandle () {
        this.teacherPopVisible = true
        this.$nextTick(() => {
          this.$refs.teacherPop.init()
        })
      },
      callBackTeacherPop (teacherId, teacherName) {
        this.dataForm.teacherId = teacherId
        this.dataForm.teacherName = teacherName
      },
      dateFormatter (row, column, cellValue) {
        return cellValue ? cellValue.substring(0, 10) : '-'
      }
    }
  }
</script>

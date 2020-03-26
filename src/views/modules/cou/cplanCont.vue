<template>
  <div class="mod-user">
    <!-- 布局容器 -->
    <el-container>
      <!-- 右侧 -->
      <el-main>
          <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item label="排课" prop="cplanContName">
            <el-input v-model="dataForm.cplanContName" placeholder="请输入排课名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="讲师" prop="lectuerId">
            <jxTeacher v-model="dataForm.lectuerId" />
          </el-form-item>
          <!-- <el-form-item label="讲师" prop="lectuerName">
            <el-input v-model="dataForm.lectuerName" placeholder="点击选择讲师" readonly @click.native="selectTeacherHandle()" prefix-icon="el-icon-search">
            </el-input>
          </el-form-item> -->
          <el-form-item label="选择日期" prop="dateTime" >
            <el-date-picker
              v-model="dataForm.dateTime"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd 00:00:00"
              :clearable="false"
              :picker-options="datePickerOptions"
            ></el-date-picker>
          </el-form-item>
          <!-- <el-form-item label="教室" prop="croomName">
            <el-input v-model="dataForm.croomName" placeholder="点击选择教室" readonly @click.native="selectClassRoom()" prefix-icon="el-icon-search"></el-input>
          </el-form-item> -->
          <el-form-item label="教室" prop="croomId">
            <classRoom v-model="dataForm.croomId"/>
          </el-form-item>

          <el-form-item>
            <el-button v-if="isAuth('cou:cplanCont:list')" @click="getDataList()">查询</el-button>
            <el-button  :disabled="isShow" @click="resetSearch()">重置</el-button>
            <el-button  type="info" :disabled="isShow" :loading="downloadLoading" @click="exportHandle()">导出</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="dataList" border stripe v-loading="dataListLoading" @selection-change="selectionChangeHandle"
         style="width: 100%;" @sort-change='listenProp' id="dataListCplanCont">
          <!--隐藏列-->
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="ID"><span>{{ props.row.cplanContId }}</span></el-form-item>
                <el-form-item label="排课ID"><span>{{ props.row.cplanId }}</span></el-form-item>
                <el-form-item label="班级ID"><span>{{ props.row.classId }}</span></el-form-item>
                <el-form-item label="教学ID"><span>{{ props.row.lectuerId }}</span></el-form-item>
                <el-form-item label="教室ID"><span>{{ props.row.croomId }}</span></el-form-item>
                <el-form-item label="校区ID"><span>{{ props.row.schoolId }}</span></el-form-item>
                <el-form-item label="基础排课ID"><span>{{ props.row.courseContId }}</span></el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <!--展示列-->
          <el-table-column type="index" align="center" header-align="center" label="NO" fixed/>
          <el-table-column prop="schoolName" column-key="school_id" sortable='custom' header-align="center" align="center" label="校区"/>
          <el-table-column prop="cplanContName" column-key="cplan_cont_id" sortable='custom' header-align="center" align="center" label="排课名称"/>
          <el-table-column prop="cplanName" header-align="center" align="center" label="班级"/>
          <el-table-column prop="cplanOpenDate" column-key="cplan_open_date" sortable='custom' header-align="center" align="center" label="开课时间" width="120"/>
          <el-table-column prop="ptype" header-align="center" align="center" label="时点" width="80">
              <template slot-scope="scope">
                <span v-if="scope.row.ptype === 1" size="small" type="danger">上午</span>
                <span v-else size="small">下午</span>
              </template>
          </el-table-column>
          <!--<el-table-column prop="lectuerName" column-key="lectuer_id" sortable='custom' header-align="center" align="center" label="主讲">
          </el-table-column>-->
          <el-table-column prop="lectuerName" column-key="lectuer_id" sortable='custom' header-align="center" align="center" label="老师">
            <template slot-scope="scope">
              <el-tag>主讲:{{scope.row.lectuerName}}</el-tag>
              <el-tag v-show="scope.row.tutorTeacherName != ''" type="success">辅导:{{scope.row.tutorTeacherName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="croomName" column-key="croom_id" sortable='custom' header-align="center" align="center"  label="教室">
          </el-table-column>
          <el-table-column prop="atteType" header-align="center" align="center" width="80" label="是否考勤">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.atteType === 0" size="small" type="danger">否</el-tag>
              <el-tag v-if="scope.row.atteType === 1" type="success">是</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
            <template slot-scope="scope">
              <el-button v-if="isAuth('sys:user:update')" type="text" size="small" @click="updateHandle(scope.row.cplanContId)">编辑</el-button>
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
        <!-- 教师弹窗 -->
        <!-- <jxPop v-if="jxPopVisible" ref="jxPop" @jx-pop-event="callBackJxPop"></jxPop> -->
        <!-- <classRoomPop v-if="classRoomPopVisible" ref="classRoomPop" @classRoom-pop-event="callBackClassPop"></classRoomPop> -->
      </el-main>
    </el-container>
    <div>
      <updatePop v-if="updateHandleVisible" ref="updatePop" @refreshDataList="getDataList"></updatePop>
    </div>

  </div>
</template>
<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
</style>
<script>
  // import jxPop from '@/views/common-pop/jx-teacher-pop'
  import jxTeacher from '@/views/common-select/jx-teacher-select'
  import classRoom from '@/views/common-select/all-classroom-select'
  import updatePop from './cplanCont-update'
  import { cplanList } from '@/api/cplanCont'
  import { parseTime } from '@/utils'
  // import classRoomPop from '@/views/common-pop/class-room-pop'
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
          cplanContName: undefined,
          classId: undefined,
          className: undefined,
          lectuerName: undefined,
          lectuerId: undefined,
          dateTime: [parseTime(new Date()), parseTime(new Date())],
          ptype: undefined,
          // 教室id
          croomId: undefined,
          croomName: undefined,
          order: 'true',
          orderColumns: undefined
        },
        day: [{value: 0, label: '全部'}, {value: 1, label: '上午'}, {value: 2, label: '下午'}],
        stuSearch: '',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        isShow: true,
        classRoomPopVisible: false,
        downloadLoading: false,
        updateHandleVisible: false,
        dataListLoading: false,
        dataListSelections: [],
        jxPopVisible: false,
        dialogFormVisible: false
      }
    },
    components: {
      updatePop, jxTeacher, classRoom
    },
    activated () {
      this.init()
    },
    methods: {
      init () {
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        cplanList(this.pageIndex, this.pageSize, parseTime(this.dataForm.dateTime[0], '{y}-{m}-{d} 00:00:00'), parseTime(this.dataForm.dateTime[1], '{y}-{m}-{d} 23:59:59'), this.dataForm.cplanContName,
          this.dataForm.lectuerId, this.dataForm.ptype, this.dataForm.croomId, this.dataForm.order, this.dataForm.orderColumns).then(res => {
            if (res.data && res.data.code === 0) {
              this.dataList = res.data.data.list
              for (const i in this.dataList) {
                this.dataList[i].cplanOpenDate = this.dataList[i].cplanOpenDate.substring(0, 10)
              }
              if (this.dataList !== null) {
                this.isShow = false
              }
              this.totalPage = res.data.data.totalCount
            } else {
              this.dataList = []
              this.totalPage = 0
            }
            this.dataListLoading = false
          }).catch(err => {
          this.dataListLoading = false
            console.log(err)
          })
      },
      // 排序查询
      listenProp (column, prop, order) {
        if (this.dataList.length !== 0) {
          this.dataForm.orderColumns = column.column.columnKey
          this.dataForm.order = column.order
          if (this.dataForm.order == 'ascending') {
            this.dataForm.order = true
          } else {
            this.dataForm.order = false
          }
          this.getDataList()
        }
      },
      // 重置查询条件
      resetSearch () {
        // this.dataForm.startDateTime = ''
        // this.dataForm.endDateTime = ''
        this.dataForm.dateTime = [parseTime(new Date()), parseTime(new Date())]
        this.dataForm.cplanContName = ''
        this.dataForm.lectuerName = ''
        this.dataForm.lectuerId = ''
        this.dataForm.croomId = ''
        this.dataForm.croomName = ''
        this.dataForm.ptype = ''
        this.isShow = true
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
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 导出操作
      exportHandle () {
        var fix = document.querySelector('.el-table__fixed');
        var wb;
        if (fix) {
          wb = XLSX.utils.table_to_book(document.querySelector('#dataListCplanCont').removeChild(fix));
          document.querySelector('#dataListCplanCont').appendChild(fix);
        } else {
          wb = XLSX.utils.table_to_book(document.querySelector('#dataListCplanCont'));
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
            '排课档案.xlsx'
          );
        } catch (e) {
          if (typeof console !== 'undefined') console.log(e, wbout);
        }
        return wbout;
      },
      //   讲师弹窗
      selectTeacherHandle () {
        this.jxPopVisible = true
        this.$nextTick(() => {
          this.$refs.jxPop.init()
        })
      },
      callBackJxPop (userId, username) {
        // console.log(userId, username)
        this.dataForm.lectuerName = username
        this.dataForm.lectuerId = userId
      },
      // 选择教室弹窗
      selectClassRoom () {
        this.classRoomPopVisible = true
        this.$nextTick(() => {
          this.$refs.classRoomPop.init()
        })
      },
      // 教室回调事件
      callBackClassPop (croomId, croomName) {
        // console.log(croomId,croomName)
        this.dataForm.croomId = croomId
        this.dataForm.croomName = croomName
      },
      //   更新操作
      updateHandle (id) {
        this.updateHandleVisible = true
        this.$nextTick(() => {
          this.$refs.updatePop.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          stuListDelete(id).then(res => {
            console.log(res)
            // console.log(res)
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
          })
        }).catch(() => {
        })
      }
    }
  }
</script>

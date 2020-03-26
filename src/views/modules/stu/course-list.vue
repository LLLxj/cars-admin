<template>
  <el-dialog title="课程科目列表" :close-on-click-modal="false" :visible.sync="visible">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      </el-form>

      <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
          <el-table-column prop="courseName" header-align="center" align="center" label="课程科目"/>
          <el-table-column prop="cplanSchoolName" header-align="center" align="center" label="就读校区"/>
          <el-table-column header-align="center" align="center" label="班级">
            <template slot-scope="scope">
              <span v-if="scope.row.cplanName == null" size="small">-</span>
              <span v-else size="small">{{scope.row.cplanName}}</span>
            </template>
          </el-table-column>
        <el-table-column prop="cplanFirstDate" header-align="center" align="center" label="开课日期" :formatter="dateFormatter"/>
        <el-table-column prop="cplanEndDate" header-align="center" align="center" label="结课日期" :formatter="dateFormatter"/>
        <el-table-column header-align="center" align="center" width="200" label="班级进度">
          <template slot-scope="scope">
            <div style="display:flex;justify-content:space-around;align-items: center;">
              <el-progress style="width:50%" :stroke-width="14" :show-text="false" :percentage="parseInt(scope.row.endCplanContNum*100/scope.row.allCplanContNum) || 0"
                           :status="scope.row.endCplanContNum==scope.row.allCplanContNum?'success':'text'"></el-progress>
              <span>{{scope.row.endCplanContNum +'/'+scope.row.allCplanContNum}}</span>
            </div>
          </template>
        </el-table-column>
          <el-table-column fixed="right" header-align="center" align="center" label="操作" width="100">
            <template slot-scope="scope">
              <el-button v-if="scope.row.cplanId === 0 && isAuth('stu:reg:course:update')" type="text" size="small" @click="assignClass(scope.row)">入班</el-button >
              <el-button v-if="scope.row.cplanId !== 0 && isAuth('stu:reg:course:update')" type="text" size="small" @click="quitClass(scope.row.regCourseId)">退班</el-button >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
          :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>

    <!-- 排课弹窗 -->
    <cplanPop v-if="cplanPopVisible" ref="cplanPop" @cplan-pop-event="callBackCplanPop"></cplanPop>

  </el-dialog>
</template>

<script>

  import { regCourseList, regCourseSave, regCourseDelete, regGetCourseList, regAssignClass, regQuitClass } from '@/api/reg'
  import cplanPop from '@/views/common-pop/cplan-pop-reg'

  export default {
    data () {
      return {
        visible: false,
        dataList:[],
        // coursePopVisible: false,
        dataListLoading:true,
        pageIndex:1,
        pageSize:10,
        totalPage:0,
        index:'',
        data: '',
        selectRegCourseId: '',
        dataForm: {
          courseId: '',
          regCourseId: '',
          cplanId: '',
          firstDate: '',
          classStatus:1,
          classDate:'',
          schoolId: '',
          teacherId: '',
          teacherName:'',
          cplanId: '',
          cplanName: ''
        },
        cplanPopVisible: false,
      }
    },
    components: {
      cplanPop
    },
    methods: {
      init (data) {
        this.data = data
        this.index = data.regId || 0
        this.visible = true
        if(this.index){
          this.getDataList()
        }
      },
      getDataList () {
        this.dataListLoading = true
        regGetCourseList(this.pageIndex,this.pageSize,this.index).then(res => {
          if(res.data && res.data.code === 0 ){
            this.dataList = res.data.data.list
            this.totalPage = res.data.data.totalCount
          }else{
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        }).catch(err => {
          console.log(err)
        })
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
      // 分班操作
      assignClass (data) {
        this.selectRegCourseId = data.regCourseId
        this.cplanPopVisible = true
        this.$nextTick(() => {
          this.$refs.cplanPop.init(this.selectRegCourseId)
        })
      },
      // 分班操作回调
      callBackCplanPop (cplanId, regCourseId) {
        this.dataForm.cplanId = cplanId
        this.dataForm.regCourseId = regCourseId
        regAssignClass({
          'cplanId': this.dataForm.cplanId,
          'regCourseId': this.dataForm.regCourseId,
        }).then(res => {
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
      },
      // 退班操作
      quitClass (id) {
        this.$confirm(`确定退班?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          regQuitClass({
            'regCourseId': id
          }).then(res => {
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
        }).catch(() => {})
      },
      // 授课老师弹窗
      selectTeacherHandle () {
        this.jxTeacherPopVisible = true
        this.$nextTick(() => {
          this.$refs.jxPop.init()
        })
      },
      callBackJxPop(userId,username){
        this.dataForm.teacherName = username
        this.dataForm.teacherId = userId
      },
      dateFormatter (row, column, cellValue) {
        return cellValue ? cellValue.substring(0, 10) : '-'
      }
    }
  }
</script>

<template>
<div>
  <!-- 课次弹出层课次列表 -->
  <div>
    <el-dialog title="排课列表" :close-on-click-modal="false" :visible.sync="visible">

      <!-- <el-form :inline="true" :model="dataForm">

      </el-form> -->
      <el-form :model="dataForm" ref="dataForm" :rules="dataRule" @keyup.enter.native="dataFormSubmit()" label-width="80px">
        <el-row>
            <el-form-item>
              <el-button type="primary" v-if="isAuth('cou:cplan:save')" @click="addOrUpdateHandle()">新增</el-button>
              <el-button type="primary" v-if="showOrHidden" @click="loading()">加载</el-button>
              <el-button type="info" @click="downloadHandle()">下载模板</el-button>
              <el-button @click="uploadHandle()">导入</el-button>
            </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="校区" prop="schoolName">
              <el-input v-model="dataForm.schoolName" placeholder="点击选择校区" readonly  prefix-icon="el-icon-search" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程科目" prop="courseName">
              <el-input v-model="dataForm.courseName" placeholder="点击选择课程科目" readonly  prefix-icon="el-icon-search" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="校验">
              <el-checkbox v-model="dataForm.checkRoom" border>教室</el-checkbox>
              <el-checkbox v-model="dataForm.checkTeacher" border>教师</el-checkbox>
              <el-checkbox v-model="dataForm.checkTutorTeacher" border>辅导老师</el-checkbox>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="开课日期" v-if="showOrHidden" prop="classDate">
              <el-date-picker v-model="dataForm.classDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择开课日期"/>
            </el-form-item>
          </el-col> -->
        </el-row>

        <!-- <el-row>
          <el-col :span="12">
            <el-form-item label="教室" v-if="showOrHidden" prop="croomName">
              <el-input v-model="dataForm.croomName" placeholder="点击选择教室" readonly @click.native="selectClassRoomHandle()" prefix-icon="el-icon-search"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="讲师" v-if="showOrHidden" prop="teacherName">
              <el-input v-model="dataForm.teacherName" placeholder="点击选择讲师" readonly @click.native="selectTeacherHandle()" prefix-icon="el-icon-search"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
              <el-form-item label="教辅老师" v-if="showOrHidden" prop="tutorTeacherName">
                <div>
                  <el-input v-model="dataForm.tutorTeacherName" placeholder="点击选择教辅老师" readonly @click.native="selectTutorTeacherHandle()" prefix-icon="el-icon-search"
                  style="width:85%">
                  </el-input>
                  <el-button slot="append" icon="el-icon-close" @click="cleartutorTeacher()"></el-button>
                </div>
              </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="时点" v-if="showOrHidden" prop="wepName">
              <el-input v-model="dataForm.wepName" placeholder="点击选择时点" @click.native="selectTimePointHandle()"  readonly  prefix-icon="el-icon-search" />
            </el-form-item>
          </el-col>
        </el-row> -->
      </el-form>

      <el-table v-if="classListVisiable" :data="dataList" border stripe v-loading="dataListLoading" style="width: 100%;">
        <el-table-column type="index" align="center" header-align="center"/>
        <el-table-column prop="cplanContName" header-align="center" align="center" label="排课名称">
        </el-table-column>
        <el-table-column prop="cplanOpenDate" header-align="center" align="center" label="日期" :formatter="dateFormatter">
        </el-table-column>
        <el-table-column prop="ptype" header-align="center" align="center" label="时点">
          <template slot-scope="scope">
            <span v-if="scope.row.ptype === 1" size="small" type="danger">上午</span>
            <span v-else size="small">下午</span>
          </template>
        </el-table-column>
        <el-table-column prop="lectuerName" header-align="center" align="center" label="讲师">
        </el-table-column>
        <el-table-column prop="tutorTeacherName" header-align="center" align="center" label="教辅老师">
            <el-button slot="append" icon="el-icon-search"></el-button>
        </el-table-column>
        <el-table-column prop="croomName" header-align="center" align="center" label="教室" width="150">
        </el-table-column>
        <el-table-column prop="atteType" header-align="center" align="center" label="是否考勤" >
          <template slot-scope="scope">
            <span v-if="scope.row.atteType === 1" size="small" type="danger">是</span>
            <span v-else size="small">否</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
          <template slot-scope="scope">
            <el-button v-if="isAuth('cou:cplan:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row,scope.$index)">编辑</el-button>
            <el-button v-if="isAuth('cou:cplan:delete')" type="text" size="small" @click="deleteHandle(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false" :loading="loadBtn">取消</el-button>
        <el-button type="primary" :loading="loadBtn" @click="addCplanDataFormSubmit()">确定</el-button>
      </span>
      <!-- 弹窗 -->
      <school-pop v-if="schoolPopVisible" ref="schoolPop" @school-pop-event="callBackSchoolPop"></school-pop>
      <!-- 讲师弹窗 -->
      <jxPop ref="jxPop" v-if="jxTeacherPopVisible" @jx-pop-event="callBackJxPop"></jxPop>
      <!-- 讲师弹窗-新增排课列表 -->
      <jxPopForAdd ref="jxPopForAdd" v-if="jxPopForAddPopVisible" @jx-pop-event="callBackjxPopForAdd"></jxPopForAdd>
      <!-- 课程弹窗 -->
      <coursePop ref="coursePop" v-if="coursePopVisiable" @classType-pop-event="callBackCoursePop"></coursePop>
      <!-- 教室弹窗 -->
      <classRoomPop ref="classRoomPop" v-if="classRoomPopVisiable" @classRoom-pop-event="callBackClassRoomPop"></classRoomPop>
      <!-- 新增教室弹窗 -->
      <classRoomPopAdd ref="classRoomPopAdd" v-if="classRoomPopAddVisiable" @classRoom-pop-event="callBackClassRoomAddPop"></classRoomPopAdd>
      <!-- 选择教辅老师弹窗 -->
      <jfTeacherPop ref="jfTeacherPop" v-if="jfTeacherPopVisible" @jx-pop-event="callBackJfPop"></jfTeacherPop>
      <!--编辑课次弹窗-->
      <handleClpanPop ref="handleClpanPop" v-show="handleClpanPopVisible" @classAdd-pop-event="callBackClassAddPop"></handleClpanPop>
      <!-- 弹窗, 上传文件 -->
      <uploadPop v-if="uploadPopVisible" ref="uploadPop" @get-import-data="callbackAddData"></uploadPop>
    </el-dialog>
  </div>

  <!-- 时点弹窗 -->
  <div>
    <timePoint v-if="timePointPopVisible" ref="timePoint" @timePoint-pop-event="callBacktimePoint"></timePoint>
  </div>
</div>
</template>

<script>
  import { cplanContInfo, loadCplanCont, cplanContSave } from '@/api/cplan'
  import schoolPop from '@/views/common-pop/school-pop'
  import coursePop from '@/views/common-pop/basic-course-pop'
  import classRoomPop from '@/views/common-pop/class-room-pop'
  import classRoomPopAdd from '@/views/common-pop/class-room-pop'
  import timePoint from '@/views/common-pop/timePoint-pop'
  import classAdd from './class-times-add-or-update'
  import jxPop from '@/views/common-pop/jx-teacher-pop'
  import jfTeacherPop from '@/views/common-pop/jx-teacher-pop'
  import handleClpanPop from './class-times-add-or-update'
  import uploadPop from '@/views/common-pop/upload-class-time'
  import Vue from 'vue'
  export default {
    data () {
      var checkTeacher = (rule, value, callback) => {
        if (value !== this.dataForm.teacherName) {
          callback()
        } else {
          callback(new Error('辅导老师与讲师冲突'))
        }
      }
      return {
        visible: false,
        selectId: '',
        classTimeVisiable: false,
        schoolPopVisible: false,
        jxTeacherPopVisible: false,
        classRoomPopAddVisiable: false,
        coursePopVisiable: false,
        dataListLoading: false,
        timePointPopVisible: false,
        classPopVisiable: false,
        timePointPopVisiable: false,
        classListVisiable: true,
        classRoomPopVisiable: false,
        timePointVisiable: false,
        addTimePointVisible: false,
        jxPopForAddPopVisible: false,
        showOrHidden: false,
        classAddVisiable: false,
        jfTeacherPopVisible: false,
        handleClpanPopVisible: false,
        uploadPopVisible: false,
        loadBtn: false,
        dataForm: {
          courseName: '',
          courseId: '',
          schoolName: '',
          classDate: '',
          cpalnStatus: '',
          schoolId: '',
          cplanId: '',
          cplanName: '',
          croomName: '',
          croomId: '',
          wepName: '',
          wepId: '',
          checkTeacher: true,
          checkRoom: true,
          checkTutorTeacher: true,
          teacherId: '',
          teacherName: '',
          tutorTeacherId: '',
          tutorTeacherName: ''
        },
        addOrUpdate: '',
        dataList: null,
        getData: {},
        dataListCopy: [],
        dataListCopyIndex: '',
        timePointDataForm: {
          wepName: undefined
        },
        timePointDataList: [],
        addTimePointDataForm: {
          wepName: ''
        },
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataRule: {
          tutorTeacherName: [
            { validator: checkTeacher, trigger: 'change' }
          ]
        }
      }
    },
    components: {
      schoolPop, coursePop, timePoint, classRoomPopAdd, classAdd, classRoomPop, jxPop, jfTeacherPop, handleClpanPop, uploadPop
    },
    methods: {
      init (id) {
        this.visible = true
        this.selectId = id
        this.dataList = null
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        this.dataForm.cplanId = id || 0
        this.getDataList()
      },
      getDataList () {
        this.dataListLoading = true
        cplanContInfo(this.selectId).then(res => {
          if (res.data && res.data.code === 0 && res.data.data.couCplanContEntityList.length !== 0) {
            this.dataForm.cplanName = res.data.data.cplanName
            this.dataForm.schoolId = res.data.data.schoolId
            this.dataForm.schoolName = res.data.data.schoolName
            this.dataForm.courseId = res.data.data.courseId
            this.dataForm.courseName = res.data.data.courseName
            this.dataForm.cpalnStatus = res.data.data.cpalnStatus
            // this.showOrHidden = false
            this.dataList = res.data.data.couCplanContEntityList
          } else {
            this.dataForm.cplanName = res.data.data.cplanName
            this.dataForm.schoolId = res.data.data.schoolId
            this.dataForm.schoolName = res.data.data.schoolName
            this.dataForm.courseId = res.data.data.courseId
            this.dataForm.courseName = res.data.data.courseName
            this.dataForm.cpalnStatus = res.data.data.cpalnStatus
            // this.showOrHidden = true
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
        console.log(val)
        this.pageIndex = val
        this.getDataList()
      },
      // 讲师弹窗
      selectTeacherHandle () {
        this.jxTeacherPopVisible = true
        this.$nextTick(() => {
          this.$refs.jxPop.init()
        })
      },
      callBackJxPop (userId, userName) {
        this.dataForm.teacherId = userId
        this.dataForm.teacherName = userName
      },
      callBackjxPopForAdd (userId, userName) {
        //  callBackJxPop
        this.addDataForm.lectuerId = userId
        this.addDataForm.lectuerName = userName
      },
      // 选择教室弹窗
      selectClassRoomHandle () {
        this.classRoomPopVisiable = true
        this.$nextTick(() => {
          this.$refs.classRoomPop.init()
        })
      },
      callBackClassRoomPop (croomId, croomName) {
        this.dataForm.croomId = croomId
        this.dataForm.croomName = croomName
      },
      callBackClassRoomAddPop (croomId, croomName) {
        this.addDataForm.croomId = croomId
        this.addDataForm.croomName = croomName
      },
      // 教辅老师弹窗
      selectTutorTeacherHandle () {
        this.jfTeacherPopVisible = true
        this.$nextTick(() => {
          this.$refs.jfTeacherPop.init()
        })
      },
      // 教辅老师弹窗回调
      callBackJfPop (userId, userName) {
        this.dataForm.tutorTeacherId = userId
        this.dataForm.tutorTeacherName = userName
      },
      // 选择时点弹窗
      selectTimePointHandle () {
        this.timePointPopVisible = true
        this.$nextTick(() => {
          this.$refs.timePoint.init()
        })
      },
      callBacktimePoint (wepId, wepName) {
        this.dataForm.wepName = wepName
        this.dataForm.wepId = wepId
      },
      // 教辅老师置空
      cleartutorTeacher () {
        this.dataForm.tutorTeacherId = ''
        this.dataForm.tutorTeacherName = ''
      },
      // loading () {
      //   this.dataListLoading = true
      //   loadCplanCont(this.dataForm.cplanId, this.dataForm.classDate, this.dataForm.croomId,
      //   this.dataForm.teacherId, this.dataForm.wepId,this.dataForm.tutorTeacherId).then(res => {
      //     if (res.data && res.data.code === 0) {
      //       this.dataList = res.data.data
      //     } else {
      //       this.$message.error(res.data.msg)
      //     }
      //     this.dataListLoading = false
      //   }).catch(err => {
      //     console.log(err)
      //   })
      // },
       // 下载模板操作
      downloadHandle () {
        window.open(this.$http.adornUrl('/cou/cplan/down?token=' + Vue.cookie.get('token')), '_blank')
      },
      // 上传操作
      uploadHandle () {
        this.uploadPopVisible = true
        this.$nextTick(() => {
          this.$refs.uploadPop.init()
        })
      },
      // 编辑课次事件
      addOrUpdateHandle (data, index) {
        this.handleClpanPopVisible = true
        this.$nextTick(() => {
          this.$refs.handleClpanPop.init(data, index)
        })
      },
      // // 编辑课次回调
      // callBackClassAddPop (data, index) {
      //   let _data = JSON.parse(JSON.stringify(data))
      //   this.getData = {}
      //   // 修改
      //   if (index !== -1) {
      //     this.getData = this.dataList[index]
      //   }
      //   this.getData.atteType = _data.atteType
      //   this.getData.courseContId = data.courseContId || ''
      //   this.getData.cplanContId = _data.cplanContId
      //   this.getData.cplanContName = _data.cplanContName
      //   // 新增操作的回调没有cplanId
      //   this.getData.cplanId = this.selectId
      //   this.getData.cplanOpenDate = _data.cplanOpenDate
      //   this.getData.croomId = _data.croomId
      //   this.getData.croomName = _data.croomName
      //   this.getData.ptype = _data.ptype
      //   this.getData.lectuerId = _data.lectuerId
      //   this.getData.lectuerName = _data.lectuerName
      //   this.getData.tutorTeacherId = _data.tutorTeacherId
      //   this.getData.tutorTeacherName = _data.tutorTeacherName
      //   // 新增
      //   if (index === -1) {
      //     this.dataList.push(this.getData)
      //   }
      // },
      // 编辑课次回调
      callBackClassAddPop (data, index) {
        let _data = JSON.parse(JSON.stringify(data))
        let getData = {}
        // 修改
        if (index !== -1) {
          getData = this.dataList[index]
        }
        getData.atteType = _data.atteType
        getData.courseContId = data.courseContId || ''
        getData.cplanContId = _data.cplanContId
        getData.cplanContName = _data.cplanContName
        // 新增操作的回调没有cplanId
        getData.cplanId = this.selectId
        getData.cplanOpenDate = _data.cplanOpenDate
        getData.croomId = _data.croomId
        getData.croomName = _data.croomName
        getData.ptype = _data.ptype
        getData.lectuerId = _data.lectuerId
        getData.lectuerName = _data.lectuerName
        getData.tutorTeacherId = _data.tutorTeacherId
        getData.tutorTeacherName = _data.tutorTeacherName
        // 新增
        if (index === -1) {
          if(this.dataList == null){
            this.dataList = []
          } 
          this.dataList.push(getData)
          

          // if(this.dataList == null){
          //   this.dataList = getData
          // } else {
          //   this.dataList.push(getData)
          // }
          
        }
      },
      deleteHandle (index) {
        this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dataList.splice(index, 1)
        }).catch(err => {
          console.log(err)
        })
      },
      dateFormatter (row, column, cellValue) {
        return cellValue ? cellValue.substring(0, 10) : '-'
      },
      addCplanDataFormSubmit () {
        this.loadBtn = true
        cplanContSave({
          'cplanId': this.dataForm.cplanId,
          'courseId': this.dataForm.courseId,
          'cplanName': this.dataForm.cplanName,
          'cpalnStatus': this.dataForm.cpalnStatus,
          'schoolId': this.dataForm.schoolId,
          'classId': this.dataForm.classId,
          'checkTeacher': this.dataForm.checkTeacher,
          'checkRoom': this.dataForm.checkRoom,
          // 'checkTeacher': this.dataForm.checkTutorTeacher,
          'checkTutorTeacher': this.dataForm.checkTutorTeacher,
          'couCplanContEntityList': this.dataList
        }).then(res => {
          if (res.data && res.data.code === 0) {
            this.loadBtn = false
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          } else {
            this.$message.error(res.data.msg)
            this.loadBtn = false
          }
          // console.log(res)
        }).catch(err => {
          console.log(err)
          this.loadBtn = false
        })
      },
      // 导入的回调数据
      callbackAddData (data) {
        var tempData = data[0].response.data
        if(this.dataList == null){
          for(var i in tempData){
            tempData[i].cplanId = this.selectId
            this.dataList = tempData
          }
        } else {
          for(var i in tempData){
            tempData[i].cplanId = this.selectId
              this.dataList.push(tempData[i])
            }
        }
        
      }
      // addTest () {
      //   let len = this.dataList.length
      //   let getData = {}
      //   getData.atteType = 1
      //   // this.getData.courseContId = data.courseContId || ''
      //   getData.cplanContId = ''
      //   getData.cplanContName = 'cplanContName' + len
      //   // 新增操作的回调没有cplanId
      //   getData.cplanId = this.selectId
      //   getData.cplanOpenDate = '2018-11-11'
      //   getData.croomId = 1
      //   getData.croomName = 'croomName'+len
      //   getData.ptype = 1
      //   getData.lectuerId = 1
      //   getData.lectuerName = 'lectuerName'+len
      //   getData.tutorTeacherId = 1
      //   getData.tutorTeacherName = 'tutorTeacherName'+len
      //   this.dataList.push(getData)
      // },
      // updateRow (index) {
      //   let getData = this.dataList[index]
      //   getData.atteType = getData.atteType
      //   // this.getData.courseContId = data.courseContId || ''
      //   getData.cplanContId = getData.cplanContId
      //   getData.cplanContName = getData.cplanContName + '_a'
      //   // 新增操作的回调没有cplanId
      //   getData.cplanId = this.selectId
      //   getData.cplanOpenDate = getData.cplanOpenDate
      //   getData.croomId = getData.croomId
      //   getData.croomName = getData.croomName + '_a'
      //   getData.ptype = getData.ptype
      //   getData.lectuerId = getData.lectuerId
      //   getData.lectuerName = getData.lectuerName + '_a'
      //   getData.tutorTeacherId = getData.tutorTeacherId
      //   getData.tutorTeacherName = getData.tutorTeacherName + '_a'
      // }
    }
  }
</script>

<template>
  <el-dialog
    :title="!this.selectCplanId ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="名称" prop="cplanName">
            <el-input v-model="dataForm.cplanName" placeholder="名称" autofocus="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!-- <el-form-item label="校区" prop="schoolName">
            <el-input v-model="dataForm.schoolName" placeholder="点击选择校区" readonly @click.native="selectSchoolHandle()" prefix-icon="el-icon-search" >
            </el-input>
          </el-form-item> -->
          <el-form-item label="校区" prop="schoolId">
            <school-select v-model="dataForm.schoolId"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <!-- <el-form-item label="科目" prop="courseName">
            <el-input v-model="dataForm.courseName" placeholder="点击选择科目" readonly @click.native="selectCourseHandle()" prefix-icon="el-icon-search" >
            </el-input>
          </el-form-item> -->
          <el-form-item label="科目" prop="courseId">
            <courseSelect v-model="dataForm.courseId"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!-- <el-form-item label="教务" prop="liveTeacherName">
            <el-input v-model="dataForm.liveTeacherName" placeholder="点击选择教务老师" readonly @click.native="selectTeacherHandle()" prefix-icon="el-icon-search" >
            </el-input>
          </el-form-item> -->
          <el-form-item label="教务老师" prop="liveTeacherId">
            <jwTeacherSelect v-model="dataForm.liveTeacherId"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="状态" prop="cpalnStatus">
            <el-radio v-model="dataForm.cpalnStatus" :label="1" border>正常</el-radio>
            <el-radio v-model="dataForm.cpalnStatus" :label="0" border>禁用</el-radio>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>

    <!-- 弹窗 -->
    <school-pop v-if="schoolPopVisible" ref="schoolPop" @school-pop-event="callBackSchoolPop"></school-pop>

    <!-- 讲师弹窗 -->
    <jwPop ref="jwPop" v-if="jwTeacherPopVisible" @jw-pop-event="callBackJwPop"></jwPop>

    <coursePop ref="coursePop" v-if="coursePopVisiable" @classType-pop-event="callBackCoursePop"></coursePop>


  </el-dialog>
</template>

<script>
  import { cplanInfo } from '@/api/cplan'
  // import schoolPop from '@/views/common-pop/school-pop'
  import schoolSelect from '@/views/common-select/school-select'
  import jwPop from '@/views/common-pop/jw-teacher-pop'
  import coursePop from '@/views/common-pop/basic-course-pop'
  import courseSelect from '@/views/common-select/subject-select'
  import jwTeacherSelect from '@/views/common-select/jw-teacher-select'
  import { cplanSave, cplanUpdate } from '@/api/cplan'

  export default {
    data () {
      return {
        visible: false,
        roleList: [],
        schoolPopVisible: false,
        jwTeacherPopVisible: false,
        coursePopVisiable: false,
        classPopVisiable: false,
        dataForm: {
          id: 0,
          cpalnStatus: 1,
          courseName: '',
          courseId: '',
          classTeacher: '',
          schoolName: '',
          classDate: new Date(),
          classStatus: 1,
          schoolId: '',
          liveTeacherName: '',
          liveTeacherId: '',
          cplanId: '',
          cplanName: ''
        },
        sublist: [],
        jxTeacherList: [],
        selectCplanId: '',
        dataRule: {
          cplanName: [
            { required: true, message: '名称不能为空', trigger: 'change' }
          ],
          schoolName: [
            { required: true, message: '校区不能为空', trigger: 'change' }
          ],
          courseName: [
            { required: true, message: '课程科目不能为空', trigger: 'change' }
          ],
          liveTeacherName: [
            { required: true, message: '教务老师不能为空', trigger: 'change' }
          ]
        }
      }
    },
    components: {
      // schoolPop, 
      jwPop, 
      coursePop, 
      schoolSelect,
      courseSelect,
      jwTeacherSelect
    },
    methods: {
      init (id) {
        this.visible = true
        this.selectCplanId = id || 0
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        if (this.selectCplanId) {
          cplanInfo(this.selectCplanId).then(res => {
            if (res.data && res.data.code === 0) {
              this.dataForm = res.data.data
            } else {
              this.$message.error(res.data.msg)
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
        }
      },
      // getSubject(data) {
      //   this.sublist.forEach(item => {
      //     if(item.courseId == data){
      //       this.dataForm.courseName = item.courseName,
      //       this.dataForm.courseId = item.courseId
      //     }
      //   });
      // },
      // getSchool (data) {

      // },
      // getSublist () {
      //   Course.list(1,100).then(res => {
      //     if(res.data && res.data.code === 0){
      //       // console.log(res)
      //       this.sublist = res.data.data.list
      //     }else{
      //       this.dataList = []
      //     }
      //   })
      // },
      // getJxTeacherList () {
      //   jwTeacherList(1,100).then(res => {
      //     if(res.data && res.data.code === 0){
      //       // console.log(res)
      //       this.jxTeacherList = res.data.data.list
      //     }else{
      //       this.dataList = []
      //     }
            
      //   })
      // },
      // 校区弹窗
      // selectSchoolHandle () {
      //   this.schoolPopVisible = true
      //   this.$nextTick(() => {
      //     this.$refs.schoolPop.init()
      //   })
      // },
      // // 校区弹窗回调事件
      // callBackSchoolPop (schoolId, schoolName, schoolCode) {
      //   this.dataForm.schoolName = schoolName
      //   this.dataForm.schoolId = schoolId
      // },
      // 教务老师弹窗
      selectTeacherHandle () {
        this.jwTeacherPopVisible = true
        this.$nextTick(() => {
          this.$refs.jwPop.init()
        })
      },
      callBackJwPop (userId, username) {
        this.dataForm.liveTeacherName = username
        this.dataForm.liveTeacherId = userId
      },
      // 选择课程科目弹窗
      selectCourseHandle () {
        this.coursePopVisiable = true
        this.$nextTick(() => {
          this.$refs.coursePop.init()
        })
      },
      callBackCoursePop (courseId, courseName) {
        this.dataForm.courseName = courseName
        this.dataForm.courseId = courseId
      },
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (!this.selectCplanId) {
              cplanSave({
                'courseId': this.dataForm.courseId,
                'cplanName': this.dataForm.cplanName,
                'cpalnStatus': this.dataForm.cpalnStatus,
                'schoolId': this.dataForm.schoolId,
                'liveTeacherId': this.dataForm.liveTeacherId
              }).then(res => {
                if (res.data && res.data.code === 0) {
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
                }
              })
            } else {
              cplanUpdate({
                'cplanId': this.dataForm.cplanId,
                'courseId': this.dataForm.courseId,
                'courseName': this.dataForm.courseName,
                'cplanName': this.dataForm.cplanName,
                'cpalnStatus': this.dataForm.cpalnStatus,
                'schoolId': this.dataForm.schoolId,
                'schoolName': this.dataForm.schoolName,
                'liveTeacherId': this.dataForm.liveTeacherId
              }).then(res => {
                if (res.data && res.data.code === 0) {
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
                }
              })
            }
          }
        })
      }
    }
  }
</script>

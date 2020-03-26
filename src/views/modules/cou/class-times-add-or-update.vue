<template>
  <el-dialog :title="this.selectIndex == -1 ? '新增' : '编辑'" :close-on-click-modal="false" :visible.sync="visible" append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
        <el-form-item label="课次名称" prop="cplanContName">
            <el-input v-model="dataForm.cplanContName" placeholder="课次名称" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="日期" prop="cplanOpenDate">
            <el-date-picker v-model="dataForm.cplanOpenDate" type="date" value-format="yyyy-MM-dd HH:hh:ss" placeholder="请选择日期"/>
        </el-form-item>
        <el-form-item label="时点" prop="ptype">
            <el-radio-group v-model="dataForm.ptype">
            <el-radio :label="1">上午</el-radio>
            <el-radio :label="2">下午</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="讲师" prop="lectuerName">
            <el-input v-model="dataForm.lectuerName" placeholder="点击选择讲师" readonly @click.native="selectTeacherHandle()" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="教辅老师" prop="tutorTeacherName">
            <el-input v-model="dataForm.tutorTeacherName" placeholder="点击选择教辅老师" readonly @click.native="selectTutorTeacherHandle()" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="教室" prop="croomName">
            <el-input v-model="dataForm.croomName" placeholder="点击选择教室" readonly @click.native="selectClassRoomHandle()" prefix-icon="el-icon-search"></el-input>
        </el-form-item>

        <el-form-item label="是否考勤" size="mini" prop="atteType">
            <el-radio-group v-model="dataForm.atteType">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
            </el-radio-group>
        </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="cancleHandle()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>

    <!-- 讲师弹窗 -->
    <jxPop ref="jxPop" v-if="jxPopVisible" @jx-pop-event="callBackJxPop"></jxPop>
    <!-- 教辅老师弹窗 -->
    <jfPop ref="jfPop" v-if="jfPopVisible" @jx-pop-event="callBackJfPop"></jfPop>
    <!-- 教室弹窗 -->
    <classRoomPop ref="classRoomPop" v-if="classRoomPopVisiable" @classRoom-pop-event="callBackClassRoomPop"></classRoomPop>

  </el-dialog>
</template>

<script>
  import {classTypeInfo, classTypeSave, classTypeUpdate} from '@/api/classType'
  import jxPop from '@/views/common-pop/jx-teacher-pop'
  import jfPop from '@/views/common-pop/jx-teacher-pop'
  import classRoomPop from '@/views/common-pop/class-room-pop'

  export default {
    data () {
      return {
        visible: false,
        roleList: [],
        dataForm: {
          atteType: 1,
          cplanContId: '',
          cplanContName: '',
          cplanOpenDate: '',
          croomId: '',
          croomName: '',
          ptype: 1,
          lectuerId: '',
          lectuerName: '',
          tutorTeacherId: '',
          tutorTeacherName: ''
        },
        selectData: [],
        selectIndex: '',
        jxPopVisible: false,
        jfPopVisible: false,
        classRoomPopVisiable: false,
        dataRule: {
          cplanContName: [
            {required: true, message: '科目名称不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    components: {
      classRoomPop, jxPop, jfPop
    },
    activated () {
    },
    methods: {
      init (data, index) {
        this.resetForm()
        if (data === undefined) {
          this.visible = true
          this.selectIndex = -1
        } else {
          let _data = JSON.parse(JSON.stringify(data))
          this.visible = true
          this.selectIndex = index
          this.dataForm = _data
          this.dataForm.cplanContName = _data.cplanContName
          this.dataForm.atteType = _data.atteType
          this.dataForm.cplanContId = _data.cplanContId
          this.dataForm.cplanOpenDate = _data.cplanOpenDate
          this.dataForm.croomId = _data.croomId
          this.dataForm.croomName = _data.croomName
          this.dataForm.ptype = _data.ptype
          this.dataForm.lectuerId = _data.lectuerId
          this.dataForm.lectuerName = _data.lectuerName
          this.dataForm.tutorTeacherId = _data.tutorTeacherId
          this.dataForm.tutorTeacherName = _data.tutorTeacherName
        }
      },
      resetForm () {
        this.dataForm.cplanContName = ''
        this.dataForm.atteType = 1
        this.dataForm.cplanContId = ''
        this.dataForm.cplanOpenDate = ''
        this.dataForm.croomId = ''
        this.dataForm.croomName = ''
        this.dataForm.ptype = 1
        this.dataForm.lectuerId = ''
        this.dataForm.lectuerName = ''
        this.dataForm.tutorTeacherId = ''
        this.dataForm.tutorTeacherName = ''
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
      // 讲师弹窗
      selectTeacherHandle () {
        this.jxPopVisible = true
        this.$nextTick(() => {
          this.$refs.jxPop.init()
        })
      },
      callBackJxPop (userId, userName) {
        this.dataForm.lectuerId = userId
        this.dataForm.lectuerName = userName
      },
      // 教辅老师弹窗
      selectTutorTeacherHandle () {
        this.jfPopVisible = true
        this.$nextTick(() => {
          this.$refs.jfPop.init()
        })
      },
      callBackJfPop (userId, userName) {
        this.dataForm.tutorTeacherId = userId
        this.dataForm.tutorTeacherName = userName
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$emit('classAdd-pop-event', this.dataForm, this.selectIndex)
            this.visible = false
          }
        })
      },
      // 取消
      cancleHandle () {
        this.visible = false
      }
    }
  }
</script>

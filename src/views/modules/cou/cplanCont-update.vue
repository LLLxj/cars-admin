<template>
  <el-dialog title="编辑" :close-on-click-modal="false" :visible.sync="visible">
      <el-form :model="dataForm" ref="dataForm" label-width="80px">

        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="cplanContName">
              <el-input v-model="dataForm.cplanContName" placeholder="课次名称" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教室" prop="croomName">
              <el-input v-model="dataForm.croomName" placeholder="点击选择教室" readonly @click.native="selectClassRoom()" prefix-icon="el-icon-search"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="讲师" prop="lectuerName">
              <el-input v-model="dataForm.lectuerName" placeholder="点击选择讲师" readonly @click.native="selectTeacher(1)" prefix-icon="el-icon-search"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="辅导" prop="tutorTeacherName">
              <el-input v-model="dataForm.tutorTeacherName" placeholder="点击选择辅导老师" readonly @click.native="selectTeacher(2)" prefix-icon="el-icon-search"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="日期" prop="cplanOpenDate">
              <el-date-picker v-model="dataForm.cplanOpenDate" type="date"  placeholder="请选择日期"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="时点" prop="ptype">
              <el-radio v-model="dataForm.ptype" :label="1" border>上午</el-radio>
              <el-radio v-model="dataForm.ptype" :label="2" border>下午</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否考勤" size="mini" prop="atteType">
              <el-radio v-model="dataForm.atteType" :label="0" border>否</el-radio>
              <el-radio v-model="dataForm.atteType" :label="1" border>是</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </span>

      <teacherPop v-if="teacherPopVisible" ref="teacherPop" @jx-pop-event="callBackTeacherPop"></teacherPop>
      <classRoomPop v-if="classRoomPopVisible" ref="classRoomPop" @classRoom-pop-event="callBackClassPop"></classRoomPop>
    </el-dialog>


</template>

<script>
  import {cplanInfo, cplanUpdate} from '@/api/cplanCont'
  import teacherPop from '@/views/common-pop/jx-teacher-pop'
  import classRoomPop from '@/views/common-pop/class-room-pop'

  export default {
    data () {
      return {
        visible: false,
        roleList: [],
        index: '',
        dataForm: {
          cplanContId: '',
          cplanContName: '',
          cplanOpenDate: '',
          ptype: '',
          lectuerName: '',
          croomName: '',
          atteType: '',
          croomId: '',
          lectuerId: '',
          tutorTeacherId: '',
          tutorTeacherName: ''
        },
        teacherType: null,
        teacherPopVisible: false,
        classRoomPopVisible: false
      }
    },
    components: {
      teacherPop, classRoomPop
    },
    methods: {
      init (id) {
        this.index = id
        this.visible = true
        if (this.index) {
          cplanInfo(this.index).then(res => {
            if(res.data && res.data.code === 0) {
              this.dataForm = res.data.data
            } else {
              this.$message.error(res.data.msg)
            }
          }).catch(err => {
            console.log(err)
          })
        }
      },
      // 讲师弹窗
      selectTeacher (teacherType) {
        this.teacherType = teacherType || 1
        this.teacherPopVisible = true
        this.$nextTick(() => {
          this.$refs.teacherPop.init()
        })
      },
      // 讲师回调事件
      callBackTeacherPop (userId, username) {
        switch (this.teacherType) {
          case 1:
            this.dataForm.lectuerId = userId
            this.dataForm.lectuerName = username
            break
          case 2:
            this.dataForm.tutorTeacherId = userId
            this.dataForm.tutorTeacherName = username
            break
        }
      },
      // 教室弹窗
      selectClassRoom () {
        this.classRoomPopVisible = true
        this.$nextTick(() => {
          this.$refs.classRoomPop.init()
        })
      },
      // 教室回调事件
      callBackClassPop (croomId, croomName) {
        this.dataForm.croomId = croomId
        this.dataForm.croomName = croomName
      },
      dataFormSubmit () {
        cplanUpdate(this.dataForm).then(res => {
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
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>

<template>
  <el-dialog :title="!this.selectId ? '新增' : '编辑'" :close-on-click-modal="false" :visible.sync="visible" width="500px">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item label="课室" prop="croomName">
        <el-input v-model="dataForm.croomName" placeholder="课室名称" maxlength="50"></el-input>
      </el-form-item>
      <!--<el-form-item label="校区" prop="schoolName">
        <el-input v-model="dataForm.schoolId" placeholder="点击选择校区" readonly @click.native="selectSchoolHandle()"
                  prefix-icon="el-icon-search">
        </el-input>
      </el-form-item>-->
      <el-form-item label="校区" prop="schoolId">
        <school-select v-model="dataForm.schoolId"/>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="croomStatus">
        <el-radio-group v-model="dataForm.croomStatus">
          <el-radio :label="0" border>禁用</el-radio>
          <el-radio :label="1" border>正常</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>

    <!-- 弹窗 -->
    <school-pop v-if="schoolPopVisible" ref="schoolPop" @school-pop-event="callBackSchoolPop"></school-pop>

  </el-dialog>
</template>

<script>
  import {classRoomInfo, classRoomSave, classRoomUpdate} from '@/api/classroom'
  // import schoolPop from '../../common-pop/school-pop'
  import schoolSelect from '../../common-select/school-select'

  export default {
    data () {
      return {
        visible: false,
        roleList: [],
        value: '',
        schoolPopVisible: false,
        jxTeacherPopVisible: false,
        selectId: '',
        dataForm: {
          schoolName: '',
          croomStatus: 1,
          croomName: '',
          schoolId: null,
          croomId: ''
        },
        dataRule: {
          croomName: [
            {required: true, message: '课室不能为空', trigger: 'blur'}
          ],
          schoolId: [
            {required: true, message: '校区不能为空', trigger: 'change'}
          ]
        }
      }
    },
    components: {
      // schoolPop,
      schoolSelect
    },
    methods: {
      init (id) {
        this.visible = true
        this.selectId = id || 0
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        if (this.selectId) {
          classRoomInfo(this.selectId).then(res => {
            if(res.data && res.data.code === 0){
              this.dataForm = res.data.cosCroomEntity
            // this.dataForm.croomName = res.data.cosCroomEntity.croomName
            // this.dataForm.schoolName = res.data.cosCroomEntity.schoolName
            // this.dataForm.schoolId = res.data.cosCroomEntity.schoolId
            // this.dataForm.croomStatus = res.data.cosCroomEntity.croomStatus
            // this.dataForm.croomId = res.data.cosCroomEntity.croomId
            } else {
              this.$message.error(res.data.msg)
            }
          }).catch(err => {
            console.log(err)
          })
        }
      },
      // // 校区弹窗
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
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (this.selectId) {
              classRoomUpdate(this.dataForm).then(res => {
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
              classRoomSave(this.dataForm).then(res => {
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

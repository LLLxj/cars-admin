<template>
  <el-dialog title="编辑" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="考勤状态" prop="attendType">
        <el-radio-group v-model="dataForm.attendType">
          <el-radio :label="0">未考勤</el-radio>
          <el-radio :label="1">缺勤</el-radio>
          <el-radio :label="2">请假</el-radio>
          <el-radio :label="3">休学</el-radio>
          <el-radio :label="20">出勤</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="dataForm.remark" maxlength="50" class="box-remark"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" v-if="isAuth('cou:attend:update')"  @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { getAttendDetail, updateAttend } from '@/api/attend'
  import { parseTime } from '@/utils'

  export default {
    data () {
      return {
        visible: false,
        roleList: [],
        dataForm: {
          attendType: '',
          remark: ''
        },
      }
    },
    methods: {
      init (data) {
        this.selectStuId = data.stuId
        this.selectCplanContId = data.cplanContId
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        this.getDetainInfo()
      },
      getDetainInfo () {
          getAttendDetail(this.selectCplanContId,this.selectStuId).then(res => {
            if(res.data && res.data.code === 0){
              this.dataForm.attendType = res.data.data.attendType
              this.dataForm.remark = res.data.data.remark
            } else {
              this.$message.error(this.data.msg)
            }
          })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            updateAttend({
              'stuId': this.selectStuId,
              'cplanContId': this.selectCplanContId,
              'attendType': this.dataForm.attendType,
              'remark': this.dataForm.remark
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
        })
      }
    }
  }
</script>

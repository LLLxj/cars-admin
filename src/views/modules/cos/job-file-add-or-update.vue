<template>
  <el-dialog
    :title="!this.selectJobId ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="职位名称" prop="jobName">
        <el-input v-model="dataForm.jobName" maxlength="20"  placeholder="请输入职位名称"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {jobInfo, jobSave, jobUpdate} from '@/api/jobFiles'

  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          jobId: '',
          jobName: ''
        },
        selectJobId: '',
        dataRule: {
          jobName: [
            {required: true, message: '职位不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.visible = true
        this.selectJobId = id || 0
        if (this.selectJobId) {
          jobInfo(this.selectJobId).then(res => {
            if (res.data && res.data.code === 0) {
              this.dataForm.jobId = res.data.cosJobEntity.jobId
              this.dataForm.jobName = res.data.cosJobEntity.jobName
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (this.selectJobId) {
              jobUpdate(this.dataForm).then(res => {
                if (res.data && res.data.code === 0) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.visible = false
                      this.$refs.dataForm.resetFields()
                      this.$emit('refreshDataList')
                    }
                  })
                } else {
                  this.$message.error(res.data.msg)
                }
              })
            } else {
              jobSave(this.dataForm).then(res => {
                if (res.data && res.data.code === 0) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.visible = false
                      this.$refs.dataForm.resetFields()
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

<template>
  <el-dialog :title="!this.dataForm.wepId? '新增' : '编辑'" :close-on-click-modal="false" width="500px"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="时点名称" prop="wepName">
        <el-input v-model="dataForm.wepName" maxlength="20"  placeholder="请输入时点名称"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { wepInfo, wepInfoSave, wepInfoUpdate } from '@/api/wep'
  export default {
    data () {
      return {
        visible: false,
        roleList: [],
        dataForm: {
          wepName:'',
          wepId:''
        },
        dataRule: {
          wepName: [
            { required: true, message: '时点不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.wepId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        if(this.dataForm.wepId){
          wepInfo(this.dataForm.wepId).then(res => {
            if(res.data && res.data.code === 0){
              this.dataForm.wepName = res.data.wepName
            } else {
              this.$message.error(res.data.msg)
            }
            
          }).catch(err => {
            console.log(err)
          })
        }else{

        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if(this.dataForm.wepId){
              wepInfoUpdate(this.dataForm).then(res => {
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
            }else{
              wepInfoSave(this.dataForm).then(res => {
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
                console.log()
              })
            }
            // this.$http({
            //   url: this.$http.adornUrl(`/cos/job/${!this.dataForm.id  ? 'save' : 'update'}`),
            //   method: 'post',
            //   data: this.$http.adornData({
            //     'jobId': this.dataForm.jobId,
            //     // creatorId暂时设置
            //     'creatorId': 1,
            //     'jobName': this.dataForm.jobName,
            //   })
            // }).then(({data}) => {
            //     // console.log(data)
            //   if (data && data.code === 0) {
            //     this.$message({
            //       message: '操作成功',
            //       type: 'success',
            //       duration: 1500,
            //       onClose: () => {
            //         this.visible = false
            //         this.$emit('refreshDataList')
            //       }
            //     })
            //   } else {
            //     this.$message.error(data.msg)
            //   }
            // })
          }
        })
      }
    }
  }
</script>

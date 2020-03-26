<template>
  <el-dialog
    title="上传文件"
    :close-on-click-modal="false"
    @close="closeHandle"
    :visible.sync="visible" append-to-body>
    <el-upload
      drag
      :action="url"
      :before-upload="beforeUploadHandle"
      :on-success="successHandle"
      multiple
      :file-list="fileList"
      style="text-align: center;">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只支持Excel文件！</div>
    </el-upload>
  </el-dialog>
</template>

<script>
  import { getToken } from '@/utils/userInfoUtil'
  export default {
    data () {
      return {
        visible: false,
        url: '',
        num: 0,
        successNum: 0,
        fileList: []
      }
    },
    methods: {
      init () {
        const token = getToken()
        this.url = this.$http.adornUrl(`/cou/cplan/upload?token=` + token)
        this.visible = true
      },
      // 上传之前
      beforeUploadHandle (file) {
        var lastName=file.name.split('.')
        // console.log(lastName.length-1)
        if (lastName[lastName.length-1] !== 'xls' && lastName[lastName.length-1] !== 'xlsx' && lastName[lastName.length-1] !== 'xlt') {
          this.$message.error('只支持Excel文件！')
          return false
        }
        this.num++
      },
      // 上传成功
      successHandle (response, file, fileList) {
        this.fileList = fileList
        // console.log(this.fileList)
        this.successNum++
        if (response && response.code === 0) {
          if (this.num === this.successNum) {
            this.$confirm('操作成功, 是否继续操作?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              // this.$message({
              //   message: response.msg,
              //   type: 'success',
              //   duration: 1500,
              //   onClose: () => {
              //     this.visible = false
              //   }
              // })
              this.$notify({
                dangerouslyUseHTMLString: true,
                title: '成功',
                message: response.msg,
                duration: 0,
                type: 'success'
              })
              this.$emit('get-import-data', this.fileList)
            }).catch(() => {
              this.visible = false
            })
          }
        } else {
          this.$message.error(response.msg)
        }
      },
      // 弹窗关闭时
      closeHandle () {
        // console.log(1)
        this.fileList = []
        // this.$emit('refreshDataList')
      }

    }
  }
</script>

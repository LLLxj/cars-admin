<template>
  <el-dialog
    :title="!id ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="cancle">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-form-item label="车辆类型名称" prop="couModelName">
        <el-input v-model="dataForm.couModelName" placeholder="请输入车辆类型名称"></el-input>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="logo" prop="image">
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="imageUploadSuccess"
              :before-upload="beforeAvatarUpload"
              :headers="myHeaders"
              :accept="'.jpg, .png'">
              <el-image v-if="dataForm.image" :src="dataForm.image" alt="" lazy style="width:80px">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancle()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { isMobile, removeBlank } from '@/utils/validate'
  import Models from '@/api/brand/model'
  import { getToken } from '@/utils/userInfoUtil'
  export default {
    data () {
      var removeSpace = (rule, value, callback) => {
        this.dataForm.couModelName = removeBlank(value)
        callback()
      }
      var validateMobile = (rule, value, callback) => {
        if (!isMobile(value)) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        uploadUrl: '/apiPro/cou/wares/model/upload/image',
        myHeaders: {
          token: getToken()
        },
        dataForm: {
          couModelId: '',
          couModelName: '',
          image: '',
        },
        id: '',
        dataRule: {
          couModelName: [
            { required: true, message: '车辆类型名称不能为空', trigger: 'blur' },
            { validator: removeSpace, trigger: 'blur'}
          ]
        }
      }
    },
    components: {
    },
    watch: {
    },
    methods: {
      init (id) {
        this.id = id
        this.dataForm.couModelId = id
        this.visible = true
        if(id) {
          this.setData(id)
        } 
      },
      setData(data) {
        Models.info(data).then(({data}) => {
          if (data.code === 0) {
            this.dataForm = data.data
          }else {
            this.$message.error(data.msg)
          }
        }).catch(err => {
          console.log(err)
          this.$message.error(data.msg)
        })
      },
      resetForm() {
        this.$refs['dataForm'].resetFields()
      },
      cancle () {
        this.visible = false
        this.resetForm()
      },
      // 单图上传 成功回调
      imageUploadSuccess(res, file) {
        if (res.code === 0) {
          this.dataForm.image = res.data.url
        } else {
          this.$message(res.msg)
        }
      },
       // 上传图片 格式和大小校验
      beforeAvatarUpload(file) {
        const isImage = file.type === 'image/jpeg' || file.type === 'image/gif' || file.type === 'image/jpg' || file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isImage) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isImage && isLt2M
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (!this.id) {
              Models.save(this.dataForm).then(({data}) => {
                if (data && data.code === 0) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.visible = false
                      this.resetForm()
                      this.$emit('refreshDataList')
                    }
                  })
                } else {
                  this.$message.error(data.msg)
                }
              }).catch(err => {
                console.log(err)
                this.$message.error(err)
              })
            } else {
              Models.update(this.dataForm).then(({data}) => {
                if (data && data.code === 0) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.visible = false
                      this.resetForm()
                      this.$emit('refreshDataList')
                    }
                  })
                } else {
                  this.$message.error(data.msg)
                }
              }).catch(err => {
                console.log(err)
                this.$message.error(err)
              })
            }
          }
        })
      }
    }
  }
</script>
<style>
  .el-image img {
    width:100%;
  }
</style>

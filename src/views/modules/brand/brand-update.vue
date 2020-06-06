<template>
  <el-dialog
    :title="!id ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="cancle">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-form-item label="品牌名称" prop="couBrandName">
        <el-input v-model="dataForm.couBrandName" placeholder="请输入品牌名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌首字母" prop="firstLetter">
        <el-input v-model="dataForm.firstLetter" placeholder="请输入品牌首字母"></el-input>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="logo" prop="image">
            <el-upload
              class="avatar-uploader"
              :action="GLOBAL.UPLOAD_URL"
              :show-file-list="false"
              :on-success="imageUploadSuccess"
              :before-upload="beforeAvatarUpload"
              :headers="myHeaders">
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
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="dataForm.sort" controls-position="right" :min="0" label="排序号"></el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancle()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { isMobile, removeBlank } from '@/utils/validate'
  import Brand from '@/api/brand/brand'
  import { getToken } from '@/utils/userInfoUtil'
  export default {
    data () {
      var removeSpace = (rule, value, callback) => {
        this.dataForm.couBrandName = removeBlank(value)
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
       
        myHeaders: {
          token: getToken()
        },
        dataForm: {
          couBrandId: '',
          couBrandName: '',
          image: '',
          firstLetter: '',
          sort: ''
        },
        id: '',
        dataRule: {
          couBrandName: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
            { validator: removeSpace, trigger: 'blur'}
          ],
          phone: [
            { required: true, message: '手机号不能为空', trigger: 'blur' },
            { validator: validateMobile, trigger: 'blur' }
          ],
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
        this.dataForm.couBrandId = id
        this.visible = true
        if(id) {
          this.setData(id)
        } 
      },
      setData(data) {
        Brand.info(data).then(({data}) => {
          if (data.code === 0) {
            this.dataForm = data.data
            console.log(this.dataForm)
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
              Brand.save(this.dataForm).then(({data}) => {
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
              Brand.update(this.dataForm).then(({data}) => {
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

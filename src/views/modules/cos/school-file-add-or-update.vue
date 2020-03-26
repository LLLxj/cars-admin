<template>
  <el-dialog :title="!this.selectId ? '新增' : '编辑'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="校区编号" prop="schoolCode">
        <el-input v-model="dataForm.schoolCode" maxlength="20"  placeholder="校区编号"></el-input>
      </el-form-item>
      <el-form-item label="校区名称" prop="schoolName">
        <el-input v-model="dataForm.schoolName" maxlength="20" placeholder="校区名称"></el-input>
      </el-form-item>
      <el-form-item label="办公电话" prop="schoolPhone">
        <el-input v-model="dataForm.schoolPhone" placeholder="办公电话"></el-input>
      </el-form-item>
      <el-form-item label="详细地址" prop="schoolAddr">
        <el-input v-model="dataForm.schoolAddr" placeholder="详细地址"></el-input>
      </el-form-item>
      <el-form-item label="校长姓名" prop="schoolHeader">
        <el-input v-model="dataForm.schoolHeader" placeholder="校长姓名"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="schoolHeaderPhone">
        <el-input v-model="dataForm.schoolHeaderPhone" placeholder="联系方式"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { isEmail, isPhone, isMobile, isUpperCase } from '@/utils/validate'
  import { schoolList, schoolInfo, schoolListSave, schoolListUpdate } from '@/api/schoolFiles'

  export default {
    data () {
      var validateEmail = (rule, value, callback) => {
        if (!isEmail(value)) {
          callback(new Error('邮箱格式错误'))
        } else {
          callback()
        }
      }
      var validateMobile = (rule, value, callback) => {
        if (isMobile(value)) {
          callback()
        } else {
          callback(new Error('手机号格式错误'))
        }
      }
      var validateLowerCase = (rule, value, callback) => {
        if (!isUpperCase(value)) {
          callback(new Error('学校编码只支持大写'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        roleList: [],
        selectId:'',
        dataForm: {
          schoolAddr: '',
          schoolCode: '',
          schoolHeader: '',
          schoolHeaderPhone: '',
          schoolName: '',
          schoolPhone: '',
          schoolId:''
        },
        dataRule: {
          schoolName: [
            { required: true, message: '校区名称不能为空', trigger: 'blur' }
          ],
          schoolHeader: [
            { required: true, message: '校长姓名不能为空', trigger: 'blur' }
          ],
          schoolAddr: [
            { required: true, message: '校区地址不能为空', trigger: 'blur' }
          ],
          schoolCode: [
            { required: true, message: '校区编码不能为空', trigger: 'blur' },
            { validator: validateLowerCase, trigger: 'blur' }
          ],
          email: [
            { required: true, message: '邮箱不能为空', trigger: 'blur' },
            { validator: validateEmail, trigger: 'blur' }
          ],
          schoolHeaderPhone: [
            { required: true, message: '手机号不能为空', trigger: 'blur' },
            { validator: validateMobile, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.visible = true
        this.selectId = id || 0
         this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        if(this.selectId){
          schoolInfo(this.selectId).then(res => {
            if(res.data && res.data.code === 0){
              this.dataForm = res.data.data
            } else {
              this.$message.error(res.data.msg)
            } 
          }).catch(err => {
            console.log(err)
          })
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if(this.selectId){
              schoolListUpdate(this.dataForm).then(res => {
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
            }else{
              schoolListSave(this.dataForm).then(res => {
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

<template>
  <el-dialog
    title="详情"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="cancle">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-form-item label="客户企业名称" prop="dealStoreName">
        <el-input v-model="dataForm.userName" placeholder="请输入客户企业名称"></el-input>
      </el-form-item>
      <el-form-item label="客户职位" prop="dealUserJob">
        <el-input v-model="dataForm.dealUserJob" placeholder="请输入客户职位"></el-input>
      </el-form-item>
      <el-form-item label="客户职位" prop="sysUserName">
        <el-input v-model="dataForm.sysUserName" placeholder="请输入所属用户名称"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancle()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
  <!-- applyTime: "2020-04-09 16:25:58"
dealStoreId: 1
dealStoreName: "很好听的"
dealUserId: 1
dealUserJob: ""
dealUserName: "月魂"
examine: 2
examineTime: "2020-07-08 20:38:05"
examineUserId: 1
image: ""
sysUserId: 100002
sysUserName: "雅典娜" -->
</template>

<script>
  import { isMobile, removeBlank } from '@/utils/validate'
  import Apply from '@/api/customer/apply'
  export default {
    data () {
      var removeSpace = (rule, value, callback) => {
        this.dataForm.userName = removeBlank(value)
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
        roleList: [],
        menuList: [],
        menuListTreeProps: {
          label: 'deptName',
          children: 'children'
        },
        positionList: [],
        dataForm: {
          userId: '',
          userName: '',
          phone: '',
        },
        id: '',
        dataRule: {
          userName: [
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
        this.visible = true
        if(id) {
          this.setData(id)
        } 
      },
      setData(data) {
        Apply.info(data).then(({data}) => {
          if (data.code === 0) {
            console.log(data)
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
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (!this.id) {
              Customer.save(this.dataForm).then(({data}) => {
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
              Customer.update(this.dataForm).then(({data}) => {
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

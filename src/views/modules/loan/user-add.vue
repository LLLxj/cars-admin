<template>
  <el-dialog
    :title="!id ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="cancle">
    <el-form :model="dataForm" ref="dataForm" label-width="120px">
      <el-form-item v-if="!id" label="客户" prop="sysUserId">
        <BusinessSelect v-model="dataForm.sysUserId" />
      </el-form-item>
      <el-form-item v-if="id" label="查询条数" prop="unUsageCount">
        <el-input v-model="dataForm.unUsageCount" placeholder="请输入查询条数" clearable></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancle()">取消</el-button>
      <el-button v-if="!id && isAuth('loan:user:save')" :disabled="!dataForm.sysUserId ? true : false" type="primary" @click="dataFormSubmit()">确定</el-button>
      <el-button v-if="id && isAuth('loan:user:update')" :disabled="!dataForm.unUsageCount ? true : false" type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { isMobile, removeBlank } from '@/utils/validate'
  import Business from '@/api/product/business'
  import BusinessSelect from '@/views/common-select/all-business-select'
  import Customer from '@/api/customer/customer'
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
        dataForm: {
          sysUserId: '',
          unUsageCount: ''
        },
        id: '',
      }
    },
    components: {
      BusinessSelect
    },
    watch: {
    },
    methods: {
      init (id) {
        this.id = id
        this.visible = true
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
              Business.save({
                sysUserId: this.dataForm.sysUserId
              }).then(({data}) => {
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
              Business.update({
                loanUserId: this.id,
                unUsageCount: this.dataForm.unUsageCount
              }).then(({data}) => {
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

<template>
  <el-dialog
    title="处理中"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="cancle">
    <el-form :model="dataForm" ref="dataForm" label-width="120px">
      <el-form-item label="跟进人" prop="followUserId">
        <BusinessSelect v-model="dataForm.followUserId" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancle()">取消</el-button>
      <el-button :disabled="!dataForm.followUserId" type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { isMobile, removeBlank } from '@/utils/validate'
  import Fenqi from '@/api/customer/fenqi'
  import BusinessSelect from '@/views/common-select/business-select'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          followUserId: '',
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
      init (item) {
        console.log(item)
        this.id = item.installmentId
        console.log(this.id)
        this.visible = true
      },
      setData(data) {
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
            const obj = {
              installmentId: this.id,
              followUserId: this.dataForm.followUserId
            }
            Fenqi.processing(obj).then(({data}) => {
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
        })
      }
    }
  }
</script>

<template>
  <el-dialog
    :title="edit !== true ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="cancle">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-form-item label="退费金额" prop="refundPrice">
        <el-input-number v-model="dataForm.refundPrice" label="请输入退费金额"></el-input-number>
      </el-form-item>
			<el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="dataForm.remark" placeholder="请输入备注"></el-input>
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
  import Refund from '@/api/customer/refund'
  export default {
    data () {
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
          remark: '',
          refundPrice: '',
          dealStoreId: '',
          refundId: ''
        },
        id: '',
        dataRule: {
        },
        edit: false,
        status: '',
      }
    },
    components: {
    },
    watch: {
    },
    methods: {
      init (item, id) {
        this.visible = true
        if (item) {
          this.dataForm.dealStoreId = item.dealStoreId
        } else {
          this.edit = true
          this.setInfo(id)
        }
      },
      setInfo(data) {
        Refund.info(data).then(({data}) => {
          if (data.code === 0) {
            this.dataForm.remark = data.data.remark
            this.dataForm.refundPrice = data.data.refundPrice
            this.dataForm.dealStoreId = data.data.dealDtoreId
            this.dataForm.refundId = data.data.refundId
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
            if (this.edit) {
              Refund.update(this.dataForm).then(({data}) => {
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
              Refund.save(this.dataForm).then(({data}) => {
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

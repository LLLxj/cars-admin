<template>
  <el-dialog
    :title="edit !== true ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="cancle">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-form-item label="联系人电话" prop="contactPhone">
        <el-input v-model="dataForm.contactPhone" maxlength="11" label="请输入联系人"></el-input>
      </el-form-item>
			<el-form-item label="联系人" prop="contactName">
        <el-input v-model="dataForm.contactName" placeholder="请输入备注"></el-input>
      </el-form-item>
			<el-form-item label="性别" size="mini" prop="sex">
				<el-radio-group v-model="dataForm.sex">
					<el-radio :label="0">女</el-radio>
					<el-radio :label="1">男</el-radio>
				</el-radio-group>
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
  import Finance from '@/api/customer/finance'
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
          sex: 0,
          contactName: '',
          dealStoreId: '',
          contactPhone: ''
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
        Finance.info(data).then(({data}) => {
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
              Finance.update(this.dataForm).then(({data}) => {
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
              Finance.save(this.dataForm).then(({data}) => {
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

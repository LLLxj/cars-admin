<template>
  <el-dialog
    title="审核"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="cancle">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
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
  import Product from '@/api/customer/product'
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
          dealWaresId: '',
  		    remark: ''
        },
        index: '',
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
      init (id, index) {
        this.visible = true
        this.dataForm.dealWaresId = id
        this.index = index
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
            if (this.index === 1) {
              Product.reject(this.dataForm).then(({data}) => {
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
            } else if (this.index === 2) {
							Product.manage(this.dataForm).then(({data}) => {
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
						} else if (this.index === 3) {
							Product.onLine(this.dataForm).then(({data}) => {
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
						} else if (this.index === 4) {
              Product.success(this.dataForm).then(({data}) => {
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

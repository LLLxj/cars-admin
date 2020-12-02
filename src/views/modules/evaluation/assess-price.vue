<template>
  <el-dialog
    title="评估价格"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="cancle" width="500px">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-form-item label="评估价格(万元)" prop="dealAssessPrice">
        <el-input-number v-model="dataForm.dealAssessPrice" :min="0" label="" placeholder="请输入评估价格"></el-input-number>
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
  import Assess from '@/api/customer/assess'
  export default {
    data () {
      return {
        visible: false,
        roleList: [],
        menuList: [],
        positionList: [],
        dataForm: {
          dealAssessId: '',
          dealAssessPrice: '',
        },
        id: '',
        dataRule: {
          dealAssessPrice: [
            { required: true, message: '评估价格不能为空', trigger: 'blur' },
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
        this.visible = true
        if(id) {
					this.dataForm.dealAssessId = id
        } 
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
						Assess.update(this.dataForm).then(({data}) => {
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

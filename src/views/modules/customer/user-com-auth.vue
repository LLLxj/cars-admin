<template>
  <el-dialog
    :title="edit === true ? '详情' : '企业验证'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="cancle">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-form-item label="公司名称" prop="dealStoreName">
        <el-input v-model="dataForm.dealStoreName" :disabled="edit" placeholder="请输入公司名称"></el-input>
      </el-form-item>
      <el-form-item label="客户职位" prop="dealUserJob">
        <el-input v-model="dataForm.dealUserJob" :disabled="edit" placeholder="请输入客户职位"></el-input>
      </el-form-item>
      <el-form-item label="所属用户" prop="sysUserId">
        <UserSelect v-model="dataForm.sysUserId" :disabled="edit"></UserSelect>
      </el-form-item>
			<el-form-item label="上传门面图">
        <el-upload
          :action="'/apiPro/deal/user/store/upload/image'"
          :data="{ phone: dataForm.phone }"
          :headers="myHeaders"
          :on-success="imageUploadSuccess"
          :accept="'.jpg, .png'"
          list-type="picture-card"
          :on-remove="handleRemove"
          :disabled="edit">
          <i class="el-icon-plus"></i>
        </el-upload>
			</el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer" v-if="!edit">
      <el-button @click="cancle()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
	import { isMobile, removeBlank } from '@/utils/validate'
	import UserSelect from '@/views/common-select/customer/all-user-select'
	import Customer from '@/api/customer/customer'
	import ComApply from '@/api/customer/com-apply'
  import { getToken } from '@/utils/userInfoUtil'	
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
				myHeaders: {
          token: getToken()
        },
        edit: false,
        visible: false,
        roleList: [],
        menuList: [],
        menuListTreeProps: {
          label: 'deptName',
          children: 'children'
        },
        positionList: [],
        dataForm: {
					dealUserId: '',
					dealStoreName: '',
					image: '',
					dealUserJob: '',
					sysUserId: '',
					phone: ''
        },
        id: '',
        dataRule: {
          dealStoreName: [
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
			UserSelect
    },
    watch: {
    },
    methods: {
      init (id, authId, index) {
        console.log(id)
        console.log(authId)
        console.log(index)
        this.visible = true
        if (index === 2) {
          this.edit = true
          this.getAuthInfo(authId)
        } else {
          this.id = id
				  this.dataForm.dealUserId = id
          this.setData(id)
        }
      },
      resetForm() {
        this.$refs['dataForm'].resetFields()
			},
			handleRemove(file, fileList) {
        this.dataForm.image = ''
      },
			imageUploadSuccess(res, file) {
        if (res.code === 0) {
          this.dataForm.image = res.data.url
        } else {
          this.$message(res.msg)
        }
      },
      getAuthInfo(data) {
        ComApply.info(data).then(({data}) => {
          if (data.code === 0) {
            this.dataForm.dealUserId = data.data.dealUserId
            this.dataForm.dealStoreName = data.data.dealStoreName
            this.dataForm.image = data.data.image
            this.dataForm.dealUserJob = data.data.dealUserJob
            this.dataForm.sysUserId = data.data.sysUserId
            this.dataForm.phone = data.data.phone
          }else {
            this.$message.error(data.msg)
          }
        }).catch(err => {
          console.log(err)
          this.$message.error(data.msg)
        })
      },
			setData(data) {
        Customer.info(data).then(({data}) => {
          if (data.code === 0) {
            this.dataForm.phone = data.data.phone
          }else {
            this.$message.error(data.msg)
          }
        }).catch(err => {
          console.log(err)
          this.$message.error(data.msg)
        })
      },
      cancle () {
        this.visible = false
        this.resetForm()
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
						ComApply.save(this.dataForm).then(({data}) => {
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

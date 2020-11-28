<template>
  <el-dialog
    :title="!id ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="cancle">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-form-item label="商品标题" prop="dealWaresTitle">
        <el-input v-model="dataForm.dealWaresTitle" :disabled="id ? true : false" @focus="selectpRroduct" style="width:200px;" placeholder="请输入商品标题"></el-input>
      </el-form-item>
      <!-- <el-form-item label="联系电话" prop="contactPhone">
        <el-input v-model="dataForm.contactPhone" :disabled="id ? true : false" placeholder="请输入联系电话" maxlength="11"></el-input>
      </el-form-item> -->
			<el-form-item label="咨询人名称" prop="contactName">
        <el-input v-model="dataForm.contactName" :disabled="id ? true : false" placeholder="请输入联系人姓名"></el-input>
      </el-form-item>
			<!-- <el-form-item label="性别" prop="sex">
				<el-radio-group v-model="dataForm.sex">
					<el-radio :disabled="id ? true : false" :label="0">男</el-radio>
					<el-radio :disabled="id ? true : false" :label="1">女</el-radio>
				</el-radio-group>
			</el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer" v-if="!id">
      <el-button @click="cancle()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <ProductPop ref="ProductPop" v-if="ProductPopVisible" @product-pop-event="getProInfo"></ProductPop>
  </el-dialog>
</template>

<script>
  import { isMobile, removeBlank } from '@/utils/validate'
  import Fenqi from '@/api/customer/fenqi'
  import ProductPop from '@/views/common-pop/product-pop'
  export default {
    data () {
      var removeSpace = (rule, value, callback) => {
        this.dataForm.dealWaresTitle = removeBlank(value)
        callback()
      }
      var removeSpace1 = (rule, value, callback) => {
        this.dataForm.contactName = removeBlank(value)
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
        ProductPopVisible: false,
        dataForm: {
          dealWaresTitle: '',
          dealWaresId: '',
					dealUserId: '',
					// contactPhone: '',
					contactName: '',
					// sex: 0
        },
        id: '',
        dataRule: {
          dealWaresTitle: [
            { required: true, message: '商品标题不能为空', trigger: 'change' },
            // { validator: removeSpace, trigger: 'blur'}
          ],
          // contactPhone: [
          //   { required: true, message: '联系人电话不能为空', trigger: 'blur' },
          //   { validator: validateMobile, trigger: 'blur' }
					// ],
					contactName: [
            { required: true, message: '咨询人名称不能为空', trigger: 'blur' },
            { validator: removeSpace1, trigger: 'blur'}
          ],
        }
      }
    },
    components: {
        ProductPop
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
        Fenqi.info(data).then(({data}) => {
          if (data.code === 0) {
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
      selectpRroduct() {
        this.ProductPopVisible = true
        this.$nextTick(() => {
          this.$refs.ProductPop.init()
        })
      },
      getProInfo (val, item) {
        console.log(item)
        // this.dataForm = {
        //   dealWaresTitle: item.dealWaresTitle,
        //   dealWaresId: item.dealWaresId,
        //   dealUserId: item.dealUserId,
        // }
        this.dataForm.dealWaresTitle = item.dealWaresTitle
        this.dataForm.dealWaresId = item.dealWaresId
        this.dataForm.dealUserId = item.dealUserId
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const obj = {
              dealUserId: this.dataForm.dealUserId,
              dealWaresId: this.dataForm.dealWaresId,
              contactName: this.dataForm.contactName,
            }
            if (!this.id) {
              Fenqi.save(this.dataForm).then(({data}) => {
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
              Fenqi.update(this.dataForm).then(({data}) => {
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

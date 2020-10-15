<template>
  <el-dialog
    :title="index === 1 ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="cancle" width="800px">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-form-item label="请输入出售标题" prop="dealSellTitle">
        <el-input v-model="dataForm.dealSellTitle" placeholder="请输入出售标题" /> 
      </el-form-item>
      <el-form-item label="联系人" prop="contactName">
        <el-input v-model="dataForm.contactName" placeholder="请输入联系人" />
      </el-form-item>
			<el-form-item label="联系人电话" prop="contactPhone">
        <el-input v-model="dataForm.contactPhone" maxlength="11" placeholder="请输入联系人电话" />
      </el-form-item>
      <el-form-item label="选择市区">
        <CitySelect v-model="dataForm.cityAreaId"></CitySelect>
    	</el-form-item>
      <el-form-item label="选择县/区">
        <AreaSelect v-model="dataForm.countyAreaId" :disabled="!dataForm.cityAreaId" :countryId="dataForm.cityAreaId"></AreaSelect>
      </el-form-item>
			<el-form-item label="详细地址" prop="addr">
        <el-input v-model="dataForm.addr" placeholder="请输入详细地址" />
      </el-form-item>
			<el-form-item label="状态" size="mini" prop="sex">
        <el-radio-group v-model="dataForm.sex">
          <el-radio :label="0" border>先生</el-radio>
          <el-radio :label="1" border>小姐</el-radio>
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
  import Sell from '@/api/customer/sell'
  import CustomerSelect from '@/views/common-select/customer/store-com-customer'
  import BrandSelect from '@/views/common-select/brand-select'
  import SeriesSelect from '@/views/common-select/brand-series-select'
  import CitySelect from '@/views/common-select/assess/city-select'
  import AreaSelect from '@/views/common-select/assess/area-select'
  import ProductSelect from '@/views/common-select/customer/product-select'
  import ConsumeSelect from '@/views/common-select/consume-select'
  import { getToken } from '@/utils/userInfoUtil'
  export default {
    data () {
      var removeSpace = (rule, value, callback) => {
        this.dataForm.couWaresName = removeBlank(value)
        callback()
      }
      return {
        visible: false,
        myHeaders: {
          token: getToken()
				},
				index: '',
        dataForm: {
          dealSellTitle: '',
					dealAssessId: '',
					contactName: '',
					contactPhone: '',
					sex: 0,
					proAreaId: 19,
					cityAreaId: '',
					countyAreaId: '',
					addr: ''
        },
        id: '',
        dataRule: {
          dealSellTitle: [
            { required: true, message: '标题名不能为空', trigger: 'blur' },
            { validator: removeSpace, trigger: 'blur'}
          ],
          contactName: [
            { required: true, message: '联系人不能为空', trigger: 'blur'},
          ],
          contactPhone: [
            { required: true, message: '联系电话不能为空', trigger: 'blur' },
          ]
        }
      }
    },
    components: {
      BrandSelect, SeriesSelect, CitySelect, AreaSelect, ProductSelect, CustomerSelect
    },
    watch: {
    },
    methods: {
      init (id, index) {
        console.log(id, index)
				this.id = id
				this.index = index
				this.visible = true
        this.dataForm.dealAssessId = id
        if(index === 2) {
          this.setData(id)
        } 
      },
      setData(data) {
        Sell.info(data).then(({data}) => {
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
      // 单图上传 成功回调
      imageUploadSuccess(res, file) {
        if (res.code === 0) {
          this.dataForm.driveImage.image = res.data.url
        } else {
          this.$message(res.msg)
        }
      },
      handleRemove(file, fileList) {
        this.dataForm.driveImage.image = ''
      },
      getProInfo(val) {
        this.dataForm.couWaresId = val.couWaresId
        // this.dataForm.couWaresPrice = val.couWaresPrice
      },
      imageUploadSuccess1(res, file) {
        if (res.code === 0) {
          let obj = { image: '' }
          obj.image = res.data.url
          this.dataForm.waresImages.push(obj)
        } else {
          this.$message(res.msg)
        }
      },
       // 上传图片 格式和大小校验
      beforeAvatarUpload(file) {
        const isImage = file.type === 'image/jpeg' || file.type === 'image/gif' || file.type === 'image/jpg' || file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isImage) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isImage && isLt2M
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (this.index == 1) {
              Sell.save(this.dataForm).then(({data}) => {
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
              Sell.update(this.dataForm).then(({data}) => {
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

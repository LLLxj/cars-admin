<template>
  <el-dialog
    :title="!id ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="cancle" width="800px">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-form-item label="品牌名称" prop="dealSellTitle">
        <el-input v-model="dataForm.dealSellTitle" placeholder="请输入品牌名称" /> 
      </el-form-item>
      <el-form-item label="联系人" prop="contactName">
        <el-input v-model="dataForm.contactName" placeholder="请输入联系人" />
      </el-form-item>
			<el-form-item label="联系人电话" prop="contactPhone">
        <el-input v-model="dataForm.contactPhone" placeholder="请输入联系人电话" />
      </el-form-item>
  "dealAssessId": 0,
  "sex": 0,
  "proAreaId": 0,
  "cityAreaId": 0,
  "countyAreaId": 0,
  "addr": "string"
      
      <el-form-item label="选择市区">
        <CitySelect v-model="dataForm.cityAreaId"></CitySelect>
    	</el-form-item>
      <el-form-item label="选择县/区">
        <AreaSelect v-model="dataForm.countyAreaId" :disabled="!dataForm.cityAreaId" :countryId="dataForm.cityAreaId"></AreaSelect>
      </el-form-item>
			<el-form-item label="详细地址" prop="addr">
        <el-input v-model="dataForm.addr" placeholder="请输入详细地址" />
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
  import CustomerSelect from '@/views/common-select/customer/all-com-customer'
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
        dataForm: {
          couWaresId: '',
          couWaresName: '',
          couBrandId: '',
          couSeriesId: '',
          proAreaId: 19,
          cityAreaId: '',
          countyAreaId: '',
          distance: '',
          phone: '',
          registerTime: '', //上牌时间
          driveImage: { // 驾驶证

          },
          waresImages: [ // 商品照片

          ]
        },
        id: '',
        dataRule: {
          couWaresName: [
            { required: true, message: '商品名不能为空', trigger: 'blur' },
            { validator: removeSpace, trigger: 'blur'}
          ],
          couBrandId: [
            { required: true, message: '请选择所属品牌', trigger: 'blur', type: 'number' },
          ],
          couSeriesId: [
            { required: true, message: '请选择所属系列', trigger: 'blur', type: 'number' },
          ],
          couModelId: [
            { required: true, message: '请选择所属型号', trigger: 'blur', type: 'number' },
          ],
          phone: [
            { required: true, message: '请输入用户电话号码', trigger: 'blur'},
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
      init (id) {
        this.id = id
        this.visible = true
        if(id) {
          this.dataForm.couWaresId = id
          this.setData(id)
        } 
      },
      setData(data) {
        Assess.info(data).then(({data}) => {
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
            if (!this.id) {
              Assess.save(this.dataForm).then(({data}) => {
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
          }
        })
      }
    }
  }
</script>

<template>
  <el-dialog
    :title="!id ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="cancle" width="800px">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="160px">
      <el-form-item label="客户" prop="dealUserId">
        <CustomerSelect v-model="dataForm.dealUserId" @get-val="getCustomerVal"></CustomerSelect>
      </el-form-item>
      <el-form-item label="品牌名称" prop="couBrandId">
        <BrandSelect v-model="dataForm.couBrandId" placeholder="请输入品牌名称"></BrandSelect>
      </el-form-item>
      <el-form-item label="选择系列" prop="couSeriesId">
        <SeriesSelect v-model="dataForm.couSeriesId" :disabled="!dataForm.couBrandId" :couSeriesId="dataForm.couBrandId"></SeriesSelect>
      </el-form-item>
      <!-- <el-form-item label="商品名称" prop="couWaresId"> -->
      <el-form-item label="商品名称" prop="assessWaresTitle">
        <!-- <ProductSelect v-model="dataForm.couWaresId" :disabled="!dataForm.couSeriesId" :couSeriesId="dataForm.couSeriesId" @sent-pro-info="getProInfo"></ProductSelect> -->
        <el-input v-model="dataForm.assessWaresTitle" placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <el-form-item label="选择市区">
        <CitySelect v-model="dataForm.cityAreaId"></CitySelect>
    	</el-form-item>
      <el-form-item label="选择县/区">
        <AreaSelect v-model="dataForm.countyAreaId" :disabled="!dataForm.cityAreaId" :countryId="dataForm.cityAreaId"></AreaSelect>
      </el-form-item>
			<el-form-item label="行驶里程" prop="distance">
				<el-input-number v-model="dataForm.distance" :min="1" label=""></el-input-number>
      </el-form-item>
			<el-form-item label="上牌时间" prop="registerTime">
        <el-date-picker v-model="dataForm.registerTime" value-format="yyyy-MM-dd HH:mm:ss" type="date" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
			<el-form-item label="上传驾驶证（1张）" prop="driveImage">
        <el-upload
          :action="'/apiPro/deal/assess/upload/drivingImage'"
          :data="{ phone: dataForm.dealUserPhone }"
          :headers="myHeaders"
          :on-success="imageUploadSuccess"
          :accept="'.jpg, .png'"
          list-type="picture-card"
          :file-list="fileList1"
          :disabled="!dataForm.dealUserPhone"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="上传评估图片" prop="waresImages">
        <el-upload
          :action="'/apiPro/deal/assess/upload/waresImage'"
          :data="{ phone: dataForm.dealUserPhone }"
          :headers="myHeaders"
          :on-success="imageUploadSuccess1"
          :accept="'.jpg, .png'"
          list-type="picture-card"
          multiple
          :file-list="fileList2"
          :disabled="!dataForm.dealUserPhone"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
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
//   import ModelSelect from '@/views/common-select/model-select'
//   import DisMent from '@/views/common-select/disment-select'
//   import VarBoxSelect from '@/views/common-select/var-box-select'
//   import DriveStyleSelect from '@/views/common-select/drive-style-select'
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
        phone: '',
        fileList1: [],
        fileList2: [],
				driverImage: '', // 上传驾驶证路径
        dataForm: {
          couWaresId: '',
          couWaresName: '',
          assessWaresTitle: '',
          couBrandId: '',
          couSeriesId: '',
          proAreaId: 19,
          cityAreaId: '',
          countyAreaId: '',
          distance: '',
          dealUserPhone: '',
          registerTime: '', //上牌时间
          driveImage: { // 驾驶证
            image: ''
          },
          waresImages: [ // 商品照片
          ]
        },
        id: '',
        dataRule: {
          dealUserId: [
            { required: true, message: '请选择客户', trigger: 'blur', type: 'number' },
          ],
          couWaresName: [
            { required: true, message: '商品名不能为空', trigger: 'blur' },
            { validator: removeSpace, trigger: 'blur'}
          ],
          distance: [
            { required: true, message: '请输入行驶里程', trigger: 'blur' },
          ],
          registerTime: [
            { required: true, message: '请选择上牌时间', trigger: 'blur' },
          ],
          couBrandId: [
            { required: true, message: '请选择所属品牌', trigger: 'blur', type: 'number' },
          ],
          couSeriesId: [
            { required: true, message: '请选择所属系列', trigger: 'blur', type: 'number' },
          ],
          assessWaresTitle: [
            { required: true, message: '请输入评估商品名称', trigger: 'blur' },
          ],
          couModelId: [
            { required: true, message: '请选择所属车辆类型', trigger: 'blur', type: 'number' },
          ],
          driveImage: [
            { required: true, message: '请上传驾驶证', trigger: 'blur'},
          ],
          waresImages: [
            { required: true, message: '请上传评估图片', trigger: 'blur'},
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
      getCustomerVal(val) { // 选择客户回调
        // this.dataForm.dealUserId = val.dealUserId
        this.dataForm.dealUserPhone = val.dealUserPhone
      },
      setData(data) {
        Assess.info(data).then(({data}) => {
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
        this.fileList1 = []
        this.fileList2 = []
        this.dataForm.cityAreaId = ''
        this.dataForm.countyAreaId = ''
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

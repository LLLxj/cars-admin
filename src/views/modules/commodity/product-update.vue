<template>
  <el-dialog
    :title="!id ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="cancle" width="800px">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-form-item label="标题" prop="dealWaresTitle">
        <el-input v-model="dataForm.dealWaresTitle" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="contactPhone">
        <el-input v-model="dataForm.contactPhone" placeholder="请输入联系电话" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="联系人名称" prop="contactName">
        <el-input v-model="dataForm.contactName" placeholder="请输入联系人名称"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="dataForm.sex">
          <el-radio :label="0">先生</el-radio>
          <el-radio :label="1">小姐</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="产品框架号" prop="waresFrameCode">
        <el-input v-model="dataForm.waresFrameCode"></el-input>
      </el-form-item>
      <el-form-item label="品牌名称" prop="couBrandId">
        <BrandSelect v-model="dataForm.couBrandId" placeholder="请输入品牌名称"></BrandSelect>
      </el-form-item>
      <el-form-item label="选择系列" prop="couSeriesId">
        <SeriesSelect v-model="dataForm.couSeriesId" :disabled="!dataForm.couBrandId" :couSeriesId="dataForm.couBrandId"></SeriesSelect>
      </el-form-item>
      <!-- <el-form-item label="商品名称" prop="couWaresName">
        <el-input v-model="dataForm.couWaresName" placeholder="请输入商品名称"></el-input> -->
        <!-- <ProductSelect v-model="dataForm.couWaresId" :disabled="!dataForm.couSeriesId" :couSeriesId="dataForm.couSeriesId" @sent-pro-info="getProInfo"></ProductSelect> -->
      <!-- </el-form-item> -->
      <!-- <el-form-item label="厂商指导价" prop="couWaresPrice">
        <el-input-number v-model="dataForm.couWaresPrice" disabled="" :min="1" label=""></el-input-number>
      </el-form-item> -->
      <el-form-item label="选择型号" prop="couModelId">
        <ModelSelect v-model="dataForm.couModelId"></ModelSelect>
      </el-form-item>
      <el-form-item label="厂商批发价" prop="tradePrice">
        <el-input-number v-model="dataForm.tradePrice"></el-input-number>
      </el-form-item>
      <el-form-item label="厂商零售价" prop="retailPrice">
        <el-input-number v-model="dataForm.retailPrice"></el-input-number>
      </el-form-item>
       <el-form-item label="上牌时间" prop="registerTime">
        <el-date-picker v-model="dataForm.registerTime" value-format="yyyy-MM-dd HH:mm:ss" type="date" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="行驶里程" prop="distance">
        <el-input v-model="dataForm.distance"></el-input>
      </el-form-item>
      <el-form-item label="牌照ID" prop="licenseCode">
        <el-input v-model="dataForm.licenseCode"></el-input>
      </el-form-item>
      <el-form-item label="年款" prop="marketYear">
        <el-date-picker v-model="dataForm.marketYear" type="year" value-format="yyyy" placeholder="选择年" />
      </el-form-item>
      <el-form-item label="选择市区">
        <CitySelect v-model="dataForm.cityAreaId"></CitySelect>
    	</el-form-item>
      <el-form-item label="选择县/区">
        <AreaSelect v-model="dataForm.countyAreaId" :disabled="!dataForm.cityAreaId" :countryId="dataForm.cityAreaId"></AreaSelect>
      </el-form-item>
      <el-form-item label="详细地址" prop="addr">
        <el-input v-model="dataForm.addr"></el-input>
      </el-form-item>
      <el-form-item label="商品描述" prop="waresRemark">
        <el-input type="textarea" class="box-remark" v-model="dataForm.waresRemark"></el-input>
      </el-form-item>
      <el-form-item label="过户次数" prop="transferNum">
        <el-input-number v-model="dataForm.transferNum"></el-input-number>
      </el-form-item>
      <el-form-item label="是否有过户费" prop="isTransfer">
        <el-radio-group v-model="dataForm.isTransfer">
          <el-radio :label="0">无</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否有抵押" prop="isMortgage">
        <el-radio-group v-model="dataForm.isMortgage">
          <el-radio :label="0">无</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否有定期4s保养" prop="isMaintain">
        <el-radio-group v-model="dataForm.isMaintain">
          <el-radio :label="0">无</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="上传封面图">
        <el-upload
          :action="'/apiPro/deal/wares/upload/waresImage'"
          :data="{ phone: dataForm.phone }"
          :headers="myHeaders"
          :on-success="imageUploadSuccess"
          :accept="'.jpg, .png'"
          list-type="picture-card"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="上传驾驶证">
        <el-upload
          :action="'/apiPro/deal/wares/upload/drivingImage'"
          :data="{ phone: dataForm.phone }"
          :headers="myHeaders"
          :on-success="imageUploadSuccess1"
          :accept="'.jpg, .png'"
          list-type="picture-card"
          :on-remove="handleRemove1">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="上传评估图片">
        <el-upload
          :action="'/apiPro/deal/assess/upload/waresImage'"
          :data="{ phone: dataForm.phone }"
          :headers="myHeaders"
          :on-success="imageUploadSuccess2"
          :accept="'.jpg, .png'"
          list-type="picture-card"
          :on-remove="handleRemove2">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="客户" prop="dealStoreId">
        <CustomerSelect v-model="dataForm.dealStoreId"></CustomerSelect>
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
  import CustomerSelect from '@/views/common-select/customer/all-com-customer1'
  import ProductSelect from '@/views/common-select/customer/product-select'
  import BrandSelect from '@/views/common-select/brand-select'
  import SeriesSelect from '@/views/common-select/brand-series-select'
  import ModelSelect from '@/views/common-select/model-select'
  import DisMent from '@/views/common-select/disment-select'
  import VarBoxSelect from '@/views/common-select/var-box-select'
  import DriveStyleSelect from '@/views/common-select/drive-style-select'
  import ConsumeSelect from '@/views/common-select/consume-select'
  import CitySelect from '@/views/common-select/assess/city-select'
  import AreaSelect from '@/views/common-select/assess/area-select'
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
          phone: 13079244223,
          marketYear: '',
          couWaresId: '',
          couBrandId: '',
          couWaresName: '',
          couSeriesId: '',
          couModelId: '',
          couWaresPrice: '',
          waresFrameCode: '',
          contactPhone: '',
          contactName: '',
          tradePrice: '',
          retailPrice: '',
          registerTime: '',
          distance: '',
          licenseCode: '',
          proAreaId: 19,
          cityAreaId: '',
          countyAreaId: '',
          addr: '',
          waresRemark: '',
          transferNum: '',
          isTransfer: '',
          isMortgage: '',
          isMaintain: '',
          dealWaresName: '',
          coverImage: {
            image: ''
          },
          driveImage: {
            image: ''
          },
          waresImages: [],
          dealStoreId: ''
        },
        id: '',
        dataRule: {
          couWaresId: [
            { required: true, message: '商品名不能为空', trigger: 'blur' },
          ],
          couBrandId: [
            { required: true, message: '请选择所属品牌', trigger: 'blur', type: 'number' },
          ],
          couSeriesId: [
            { required: true, message: '请选择所属系列', trigger: 'blur', type: 'number' },
          ],
          couModelId: [
            { required: true, message: '请选择所属型号', trigger: 'blur', type: 'number' },
          ]
        }
      }
    },
    components: {
      BrandSelect, ModelSelect, DisMent, VarBoxSelect, DriveStyleSelect, ConsumeSelect, SeriesSelect, ProductSelect,
      CitySelect, AreaSelect, CustomerSelect
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
        Product.info(data).then(({data}) => {
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
      getProInfo(val) {
        this.dataForm.couWaresPrice = val.couWaresPrice
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
          this.dataForm.coverImage.image = res.data.url
        } else {
          this.$message(res.msg)
        }
      },
      handleRemove(file, fileList) {
        this.dataForm.coverImage.image = ''
      },
      imageUploadSuccess1(res, file) {
        if (res.code === 0) {
          this.dataForm.driveImage.image = res.data.url
        } else {
          this.$message(res.msg)
        }
      },
      handleRemove1(file, fileList) {
        this.dataForm.driveImage.image = ''
      },
      imageUploadSuccess2(res, file) {
        if (res.code === 0) {
          let obj = { image: '' }
          obj.image = res.data.url
          this.dataForm.waresImages.push(obj)
        } else {
          this.$message(res.msg)
        }
      },
      handleRemove2(file, fileList) {
        console.log(fileList)
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
        // this.dataForm.releaseAreaId = this.dataForm.proAreaId || this.dataForm.cityAreaId || this.dataForm.countyAreaId
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (!this.id) {
              Product.save(this.dataForm).then(({data}) => {
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
              Product.update(this.dataForm).then(({data}) => {
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

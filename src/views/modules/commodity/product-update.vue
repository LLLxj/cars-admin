<template>
  <el-dialog
    :title="!id ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="cancle" width="800px">
    <el-form :model="dataForm" :disabled="editStatus" :rules="dataRule" ref="dataForm" label-width="160px">
      <el-form-item label="所属客户" prop="dealStoreId">
        <CustomerSelect v-model="dataForm.dealStoreId" @get-val="getCustomerVal"></CustomerSelect>
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
      <!-- <el-form-item label="产品框架号" prop="waresFrameCode">
        <el-input v-model="dataForm.waresFrameCode"></el-input>
      </el-form-item> -->
      <el-form-item label="品牌名称" prop="couBrandId">
        <BrandSelect v-model="dataForm.couBrandId" placeholder="请输入品牌名称"></BrandSelect>
      </el-form-item>
      <el-form-item label="选择系列" prop="couSeriesId">
        <SeriesSelect v-model="dataForm.couSeriesId" :disabled="!dataForm.couBrandId" :couSeriesId="dataForm.couBrandId"></SeriesSelect>
      </el-form-item>
      <el-form-item label="出售商品标题" prop="dealWaresTitle">
        <el-input v-model="dataForm.dealWaresTitle" placeholder="请输入出售商品标题"></el-input>
      </el-form-item>
      <!-- <el-form-item label="商品名称" prop="couWaresName">
        <el-input v-model="dataForm.couWaresName" placeholder="请输入商品名称"></el-input> -->
        <!-- <ProductSelect v-model="dataForm.couWaresId" :disabled="!dataForm.couSeriesId" :couSeriesId="dataForm.couSeriesId" @sent-pro-info="getProInfo"></ProductSelect> -->
      <!-- </el-form-item> -->
      <!-- <el-form-item label="厂商指导价" prop="couWaresPrice">
        <el-input-number v-model="dataForm.couWaresPrice" disabled="" :min="1" label=""></el-input-number>
      </el-form-item> -->
      <el-form-item label="选择车辆类型" prop="couModelId">
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
      <el-form-item label="行驶里程（公里）" prop="distance">
        <el-input-number v-model="dataForm.distance"></el-input-number>
        <!-- <el-input v-model="dataForm.distance"></el-input> -->
      </el-form-item>
      <el-form-item label="牌照所在地" prop="licenseCode">
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
      <el-form-item label="上传封面图（1张）" prop="coverImage">
        <el-upload
          :action="'/apiPro/deal/wares/upload/waresImage'"
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
      <el-form-item label="上传驾驶证（1张）" prop="driveImage">
        <el-upload
          :action="'/apiPro/deal/wares/upload/drivingImage'"
          :data="{ phone: dataForm.dealUserPhone }"
          :headers="myHeaders"
          :on-success="imageUploadSuccess1"
          :accept="'.jpg, .png'"
          list-type="picture-card"
          :disabled="!dataForm.dealUserPhone"
          :file-list="fileList2"
          :on-remove="handleRemove1">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="上传商品图片" prop="waresImages">
        <el-upload
          :action="'/apiPro/deal/wares/upload/waresImage'"
          :data="{ phone: dataForm.dealUserPhone }"
          :headers="myHeaders"
          :on-success="imageUploadSuccess2"
          :accept="'.jpg, .png'"
          list-type="picture-card"
          :file-list="fileList3"
          :disabled="!dataForm.dealUserPhone"
          :on-remove="handleRemove2">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer" v-if="!editStatus">
      <el-button @click="cancle()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { isMobile, removeBlank } from '@/utils/validate'
  import Product from '@/api/customer/product'
  import CustomerSelect from '@/views/common-select/customer/store-com-customer'
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
        editStatus: false,
        visible: false,
        myHeaders: {
          token: getToken()
        },
        fileList1: [],
        fileList2: [],
        fileList3: [],
        dataForm: {
          sex: 0,
          dealUserPhone: '',
          marketYear: '',
          couWaresId: '',
          couBrandId: '',
          couWaresName: '',
          couSeriesId: '',
          couModelId: '',
          couWaresPrice: '',
          // waresFrameCode: '',
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
          isTransfer: 0,
          isMortgage: 0,
          isMaintain: 0,
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
          dealStoreId: [
            { required: true, message: '客户不能为空', trigger: 'blur' },
          ],
          dealWaresTitle: [
            { required: true, message: '出售商品标题不能为空', trigger: 'blur' },
          ],
          contactPhone: [
            { required: true, message: '联系电话不能为空', trigger: 'blur' },
          ],
          contactName: [
            { required: true, message: '联系人名称不能为空', trigger: 'blur' },
          ],
          sex: [
            { required: true, message: '请选择性别', trigger: 'blur' },
          ],
          couBrandId: [
            { required: true, message: '请选择所属品牌', trigger: 'blur', type: 'number' },
          ],
          couSeriesId: [
            { required: true, message: '请选择所属系列', trigger: 'blur', type: 'number' },
          ],
          couModelId: [
            { required: true, message: '请选择所属车辆类型', trigger: 'blur', type: 'number' },
          ],
          // waresFrameCode: [
          //   { required: true, message: '产品框架号不能为空', trigger: 'blur' },
          // ],
          tradePrice: [
            { required: true, message: '厂商批发价不能为空', trigger: 'blur' },
          ],
          retailPrice: [
            { required: true, message: '厂商零售价不能为空', trigger: 'blur' },
          ],
          registerTime: [
            { required: true, message: '上牌时间不能为空', trigger: 'blur' },
          ],
          distance: [
            { required: true, message: '行驶里程不能为空', trigger: 'blur' },
          ],
          licenseCode: [
            { required: true, message: '牌照id不能为空', trigger: 'blur' },
          ],
          marketYear: [
            { required: true, message: '年款不能为空', trigger: 'blur' },
          ],
          addr: [
            { required: true, message: '详细地址不能为空', trigger: 'blur' },
          ],
          waresRemark: [
            { required: true, message: '商品描述不能为空', trigger: 'blur' },
          ],
          transferNum: [
            { required: true, message: '', trigger: 'blur' },
          ],
          isTransfer: [
            { required: true, message: '', trigger: 'blur' },
          ],
          isMortgage: [
            { required: true, message: '', trigger: 'blur' },
          ],
          isMaintain: [
            { required: true, message: '', trigger: 'blur' },
          ],
          coverImage: [
            { required: true, message: '请上传封面图', trigger: 'blur' },
          ],
          driveImage: [
            { required: true, message: '请上传驾驶证', trigger: 'blur'},
          ],
          waresImages: [
            { required: true, message: '请上传评估图片', trigger: 'blur'}
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
      init (id, status) {
        this.id = id
        this.editStatus = status
        this.visible = true
        if(id) {
          this.dataForm.couWaresId = id
          this.setData(id)
        } 
      },
      setData(data) {
        Product.info(data).then(({data}) => {
          if (data.code === 0) {
            let tempObj = data.data
            tempObj.marketYear = tempObj.marketYear.toString()
            if (tempObj.coverImage && tempObj.coverImage.image) {
              tempObj.coverImage.url = tempObj.coverImage.image
              this.fileList1.push(tempObj.coverImage)
            }
            if (tempObj.driveImage && tempObj.driveImage.image) {
              tempObj.driveImage.url = tempObj.driveImage.image
              this.fileList2.push(tempObj.driveImage)
            }
            if (tempObj.waresImages && tempObj.waresImages.length) {
              tempObj.waresImages.forEach(item => {
                item.url = item.image
              })
              this.fileList3 = tempObj.waresImages
            }
            this.dataForm = tempObj
          }else {
            this.$message.error(data.msg)
          }
        }).catch(err => {
          console.log(err)
          this.$message.error(data.msg)
        })
      },
      getCustomerVal(val) { // 选择客户回调
        // this.dataForm.dealStoreId = val.dealStoreId
        this.dataForm.dealUserPhone = val.dealUserPhone
      },
      getProInfo(val) {
        this.dataForm.couWaresPrice = val.couWaresPrice
      },
      resetForm() {
        this.$refs['dataForm'].resetFields()
        this.dataForm.cityAreaId = ''
        this.dataForm.countyAreaId = ''
        this.dataForm.waresImages = []
        this.dataForm.coverImage = {
          image: ''
        }
        this.dataForm.driveImage = {
          image: ''
        }
        this.fileList1 = []
        this.fileList2 = []
        this.fileList3 = []
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
        const delUrl = file.response.data.url
        this.dataForm.waresImages = this.dataForm.waresImages.filter(item =>  item.image !== delUrl)
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

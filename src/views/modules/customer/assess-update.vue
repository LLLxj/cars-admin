<template>
  <el-dialog
    :title="!id ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="cancle" width="800px">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-form-item label="商品名称" prop="couWaresName">
        <el-input v-model="dataForm.couWaresName" placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌名称" prop="couBrandId">
        <BrandSelect v-model="dataForm.couBrandId" placeholder="请输入品牌名称"></BrandSelect>
      </el-form-item>
      <el-form-item label="选择系列" prop="couSeriesId">
        <SeriesSelect v-model="dataForm.couSeriesId" :disabled="!dataForm.couBrandId" :couSeriesId="dataForm.couBrandId"></SeriesSelect>
      </el-form-item>
      <el-form-item label="选择市区">
        <CitySelect v-model="dataForm.cityAreaId"></CitySelect>
    	</el-form-item>
      <el-form-item label="选择县/区">
        <AreaSelect v-model="dataForm.countryAreaId" :disabled="!dataForm.cityAreaId" :countryId="dataForm.cityAreaId"></AreaSelect>
      </el-form-item>
			<el-form-item label="行驶里程" prop="distance">
				<el-input-number v-model="dataForm.distance" :min="1" label=""></el-input-number>
      </el-form-item>
			<el-form-item label="上牌时间" prop="registerTime">
        <el-date-picker v-model="dataForm.registerTime" value-format="yyyy-MM-dd HH:mm:ss" type="date" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
			<el-form-item label="上传驾驶证">
					<el-upload
						class="avatar-uploader"
						:action="'/apiPro/deal/assess/drivingImage/' + phone"
						:show-file-list="false"
						:on-success="imageUploadSuccess"
						:before-upload="beforeAvatarUpload"
						:headers="myHeaders"
						:accept="'.jpg, .png'">
						<el-image v-if="dataForm.driveImage && dataForm.driveImage.image !== ''" :src="dataForm.driveImage.image" alt="" lazy style="width:80px">
							<div slot="error" class="image-slot">
								<i class="el-icon-picture-outline"></i>
							</div>
						</el-image>
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
      <!-- <el-form-item label="选择型号" prop="couModelId">
        <ModelSelect v-model="dataForm.couModelId"></ModelSelect>
      </el-form-item>
      <el-form-item label="厂商指导价" prop="couWaresPrice">
        <el-input-number v-model="dataForm.couWaresPrice" :min="1" label=""></el-input-number>
      </el-form-item>
      
      <el-form-item label="年款" prop="marketTime">
        <el-date-picker v-model="dataForm.marketTime" value-format="yyyy-MM-dd HH:mm:ss" type="date" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="排量" prop="disMent">
        <DisMent v-model="dataForm.disMent"></DisMent>
      </el-form-item>
      <el-form-item label="变速箱" prop="varBox">
        <VarBoxSelect v-model="dataForm.varBox"></VarBoxSelect>
      </el-form-item>
      <el-form-item label="驱动方式" prop="drive">
        <DriveStyleSelect v-model="dataForm.drive"></DriveStyleSelect>
      </el-form-item>
      <el-form-item label="油耗量" prop="consume">
        <ConsumeSelect v-model="dataForm.consume"></ConsumeSelect>
      </el-form-item> -->
    </el-form>
    <!-- {
  "couWaresName": "string",
  "couSeriesId": 0,
  "couModelId": 0,
  "couWaresPrice": "string",
  "marketYear": 0,
  "marketTime": "2020-06-10",
  "disMent": "string",
  "varBox": "string",
  "drive": "string",
  "consume": "string"
} -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancle()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { isMobile, removeBlank } from '@/utils/validate'
  import Assess from '@/api/customer/assess'
  import BrandSelect from '@/views/common-select/brand-select'
  import SeriesSelect from '@/views/common-select/brand-series-select'
  import CitySelect from '@/views/common-select/assess/city-select'
  import AreaSelect from '@/views/common-select/assess/area-select'
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
        phone: '13422356022',
				driverImage: '', // 上传驾驶证路径
//         dealAssessId (integer, optional): 评估ID ,
// couBrandId (integer, optional): 所属品牌ID ,
// couBrandName (string, optional): 所属品牌名称 ,
// couSeriesId (integer, optional): 所属品牌系列ID ,
// couSeriesName (string, optional): 所属品牌系列名称 ,
// couWaresId (integer, optional): 所属商品ID ,
// couWaresName (string, optional): 所属商品名称 ,
// registerTime (string, optional): 上牌时间 ,
// proAreaId (integer, optional): 省级区域ID ,
// proAreaName (string, optional): 省级区域名称 ,
// cityAreaId (integer, optional): 市级区域ID ,
// cityAreaName (string, optional): 市级区域名称 ,
// countyAreaId (integer, optional): 县/区级区域ID ,
// countyAreaName (string, optional): 县/区级区域名称 ,
// distance (integer, optional): 行驶里程 ,
// dealUserId (integer, optional): 客户ID ,
// images (Array[string], optional): 图片路径集合 ,
// status (integer, optional): 状态 0.待审核 1.已审核 ,
// dealAssessPrice (string, optional): 评估价格 ,
// sellStatus (integer, optional): 交易状态 0.未交易 1.交易中 2.已交易 ,
// driveImage (inline_model_22, optional),
// waresImages (Array[Inline Model 1], optional),
// examineUserId (integer, optional): 审核人ID ,
// examineTime (string, optional): 审核时间

// {
//   "couBrandId": 0,
//   "couSeriesId": 0,
//   "couWaresId": 0,
//   "registerTime": "2020-06-13T06:07:39.131Z",
//   "proAreaId": 0,
//   "cityAreaId": 0,
//   "countyAreaId": 0,
//   "distance": 0,
//   "dealUserId": 0,
//   "driveImage": {
//     "image": "string"
//   },
//   "waresImages": [
//     {}
//   ]
// }
        dataForm: {
          couWaresId: '',
          couWaresName: '',
          couBrandId: '',
          couSeriesId: '',
          proAreaId: 19,
          cityAreaId: '',
          countyAreaId: '',
          distance: '',
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
          ]
        }
      }
    },
    components: {
      BrandSelect, SeriesSelect, CitySelect, AreaSelect
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
          this.dataForm.image = res.data.url
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
							console.log(this.dataForm)
              // Assess.save(this.dataForm).then(({data}) => {
              //   if (data && data.code === 0) {
              //     this.$message({
              //       message: '操作成功',
              //       type: 'success',
              //       duration: 1500,
              //       onClose: () => {
              //         this.visible = false
              //         this.resetForm()
              //         this.$emit('refreshDataList')
              //       }
              //     })
              //   } else {
              //     this.$message.error(data.msg)
              //   }
              // }).catch(err => {
              //   console.log(err)
              //   this.$message.error(err)
              // })
            } else {
              // Assess.update(this.dataForm).then(({data}) => {
              //   if (data && data.code === 0) {
              //     this.$message({
              //       message: '操作成功',
              //       type: 'success',
              //       duration: 1500,
              //       onClose: () => {
              //         this.visible = false
              //         this.resetForm()
              //         this.$emit('refreshDataList')
              //       }
              //     })
              //   } else {
              //     this.$message.error(data.msg)
              //   }
              // }).catch(err => {
              //   console.log(err)
              //   this.$message.error(err)
              // })
            }
          }
        })
      }
    }
  }
</script>

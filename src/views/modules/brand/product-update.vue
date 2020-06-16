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
      <el-form-item label="选择型号" prop="couModelId">
        <ModelSelect v-model="dataForm.couModelId"></ModelSelect>
      </el-form-item>
      <el-form-item label="厂商指导价" prop="couWaresPrice">
        <el-input-number v-model="dataForm.couWaresPrice" :min="1" label=""></el-input-number>
      </el-form-item>
      <el-form-item label="年款" prop="marketYear">
        <el-date-picker v-model="dataForm.marketYear" type="year" placeholder="选择年">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="上市时间" prop="marketTime">
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
      </el-form-item>
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
  import Product from '@/api/brand/product'
  import BrandSelect from '@/views/common-select/brand-select'
  import SeriesSelect from '@/views/common-select/brand-series-select'
  import ModelSelect from '@/views/common-select/model-select'
  import DisMent from '@/views/common-select/disment-select'
  import VarBoxSelect from '@/views/common-select/var-box-select'
  import DriveStyleSelect from '@/views/common-select/drive-style-select'
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
          couBrandId: '',
          couWaresName: '',
          couSeriesId: '',
          couModelId: '',
          couWaresPrice: '',
          marketYear: '',
          marketTime: '',
          disMent: '',
          varBox: '',
          drive: '',
          consume: ''
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
      BrandSelect, ModelSelect, DisMent, VarBoxSelect, DriveStyleSelect, ConsumeSelect, SeriesSelect
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

<template>
  <el-dialog
    :title="!bannerId ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="cancle" width="1000px">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
      <el-form-item label="广告图标题" prop="adName">
        <el-input v-model="dataForm.adName" placeholder="请输入广告图标题"></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="image">
        <el-upload
          :action="GLOBAL.UPLOAD_ADVERTISE_URL"
          :headers="myHeaders"
          :on-success="imageUploadSuccess"
          :accept="'.jpg, .png, .jpeg'"
          list-type="picture-card"
          :file-list="fileList"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <!-- <el-form-item label="上传">
        <el-button size="small" type="primary" @click="chooseProduct">点击上传</el-button>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-table :data="dataForm.bannerWaresList" @row-click="handleRowlclick" stripe>
              <el-table-column header-align="center" align="center" type="index" label="NO" width="80"/>
              <el-table-column label="商品标题" prop="dealWaresTitle" header-align="center" align="center" width="80"/>
              <el-table-column label="图片" prop="image" header-align="center" align="center">
                <template slot-scope="scope">
                  <img v-if="scope.row.image" :src="scope.row.image" :alt="scope.row.image" style="width: 80px;" />
                  <el-upload v-else :action="GLOBAL.UPLOAD_BANNER_URL" :show-file-list="false" :on-success="imageUploadSuccess2" :before-upload="beforeAvatarUpload"
                    :headers="myHeaders"
                    :accept="'.jpg, .png'"
                    >
                    <i class="el-icon-plus" />
                  </el-upload>
                </template>
              </el-table-column>
              <el-table-column label="操作" header-align="center" align="center" min-idth="200" v-loading="bodyImagesLoading">
                <template slot-scope="scope">
                  <el-button-group>
                    <el-button size="mini" v-if="scope.$index > 0" type="primary" title="上移" icon="el-icon-caret-top" @click.stop="imagesUp(scope.$index)"></el-button>
                    <el-button size="mini"  type="primary" v-if="scope.$index != dataForm.bannerWaresList.length-1" title="下移" icon="el-icon-caret-bottom" @click.stop="imagesDown(scope.$index)"></el-button>
                  </el-button-group>
                  <el-button-group>
                    <el-button size="mini" type="danger" title="删除" icon="el-icon-delete" @click.stop="imagesDel(scope.$index)" ></el-button>
                  </el-button-group>
                </template>
              </el-table-column>
            </el-table>

          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="dataForm.sort" controls-position="right" :min="0" label="排序号"></el-input-number>
      </el-form-item>
      <el-form-item label="展示类型" prop="displayType">
        <el-radio-group v-model="dataForm.displayType">
          <el-radio :label="0">零售</el-radio>
          <el-radio :label="1">企业</el-radio>
        </el-radio-group>
      </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancle()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <ProductPop v-if="proPopVisible" ref="ProductPop" @product-pop-event="getProInfo"></ProductPop>
  </el-dialog>
</template>

<script>
  import { isMobile, removeBlank } from '@/utils/validate'
  import Advertise from '@/api/advertise'
  import { getToken } from '@/utils/userInfoUtil'
  import ProductPop from '@/views/common-pop/product-pop'
  export default {
    data () {
      var removeSpace = (rule, value, callback) => {
        this.dataForm.adName = removeBlank(value)
        callback()
      }
      return {
        adId: '',
        visible: false,
        proPopVisible: false,
        roleList: [],
        menuList: [],
        imgList: [],
        fileList: [],
        myHeaders: {
          token: getToken()
        },
        positionList: [],
        bodyImagesLoading: false,
        dataForm: {
          adId: '',
          adName: '',
          image: ''
        },
        body: {
          text: '',
          imageUrl: '',
          images: []
        },
        bannerId: '',
        dataRule: {
          adName: [
            { required: true, message: '广告图标题不能为空', trigger: 'blur' },
            { validator: removeSpace, trigger: 'blur'}
          ],
          image: [
            { required: true, message: '广告图不能为空', trigger: 'blur' },
          ]
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
        this.adId = id
        this.visible = true
        if(id) {
          this.setData(id)
        } 
      },
      chooseProduct () {
        this.proPopVisible = true
        this.$nextTick(() => {
          this.$refs.ProductPop.init()
        })
      },
      setData(data) {
        Advertise.info(data).then(({data}) => {
          if (data.code === 0) {
            this.dataForm = data.data
            const obj = { url: data.data.image }
            this.fileList.push(obj)
          }else {
            this.$message.error(data.msg)
          }
        }).catch(err => {
          console.log(err)
          this.$message.error(data.msg)
        })
      },
      // 单图上传 成功回调
      imageUploadSuccess(res, file) {
        if (res.code === 0) {
          this.dataForm.image = res.data.url
          const obj = { url: res.data.url }
          this.fileList.push(obj)
        } else {
          this.$message(res.msg)
        }
      },
      handleRemove(file, fileList) {
        this.dataForm.image = ''
        this.fileList = []
      },
       // 单击事件
      handleRowlclick (val) {
        this.selectItem = val
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
       // 多图片 删除图片方法
      imagesDel(index) {
        this.dataForm.bannerWaresList.splice(index, 1)
        // this.body.images = this.body.images.splice(index, 1)
      },
      // 多图片 上移
      imagesUp(index) {
        this.bodyImagesLoading = true
        if (index !== 0) {
          // 将当前数组index索引与前面一个元素互换位置，向数组前面移动一位
          this.dataForm.bannerWaresList[index] = this.dataForm.bannerWaresList.splice(index - 1, 1, this.dataForm.bannerWaresList[index])[0]
        }
        this.bodyImagesLoading = false
      },
      // 多图片 下移
      imagesDown(index) {
        this.bodyImagesLoading = true
        if (index + 1 !== this.dataForm.images.length) {
          // 将当前数组index索引与后面一个元素互换位置，向数组后面移动一位
          this.dataForm.bannerWaresList[index] = this.dataForm.bannerWaresList.splice(index + 1, 1, this.dataForm.bannerWaresList[index])[0]
        }
        this.bodyImagesLoading = false
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
            if (!this.adId) {
              Advertise.save(this.dataForm).then(({data}) => {
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
              Advertise.update(this.dataForm).then(({data}) => {
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
<style>
  .imgBox{
    display: flex;
  }
</style>

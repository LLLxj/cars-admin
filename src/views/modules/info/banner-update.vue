<template>
  <el-dialog
    :title="!bannerId ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="cancle" width="1000px">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
      <el-form-item label="标题" prop="bannerName">
        <el-input v-model="dataForm.bannerName" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="上传">
        <el-button size="small" type="primary" @click="chooseProduct">点击上传</el-button>
        <!-- <el-upload :action="GLOBAL.UPLOAD_BRAND_URL" :file-list="fileList" list-type="picture-card" :on-success="imageUploadSuccess2" :before-upload="beforeAvatarUpload"
          :headers="myHeaders"
          :accept="'.jpg, .png'"
          >
          <i class="el-icon-plus" />
        </el-upload> -->
        <el-row :gutter="24">
          <el-col :span="24">
            <!-- <el-table :data="dataForm.bannerWaresList" @row-click="handleRowlclick" stripe> -->
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
      </el-form-item>
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
  import Banner from '@/api/banner'
  import { getToken } from '@/utils/userInfoUtil'
  import ProductPop from '@/views/common-pop/product-pop'
  export default {
    data () {
      var removeSpace = (rule, value, callback) => {
        this.dataForm.name = removeBlank(value)
        callback()
      }
      return {
        visible: false,
        proPopVisible: false,
        roleList: [],
        menuList: [],
        imgList: [],
        fileList: [],
        selectItem: {},
        menuListTreeProps: {
          label: 'deptName',
          children: 'children'
        },
        myHeaders: {
          token: getToken()
        },
        positionList: [],
        bodyImagesLoading: false,
        dataForm: {
          bannerId: '',
          bannerName: '',
          bannerWaresList: [],
          sort: '',
          displayType: 0
        },
        body: {
          text: '',
          imageUrl: '',
          images: []
        },
        bannerId: '',
        dataRule: {
          bannerName: [
            { required: true, message: 'banner标题不能为空', trigger: 'blur' },
            { validator: removeSpace, trigger: 'blur'}
          ],
          sort: [
            { required: true, message: '排序不能为空', trigger: 'blur' },
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
        this.bannerId = id
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
        Banner.info(data).then(({data}) => {
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
      // 多图上传 成功回调
      imageUploadSuccess2(res, file, fileList) {
        if (res.code === 0) {
          this.dataForm.bannerWaresList.forEach(item => {
            if (item.dealWaresId === this.selectItem.dealWaresId) {
              item.image = res.data.url
            }
          })
        } else {
          this.$message(res.data.msg)
        }
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
        this.dataForm.bannerWaresList = []
      },
      cancle () {
        this.visible = false
        this.resetForm()
      },
      getProInfo (val) {
        console.log(val)
        this.dataForm.bannerWaresList.push(val)
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (!this.id) {
              Banner.save(this.dataForm).then(({data}) => {
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
              Banner.update(this.dataForm).then(({data}) => {
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

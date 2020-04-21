<template>
  <el-dialog
    :title="!bannerId ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="cancle" width="1000px">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
      <el-form-item label="标题" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="上传">
        <el-button size="small" type="primary" @click="chooseProduct">点击上传</el-button>
        <!-- <el-row :gutter="24">
          <el-col :span="24">
            <el-upload
              :action="GLOBAL.UPLOAD_BRAND_URL"
              :show-file-list="false"
              :on-success="imageUploadSuccess2"
              :before-upload="beforeAvatarUpload"
              :headers="myHeaders">
              
            </el-upload>
          </el-col>
        </el-row> -->
        <el-row :gutter="24">
          <el-col :span="24">
            <el-table :data="dataForm.images" ref="body-images" stripe>
              <el-table-column header-align="center" align="center" type="index" label="NO" width="80"/>
              <el-table-column label="产品名称" prop="brandName" header-align="center" align="center" width="80"/>
              <el-table-column label="图片" prop="img" header-align="center" align="center">
                <template slot-scope="scope">
                  <img :src="scope.row.image" :alt="scope.row.img" style="width: 100px;" />
                </template>
              </el-table-column>

              <el-table-column label="操作" header-align="center" align="center" min-idth="200" v-loading="bodyImagesLoading">
                <template slot-scope="scope">
                  <el-button-group>
                    <el-button size="mini" v-if="scope.$index > 0" type="primary" title="上移" icon="el-icon-caret-top" @click.stop="imagesUp(scope.$index)"></el-button>
                    <el-button size="mini"  type="primary" v-if="scope.$index != dataForm.images.length-1" title="下移" icon="el-icon-caret-bottom" @click.stop="imagesDown(scope.$index)"></el-button>
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
          name: '',
          images: [],
          sort: ''
        },
        body: {
          text: '',
          imageUrl: '',
          images: []
        },
        bannerId: '',
        dataRule: {
          name: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
            { validator: removeSpace, trigger: 'blur'}
          ],
          // phone: [
          //   { required: true, message: '手机号不能为空', trigger: 'blur' },
          //   { validator: validateMobile, trigger: 'blur' }
          // ],
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
          if (this.body.images === null) {
            this.body.images = []
          }
          this.body.images.push({ 'img': res.data.url, 'url': '#' })
        } else {
          this.$message(res.data.msg)
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
       // 多图片 删除图片方法
      imagesDel(index) {
        this.dataForm.images.splice(index, 1)
        // this.body.images = this.body.images.splice(index, 1)
      },
      // 多图片 上移
      imagesUp(index) {
        this.bodyImagesLoading = true
        if (index !== 0) {
          // 将当前数组index索引与前面一个元素互换位置，向数组前面移动一位
          this.dataForm.images[index] = this.dataForm.images.splice(index - 1, 1, this.dataForm.images[index])[0]
        }
        this.bodyImagesLoading = false
      },
      // 多图片 下移
      imagesDown(index) {
        this.bodyImagesLoading = true
        if (index + 1 !== this.dataForm.images.length) {
          // 将当前数组index索引与后面一个元素互换位置，向数组后面移动一位
          this.dataForm.images[index] = this.dataForm.images.splice(index + 1, 1, this.dataForm.images[index])[0]
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
      getProInfo (val) {
        console.log(val)
        this.dataForm.images.push(val)
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            console.log(this.dataForm)
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

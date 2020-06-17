<template>
  <div class="mod-user">
    <!--布局容器-->
    <el-container>
      <!--右侧-->
      <el-main>
        <!-- <el-form :inline="true" :model="searchData" @keyup.enter.native="getDataList()" @submit.native.prevent> -->
        <el-form :inline="true" :model="searchData">
          <el-form-item label="商品名称">
            <el-input v-model="searchData.couWaresName" placeholder="商品名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="品牌名称" prop="couBrandId">
            <BrandSelect v-model="searchData.couBrandId" placeholder="请输入品牌名称"></BrandSelect>
          </el-form-item>
          <el-form-item label="选择系列" prop="couSeriesId">
            <SeriesSelect v-model="searchData.couSeriesId" :disabled="!searchData.couBrandId" :couSeriesId="searchData.couBrandId"></SeriesSelect>
          </el-form-item>
          <el-form-item label="选择型号" prop="couModelId">
            <ModelSelect v-model="searchData.couModelId"></ModelSelect>
          </el-form-item>
          <el-form-item label="状态">
            <StatusSelect v-model="searchData.status"></StatusSelect>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList()">查询</el-button> 
            <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
            <el-button @click="resetForm()" type="primary">重置</el-button> 
          </el-form-item>
        </el-form>
        <el-table :data="dataList" border stripe v-loading="dataListLoading" style="width: 100%;" id="dataListUser">
          <el-table-column type="index" align="center" header-align="center" width="80" label="NO" fixed="left"/>
          <el-table-column prop="dealWaresNo" header-align="center" align="center" label="商品编号" fixed="left"/>
          <el-table-column prop="dealWaresTitle" header-align="center" align="center" label="商品标题" />
          <el-table-column prop="dealUserName" header-align="center" align="center" label="所属企业客户名称" />
          <el-table-column prop="releaseAreaName" header-align="center" align="center" label="区域名称" />
          <el-table-column prop="contactPhone" header-align="center" align="center" label="联系电话" />
          <el-table-column prop="contactName" header-align="center" align="center" label="联系人" />
          <el-table-column prop="sex" header-align="center" align="center" label="性别">
            <template slot-scope="scope">
              <span v-if="scope.row.sex === 0" type="info">先生</span>
              <span v-else>女士</span>
            </template>
          </el-table-column>
          <!-- dealWaresId (string, optional): 出售商品ID ,
coverImage (inline_model_24, optional),
driveImage (inline_model_25, optional),
waresImages (Array[Inline Model 1], optional),
dealStoreId (integer, optional): 所属企业客户ID ,
submitTime (string, optional): 提交时间 -->
          <el-table-column prop="waresFrameCode" header-align="center" align="center" label="商品框架号" />
          <el-table-column prop="couBrandName" header-align="center" align="center" label="品牌名称" />
          <el-table-column prop="couSeriesName" header-align="center" align="center" label="系列名称" />
          <el-table-column prop="couWaresName" header-align="center" align="center" label="商品名称" />
          <el-table-column prop="couModelName" header-align="center" align="center" label="型号名称" />
          <el-table-column prop="tradePrice" header-align="center" align="center" label="批发价" />
          <el-table-column prop="retailPrice" header-align="center" align="center" label="零售价" />
          <el-table-column prop="registerTime" header-align="center" align="center" label="上牌时间" />
          <el-table-column prop="distance" header-align="center" align="center" label="行驶里程" />
          <el-table-column prop="licenseId" header-align="center" align="center" label="牌照ID" />
          <el-table-column prop="licenseCode" header-align="center" align="center" label="牌照" />
          <el-table-column prop="addr" header-align="center" align="center" label="详细地址" />
          <el-table-column prop="waresRemark" header-align="center" align="center" label="商品描述" />
          <el-table-column prop="transferNum" header-align="center" align="center" label="过户次数" />
          <el-table-column prop="isTransfer" header-align="center" align="center" label="是否含过户费">
            <template slot-scope="scope">
              <span v-if="scope.row.isTransfer === 0">无</span>
              <span v-else>有</span>
            </template>
          </el-table-column>
          <el-table-column prop="isMortgage" header-align="center" align="center" label="是否有抵押">
            <template slot-scope="scope">
              <span v-if="scope.row.isTransfer === 0">无</span>
              <span v-else>有</span>
            </template>
          </el-table-column>
          <el-table-column prop="isMaintain" header-align="center" align="center" label="是否有定期4s保养">
            <template slot-scope="scope">
              <span v-if="scope.row.isTransfer === 0">无</span>
              <span v-else>有</span>
            </template>
          </el-table-column>
          <el-table-column prop="sellStatus" header-align="center" align="center" label="出售状态">
            <template slot-scope="scope">
              <span v-if="scope.row.isTransfer === 0">驳回</span>
              <span v-if="scope.row.isTransfer === 1">销售审核中</span>
              <span v-if="scope.row.isTransfer === 2">经理审核中</span>
              <span v-if="scope.row.isTransfer === 3">上架</span>
              <span v-if="scope.row.isTransfer === 4">下架</span>
            </template>
          </el-table-column>
          <el-table-column prop="onlineStatus" header-align="center" align="center" label="上线状态">
            <template slot-scope="scope">
              <span v-if="scope.row.isTransfer === 0">未出售</span>
              <span v-else>已出售</span>
            </template>
          </el-table-column>
          <el-table-column prop="submitTime" header-align="center" align="center" label="提交时间" />
          <!-- <el-table-column prop="image" header-align="center" align="center" label="品牌logo">
            <template slot-scope="scope">
              <img :src="scope.row.image" alt="" style="max-height: 100px;max-width: 100px">
            </template>
          </el-table-column>
          <el-table-column prop="firstLetter" header-align="center" align="center" label="品牌首字母">
          </el-table-column> 
          <el-table-column prop="status" header-align="center" align="center" label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.type === 0">禁用</el-tag>
              <el-tag v-else>正常</el-tag>
            </template>
          </el-table-column> -->
          <!-- <el-table-column prop="status" header-align="center" align="center" label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 0" type="info">禁用</el-tag>
              <el-tag v-else>正常</el-tag>
            </template>
          </el-table-column> -->
          <el-table-column fixed="right" header-align="center"  align="center" width="150" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.couWaresId)">编辑</el-button>
              <el-button type="text" size="small" v-if="scope.row.status === 1" @click="disHandle(scope.row.couWaresId)">禁用</el-button> 
              <el-button type="text" size="small" v-if="scope.row.status === 0" @click="norHandle(scope.row.couWaresId)">启用</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex" background
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
        <!-- 弹窗, 上传文件 -->
      </el-main>
    </el-container>
  </div>
</template>
<script>

  import Products from '@/api/customer/product'
  import AddOrUpdate from './product-update'
  import StatusSelect from '@/views/common-select/select-status'
  import BrandSelect from '@/views/common-select/brand-select'
  import SeriesSelect from '@/views/common-select/brand-series-select'
  import ModelSelect from '@/views/common-select/model-select'
  import Vue from 'vue'
  export default {
    data () {
      return {
        dataList: [],
        addOrUpdateVisible: false,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        searchData: {
          couWaresName: '',
          couBrandId: '',
          couSeriesId: '',
          couModelId: '',
          page: 1,
          limit: 10
        }
      }
    },
    components: {
      AddOrUpdate, StatusSelect, BrandSelect, SeriesSelect, ModelSelect
    },
    activated () {
      this.getDataList()
    },
    watch: {
    },
    methods: {
      // 获取数据列表
      getDataList (params) {
        this.dataListLoading = true
        params = this.searchData || null
        Products.list(params).then(res => {
          if (res.data && res.data.code === 0) {
            this.dataList = res.data.data.list
            this.totalPage = res.data.data.totalCount
            if(this.dataList !== null){
              this.isShow = false
            }
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      resetForm () {
        this.searchData = {
          couWaresName: '',
          couBrandId: '',
          couSeriesId: '',
          couModelId: '',
          page: 1,
          limit: 10
        }
        this.getDataList()
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        // this.searchData.page = val
        this.searchData.limit = val
        this.getDataList(this.searchData)
      },
      // 当前页
      currentChangeHandle (val) {
        this.searchData.page = val
        this.getDataList(this.searchData)
      },
      // 禁用
      disHandle (data) {
        Products.disable(data).then(res => {
          if(res.data && res.data.code === 0){
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          }else{
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          this.listLoading = false
          console.log(err)
          this.$message({
            message: err || '读取接口失败！',
            type: 'error',
            duration: 1500
          })
        })
        // disable
      },
      // 启用
      norHandle (data) {
        Products.awake(data).then(res => {
          if(res.data && res.data.code === 0){
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          }else{
            this.$message.error(res.data.msg)
          }
        })
      },
    }
  }
</script>

<template>
  <div class="mod-user">
    <!--布局容器-->
    <el-container>
      <!--右侧-->
      <el-main>
        <!-- <el-form :inline="true" :model="searchData" @keyup.enter.native="getDataList()" @submit.native.prevent> -->
        <el-form :inline="true" :model="searchData">
          <el-form-item label="商品名称">
            <el-input v-model="searchData.dealWaresTitle" placeholder="商品名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="品牌名称" prop="couBrandId">
            <BrandSelect v-model="searchData.couBrandId" placeholder="请输入品牌名称"></BrandSelect>
          </el-form-item>
          <el-form-item label="选择系列" prop="couSeriesId">
            <SeriesSelect v-model="searchData.couSeriesId" :disabled="!searchData.couBrandId" :couSeriesId="searchData.couBrandId"></SeriesSelect>
          </el-form-item>
          <el-form-item label="选择车辆类型" prop="couModelId">
            <ModelSelect v-model="searchData.couModelId"></ModelSelect>
          </el-form-item>
          <el-form-item label="状态">
            <StatusSelect v-model="searchData.status"></StatusSelect>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList1()">查询</el-button> 
            <el-button v-if="isAuth('deal:wares:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
            <el-button @click="resetForm()" type="primary">重置</el-button> 
          </el-form-item>
        </el-form>
        <el-table :data="dataList" border stripe v-loading="dataListLoading" style="width: 100%;" id="dataListUser">
          <el-table-column type="index" align="center" header-align="center" width="80" label="NO" fixed="left"/>
          <el-table-column prop="dealWaresNo" header-align="center" align="center" label="商品编号" fixed="left" min-width="160"/>
          <el-table-column prop="dealWaresTitle" header-align="center" align="center" label="商品标题" min-width="180"/>
          <el-table-column prop="dealUserName" header-align="center" align="center" label="所属企业客户名称" min-width="120" />
          <!-- <el-table-column prop="releaseAreaName" header-align="center" align="center" label="区域名称" min-width="120"/> -->
          <el-table-column prop="contactPhone" header-align="center" align="center" label="联系电话" min-width="120"/>
          <el-table-column prop="contactName" header-align="center" align="center" label="联系人" min-width="120"/>
          <el-table-column prop="sex" header-align="center" align="center" label="性别">
            <template slot-scope="scope">
              <span v-if="scope.row.sex === 0" type="info">先生</span>
              <span v-else>女士</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="waresFrameCode" header-align="center" align="center" label="商品框架号" min-width="120"/> -->
          <el-table-column prop="couBrandName" header-align="center" align="center" label="品牌名称" min-width="120"/>
          <el-table-column prop="couSeriesName" header-align="center" align="center" label="系列名称" min-width="160"/>
          <!-- <el-table-column prop="couWaresName" header-align="center" align="center" label="商品名称" min-width="120"/> -->
          <el-table-column prop="couModelName" header-align="center" align="center" label="车辆类型名称" min-width="120"/>
          <el-table-column prop="tradePrice" header-align="center" align="center" label="批发价" />
          <el-table-column prop="retailPrice" header-align="center" align="center" label="零售价" />
          <el-table-column prop="registerTime" header-align="center" align="center" label="上牌时间" min-width="160"/>
          <el-table-column prop="distance" header-align="center" align="center" label="行驶里程（公里）" />
          <!-- <el-table-column prop="licenseId" header-align="center" align="center" label="牌照ID" min-width="120"/> -->
          <el-table-column prop="licenseCode" header-align="center" align="center" label="牌照" min-width="120"/>
          <el-table-column prop="addr" header-align="center" align="center" label="详细地址" min-width="120"/>
          <el-table-column prop="waresRemark" header-align="center" align="center" label="商品描述" min-width="120"/>
          <el-table-column prop="transferNum" header-align="center" align="center" label="过户次数" />
          <el-table-column prop="isTransfer" header-align="center" align="center" label="是否含过户费" min-width="140">
            <template slot-scope="scope">
              <span v-if="scope.row.isTransfer === 0">无</span>
              <span v-else>有</span>
            </template>
          </el-table-column>
          <el-table-column prop="isMortgage" header-align="center" align="center" label="是否有抵押" min-width="140">
            <template slot-scope="scope">
              <span v-if="scope.row.isTransfer === 0">无</span>
              <span v-else>有</span>
            </template>
          </el-table-column>
          <el-table-column prop="isMaintain" header-align="center" align="center" label="是否有定期4s保养" min-width="140">
            <template slot-scope="scope">
              <span v-if="scope.row.isTransfer === 0">无</span>
              <span v-else>有</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" header-align="center" align="center" label="审核状态" min-width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0">驳回</span>
              <span v-if="scope.row.status === 1">销售审核中</span>
              <span v-if="scope.row.status === 2">经理审核中</span>
              <span v-if="scope.row.status === 3">审核通过</span>
              <!-- <span v-if="scope.row.isTransfer === 4">下架</span> -->
            </template>
          </el-table-column>
          <el-table-column prop="onlineStatus" header-align="center" align="center" label="上线状态">
            <template slot-scope="scope">
              <span v-if="scope.row.onlineStatus === 0">上架</span>
              <span v-if="scope.row.onlineStatus === 1">下架</span>
            </template>
          </el-table-column>
          <el-table-column prop="sellStatus" header-align="center" align="center" label="出售状态">
            <template slot-scope="scope">
              <span v-if="scope.row.sellStatus === 0">未出售</span>
              <span v-if="scope.row.sellStatus === 1">已出售</span>
            </template>
          </el-table-column>
          <el-table-column prop="submitTime" header-align="center" align="center" label="提交时间" min-width="160"/>
          <el-table-column fixed="right" header-align="center"  align="center" width="200" label="操作">
            <template slot-scope="scope">
              <!-- <span v-if="scope.row.status === 0">驳回</span>
              <span v-if="scope.row.status === 1">销售审核中</span>
              <span v-if="scope.row.status === 2">经理审核中</span>
              <span v-if="scope.row.status === 3">审核通过</span> -->
              <!-- <span v-if="scope.row.sellStatus === 0">未出售</span>
              <span v-if="scope.row.sellStatus === 1">已出售</span>
              <span v-if="scope.row.onlineStatus === 0">上架</span>
              <span v-if="scope.row.onlineStatus === 1">下架</span> -->
              <el-button v-if="isAuth('deal:wares:update') && (scope.row.status === 0 || scope.row.status === 1) && scope.row.onlineStatus === 1 && scope.row.sellStatus === 0" type="text" size="small" @click="addOrUpdateHandle(scope.row.dealWaresId, false)">编辑</el-button>
              <el-button v-if="scope.row.status !== 1 && scope.row.status !== 0" type="text" size="small" @click="addOrUpdateHandle(scope.row.dealWaresId, true)">详情</el-button>
              <el-button v-if="isAuth('deal:wares:reject') && (scope.row.status === 1 || scope.row.status === 2) && scope.row.onlineStatus === 1 && scope.row.sellStatus === 0" type="text" size="small" @click="manageHandle(scope.row.dealWaresId, 1)">驳回</el-button> 
              <el-button v-if="isAuth('deal:wares:manager') && scope.row.status === 1" type="text" size="small" @click="manageHandle(scope.row.dealWaresId, 2)">经理审核</el-button>
              <el-button v-if="isAuth('deal:wares:waste') && scope.row.sellStatus === 0 && scope.row.onlineStatus === 1 && ((scope.row.status === 0 || scope.row.status === 1 || scope.row.status === 2 || scope.row.status === 3))" type="text" size="small" @click="wasteHandle(scope.row.dealWaresId)">作废</el-button>
              <el-button v-if="isAuth('deal:wares:delete') && scope.row.status === 4 && scope.row.onlineStatus === 1 && scope.row.sellStatus === 0" type="text" size="small" @click="deleteHandle(scope.row)">删除</el-button>
              <el-button v-if="isAuth('deal:wares:sussess') && scope.row.status === 2 && scope.row.onlineStatus === 1 && scope.row.sellStatus === 0" type="text" size="small" @click="manageHandle(scope.row.dealWaresId, 4)">通过</el-button>
              <el-button v-if="isAuth('deal:wares:onLine') && scope.row.status === 3 && scope.row.onlineStatus === 1 && scope.row.sellStatus === 0" type="text" size="small" @click="onLineHandle(scope.row)">上架</el-button>
              <el-button v-if="isAuth('deal:wares:unLine') && scope.row.status === 3 && scope.row.onlineStatus === 0 && scope.row.sellStatus === 0" type="text" size="small" @click="unLineHandle(scope.row)">下架</el-button>
              <el-button v-if="isAuth('deal:wares:sale') && scope.row.status === 3 && scope.row.onlineStatus === 0 && scope.row.sellStatus === 0" type="text" size="small" @click="saleHandle(scope.row.dealWaresId)">已出售</el-button>
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
        <CheckOrder v-if="checkOrderVisible" ref="checkOrder" @refreshDataList="getDataList"></CheckOrder>
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
  import CheckOrder from './product-check'
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
        },
        checkOrderVisible: false
      }
    },
    components: {
      AddOrUpdate, StatusSelect, BrandSelect, SeriesSelect, ModelSelect, CheckOrder
    },
    activated () {
      this.getDataList()
    },
    watch: {
    },
    methods: {
      // 获取数据列表
      getDataList1() {
        this.pageIndex = 1
        this.searchData.page = 1
        this.getDataList()
      },
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
      addOrUpdateHandle (id, status) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, status)
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.searchData.limit = val
        this.getDataList(this.searchData)
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.searchData.page = val
        this.getDataList(this.searchData)
      },
      manageHandle(id, index) {
        this.checkOrderVisible = true
        this.$nextTick(() => {
          this.$refs.checkOrder.init(id, index)
        })
      },
      wasteHandle (item) {
        Products.waste(item).then(res => {
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
      },
      onLineHandle(item) {
        Products.onLine({
          dealWaresId: item.dealWaresId,
          dealStoreId: item.dealStoreId
        }).then(res => {
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
      },
      deleteHandle (item) {
        console.log(item)
        this.$confirm('确定删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Products.delete(item).then(res => {
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
        })
      },
      // 下架
      unLineHandle (item) {
        Products.unLine({
          dealWaresId: item.dealWaresId,
          dealStoreId: item.dealStoreId
        }).then(res => {
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
      },
      // 已出售
      saleHandle (data) {
        Products.sale(data).then(res => {
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

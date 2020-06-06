<template>
  <div class="mod-user">
    <!--布局容器-->
    <el-container>
      <!--右侧-->
      <el-main>
        <!-- <el-form :inline="true" :model="searchData" @keyup.enter.native="getDataList()" @submit.native.prevent> -->
        <el-form :inline="true" :model="searchData">
          <el-form-item label="系列名称">
            <el-input v-model="searchData.couSeriesName" placeholder="系列名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="选择品牌">
            <brandSelect v-model="searchData.couBrandId" @get-brand-val="getBrandData"></brandSelect>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList()">查询</el-button> 
            <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
            <el-button @click="resetForm()" type="primary">重置</el-button> 
          </el-form-item>
        </el-form>
        <el-table :data="dataList" border stripe v-loading="dataListLoading" style="width: 100%;" id="dataListUser">
          <el-table-column type="index" align="center" header-align="center" width="80" label="NO" fixed/>
          <el-table-column prop="couSeriesName" header-align="center" align="center" label="系列名称">
          </el-table-column>
          <el-table-column prop="couBrandName" header-align="center" align="center" label="所属品牌">
          </el-table-column>
          
          <el-table-column fixed="right" header-align="center"  align="center"  width="150"  label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.couSeriesId)">编辑</el-button>
              <el-button type="text" size="small" v-if="scope.row.status === 1" @click="disHandle(scope.row)">禁用</el-button> 
              <el-button type="text" size="small" v-if="scope.row.status === 0" @click="norHandle(scope.row)">启用</el-button>
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
      </el-main>
    </el-container>
  </div>
</template>
<script>

  import Series from '@/api/brand/series'
  import brandSelect from '@/views/common-select/brand-select'
  import AddOrUpdate from './series-update'
  import Bus from '@/utils/bus'
  import Vue from 'vue'
  export default {
    data () {
      return {
        addOrUpdateVisible: false,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        searchData: {
          couSeriesName: '',
          couBrandId: '',
          page: 1,
          limit: 10
        },
        params: {
          areaName: '',
          areaId: '',
          page: '',
          limit: ''
        },
        chooseCity: true,
      }
    },
    components: {
      brandSelect, AddOrUpdate
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
        Series.norList(params).then(res => {
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
      getBrandData(val) {
        this.searchData.brandId = val
      },
      getCountryData(val) {
        this.searchData.countryId = val
      },
      resetForm () {
        this.searchData = {
          couSeriesName: '',
          couBrandId: '',
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
      areaTreeChangeEvent (deptId, deptName) {
        this.dataForm.deptId = deptId
        this.partListVisible = true
        this.$nextTick(() => {
          this.$refs.partList.init(deptId)
        })
      },
      // 禁用
      disHandle (data) {
        Series.disable(data.seriesId).then(res => {
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
        Series.awake(data.seriesId).then(res => {
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

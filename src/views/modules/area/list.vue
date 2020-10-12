<template>
  <div class="mod-user">
    <!--布局容器-->
    <el-container>
      <!--右侧-->
      <el-main>
        <!-- <el-form :inline="true" :model="searchData" @keyup.enter.native="getDataList()" @submit.native.prevent> -->
        <el-form :inline="true" :model="searchData">
          <!-- <el-form-item label="区域名称">
            <el-input v-model="searchData.areaName" placeholder="区域名称" clearable></el-input>
          </el-form-item> -->
          <el-form-item label="选择市区">
            <citySelect v-model="searchData.cityId" @get-city-val="getCityData"></citySelect>
          </el-form-item>
          <el-form-item label="选择县/区">
            <countrySelect v-model="searchData.countryId" ref="countrySelect" :disabled="chooseCity" @get-country-val="getCountryData"></countrySelect>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList1()">查询</el-button> 
            <el-button @click="resetForm()" type="primary">重置</el-button> 
          </el-form-item>
        </el-form>
        <el-table :data="dataList" border stripe v-loading="dataListLoading" style="width: 100%;" id="dataListUser">
          <el-table-column type="index" align="center" header-align="center" width="80" label="NO" fixed/>
          <el-table-column prop="areaName" header-align="center" align="center" label="区域">
          </el-table-column>
          <el-table-column prop="type" header-align="center" align="center" label="区域类型">
            <template slot-scope="scope">
              <span v-if="scope.row.type === 0" size="small">省</span>
              <span v-if="scope.row.type === 1" size="small">市</span>
              <span v-if="scope.row.type === 2" size="small">县/区</span>
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
        <!-- 弹窗, 上传文件 -->
      </el-main>
    </el-container>
  </div>
</template>
<script>

  import Areas from '@/api/area'
  import ElContainer from 'element-ui/packages/container/index'
  import citySelect from '@/views/common-select/all-city-select'
  import countrySelect from '@/views/common-select/all-country-select'
  import Bus from '@/utils/bus'
  import Vue from 'vue'
  export default {
    data () {
      return {
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        searchData: {
          // areaName: '',
          countryId: '',
          cityId: '',
          areaId: '',
          page: 1,
          limit: 10
        },
        params: {
          // areaName: '',
          areaId: '',
          page: 1,
          limit: 10
        },
        chooseCity: true,
      }
    },
    components: {
      citySelect, countrySelect
    },
    activated () {
      this.getDataList()
    },
    watch: {
      'searchData.cityId':function(newV,oldV){
        if (newV !== oldV) {
          this.searchData.countryId = ''
        }
     },
     deep:true, //深度监听设置为 true
    },
    methods: {
      getDataList1() {
        this.searchData.page = 1
        this.pageIndex = 1
        this.getDataList()
      },
      // 获取数据列表
      getDataList (params) {
        // this.searchData.page = 1
        this.dataListLoading = true
        var params = this.searchData || null
        this.paramsSearch()
      },
      paramsSearch() {
        var data = this.searchData
        if (data.cityId !== '' && data.countryId == '') {
          this.params.areaId = data.cityId
        } else if (data.cityId !== '' && data.countryId !== '') {
          this.params.areaId = data.countryId
        }
        // this.params.areaName = data.areaName
        this.params.page = this.searchData.page
        this.params.limit = this.searchData.limit
        Areas.list(this.params).then(res => {
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
      getCityData(val) {
        this.searchData.cityId = val
        this.chooseCity = false
        // 更新子组件状态
        this.$refs.countrySelect.update(val)
      },
      getCountryData(val) {
        this.searchData.countryId = val
      },
      resetForm () {
        this.searchData = {
          // areaName: '',
          areaId: '',
          page: 1,
          limit: 10
        }
        this.getDataList()
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
      areaTreeHandle (event, data, node, handle) {
        
      },
    }
  }
</script>

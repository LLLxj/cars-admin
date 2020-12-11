<template>
<div>
  <div>
   <el-dialog title="商品列表" :close-on-click-modal="false" :visible.sync="visible" append-to-body>
      <el-main>
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item label="标题">
            <el-input v-model="dataForm.dealWaresTitle" placeholder="请输入商品标题" clearable></el-input>
          </el-form-item>
          <el-form-item label="客户手机号">
            <el-input v-model="dataForm.dealUserPhone" placeholder="请输入手机号码" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList()">查询</el-button>
            <el-button @click="resetForm()">重置</el-button>
            <el-button type="primary" @click="selectHandle()">确定</el-button>
            <el-button type="danger" @click="cancleHandle()" >取消</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" @row-dblclick="handleRowDblclick" @row-click="handleRowlclick" style="width: 100%;">
          <el-table-column type="index" label="NO" align="center" header-align="center" width="80"/>
          <el-table-column prop="dealWaresTitle" header-align="center" align="center" label="商品标题"/>
          <el-table-column prop="dealUserName" header-align="center" align="center" label="所属客户名称"/>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" background @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
          :total="totalPage"
           style="margin-top: 10px;"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </el-main>
    </el-dialog>
  </div>
</div>
</template>

<script>

  import Product from '@/api/customer/product'
  import CustomerSelect from '@/views/common-select/customer/store-com-customer'

  export default {
    data () {
      return {
        dataForm: {
          dealWaresTitle: '',
          status: 3,
          onlineStatus: 0,
          sellStatus: 0,
          dealUserPhone: ""
        },
        visible:false,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        selectItem: {
          dealWaresTitle: '',
          dealWaresId: '',
          coverImage: ''
        },
        selectProItem: {
          dealWaresId: '',
          dealUserId: '',
          dealWaresTitle: ''
        },
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        dialogFormVisible:false
      }
    },
    components: {
      CustomerSelect
    },
    methods: {
    init () {
        this.visible = true
        this.dataForm.brandName = ''
        this.getDataList()
      },
      // 获取数据列表
      getDataList (params) {
        this.dataListLoading = true
        params = this.dataForm || null
        Product.list(params).then(res => {
          this.dataListLoading = false
          if(res.data && res.data.code === 0){
            this.dataList = res.data.data.list
            this.totalPage = res.data.data.totalCount
          }
        
        }).catch(err => {
          console.log(err)
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      resetForm () {
        this.dataForm = {
          brandName: '',
          brandId: '',
          dealUserPhone: ''
        }
        this.getDataList()
      },
       // 双击事件
      handleRowDblclick (val, row) {
        this.selectItem = {
          dealWaresTitle: val.dealWaresTitle,
          dealWaresId: val.dealWaresId,
          image: ''
        }
        this.selectProItem = {
          dealWaresId: val.dealWaresId,
          dealUserId: val.dealUserId,
          dealWaresTitle: val.dealWaresTitle
        }
        this.selectHandle(val)
      },
      // 单击事件
      handleRowlclick (val) {
        this.selectItem = {
          dealWaresTitle: val.dealWaresTitle,
          dealWaresId: val.dealWaresId,
          image: ''
        }
        this.selectProItem = {
          dealWaresId: val.dealWaresId,
          dealUserId: val.dealUserId,
          dealWaresTitle: val.dealWaresTitle
        }
      },
      // 确认
      selectHandle () {
        if (this.selectItem.dealWaresId == '') {
          this.$message.error('请选择商品!')
          return
        }
        this.$emit('product-pop-event', this.selectItem, this.selectProItem)
        this.visible = false
      },
      // 取消
      cancleHandle () {
        this.visible = false
      }
    }
  }
</script>

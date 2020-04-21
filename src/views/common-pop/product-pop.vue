<template>
<div>
  <div>
   <el-dialog title="商品列表" :close-on-click-modal="false" :visible.sync="visible" append-to-body>
      <el-main>
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item>
            <el-input v-model="dataForm.brandName" placeholder="请输入商品名称" clearable></el-input>
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
          <el-table-column prop="brandName" header-align="center" align="center" label="商品名称"/>
          <el-table-column prop="image" header-align="center" align="center" label="商品图片">
            <template slot-scope="scope">
              <img :src="scope.row.image" alt="" style="width:50px">
            </template>
          </el-table-column>
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

  import Brand from '@/api/brand/brand'

  export default {
    data () {
      return {
        dataForm: {
          brandName: '',
          brandId: ''
        },
        visible:false,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        selectItem: {},
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        dialogFormVisible:false
      }
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
        Brand.norList(params).then(res => {
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
        console.log(val)
        this.pageIndex = val
        this.getDataList()
      },
      resetForm () {
        this.dataForm = {
          brandName: '',
          brandId: ''
        }
      },
       // 双击事件
      handleRowDblclick (val, row) {
        this.selectItem = val
        this.selectHandle(val)
        // console.log(1)
      },
      // 单击事件
      handleRowlclick (val) {
        this.selectItem = val
      },
      // 确认
      selectHandle () {
        if (this.selectItem.brandId == '') {
          this.$message.error('请选择商品!')
          return
        }
        this.$emit('product-pop-event', this.selectItem)
        this.visible = false
      },
      // 取消
      cancleHandle () {
        this.visible = false
      }
    }
  }
</script>

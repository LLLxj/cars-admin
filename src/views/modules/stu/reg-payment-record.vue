<template>
  <div>
      <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
        <el-table-column type="index" header-align="center" align="center" label="NO" width="80">
        </el-table-column>
        <el-table-column prop="paymentNo" header-align="center" align="center" width="160" label="缴费单号">
        </el-table-column>
        <el-table-column prop="payPrice" header-align="center" align="center" width="160" label="缴费金额">
        </el-table-column>
        <!-- <el-table-column prop="status" header-align="center" align="center" label="缴费状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 1" size="small" type="success">待缴费</el-tag>
            <el-tag v-if="scope.row.status === 2" size="small" type="danger">已缴定金</el-tag>
            <el-tag v-if="scope.row.status === 3" size="small">部分缴费</el-tag>
            <el-tag v-if="scope.row.status === 4" size="small" type="info">已缴费</el-tag>
            <el-tag v-if="scope.row.status === 5" size="small">退学</el-tag>
            <el-tag v-if="scope.row.status === 6" size="small" type="info">作废</el-tag>
          </template>
        </el-table-column>  -->
        <el-table-column prop="paymentType" header-align="center" align="center" label="支付类型">
          <template slot-scope="scope">
            <span v-if="scope.row.paymentType === 1">定金</span>
            <span v-if="scope.row.paymentType === 2">学费</span>
          </template>
        </el-table-column>
        <el-table-column prop="payTypeName" header-align="center" align="center" width="160" label="支付方式">
        </el-table-column>
        
        <el-table-column prop="receiptNo" header-align="center" align="center" width="160" label="单据编号">
        </el-table-column>
        <!-- <el-table-column prop="payTime" header-align="center" align="center" label="缴费时间" :formatter="dateFormatter">
        </el-table-column> -->
        <el-table-column prop="createTime" header-align="center" align="center" label="创建时间" :formatter="dateFormatter">
        </el-table-column>
        <!-- <el-table-column prop="remark" header-align="center" align="center" label="备注">
        </el-table-column> -->
      </el-table>
      <div class="block" style="float:left;">
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
  </div>
</template>

<script>
  import { regPaymentRecord } from '@/api/reg'
  import { dateSubstring } from '@/utils/index'

  export default {
    data () {
      return {
        visible: false,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        selectId: '',
        dataListLoading: false
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.init()
      })
    },
    methods: {
      init (id) {
        this.selectId = id
        this.getDataList()
      },
      getDataList () {
        this.dataListLoading = true
        this.visible = true
        if (this.selectId) {
          regPaymentRecord(this.pageIndex, this.pageSize, this.selectId).then(res => {
            if (res.data && res.data.code === 0) {
              // console.log(res)
              this.dataList = res.data.data.list
              this.totalPage = res.data.data.totalCount
              this.pageIndex = res.data.data.currPage
            } else {
                this.dataList = []
                this.totalPage = 0
            }
            this.dataListLoading = false
          }).catch(err => {
            console.log(err)
          })
        }
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
      dateFormatter (row, column, cellValue) {
        return dateSubstring(cellValue)
      }
    }
  }
</script>



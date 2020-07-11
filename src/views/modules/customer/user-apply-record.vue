<template>
  <div>
      <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
        <el-table-column type="index" header-align="center" align="center" label="NO" width="80">
        </el-table-column>
        <!-- dealStoreId: 7
dealStoreName: "测试哈士奇"
dealUserJob: "213"
examine: 2
examineTime: "2020-07-08 20:43:14"
examineUserId: 1
sysUserId: 100002
sysUserName: "雅典娜" -->
        <el-table-column prop="dealStoreName" header-align="center" align="center" width="160" label="企业名称">
        </el-table-column>
        <!-- <el-table-column prop="offPrice" header-align="center" align="center" width="160" label="优惠金额">
        </el-table-column> -->
        <!-- <el-table-column prop="status" header-align="center" align="center" label="单据状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 1" size="small" type="warning">财务审核中</el-tag>
            <el-tag v-if="scope.row.status === 2" size="small" type="success">已优惠</el-tag>
            <el-tag v-if="scope.row.status === 3" size="small" type="danger">优惠失败</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column prop="sysUserName" header-align="center" align="center" label="所属人">
        </el-table-column>
        <el-table-column prop="examineTime" header-align="center" align="center" label="创建时间">
        </el-table-column>
        
        <!-- <el-table-column prop="creatorId" header-align="center" align="center" label="修改人ID">
        </el-table-column> -->
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
  import Apply from '@/api/customer/apply'
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
          Apply.list({
            page: this.pageIndex,
            limit: this.pageSize, 
            dealUserId: this.selectId
          }).then(res => {
            if (res.data && res.data.code === 0) {
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



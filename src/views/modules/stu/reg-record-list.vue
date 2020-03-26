<template>
  <div>
      <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
        <el-table-column type="index" header-align="center" align="center" label="NO" width="80">
        </el-table-column>
        <el-table-column prop="regId" header-align="center" align="center" width="160" label="报名表编号">
        </el-table-column>
        <el-table-column prop="readStatus" header-align="center" align="center" label="在读状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.readStatus === 1" size="small" type="success">在读</el-tag>
            <el-tag v-if="scope.row.readStatus === 2" size="small" type="danger">休学</el-tag>
            <el-tag v-if="scope.row.readStatus === 3" size="small">毕业</el-tag>
            <el-tag v-if="scope.row.readStatus === 4" size="small"  type="info">作废</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="tableId" header-align="center" align="center" width="160" label="来源ID">
        </el-table-column>
        <el-table-column prop="createTime" header-align="center" align="center" label="创建时间" :formatter="dateFormatter">
        </el-table-column>
        <el-table-column prop="tableName" header-align="center" align="center" label="来源依据">
        </el-table-column>
        <el-table-column prop="creatorId" header-align="center" align="center" label="修改人ID">
        </el-table-column>
        <el-table-column prop="remark" header-align="center" align="center" label="备注">
        </el-table-column>
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
  import { handleRecordList } from '@/api/reg'
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
          handleRecordList(this.pageIndex, this.pageSize, this.selectId).then(res => {
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



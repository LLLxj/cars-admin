<template>
    <el-dialog
			title="审核记录"
			:close-on-click-modal="false"
			:visible.sync="visible">
			<div>
				<el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
					<el-table-column type="index" header-align="center" align="center" label="NO" width="80">
					</el-table-column>
					<el-table-column prop="examineUserName" header-align="center" align="center" width="160" label="审核人名称">
					</el-table-column>
					<el-table-column prop="examineRemark" header-align="center" align="center" label="审核理由">
					</el-table-column>
					<el-table-column prop="examineTime" header-align="center" align="center" label="审核时间">
					</el-table-column>
				</el-table>
				<!-- <el-pagination
					@size-change="sizeChangeHandle"
					@current-change="currentChangeHandle"
					:current-page="pageIndex"
					:page-sizes="[10, 20, 50, 100]"
					:page-size="pageSize"
					:total="totalPage"
					layout="total, sizes, prev, pager, next, jumper">
					</el-pagination> -->
			</div>
    </el-dialog>
</template>

<script>
  import Baozhengjin from '@/api/customer/baozhengjin'
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
    methods: {
      init (id) {
				this.selectId = id
        this.getDataList()
      },
      getDataList () {
        this.dataListLoading = true
        this.visible = true
				Baozhengjin.recordList(this.selectId).then(res => {
					if (res.data && res.data.code === 0) {
						this.dataList = res.data.data
						this.totalPage = res.data.totalCount
						this.pageIndex = res.data.currPage
					} else {
							this.dataList = []
							this.totalPage = 0
					}
					this.dataListLoading = false
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
      dateFormatter (row, column, cellValue) {
        return dateSubstring(cellValue)
      }
    }
  }
</script>



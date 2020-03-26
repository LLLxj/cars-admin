<template>
  <div>
      <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
        <el-table-column type="index"  align="center" header-align="center" />
        <el-table-column prop="stuName" header-align="center" align="center" label="姓名"/>
        <el-table-column prop="stuPhone" header-align="center" align="center" label="手机"/>
        <el-table-column prop="classTypeName" header-align="center" align="center" label="报名班型"/>
        <el-table-column prop="regNo" header-align="center" align="center" label="报名表号"/>
        <el-table-column prop="stuSex" header-align="center" align="center" label="性别">
          <template slot-scope="scope">
            <span v-if="scope.row.atteType  === 0" type="text" size="small">女</span>
            <span v-else size="small" type="text">男</span>
          </template>
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
  import { classGetStuInfo } from '@/api/class'

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
          classGetStuInfo(this.selectId, this.pageIndex, this.pageSize).then(res => {
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
      }
    }
  }
</script>



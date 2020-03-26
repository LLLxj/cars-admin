<template>
  <el-dialog
    :title="'职位'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    >
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.jobName" placeholder="职位名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="selectHandle()">确定</el-button>
        <el-button type="danger" @click="cancleHandle()" >取消</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      highlight-current-row
      @row-dblclick="handleRowDblclick"
      @row-click="handleRowlclick"
      style="width: 100%;">
      <el-table-column type="index" header-align="center" align="center" label="NO" width="80">
      </el-table-column>
      <el-table-column prop="jobName" header-align="center" align="center" label="职位名称">
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 10px;"
      @size-change="sizeChangeHandle" background
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        dataList: [],
        dataListLoading: false,
        visible: false,
        dataForm: {
          jobId: '',
          jobName: ''
        },
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
      }
    },
    methods: {
      init () {
        // 清空查询条件
        this.dataForm.jobName = ''
        // 清空选中条件
        this.clearDataJob()
        // 显示弹窗
        this.visible = true
        // 加载列表数据
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/cos/job/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'jobName': this.dataForm.jobName
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      clearDataJob () {
        this.dataForm.jobId = ''
        this.dataForm.jobName = ''
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
      // 双击事件
      handleRowDblclick (val, row) {
        this.selectHandle()
      },
      // 单击事件
      handleRowlclick (row) {
        this.dataForm.jobId = row.jobId
        this.dataForm.jobName = row.jobName
      },
      // 确认
      selectHandle () {
        if (this.dataForm.jobId == '') {
          this.$message.error('请选择职位!')
          return
        }
        this.$emit('job-pop-event', this.dataForm.jobId, this.dataForm.jobName)
        this.visible = false
      },
      // 取消
      cancleHandle () {
        this.visible = false
      }
    }
  }
</script>

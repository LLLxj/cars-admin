<template>
  <div class="mod-user">
    <el-dialog title="时点列表" :close-on-click-modal="false" :visible.sync="visible" append-to-body>
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.wepName" placeholder="请输入时点名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle"  @row-dblclick="handleRowDblclick"
        @row-click="handleRowlclick" style="width: 100%;">
        <el-table-column type="index" header-align="center" align="center" label="NO" width="80">
        </el-table-column>
        <!-- <el-table-column prop="wepId" header-align="center" align="center" width="150" label="NO">
        </el-table-column> -->
        <el-table-column prop="wepName" header-align="center" align="center" label="时点名称">
        </el-table-column>
        <!-- <el-table-column prop="courseContCount" header-align="center" align="center" label="基础课次">
        </el-table-column> -->
      </el-table>
      <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" background :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
        :total="totalPage"
         style="margin-top: 10px;"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
  import { timePointList } from '@/api/timePoint'

  export default {
    data () {
      return {
        dataForm: {
          wepId:'',
          wepName: ''

        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        visible:false,
        dialogFormVisible:false,

      }
    },
    activated () {
      this.getDataList()
    },
    methods: {
      init () {
        // 清空查询条件
        this.dataForm.wepName = ''
        // 显示弹窗
        this.visible = true
        // 加载列表数据
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = false
        timePointList(this.pageIndex,this.pageSize,this.dataForm.wepName).then(res => {
          if(res.data && res.data.code === 0){
            this.dataList = res.data.page.list
            this.totalPage = res.data.page.totalCount
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
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
       // 双击事件
      handleRowDblclick (val, row) {
        this.selectHandle()
      },
      // 单击事件
      handleRowlclick (row) {
        this.dataForm.wepId = row.wepId
        this.dataForm.wepName = row.wepName
      },
      // 确认
      selectHandle () {
        if (this.dataForm.wepId == '') {
          this.$message.error('请选择时点!')
          return
        }
        this.$emit('timePoint-pop-event', this.dataForm.wepId, this.dataForm.wepName)
        this.visible = false
      },
      // 取消
      cancleHandle () {
        this.visible = false
      }
    }
  }
</script>

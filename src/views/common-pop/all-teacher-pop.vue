<template>
  <el-dialog title="招生老师" :close-on-click-modal="false" :visible.sync="visible" append-to-body width="500px">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.username" placeholder="昵称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="selectHandle()">确定</el-button>
        <el-button type="danger" @click="cancleHandle()" >取消</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" highlight-current-row @row-dblclick="handleRowDblclick" @row-click="handleRowlclick" style="width: 100%;">
      <el-table-column type="index" header-align="center" align="center" />
      <el-table-column prop="username" header-align="center" align="center" label="昵称"/>
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
   import { getAllTeacherList } from '@/api/sys'

  export default {
    data () {
      return {
        dataList: [],
        dataListLoading: false,
        visible: false,
        dataForm: {
          username: '',
          userId: ''
        },
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0
      }
    },
    methods: {
      init () {
        // 清空查询条件
        this.dataForm.username = ''
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
        getAllTeacherList(this.pageIndex, this.pageSize, this.dataForm.username).then(res => {
          if (res.data && res.data.code === 0) {
            this.dataList = res.data.data.list
            this.totalPage = res.data.data.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      clearDataJob () {
        this.dataForm.userId = ''
        this.dataForm.username = ''
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
        this.dataForm.userId = row.userId
        this.dataForm.username = row.username
      },
      // 确认
      selectHandle () {
        // if (this.dataForm.userId == '') {
        //   this.$message.error('招生老师!')
        //   return
        // }
        this.$emit('all-teacher-pop-event', this.dataForm.userId, this.dataForm.username)
        this.visible = false
      },
      // 取消
      cancleHandle () {
        this.visible = false
      }
    }
  }
</script>

<template>
  <el-dialog title="销售老师" :close-on-click-modal="false" :visible.sync="visible" append-to-body>
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.username" placeholder="老师" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="selectHandle()">确定</el-button>
        <el-button type="danger" @click="cancleHandle()" >取消</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" highlight-current-row @row-dblclick="handleRowDblclick" @row-click="handleRowlclick" style="width: 100%;">
      <el-table-column type="index" label="NO" align="center" header-align="center" width="80">
      </el-table-column>
      <el-table-column prop="username" header-align="center" align="center" label="老师">
      </el-table-column>
      <el-table-column prop="schoolName" header-align="center" align="center" label="所属校区">
      </el-table-column>
      <el-table-column prop="mobile" header-align="center" align="center" label="联系电话">
      </el-table-column>
      <el-table-column prop="email" header-align="center" align="center" label="邮箱">
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
 import { xsTeacherList } from '@/api/sys'

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
        this.dataForm.username = undefined
        // 清空选中条件
        // this.clearDataTeacher()
        // 显示弹窗
        this.visible = true
        // 加载列表数据
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        xsTeacherList(this.pageIndex, this.pageSize, this.dataForm.username).then(res => {
          if (res.data && res.data.code === 0) {
            if (res.data && res.data.code === 0) {
              this.dataListLoading = false
              this.dataList = res.data.data.list
              this.totalPage = res.data.data.totalCount
            } else {
              this.dataList = []
              this.totalPage = 0
            }
            this.dataListLoading = false
          } else {
            this.$message.error(res.data.msg)
          }
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
      // 双击事件
      handleRowDblclick (val, row) {
        this.selectHandle()
      },
      // 单击事件
      handleRowlclick (row) {
        this.dataForm.username = row.username
        this.dataForm.userId = row.userId
      },
      // 确认
      selectHandle () {
        if (this.dataForm.userId === '') {
          this.$message.error('请选择销售老师!')
          return
        }
        this.$emit('xs-pop-event', this.dataForm.userId, this.dataForm.username)
        this.visible = false
      },
      // 取消
      cancleHandle () {
        this.visible = false
      }
    }
  }
</script>

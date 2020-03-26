<template>
  <el-dialog title="商机" :close-on-click-modal="false" :visible.sync="visible" append-to-body>
    <el-form :inline="true" :model="dataForm" :rules="dataRule" ref="dataForm"  @keyup.enter.native="getDataList()">
      <el-form-item label="昵称" prop="username">
        <el-input v-model="dataForm.username" placeholder="昵称" clearable></el-input>
      </el-form-item>
      <el-form-item label="电话号码" prop="phone">
        <el-input v-model="dataForm.phone" placeholder="电话号码" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="selectHandle()">确定</el-button>
        <el-button type="danger" @click="cancleHandle()" >取消</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" highlight-current-row @row-dblclick="handleRowDblclick" @row-click="handleRowlclick" style="width: 100%;">
      <el-table-column type="index" header-align="center" align="center" />
      <el-table-column prop="customerId" header-align="center" align="center" label=" 商机编号"/>
      <el-table-column prop="name" header-align="center" align="center" label="昵称"/>
      <el-table-column prop="phone" header-align="center" align="center" label="手机号"/>
      <el-table-column prop="userName" header-align="center" align="center" label="电邀老师"/>
      <el-table-column label="招生老师" prop="teacherEntities" header-align="center" align="center" width="180">
        <template slot-scope="scope">
          <el-tag v-for="site in scope.row.teacherEntities" :key="site.userId" :label="site.userName" :value="site.userId">
            {{site.userName}}
          </el-tag>
        </template>
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
   import { businessList } from '@/api/reg'

  export default {
    data () {
      return {
        dataList: [],
        dataListLoading: false,
        visible: false,
        dataForm: {
          username: '',
          userId: '',
          phone: '',
          id: '',
          customerId: ''
        },
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataRule: {
          // username: [
          //   { required: true, message: '查询条件(姓名)不能为空', trigger: 'blur' }
          // ],
          // phone: [
          //   { required: true, message: '查询条件(电话号码)', trigger: 'blur' }
          // ]
        }
      }
    },
    methods: {
      init () {
        // 清空列表数据
        this.dataList = []
        // 清空选中条件
        this.clearDataJob()
        // 显示弹窗
        this.visible = true
        // 加载列表数据
        // this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        businessList(this.dataForm.username,this.dataForm.phone).then(res => {
          if (res.data && res.data.code === 0) {
            this.dataList = res.data.data
            this.totalPage = res.data.data.length
          } else {
            this.dataList = []
            this.totalPage = 0
            this.$message({
              message: '请选择查询条件',
              type: 'warning',
              duration: 1500,
            })
          }
          this.dataListLoading = false
        })
      },
      clearDataJob () {
        this.dataForm.userId = ''
        this.dataForm.username = ''
        this.dataForm.phone = ''
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
        this.dataForm.customerId = row.customerId
        this.dataForm.id = row.id
      },
      // 确认
      selectHandle () {
        if (this.dataForm.customerId == '') {
          this.$message({
              message: '请选择商机',
              type: 'warning',
              duration: 1500,
            })
          return
        }
        this.$emit('business-pop-event', this.dataForm.customerId,this.dataForm.id)
        this.visible = false
      },
      // 取消
      cancleHandle () {
        this.visible = false
      }
    }
  }
</script>

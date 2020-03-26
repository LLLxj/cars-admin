<template>
 <el-dialog title="报名表列表" :close-on-click-modal="false" :visible.sync="visible" append-to-body>
      <el-main>
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item label="报名表号" prop="stuName">
            <el-input v-model="dataForm.regNo" placeholder="报名表号" clearable></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="stuPhone">
            <el-input v-model="dataForm.stuPhone" placeholder="请输入手机号码" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-if="isAuth('stu:reg:list')" @click="getDataList()">查询</el-button>
            <el-button @click="resetSearch()">重置</el-button>
            <el-button type="primary" @click="selectHandle()">确定</el-button>
            <el-button type="danger" @click="cancleHandle()" >取消</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" highlight-current-row @row-dblclick="handleRowDblclick" @row-click="handleRowlclick" style="width: 100%;">
          <!--展示列-->
          <el-table-column type="index" align="center" header-align="center" width="80" label="NO"/>
          <el-table-column prop="regNo" header-align="center" align="center" label="报名表号"/>
          <el-table-column prop="stuName" header-align="center" align="center" label="姓名"/>
          <el-table-column prop="stuPhone" header-align="center" align="center" label="手机"/>
          <el-table-column prop="classTypeName" header-align="center" align="center" label="报读班型"/>
          <el-table-column prop="schoolName" header-align="center" align="center" label="校区"/>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" background :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
          :total="totalPage" layout="total, sizes, prev, pager, next, jumper" style="margin-top: 10px;">
        </el-pagination>
      </el-main>
 </el-dialog>


</template>
<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
<script>
  import { regList } from '@/api/reg'

  export default {
    data () {
      return {
        dataForm: {
          regNo: undefined,
          regId: undefined,
          stuPhone: undefined,
          stuName: undefined,
        },
        rowData: [],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        visible:false,
        dataListLoading: false,
      }
    },

    activated () {
      this.getDataList()
    },
    methods: {
       init () {
        // 清空查询条件
        this.resetSearch()
        // 清空选中条件
        this.clearDataReg()
        // 显示弹窗
        this.visible = true
        // 加载列表数据
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        // 查询
        regList(this.pageIndex, this.pageSize, this.dataForm.regNo, this.dataForm.stuPhone).then(res => {
          if (res.data && res.data.code === 0) {
            this.dataList = res.data.data.list
            this.totalPage = res.data.data.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        }).catch(err => {
          console.log(err)
        })
      },
      // 重置查询条件
      resetSearch () {
        this.dataForm.regNo = undefined
        this.dataForm.stuPhone = undefined
        this.getDataList()
      },
      clearDataReg () {
        this.dataForm.regId = ''
        this.dataForm.regNo = ''
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
        this.rowData = row
        this.dataForm.regId = row.regId
        this.dataForm.regNo = row.regNo
        this.dataForm.stuName = row.stuName
      },
      // 确认
      selectHandle () {
        if (this.dataForm.regId == '') {
          this.$message.error('请选择报名表!')
          return
        }
        this.$emit('regPop-pop-event', this.dataForm.regId,this.dataForm.regNo,this.rowData)
        this.visible = false
      },
      // 取消
      cancleHandle () {
        this.visible = false
      },
    }
  }
</script>

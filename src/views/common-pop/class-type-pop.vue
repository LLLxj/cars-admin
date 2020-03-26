<template>
<div>
  <div>
   <el-dialog title="班型列表" :close-on-click-modal="false" :visible.sync="visible" append-to-body>
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.classTypeName" placeholder="班型名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="selectHandle()">确定</el-button>
        <el-button type="danger" @click="cancleHandle()" >取消</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="dataList" border v-loading="dataListLoading" highlight-current-row @row-dblclick="handleRowDblclick" @row-click="handleRowlclick" style="width: 100%;">
      <el-table-column type="index"  align="center" header-align="center" width="80" label="NO">
      </el-table-column>
      <!-- <el-table-column prop="classTypeId" label="ID" align="center" header-align="center" width="200">
      </el-table-column> -->
      <el-table-column prop="classTypeName" header-align="center" align="center" label="班型名称">
      </el-table-column>
      <el-table-column prop="classTypePrice" header-align="center" align="center" label="班型价格">
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
  </div>
</div>
</template>

<script>

  import ClassType from '@/api/classType'

  export default {
    data () {
      return {
        dataList: [],
        dataListLoading: false,
        visible: false,
        dataForm: {
          classTypeName:undefined,
          classTypeId: '',
          classTypePrice:''
        },
        dataCopy:[],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
      }
    },
    methods: {
      init () {
        this.visible = true
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        ClassType.list(this.pageIndex,this.pageSize,this.dataForm.classTypeName).then(res => {
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
      addHandle () {
        this.addVisable = true
      },

      // 双击事件
      handleRowDblclick (val, row) {
        this.selectHandle()
      },
      // 单击事件
      handleRowlclick (row) {
        this.dataForm.classTypeId = row.classTypeId
        this.dataForm.classTypeName = row.classTypeName
        this.dataForm.classTypePrice = row.classTypePrice
      },
      // 确认
      selectHandle () {
        if (this.dataForm.classTypeId == '') {
          this.$message.error('请选择班型!')
          return
        }
        this.$emit('classType-pop-event', this.dataForm.classTypeId,this.dataForm.classTypeName,this.dataForm.classTypePrice)
        this.visible = false
        this.dataForm.classTypeName = ''
      },
      // 取消
      cancleHandle () {
        this.visible = false
      }
    }
  }
</script>

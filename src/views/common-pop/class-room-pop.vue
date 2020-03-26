<template>
<div>
  <div>
   <el-dialog title="教室" :close-on-click-modal="false" :visible.sync="visible" append-to-body>
      <el-main>
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item>
            <el-input v-model="dataForm.croomName" placeholder="请输入教室名称" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList()">查询</el-button>
            <el-button type="primary" @click="selectHandle()">确定</el-button>
            <el-button type="danger" @click="cancleHandle()" >取消</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" @row-dblclick="handleRowDblclick" @row-click="handleRowlclick" @selection-change="selectionChangeHandle" style="width: 100%;">
          <el-table-column type="index" label="NO" align="center" header-align="center" width="80"/>
          <el-table-column prop="croomName" header-align="center" align="center" label="名称"/>
          <el-table-column prop="croomStatus" header-align="center" align="center" label="状态">
              <template slot-scope="scope">
                  <el-tag v-if="scope.row.croomStatus === 0" size="small" type="danger">禁用</el-tag>
                  <el-tag v-else size="small">正常</el-tag>
                </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" background @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
          :total="totalPage"
           style="margin-top: 10px;"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </el-main>
    </el-dialog>
  </div>
</div>
</template>

<script>

  import { classRoomList } from '@/api/classroom'

  export default {
    data () {
      return {
        dataForm: {
          croomName:undefined,
          croomId:''
        },
        visible:false,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        dialogFormVisible:false
      }
    },
    methods: {
    init () {
        this.visible = true
        this.dataForm.croomName = ''
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        classRoomList(this.pageIndex, this.pageSize, this.dataForm.croomName, null).then(res => {
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
        console.log(val)
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      //  修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.AddOrUpdateClassRoom.init(id)
        })
      },
       // 双击事件
      handleRowDblclick (val, row) {
        this.selectHandle()
        // console.log(1)
      },
      // 单击事件
      handleRowlclick (row) {
        this.dataForm.croomId = row.croomId
        this.dataForm.croomName = row.croomName
      },
      // 确认
      selectHandle () {
        if (this.dataForm.croomId == '') {
          this.$message.error('请选择教室!')
          return
        }
        this.$emit('classRoom-pop-event', this.dataForm.croomId,this.dataForm.croomName)
        this.visible = false
      },
      // 取消
      cancleHandle () {
        this.visible = false
      }
    }
  }
</script>

<template>

    <el-dialog title="排课列表" :close-on-click-modal="false" :visible.sync="visible" append-to-body>
        <el-form :inline="true" :model="dataCplan" @keyup.enter.native="getDataList()">
          <el-form-item>
            <el-input v-model="dataCplan.cplanName" placeholder="请输入排课计划名称" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList()">查询</el-button>
            <el-button type="primary" @click="selectHandle()">确定</el-button>
            <el-button type="danger" @click="cancleHandle()" >取消</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" highlight-current-row
      @row-dblclick="handleRowDblclick" @row-click="handleRowlclick" style="width: 100%;">
          <el-table-column type="index" label="NO" align="center" header-align="center" width="80">
          </el-table-column>
          <el-table-column prop="cplanName" header-align="center" align="center" width="200" label="名称">
          </el-table-column>
          <el-table-column prop="schoolName" header-align="center" align="center" label="所属校区">
          </el-table-column>
          <el-table-column prop="firstDate" header-align="center" align="center" label="开班时间" :formatter="dateFormatter">
          </el-table-column>
          <el-table-column prop="endDate" header-align="center" align="center" label="结课时间" :formatter="dateFormatter">
          </el-table-column>
          <el-table-column prop="cpalnStatus" header-align="center" align="center" width="100" label="状态">
              <template slot-scope="scope">
                  <span v-if="scope.row.classStatus === 2" size="small" type="danger">禁用</span>
                  <span v-else size="small">正常</span>
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

  import { cplanList } from '@/api/cplan'
  import { regGetInClass } from '@/api/reg'

  export default {
    data () {
      return {
        dataForm: {
          courseId: '',
          cplanId: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        visible:false,
        dataListLoading: false,
        dataListSelections: [],
        dialogFormVisible:false,
        selectRegCourseId: '',
        dataCplan: {
          cplanId:'',
          cplanName: undefined
        },
      }
    },
    activated () {
      this.getDataList()
    },
    methods: {
      init (id) {
        this.selectRegCourseId = id
        this.dataCplan.cplanName = ''
        this.visible = true
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        regGetInClass(this.pageIndex,this.pageSize,this.selectRegCourseId,this.dataCplan.cplanName).then(res => {
          if(res.data && res.data.code === 0){
            this.dataList = res.data.data.list
            this.totalPage = res.data.data.totalCount
          }else {
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
      // 双击事件
      handleRowDblclick (val, row) {
        this.selectHandle()
      },
      // 单击事件
      handleRowlclick (row) {
        this.dataCplan.cplanId = row.cplanId
        this.dataCplan.cplanName = row.cplanName
      },
      // 确认
      selectHandle () {
        if (this.dataCplan.cplanId == '') {
          this.$message.error('请选择课次!')
          return
        }
        this.$emit('cplan-pop-event', this.dataCplan.cplanId, this.selectRegCourseId)
        this.visible = false
      },
      // 取消
      cancleHandle () {
        this.visible = false
      },
      dateFormatter (row, column, cellValue) {
        return cellValue ? cellValue.substring(0, 10) : '-'
      },

    }
  }
</script>

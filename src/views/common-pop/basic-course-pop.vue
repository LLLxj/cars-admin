<template>
<div>
  <div>
   <el-dialog title="课程科目列表" :close-on-click-modal="false" :visible.sync="visible" append-to-body>
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.courseName" placeholder="课程科目名称" clearable></el-input>
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
      <!-- <el-table-column prop="courseId" label="ID" align="center" header-align="center" width="200">
      </el-table-column> -->
      <el-table-column prop="courseName" header-align="center" align="center" label="课程科目名称">
      </el-table-column>
      <el-table-column prop="courseContCount" header-align="center" align="center" label="基础课次">
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

  import { courseContList, courseContSave, courseContDelete, courseContUpdate} from '@/api/basicCourse'
  import Course from '@/api/course'

  export default {
    data () {
      return {
        dataList: [],
        dataListLoading: false,
        addVisable:false,
        updateVisable:false,
        visible: false,
        basicCourseVisable:false,
        basicCourseAddVisable:false,
        courseName: undefined,
        dataForm: {
          courseContCount:'',
          courseName: undefined,
          courseId:'',
        },
        addDataForm: {
          classTypeId:'',
          courseName:'',
          courseId:'',

        },
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
      }
    },
    methods: {
      init () {
        this.visible = true
        this.resetSearch()
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        Course.list(this.pageIndex,this.pageSize,this.dataForm.courseName).then(res => {
          if (res.data && res.data.code === 0) {
            console.log(res)
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
        this.dataForm.courseName = undefined
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
        this.dataForm.courseId = row.courseId
        this.dataForm.courseName = row.courseName
      },
      // 确认
      selectHandle () {
        if (this.dataForm.courseId == '') {
          this.$message.error('请选择课程!')
          return
        }
        this.$emit('classType-pop-event', this.dataForm.courseId,this.dataForm.courseName)
        this.visible = false
      },
      // 取消
      cancleHandle () {
        this.visible = false
      }
    }
  }
</script>

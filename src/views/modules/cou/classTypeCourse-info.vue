<template>
<div>
  <div>
   <el-dialog title="课程科目列表" :close-on-click-modal="false" :visible.sync="visible" append-to-body>
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <template slot-scope="scope">
          <el-button v-if="isAuth('cou:classTypeCourse:save')" type="primary" @click="addClassTypeCourse()">新增</el-button>
        </template>
      </el-form-item>
    </el-form>

    <el-table :data="dataList" border v-loading="dataListLoading" highlight-current-row style="width: 100%;">
      <el-table-column type="index" label="排序" align="center" width="80" header-align="center">
      </el-table-column>
      <!-- <el-table-column prop="classTypeCourseId" label="ID" align="center" header-align="center">
      </el-table-column> -->
      <el-table-column prop="courseName" header-align="center" align="center"  label="基础课次">
      </el-table-column>
      <el-table-column  header-align="center" align="center" width="200" label="操作">
        <template slot-scope="scope">
          <!-- <el-button type="text" size="small" @click="updateHandle(scope.row.classTypeCourseId)">编辑</el-button> -->
          <el-button v-if="isAuth('cou:classTypeCourse:delete')" type="text" size="small" @click="deleteHandle(scope.row.classTypeCourseId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex" background
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <!-- 弹窗, 新增 / 修改 -->
    <addClassTypeCourse v-if="addClassTypeCourseVisiable" ref="addClassTypeCourse" @refreshDataList="getDataList" @classType-pop-event="callBackClassType"></addClassTypeCourse>

   </el-dialog>
  </div>



</div>
</template>

<script>
  import { classTypeCourseList, classTypeCourseInfo, classTypeCourseSave, classTypeCourseListUpdate, classTypeCourseListDelete } from '@/api/classTypeCourse'
  import addClassTypeCourse from '@/views/common-pop/basic-course-pop'

  export default {

    data () {
      return {
        dataList: [],
        dataListLoading: false,
        addVisable: false,
        updateVisable: false,
        visible: false,
        addClassTypeCourseVisiable: false,
        dataForm: {
          courseContId: '',
          courseContName: '',
          courseId: '',
          norder: '',
          courseName: '',
          classTypeId: ''
        },
        dataCopy: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0
      }
    },
    components: {
      addClassTypeCourse
    },
    methods: {
      init (id) {
        this.dataForm.classTypeId = id || 0
        this.visible = true
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        classTypeCourseList(this.pageIndex, this.pageSize, this.dataForm.classTypeId).then(res => {
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
      addClassTypeCourse () {
        this.addClassTypeCourseVisiable = true
        this.$nextTick(() => {
          this.$refs.addClassTypeCourse.init()
        })
      },
      // 添加基础课次回调
      callBackClassType (courseId, courseName) {
        this.dataForm.courseName = courseName
        this.dataForm.courseId = courseId
        classTypeCourseSave({
          'courseId': this.dataForm.courseId,
          'courseName': this.dataForm.courseName,
          'classTypeId': this.dataForm.classTypeId
        }).then(res => {
          if (res.data && res.data.code === 0) {
            this.getDataList()
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
      },

      // 删除
      deleteHandle (id) {
        this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          classTypeCourseListDelete(id).then(res => {
            if (res.data && res.data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }).catch(() => {
        })
      }
    }
  }
</script>

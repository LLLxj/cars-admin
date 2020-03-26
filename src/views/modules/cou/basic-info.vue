<template>
<div>
  <div>
   <el-dialog title="基础课次列表" :close-on-click-modal="false" :visible.sync="visible" append-to-body width="700px">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <template slot-scope="scope">
          <el-button v-if="isAuth('cou:coursecont:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        </template>
      </el-form-item>
    </el-form>

    <el-table :data="dataList" v-loading="dataListLoading" highlight-current-row style="width: 100%;">
      <el-table-column type="index" label="NO" align="center" header-align="center" width="80"/>
      <el-table-column prop="courseContName" header-align="center" align="center" label="基础课次"/>
      <el-table-column align="right" header-align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('cou:coursecont:update')" size="small" @click="addOrUpdateHandle(scope.row.courseContId)">编辑</el-button>
          <el-button type="danger" v-if="isAuth('cou:coursecont:delete')" @click="deleteHandle(scope.row.courseContId)">删除</el-button>
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
    <basicCoursePop v-if="basicCourseVisable" ref="basicCoursePop" @refreshDataList="getDataList"></basicCoursePop>
    <basicCourseHandle v-if="basicCourseHandleVisable" ref="basicCourseHandle" @refreshDataList="getDataList"></basicCourseHandle>
   </el-dialog>
  </div>
</div>
</template>

<script>
  import {courseContList, courseContSave, courseContDelete, courseContUpdate} from '@/api/basicCourse'
  import basicCoursePop from '@/views/common-pop/basic-course-pop'
  import basicCourseHandle from './basic-info-add-or-update'

  export default {
    data () {
      return {
        dataList: [],
        select: '',
        basicCourseHandleVisable: false,
        dataListLoading: false,
        addVisable: false,
        updateVisable: false,
        visible: false,
        basicCourseVisable: false,
        dataForm: {
          id: '',
          courseContId: '',
          courseContName: '',
          courseId: '',
          norder: ''
        },
        order: 'asc',
        dataCopy: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataRule: {
          courseContName: [
            {required: true, message: '基础课次名称不能为空', trigger: 'blur'}
          ],
        }
      }
    },
    components: {
      basicCoursePop, basicCourseHandle
    },
    methods: {
      handleEdit(index, row) {
        // console.log(index, row);
      },
      handleDelete(index, row) {
        // console.log(index, row);
      },
      init (id) {
        this.select = id
        this.dataForm.id = id || 0
        this.dataForm.courseId = id
        this.visible = true
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        courseContList(this.pageIndex, this.pageSize, this.dataForm.id, this.order).then(res => {
          if (res.data && res.data.code === 0) {
            this.dataList = res.data.data.list
            this.totalPage = res.data.data.totalCount
            this.dataCopy = res.data.data.list
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        }).catch(err => {
          console.log(err)
        })
      },
      // 新增编辑操作
      addOrUpdateHandle (id) {
        var courseId = this.select
        this.basicCourseHandleVisable = true
        this.$nextTick(() => {
          this.$refs.basicCourseHandle.init(id, courseId)
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
      updateHandle (id) {
        this.updateVisable = true
        this.$http({
          url: this.$http.adornUrl(`/cou/courseCont/info/${id}`),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.updateDataForm.courseContName = data.data.courseContName
            this.updateDataForm.norder = data.data.norder
            this.updateDataForm.courseContId = data.data.courseContId
            this.updateDataForm.courseId = data.data.courseId
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
          courseContDelete(id).then(res => {
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
              this.$message.error(res.msg)
            }
          })
        }).catch(() => {
        })
      }
    }
  }
</script>

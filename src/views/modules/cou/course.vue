<template>
  <div class="mod-user">
    
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>科目档案</span>
      </div>
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.courseName" placeholder="请输入课程节目名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-if="isAuth('cou:course:list')" @click="getDataList()">查询</el-button>
          <el-button v-if="isAuth('cou:course:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
          <el-button type="info" :loading="downloadLoading" @click="exportHandle()">导出</el-button>
        </el-form-item>
      </el-form>
      <el-col :span="24" style="padding-bottom:10px;">
        <div class="course-wrap">
          <el-table :data="dataList" border stripe v-loading="dataListLoading" @selection-change="selectionChangeHandle"
          @current-change="handleCurrentChange" style="width: 100%;" highlight-current-row id="dataListCourse">
            <el-table-column type="index" label="NO" align="center" header-align="center" width="80" fixed/>
            <el-table-column prop="courseName" header-align="center" align="center" label="课程科目"/>
            <el-table-column prop="courseContCount" header-align="center" align="center" label="基础课次"/>
            <el-table-column prop="coursePrice" header-align="center" align="center" label="课程总价"/>
            <el-table-column prop="courseUnitPrice" header-align="center" align="center" label="课程单据"/>
            <el-table-column fixed="right" header-align="center" align="center" width="200" label="操作">
              <template slot-scope="scope">
                <el-button v-if="isAuth('cou:course:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.courseId)">编辑</el-button>
                <el-button v-if="isAuth('cou:course:delete')" type="text" size="small" @click="deleteHandle(scope.row.courseId)">删除</el-button>
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
        </div>
      </el-col>
    </el-card>

    <!-- <el-card class="box-card box-card-bot" v-if="basicCourseVisible">
      <div slot="header" class="clearfix">
        <span>基础课次</span>
      </div>
      <el-col :span="24" style="padding-bottom:10px;">
        <div class="bot-course"> -->
          <!-- 基础课次 -->
          <!-- <el-table :data="dataListBasicCourse" border v-loading="dataListLoading" highlight-current-row style="width: 100%;">
            <el-table-column type="index" label="NO" align="center" width="80" header-align="center">
            </el-table-column>
            <el-table-column prop="courseContName" header-align="center" align="center"  label="基础课次">
            </el-table-column>
          </el-table> -->
        <!-- </div>
      </el-col>
    </el-card>  -->
    
    <!-- 弹窗, 新增 / 修改 -->
    <AddOrUpdateCourse v-if="addOrUpdateVisible" ref="AddOrUpdateCourse" @refreshDataList="refreshDataList"></AddOrUpdateCourse>

    <!-- 基础课次 -->
    <basicCoursePop v-if="basicCoursePopVisable" ref="basicCoursePop" @refreshDataList="getDataList"></basicCoursePop>

  </div>
</template>

<script>
  import AddOrUpdateCourse from './course-add-or-update'
  import Course from '@/api/course'
  import basicCoursePop from './basic-info'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'

  export default {
    data () {
      return {
        dataForm: {
          courseName: '',
          courseId: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        downloadLoading: false,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        dialogFormVisible: false,
        basicCoursePopVisable: false,
        basicCourseVisible: false,
        selectRow: [],
        // 基础课次
        dataListBasicCourse: []
      }
    },
    components: {
      AddOrUpdateCourse, basicCoursePop
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        Course.list(this.pageIndex, this.pageSize, this.dataForm.courseName).then(res => {
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
      async refreshDataList () {
        await this.getDataList()
        this.handleCurrentChange(this.selectRow)
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
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      //   基础课次操作
      basicCourse (id) {
        this.basicCoursePopVisable = true
        this.$nextTick(() => {
          this.$refs.basicCoursePop.init(id)
        })
      },
      // 导出操作
      exportHandle () {
        var fix = document.querySelector('.el-table__fixed');
        var wb;
        if (fix) {
          wb = XLSX.utils.table_to_book(document.querySelector('#dataListCourse').removeChild(fix));
          document.querySelector('#dataListCourse').appendChild(fix);
        } else {
          wb = XLSX.utils.table_to_book(document.querySelector('#dataListCourse'));
        }
        /* get binary string as output */
        var wbout = XLSX.write(wb, {
          bookType: 'xlsx',
          bookSST: true,
          type: 'array'
        });
        try {
          FileSaver.saveAs(
            new Blob([wbout], {
              type: 'application/octet-stream'
            }),
            '课程科目.xlsx'
          );
        } catch (e) {
          if (typeof console !== 'undefined') console.log(e, wbout);
        }
        return wbout;
      },
      //  新增,修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.AddOrUpdateCourse.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Course.delete(id).then(({data}) => {
            let {code, msg} = data
            if(code === 0){
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                  this.basicCourseVisible = false
                  this.selectRow = []
                }
              })
            } else {
              this.$message.error(msg)
            }
          })
        }).catch(() => {
        })
      },
      // 单行选中事件
      handleCurrentChange (val) {
        this.selectRow = val
        if(this.selectRow !== null){
          this.basicCourseVisible = true
          this.getBasicCourseInfo(this.selectRow.courseId)
          this.basicCourseVisible = true
        }
      },
      // 获取课程信息
      getBasicCourseInfo (data) {
        Course.info(data).then(({data}) => {
          let {code, msg, result} = data
          if(code === 0){
            this.dataListBasicCourse = result.couCourseContEntities
          } else {
            this.dataList = []
            this.totalPage = 0
          }
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .course-wrap{
    // height:400px;
    max-height:40vh;
    overflow: auto;
  }
  .bot-course{
    // max-height:15vh;
    overflow: auto;
  }
  .box-card-bot{
     margin-top:15px;
  }
</style>


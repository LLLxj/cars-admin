<template>
  <div class="mod-user">
    <el-card class="box-card" >
      <div slot="header" class="clearfix">
        <span>班型档案</span>
      </div>
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.classTypeName" placeholder="请输入班型名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-if="isAuth('cou:classType:list')" @click="getDataList()">查询</el-button>
          <el-button v-if="isAuth('cou:classType:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
          <el-button  type="info" :loading="downloadLoading" @click="exportHandle()">导出</el-button>
        </el-form-item>
      </el-form>
      <div class="course-wrap">
        <el-table :data="dataList" border stripe v-loading="dataListLoading" @selection-change="selectionChangeHandle" 
        @current-change="handleCurrentChange" style="width: 100%;" id="dataListClassType">
          <el-table-column type="index" label="NO" align="center" header-align="center" width="80" fixed/>
          <!-- <el-table-column prop="classTypeId" header-align="center" align="center" width="150" label="NO">
          </el-table-column> -->
          <el-table-column prop="classTypeName" header-align="center" align="center" label="班型">
          </el-table-column>
          <el-table-column prop="classTypePrice" header-align="center" align="center" label="价格">
          </el-table-column>

          <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
            <template slot-scope="scope">
              <el-button v-if="isAuth('cou:classType:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.classTypeId)">编辑</el-button>
              <!-- <el-button v-if="isAuth('cou:classTypeCourse:list')" type="text" size="small" @click="classTypeCourse(scope.row.classTypeId)">课程科目</el-button> -->
              <el-button v-if="isAuth('cou:classType:delete')" type="text" size="small" @click="deleteHandle(scope.row.classTypeId)">删除</el-button>
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
      
    </el-card>
  
    <el-card class="box-card box-card-bot" v-if="dataListCourseSubVisible">
      <div slot="header" class="clearfix">
        <span>课程科目</span>
      </div>
      <el-col :span="24" style="padding-bottom:10px;">
        <div class="bot-course">
          <!-- 基础课次 -->
          <el-table :data="dataListCourseSub" border v-loading="dataListLoading" highlight-current-row style="width: 100%;">
            <el-table-column type="index" label="NO" align="center" width="80" header-align="center">
            </el-table-column>
            <el-table-column prop="courseName" header-align="center" align="center" label="课程科目">
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-card>

    <!-- 新增班型弹窗 -->
    <addOrUpdate v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshGetDataList"></addOrUpdate>


    <!-- 课程科目 -->
    <classTypeCoursePop v-if="classTypeCoursePopVisible" ref="classTypeCoursePop" @refreshDataList="getDataList"></classTypeCoursePop>

  </div>
</template>

<script>
  import addOrUpdate from './classType-add-or-update'
  import ClassType from '@/api/classType'
  import classTypeCoursePop from './classTypeCourse-info'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'

  export default {
    data () {
      return {
        dataForm: {
          classTypeName: undefined,
        },
        adddClassTypeDataForm: {
          classTypeName: '',
          classTypePrice: '',
          classTypeId: ''
        },
        updateClassTypeDataForm: {
          classTypeName: '',
          classTypePrice: '',
          classTypeId: ''
        },
        downloadLoading: false,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        classTypeCoursePopVisible: false,
        addOrUpdateVisible: false,
        dialogFormVisible: false,
        selectRow: [],        
        // 课程科目
        dataListCourseSub: [],
        dataListCourseSubVisible: false
      }
    },
    components: {
      classTypeCoursePop, addOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        ClassType.list(this.pageIndex, this.pageSize, this.dataForm.classTypeName).then(res => {
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
      async refreshGetDataList () {
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
      // 单行选中事件
      handleCurrentChange (val) {
        this.selectRow = val
        if(this.selectRow !== null){
          this.dataListCourseSubVisible = true
          this.getCourseSubInfo(this.selectRow.classTypeId)
          this.basicCourseVisible = true
        }
      },
      getCourseSubInfo (data) {
        ClassType.info(data).then(({data}) => {
          let {code, msg, result} = data
          if(code === 0){
            this.dataListCourseSub = result.couClassTypeCourseEntities
          }
        })
      },
      // 新增编辑操作
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 课程科目
      classTypeCourse (id) {
        this.classTypeCoursePopVisible = true
        this.$nextTick(() => {
          this.$refs.classTypeCoursePop.init(id)
        })
      },
      // 导出操作
      exportHandle () {
        var fix = document.querySelector('.el-table__fixed');
        var wb;
        if (fix) {
          wb = XLSX.utils.table_to_book(document.querySelector('#dataListClassType').removeChild(fix));
          document.querySelector('#dataListClassType').appendChild(fix);
        } else {
          wb = XLSX.utils.table_to_book(document.querySelector('#dataListClassType'));
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
            '班型档案.xlsx'
          );
        } catch (e) {
          if (typeof console !== 'undefined') console.log(e, wbout);
        }
        return wbout;
      },
      // 删除
      deleteHandle (id) {
        this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ClassType.delete(id).then(res => {
            if (res.data && res.data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                  this.selectRow = []
                  this.dataListCourseSubVisible = false
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
<style lang="scss" scoped>
  .course-wrap{
    // height:400px;
    max-height:40vh;
    overflow: auto;
  }
  .box-card-bot{
    margin-top:15px;
  }
</style>


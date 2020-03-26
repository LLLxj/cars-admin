<template>
  <div class="mod-user">
    <!-- 布局容器 -->
    <el-container>

      <!-- 左侧 -->
      <el-aside width="320px">
        <schoolAllSidebar ref="schoolAllSidebar" @school-sidebar-node-change-event="schoolTreeChangeEvent"></schoolAllSidebar>
      </el-aside>

      <!-- 右侧 -->
      <el-main>
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item>
            <el-input v-model="dataForm.cplanName" placeholder="请输入排课计划名称" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-if="isAuth('cou:cplan:list')" @click="getDataList()" v-loading="dataListLoading">查询</el-button>
            <el-button v-if="isAuth('cou:cplan:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
            <!-- <el-button  type="danger" :loading="downloadLoading" @click="exportHandle()">导出</el-button> -->
            <el-button type="info" :loading="downloadLoading" @click="exportHandle()">导出</el-button>
            <!-- <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
          </el-form-item>
        </el-form>
        <el-table :data="dataList" border stripe v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;" id="dataList2">
          <!--隐藏列-->
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="ID"><span>{{ props.row.cplanId }}</span></el-form-item>
                <el-form-item label="课程ID"><span>{{ props.row.courseId }}</span></el-form-item>
                <el-form-item label="校区ID"><span>{{ props.row.schoolId }}</span></el-form-item>
                <el-form-item label="教务ID"><span>{{ props.row.liveTeacherId }}</span></el-form-item>
                <el-form-item label="创建用户ID"><span>{{ props.row.creatorId }}</span></el-form-item>
                <el-form-item label="创建时间"><span>{{ props.row.createTime }}</span></el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <!--展示列-->
          <el-table-column type="index" label="NO" align="center" header-align="center" width="80" fixed/>
          <el-table-column prop="cplanName" header-align="center" align="center" label="名称"/>
          <el-table-column prop="courseName" header-align="center" align="center" label="课程科目"/>
          <el-table-column prop="liveTeacherName" header-align="center" align="center" label="教务老师"/>
          <el-table-column prop="schoolName" header-align="center" align="center" label="所属校区" />
          <el-table-column prop="firstDate" header-align="center" align="center" label="开班时间" :formatter="dateFormatter"/>
          <el-table-column prop="endDate" header-align="center" align="center" label="结课时间" :formatter="dateFormatter"/>

          <el-table-column header-align="center" align="center" label="课程进度">
            <template slot-scope="scope">
              <div style="display:flex;justify-content:space-around;align-items: center;">
                <el-progress style="width:50%" :stroke-width="14" :show-text="false" :percentage="parseInt(scope.row.endCplanContNum*100/scope.row.allCplanContNum) || 0"
                 :status="scope.row.endCplanContNum==scope.row.allCplanContNum?'success':'text'"></el-progress>
                <span>{{scope.row.endCplanContNum +'/'+scope.row.allCplanContNum}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="cpalnStatus" header-align="center" align="center" width="80" label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.cpalnStatus === 1" size="small" type="success">正常</el-tag>
              <el-tag v-else size="small" type="danger">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" header-align="center" align="center" width="200" label="操作">
            <template slot-scope="scope">
              <el-button v-if="isAuth('cou:cplan:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.cplanId)">编辑</el-button>
              <el-button type="text" size="small" @click="classTimesHandle(scope.row.cplanId)">排课</el-button>
              <el-button type="text" size="small" @click="viewStuList(scope.row.cplanId)">学员</el-button>
              <el-button v-if="isAuth('cou:cplan:delete')" type="text" size="small" @click="deleteHandle(scope.row.cplanId)">删除</el-button>
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
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>

        <!-- 学员弹窗 -->
        <stuList v-if="stuListVisible" ref="stuList"></stuList>

        <!-- 排课弹窗 -->
        <classTimes v-if="classTimesVisiable" ref="classTimes" @refreshDataList="getDataList"></classTimes>

      </el-main>
    </el-container>
  </div>
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
  // 左边的树形下拉,需后台增加按校区查询
  import schoolAllSidebar from '../../common-sidebar/school-all-sidebar'
  import AddOrUpdate from './cplan-add-or-update'
  import stuList from './cplan-stuList'
  import classTimes from './class-times'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  import { cplanList, cplanDelete } from '@/api/cplan'

  export default {
    data () {
      return {
        dataForm: {
          cplanName: undefined,
          schoolId: undefined
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        downloadLoading: false,
        dataListLoading: false,
        dataListSelections: [],
        stuListVisible: false,
        addOrUpdateVisible: false,
        dialogFormVisible: false,
        classTimesVisiable: false
      }
    },
    components: {
      AddOrUpdate, classTimes, stuList, schoolAllSidebar
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        cplanList(this.pageIndex, this.pageSize, this.dataForm.cplanName, this.dataForm.schoolId).then(res => {
          if (res.data && res.data.code === 0) {
            this.dataList = res.data.data.list
            this.totalPage = res.data.data.totalCount
          }else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        }).catch(err => {
          console.log(err)
          this.dataListLoading = false
        })
      },
      dateFormatter (row, column, cellValue) {
        return cellValue ? cellValue.substring(0, 10) : '-'
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
      // 左边树形回调
      schoolTreeChangeEvent (schoolId, schoolName, schoolCode) {
        this.dataForm.schoolId = schoolId
        this.getDataList()
      },
      // 学员操作
      viewStuList (id) {
        this.stuListVisible = true
        this.$nextTick(() => {
          this.$refs.stuList.init(id)
        })
      },
      //  修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 学时操作
      classTimesHandle (id) {
        this.classTimesVisiable = true
        this.$nextTick(() => {
          this.$refs.classTimes.init(id)
        })
      },
      // 导出操作
      // exportHandle () {
      //   this.downloadLoading = true
      //   import('@/vendor/Export2Excel').then(excel => {
      //     const tHeader = ['名称', '课程科目', '班级', '所属校区', '开班时间', '结课时间', '状态']
      //     const filterVal = ['cplanName', 'courseName', 'className', 'schoolName', 'firstDate', 'endDate', 'cpalnStatus']
      //     const data = this.formatJson(filterVal, this.dataList)
      //     excel.export_json_to_excel({
      //       header: tHeader,
      //       data,
      //       filename: '班级档案'
      //     })
      //     this.downloadLoading = false
      //   })
      // },
      formatJson (filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      // 删除
      deleteHandle (id) {
        this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          cplanDelete(id).then(res => {
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
        }).catch(() => {})
      },
      // 导出
      exportHandle () {
        /* generate workbook object from table */
       // 判断要导出的节点中是否有fixed的表格，如果有，转换excel时先将该dom移除，然后append回去，
        var fix = document.querySelector('.el-table__fixed');
        var wb;
        if (fix) {
          wb = XLSX.utils.table_to_book(document.querySelector('#dataList2').removeChild(fix));
          document.querySelector('#dataList2').appendChild(fix);
        } else {
          wb = XLSX.utils.table_to_book(document.querySelector('#dataList2'));
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
            '班级档案.xlsx'
          );
        } catch (e) {
          if (typeof console !== 'undefined') console.log(e, wbout);
        }
        return wbout;
      }
    }
  }
</script>

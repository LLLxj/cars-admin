<template>
  <div class="mod-user">
    <!-- 布局容器 -->
    <el-container>

      <!-- 左侧 -->
      <!-- <el-aside>
        <schoolAllSidebar3 ref="schoolAllSidebar3" @school-sidebar-node-change-event="schoolTreeChangeEvent" />
      </el-aside> -->

      <!-- 右侧 -->
      <el-main>
          <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item label="学员">
            <el-input v-model="dataForm.stuName" placeholder="请输入学员名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="手机">
            <el-input v-model="dataForm.stuPhone" placeholder="请输入手机号" clearable></el-input>
          </el-form-item>
          <el-form-item label="身份证">
            <el-input v-model="dataForm.cardId" placeholder="请输入身份证号" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-if="isAuth('stu:user:list')" @click="getDataList()">查询</el-button>
            <el-button :disabled="isShow" @click="resetSearch()">重置</el-button>
            <el-button v-if="isAuth('stu:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
            <el-button type="info" :disabled="isShow" :loading="downloadLoading" @click="exportHandle()">导出</el-button>
            <el-button  type="danger" :loading="downloadLoading" @click="downloadHandle()">下载模板</el-button>
            <el-button type="primary" @click="uploadHandle()">上传文件</el-button>
          </el-form-item>
        </el-form>

        <el-table :data="dataList" border stripe v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;" id="dataListStuList">
           <!--隐藏列-->
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" class="demo-table-expand">
                <el-form-item label="联系人"><span>{{ props.row.contUserName }}</span></el-form-item>
                <el-form-item label="联系人电话"><span>{{ props.row.contUserPhone }}</span></el-form-item>
                <el-form-item label="联系人2"><span>{{ props.row.secondContUserName }}</span></el-form-item>
                <el-form-item label="联系人2电话"><span>{{ props.row.secondContUserPhone }}</span></el-form-item>
              </el-form>
            </template>
          </el-table-column>

          <!--展示列-->

          <el-table-column type="index" align="center" header-align="center" width="80" label="NO" fixed/>
          <el-table-column prop="stuName" header-align="center" align="center" width="120" label="姓名" fixed/>
          <el-table-column prop="cardId" header-align="center" align="center" label="身份证号"/>
          <el-table-column prop="stuPhone" header-align="center" align="center" width="150" label="学员联系方式"/>
          <el-table-column prop="stuUserAge" header-align="center" align="center" label="年龄" width="80"/>
          <el-table-column prop="stuSex" header-align="center" align="center" label="性别" width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.atteType  === 0" type="text" size="small">女</span>
              <span v-else size="small" type="text">男</span>
            </template>
          </el-table-column>
          <el-table-column prop="educType" header-align="center" align="center" label="学历" width="80">
            <template slot-scope="scope">
                  <span v-if="scope.row.educType === 0" type="text" size="small">本科</span>
                  <span v-if="scope.row.educType === 1" type="text" size="small">专科</span>
                  <span v-if="scope.row.educType === 2" type="text" size="small">职高</span>
                  <span v-if="scope.row.educType === 3" type="text" size="small">初中</span>
                  <span v-if="scope.row.educType === 4" type="text" size="small">初中以下</span>
                  <span v-if="scope.row.educType === 5" type="text" size="small">本科以上</span>
            </template>
          </el-table-column>
          <el-table-column prop="addr" header-align="center" align="center" label="住址"/>
          <el-table-column prop="regAddr" header-align="center" align="center" label="户籍"/>
          <el-table-column prop="stuStatus" header-align="center" align="center" label="状态" width="80">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.stuStatus === 1" size="small" type="success">正常</el-tag>
                <el-tag v-if="scope.row.stuStatus === 0" size="small" type="info">禁用</el-tag>
              </template>
          </el-table-column>
          <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
            <template slot-scope="scope">
              <el-button v-if="isAuth('stu:user:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.stuUserId)">编辑</el-button>
              <el-button v-if="scope.row.stuStatus === 0" type="text" size="small" @click="handleModifyStatus(scope.row.stuUserId,scope.row.stuStatus)">启用</el-button>
              <el-button v-else size="small" type="text" @click="handleModifyStatus(scope.row.stuUserId,scope.row.stuStatus)">禁用</el-button>
              <el-button v-if="isAuth('stu:user:delete')" type="text" size="small" @click="deleteHandle(scope.row.stuUserId)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" background :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>

        <!-- 弹窗, 新增 / 修改 -->
        <AddOrUpdate1 v-if="addOrUpdateVisible" ref="addOrUpdate1" @refreshDataList="getDataList"></AddOrUpdate1>

        <!-- 禁用 -->
        <studentDisable v-if="studentDisable" ref="studentDisable" @refreshDataList="getDataList"></studentDisable>
        <!-- 弹窗, 上传文件 -->
      <uploadPop v-if="uploadPopVisible" ref="uploadPop" @refreshDataList="getDataList"></uploadPop>
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
  .el-table .warning-row {
    background: #EBEEF5;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
<script>
  import Vue from 'vue'
  import AddOrUpdate1 from './student-add-or-update'
  import studentDisable from './student-disable'
  import { stuList, stuListDelete,stuListUpdate } from '@/api/student'
  import uploadPop from '@/views/common-pop/upload-stu-pop'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'

  export default {
    data () {
      return {
        dataForm: {
          id: 0,
          stuName: undefined,
          stuPhone: undefined,
          cardId: undefined,
          status: '0'
        },
        stuSearch:'',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        isShow: true,
        downloadLoading: false,
        studentDisable:false,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        dialogFormVisible:false,
        uploadPopVisible: false
      }
    },
    components: {
      AddOrUpdate1,studentDisable, uploadPop
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        stuList(this.pageIndex, this.pageSize, this.dataForm.stuName, this.dataForm.stuPhone, this.dataForm.cardId).then(res => {
          if (res.data && res.data.code === 0) {
            this.dataList = res.data.page.list
            this.totalPage = res.data.page.totalCount
            this.isShow = false
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        }).catch(err => {
          this.dataListLoading = false
          console.log(err)
        })
      },
      // 重置查询条件
      resetSearch(){
        this.dataForm.stuName = undefined
        this.dataForm.stuPhone = undefined
        this.dataForm.cardId = undefined
        this.pageIndex = 1
        this.isShow = true
        this.dataList = []
        this.getDataList()
      },
      schoolTreeChangeEvent (schoolId, schoolName, schoolCode) {
        this.getDataList()
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
      // 下载模板操作
      downloadHandle () {
        window.open(this.$http.adornUrl('/stu/user/down?token=' + Vue.cookie.get('token')), '_blank')
      },
      // 上传操作
      uploadHandle () {
        this.uploadPopVisible = true
        this.$nextTick(() => {
          this.$refs.uploadPop.init()
        })
      },
      // 导出操作
      exportHandle () {
        /* generate workbook object from table */
       // 判断要导出的节点中是否有fixed的表格，如果有，转换excel时先将该dom移除，然后append回去，
        var fix = document.querySelector('.el-table__fixed');
        var wb;
        if (fix) {
          wb = XLSX.utils.table_to_book(document.querySelector('#dataListStuList').removeChild(fix));
          document.querySelector('#dataListStuList').appendChild(fix);
        } else {
          wb = XLSX.utils.table_to_book(document.querySelector('#dataListStuList'));
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
            '学员档案.xlsx'
          );
        } catch (e) {
          if (typeof console !== 'undefined') console.log(e, wbout);
        }
        return wbout;
      },
      formatJson(filterVal, jsonData) {
　　　　　return jsonData.map(v => filterVal.map(j => v[j]))
　　　 },
      // 禁用
      handleModifyStatus (id,stuStatus) {
        this.studentDisable = true
        this.$nextTick(() => {
          this.$refs.studentDisable.init(id,stuStatus)
        })
      },
      //  修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate1.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          stuListDelete(id).then(res => {
            if(res.data && res.data.code === 0){
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            }else{
              this.$message.error(res.data.msg)
            }
          })
        }).catch(() => {})
      }
    }
  }
</script>

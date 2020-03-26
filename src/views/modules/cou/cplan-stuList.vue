<template>
  <el-dialog title="学员列表" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.stuName" placeholder="请输入学员名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="addStu()">新增</el-button>
        <el-button type="info" @click="exportExcel()">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border stripe v-loading="dataListLoading" style="width: 100%;" id="dataList3">
      <el-table-column type="index" label="NO" align="center" header-align="center" width="80"/>
      <el-table-column prop="stuName" header-align="center" align="center" label="姓名">
      </el-table-column>
      <el-table-column prop="stuPhone" header-align="center" align="center" label="电话">
      </el-table-column>
      <el-table-column prop="classTypeName" header-align="center" align="center" label="报读班型">
      </el-table-column>
      <el-table-column prop="readStatus" header-align="center" align="center" label="学习状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.readStatus === 1" size="small" type="success">在读</el-tag>
            <el-tag v-if="scope.row.readStatus === 2" size="small" type="danger">休学</el-tag>
            <el-tag v-if="scope.row.readStatus === 3" size="small">毕业</el-tag>
            <el-tag v-if="scope.row.readStatus === 4" size="small"  type="info">作废</el-tag>
          </template>
      </el-table-column>
      <el-table-column prop="stuSex" header-align="center" align="center" label="性别">
          <template slot-scope="scope">
            <span v-if="scope.row.stuSex === 0" size="small">女</span>
            <span v-if="scope.row.stuSex === 1">男</span>
          </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="80" label="操作">
          <template slot-scope="scope">
            <el-button v-if="isAuth('stu:reg:course:update')" type="text" size="small" @click="quitClass(scope.row.regCourseId)">删除</el-button>
          </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" background :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
        :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <!-- 新增学员 -->
    <stuListAdd v-if="stuListAddVisiable" ref="stuListAdd" @addStu-pop-event="callBackAddStuPop"></stuListAdd>

    <!-- 报名表弹窗 -->
    <!-- <cplanRegPop v-if="cplanRegPopVisiable" ref="cplanRegPop" @cplan-pop-event="callBackCplanRegPop"></cplanRegPop> -->

  </el-dialog>
</template>

<script>

  import { cplanStuListInfo } from '@/api/cplan'
  import { regAssignClass, regQuitClass } from '@/api/reg'
  import stuListAdd from './cplan-stuList-add'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'

  export default {
    data () {
      return {
        visible: false,
        dataListLoading: false,
        stuListAddVisiable: false,
        cplanRegPopVisiable: false,
        dataList: [],
        selectCplanId: '',
        selectRegCourseId: '',
        dataForm: {
          stuName: undefined
        },
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
      }
    },
    components: {
      stuListAdd
    },
    methods: {
      init (id) {
        this.visible = true
        this.selectCplanId = id
        this.dataListLoading = true
        this.getDataList()
      },
      getDataList () {
        cplanStuListInfo(this.pageIndex,this.pageSize,this.selectCplanId).then(res => {
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
      addStu () {
        this.stuListAddVisiable = true
        this.$nextTick(() => {
          this.$refs.stuListAdd.init(this.selectCplanId)
        })
      },
      // 添加学生事件回调
      callBackAddStuPop (regCourseId) {
        this.selectRegCourseId = regCourseId
        regAssignClass({
          'cplanId': this.selectCplanId,
          'regCourseId': this.selectRegCourseId,
        }).then(res => {
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
      },
      // 学生删除(退班操作)
      quitClass (id) {
        this.$confirm(`确定退班?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          regQuitClass({
            'regCourseId': id
          }).then(res => {
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
      },
      // 导出
      exportExcel ()  {
        /* generate workbook object from table */
        let wb = XLSX.utils.table_to_book(document.querySelector('#dataList3'));
        /* get binary string as output */
        let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
        try {
            FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '学员列表.xlsx');
        } catch (e)
        {
            if (typeof console !== 'undefined')
                console.log(e, wbout)
        }
        return wbout
      },
    }
  }
</script>

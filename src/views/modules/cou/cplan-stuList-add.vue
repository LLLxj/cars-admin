<template>
  <el-dialog title="学员列表" :close-on-click-modal="false" :visible.sync="visible" append-to-body>
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="姓名">
        <el-input v-model="dataForm.stuName" placeholder="请输入学员名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="dataForm.stuPhone" placeholder="请输入手机号" clearable></el-input>
      </el-form-item>
      <el-form-item label="班型" prop="classTypeName">
            <el-input v-model="dataForm.classTypeName" placeholder="班型" readonly @click.native="searchClassTypeHandle()" prefix-icon="el-icon-search"></el-input>
          </el-form-item>
      <el-form-item>
      <el-button @click="resetSearch()">重置</el-button>
      <el-button @click="getDataList()">查询</el-button>
      <el-button type="primary" @click="selectHandle()">确定</el-button>
      <el-button type="danger" @click="cancleHandle()" >取消</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;" highlight-current-row @row-dblclick="handleRowDblclick" @row-click="handleRowlclick">
      <el-table-column type="index" label="NO" align="center" header-align="center" width="80">
      </el-table-column>
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
    </el-table>

    <!-- 班型弹窗 -->
    <classType v-if="classTypeVisiable" ref="classType" @classType-pop-event="callBackClassTypeSearch" ></classType>

  </el-dialog>
</template>

<script>

  import { cplanNeedClassStuListInfo } from '@/api/cplan'
  import classType from '@/views/common-pop/class-type-pop'

  export default {
    data () {
      return {
        visible: false,
        dataListLoading: false,
        dataList: [],
        selectRegCourseId: '',
        selectCplanId: '',
        dataForm: {
          stuName: undefined,
          classTypeId: undefined, 
          classTypeName: undefined,
          stuPhone: undefined, 
        },
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        classTypeVisiable: false
      }
    },
    components: {
      classType
    },
    methods: {
      init (id) {
        this.selectCplanId = id
        this.visible = true
        this.getDataList()
      },
      getDataList () {
        this.dataListLoading = true
        cplanNeedClassStuListInfo(this.pageIndex, this.pageSize, this.selectCplanId, this.dataForm.classTypeId, 
        this.dataForm.classTypeName, this.dataForm.stuPhone, this.dataForm.stuName).then(res => {
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
      // 重置操作
      resetSearch () {
          this.dataForm.stuName = undefined,
          this.dataForm.classTypeId = undefined, 
          this.dataForm.classTypeName = undefined,
          this.dataForm.stuPhone = undefined,
          this.dataList = []
          this.getDataList()
      },
      // 选择班型弹窗
      searchClassTypeHandle () {
        this.classTypeVisiable = true
        this.$nextTick(() => {
          this.$refs.classType.init()
        })
      },
      // 选择班型弹窗回调
      callBackClassTypeSearch (classTypeId,classTypeName) {
        this.dataForm.classTypeId = classTypeId
        this.dataForm.classTypeName = classTypeName
      },
      // 双击事件
      handleRowDblclick (val, row) {
        this.selectHandle()
      },
      // 单击事件
      handleRowlclick (row) {
        this.selectRegCourseId = row.regCourseId
      },
      // 确认
      selectHandle () {
        if (this.dataForm.regCourseId == '') {
          this.$message.error('请选择学生!')
          return
        }
        this.$emit('addStu-pop-event', this.selectRegCourseId)
        this.visible = false
      },
      // 取消
      cancleHandle () {
        this.visible = false
      },
      
    }
  }
</script>

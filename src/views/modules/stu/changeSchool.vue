<template>
  <!--报名表列表-->
  <div class="mod-user">
    <!-- 布局容器 -->
    <el-container>
      <!-- 右侧 -->
      <el-main>

        <el-row :gutter="24">
          <!--顶部按钮组-->
          <el-col :span="18">
            <!--导出-->
            <el-button type="info" :loading="downloadLoading" @click="exportExcel()">导出</el-button>
          </el-col>
        </el-row>

        <el-row :gutter="24" style="margin-top:15px;">
          <el-col :span="18">
            <!--普通查询条件-->
            <el-input placeholder="请输入内容" v-model="pageQuery.queryValue" class="input-with-select" :disabled="normalSearchVisible">
              <el-select v-model="pageQuery.queryKey" slot="prepend" placeholder="请选择" style="width:100px" :disabled="normalSearchVisible" @change="changeSelect">
                <el-option value="stuName" label="学员姓名">学员姓名</el-option>
                <el-option value="regNo" label="报名表号">报名表号</el-option>
                <el-option value="stuPhone" label="手机号">手机号</el-option>
              </el-select>
            </el-input>
          </el-col>
          <!--查询按钮-->
          <el-col :span="6">
            <el-button v-if="isAuth('stu:reg:transfer:list')" @click="getDataList()" v-loading="dataListLoading">查询</el-button>
            <el-button @click="resetSearch()">重置</el-button>
            <el-button v-if="normalSearchVisible == false" type="primary" icon="el-icon-arrow-down" @click="changeSearchStyle"></el-button>
            <el-button v-else type="primary" icon="el-icon-arrow-up" @click="hideSearch"></el-button>
          </el-col>
        </el-row>

        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">

          <el-row :gutter="24" style="margin-top:15px;" v-if="normalSearchVisible">
            <el-col :span="24">
              <el-form-item label="报名表号" prop="regNo">
                <el-input v-model="dataForm.regNo" placeholder="请输入报名表号" clearable></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="stuName">
                <el-input v-model="dataForm.stuName" placeholder="请输入姓名" clearable></el-input>
              </el-form-item>
              <el-form-item label="手机" prop="stuPhone">
                <el-input v-model="dataForm.stuPhone" placeholder="请输入手机号码" clearable></el-input>
              </el-form-item>
              <el-form-item label="合同编号" prop="contractNo">
                <el-input v-model="dataForm.contractNo" placeholder="请输入合同编号" clearable></el-input>
              </el-form-item>
              <el-form-item label="原就读校区" prop="schoolId">
                <schoolSelect v-model="dataForm.schoolId" :clearable="noSelectSchool" />
              </el-form-item>
              <el-form-item label="报读班型" prop="classTypeId">
                <classTypeSelect v-model="dataForm.classTypeId" :clearable="noSelectClassType"></classTypeSelect>
              </el-form-item>
              <el-form-item label="钉钉单号" prop="ddingCode">
                <el-input v-model="dataForm.ddingCode" placeholder="请输入钉钉单号" clearable></el-input>
              </el-form-item>
              <el-form-item label="创建日期" prop="dateTime">
                <el-date-picker v-model="dataForm.dateTime" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                  value-format="yyyy-MM-dd 00:00:00"
                  :clearable="true"
                  :picker-options="datePickerOptions"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-table :data="dataList" border stripe highlight-current-row v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width:100%;margin-top:15px"
         @row-click="classTableClickHandle" id="changeSchoolDataList">
          <!--隐藏列-->
          <!-- <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left"  class="demo-table-expand">
                <el-form-item label="地址"><span>{{ props.row.addr }}</span></el-form-item>
                <el-form-item label="身份证"><span>{{ props.row.cardId }}</span></el-form-item>
                <el-form-item label="报名表ID"><span>{{ props.row.regId }}</span></el-form-item>
                <el-form-item label="学员ID"><span>{{ props.row.stuUserId }}</span></el-form-item>
                <el-form-item label="介绍人"><span>{{ props.row.nickName || '--' }}</span></el-form-item>
                <el-form-item label="上课状态修改时间"><span>{{ props.row.readStatusUpdateTime }}</span></el-form-item>
                <el-form-item label="是否锁单"><span>{{ props.row.lock }}</span></el-form-item>
              </el-form>
            </template>
          </el-table-column> -->
          <!--展示列-->
          <!-- <el-table-column type="selection" header-align="center" align="center" width="50" fixed/> -->
          <el-table-column type="index" align="center" header-align="center" width="80" label="NO" fixed/>
          <el-table-column prop="regNo" header-align="center" align="center" width="180" label="报名表号" fixed/>
          <el-table-column prop="stuName" header-align="center" align="center" width="120" label="姓名"/>
          <el-table-column prop="stuPhone" header-align="center" align="center" label="手机" width="150"/>
          <el-table-column prop="contractNo" header-align="center" align="center" label="合同编号" width="150"/>
          <el-table-column prop="oldSchoolName" header-align="center" align="center" label="转出校区" width="150"/>
          <el-table-column prop="newSchoolName" header-align="center" align="center" label="转入校区" width="150"/>
          <el-table-column prop="classTypeName" header-align="center" align="center" label="报读班型" width="100"/>
          <!-- <el-table-column prop="classTypePrice" label="原价" header-align="center" align="center"/> -->
          <el-table-column prop="status" header-align="center" align="center" label="审核状态" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0" size="small">待审核</span>
              <span v-if="scope.row.status === 1" size="small">通过</span>
              <span v-if="scope.row.status === 2" size="small">审核失败</span>
            </template>
          </el-table-column>
          <el-table-column prop="payPrice" header-align="center" align="center" label="订单金额" width="100"/>
          <el-table-column prop="discPrice" header-align="center" align="center" label="优惠金额" width="100"/>
          <el-table-column prop="confPayPrice" header-align="center" align="center" label="已缴金额" width="100"/>
          <el-table-column prop="stayPayPrice" header-align="center" align="center" label="未缴金额" width="100"/>
          <el-table-column prop="refundPrice" header-align="center" align="center" label="已退金额" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.refundPrice !== null">{{scope.row.refundPrice}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
            <el-table-column header-align="center" align="center" width="150">
            <template slot="header" slot-scope="scope">
              <el-dropdown size="medium" @command="handleCommand">
                <span class="el-dropdown-link">
                  缴费状态<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="">全部</el-dropdown-item>
                  <el-dropdown-item command="1">待缴费</el-dropdown-item>
                  <el-dropdown-item command="2">已缴订金</el-dropdown-item>
                  <el-dropdown-item command="3">部分缴费</el-dropdown-item>
                  <el-dropdown-item command="4">已缴费</el-dropdown-item>
                  <el-dropdown-item command="5">已退费</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope" header-align="center" align="center">
              <el-tag v-if="scope.row.payStatus === 1" size="small" type="info">待缴费</el-tag>
              <el-tag v-if="scope.row.payStatus === 2" size="small" type="warning">已缴订金</el-tag>
              <el-tag v-if="scope.row.payStatus === 3" size="small">部分缴费</el-tag>
              <el-tag v-if="scope.row.payStatus === 4" size="small" type="success">已缴费</el-tag>
              <el-tag v-if="scope.row.payStatus === 5" size="small" type="danger">已退费</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="hadClassTime" header-align="center" align="center" label="已上课时" width="120"/>
          <el-table-column prop="remark" header-align="center" align="center" label="转校原因" width="120"/>
          <el-table-column prop="ddingCode" header-align="center" align="center" label="钉钉单号" width="120"/>
          <el-table-column label="创建时间" prop="createTime" header-align="center" align="center" width="100" :formatter="dateFormatter"/>
          <el-table-column prop="contractNo" header-align="center" align="center" width="150" label="合同编号">
            <template slot-scope="scope">
              <span v-if="scope.row.contractNo == null">--</span>
              <span v-else>{{scope.row.contractNo}}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" header-align="center" align="center" width="100" label="操作">
            <template slot-scope="scope">
              <!--操作-->
              <el-button type="text" size="small" v-if="isAuth('stu:reg:transfer:update') && scope.row.status === 0" @click="handle(scope.row)">操作</el-button>
            <el-button type="text" size="small" v-if="scope.row.status !== 0" @click="getDetail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
          <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" background :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
            :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
      </el-main>
    </el-container>
    <!-- 操作 -->
    <handleSchool ref="handleSchool" v-if="handleSchoolVisible" @refreshDataList="getDataList"></handleSchool>
    <!-- 详情 -->
    <changeSchoolDetail ref="changeSchoolDetail" v-if="changeSchoolDetailVisible" @refreshDataList="getDataList"></changeSchoolDetail>
    
  </div>

</template>
<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 150px;
    color: #99a9bf;
  }
</style>
<script>
  import Vue from 'vue'
  import { changeSchoolList, getChangeSchoolList } from '@/api/changeSchool'
  import { dateSubstring } from '@/utils/index'
  import { getEduTypeList, getEduTypeLabelByVal } from '@/utils/educTypeUtil'
  import { getComStatusList } from '@/utils/comStatusUtil'
  import { getInClassStatusList } from '@/utils/inClassStatus'
  import schoolSelect from '@/views/common-select/all-school-select'
  import classTypeSelect from '@/views/common-select/classtype-select'
  import paySelect from '@/views/common-select/payment-select'
  import handleSchool from './change-school-handle'
  import changeSchoolDetail from './change-school-detail'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'

  export default {
    data () {
      return {
        datePickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        dataForm: {
          regNo: undefined,
          stuName: undefined,
          stuPhone: undefined,
          contractNo: undefined,
          schoolId: undefined,
          classTypeId: undefined,
          // 付款状态
          payStatus: undefined,
          ddingCode: undefined,
          cardId: undefined,
          dateTime: undefined,
        },
        dataSelect: [],
        pageQuery: {
          queryKey: 'stuName',
          queryValue: null
        },
        selectRow: {
          show: false,
          regId: null
        },
        zsTeas: [],
        downloadLoading: false,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        dialogFormVisible: false,
        noSelectClassType: true,
        notSelectStu: true,
        noSelect: true,
        noSelectSchool: true,
        normalSearchVisible: false,
        params: {},
        disUpdateClassType: false,
        // 操作
        handleSchoolVisible: false,
        // 详情
        changeSchoolDetailVisible: false
      }
    },
    components: {
      paySelect, schoolSelect, handleSchool, classTypeSelect, changeSchoolDetail
    },
    computed: {
      changeSchoolSearchNo: {
        get () { return this.$store.state.common.changeSchoolSearchNo },
        set (val) { this.$store.commit('common/setChangeSchoolSearchNo', val) }
      },
    },
    watch: {
      changeSchoolSearchNo (rowData) {
        if(rowData !== 0){
          this.getDataListMes(rowData)
        } else {
          this.getDataList()
        }
      }
    },
    // created() {
    //   // 判断是新增还是修改
    //   const rowData = this.$route.params.tableNo || 0
    //   if(rowData !== 0){
    //     this.getDataListMes(rowData)
    //   } else {
    //     this.getDataList()
    //   }
    // },
    activated () {
      let changeSchoolSearchNo = this.changeSchoolSearchNo || 0
      if(changeSchoolSearchNo == 0){
        this.getDataList()
      } else {
        this.getDataListMes(changeSchoolSearchNo)
      }
    },
    computed: {
      dataFormchanneId () {
        return this.dataForm.channeId
      },
      changeSchoolSearchNo: {
        get () { return this.$store.state.common.changeSchoolSearchNo },
        set (val) { this.$store.commit('common/setChangeSchoolSearchNo', val) }
      },
    },
    methods: {
        // 消息获取数据列表
      getDataListMes (rowData) {
        this.pageQuery = {
          queryKey: 'regNo',
          queryValue: rowData
        }
        this.params['page'] = this.pageIndex
        this.params['limit'] = this.pageSize
        this.params['regNo'] = rowData
        getChangeSchoolList(this.params).then(res => {
          if (res.data && res.data.code === 0) {
            this.dataList = res.data.data.list
            this.zsTeas = res.data.data.list.recruitStuRegSaleEntities
            this.totalPage = res.data.data.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
            this.$message.error(res.data.msg)
          }
          this.dataListLoading = false
        }).catch(err => {
          console.log(err)
          this.dataListLoading = false
        })
      },
      // 获取数据列表
      getDataList () {
        // 处理日期
        let startDateTime = null
        let endDateTime = null
        if (this.dataForm.dateTime) {
          startDateTime = parseTime(this.dataForm.dateTime[0], '{y}-{m}-{d} 00:00:00')
          endDateTime = parseTime(this.dataForm.dateTime[1], '{y}-{m}-{d} 23:59:59')
        }
        this.dataListLoading = true
        
        // 查询
        if (this.normalSearchVisible == false) {
          // 折叠状态
          // var params = {};
          this.params['page'] = this.pageIndex
          this.params['limit'] = this.pageSize
          if (this.pageQuery.queryKey !== '') {
            this.params[this.pageQuery.queryKey] = this.pageQuery.queryValue
          }
          getChangeSchoolList(this.params).then(res => {
            if (res.data && res.data.code === 0) {
              this.dataList = res.data.data.list
              // this.zsTeas = res.data.data.list.recruitStuRegSaleEntities
              this.totalPage = res.data.data.totalCount
            } else {
              this.dataList = []
              this.totalPage = 0
            }
            this.dataListLoading = false
          }).catch(err => {
            console.log(err)
            this.dataListLoading = false
          })
        } else {
          // 展开状态
          changeSchoolList(this.pageIndex, this.pageSize, this.dataForm.regNo, this.dataForm.stuName, this.dataForm.stuPhone, this.dataForm.contractNo,
            this.dataForm.schoolId, this.dataForm.classTypeId, this.dataForm.payStatus, this.dataForm.ddingCode, this.dataForm.startDateTime, this.dataForm.endDateTime)
            .then(res => {
              if (res.data && res.data.code === 0) {
                // console.log(res)
                this.dataList = res.data.data.list
                // this.zsTeas = res.data.data.list.recruitStuRegSaleEntities
                this.totalPage = res.data.data.totalCount
              } else {
                this.dataList = []
                this.totalPage = 0
              }
              this.dataListLoading = false
            }).catch(err => {
            console.log(err)
            this.dataListLoading = false
          })
        }
      },
      // 重置查询条件
      resetSearch () {
        this.dataForm.regNo = undefined
        this.dataForm.stuName = undefined
        this.dataForm.stuPhone = undefined
        this.dataForm.contractNo = undefined
        this.dataForm.schoolId = undefined
        this.dataForm.classTypeId = undefined
        this.dataForm.payStatus = undefined
        this.dataForm.ddingCode = undefined
        this.dataForm.dateTime = undefined
        // this.noSelectSchool = false
        // this.noSelect = false
        // this.noSelectChannel = false
        this.normalSearchVisible = false
        this.params = {}
        this.pageQuery.queryKey = 'stuName'
        this.pageQuery.queryValue = ''
        this.getDataList()
      },
       // 报名表单选事件
      classTableClickHandle (currentRow) {
        this.notSelectStu = false
        this.dataSelect = currentRow
        if(currentRow.payStatus == 4){
          this.disUpdateClassType = true
        } else {
          this.disUpdateClassType = false
        }
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
      educTypeFormatter (row, column, cellValue) {
        // 学历
        return getEduTypeLabelByVal(cellValue)
      },
      dateFormatter (row, column, cellValue) {
        return dateSubstring(cellValue)
      },
     
      changeSearchStyle () {
        this.normalSearchVisible = !this.normalSearchVisible
        this.getDataList()
      },
      hideSearch () {
        this.normalSearchVisible = !this.normalSearchVisible
        this.getDataList()
      },
      // 监听select的值
      changeSelect (change) {
        this.params = {}
      },
      // 监听付款状态
      handleCommand (command) {
        this.params = {}
        if (this.normalSearchVisible === false) {
          this.params['payStatus'] = command
        } else {
          this.dataForm.payStatus = command
        }
        this.getDataList()
      },
     
     
      // 导出
      exportExcel ()  {
        /* generate workbook object from table */
       // 判断要导出的节点中是否有fixed的表格，如果有，转换excel时先将该dom移除，然后append回去，
        var fix = document.querySelector('.el-table__fixed');
        var wb;
        if (fix) {
          wb = XLSX.utils.table_to_book(document.querySelector('#changeSchoolDataList').removeChild(fix));
          document.querySelector('#changeSchoolDataList').appendChild(fix);
        } else {
          wb = XLSX.utils.table_to_book(document.querySelector('#changeSchoolDataList'));
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
            '转校管理.xlsx'
          );
        } catch (e) {
          if (typeof console !== 'undefined') console.log(e, wbout);
        }
        return wbout;
      },
      formatterSex (row, column) {
        return row.stuSex == '1' ? "男" : row.stuSex == '0' ? "女" : ""
      },
      handle (data) {
        this.handleSchoolVisible = true
        this.$nextTick(() => {
          this.$refs.handleSchool.init(data)
        })
      },
      getDetail (data) {
        this.changeSchoolDetailVisible = true
        this.$nextTick(() => {
          this.$refs.changeSchoolDetail.init(data)
        })
      }
      
    }
  }
</script>

<template>
  <!--退费单-->
  <div class="mod-user">
    <!-- 布局容器 -->
    <el-container>
      <!-- 右侧 -->
      <el-main>

        <el-row :gutter="24">
          <el-col :span="18">
            <el-input placeholder="请输入内容" v-model="pageQuery.queryValue" class="input-with-select" :disabled="normalSearchVisible">
                <el-select v-model="pageQuery.queryKey" slot="prepend" placeholder="请选择" style="width:100px" :disabled="normalSearchVisible">
                  <el-option value="stuName" label="学员姓名">学员姓名</el-option>
                  <el-option value="refundNo" label="退费单号">退费单号</el-option>
                  <el-option value="stuPhone" label="手机号">手机号</el-option>
                </el-select>
            </el-input>
          </el-col>
          <el-col :span="6">
              <el-button v-if="isAuth('stu:reg:refund:list')" @click="getDataList()">查询</el-button>
              <el-button @click="resetSearch()">重置</el-button>
              <el-button v-if="normalSearchVisible == false" type="primary" icon="el-icon-arrow-down" @click="changeSearchStyle"></el-button>
              <el-button v-else type="primary" icon="el-icon-arrow-up" @click="hideSearch"></el-button>
          </el-col>
        </el-row>

        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <!-- <el-form-item>
            <el-button type="primary" @click="info()">新增</el-button>
            <el-button type="danger" :loading="downloadLoading" @click="exportHandle()">导出</el-button>
          </el-form-item> -->
            <el-row :gutter="24" style="margin-top:15px;" v-if="normalSearchVisible">
              <el-col :span="24">
                  <el-form-item label="退费单号" prop="refundNo">
                      <el-input v-model="dataForm.refundNo" placeholder="请输入退费单号" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="姓名" prop="stuName">
                      <el-input v-model="dataForm.stuName" placeholder="请输入学员名字" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="手机" prop="stuPhone">
                      <el-input v-model="dataForm.stuPhone" placeholder="请输入手机号码" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="校区" prop="schoolId">
                    <schoolSelect v-model="dataForm.schoolId" :clearable="noSelectSchool" :showAll="true"></schoolSelect>
                  </el-form-item>
                  <el-form-item label="报读班型" prop="classTypeId">
                    <classTypeSelect v-model="dataForm.classTypeId" :clearable="noSelectClassType"></classTypeSelect>
                  </el-form-item>
                  <el-form-item label="退款状态" prop="status">
                      <el-select v-model="dataForm.status" placeholder="全部" :clearable="noSelect">
                          <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value">
                          </el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="钉钉单号" prop="ddingCode">
                      <el-input v-model="dataForm.ddingCode" placeholder="请输入钉钉单号" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="审核人" prop="statusUserName">
                      <el-input v-model="dataForm.statusUserId" placeholder="审核人" readonly @click.native="searchCheckPeoHandle()" prefix-icon="el-icon-search"></el-input>
                  </el-form-item>

                  <!-- <el-form-item label="渠道" prop="channeId">
                    <resourceSelect v-model="dataForm.channeId" :clearable="noSelectChannel"></resourceSelect>
                  </el-form-item> -->

                  <!-- 推广老师 -->
                  <!-- <el-form-item label="电邀老师" prop="spreadUserName">
                    <el-input v-model="dataForm.spreadUserName" placeholder="电邀老师" readonly @click.native="searchTgTeacherHandle()" prefix-icon="el-icon-search"></el-input>
                  </el-form-item> -->
                  <el-form-item label="电邀老师" prop="spreadUserId">
                    <tgTeacher v-model="dataForm.spreadUserId"></tgTeacher>
                  </el-form-item>

                   <!-- 招生老师 -->
                  <!-- <el-form-item label="招生老师" prop="recruitUserName">
                    <el-input v-model="dataForm.recruitUserName" placeholder="招生老师" readonly @click.native="searchZsTeacherHandle()" prefix-icon="el-icon-search"></el-input>
                  </el-form-item> -->
                  <el-form-item label="招生老师" prop="recruitUserId">
                    <zsTeacher v-model="dataForm.recruitUserId"></zsTeacher>
                  </el-form-item>

                  <el-form-item label="创建日期" prop="dateTime">
                    <el-date-picker v-model="dataForm.dateTime" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                      value-format="yyyy-MM-dd 00:00:00" :clearable="true" :picker-options="datePickerOptions">
                    </el-date-picker>
                  </el-form-item>

              </el-col>
            </el-row>
        </el-form>

        <!-- <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;" :row-class-name="tableRowClassName">
             -->
        <el-table :data="dataList" border stripe v-loading="dataListLoading" style="width: 100%;margin-top:15px;">
          <el-table-column type="index" align="center" header-align="center" width="80" label="NO" fixed/>
          <el-table-column align="center" prop="refundNo" header-align="center" width="180" label="退款单号" fixed/>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left"  class="demo-table-expand">
                <!-- <el-table-column label="身份证" prop="cardId" header-align="center" align="center" width="180"/> -->
                <el-form-item label="是否锁单"><span>{{ props.row.lock }}</span></el-form-item>
                <el-form-item label="备注"><span>{{ props.row.remark }}</span></el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="stuName" header-align="center" width="120" label="姓名"/>
          <el-table-column align="center" prop="stuPhone" header-align="center" width="150" label="手机"/>
          <el-table-column align="center" prop="schoolName" header-align="center" width="120" label="校区"/>
          <el-table-column align="center" prop="classTypeName" header-align="center" width="120" label="退费课程"/>
          <el-table-column align="center" prop="payPrice" header-align="center" width="100" label="订单金额"/>
          <el-table-column align="center" prop="refundPrice" header-align="center" width="100" label="退款金额"/>
          <el-table-column align="center" prop="refundType" header-align="center" width="120" label="退费类型">
            <template slot-scope="scope">
              <span v-if="scope.row.refundType == 1">退费退学</span>
              <span v-if="scope.row.refundType == 2">退费不退学</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="status" header-align="center" width="100" label="退款状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1">财务审核中</span>
              <span v-if="scope.row.status == 2">已退款</span>
              <span v-if="scope.row.status == 3">退款失败</span>
              <span v-if="scope.row.status == 4">打款中</span>
            </template>
          </el-table-column>
          <el-table-column prop="statusUserCallVo" align="center" header-align="center" width="120" label="审核人">
            <template slot-scope="scope">
              <span v-if="scope.row.statusUserCallVo == null">--</span>
              <span v-else>{{scope.row.statusUserCallVo.statusUserName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="电邀老师" prop="spreadStuRegSaleEntity.userName" header-align="center" align="center" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.spreadStuRegSaleEntity == null">--</span>
              <span v-else>{{scope.row.spreadStuRegSaleEntity.userName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="招生老师" prop="recruitStuRegSaleEntities" header-align="center" align="center" width="180">
            <template slot-scope="scope">
              <el-tag v-for="site in scope.row.recruitStuRegSaleEntities" :key="site.userId" :label="site.userName" :value="site.userId">
                {{site.userName}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="ddingCode" header-align="center" width="150" label="钉钉号">
            <template slot-scope="scope">
              <span v-if="scope.row.ddingCode== null">--</span>
              <span v-else>{{scope.row.ddingCode}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column align="center" prop="" header-align="center" label="备注"/> -->
          <el-table-column align="center" prop="createTime" header-align="center" width="100" :formatter="dateFormatter" label="创建时间"/>
          <el-table-column fixed="right" prop="refundNo" header-align="center" align="center" label="操作" width="150">
            <template slot-scope="scope">
              <el-button type="text" v-if="isAuth('stu:reg:refund:update') & scope.row.status == 1" size="small" @click="handle(scope.row)">操作</el-button>
              <el-button type="text" v-if="isAuth('stu:reg:refund:cashier') & scope.row.status == 4" size="small" @click="confirmGetMoney(scope.row.refundId)">确认打款</el-button>
              <!-- <el-button type="text" v-if="isAuth('stu:reg:refund:update') & scope.row.status == 1" size="small" @click="accept(scope.row.refundId)">同意</el-button>
              <el-button type="text" v-if="isAuth('stu:reg:refund:update') & scope.row.status == 1" size="small" @click="refuse(scope.row.refundId)">拒绝</el-button> -->
              <el-button type="text" v-if="isAuth('stu:reg:refund:update') & scope.row.status == 4  && scope.row.lock == false"
               size="small" @click="uncheck(scope.row.refundId)">反审核</el-button>
               <el-button type="text" size="small" v-if="scope.row.status !== 1" @click="detail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" background :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
          :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </el-main>
    </el-container>
    <!-- 招生老师弹窗 -->
    <zsTeacher ref="zsTeacher" v-if="zsTeacherVisible" @zs-pop-event="callBackZsTeacher"></zsTeacher>
    <!-- 推广老师弹窗 -->
    <tgTeacher ref="tgTeacher" v-if="tgTeacherVisible" @tg-pop-event="callBackTgTeacher"></tgTeacher>
    <!-- 审核人弹窗 -->
    <checkPeo ref="checkPeo" v-if="checkPeoVisible" @all-check-pop-event="callBackcheckPeo"></checkPeo>
    <!-- 操作弹窗 -->
    <!-- 操作 -->
    <refundHandle ref="refundHandle" v-if="refundHandleVisible" @refreshDataList="getDataList"></refundHandle>
    <!-- 详情 -->
    <refundDetail ref="refundDetail" v-if="refundDetailVisible" @refreshDataList="getDataList"></refundDetail>
  </div>

</template>

<script>
  import { getRefundList, refundList, acceptRefund, refuseRefund, uncheckRefund, getMoney } from '@/api/refund'
  import { dateSubstring } from '@/utils/index'
  import resourceSelect from '@/views/common-select/recource-select'
  // import schoolSelect from '@/views/common-select/school-select'
  import schoolSelect from '@/views/common-select/all-school-select'
  import classTypeSelect from '@/views/common-select/classtype-select'
  // import zsTeacher from '@/views/common-pop/zs-teacher-pop'
  // import tgTeacher from '@/views/common-pop/tg-teacher-pop'
  import zsTeacher from '@/views/common-select/zs-teacher-auth-select'
  import tgTeacher from '@/views/common-select/tg-teacher-auth-select'
  import checkPeo from '@/views/common-pop/all-check-pop'
  import refundHandle from './refund-handle'
  import refundDetail from './refund-detail'

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
        visible: false,
        roleList: [],
        value: '',
        dataForm: {
          stuPhone: undefined,
          stuName: undefined,
          refundNo: undefined,
          schoolId: undefined,
          schoolName: undefined,
          status: undefined,
          // 招生老师
          recruitUserName: undefined,
          recruitUserId: undefined,
          // 推广老师
          spreadUserName: undefined,
          spreadUserId: undefined,
          dateTime: undefined,
          classTypeId: undefined,
          // 审核人
          statusUserId: undefined,
          statusUserName: undefined
        },
        adVancedDataForm: {
          refundNo: undefined,
          stuPhone: undefined,
          stuName: undefined
        },
        pageQuery: {
          queryKey: 'stuName',
          queryValue: null
        },
        status: [
          { value: '', label: '全部' },
          { value: 1, label: '财务审核中' },
          { value: 4, label: '打款中'},
          { value: 2, label: '已退款' },
          { value: 3, label: '退款失败' }

        ],
        params: {},
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        downloadLoading: false,
        dataListLoading: false,
        dialogFormVisible: false,
        noSelect: true,
        normalSearchVisible: false,
        noSelectChannel: true,
        noSelectSchool: true,
        noSelectClassType: true,
        zsTeacherVisible: false,
        tgTeacherVisible: false,
        checkPeoVisible: false,
        refundHandleVisible: false,
        // 详情
        refundDetailVisible: false
      }
    },
    components: {
    //   schoolAllSidebar, stopAdd, resumeClasses
      resourceSelect, schoolSelect, zsTeacher, tgTeacher, classTypeSelect, checkPeo, refundHandle, refundDetail
    },
    computed: {
      refundSearchNo: {
        get () { return this.$store.state.common.refundSearchNo },
        set (val) { this.$store.commit('common/setRefundSearchNo', val) }
      },
    },
    activated () {
      let refundSearchNo = this.refundSearchNo || 0
      if(refundSearchNo == 0){
        this.getDataList()
      } else {
        this.getDataListMes(refundSearchNo)
      }
    },
    watch: {
      refundSearchNo (rowData) {
        if(rowData !== 0){
          this.getDataListMes(rowData)
        } else {
          this.getDataList()
        }
      }
    },
    methods: {
      // 消息获取数据列表
      getDataListMes (rowData) {
        this.pageQuery = {
          queryKey: 'refundNo',
          queryValue: rowData
        }
        this.params['page'] = this.pageIndex
        this.params['limit'] = this.pageSize
        this.params['refundNo'] = rowData
        refundList(this.params).then(res => {
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
        this.dataListLoading = true
        let startDateTime = null
        let endDateTime = null
        if (this.dataForm.dateTime) {
          startDateTime = parseTime(this.dataForm.dateTime[0], '{y}-{m}-{d} 00:00:00')
          endDateTime = parseTime(this.dataForm.dateTime[1], '{y}-{m}-{d} 23:59:59')
        }
        // // 置空单据状态
        // if(this.noSelect == false){
        //   this.dataForm.regStatus = ''
        // }

        // // 置空校区ID
        // if(this.noSelectSchool == false){
        //    this.dataForm.schoolId = ''
        // }
        // // 置空班型
        // if(this.noSelectClassType == false){
        //    this.dataForm.classTypeId = ''
        // }
         this.params = {}
        if(this.normalSearchVisible == false){
          // console.log('折叠状态')
          this.params['page'] = this.pageIndex
          this.params['limit'] = this.pageSize
          if(this.pageQuery.queryKey !== '' ){
            this.params[this.pageQuery.queryKey] = this.pageQuery.queryValue
          }
          refundList(this.params).then(res => {
            if (res.data && res.data.code === 0) {
              this.dataList = res.data.data.list
              this.totalPage = res.data.data.totalCount
            } else {
              this.dataList = []
              this.totalPage = 0
            }
              this.dataListLoading = false
          })
          .catch(err => {
            console.log(err)
          })
        }else{
          // console.log('展开状态')
          getRefundList(this.pageIndex, this.pageSize, this.dataForm.refundNo, this.dataForm.stuName, this.dataForm.stuPhone, this.dataForm.schoolId,
            this.dataForm.classTypeId, this.dataForm.status, this.dataForm.ddingCode, this.dataForm.statusUserId, this.dataForm.recruitUserId,
            this.dataForm.spreadUserId, startDateTime, endDateTime)
          .then(res => {
            if (res.data && res.data.code === 0) {
              this.dataList = res.data.data.list
              this.totalPage = res.data.data.totalCount
            } else {
              this.dataList = []
              this.totalPage = 0
            }
              this.dataListLoading = false
            })
          .catch(err => {
            console.log(err)
          })
        }
      },
      // 重置查询条件
      resetSearch () {
        this.dataForm.stuName = undefined
        this.dataForm.stuPhone = undefined
        this.dataForm.refundNo = undefined
        this.noSelect = false
        this.normalSearchVisible = false
        this.dataForm.status = undefined
        this.dataForm.ddingCode = undefined
        this.dataForm.paymentType = undefined
        this.dataForm.dateTime = undefined
        this.dataForm.schoolId = undefined
        this.dataForm.classTypeId = undefined
        this.dataForm.recruitUserName = undefined
        this.dataForm.recruitUserId = undefined
        this.dataForm.spreadUserName = undefined
        this.dataForm.spreadUserId = undefined
        this.dataForm.statusUserId = undefined
        this.dataForm.statusUserName = undefined
        this.params = {}
        this.pageQuery.queryKey = 'stuName'
        this.pageQuery.queryValue = ''
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
      changeSearchStyle () {
        this.normalSearchVisible = !this.normalSearchVisible
        this.getDataList()
      },
      hideSearch () {
        this.normalSearchVisible = !this.normalSearchVisible
        this.getDataList()
      },
       // 招生老师弹窗
      searchZsTeacherHandle () {
        this.zsTeacherVisible = true
        this.$nextTick(() => {
          this.$refs.zsTeacher.init()
        })
      },
      // 招生老师弹窗回调
      callBackZsTeacher (userId,userName) {
        this.dataForm.recruitUserName = userName
        this.dataForm.recruitUserId = userId
        // console.log(userId,userName)
      },
      // 推广老师弹窗
      searchTgTeacherHandle () {
        this.tgTeacherVisible = true
        this.$nextTick(() => {
          this.$refs.tgTeacher.init()
        })
      },
      // 推广老师弹窗回调
      callBackTgTeacher (userId,userName) {
        this.dataForm.spreadUserName = userName
        this.dataForm.spreadUserId = userId
        // console.log(userId,userName)
      },
       // 更改时间显示格式
      dateFormatter (row, column, cellValue) {
        return dateSubstring(cellValue)
      },
      // 审核人弹窗
      searchCheckPeoHandle () {
        this.checkPeoVisible = true
        this.$nextTick(() => {
          this.$refs.checkPeo.init()
        })
      },
      // 审核人弹窗回调
      callBackcheckPeo (userId,userName) {
        this.dataForm.statusUserId = userId
        this.dataForm.statusUserName = userName
      },
      // 通过操作
      accept (id) {
        this.$confirm(`确定通过?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          acceptRefund(id).then(res => {
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
        }).catch(err => {
          console.log(err)
        })
      },
      // 收款失败操作
      refuse (id) {
        this.$confirm(`确定收款失败?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          refuseRefund(id).then(res => {
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
        }).catch(err => {
          console.log(err)
        })
      },
      // 反审核操作
      uncheck (id) {
        this.$confirm(`确定反审核?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          uncheckRefund(id).then(res => {
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
        }).catch(err => {
          console.log(err)
        })
      },
      // 确认打款操作
      confirmGetMoney (id) {
        this.$confirm(`确定打款?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          getMoney(id).then(res => {
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
        }).catch(err => {
          console.log(err)
        })
      },
      // 操作
      handle (data) {
        this.refundHandleVisible = true 
        this.$nextTick(() => {
          this.$refs.refundHandle.init(data)
        })
      },
      // 详情
      detail (data) {
        this.refundDetailVisible = true 
        this.$nextTick(() => {
          this.$refs.refundDetail.init(data)
        })
      },
    }
  }
</script>

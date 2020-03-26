<template>
  <!--缴费单-->
  <div class="mod-user">
    <!-- 布局容器 -->
    <el-container>
      <!-- 右侧 -->
      <el-main>

        <el-row :gutter="24">
          <el-col :span="18">
            <el-button v-if="isAuth('stu:reg:payment:save')" :disabled="notPayment" type="primary" @click="payHandle()">缴费</el-button>
          </el-col>
        </el-row>

        <el-row :gutter="24" style="margin-top:15px;">
          <el-col :span="18">
            <el-input placeholder="请输入内容" v-model="pageQuery.queryValue" class="input-with-select" :disabled="normalSearchVisible">
              <el-select v-model="pageQuery.queryKey" slot="prepend" placeholder="请选择" style="width:100px" :disabled="normalSearchVisible">
                <el-option value="stuName" label="学员姓名">学员姓名</el-option>
                <el-option value="paymentNo" label="缴费单号">缴费单号</el-option>
                <el-option value="stuPhone" label="手机号">手机号</el-option>
              </el-select>
            </el-input>
          </el-col>
          <el-col :span="6">
              <el-button @click="getDataList()">查询</el-button>
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
                <el-form-item label="缴费单号" prop="paymentNo">
                  <el-input v-model="dataForm.paymentNo" placeholder="请输入缴费单号" clearable></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="stuName">
                  <el-input v-model="dataForm.stuName" placeholder="请输入学员名字" clearable></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="stuPhone">
                  <el-input v-model="dataForm.stuPhone" placeholder="请输入手机号码" clearable></el-input>
                </el-form-item>
                <el-form-item label="订单状态" prop="status">
                  <orderStatus v-model="dataForm.status" :clearable="noSelectOrderStatus"></orderStatus>
                </el-form-item>
                <el-form-item label="缴费类型" prop="paymentType">
                  <payType v-model="dataForm.paymentType" :clearable="noSelectPayType"></payType>
                </el-form-item>
                <el-form-item label="报读班型" prop="classTypeId">
                  <classTypeSelect v-model="dataForm.classTypeId" :clearable="noSelectClassType"></classTypeSelect>
                </el-form-item>
                <!-- <el-form-item label="渠道" prop="channeId">
                  <resourceSelect v-model="dataForm.channeId" :clearable="noSelectChannel"></resourceSelect>
                </el-form-item> -->
                <el-form-item label="校区" prop="schoolId">
                  <schoolSelect v-model="dataForm.schoolId" :clearable="noSelectSchool" :showAll="true"></schoolSelect>
                </el-form-item>

                <!-- 电邀老师 -->
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
        <el-table :data="dataList" border stripe v-loading="dataListLoading" highlight-current-row @row-click="handleRowlclick" style="width: 100%;margin-top:15px;">
          <!-- <el-table-column type="selection" header-align="center" align="center" width="50">
          </el-table-column> -->
          <el-table-column type="index" align="center" header-align="center" width="80" label="NO" fixed/>
          <el-table-column prop="paymentNo" align="center" header-align="center" width="180" label="缴费单号" fixed/>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left"  class="demo-table-expand">
                <!-- <el-table-column label="身份证" prop="cardId" header-align="center" align="center" width="180"/> -->
                <el-form-item label="是否锁单"><span>{{ props.row.lock }}</span></el-form-item>
                <el-form-item label="备注"><span>{{ props.row.remark }}</span></el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="stuName" align="center" header-align="center" width="120" label="学员"/>
          <el-table-column prop="receiptNo" align="center" header-align="center" width="100" label="收据单号"/>
          <el-table-column prop="stuPhone" align="center" header-align="center" width="150" label="手机"/>
          <el-table-column prop="schoolName" align="center" header-align="center" width="120" label="校区"/>
          <el-table-column prop="classTypeName" align="center" header-align="center" width="120" label="购买课程"/>
          <el-table-column prop="regPayPrice" align="center" header-align="center" width="100" label="订单金额"/>
          <el-table-column prop="paymentPayPrice" align="center" header-align="center" width="120" label="本次缴费金额"/>
          <el-table-column prop="status" align="center" header-align="center" width="100" label="缴费状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 1">回款审核中</span>
              <span v-if="scope.row.status === 2">已付款</span>
              <span v-if="scope.row.status === 3">收款失败</span>
            </template>
          </el-table-column>
          <el-table-column prop="paymentType" align="center" header-align="center" width="100" label="缴费类型">
            <template slot-scope="scope">
              <span v-if="scope.row.paymentType === 1">定金</span>
              <span v-if="scope.row.paymentType === 2">学费</span>
            </template>
          </el-table-column>
          <el-table-column prop="spreadStuRegSaleEntity.userName" align="center" width="120" header-align="center" label="电邀老师">
            <template slot-scope="scope">
              <span v-if="scope.row.spreadStuRegSaleEntity == null">--</span>
              <span v-else>{{scope.row.spreadStuRegSaleEntity.userName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="recruitStuRegSaleEntities" align="center" header-align="center" width="180" label="招生老师">
            <template slot-scope="scope">
              <el-tag v-for="site in scope.row.recruitStuRegSaleEntities" :key="site.userId" :label="site.userName" :value="site.userId">
                {{site.userName}}
              </el-tag>
            </template>
          </el-table-column>
          <!-- 回款审核人 -->
          <el-table-column prop="statusUserCallVo" align="center" header-align="center" width="120" label="审核人">
            <template slot-scope="scope">
              <span v-if="scope.row.statusUserCallVo == null">--</span>
              <span v-else>{{scope.row.statusUserCallVo.statusUserName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" align="center" header-align="center" width="120" :formatter="dateFormatter" label="创建时间"/>
          <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
            <template slot-scope="scope">
              <el-button type="text" v-if="isAuth('stu:reg:payment:update') && scope.row.lock == false && scope.row.status == 1" @click="handle(scope.row)">操作</el-button>
              <el-button type="text" v-if="isAuth('stu:reg:payment:update') && scope.row.status === 2 && scope.row.lock == false" size="small" @click="uncheck(scope.row.paymentId)">反审核</el-button>
              <el-button type="text" v-if="scope.row.status !== 1" @click="detail(scope.row)">详情</el-button>
              <!-- <el-button type="text" v-if="isAuth('stu:reg:payment:update') & scope.row.status == 1" size="small" @click="accept(scope.row.paymentId)">回款确认</el-button>
              <el-button type="text" v-if="isAuth('stu:reg:payment:update') & scope.row.status == 1" size="small" @click="refuse(scope.row.paymentId)">收款失败</el-button> -->
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
    <!--缴费操作-->
    <payEdit ref="payEdit" v-if="payEditVisible" @refreshDataList="getDataList"></payEdit>
    <!-- 操作 -->
    <handlePay ref="handlePay" v-if="handlePayVisible" @refreshDataList="getDataList"></handlePay>
    <!-- 详情 -->
    <paymentDetail ref="paymentDetail" v-if="paymentDetailVisible" @refreshDataList="getDataList"></paymentDetail>
    
  </div>

</template>

<script>
  import { getPaymentList, paymentList, acceptPayment, refusePayment, uncheckPayment } from '@/api/payment'
  import { parseTime } from '@/utils'
  import { dateSubstring } from '@/utils/index'
  import resourceSelect from '@/views/common-select/recource-select'
  // import schoolSelect from '@/views/common-select/school-select'
  import schoolSelect from '@/views/common-select/all-school-select'
  import classTypeSelect from '@/views/common-select/classtype-select'
  // import zsTeacher from '@/views/common-pop/zs-teacher-auth-pop'
  // import tgTeacher from '@/views/common-pop/tg-teacher-auth-pop'
  import zsTeacher from '@/views/common-select/zs-teacher-auth-select'
  import tgTeacher from '@/views/common-select/tg-teacher-auth-select'
  import payEdit from './payment-add'
  import payStatus from '@/views/common-select/payment-select'
  import payType from '@/views/common-select/payType-select'
  import orderStatus from '@/views/common-select/order-select'
  import handlePay from './payment-handle'
  import paymentDetail from './payment-detail'

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
          paymentNo: undefined,
          schoolId: undefined,
          // schoolName: undefined,
          status: '',
          paymentType: undefined,
          channeId: undefined,
          // 招生老师
          recruitUserName: undefined,
          recruitUserId: undefined,
          // 推广老师
          spreadUserName: undefined,
          spreadUserId: undefined,
          dateTime: undefined,
          classTypeId: undefined
        },
        adVancedDataForm: {
          payNo: undefined,
          phone: undefined,
          userName: undefined
        },
        notPayment: true,
        pageQuery: {
          queryKey: 'stuName',
          queryValue: null
        },
        // status: [
        //   { value: 1, label: '回款审核中' },
        //   { value: 2, label: '收款失败' },
        //   { value: 0, label: '已付款' }
        // ],
        params: {},
        dataSelections: [],
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
        noSelectPayStatus: true,
        noSelectPayType: true,
        noSelectOrderStatus: true,
        zsTeacherVisible: false,
        tgTeacherVisible: false,
        payEditVisible: false,
        handlePayVisible: false,
        // 详情
        paymentDetailVisible: false,
        rowData: '',
      }
    },
    components: {
    //   schoolAllSidebar, stopAdd, resumeClasses
      resourceSelect, schoolSelect, zsTeacher, tgTeacher, classTypeSelect, payEdit, payStatus, payType, orderStatus , handlePay, paymentDetail
    },
    activated () {
      let paymentSearchNo = this.paymentSearchNo || 0
      if(paymentSearchNo == 0){
        this.getDataList()
      } else {
        this.getDataListMes(paymentSearchNo)
      }
      this.dataSelections = []
      this.notPayment = true
    },
    watch: {
      paymentSearchNo (rowData) {
        if(rowData !== 0){
          this.getDataListMes(rowData)
        } else {
          this.getDataList()
        }
        this.dataSelections = []
        this.notPayment = true
      }
    },
    computed: {
      paymentSearchNo: {
        get () { return this.$store.state.common.paymentSearchNo },
        set (val) { this.$store.commit('common/setPaymentNo', val) }
      },
    },
    methods: {
      // 消息加载数据列表
      getDataListMes (rowData) {
        this.pageQuery = {
          queryKey: 'paymentNo',
          queryValue: rowData
        }
        this.params['page'] = this.pageIndex
        this.params['limit'] = this.pageSize
        this.params['paymentNo'] = rowData
        paymentList(this.params).then(res => {
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
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        let startDateTime = null
        let endDateTime = null
        if (this.dataForm.dateTime) {
          startDateTime = parseTime(this.dataForm.dateTime[0], '{y}-{m}-{d} 00:00:00')
          endDateTime = parseTime(this.dataForm.dateTime[1], '{y}-{m}-{d} 23:59:59')
        }
        this.params = {}
        if(this.normalSearchVisible == false){
          this.params['page'] = this.pageIndex
          this.params['limit'] = this.pageSize
          if(this.pageQuery.queryKey !== '' ){
            this.params[this.pageQuery.queryKey] = this.pageQuery.queryValue
          }
          paymentList(this.params).then(res => {
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
        }else{
          this.dataListLoading = true
          getPaymentList(
            this.pageIndex, this.pageSize,
            this.dataForm.paymentNo, this.dataForm.stuName, this.dataForm.stuPhone,
            this.dataForm.channeId, this.dataForm.schoolId, this.dataForm.classTypeId,this.dataForm.paymentType,this.dataForm.status,
            startDateTime,endDateTime,this.dataForm.recruitUserId,this.dataForm.spreadUserId)
          .then(res => {
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
        }

      },
      // 重置查询条件
      resetSearch () {
        this.dataForm.stuName = undefined
        this.dataForm.stuPhone = undefined
        this.dataForm.paymentNo = undefined
        this.noSelect = false
        this.normalSearchVisible = false
        this.dataForm.recruitUserName = undefined
        this.dataForm.recruitUserId = undefined
        this.dataForm.spreadUserName = undefined
        this.dataForm.spreadUserId = undefined
        this.dataForm.status = undefined
        this.dataForm.dateTime = undefined
        this.dataForm.paymentType = undefined
        this.dataForm.channeId = undefined
        this.dataForm.schoolId = undefined
        this.dataForm.classTypeId = undefined
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
      },

      // 缴费操作
      payHandle () {
        this.payEditVisible = true
        this.$nextTick(() => {
          this.$refs.payEdit.init(this.dataSelections)
        })
      },
      // 更改时间显示格式
      dateFormatter (row, column, cellValue) {
        return dateSubstring(cellValue)
      },
      // 选中某行事件
      handleRowlclick (row) {
        this.notPayment = false
        this.dataSelections = row
      },
      // 通过操作
      accept (id) {
        this.$confirm(`确定通过?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          acceptPayment(id).then(res => {
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
          refusePayment(id).then(res => {
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
          uncheckPayment(id).then(res => {
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
      // 操作事件
      handle (data) {
        this.handlePayVisible = true
        this.$nextTick(() => {
          this.$refs.handlePay.init(data)
        })
      },
      detail (data) {
        this.paymentDetailVisible = true
        this.$nextTick(() => {
          this.$refs.paymentDetail.init(data)
        })
      }
    }
  }
</script>

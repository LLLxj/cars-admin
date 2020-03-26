<template>
  <div class="mod-user">
    <!-- 布局容器 -->
    <el-container>
      <!-- 右侧 -->
      <el-main>

        <el-row :gutter="24">
          <el-col :span="18">
            <!--新增优惠按钮-->
            <el-button type="primary" v-if="isAuth('stu:reg:off:save')" @click="addBenefit()">新增优惠</el-button>
          </el-col>
        </el-row>

        <el-row :gutter="24" style="margin-top:15px">
          <el-col :span="18">
            <el-input placeholder="请输入内容" v-model="pageQuery.queryValue" class="input-with-select" :disabled="normalSearchVisible">
                <el-select v-model="pageQuery.queryKey" slot="prepend" placeholder="请选择" style="width:100px" :disabled="normalSearchVisible">
                  <el-option value="stuName" label="学员姓名">学员姓名</el-option>
                  <el-option value="offNo" label="优惠单号">优惠单号</el-option>
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
            <el-row :gutter="24" style="margin-top:15px;" v-if="normalSearchVisible">
              <el-col :span="24">
                <el-form-item label="优惠单号" prop="offNo">
                  <el-input v-model="dataForm.offNo" placeholder="请输入优惠单号" clearable></el-input>
                </el-form-item>
                  <el-form-item label="姓名" prop="stuName">
                      <el-input v-model="dataForm.stuName" placeholder="请输入学员名字" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="手机" prop="stuPhone">
                      <el-input v-model="dataForm.stuPhone" placeholder="请输入手机号码" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="校区" prop="schoolId">
                    <schoolSelect v-model="dataForm.schoolId" :clearable="noSelectSchool" :showAll="true" />
                  </el-form-item>
                   <el-form-item label="报读班型" prop="classTypeId">
                    <classTypeSelect v-model="dataForm.classTypeId" :clearable="noSelectClassType"></classTypeSelect>
                  </el-form-item>

                  <el-form-item label="申请状态" prop="status">
                      <el-select v-model="dataForm.status" placeholder="全部" :clearable="noSelect">
                          <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value">
                          </el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="钉钉单号" prop="ddingCode">
                      <el-input v-model="dataForm.ddingCode" placeholder="请输入钉钉单号" clearable></el-input>
                  </el-form-item>

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

                  <!-- <el-form-item label="审核人" prop="statusUserName">
                      <el-input v-model="dataForm.statusUserName" placeholder="审核人" readonly @click.native="searchCheckPeoHandle()" prefix-icon="el-icon-search"></el-input>
                  </el-form-item>
                  <el-form-item label="创建人" prop="creatorName">
                      <el-input v-model="dataForm.creatorName" placeholder="创建人" clearable @click.native="searchCreatorPeoHandle()" prefix-icon="el-icon-search"></el-input>
                  </el-form-item> -->

                  <!-- <el-form-item label="渠道" prop="channeId">
                    <resourceSelect v-model="dataForm.channeId" :clearable="noSelectChannel"></resourceSelect>
                  </el-form-item> -->


                  <el-form-item label="创建日期" prop="dateTime">
                    <el-date-picker v-model="dataForm.dateTime" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                      value-format="yyyy-MM-dd 00:00:00" :clearable="true" :picker-options="datePickerOptions">
                    </el-date-picker>
                  </el-form-item>

              </el-col>
            </el-row>
        </el-form>

        <!-- <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;margin-top:15px;" @selection-change="selectionChangeHandle"
        highlight-current-row @row-click="handleRowlclick"> -->

        <el-table :data="dataList" border stripe v-loading="dataListLoading"  highlight-current-row @row-click="handleRowlclick" style="width: 100%;margin-top:15px;">
          <!-- <el-table-column type="selection" header-align="center" align="center" width="50" fixed/> -->
          <el-table-column type="index" align="center" header-align="center" width="80" label="NO" fixed/>
          <el-table-column align="center" prop="offNo" header-align="center" width="180" label="优惠单号" fixed/>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left"  class="demo-table-expand">
                <!-- <el-table-column label="身份证" prop="cardId" header-align="center" align="center" width="180"/> -->
                <el-form-item label="备注"><span>{{ props.row.remark }}</span></el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="stuName" header-align="center" width="120" label="学员"/>
          <el-table-column align="center" prop="stuPhone" header-align="center" width="150" label="手机"/>
          <el-table-column align="center" prop="schoolName" header-align="center" width="120" label="校区"/>
          <el-table-column align="center" prop="classTypeName" header-align="center" width="120" label="购买课程"/>
          <el-table-column align="center" prop="offPrice" header-align="center" width="100" label="优惠金额"/>

          <el-table-column label="电邀老师" prop="spreadStuRegSaleEntity.userName" header-align="center" align="center" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.spreadStuRegSaleEntity !== null">{{scope.row.spreadStuRegSaleEntity.userName}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="招生老师" prop="recruitStuRegSaleEntities" header-align="center" align="center" width="180">
            <template slot-scope="scope">
              <el-tag v-for="site in scope.row.recruitStuRegSaleEntities" :key="site.userId" :label="site.userName" :value="site.userId">
                {{site.userName}}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column align="center" prop="status" header-align="center" width="100" label="申请状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 1">财务审核中</span>
              <span v-if="scope.row.status === 2">已优惠</span>
              <span v-if="scope.row.status === 3">优惠失败</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="ddingCode" header-align="center" width="150" label="钉钉号">
            <template slot-scope="scope">
              <span v-if="scope.row.ddingCode == ''">--</span>
              <span v-else>{{scope.row.ddingCode}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="statusUserCallVo" align="center" header-align="center" width="120" label="审核人">
            <template slot-scope="scope">
              <span v-if="scope.row.statusUserCallVo == null">--</span>
              <span v-else>{{scope.row.statusUserCallVo.statusUserName}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column align="center" prop="creatorName" header-align="center" label="创建人" width="150" /> -->
          <el-table-column align="center" prop="createTime" header-align="center" :formatter="dateFormatter" label="创建时间" width="150" />
          <el-table-column fixed="right" header-align="center" align="center" label="操作" width="150">
            <template slot-scope="scope">
              <el-button type="text" size="small" v-if="isAuth('stu:reg:off:update') && scope.row.status == 1" @click="handle(scope.row)">操作</el-button>
              <el-button type="text" size="small" v-if="isAuth('stu:reg:off:update') && scope.row.status == 2" @click="uncheck(scope.row.offId)">反审核</el-button>
              <el-button type="text" size="small" v-if="scope.row.status !== 1" @click="detail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" background :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
          :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </el-main>
    </el-container>
    <!-- 审核人弹窗 -->
    <checkPeo ref="checkPeo" v-if="checkPeoVisible" @all-check-pop-event="callBackcheckPeo"></checkPeo>
    <!-- 创建人弹窗 -->
    <creatorPeo ref="creatorPeo" v-if="creatorPeoVisible" @all-creator-pop-event="callBackCreatorPeo"></creatorPeo>
    <!-- 申请优惠 -->
    <firstBenefit ref="firstBenefit" v-if="firstBenefitVisible" @refreshDataList="getDataList"></firstBenefit>
    <!-- 操作 -->
    <benefitHandle ref="benefitHandle" v-if="benefitHandleVisible" @refreshDataList="getDataList"></benefitHandle>
    <!-- 详情 -->
    <benefitDetail ref="benefitDetail" v-if="benefitDetailVisible" @refreshDataList="getDataList"></benefitDetail>
    <!-- 招生老师弹窗 -->
    <zsTeacher ref="zsTeacher" v-if="zsTeacherVisible" @zs-pop-event="callBackZsTeacher"></zsTeacher>
    <!-- 推广老师弹窗 -->
    <tgTeacher ref="tgTeacher" v-if="tgTeacherVisible" @tg-pop-event="callBackTgTeacher"></tgTeacher>
  </div>

</template>

<script>
  import { getBenefitList, benefitList, acceptBenefit, refuseBenefit, uncheckBenefit } from '@/api/benefit'
  // import tgTeacher from '@/views/common-pop/tg-teacher-auth-pop'
  // import zsTeacher from '@/views/common-pop/zs-teacher-auth-pop'
  import zsTeacher from '@/views/common-select/zs-teacher-auth-select'
  import tgTeacher from '@/views/common-select/tg-teacher-auth-select'
  import resourceSelect from '@/views/common-select/recource-select'
  // import schoolSelect from '@/views/common-select/school-select'
  import schoolSelect from '@/views/common-select/all-school-select'
  import classTypeSelect from '@/views/common-select/classtype-select'
  import firstBenefit from './benefit-first-add'
  import checkPeo from '@/views/common-pop/all-check-auth-pop'
  import creatorPeo from '@/views/common-pop/creator-auth-pop'
  import { dateSubstring } from '@/utils/index'
  import { parseTime } from '@/utils'
  import benefitHandle from './benefit-handle'
  import benefitDetail from './benefit-detail'

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
        dataListSelections: [],
        firstBenefitVisible: false,
        benefitHandleVisible: false,
        value: '',
        dataForm: {
          stuPhone: undefined,
          stuName: undefined,
          offNo: undefined,
          schoolId: undefined,
          schoolName: undefined,
          status: undefined,
          dateTime: undefined,
          classTypeId: undefined,
          ddingCode: undefined,
          statusUserId: undefined,
          statusUserName: undefined,
          creatorId: undefined,
          creatorName: undefined,
          spreadUserName: undefined,
          spreadUserId: undefined,
          recruitUserName: undefined,
          recruitUserId: undefined
        },
        adVancedDataForm: {
          offNo: undefined,
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
          { value: 2, label: '已优惠' },
          { value: 3, label: '优惠失败' }
        ],
        params: {},
        dataList: [],
        dataSelections: [],
        dataSelect: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        downloadLoading: false,
        dataListLoading: false,
        dialogFormVisible: false,
        noSelect: true,
        normalSearchVisible: false,
        noSelectSchool: true,
        noSelectClassType: true,
        benefitVisible: false,
        notBenefit: true,
        checkPeoVisible: false,
        creatorPeoVisible: false,
        // 详情
        benefitDetailVisible: false,
        tgTeacherVisible: false,
        zsTeacherVisible: false,
      }
    },
    components: {
    //   schoolAllSidebar, stopAdd, resumeClasses
      resourceSelect, schoolSelect, classTypeSelect, checkPeo, creatorPeo, firstBenefit, benefitHandle, benefitDetail, tgTeacher, zsTeacher
    },
    activated () {
      let offSearchNo = this.offSearchNo || 0
      if(offSearchNo == 0){
        this.getDataList()
      } else {
        this.getDataListMes(offSearchNo)
      }
    },
    computed: {
      offSearchNo: {
        get () { return this.$store.state.common.offSearchNo },
        set (val) { this.$store.commit('common/setOffSearchNo', val) }
      },
    },
    watch: {
      offSearchNo (rowData) {
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
          queryKey: 'offNo',
          queryValue: rowData
        }
        this.params['page'] = this.pageIndex
        this.params['limit'] = this.pageSize
        this.params['offNo'] = rowData
        benefitList(this.params).then(res => {
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
         this.params = {}
        if(this.normalSearchVisible == false){
          // console.log('折叠状态')
          this.params['page'] = this.pageIndex
          this.params['limit'] = this.pageSize
          if(this.pageQuery.queryKey !== '' ){
            this.params[this.pageQuery.queryKey] = this.pageQuery.queryValue
          }
          benefitList(this.params).then(res => {
            if (res.data && res.data.code === 0) {
              var tempData = res.data.data.list
              for(var i in tempData){
                tempData[i].createTime = tempData[i].createTime.substring(0,10)
              }
              this.dataList = tempData
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
          getBenefitList(
            this.pageIndex, this.pageSize, this.dataForm.offNo, this.dataForm.stuName, this.dataForm.stuPhone, this.dataForm.schoolId, this.dataForm.classTypeId,
            this.dataForm.status, this.dataForm.ddingCode, this.dataForm.spreadUserId, this.dataForm.recruitUserId, startDateTime, endDateTime)
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
        this.dataForm.offNo = undefined
        this.dataForm.stuName = undefined
        this.dataForm.stuPhone = undefined
        this.dataForm.schoolId = undefined
        this.dataForm.classTypeId = undefined
        this.dataForm.status = undefined
        this.dataForm.ddingCode = undefined
        this.dataForm.statusUserId = undefined
        this.dataForm.statusUserName = undefined
        this.dataForm.creatorId = undefined
        this.dataForm.creatorName = undefined
        this.dataForm.dateTime = undefined
        this.dataForm.spreadUserName = undefined
        this.dataForm.spreadUserId = undefined
        this.dataForm.recruitUserName = undefined
        this.dataForm.recruitUserId = undefined
        this.noSelect = false
        this.normalSearchVisible = false
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
       // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 选中某行
      handleRowlclick (row) {
        this.noBenefit = false
        this.dataSelections = row
      },
      // 更改时间显示格式
      dateFormatter (row, column, cellValue) {
        return dateSubstring(cellValue)
      },
      // 选中某行事件
      handleRowlclick (row) {
        this.notBenefit = false
        this.dataSelect = row
      },
      // 反审核
      uncheck (id) {
        this.$confirm(`确定反审核?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          uncheckBenefit(id).then(res => {
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
        })
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

        // 创建人弹窗
      searchCreatorPeoHandle () {
        this.creatorPeoVisible = true
        this.$nextTick(() => {
          this.$refs.creatorPeo.init()
        })
      },
      // 审核人弹窗回调
      callBackCreatorPeo (userId,userName) {
        this.dataForm.creatorId = userId
        this.dataForm.creatorName = userName
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
      // 新增
      addBenefit () {
        this.firstBenefitVisible = true
        this.$nextTick(() => {
          this.$refs.firstBenefit.init()
        })
      },
      // 操作
      handle (data) {
        this.benefitHandleVisible = true
        this.$nextTick(() => {
          this.$refs.benefitHandle.init(data)
        })
      },
      detail (data) {
        this.benefitDetailVisible = true
        this.$nextTick(() => {
          this.$refs.benefitDetail.init(data)
        })
      }
    }
  }
</script>

<template>
  <div class="mod-user">
    <!--布局容器-->
    <el-container>
      <!--右侧-->
      <el-main>
        <!-- <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" @submit.native.prevent> -->
        <el-form :inline="true" :model="searchData">
          <!-- <el-form-item label="客户手机号">
            <el-input v-model="dataForm.dealPhone" placeholder="请输入手机号" clearable></el-input>
          </el-form-item> -->
          <el-form-item label="风险名称" prop="productName">
            <el-input v-model="searchData.productName" placeholder="请输入风险名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="信用等级" prop="creditRating">
            <el-input v-model="searchData.creditRating" placeholder="请输入信用等级" clearable></el-input>
          </el-form-item>
          <el-form-item label="执行能否操作" prop="isExecute">
            <el-select v-model="searchData.isExecute" placeholder="请选择">
              <el-option v-for="item in isExecuteList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="司法风险" prop="judicialRisk">
            <el-select v-model="searchData.judicialRisk" placeholder="请选择">
              <el-option v-for="item in judicialRiskList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="多头风险借贷" prop="mickleRisk">
            <el-select v-model="searchData.mickleRisk" placeholder="请选择">
              <el-option v-for="item in mickleRiskList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="可否可做事故车" prop="isAccidentCar">
            <el-select v-model="searchData.isAccidentCar" placeholder="请选择">
              <el-option v-for="item in isExecuteList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="已过科目几" prop="subject">
            <el-select v-model="searchData.subject" placeholder="请选择">
              <el-option v-for="item in subjectList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="免担保年龄要求" prop="ageNoGuarantee">
            <el-input v-model="searchData.ageNoGuarantee" placeholder="请输入风险名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="是否有行驶证" prop="isDriverCard">
            <el-select v-model="searchData.isDriverCard" placeholder="请选择">
              <el-option v-for="item in isExecuteList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否有行驶证" prop="isDriverCard">
            <el-select v-model="searchData.isDriverCard" placeholder="请选择">
              <el-option v-for="item in isExecuteList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否蓝牌货车" prop="isBlueCard">
            <el-select v-model="searchData.isBlueCard" placeholder="请选择">
              <el-option v-for="item in isExecuteList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchData.status" placeholder="请选择">
              <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getDataList1()">查询</el-button>
            <el-button v-if="isAuth('loan:product:save')" type="primary" @click="addHandle()">新增</el-button>
            <el-button @click="resetFrom()">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="dataList" border stripe v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;" id="dataListUser">
          <el-table-column type="index" align="center" header-align="center" width="80" label="NO" fixed/>
          <el-table-column prop="productName" header-align="center" align="center" label="产品名称" min-width="140px" />
          <el-table-column prop="percent" header-align="center" align="center" label="贷款成数" min-width="140px" />
          <el-table-column prop="interestRate" header-align="center" align="center" label="贷款利率" min-width="140px" />
          <el-table-column prop="creditRating" header-align="center" align="center" label="信用等级" min-width="140px" />
          <el-table-column prop="age" header-align="center" align="center" label="年龄要求" min-width="140px" />
          <el-table-column header-align="center" align="center" label="执行中能否操作" min-width="140px"> 
            <template slot-scope="scope">
              <el-tag type="info" v-if="scope.row.isExecute === 0">否</el-tag>
              <el-tag v-else>是</el-tag>
            </template>
					</el-table-column>
          <el-table-column prop="judicialRisk" header-align="center" align="center" label="司法风险" min-width="140px">
            <template slot-scope="scope">
              {{ renderColumn('judicialRiskList', scope.row.judicialRisk) }}
            </template>
          </el-table-column>
          <el-table-column prop="mickleRisk" header-align="center" align="center" label="多头借贷风险" min-width="140px">
            <template slot-scope="scope">
              {{ renderColumn('mickleRiskList', scope.row.mickleRisk) }}
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center" label="是否可做事故车" min-width="140px"> 
            <template slot-scope="scope">
              <el-tag type="info" v-if="scope.row.isAccidentCar === 0">否</el-tag>
              <el-tag v-else>是</el-tag>
            </template>
					</el-table-column>
          <el-table-column prop="carAge" header-align="center" align="center" label="车龄要求" min-width="140px" />

          <el-table-column prop="subject" header-align="center" align="center" label="已过科目几" min-width="140px">
            <template slot-scope="scope">
              {{ renderColumn('subjectList', scope.row.subject) }}
            </template>
          </el-table-column>
          <el-table-column prop="ageNoGuarantee" header-align="center" align="center" label="免担保年龄要求" min-width="140px" />
          <el-table-column header-align="center" align="center" label="是否有驾驶证" min-width="140px"> 
            <template slot-scope="scope">
              <el-tag type="info" v-if="scope.row.isDriverCard === 0">否</el-tag>
              <el-tag v-else>是</el-tag>
            </template>
					</el-table-column>
          <el-table-column prop="mortgageCarNum" header-align="center" align="center" label="名下有按揭车辆台数" min-width="140px" />
          <el-table-column header-align="center" align="center" label="是否蓝牌货车可做" min-width="140px"> 
            <template slot-scope="scope">
              <el-tag type="info" v-if="scope.row.isBlueCard === 0">否</el-tag>
              <el-tag v-else>是</el-tag>
            </template>
					</el-table-column>
          <el-table-column prop="loanBankNum" header-align="center" align="center" label="银行机构借款申请次数" min-width="140px" />
          <el-table-column prop="loanUnBankNum" header-align="center" align="center" label="非银行机构借款申请次数" min-width="140px" />
          <el-table-column header-align="center" align="center" label="产品" min-width="140px"> 
            <template slot-scope="scope">
              <el-tag v-for="item in scope.row.recordVos" :key="item.recordId">{{ item.recordName }}</el-tag>
            </template>
					</el-table-column>
          <el-table-column header-align="center" align="center" label="状态" min-width="140px"> 
            <template slot-scope="scope">
              <el-tag type="info" v-if="scope.row.status === 0">禁用</el-tag>
              <el-tag v-else>正常</el-tag>
            </template>
					</el-table-column>
          <el-table-column fixed="right" header-align="center" align="center" width="230" label="操作">
            <template slot-scope="scope">
              <el-button v-if="isAuth('loan:product:normal') && scope.row.status === 0" type="text" size="small" @click="normalHandle(scope.row.productId)">启用</el-button>
              <el-button v-if="isAuth('loan:product:disable') &&  scope.row.status === 1" type="text" size="small" @click="disableHandle(scope.row.productId)">禁用</el-button>
              <el-button v-if="isAuth('loan:product:update')" type="text" size="small" @click="editHandle(scope.row)">编辑</el-button>
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
        <!-- <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update> -->
				<!-- <recordList v-if="recordListVisible" ref="recordList"></recordList> -->
        <!-- 弹窗, 上传文件 -->
        <!-- <uploadPop v-if="uploadPopVisible" ref="uploadPop" @refreshDataList="getDataList"></uploadPop> -->
      </el-main>
    </el-container>
    <ProductAdd v-if="productAddVisible" ref="productAdd" @refreshDataList="getDataList" />
  </div>
</template>
<script>
  import Product from '@/api/product/product'
  import TypeSelect from '@/views/common-select/customer-type-select'
	import AddOrUpdate from '@/views/modules/customer/user-finance'
	// import recordList from './finance-record'
  import uploadPop from '@/views/common-pop/upload-user-pop'
  import ElContainer from 'element-ui/packages/container/index'
  import ElAside from 'element-ui/packages/aside/index'
  import ElMain from 'element-ui/packages/main/index'
  import BusinessSelect from '@/views/common-select/all-business-select'
  import ProductAdd from './product-add'
  import Vue from 'vue'
  export default {
    data () {
      return {
        searchData: {
          productName: '',
          page: 1,
          limit: 10,
          status: '',
          isExecute: '',
          judicialRisk: '',
          mickleRisk: '',
          isAccidentCar: '',
          subject: '',
          ageNoGuarantee: '',
          isDriverCard: '',
          isBlueCard: '',
          status: ''
        },
        productAddVisible: false,
        statusList: [
          { label: '禁用', value: 0 },
          { label: '正常', value: 1 }
        ],
        judicialRiskList: [
          { label: '无风险', value: 0 },
          { label: '低风险', value: 1 },
          { label: '中风险', value: 2 },
          { label: '高风险', value: 3 }
        ],
        isExecuteList: [
          { label: '否', value: 0 },
          { label: '是', value: 1 },
        ],
        mickleRiskList: [
          { label: '无风险', value: 0 },
          { label: '低风险', value: 1 },
          { label: '中风险', value: 2 },
          { label: '高风险', value: 3 }
        ],
        subjectList: [
          { label: '科目一', value: 0 },
          { label: '科目二', value: 1 },
          { label: '科目三', value: 2 },
          { label: '科目四', value: 3 }
        ],
        dataList: [],
        isShow: true,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        downloadLoading: false,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
				uploadPopVisible: false,
				recordListVisible: false,
        id: '',
        visible: false,
        dataForm: {
          recordId: '',
          recordName: ''
        },
      }
    },
    components: {
      // AddOrUpdate,
      TypeSelect,
      ElContainer,
      ElAside,
      ElMain,
			uploadPop,
      BusinessSelect,
      ProductAdd
			// recordList
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList1() {
        this.pageIndex = 1
        this.dataForm.page = 1
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        Product.list(this.searchData).then(res => {
          if (res.data && res.data.code === 0) {
            this.dataList = res.data.data.list
            this.totalPage = res.data.data.totalCount
            if(this.dataList !== null){
              this.isShow = false
            }
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      addHandle () {
        this.productAddVisible = true
        this.$nextTick(() => {
          this.$refs.productAdd.init()
        })
      },
      cancle () {
        this.visible = false
        this.dataForm = {
          recordId: '',
          recordName: ''
        }
      },
      editHandle (data) {
        console.log(data)
        this.productAddVisible = true
        this.$nextTick(() => {
          this.$refs.productAdd.init(data.productId)
        })
      },
      renderColumn (key, data) {
        let tempArr = []
        tempArr = this[key].filter(item => item.value === data)
        return tempArr.length ? tempArr[0].label : '-'
      },
      normalHandle (data) { // 处理中
        Product.normal(data).then(res => {
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
        }).catch(err => {
          this.listLoading = false
          console.log(err)
          this.$message({
            message: err || '读取接口失败！',
            type: 'error',
            duration: 1500
          })
        })
        // disable
      },
      disableHandle (data) { // 完成
        Product.disable(data).then(res => {
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
        }).catch(err => {
          this.listLoading = false
          console.log(err)
          this.$message({
            message: err || '读取接口失败！',
            type: 'error',
            duration: 1500
          })
        })
        // disable
      },
      resetFrom () {
        this.searchData = {
          recordName: '',
          page: 1,
          limit: 10,
          status: ''
        }
        this.getDataList()
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.dataForm.limit = val
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.dataForm.page = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        console.log(id)
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
			},
			getRecord (id) {
        this.recordListVisible = true
        this.$nextTick(() => {
          this.$refs.recordList.init(id)
        })
      },
      dataFormSubmit () {
        Record[this.id ? 'update' : 'save'](this.dataForm).then(({data})=> {
          if (data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.cancle()
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 删除
      deleteHandle (id) {
        // var userIds = id ? [id] : this.dataListSelections.map(item => {
        //   return item.userId
        // })
        this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Customer.delete(id).then(({data}) => {
            if (data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          }).catch(err => {
            console.log(err)
          })
        }).catch(() => {})
      },
    }
  }
</script>

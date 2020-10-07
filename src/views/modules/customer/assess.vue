<template>
  <div class="mod-user">
    <!--布局容器-->
    <el-container>
      <!--右侧-->
      <el-main>
        <!-- <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" @submit.native.prevent> -->
        <el-form :inline="true" :model="dataForm">
          <el-form-item label="请输入用户名">
            <el-input v-model="dataForm.dealUserName" placeholder="请输入用户名" clearable></el-input>
          </el-form-item>
          <el-form-item label="请输入手机号">
            <el-input v-model="dataForm.phone" placeholder="请输入手机号" clearable></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <TypeSelect v-model="dataForm.type"></TypeSelect>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList()">查询</el-button>
            <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
            <el-button @click="resetFrom()">重置</el-button>
            <!-- <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
            <el-button type="info" :disabled="isShow" :loading="downloadLoading" @click="exportHandle()">导出</el-button>
            <el-button type="danger" :loading="downloadLoading" @click="downFile()">下载模板</el-button>
            <el-button type="primary" :loading="downloadLoading" @click="uploadHandle()">上传文件</el-button> -->
            
          </el-form-item>
        </el-form>
        <el-table :data="dataList" border stripe v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;" id="dataListUser">
          <el-table-column type="index" align="center" header-align="center" width="80" label="NO" fixed="left"/>
          <el-table-column prop="couWaresName" header-align="center" align="center" label="商品名称" fixed="left" width="120"/>
          <!-- <el-table-column prop="dealUserName" header-align="center" align="center" label="客户名称" /> -->
          <el-table-column prop="dealAssessPrice" header-align="center" align="center" label="评估价格" width="100"/>
          <el-table-column header-align="center" align="center" label="商品照片" min-width="160">
            <template slot-scope="scope">
							<div v-if="scope.row.waresImages && scope.row.waresImages.length !==0 ">
								<div v-for="(item, index) in scope.row.waresImages" :key="index">
									<img :src="item.image" style="width:40px" alt="">
								</div>
							</div>
							<span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="couBrandName" header-align="center" align="center" label="所属品牌名称" width="120"/>
          <el-table-column prop="couSeriesName" header-align="center" align="center" label="所属品牌系列名称" width="120"/>
          <el-table-column prop="proAreaName" header-align="center" align="center" label="省级区域名称" width="100"/>
          <el-table-column prop="cityAreaName" header-align="center" align="center" label="市级区域名称" width="100"/>
          <el-table-column prop="countyAreaName" header-align="center" align="center" label="县/区级区域名称" width="100"/>
          <el-table-column prop="distance" header-align="center" align="center" label="行驶里程" width="80"/>
          <el-table-column header-align="center" align="center" label="驾驶证照片" min-width="80">
            <template slot-scope="scope">
							<div v-if="scope.row.driveImage && scope.row.driveImage.image !== ''">
              	<img :src="scope.row.driveImage.image" style="width:40px" alt="">
							</div>
							<span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" header-align="center" align="center" label="评估状态" width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0">待审核</span>
              <span v-else>已审核</span>
            </template>
          </el-table-column>
          <el-table-column prop="sellStatus" header-align="center" align="center" label="交易状态" width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.sellStatus === 0">未交易</span>
              <span v-else-if="scope.row.sellStatus === 1">交易中</span>
              <span v-else>已交易</span>
            </template>
          </el-table-column>
          <el-table-column prop="examineTime" header-align="center" align="center" label="审核时间" width="100"/>          
          <!-- <el-table-column prop="loginTime" header-align="center" align="center" width="180" label="创建时间">
          </el-table-column> -->
          <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
            <template slot-scope="scope">
              <!-- <el-button type="text" size="small" v-if="scope.row.status === 1" @click="disHandle(scope.row.dealAssessId)">禁用</el-button> 
              <el-button type="text" size="small" v-if="scope.row.status === 0" @click="norHandle(scope.row.dealAssessId)">启用</el-button> -->
              <el-button type="text" size="small" v-if="scope.row.status === 0" @click="assesHandle(scope.row.dealAssessId)">评估</el-button>
              <el-button type="text" size="small" v-if="scope.row.sellStatus === 0" @click="sellHandle(scope.row.dealAssessId, 1)">出售</el-button>
              <!-- <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.dealAssessId)">编辑</el-button> -->
              <!-- <el-button type="text" size="small" @click="deleteHandle(scope.row.userId)">删除</el-button> -->
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
        <!-- 弹窗, 上传文件 -->
        <AssessPrice v-if="AssessPriceVisible" ref="AssessPrice" @refreshDataList="getDataList"></AssessPrice>
        <SellUpdate v-if="sellUpdateVisible" ref="SellUpdate" @refreshDataList="getDataList"></SellUpdate>
      </el-main>
    </el-container>
  </div>
</template>
<script>

  import Assess from '@/api/customer/assess'
  import TypeSelect from '@/views/common-select/customer-type-select'
  import AddOrUpdate from './assess-update'
  import SellUpdate from './sell-add'
  import AssessPrice from './assess-price'
  import uploadPop from '@/views/common-pop/upload-user-pop'
  import ElContainer from 'element-ui/packages/container/index'
  import ElAside from 'element-ui/packages/aside/index'
  import ElMain from 'element-ui/packages/main/index'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  import Vue from 'vue'
  export default {
    data () {
      return {
        dataForm: {
          dealUserId: '',
          startTime: '',
          endTime: '',
          status: '',
        },
        dataList: [],
        isShow: true,
        pageIndex: 1,
        pageSize: 10,
				totalPage: 0,
				AssessPriceVisible: false,
        downloadLoading: false,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        uploadPopVisible: false,
        sellUpdateVisible: false,
        searchData: {
        },
      }
    },
    components: {
      AddOrUpdate,
      TypeSelect,
      ElContainer,
      ElAside,
      ElMain,
			uploadPop,
      AssessPrice,
      SellUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList (params) {
        this.dataListLoading = true
        params = this.dataForm || null
        Assess.list(params).then(res => {
          if (res.data && res.data.code === 0) {
            this.dataList = res.data.data.list
            this.totalPage = res.data.data.totalCount
            if(this.dataList !== null){
              this.isShow = false
            }
          } else {
            this.dataList = []
            this.totalPage = 0
            this.$message.error(res.data.msg)
          }
          this.dataListLoading = false
        })
      },
      schoolTreeChangeEvent (deptId) {
        this.dataForm.deptId = deptId
        this.getDataList()
			},
			assesHandle(id) { // 评估价格操作
				this.AssessPriceVisible = true
        this.$nextTick(() => {
          this.$refs.AssessPrice.init(id)
        })
			},
			sellHandle(id, index) { // 评估价格操作
				this.sellUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.SellUpdate.init(id, index)
        })
			},
      // 禁用
      disHandle (data) {
        Assess.disable(data).then(res => {
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
      // 启用
      norHandle (data) {
        Assess.awake(data).then(res => {
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
      },
      resetFrom () {
        this.dataForm = {
          userName: '',
          phone: '',
          type: ''
        }
        this.getDataList()
      },
      // 每页数
      sizeChangeHandle (val) {
        this.dataForm.page = val
        this.dataForm.limit = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.dataForm.page = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 下载模板
      downFile () {
         window.open(this.$http.adornUrl('/sys/user/down?token=' + Vue.cookie.get('token')), '_blank')
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
        var fix = document.querySelector('.el-table__fixed');
        var wb;
        if (fix) {
          wb = XLSX.utils.table_to_book(document.querySelector('#dataListUser').removeChild(fix));
          document.querySelector('#dataListUser').appendChild(fix);
        } else {
          wb = XLSX.utils.table_to_book(document.querySelector('#dataListUser'));
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
            '管理员列表.xlsx'
          );
        } catch (e) {
          if (typeof console !== 'undefined') console.log(e, wbout);
        }
        return wbout;
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
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

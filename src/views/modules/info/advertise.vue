<template>
  <div class="mod-user">
    <!--布局容器-->
    <el-container>
      <!--右侧-->
      <el-main>
        <!-- <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" @submit.native.prevent> -->
        <el-form :inline="true" :model="searchData">
          <el-form-item label="标题">
            <el-input v-model="searchData.adName" placeholder="标题" clearable></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <SelectStatus v-model="searchData.status" placeholder="用户名" clearable></SelectStatus>
          </el-form-item>
          <!-- <el-form-item label="展示类型">
            <el-select v-model="searchData.displayType" placeholder="请选择">
              <el-option v-for="item in displayTypeList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <el-button @click="getDataListBtn()">查询</el-button>
            <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
            <el-button @click="resetFrom()">重置</el-button> 
          </el-form-item>
        </el-form>
        <el-table :data="dataList" border stripe v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;" id="dataListUser">
          <el-table-column type="index" align="center" header-align="center" width="80" label="NO" fixed/>
          <el-table-column prop="adName" header-align="center" align="center" label="广告图标题">
          </el-table-column>
          <el-table-column header-align="center" align="center" label="广告图" min-width="200px">
            <template slot-scope="scope">
              <div class="img-box" v-if="scope.row.image">
                <img :src="scope.row.image" alt="" style="max-height: 50px;max-width: 50px">
              </div>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="sort" header-align="center" align="center" label="排序">
          </el-table-column> -->
          <el-table-column prop="status" header-align="center" align="center" label="状态">
            <template slot-scope="scope">
              <el-tag type="info" v-if="scope.row.status === 0">禁用</el-tag>
              <el-tag v-else>正常</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" header-align="center"  align="center"  width="150"  label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" v-if="scope.row.status === 1" @click="disHandle(scope.row)">禁用</el-button> 
              <el-button type="text" size="small" v-if="scope.row.status === 0" @click="norHandle(scope.row)">启用</el-button>
              <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.adId)">编辑</el-button>
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
        <!-- <uploadPop v-if="uploadPopVisible" ref="uploadPop" @refreshDataList="getDataList"></uploadPop> -->
      </el-main>
    </el-container>
  </div>
</template>
<script>
  import SelectStatus from '@/views/common-select/select-status'
  import Advertise from '@/api/advertise'
  import TypeSelect from '@/views/common-select/customer-type-select'
  import AddOrUpdate from './advertise-update'
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
        searchData: {
          adName: '',
          status: '',
          page: 1,
          limit: 10
        },
        displayTypeList: [
          { label: '零售', value: 0 },
          { label: '企业', value: 1 }
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
      SelectStatus
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataListBtn() {
        this.searchData.page = 1
        this.searchData.limit = 10
        this.pageIndex = 1
        this.pageSize = 10
        this.getDataList()
      },
      getDataList (params) {
        this.dataListLoading = true
        params = this.searchData || null
        Advertise.list(params).then(res => {
          console.log(res)
          if (res.data && res.data.code === 0) {
            console.log(res.data.data.list)
            this.dataList = res.data.data.list
            this.totalPage = res.data.data.totalCount
            if(this.dataList !== null){
              this.isShow = false
            }
          } else {
            this.$message.error(res.data.msg)
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 禁用
      disHandle (data) {
        Advertise.disable(data.adId).then(res => {
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
        Advertise.normal(data.adId).then(res => {
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
        this.searchData = {
          adName: '',
          status: '',
          page: 1,
          limit: 10
        }
        this.getDataList()
      },
      // 每页数
      sizeChangeHandle (val) {
        this.searchData.limit = val
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.searchData.page = val
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

<style>
  .imgBox{
    display: flex;
  }
</style>

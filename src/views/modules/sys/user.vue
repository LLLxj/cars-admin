<template>
  <div class="mod-user">
    <!--布局容器-->
    <el-container>
      <!--右侧-->
      <el-main>
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" @submit.native.prevent>
          <el-form-item>
            <el-input v-model="dataForm.userName" placeholder="用户名" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList()">查询</el-button>
            <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
            <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
            <el-button type="info" :disabled="isShow" :loading="downloadLoading" @click="exportHandle()">导出</el-button>
            <el-button type="danger" :loading="downloadLoading" @click="downFile()">下载模板</el-button>
            <el-button type="primary" :loading="downloadLoading" @click="uploadHandle()">上传文件</el-button>
            
          </el-form-item>
        </el-form>
        <el-table :data="dataList" border stripe v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;" id="dataListUser">
          <!-- <el-table-column type="selection" header-align="center" align="center" width="50">
          </el-table-column> -->
          <!-- <el-table-column prop="userId" header-align="center" align="center" width="80" label="ID">
          </el-table-column> -->
          <el-table-column type="index" align="center" header-align="center" width="80" label="NO" fixed/>
          <el-table-column prop="userName" header-align="center" align="center" label="用户名">
          </el-table-column>
          <el-table-column prop="deptName" header-align="center" align="center" label="部门">
          </el-table-column>
          <!-- <el-table-column prop="email" header-align="center" align="center" label="邮箱">
          </el-table-column> -->
          <el-table-column prop="phone" header-align="center" align="center" label="手机号">
          </el-table-column>
          <!-- <el-table-column prop="schoolName" header-align="center" align="center" label="校区">
          </el-table-column> -->
          <el-table-column prop="status" header-align="center" align="center" label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 0" size="small" type="danger">禁用</el-tag>
              <el-tag v-else size="small">正常</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="loginTime" header-align="center" align="center" width="180" label="创建时间">
          </el-table-column>
          <el-table-column fixed="right" header-align="center"  align="center"  width="150"  label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" v-if="scope.row.status === 1" @click="disHandle(scope.row)">禁用</el-button> 
              <el-button type="text" size="small" v-if="scope.row.status === 0" @click="norHandle(scope.row)">启用</el-button>
              <el-button v-if="isAuth('sys:user:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.userId)">编辑</el-button>
              <el-button v-if="isAuth('sys:user:delete')" type="text" size="small" @click="deleteHandle(scope.row.userId)">删除</el-button>
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
        <uploadPop v-if="uploadPopVisible" ref="uploadPop" @refreshDataList="getDataList"></uploadPop>
      </el-main>
    </el-container>
  </div>
</template>
<script>

  import Users from '@/api/users'
  import schoolAllSidebar from '../../common-sidebar/school-all-sidebar'
  import AddOrUpdate from './user-add-or-update'
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
          userName: undefined,
          deptId: undefined
        },
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
      ElContainer,
      ElAside,
      ElMain,
      schoolAllSidebar,
      uploadPop
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList (params) {
        this.dataListLoading = true
        this.params = this.searchData || null
        Users.norList(params).then(res => {
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
      schoolTreeChangeEvent (deptId) {
        this.dataForm.deptId = deptId
        this.getDataList()
      },
      // 禁用
      disHandle (data) {
        // console.log('禁用操作')
        // console.log(data)
        Users.disable(data.userId).then(res => {
          if(res.data && res.data.code === 0){
            console.log(res.data)
            this.$message({
              message: res.data.msg,
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
        console.log('启用操作')
        console.log(data)
         Users.awake(data.userId).then(res => {
          if(res.data && res.data.code === 0){
            console.log(res.data)
            this.$message({
              message: res.data.msg,
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
      // 每页数
      sizeChangeHandle (val) {
        this.searchData.page = val
        this.searchData.limit = 1
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
        var userIds = id ? [id] : this.dataListSelections.map(item => {
          return item.userId
        })
        this.$confirm(`确定对[id=${userIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/user/delete'),
            method: 'post',
            data: this.$http.adornData(userIds, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
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
          })
        }).catch(() => {})
      },
    }
  }
</script>

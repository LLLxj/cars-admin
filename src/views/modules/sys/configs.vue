<template>
  <div class="mod-user">
    <!--布局容器-->
    <el-container>
      <!--右侧-->
      <el-main>
        <el-form :inline="true" :model="dataForm" ref="dataForm" @keyup.enter.native="getDataList()" @submit.native.prevent>
          <el-form-item label="配置名称" prop="name">
            <el-input v-model="dataForm.name" placeholder="配置名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="配置编码" prop="code">
            <el-input v-model="dataForm.code" placeholder="配置编码" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList()">查询</el-button>
            <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
            <!-- <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
            <!-- <el-button type="info" :disabled="isShow" :loading="downloadLoading" @click="exportHandle()">导出</el-button> -->
          </el-form-item>
        </el-form>
        <el-table :data="dataList" border stripe v-loading="dataListLoading" @selection-change="selectionChangeHandle" @sort-change="configSortChange"
         style="width: 100%;" id="dataListUser">
          <el-table-column type="index" align="center" header-align="center" width="80" label="NO" fixed/>
          <el-table-column prop="name" header-align="center" sortable="custom" align="center" label="配置名称">
          </el-table-column>
          <el-table-column prop="code" header-align="center" sortable="custom" align="center" width="250" label="配置编码">
          </el-table-column>
          <el-table-column prop="memo" header-align="center" sortable="custom" align="center" width="250" label="配置说明">
          </el-table-column>
          <el-table-column prop="value" header-align="center" sortable="custom" align="center" width="250" label="配置值">
            <template slot-scope="scope">
              <span class="overLength" :title="scope.row.value">{{scope.row.value}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" header-align="center" sortable="custom" align="center" label="数据类型">
            <template slot-scope="scope">
              <span v-if="scope.row.type === 0" size="small">字符串</span>
              <span v-if="scope.row.type === 1" size="small">整型</span>
              <span v-if="scope.row.type === 2" size="small">浮点型</span>
              <span v-if="scope.row.type === 3" size="small">布尔</span>
              <span v-if="scope.row.type === 4" size="small">json对象</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" header-align="center" sortable="custom" align="center" label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 0" size="small" type="danger">禁用</el-tag>
              <el-tag v-else size="small">正常</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" header-align="center" sortable="custom" align="center" width="180" label="创建日期">
          </el-table-column>
          <el-table-column fixed="right" header-align="center"  align="center"  width="150"  label="操作">
            <template slot-scope="scope">
              <el-button v-if="isAuth('sys:config:select')" type="text" size="small" @click="addOrUpdateHandle(scope.row)">编辑</el-button>
              <el-button v-if="isAuth('sys:config:delete')" type="text" size="small" @click="deleteHandle(scope.row)">删除</el-button>
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
        <AddOrUpdate v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></AddOrUpdate>
      </el-main>
    </el-container>
  </div>
</template>
<script>
  // import { configList, configDelete } from '@/api/config'
  import AddOrUpdate from './configs-add-or-update'
  import ElContainer from 'element-ui/packages/container/index'
  import ElAside from 'element-ui/packages/aside/index'
  import ElMain from 'element-ui/packages/main/index'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  export default {
    data () {
      return {
        dataForm: {
          name: '',
          code: '',
          sidx: '',
          sort: ''
        },
        dataList: [],
        isShow: true,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        downloadLoading: false,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate,
      ElContainer,
      ElAside,
      ElMain,
    },
    activated () {
      // this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        configList(this.pageIndex,this.pageSize,this.dataForm.name,this.dataForm.code).then(res => {
          if (res.data && res.data.code === 0) {
            this.dataList = res.data.data.list
            this.totalPage = res.data.data.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          console.log(11111111111111)
          console.log(this.dataList)
          this.dataListLoading = false
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
      configSortChange (val) {
        this.dataForm.sidx = val.prop
        this.dataForm.sort = val.order
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
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
      addOrUpdateHandle (data) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(data)
        })
      },
      // 删除
      deleteHandle (data) {
        this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          configDelete(data.configId).then(res => {
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
        }).catch(() => {})
      },
    }
  }
</script>
<style>
  .overLength{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    height:50px;
  }
</style>


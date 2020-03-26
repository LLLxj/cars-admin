<template>
  <div class="mod-user">
    <!-- 布局容器 -->
    <el-container>
      <!-- 左侧 -->
      <!-- <el-aside>
        <schoolAllSidebar2 ref="schoolAllSidebar2" @school-sidebar-node-change-event="schoolTreeChangeEvent"></schoolAllSidebar2>
      </el-aside> -->
      <!-- 右侧 -->
      <el-main>
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item>
            <el-input v-model="dataForm.wepName" placeholder="请输入时点" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-if="isAuth('cos:wep:list')"  @click="getDataList()">查询</el-button>
            <el-button v-if="isAuth('cos:wep:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
            <el-button  type="info" :disabled="isShow" :loading="downloadLoading" @click="exportHandle()">导出</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="dataList" border stripe v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;" id="dataListWep">
          <el-table-column type="index" align="center" header-align="center" width="80" label="NO" fixed/>
          <el-table-column prop="wepName" header-align="center" align="center" label="名称">
          </el-table-column>
          <el-table-column fixed="right" header-align="center" align="center" width="250" label="操作">
            <template slot-scope="scope">
              <el-button v-if="isAuth('cos:wep:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.wepId)">编辑</el-button>
              <el-button type="text" size="small" @click="chiHandle(scope.row.wepId)">管理子时点</el-button>
              <el-button v-if="isAuth('cos:wep:delete')" type="text" size="small" @click="deleteHandle(scope.row.wepId)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" background :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <!-- 弹窗, 新增 / 修改 -->
        <AddOrUpdate v-if="addOrUpdateVisible" ref="AddOrUpdate" @refreshDataList="getDataList"></AddOrUpdate>
        <chiManage v-if="chiManageVisible" ref="chiManage" @refreshDataList="getDataList"></chiManage>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  // 左边的树形下拉,需后台增加按校区查询

  import AddOrUpdate from './wep-add-or-update'
  import chiManage from './wep-week'
  import { wepList, wepInfoDelete } from '@/api/wep'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'

  export default {
    data () {
      return {
        dataForm: {
          wepName: undefined
        },
        isShow: true,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        downloadLoading: false,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        dialogFormVisible: false,
        chiManageVisible: false
      }
    },
    components: {
      AddOrUpdate, chiManage
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        wepList(this.pageIndex, this.pageSize, this.dataForm.wepName).then(res => {
          // console.log(res)
          if (res.data && res.data.code === 0) {
            this.dataList = res.data.page.list
            this.totalPage = res.data.page.totalCount
            if (this.dataList !== null) {
              this.isShow = false
            }
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        }).catch(err => {
          console.log(err)
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
        console.log(val)
        this.pageIndex = val
        // console.log(this.pageIndex)
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 管理子时点
      chiHandle (id) {
        this.chiManageVisible = true
        this.$nextTick(() => {
          this.$refs.chiManage.init(id)
        })
      },
      // 导出操作
      exportHandle () {
        var fix = document.querySelector('.el-table__fixed');
        var wb;
        if (fix) {
          wb = XLSX.utils.table_to_book(document.querySelector('#dataListWep').removeChild(fix));
          document.querySelector('#dataListWep').appendChild(fix);
        } else {
          wb = XLSX.utils.table_to_book(document.querySelector('#dataListWep'));
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
            '时点档案.xlsx'
          );
        } catch (e) {
          if (typeof console !== 'undefined') console.log(e, wbout);
        }
        return wbout;
      },
      //  修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.AddOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          wepInfoDelete(id).then(res => {
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
      }
    }
  }
</script>

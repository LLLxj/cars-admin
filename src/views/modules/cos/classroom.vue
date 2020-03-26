<template>
  <div class="mod-user">
    <!-- 布局容器 -->
    <el-container>

      <!-- 左侧 -->
      <el-aside width="320px">
        <schoolAllSidebar ref="schoolAllSidebar" @school-sidebar-node-change-event="schoolTreeChangeEvent"></schoolAllSidebar>
      </el-aside>

      <!-- 右侧 -->
      <el-main>
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item>
            <el-input v-model="dataForm.croomName" placeholder="请输入课室名称" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-if="isAuth('cos:croom:list')" @click="getDataList()">查询</el-button>
            <el-button v-if="isAuth('cos:croom:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
            <el-button  type="info" :loading="downloadLoading" @click="exportHandle()">导出</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="dataList" border stripe v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;" id="dataListClassRoom">
          <el-table-column type="index" align="center" header-align="center" width="80" label="NO" fixed/>
          <el-table-column prop="croomName" header-align="center" align="center" label="名称">
          </el-table-column>
          <el-table-column prop="schoolName" header-align="center" align="center" label="所属校区">
          </el-table-column>
          <el-table-column prop="croomStatus" header-align="center" align="center" label="状态">
              <template slot-scope="scope">
                  <span v-if="scope.row.croomStatus === 0" size="small" type="danger">禁用</span>
                  <span v-else size="small">正常</span>
                </template>
          </el-table-column>
          <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
            <template slot-scope="scope">
              <el-button v-if="isAuth('cos:croom:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.croomId)">编辑</el-button>
              <el-button v-if="isAuth('cos:croom:delete')" type="text" size="small" @click="deleteHandle(scope.row.croomId)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" background :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <!-- 弹窗, 新增 / 修改 -->
        <AddOrUpdateClassRoom v-if="addOrUpdateVisible" ref="AddOrUpdateClassRoom" @refreshDataList="getDataList"></AddOrUpdateClassRoom>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  // 左边的树形下拉,需后台增加按校区查询

  import AddOrUpdateClassRoom from './classroom-add-or-update'
  import schoolAllSidebar from '@/views/common-sidebar/school-all-sidebar'
  import { classRoomDelete } from '@/api/classroom'
  import { classRoomList } from '@/api/classroom'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'

  export default {
    data () {
      return {
        dataForm: {
          croomName: undefined,
          schoolId: undefined
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        downloadLoading: false,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        dialogFormVisible:false
      }
    },
    components: {
      AddOrUpdateClassRoom, schoolAllSidebar
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        classRoomList(this.pageIndex,this.pageSize,this.dataForm.croomName,this.dataForm.schoolId).then(res => {
          if(res.data && res.data.code === 0){
            this.dataList = res.data.page.list
            this.totalPage = res.data.page.totalCount
          }else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        }).catch(err => {
          console.log(err)
        })
      },
      schoolTreeChangeEvent (schoolId, schoolName, schoolCode) {
        this.dataForm.schoolId = schoolId
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
        console.log(val)
        this.pageIndex = val
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
          wb = XLSX.utils.table_to_book(document.querySelector('#dataListClassRoom').removeChild(fix));
          document.querySelector('#dataListClassRoom').appendChild(fix);
        } else {
          wb = XLSX.utils.table_to_book(document.querySelector('#dataListClassRoom'));
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
            '课室档案.xlsx'
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
          this.$refs.AddOrUpdateClassRoom.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          classRoomDelete(id).then(res => {
            console.log(res)
            // console.log(res)
            if (res.data) {
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
        }).catch(() => {
        })
      }
    }
  }
</script>

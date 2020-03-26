<template>
 <div class="mod-user" style="height:80vh">
    <!--布局容器-->
    <el-container>
      <!--左侧-->
      <el-aside width="320px">
        <dictTree ref="dictTree" @dict-sidebar-node-change-event="dictTree" />
      </el-aside>

      <!--右侧-->
      <el-main>
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" @submit.native.prevent>
          <!-- <el-form-item>
            <el-input v-model="dataForm.userName" placeholder="用户名" clearable></el-input>
          </el-form-item> -->
          <el-form-item>
            <!-- <el-button v-if="isAuth('sys:dict:list')" @click="getDataList()">查询</el-button> -->
            <!-- 新增字典目录 -->
            <!-- <el-button type="primary" v-if="this.selectData.length === 0" @click="addHandle()">新增</el-button> -->
            <!-- 新增字典 -->
            <el-button type="primary" v-if="this.selectData.length !== 0" @click="addDictInfoHandle()">新增</el-button>
            <!-- 编辑字典 -->
            <el-button type="primary" v-if="this.selectData.length !== 0" :disabled="this.selectRow.length === 0"  @click="editDictInfoHandle()">编辑</el-button>
            <!-- 删除字典 -->
            <el-button type="primary" v-if="this.selectData.length !== 0" :disabled="this.selectRow.length === 0"  @click="deleteHandle()">删除</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="dataList" border stripe v-loading="dataListLoading" @row-click="classTableClickHandle" style="width: 100%;" id="dataListDict">
          <el-table-column type="index" align="center" header-align="center" width="80" label="NO" fixed/>
          <el-table-column prop="code" header-align="center" align="center" label="字典编码">
          </el-table-column>
          <el-table-column prop="value" header-align="center" align="center" label="字典值">
          </el-table-column>
          <el-table-column prop="label" header-align="center" align="center" label="字典显示值">
          </el-table-column>
          <el-table-column prop="createTime" header-align="center" align="center" width="180" label="创建时间">
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
      </el-main>
    </el-container>
    <editDict ref="editDict" v-if="editDictVisible" @refreshDataList="getDataListFresh"></editDict>
    <editDictInfo ref="editDictInfo" v-if="editDictInfoVisible" @refreshDataList="getDataList"></editDictInfo>
 </div>
</template>

<script>
import dictTree from '@/views/common-sidebar/dict-sidebar'
import editDict from './dict-add-or-update'
import editDictInfo from './dict-info-add-or-update'
import { dictList, dictInfoDelete, dictInfo } from '@/api/dict'
export default {
  data () {
    return {
      dataForm: {
      },
      selectData: [],
      dataList: [],
      selectRow: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      editDictVisible: false,
      editDictInfoVisible: false
    }
  },
  components:{
    dictTree, editDict, editDictInfo
  },
  methods: {
    dictTree (val) {
      this.selectData = val
      this.getDataList()
    },
    getDataList () {
      dictList(this.pageIndex,this.pageSize,this.selectData.code).then(res => {
        if (res.data && res.data.code === 0) {
          this.dataList = res.data.data.list
          this.totalPage = res.data.data.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    getDataListFresh () {
      this.getDataList()
      this.$refs.dictTree.init()
    },
    addHandle () {
      this.editDictVisible = true
      this.$nextTick(() => {
        this.$refs.editDict.init()
      })
    },
    addDictInfoHandle () {
      this.editDictInfoVisible = true
      this.$nextTick(() => {
        this.$refs.editDictInfo.initAdd(this.selectData)
      })
    },
    editDictInfoHandle () {
      this.editDictInfoVisible = true
      this.$nextTick(() => {
        this.$refs.editDictInfo.initEdit(this.selectRow)
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
    deleteHandle () {
      this.$confirm(`确定删除?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        dictInfoDelete(this.selectRow.id).then(res => {
          if (res.data && res.data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
                this.selectRow = []
              }
            })
          } else {
            this.$message.error(res.data.msg)
          }
        })
      })
    },
     // 报名表单选事件
    classTableClickHandle (currentRow) {
      this.selectRow = currentRow
    },
  }
  
}

</script>
<style>
</style>
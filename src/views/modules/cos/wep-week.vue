<template>
  <div class="mod-user">
    <!-- 布局容器 -->
    <el-container>
      <el-main>
          <el-dialog title="时点档案" :close-on-click-modal="false" :visible.sync="visible" width="650px">
            <el-form :inline="true" :model="dataForm">
                <el-form-item>
                  <el-button v-if="isAuth('cos:wep:week:save')" type="primary" @click="addHandle()">新增</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="dataList" border stripe v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
            <el-table-column type="index" align="center" header-align="center">
            </el-table-column>
            <el-table-column prop="wtype" header-align="center" align="center" label="星期">
                <template slot-scope="scope">
                  <span v-if="scope.row.wtype === 0" type="text" size="small">星期日</span>
                  <span v-if="scope.row.wtype === 1" type="text" size="small">星期一</span>
                  <span v-if="scope.row.wtype === 2" type="text" size="small">星期二</span>
                  <span v-if="scope.row.wtype === 3" type="text" size="small">星期三</span>
                  <span v-if="scope.row.wtype === 4" type="text" size="small">星期四</span>
                  <span v-if="scope.row.wtype === 5" type="text" size="small">星期五</span>
                  <span v-if="scope.row.wtype === 6" type="text" size="small">星期六</span>
                </template>
            </el-table-column>
            <el-table-column prop="ptype" header-align="center" align="center" label="时段">
                <template slot-scope="scope">
                  <span v-if="scope.row.ptype === 1" type="text" size="small">上午</span>
                  <span v-if="scope.row.ptype === 2" type="text" size="small">下午</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" header-align="center" align="center" label="操作">
                <template slot-scope="scope">
                  <el-button v-if="isAuth('cos:wep:week:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.wepChId)">编辑</el-button>
                  <el-button v-if="isAuth('cos:wep:week:delete')" type="text" size="small" @click="deleteHandle(scope.row.wepChId)">删除</el-button>
                </template>
            </el-table-column>
            </el-table>
            <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" background :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
            :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>

            <!-- 弹窗, 新增 / 修改 -->

        </el-dialog>
      </el-main>
    </el-container>
    <div>
        <AddOrUpdate v-if="addOrUpdateVisible" ref="AddOrUpdate" @refreshDataList="getDataList"></AddOrUpdate>
    </div>

    <!-- 新增弹窗 -->
    <div>
        <el-dialog title="新增" :close-on-click-modal="false" :visible.sync="addVisible">
          <el-form :model="addDataForm" ref="addDataForm" @keyup.enter.native="addDataFormSubmit()" label-width="80px">
          <el-form-item label="星期" prop="wtype">
              <el-select v-model="addDataForm.wtype" placeholder="请选择">
                 <el-option v-for="item in weeks" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="时段" prop="ptype">
                <el-select v-model="addDataForm.ptype" placeholder="请选择时段">
                    <el-option v-for="item in day" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="addVisible = false">取消</el-button>
            <el-button type="primary" @click="addDataFormSubmit()">确定</el-button>
            </span>
        </el-dialog>
    </div>

  </div>

</template>

<script>

  import AddOrUpdate from './wep-week-add-or-update'
  import { wepWeekList, wepWeekInfo, wepWeekSave, wepWeekDelete } from '@/api/wepWeek'

  export default {
    data () {
      return {
        dataForm: {
          wepName:undefined,
          wepId:'',
        },
        addDataForm: {
          wepChId:'',
          wtype:'',
          wepId:'',
          ptype:'',
          norder:100
        },
        weeks: [{
          value: 0,
          label: '星期日'
        }, {
          value: 1,
          label: '星期一'
        }, {
          value: 2,
          label: '星期二'
        }, {
          value: 3,
          label: '星期三'
        }, {
          value: 4,
          label: '星期四'
        },
        {
          value: 5,
          label: '星期五'
        },
        {
          value: 6,
          label: '星期六'
        }],
        day: [{
          value:1,
          label:'上午'
        },
        {
          value:2,
          label:'下午'
        }],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        dialogFormVisible:false,
        visible:false,
        addVisible:false,
        wepId:''
      }

    },
    components: {
      AddOrUpdate
    },
    methods: {
      init (id) {
        this.addDataForm.wepId = id
        this.wepId = id
        this.visible = true
        this.getDataList()
      },
      getDataList () {
        this.dataListLoading = true
        wepWeekList(this.pageIndex,this.pageSize,this.wepId).then(res => {
          if(res.data && res.data.code === 0){
            this.dataList = res.data.page.list
            this.totalPage = res.data.page.totalCount
          }else{
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
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
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
          wepWeekDelete(id).then(res => {
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
        }).catch(() => {})
      },
    //   新增操作
      addHandle () {
        this.addVisible = true
      },
    //   提交新增子时点操作
      addDataFormSubmit () {
        wepWeekSave(this.addDataForm).then(res => {
          if (res.data && res.data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.addVisible = false
                this.$refs.addDataForm.resetFields()
                this.getDataList ()
              }
            })
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
            console.log(err)
        })
      }
    }
  }
</script>

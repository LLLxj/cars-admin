<template>
  <el-dialog :title="this.dataForm.code" :close-on-click-modal="false" :visible.sync="visible" append-to-body>
      <!-- <div slot="header" style="color:#f60;text-align:center">
        <span>{{'this.dataForm.name' +'('+ this.dataForm.code +') 属性值'}}</span>
      </div> -->
      <div>
        <!-- 表格 -->
        <el-table :data="infoIdList" stripe border highlight-current-row element-loading-text="拼命加载中" size="mini">
          <el-table-column prop="infoId" label="ID" align="center" width="50"></el-table-column>
          <el-table-column prop="memo" label="说明" align="center" width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.memo" type="textarea" :rows="1"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="value" label="值" align="center" min-width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.value" type="textarea" :rows="1"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="120">
            <template slot-scope="scope">
              <!-- <el-button size="small" type="text" v-if="isAuth('sys:config:save')" @click="operInfo(scope.$index, scope.row)"> -->
              <el-button size="small" type="text" v-if="isAuth(scope.row.infoId?'sys:config:update':'sys:config:save')" @click="operInfo(scope.$index, scope.row)">
                {{ scope.row.infoId?'更新':'保存'}}
              </el-button>
              <el-button size="small" type="text" @click="doDelInfo(scope.$index, scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer">
        <!-- <el-button type="success" @click="addInfo" v-if="!addInfoFlag">添加</el-button> -->
        <el-button type="success" @click="addInfo">添加</el-button>
        <el-button @click="calcInfo">确定</el-button>
      </div>
  </el-dialog>
</template>

<script>
// import { configGetValue, configSave, configDelete, configInfoUpdate, configInfoSave, configInfoDelete } from '@/api/config'
export default {
  data () {
    return {
      visible: false,
      infoIdList: [],
      dataForm: {
        code: '',
        infoId: '',
        name: ''
      }
    }
  },
  methods: {
    init (data) {
      this.visible = true
      console.log(data)
      this.dataForm.code = data.code
      this.dataForm.name = data.name
      this.getDataList(data.code)
    },
    // 添加配置属性
    addInfo () {
      this.infoIdList.push({'code': this.dataForm.code, 'infoId': ''})
    },
    // 获取配置属性
    getDataList (data) {
      // configGetValue(data).then(res => {
      //   if(res.data && res.data.code === 0){
      //     console.log(res)
      //     this.infoIdList = res.data.data
      //   } else {
      //      this.$message.error(res.data.msg)
      //   }
      // })
      // this.infoIdList = this.result
    },
    addInfoFlag () {
      let cFlag = false
      for (let item of this.infoIdList) {
        if (!item.infoId) {
          cFlag = true
        }
      }
      return cFlag
    },
    // 执行更新或保存配置属性
    operInfo (index, data) {
      if (data.infoId) {
        this.doUpdateInfo(index, data)
      } else {
        this.doSaveInfo(index, data)
      }
    },
    // 执行配置属性保存
    doSaveInfo (index, data) {
      data.code = this.dataForm.code
      configInfoSave(data).then(res => {
        if (res.data && res.data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList(this.dataForm.code)
            }
          })
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 执行配置属性修改
    doUpdateInfo (index, data) {
      configInfoUpdate(data).then(res => {
        if (res.data && res.data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList(this.dataForm.code)
            }
          })
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 执行配置属性删除
    doDelInfo (index,data) {
      configInfoDelete(data.infoId).then(res => {
        if (res.data && res.data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList(this.dataForm.code)
            }
          })
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 取消属性配置操作
    calcInfo () {
      let newInfoList = []
      for (let item of this.infoIdList) {
        if (item.infoId) {
          newInfoList.push(item)
        }
      }
      this.infoIdList = newInfoList
      this.visible = false
    }
  }
}

</script>
<style>
</style>
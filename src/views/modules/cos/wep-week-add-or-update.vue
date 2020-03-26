<template>
  <el-dialog
    :title="!this.dataForm.wepChId ? '新增' : '编辑'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="星期" prop="wtype">
        <el-select v-model="dataForm.wtype" placeholder="请选择">
            <el-option v-for="item in weeks" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="时段" prop="ptype">
        <el-select v-model="dataForm.ptype" placeholder="请选择时段">
            <el-option v-for="item in day" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { wepWeekList, wepWeekInfo, wepWeekSave, wepWeekUpdate, wepWeekDelete } from '@/api/wepWeek'
  export default {
    data () {
      return {
        visible: false,
        roleList: [],
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
        dataForm: {
          wepChId:'',
          wtype:'',
          wepId:'',
          ptype:'',
          norder:100
        },
        dataRule: {
          wepName: [
            { required: true, message: '时点不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.wepChId = id || 0
        this.visible = true
        wepWeekInfo(this.dataForm.wepChId).then(res => {
          if(res.data && res.data.code === 0) {
            this.dataForm.wtype = res.data.data.wtype
            this.dataForm.ptype = res.data.data.ptype
            this.dataForm.wepChId = res.data.data.wepChId
            this.dataForm.norder = res.data.data.norder
          } else {
            this.$message.error(res.data.msg)
          }
          
        }).catch(err => {
          console.log(err)
        })
          

      },
      
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
              wepWeekUpdate(this.dataForm).then(res => {
                if (res.data && res.data.code === 0) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.visible = false
                      this.$emit('refreshDataList')
                    }
                  })
                } else {
                  this.$message.error(res.data.msg)
                }
              })
          }
        })
      }
    }
  }
</script>

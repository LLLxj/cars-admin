<template>
<div>
  <div>
    <el-dialog title="编辑复课时间" :close-on-click-modal="false" :visible.sync="visible">
    <div>
      <el-form :model="dataForm" ref="dataForm" v-if="changeShow" label-width="120px">
        <el-form-item label="复课时间" prop="stopBackDate">
          <el-date-picker v-model="dataForm.stopBackDate" value-format="yyyy-MM-dd 00:00:00" type="date" :clearable="false" placeholder="请选择复课日期"/>
        </el-form-item>
      </el-form>   
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    </el-dialog>
  </div>
</div>
</template>

<script>
  import { stopResumeClasses } from '@/api/stop'
  import { parseTime , formatTime } from '@/utils/index'

  export default {
    data () {
      return {
        visible: false,
        changeShow:true,
        roleList: [],
        index: '',
        value: '',
        dataForm: {
          stopBackDate: parseTime(new Date())
        },
        index:'',
      }
    },
    components:{
    },
    methods: {
      init (id) {
        this.clearDataForm()
        this.index = id
        this.visible = true
      },
      clearDataForm (){
        this.dataForm.stopBackDate= parseTime(new Date())
      },
       // 选择复课时间
      selectClassHandle () {
        this.classPopVisiable = true
        this.$nextTick(() => {
          this.$refs.classPop.init()
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if(valid){
            stopResumeClasses({
              'stopId': this.index,
              'stopBackDate': parseTime(this.dataForm.stopBackDate, '{y}-{m}-{d} 00:00:00')
            }).then(res => {
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
            }).catch(err => {
                console.log(err)
            })
          }
        })
      }
    }
  }
</script>
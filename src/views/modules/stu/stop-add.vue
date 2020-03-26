<template>
<div>
  <div>
    <el-dialog title="新增休学档案" :close-on-click-modal="false" :visible.sync="visible">
    <div>
        <!-- 学员信息 -->
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
            <el-form-item label="报名表号" prop="regNo">
              <el-input v-model="dataForm.regNo" placeholder="点击选择报名表" readonly @click.native="selectRegHandle()" prefix-icon="el-icon-search"/>
            </el-form-item>
            <el-form-item prop="dateTime">
            <el-date-picker v-model="dataForm.dateTime"
              type="daterange"  range-separator="-"
              start-placeholder="开始日期"  end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss" :clearable="false">
            </el-date-picker>
          </el-form-item>
            <el-form-item label="报读班型" v-show="showDetail" prop="classTypeName">
              <el-input v-model="dataForm.classTypeName" readonly />
            </el-form-item>
            <el-form-item label="学员名称" v-show="showDetail" prop="stuName">
                <el-input v-model="dataForm.stuName" />
            </el-form-item>
            <el-form-item label="学员联系方式" v-show="showDetail" prop="stuPhone">
                <el-input v-model="dataForm.stuPhone" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input type="textarea" v-model="dataForm.remark"></el-input>
            </el-form-item>
        </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    </el-dialog>
    <!-- 报名表弹窗 -->
    <regPop ref="regPop" v-if="regPopVisible" @regPop-pop-event="callBackRegPop"></regPop>
  </div>
</div>
</template>

<script>
  import classType from '@/views/common-pop/class-type-pop'
  import regPop from '@/views/common-pop/reg-pop'
  import { stopList, stopAdopt, stopForbidden, stopCheckPending, stopCheckRegNo, stopSave  } from '@/api/stop'
  import { parseTime , formatTime } from '@/utils/index'

  export default {
    data () {
      var regNoExit = (rule, value, callback) => {
        if (value) {
            stopCheckRegNo(value).then(res => {
              if(res.data && res.data.code === 0){
                this.dataForm.regNo = res.data.stuRegEntity.regNo
                this.dataForm.classTypeName = res.data.stuRegEntity.classTypeName
                this.dataForm.stuName = res.data.stuRegEntity.stuName
                this.dataForm.stuPhone = res.data.stuRegEntity.stuPhone
              }else {
                this.$message.error(res.data.msg)
              }
            }).catch(err => {
                console.log(err)
            })
          callback()
        }
      }
      return {
        visible: false,
        roleList: [],
        value:'',
        regPopVisible:false,
        classTypePopVisible:false,
        showDetail: false,
        dataForm: {
          regId: '',
          regNo: '',
          classTypeName: '',
          stuName: '',
          stuPhone: '',
          stopStatus: 1,
          dateTime: [parseTime(new Date()), parseTime(new Date(new Date().getTime() + 3600 * 1000 * 24 * 30),)],
          remark:''
        },
        index:'',
        dataRule: {
          regNo: [
            { required: true, message: '报名表编号不能为空', trigger: 'blur' },
            { validator: regNoExit, trigger: 'change' }
          ]
        }
      }
    },
    components:{
      classType, regPop
    },
    methods: {
      init () {
        this.visible = true
        this.showDetail = false
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      },
      // 报名表弹窗
      selectRegHandle () {
        this.regPopVisible = true
        this.$nextTick(() => {
          this.$refs.regPop.init()
        })
      },
      callBackRegPop(regId,regNo){
        this.showDetail = true
        this.dataForm.regId = regId
        this.dataForm.regNo = regNo
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if(valid){
            stopSave({
              'regNo': this.dataForm.regNo,
              'stopStartDate': this.dataForm.dateTime[0],
              'endStartDate': this.dataForm.dateTime[1],
              'stopStatus': this.dataForm.stopStatus,
              'remark': this.dataForm.remark
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
              }else{
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

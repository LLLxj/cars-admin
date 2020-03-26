<template>
  <el-dialog
    :title="dataForm.configId == '' ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="配置名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="参数名"></el-input>
      </el-form-item>
      <el-form-item label="配置编码" prop="code">
        <el-input v-model="dataForm.code" placeholder="参数值"></el-input>
      </el-form-item>
      <el-form-item label="数据类型" prop="type">
        <el-select v-loading="dataListLoading" v-model="dataForm.type" placeholder="数据类型" style="width: 100%;">
          <el-option v-for="item in dateTypeList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="配置值" prop="infoId">
        <div v-if="!dataForm.configId">
          <el-input :disabled="!dataForm.configId" placeholder="请在保存后，进行配置值操作"></el-input>
        </div>
        <div v-else>
          <el-select v-loading="dataListLoading" v-model="dataForm.infoId" placeholder="选择配置" style="width: 92%;">
            <el-option v-for="item in configList" :key="item.infoId" :label="item.memo" :value="item.infoId">
            </el-option>
          </el-select>
          <el-button slot="append" @click="showConfigInfo">编辑</el-button>
        </div>
        
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <configInfo ref="configInfo" v-if="configInfoVisible"></configInfo>
  </el-dialog>

  
</template>

<script>

  import schoolSelect from '@/views/common-select/school-select'
  import configInfo from './configs-info'
  import { configInfos, configGetValue, configSave, configUpdate } from '@/api/config'
  export default {
    data () {
      var checkInfoId = (rule, value, callback) => {
        if(value){
          console.log(this.dataForm.id)
          callback('缴费金额错误')
        } else {
          callback()
        }
      }
      return {
        visible: false,
        configInfoVisible: false,
        dataForm: {
          configId: '',
          name: '',
          code: '',
          memo: '',
          type: '',
          infoId: 0,
          status: 1
        },
        dataListLoading: false,
        dataList: [],
        configList: [],
        dateTypeList: [
          {value: 0, label: '字符串'},
          {value: 1, label: '整型'},
          {value: 2, label: '浮点型'},
          {value: 3, label: '布尔型'},
          {value: 4, label: 'JSON对象'}
        ],
        dataRule: {
          name: [
            { required: true, message: '配置名称不能为空', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '配置编码不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '数据类型不能为空', trigger: 'blur' }
          ],
          infoId: [
            { required: true, message: '配置值不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '状态不能为空', trigger: 'blur' }
          ],
        }
      }
    },
    components: {
      configInfo
    },
    methods: {
      init (data) {
        this.visible = true
        // this.$nextTick(() => {
        //   this.$refs['dataForm'].resetFields()
        // })
        this.resetDateForm()
        if(data !== undefined) {
          this.dataForm.infoId = data.infoId
          this.dataForm.code = data.code
          this.dataForm.configId = data.configId
          this.getDataList()
          this.getConfigList()
        }
      },
      resetDateForm () {
        this.dataForm  = {
          configId: '',
          name: '',
          code: '',
          memo: '',
          type: '',
          infoId: 0,
          status: 1
        }
      },
      getDataList () {
        configInfos(this.dataForm.configId).then(res => {
          if(res.data && res.data.code === 0){
            console.log(res)
            this.dataForm.name = res.data.data.name
            this.dataForm.code = res.data.data.code
            this.dataForm.type = res.data.data.type
            this.dataForm.status = res.data.data.status
            this.dataForm.memo = res.data.data.memo
          } else {
            this.$message.error(res.data.msg)
          }
        })
       
      },
      getConfigList () {
        configGetValue(this.dataForm.code).then(res => {
          if(res.data && res.data.code === 0) {
            this.configList = res.data.data
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      showConfigInfo () {
        if (!this.dataForm.code) {
          this.$message({
            message: '配置编码不能为空',
            type: 'error',
            duration: 1500,
          })
          return false
        }
        this.configInfoVisible = true
        this.$nextTick(() => {
          this.$refs.configInfo.init(this.dataForm)
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if(!this.dataForm.configId) {
              configSave(this.dataForm).then(res => {
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
            } else {
              configUpdate(this.dataForm).then(res => {
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
          } 
        })
      }
    }
  }
</script>

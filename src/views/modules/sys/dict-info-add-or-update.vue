<template>
  <el-dialog
    :title="!this.dataForm.id ? '新增属性' : '编辑属性'"
    :close-on-click-modal="false"
    :visible.sync="visible" width="30%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="字典编码" prop="code">
        <el-input v-model="dataForm.code" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="字典显示" prop="label">
        <el-input v-model="dataForm.label" placeholder="字典显示"></el-input>
      </el-form-item>
      <el-form-item label="字典值" prop="value">
        <el-input v-model="dataForm.value" placeholder="字典值"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="seq" >
        <el-input-number v-model="dataForm.seq" class="box-input" controls-position="right"></el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" v-if="isAuth(this.dataForm.id ? 'sys:dict:update' : 'sys:dict:save')"  @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { dictInfoSave, dictInfosGet, dictInfoUpdate } from '@/api/dict'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: '',
          label: '',
          code: '',
          value: '',
          seq: '',
        },
        selectData: [],
        options: [{
          value: '0',
          label: '字符串'
        }, {
          value: '1',
          label: '整型'
        }, {
          value: '2',
          label: '浮点型'
        }, {
          value: '3',
          label: '布尔'
        }, {
          value: '4',
          label: 'json对象'
        }],
        dataRule: {
          label: [
            { required: true, message: '字典名称不能为空', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '字典编码不能为空', trigger: 'blur' }
          ],
          value: [
            { required: true, message: '字典值不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      initAdd (data) {
        this.visible = true
        this.resetForm()
        this.dataForm.code = data.code
      },
      initEdit (data) {
        this.visible = true
        this.setDataList(data.id)
      },
      resetForm () {
        this.dataForm = {
          id: '',
          label: '',
          code: '',
          value: '',
          seq: '',
        }
      },
      setDataList (data) {
        dictInfosGet(data).then(res => {
          if(res.data && res.data.code === 0) {
            this.dataForm.id =res.data.data.id
            this.dataForm.label = res.data.data.label
            this.dataForm.code = res.data.data.code
            this.dataForm.value = res.data.data.value
            this.dataForm.seq = res.data.data.seq
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if(!this.dataForm.id){
              dictInfoSave({
                'label': this.dataForm.label,
                'code': this.dataForm.code,
                'value': this.dataForm.value,
                'seq': this.dataForm.seq
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
              })
            } else {
              dictInfoUpdate({
                'id': this.dataForm.id,
                'label': this.dataForm.label,
                'code': this.dataForm.code,
                'value': this.dataForm.value,
                'seq': this.dataForm.seq
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
              })
            }
            
          }
        })
      }
    }
  }
</script>

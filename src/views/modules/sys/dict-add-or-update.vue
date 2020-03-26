<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible" width="30%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="字典名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="字典名称"></el-input>
      </el-form-item>
      <el-form-item label="字典编码" prop="code">
        <el-input v-model="dataForm.code" placeholder="字典编码"></el-input>
      </el-form-item>
      <el-form-item label="数据类型" prop="type">
        <!-- <el-input v-model="dataForm.type" placeholder="数据类型"></el-input> -->
        <!-- <el-select v-model="dataForm.type" placeholder="数据类型" style="width:100%">
          <el-option v-for="item in dateTypeOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select> -->
        <el-select v-model="dataForm.type" placeholder="数据类型" style="width:100%">
          <el-option v-for="item in dateTypeOptions" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
          <!-- <dateType v-model="dataForm.type" style="width:100%" /> -->
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { dictSave, dictInfo, dictUpdate } from '@/api/dict'
  import dictTree from '@/views/common-sidebar/dict-sidebar'
  import { getDateTypeList } from '@/utils/dateTypeUtil'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: '',
          name: '',
          code: '',
          type: '',
        },
        dateTypeOptions: getDateTypeList(false),
        dataRule: {
          name: [
            { required: true, message: '字典名称不能为空', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '字典编码不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '数据类型不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    components:{
      dictTree
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.setDataList(id)
          }
        })
      },
      setDataList (data) {
        dictInfo(data).then(res => {
          if(res.data && res.data.code === 0) {
            this.dataForm.id =res.data.data.id
            this.dataForm.name = res.data.data.name
            this.dataForm.code = res.data.data.code
            this.dataForm.type = res.data.data.type
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if(!this.dataForm.id){
              dictSave({
                'name': this.dataForm.name,
                'code': this.dataForm.code,
                'type': this.dataForm.type
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
              dictUpdate({
                'id': this.dataForm.id,
                'name': this.dataForm.name,
                'code': this.dataForm.code,
                'type': this.dataForm.type
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

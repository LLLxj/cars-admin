<template>
  <el-dialog
    :title="!dataForm.configId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="cancle">
    <!-- <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px"> -->
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-form-item label="配置名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="请填写配置名称"></el-input>
      </el-form-item>
      <el-form-item label="配置编码" prop="code">
        <el-input v-model="dataForm.code" placeholder="请填写配置编码"></el-input>
      </el-form-item>
      <el-form-item label="配置值" prop="value">
        <el-input v-model="dataForm.value" placeholder="请填写配置值"></el-input>
      </el-form-item>
      <el-form-item label="配置显示值" prop="memo">
        <el-input v-model="dataForm.memo" placeholder="请填写配置显示值"></el-input>
      </el-form-item>
      <!-- <el-form-item label="类型" prop="type">
        <typeSelect v-model="dataForm.type"></typeSelect>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancle()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import typeSelect from '@/views/common-select/type-select'
  import Config from '@/api/config'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          configId: '',
          name: '',
          code: '',
          value: '',
          memo: '',
          // status: 1
        },
        dataRule: {
          name: [
            { required: true, message: '配置名称不能为空', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '配置编码不能为空', trigger: 'blur' }
          ],
          value: [
            { required: true, message: '配置值不能为空', trigger: 'blur' }
          ],
          memo: [
            { required: true, message: '配置显示值不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
      typeSelect
    },
    methods: {
      init (data) {
        this.dataForm.configId = data
        this.visible = true
        if (data) {
          this.setData(data)
        }
        // this.$nextTick(() => {
        //   this.$refs['dataForm'].resetFields()
        //   if (this.dataForm.code) {
        //     this.$http({
        //       url: this.$http.adornUrl(`/sys/config/info/${this.dataForm.code}`),
        //       method: 'get',
        //       params: this.$http.adornParams()
        //     }).then(({data}) => {
        //       if (data && data.code === 0) {
        //         console.log(data)
        //         this.dataForm.name = data.name
        //         this.dataForm.value = data.value
        //         this.dataForm.memo = data.memo
        //       }
        //     })
        //   }
        // })
      },
      setData(id) {
        Config.info(id).then(({data}) => {
          if (data.code === 0) {
            this.dataForm = data.data
          }else {
            this.$message.error(data.msg)
          }
        }).catch(err => {
          console.log(err)
          this.$message.error(data.msg)
        })
      },
      resetForm() {
        this.$refs['dataForm'].resetFields()
      },
      cancle () {
        this.visible = false
        this.resetForm()
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (!this.dataForm.configId) {
              Config.save(this.dataForm).then(({data}) => {
                if (data && data.code === 0) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.visible = false
                      this.resetForm()
                      this.$emit('refreshDataList')
                    }
                  })
                } else {
                  this.$message.error(data.msg)
                }
              }).catch(err => {
                console.log(err)
                this.$message.error(err)
              })
            } else {
              Config.update(this.dataForm).then(({data}) => {
                if (data && data.code === 0) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.visible = false
                      this.resetForm()
                      this.$emit('refreshDataList')
                    }
                  })
                } else {
                  this.$message.error(data.msg)
                }
              }).catch(err => {
                console.log(err)
                this.$message.error(err)
              })
            }
          }
        })
      }
    }
  }
</script>

<template>
  <el-dialog
    title="跟进意见"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="cancle">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
	    <el-form-item label="备注" prop="followRemake">
        <el-input type="textarea" v-model="dataForm.followRemake" placeholder="请输入备注"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancle()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { isMobile, removeBlank } from '@/utils/validate'
  import Fenqi from '@/api/customer/fenqi'
  export default {
    data () {
      return {
        visible: false,
        roleList: [],
        menuList: [],
        menuListTreeProps: {
          label: 'deptName',
          children: 'children'
        },
        positionList: [],
        dataForm: {
          installmentId: 0,
  				followRemake: ''
        },
        index: '',
        dataRule: {
        },
        edit: false,
        status: '',
      }
    },
    components: {
    },
    watch: {
    },
    methods: {
      init (item, id) {
        this.visible = true
        this.dataForm.installmentId = item.installmentId
        this.index = id
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
            if (this.index === 1) { // 待处理
              Fenqi.waste(this.dataForm).then(({data}) => {
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
            } else if (this.index === 2) { // 已处理
              Fenqi.success(this.dataForm).then(({data}) => {
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
					} else if (this.index === 3) { // 处理中
            Fenqi.processing(this.dataForm).then(({data}) => {
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
        })
      }
    }
  }
</script>

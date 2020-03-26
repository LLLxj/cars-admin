<template>
  <el-dialog :title="!this.selectId ? '新增' : '编辑'" :close-on-click-modal="false" :visible.sync="visible" append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="基础课次名称" prop="courseContName">
        <el-input v-model="dataForm.courseContName" maxlength="20"  placeholder="请输入班型名称"></el-input>
      </el-form-item>
      <el-form-item label="排序序号" prop="norder">
        <el-input v-model="dataForm.norder"  placeholder="请输入班型价格"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { courseContSave, courseInfo, courseContUpdate } from '@/api/basicCourse'

export default {
  data () {
    return {
      visible: false,
      select: '',
      dataForm: {
        courseContName: '',
        norder: 100,
      },
      courseId: '',
      selectId: '',
      dataRule: {
        courseContName: [
          {required: true, message: '基础课次名称不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    init (id, courseId) {
      // console.log(id, courseId)
      this.visible = true
      this.selectId = id || 0
      this.courseId = courseId
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
      if (this.selectId) {
        this.getData()
      }
    },
    getData () {
      courseInfo(this.selectId).then(res => {
        if (res.data && res.data.code === 0) {
          // console.log(res)
          //   this.dataForm.courseId = res.data.data.courseId
          this.dataForm.courseContName = res.data.data.courseContName
          this.dataForm.norder = res.data.data.norder
          this.dataForm.courseContId = res.data.data.courseContId
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
          if (this.selectId) {
            // 更新操作
            courseContUpdate({
              'courseId': this.courseId,
              'courseContName': this.dataForm.courseContName,
              'norder': this.dataForm.norder,
              'courseContId': this.dataForm.courseContId
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
          } else {
            courseContSave({
              'courseId': this.courseId,
              'courseContName': this.dataForm.courseContName,
              'norder': this.dataForm.norder
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
              }
            }).catch(err => {
              console.log(err)
            })
          }
        }
      })
    }
  }
}
</script>

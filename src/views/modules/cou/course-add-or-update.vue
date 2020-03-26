<template>
  <el-dialog :title="!this.selectId ? '新增' : '编辑'" :close-on-click-modal="false" :visible.sync="visible" width="600px">
    
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="科目名称" prop="courseName">
        <el-input v-model="dataForm.courseName" maxlength="20"  placeholder="请输入科目名称"/>
      </el-form-item>
      <el-form-item label="课时数量" prop="courseContCount">
        <el-input-number v-model="dataForm.courseContCount" :min="0" class="box-input" controls-position="right"/>
      </el-form-item>
      <el-form-item label="课时总价" prop="coursePrice">
        <el-input-number v-model="dataForm.coursePrice" :min="0" class="box-input" controls-position="right"/>
      </el-form-item>
      <el-form-item label="课次单价:" prop="courseUnitPrice">
        <el-button type="text" style="color:black" v-model="dataForm.courseUnitPrice">{{ this.dataForm.courseUnitPrice || '--' }}/课时</el-button>
      </el-form-item>
      <el-form-item label="课次时长" prop="courseCountTime">
        <el-input-number v-model="dataForm.courseCountTime" :min="0" class="box-input" controls-position="right"/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import Course from '@/api/course'
  import { parseTime } from '@/utils'

  export default {
    data () {
      return {
        visible: false,
        roleList: [],
        dataForm: {
          courseName: '',
          courseContCount: 0,
          coursePrice: 0,
          courseUnitPrice: '',
          courseCountTime: 0,
          courseId: '',
        },
        dataList: [],
        selectId: '',
        dataRule: {
          courseName: [
            {required: true, message: '科目名称不能为空', trigger: 'blur'}
          ],
          courseContCount: [
            {required: true, message: '课次数量不能为空', trigger: 'blur'}
          ],
          coursePrice: [
            {required: true, message: '课程总价不能为空', trigger: 'blur'}
          ],
          courseCountTime: [
            {required: true, message: '课次时长不能为空', trigger: 'blur'}
          ]
        }
      }
    },
     watch: {
      dataForm: {
  　　  handler(value) {
          this.dataForm.courseUnitPrice = value.coursePrice / value.courseContCount
  　　　},
  　　　deep: true
  　　}
    },
    methods: {
      init (id) {
        this.visible = true
        this.selectId = id || 0
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        this.dataList = []
        // 编辑
        if (this.selectId) {
          this.getInfo(this.selectId)
        } else {
          this.setDataList()
        }
      },
      setDataList () {
        let data = {'No': 0,'courseContName': '','norder': ''}
        // this.dataList.push(data)
      },
      getInfo (data) {
        Course.info(data).then(({data}) => {
          let {code, msg, result } = data
          console.log(data)
          if(code === 0){
            this.dataForm.courseId = result.courseId
            this.dataForm.courseName = result.courseName
            this.dataForm.courseContCount = result.courseContCount
            this.dataForm.coursePrice = result.coursePrice
            this.dataForm.courseCountTime = result.courseCountTime
          } else {
            this.$message.error(msg)
          } 
        }).catch(err => {
          console.log(err)
        })
      },
      addCourse () {
        let objIndex = this.dataList.length
        let obj = {'No': objIndex, 'courseContName': '' }
        this.dataList.push(obj)
      },
      deleteHandle (data) {
        let index = data.No
        let arrLength = this.dataList.length
        if(arrLength === 1){
          this.$message({
            message: '这是最后一条了,不可删除',
            type: 'info',
            duration: 1500,
          })
        } else{
          this.dataList.splice(index, 1)
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (this.selectId) {
              Course.update({
                  'courseId': this.dataForm.courseId,
                  'courseName': this.dataForm.courseName,
                  'courseContCount': this.dataForm.courseContCount,
                  'coursePrice': this.dataForm.coursePrice,
                  'courseCountTime': this.dataForm.courseCountTime
              }).then(({data}) => {
                let {code, msg} = data
                if(code === 0){
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
                   this.$message({
                    message: msg,
                    type: 'error',
                    duration: 1500,
                  })
                }
              })
            } else {
              
              Course.save({
                  'courseName': this.dataForm.courseName,
                  'courseContCount': this.dataForm.courseContCount,
                  'coursePrice': this.dataForm.coursePrice,
                  'courseCountTime': this.dataForm.courseCountTime
              }).then(({data}) => {
                let {code, msg} = data
                if(code === 0){
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
                  this.$message({
                    message: msg,
                    type: 'error',
                    duration: 1500,
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

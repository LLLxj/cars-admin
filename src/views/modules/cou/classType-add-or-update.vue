<template>
  <div class="">
    <el-dialog
      :title="!this.selectClassTypeId ? '新增' : '编辑'" :close-on-click-modal="false" :visible.sync="visible" width="600px">
      <el-form :model="dataForm" inline :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
        <el-form-item label="班型名称" prop="classTypeName">
          <el-input v-model="dataForm.classTypeName" maxlength="20"  placeholder="请输入班型名称"></el-input>
        </el-form-item>
        <el-form-item label="班型价格" prop="classTypePrice">
          <el-input v-model="dataForm.classTypePrice"  placeholder="请输入班型价格"></el-input>
        </el-form-item>
        <el-form-item label="课程科目" prop="dataList" style="width:100%;">
          <el-select v-model="dataForm.dataList" multiple placeholder="请选择" @change='getSelectVal'>
            <el-option
              v-for="item in courseList"
              :key="item.courseId"
              :label="item.courseName"
              :value="item.courseId" >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </span>
    </el-dialog>
  </div>
  
</template>

<script>
  import ClassType from '@/api/classType'
  import Course from '@/api/course'
  import { parseTime } from '@/utils'

  export default {
    data () {
      return {
        visible: false,
        roleList: [],
        dataForm: {
          classTypeName: '',
          classTypeId: '',
          classTypePrice: '',
          dataList: [],
        },
        basicCoursePopVisible: false,
        formList: [],
        selectRow: {'courseId': '','courseName': ''},
        courseList: [],
        selectClassTypeId: '',
        dataRule: {
          classTypeName: [
            {required: true, message: '科目名称不能为空', trigger: 'blur'}
          ],
          classTypePrice: [
            {required: true, message: '价格不能为空', trigger: 'blur'}
          ],
          dataList: [
            {required: true, message: '课程科目不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.visible = true
        this.selectClassTypeId = id || 0
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        this.dataForm.dataList = []
        if (this.selectClassTypeId) {
          this.getInfo(this.selectId)
        } 
        this.getCourseInfo()
      },
      getInfo () {
        ClassType.info(this.selectClassTypeId).then(({data}) => {
          let {code, msg, result} = data
          if(code === 0){
            this.dataForm.classTypeName = result.classTypeName
            this.dataForm.classTypeId = result.classTypeId
            this.dataForm.classTypePrice = result.classTypePrice
            for(var i in result.couClassTypeCourseEntities){
              this.dataForm.dataList.push(result.couClassTypeCourseEntities[i].courseId)
            }
            this.formList = result.couClassTypeCourseEntities
          } else {
            this.$message.error(msg)
          }
        })
      },
      getSelectVal (val){
        this.formList = [] 
        for(var i in val){
          this.courseList.map((item,index) => {          
            if (item.courseId == val[i]) { 
              this.formList.push(item)           
            }
          }) 
        }
      }, 
      getCourseInfo () {
        Course.list().then(res => {
          if (res.data && res.data.code === 0) {
            this.courseList = res.data.data.list
            this.totalPage = res.data.data.totalCount
          } else {
            this.courseList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        }).catch(err => {
          console.log(err)
        })
      },
      deleteHandle (data) {
        let index = data.No
        this.dataList.splice(index, 1)
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (this.selectClassTypeId) {
              ClassType.update({
                "couClassTypeEntity": {
                  "classTypeName": this.dataForm.classTypeName,
                  "classTypePrice": this.dataForm.classTypePrice,
                  'classTypeId': this.dataForm.classTypeId
                },
                "couClassTypeCourseEntities": this.formList
              }).then(({data}) => {
                let {code, msg} = data
                if (code === 0) {
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
                  this.$message.error(msg)
                }
              })
            } else {
              ClassType.save({
                "couClassTypeEntity": {
                  "classTypeName": this.dataForm.classTypeName,
                  "classTypePrice": this.dataForm.classTypePrice
                },
                "couClassTypeCourseEntities": this.formList
              }).then(({data}) => {
                let {code, msg} = data
                if (code === 0) {
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
                  this.$message.error(msg)
                }
              })
            }
          }
        })
      }
    }
  }
</script>

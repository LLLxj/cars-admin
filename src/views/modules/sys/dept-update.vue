<template>
  <!-- <el-card style="height: 750px">
    
    <div slot="header" class="clearfix">
      <span>添加部门</span>
    </div> -->
    <el-dialog title="编辑"
    :close-on-click-modal="false"
    :visible.sync="visible">

    <el-form :model="dataForm" ref="dataForm" :rules="dataRule"  @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="部门名称" prop="deptName">
        <el-input v-model="dataForm.deptName" placeholder="部门名称"></el-input>
      </el-form-item>
      <el-form-item label="上级部门" prop="parentName">
        <el-input v-model="dataForm.parentName" :readonly="true" class="menu-list__input"></el-input>
      </el-form-item>
      <!-- <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" v-if="isAuth('sys:dept:update')"  @click="dataFormSubmit()">确定</el-button>
    </span>
    <!-- 弹窗, 修改密码 -->
    <!-- <school-pop v-if="schoolPopVisible" ref="schoolPop" @school-pop-event="callBackSchoolPop"></school-pop> -->
    <!-- <job-pop v-if="jobPopVisible" ref="jobPop" @job-pop-event="callBackJobPop"></job-pop> -->
  <!-- </el-card> -->
    </el-dialog>
</template>

<script>
  // import jobPop from '../../common-pop/job-pop'
  // import schoolPop from '../../common-pop/school-pop'
  import { treeDataTranslate } from '@/utils'
  import Dept from '@/api/dept'
  import schoolSelect from '@/views/common-select/school-select'
  export default {
    data () {
      return {
        visible: false,
        roleList: [],
        schoolPopVisible: false,
        jobPopVisible: false,
        selectDeptId: '',
        dataForm: {
          deptName: '',
          deptId: '',
          parentId: '',
          parentName: ''
        },
        dataRule: {
          deptName: [
            { required: true, message: '部门名称不能为空', trigger: 'blur' }
          ],
          parentName: [
            { required: true, message: '上级部门不能为空', trigger: 'blur' },
          ],
        }
      }
    },
    components: {
      // schoolPop,
      // jobPop,
      schoolSelect
    },
    methods: {
      init (id) {
        this.visible = true
        this.selectDeptId = id
        this.setData(id)
      },
      setData(data) {
        Dept.info(data).then(res => {
          if(res.data.code === 0) {
            this.dataForm = res.data.data
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
          this.$message({
            message: '读取接口失败！',
            type: 'error',
            duration: 1500
          })
        })
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            Dept.update(this.dataForm).then(res => {
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

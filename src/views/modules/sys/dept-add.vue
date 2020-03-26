<template>
  <!-- <el-card style="height: 750px">
    
    <div slot="header" class="clearfix">
      <span>添加部门</span>
    </div> -->
    <el-dialog title="新增"
    :close-on-click-modal="false"
    :visible.sync="visible">

    <el-form :model="dataForm" ref="dataForm" :rules="dataRule"  @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="部门名称" prop="deptName">
        <el-input v-model="dataForm.deptName" placeholder="部门名称"></el-input>
      </el-form-item>
      <el-form-item label="上级部门" prop="parentName">
        <el-popover
          ref="menuListPopover"
          placement="bottom-start"
          trigger="click">
          <el-tree :data="menuList" :props="menuListTreeProps"
            node-key="deptId"
            ref="menuListTree"
            @current-change="menuListTreeCurrentChangeHandle"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="false" style="height:80vh;overflow:auto">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:menuListPopover :readonly="true" placeholder="点击选择上级菜单" class="menu-list__input"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" v-if="isAuth('sys:dept:save')"  @click="dataFormSubmit()">确定</el-button>
    </span>
    </el-dialog>
</template>

<script>
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
        dataForm: {
          deptName: '',
          parentId: '',
          parentName: ''
        },
        menuList: [],
        menuListTreeProps: {
          label: 'deptName',
          children: 'children'
        },
        dataRule: {
          deptName: [
            { required: true, message: '部门名称不能为空', trigger: 'blur' }
          ],
          parentName: [
            { required: true, message: '上级部门不能为空', trigger: 'change' },
          ],
        }
      }
    },
    components: {
      schoolSelect
    },
    methods: {
      init () {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        this.getDataTree()
      },
      getDataTree () {
        Dept.treeList().then(({data}) => {
          if (data && data.code === 0) {
            this.menuList = treeDataTranslate(data.data, 'deptId')
          } else {
            this.$message.error(data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
      },
       // 菜单树选中
      menuListTreeCurrentChangeHandle (data, node) {
        this.dataForm.parentId = data.deptId
        this.dataForm.parentName = data.deptName
      },
      // 菜单树设置当前选中节点
      menuListTreeSetCurrentNode () {
        this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId)
        this.dataForm.deptName = (this.$refs.menuListTree.getCurrentNode() || {})['deptName']
      },
      // 图标选中
      iconActiveHandle (iconName) {
        this.dataForm.icon = iconName
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            Dept.save(this.dataForm).then(res => {
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
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>

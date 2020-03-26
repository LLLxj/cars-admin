<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="cancle">
    <!-- <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px"> -->
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="dataForm.roleName" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remake">
        <el-input v-model="dataForm.remake" placeholder="备注"></el-input>
      </el-form-item>

      <el-form-item size="mini" label="选择部门">
        <el-tree
          :data="deptList"
          :props="deptListTreeProps"
          node-key="deptId"
          ref="deptListTree"
          :default-expand-all="false"
          show-checkbox>
        </el-tree>
        <!-- <el-popover
          ref="menuListPopover"
          placement="bottom-start"
          trigger="click">
          <el-tree :data="deptList" :props="deptListTreeProps"
            node-key="deptId"
            ref="deptListTree"
            @current-change="menuListTreeCurrentChangeHandle"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover> -->
        <!-- <el-input v-model="dataForm.deptName" v-popover:menuListPopover :readonly="true" placeholder="点击选择部门" class="menu-list__input"></el-input> -->
      </el-form-item>

      <!-- <el-form-item label="校区" >
        <el-checkbox-group v-model="dataForm.schoolIdList">
          <el-checkbox v-for="school in schoolList" :key="school.schoolId" :label="school.schoolId">{{ school.schoolName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item> -->
      <el-form-item size="mini" label="授权">
        <el-tree
          :data="menuList"
          :props="menuListTreeProps"
          node-key="menuId"
          ref="menuListTree"
          :default-expand-all="false"
          show-checkbox>
        </el-tree>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancle()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  import Dept from '@/api/dept'
  import Menu from '@/api/menu'
  import Role from '@/api/role'
  export default {
    data () {
      return {
        visible: false,
        menuList: [],
        deptList: [],
        menuListTreeProps: {
          label: 'name',
          children: 'children'
        },
        deptListTreeProps: {
          label: 'deptName',
          children: 'children'
        },
        schoolList: [],
        dataForm: {
          id: '',
          roleName: '',
          remake: '',
        },
        dataRule: {
          roleName: [
            { required: true, message: '角色名称不能为空', trigger: 'blur' }
          ]
        },
        tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id
        this.visible = true
        this.getMenuList()
        this.getDeptList()
        if (id) {
          this.setData(id)
        }
      },
      setData(id) {
        Role.info(id).then(({data}) => {
          if (data.code === 0) {
            this.dataForm.roleName = data.data.roleName
            this.dataForm.remake = data.data.remake
            // this.dataForm.schoolIdList = data.role.schoolIdList
            const idx = data.data.menuIdList.indexOf(this.tempKey)
            const idx1 = data.data.deptIdList.indexOf(this.tempKey)
            if (idx !== -1) {
              data.data.menuIdList.splice(idx, data.data.menuIdList.length - idx)
            }
            if (idx1 !== -1) {
              data.data.deptIdList.splice(idx1, data.data.deptIdList.length - idx1)
            }
            this.$refs.menuListTree.setCheckedKeys(data.data.menuIdList)
            this.$refs.deptListTree.setCheckedKeys(data.data.deptIdList)
          }else {
            this.$message.error(data.msg)
          }
        }).catch(err => {
          console.log(err)
          this.$message.error(data.msg)
        })
      },
      getDeptList() {
         Dept.treeList().then(({data}) => {
          if (data.code === 0){
            this.deptList = treeDataTranslate(data.data, 'deptId')
          } else {
            this.$message.error(data.msg)
          }
        }).catch(err => {
          console.log(err)
          this.$message.error(err)
        })
      },
      getMenuList() {
        Menu.list().then(({data}) => {
          if (data.code === 0){
            this.menuList = treeDataTranslate(data.data, 'menuId')
          } else {
            this.$message.error(data.msg)
          }
        }).catch(err => {
          console.log(err)
          this.$message.error(err)
        })
      },

      // getDataTree () {
      //   getTreeList().then(({data}) => {
      //     if(data && data.code === 0) {
      //       this.deptList = treeDataTranslate(data.data, 'deptId')
      //     }
      //   })
      // },
      // deptListTreeCurrentChangeHandle (data, node) {
      //   console.log(data)
      //   // this.dataForm.deptId = data.deptId
      //   // this.dataForm.deptName = data.deptName
      // },
      // // 菜单树设置当前选中节点
      // menuListTreeSetCurrentNode () {
      //   this.$refs.deptListTree.setCurrentKey(this.dataForm.parentId)
      //   this.dataForm.deptName = (this.$refs.deptListTree.getCurrentNode() || {})['deptName']
      // },
      // // 图标选中
      // iconActiveHandle (iconName) {
      //   this.dataForm.icon = iconName
      // },
      resetForm() {
        this.$refs['dataForm'].resetFields()
        // this.dataForm = {
        //   id: '',
        //   roleName: '',
        //   remake: '',
        // }
        this.$refs.menuListTree.setCheckedKeys([])
        this.$refs.deptListTree.setCheckedKeys([])
      },
      cancle () {
        this.visible = false
        this.resetForm()
      },
      getCurrent (data, node) {
        console.log(data)
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (!this.dataForm.id) {
              Role.save({
                'roleId': this.dataForm.id,
                'roleName': this.dataForm.roleName,
                'remake': this.dataForm.remake,
                'menuIdList': [].concat(this.$refs.menuListTree.getCheckedKeys(), [this.tempKey], this.$refs.menuListTree.getHalfCheckedKeys()),
                'deptIdList': [].concat(this.$refs.deptListTree.getCheckedKeys(), [this.tempKey], this.$refs.deptListTree.getHalfCheckedKeys())
              }).then(({data}) => {
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
              Role.update({
                'roleId': this.dataForm.id,
                'roleName': this.dataForm.roleName,
                'remake': this.dataForm.remake,
                'menuIdList': [].concat(this.$refs.menuListTree.getCheckedKeys(), [this.tempKey], this.$refs.menuListTree.getHalfCheckedKeys()),
                'deptIdList': [].concat(this.$refs.deptListTree.getCheckedKeys(), [this.tempKey], this.$refs.deptListTree.getHalfCheckedKeys())
              }).then(({data}) => {
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
            
            // this.$http({
            //   url: this.$http.adornUrl(`/sys/role/${!this.dataForm.id ? 'save' : 'update'}`),
            //   method: 'post',
            //   data: this.$http.adornData({
            //     'roleId': this.dataForm.id || undefined,
            //     'roleName': this.dataForm.roleName,
            //     'remark': this.dataForm.remark,
            //     'schoolIdList': this.dataForm.schoolIdList,
            //     'menuIdList': [].concat(this.$refs.menuListTree.getCheckedKeys(), [this.tempKey], this.$refs.menuListTree.getHalfCheckedKeys()),
            //     'deptIdList': [].concat(this.$refs.deptListTree.getCheckedKeys(), [this.tempKey], this.$refs.deptListTree.getHalfCheckedKeys())
            //   })
            // }).then(({data}) => {
            //   if (data && data.code === 0) {
            //     this.$message({
            //       message: '操作成功',
            //       type: 'success',
            //       duration: 1500,
            //       onClose: () => {
            //         this.visible = false
            //         this.resetForm()
            //         this.$emit('refreshDataList')
            //       }
            //     })
            //   } else {
            //     this.$message.error(data.msg)
            //   }
            // })
          }
        })
      }
    }
  }
</script>

<template>
  <el-dialog
    :title="!id ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="cancle">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="dataForm.userName" placeholder="用户姓名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirm" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.confirm" type="password" placeholder="确认密码"></el-input>
      </el-form-item>
      <!-- <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
      </el-form-item> -->
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="dataForm.phone" placeholder="登录帐号" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="选择部门" prop="deptName">
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
            :expand-on-click-node="false" style="height:80vh;overflow:auto;width:200px;">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.deptName" v-popover:menuListPopover :readonly="true" placeholder="点击选择部门" class="menu-list__input"></el-input>
      </el-form-item>
      <!-- <el-form-item label="职位" prop="jobList">
        <el-tag
          v-for="job in dataForm.jobList"
          :key="job.jobId"
          @close="handleJobClose(job)"
          closable>
          {{job.jobName}}
        </el-tag>
        <el-button class="button-new-tag" size="small" @click="selectJobHandle">+ 职位</el-button>
      </el-form-item> -->
      <!-- <el-form-item label="职位" prop="jobList">
        <el-select v-model="dataForm.jobList" multiple placeholder="选择职位" @change="selectChange" style="width:100%">
          <el-option v-for="item in positionList" :key="item.jobId" :label="item.jobName" :value="item.jobId">
          </el-option>
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="校区" prop="schoolName">
        <el-input v-model="dataForm.schoolName" placeholder="点击选择校区" readonly @click.native="selectSchoolHandle()" prefix-icon="el-icon-search"></el-input>
      </el-form-item> -->
      <!-- <el-form-item label="校区" prop="schoolId">
        <school-select v-model="dataForm.schoolId"/>
      </el-form-item> -->
      <el-form-item label="角色" size="mini" prop="roleIdList">
        <el-checkbox-group v-model="dataForm.roleIdList">
          <el-checkbox v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <!-- <el-form-item label="状态" size="mini" prop="status">
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
  import { isMobile, removeBlank } from '@/utils/validate'
  import { treeDataTranslate } from '@/utils'
  import Dept from '@/api/dept'
  import Role from '@/api/role'
  import Users from '@/api/users'
  export default {
    data () {
      var removeSpace = (rule, value, callback) => {
        this.dataForm.userName = removeBlank(value)
        callback()
      }
      var validatePassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('密码不能为空'))
        } else {
          callback()
        }
      }
      var validateComfirmPassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('确认密码不能为空'))
        } else if (this.dataForm.password !== value) {
          callback(new Error('确认密码与密码输入不一致'))
        } else {
          callback()
        }
      }
      var validateMobile = (rule, value, callback) => {
        if (!isMobile(value)) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      }
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
          userId: '',
          userName: '',
          password: '',
          confirm: '',
          deptName: '',
          // email: '',
          phone: '',
          roleIdList: [],
          deptId: '',
        },
        id: '',
        dataRule: {
          userName: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
            { validator: removeSpace, trigger: 'blur'}
          ],
          password: [
            { validator: validatePassword, trigger: 'blur' }
          ],
          confirm: [
            { validator: validateComfirmPassword, trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '手机号不能为空', trigger: 'blur' },
            { validator: validateMobile, trigger: 'blur' }
          ],
        }
      }
    },
    components: {
    },
    watch: {
  //     dataForm: {
  // 　　  handler(newValue, oldValue) {
  //         if(newValue.deptId){
  //           this.getNewRoleList(newValue.deptId)
  //         }
  // 　　　},
  // 　　　deep: true
  // 　　}
    },
    methods: {
      init (id) {
        this.id = id
        this.visible = true
        this.getDataTree()
        this.getRoleList()
        if(id) {
          this.setData(id)
        } 
        // this.getPositionList()
        // this.$http({
        //   url: this.$http.adornUrl('/sys/role/select'),
        //   method: 'get',
        //   params: this.$http.adornParams()
        // }).then(({data}) => {
        //   this.roleList = data && data.code === 0 ? data.list : []
        // }).then(() => {
        //   this.visible = true
        //   this.getDataTree()
        //   this.$nextTick(() => {
        //     this.$refs['dataForm'].resetFields()
        //   })
        // }).then(() => {
        //   if (this.dataForm.id) {
        //     this.$http({
        //       url: this.$http.adornUrl(`/sys/user/info/${this.dataForm.id}`),
        //       method: 'get',
        //       params: this.$http.adornParams()
        //     }).then(({data}) => {
        //       if (data && data.code === 0) {
        //         this.dataForm.userName = data.user.username
        //         this.dataForm.salt = data.user.salt
        //         // this.dataForm.email = data.user.email
        //         this.dataForm.mobile = data.user.mobile
        //         this.dataForm.roleIdList = data.user.roleIdList
        //         this.dataForm.schoolName = data.user.schoolName
        //         this.dataForm.deptId = data.user.deptId
        //         this.dataForm.deptName = data.user.deptName
        //         this.dataForm.schoolId = data.user.schoolId
        //         this.dataForm.status = data.user.status
        //         // this.dataForm.jobList = data.user.jobList
        //         let tempData = data.user.jobList
        //         let tempDatas = []
        //         tempData.forEach(item => {
        //           tempDatas.push(item.jobId)
        //         })
        //         this.dataForm.jobList = tempDatas
        //       }
        //     })
        //   }
        // })
      },
      setData(data) {
        Users.info(data).then(({data}) => {
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
      getRoleList() {
        Role.norList().then(({data}) => {
          console.log(data)
          if (data && data.code === 0) {
            this.roleList = data.data.list
          } else {
            this.$message.error(data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
      },
      resetForm() {
        this.$refs['dataForm'].resetFields()
      },
      cancle () {
        this.visible = false
        this.resetForm()
      },
       // 菜单树选中
      menuListTreeCurrentChangeHandle (data, node) {
        this.dataForm.deptId = data.deptId
        this.dataForm.deptName = data.deptName
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
      // 多选职位
      selectChange (data) {
        // this.dataForm.jobList = [] 
        // for(var i in data){
        //   this.positionList.map((item,index) => {          
        //     if (item.jobId == data[i]) { 
        //       this.dataForm.jobList.push(item)           
        //     }
        //   }) 
        // }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            console.log(this.dataForm)
            if (!this.id) {
              Users.save(this.dataForm).then(({data}) => {
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
              Users.update(this.dataForm).then(({data}) => {
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

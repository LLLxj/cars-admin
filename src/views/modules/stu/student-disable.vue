<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <!-- <el-form-item label="校区编号" prop="schoolCode">
        <el-input v-model="dataForm.schoolCode" maxlength="20"  placeholder="校区编号"></el-input>
      </el-form-item> -->
      <el-form-item label="学员" prop="stuName" >
        <el-input v-model="dataForm.stuName" placeholder="请输入学员姓名" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="cardId">
        <el-input v-model="dataForm.cardId" placeholder="身份证号"></el-input>
      </el-form-item>
      <!-- <el-form-item label="学历" prop="educType">
        <el-input v-model="dataForm.educType" placeholder="学历"></el-input>
      </el-form-item> -->
      <el-form-item label="学历" prop="educType">
          <el-select v-model="dataForm.educType" placeholder="Please select">
            <el-option v-for="item in educTypeOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
      </el-form-item>
      <el-form-item label="联系方式" prop="stuPhone">
        <el-input v-model="dataForm.stuPhone" placeholder="联系方式" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="年龄" prop="stuUserAge" >
        <el-input v-model="dataForm.stuUserAge" placeholder="年龄" maxlength="3" max="100"></el-input>
      </el-form-item>
      <el-form-item label="性别" size="mini" prop="stuSex">
        <el-radio-group v-model="dataForm.stuSex">
          <el-radio :label="0">女</el-radio>
          <el-radio :label="1">男</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="户籍" prop="regAddr">
        <el-input v-model="dataForm.regAddr" placeholder="户籍" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="现住区" prop="addr">
        <el-input v-model="dataForm.addr" placeholder="现所住地区" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="contUserName">
        <el-input v-model="dataForm.contUserName" placeholder="紧急联系人" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="联系人电话" prop="contUserPhone">
        <el-input v-model="dataForm.contUserPhone" placeholder="紧急联系人电话" maxlength="20"></el-input>
      </el-form-item>
      <!-- <el-form-item label="校区" prop="schoolName">
        <el-input
          v-model="dataForm.schoolName"
          placeholder="点击选择校区"
          :disabled="true"
          @click.native="selectSchoolHandle()"
          prefix-icon="el-icon-search"
        ></el-input>
      </el-form-item>
      
      <el-form-item label="开班时间" prop="classDate">
        <el-date-picker v-model="dataForm.classDate" type="date" placeholder="请选择开班时间"/>
      </el-form-item>

      <el-form-item label="状态" size="mini" prop="classStatus">
        <el-radio-group v-model="dataForm.classStatus">
          <el-radio :label="2">默认班级</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item> -->
     
      <!-- <el-form-item label="角色" size="mini" prop="roleIdList">
        <el-checkbox-group v-model="dataForm.roleIdList">
          <el-checkbox v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>

    <!-- 弹窗 -->
    <!-- <school-pop v-if="schoolPopVisible" ref="schoolPop" @school-pop-event="callBackSchoolPop"></school-pop> -->
  </el-dialog>
</template>

<script>
  import { isEmail, isPhone, isMobile, isUpperCase } from '@/utils/validate'
  import { stuList, stuListSave, stuListUpdate, stuInfo } from '@/api/student'
  import { parseTime , formatTime } from '@/utils/index'
//   import schoolPop from '../../common-pop/school-pop'

  export default {
    data () {
        var validateMobile = (rule, value, callback) => {
            if (isMobile(value)) {
            callback()
            } else {
            callback(new Error('手机号格式错误'))
            }
        }
      return {
        visible: false,
        roleList: [],
        value:'',
        // educTypeOptions: ['本科', '专科', '职高','初中'],
        educTypeOptions: [{
          value: 0,
          label: '本科'
        }, {
          value: 1,
          label: '专科'
        }, {
          value: 2,
          label: '职高'
        }, {
          value: 3,
          label: '初中'
        }],
        dataForm: {
          id: 0,
          stuName: '',
          cardId: '',
          stuPhone: '',
          stuUserAge: '',
          stuSex: 0,
          educType: 1,
          addr: '',
          regAddr: '',
          contUserName: '',
          contUserPhone: '',
          stuStatus: 0,
          stuUserId:'',
          creatorId:''
        },
        dataRule: {
          stuName: [
            { required: true, message: '学员姓名不能为空', trigger: 'blur' }
          ],
          stuPhone: [
            { required: true, message: '联系方式不能为空', trigger: 'blur' },
            { validator: validateMobile, trigger: 'blur' }
          ],
          regAddr: [
            { required: true, message: '户籍不能为空', trigger: 'blur' }
          ],
          addr: [
            { required: true, message: '现住地不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id,stuStatus) {
        if(stuStatus == 0){
          this.$confirm(`确定启用?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() =>{
          this.dataForm.id = id || 0
          // console.log(this.dataForm.id)
          this.$http({
            url: this.$http.adornUrl('/sys/role/select'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.roleList = data && data.code === 0 ? data.list : []
          }).then(() => {
            if(this.dataForm.id){
              stuInfo(this.dataForm.id).then(res => {
                this.dataForm.stuUserId = res.data.stuUserEntity.stuUserId
                this.dataForm.stuName = res.data.stuUserEntity.stuName
                this.dataForm.cardId = res.data.stuUserEntity.cardId
                this.dataForm.stuPhone = res.data.stuUserEntity.stuPhone
                this.dataForm.stuUserAge = res.data.stuUserEntity.stuUserAge
                this.dataForm.stuSex = res.data.stuUserEntity.stuSex 
                this.dataForm.educType = res.data.stuUserEntity.educType
                this.dataForm.addr = res.data.stuUserEntity.addr
                this.dataForm.regAddr = res.data.stuUserEntity.regAddr
                this.dataForm.contUserName = res.data.stuUserEntity.contUserName
                this.dataForm.contUserPhone = res.data.stuUserEntity.contUserPhone
                this.dataForm.stuStatus = 1
              }).then(() => {   
                stuListUpdate({
                  'stuName': this.dataForm.stuName,
                  'cardId': this.dataForm.cardId,
                  'stuPhone': this.dataForm.stuPhone,
                  'stuUserAge': this.dataForm.stuUserAge,
                  'stuSex': this.dataForm.stuSex,
                  'educType': this.dataForm.educType,
                  'addr': this.dataForm.addr,
                  'regAddr': this.dataForm.regAddr,
                  'contUserName': this.dataForm.contUserName,
                  'contUserPhone': this.dataForm.contUserPhone,
                  'stuStatus': 1,
                  'stuUserId': this.dataForm.stuUserId,
                  'creatorId': this.dataForm.creatorId,
                  'createTime': this.dataForm.createTime
                }).then(res => {
                  console.log(res)
                  if(res.data && res.data.code === 0){
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
              }).catch(err => {
                      console.log(err)
              })
            }
          })
        })
        }else{
            this.$confirm(`确定禁用?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() =>{
            this.dataForm.id = id || 0
            console.log(this.dataForm.id)
            this.$http({
              url: this.$http.adornUrl('/sys/role/select'),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              this.roleList = data && data.code === 0 ? data.list : []
            }).then(() => {
              if(this.dataForm.id){
                stuInfo(this.dataForm.id).then(res => {
                  this.dataForm.stuUserId = res.data.stuUserEntity.stuUserId
                  this.dataForm.stuName = res.data.stuUserEntity.stuName
                  this.dataForm.cardId = res.data.stuUserEntity.cardId
                  this.dataForm.stuPhone = res.data.stuUserEntity.stuPhone
                  this.dataForm.stuUserAge = res.data.stuUserEntity.stuUserAge
                  this.dataForm.stuSex = res.data.stuUserEntity.stuSex 
                  this.dataForm.educType = res.data.stuUserEntity.educType
                  this.dataForm.addr = res.data.stuUserEntity.addr
                  this.dataForm.regAddr = res.data.stuUserEntity.regAddr
                  this.dataForm.contUserName = res.data.stuUserEntity.contUserName
                  this.dataForm.contUserPhone = res.data.stuUserEntity.contUserPhone
                  this.dataForm.stuStatus = 0
                }).then(() => {
                      
                  stuListUpdate({
                    'stuName': this.dataForm.stuName,
                    'cardId': this.dataForm.cardId,
                    'stuPhone': this.dataForm.stuPhone,
                    'stuUserAge': this.dataForm.stuUserAge,
                    'stuSex': this.dataForm.stuSex,
                    'educType': this.dataForm.educType,
                    'addr': this.dataForm.addr,
                    'regAddr': this.dataForm.regAddr,
                    'contUserName': this.dataForm.contUserName,
                    'contUserPhone': this.dataForm.contUserPhone,
                    'stuStatus': 0,
                    'stuUserId': this.dataForm.stuUserId,
                    'creatorId': this.dataForm.creatorId,
                    'createTime': this.dataForm.createTime
                  }).then(res => {
                    console.log(res)
                    if(res.data && res.data.code === 0){
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
                }).catch(err => {
                        console.log(err)
                })
              }
            })
          })
        }
        
        
      },
      // 校区弹窗
      selectSchoolHandle () {
        this.schoolPopVisible = true
        this.$nextTick(() => {
          this.$refs.schoolPop.init()
        })
      },
      // 校区弹窗回调事件
      callBackSchoolPop (schoolId, schoolName, schoolCode) {
        this.dataForm.schoolName = schoolName
        this.dataForm.schoolId = schoolId
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
            console.log(this.dataForm)
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/stu/user/update`),
              method: 'post',
              data: this.$http.adornData({
                'stuName': this.dataForm.stuName,
                'cardId': this.dataForm.cardId,
                'stuPhone': this.dataForm.stuPhone,
                'stuUserAge': this.dataForm.stuUserAge,
                'stuSex': this.dataForm.stuSex,
                'educType': this.dataForm.educType,
                'addr': this.dataForm.addr,
                'regAddr': this.dataForm.regAddr,
                'contUserName': this.dataForm.contUserName,
                'contUserPhone': this.dataForm.contUserPhone,
                'stuStatus': 0,
                'stuUserId': this.dataForm.stuUserId,
                'creatorId': this.dataForm.creatorId,
                'createTime': this.dataForm.createTime
              })
            }).then(({data}) => {
            //   console.log(data)
              if (data && data.code === 0) {
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

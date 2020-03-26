<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible"  top="10vh">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <!-- <el-form-item label="校区编号" prop="schoolCode">
        <el-input v-model="dataForm.schoolCode" maxlength="20"  placeholder="校区编号"></el-input>
      </el-form-item> -->
      <el-form-item label="学员" prop="stuName" >
        <el-input v-model="dataForm.stuName" placeholder="请输入学员姓名" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="cardId">
        <el-input v-model="dataForm.cardId" placeholder="身份证号" @blur="getUserInfo" maxlength="18"></el-input>
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
        <el-input v-model="dataForm.stuPhone" placeholder="联系方式" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="年龄" prop="stuUserAge" >
        <!-- <el-input-number v-model="dataForm.stuUserAge" :step="1" :min="1" :max="100"></el-input-number> -->
        <el-input-number v-model="dataForm.stuUserAge" type="number" controls-position="right" :min="1" :max="100"></el-input-number>
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
        <el-input v-model="dataForm.contUserName" placeholder="紧急联系人" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="联系人电话" prop="contUserPhone">
        <el-input v-model="dataForm.contUserPhone" placeholder="紧急联系人电话" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="联系人2" prop="secondContUserName">
        <el-input v-model="dataForm.secondContUserName" placeholder="紧急联系人" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="联系人2电话" prop="secondContUserPhone">
        <el-input v-model="dataForm.secondContUserPhone" placeholder="紧急联系人电话" maxlength="11"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { isMobile } from '@/utils/validate'
  import { stuInfo } from '@/api/student'
  import { getEduTypeList } from '@/utils/educTypeUtil'
  import { regCheckCardId } from '@/api/reg'

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
        value: '',
        educTypeOptions: getEduTypeList(false),
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
          secondContUserName: '',
          secondContUserPhone: '',
          stuStatus: 1,
          stuUserId: '',
          creatorId: ''
        },
        dataRule: {
          stuName: [
            {required: true, message: '学员姓名不能为空', trigger: 'blur'}
          ],
          cardId: [
            {required: true, message: '身份证不能为空', trigger: 'blur'}
          ],
          stuPhone: [
            {required: true, message: '联系方式不能为空', trigger: 'blur'},
            {validator: validateMobile, trigger: 'blur'}
          ],
          contUserName: [
            {required: true, message: '紧急联系人不能为空', trigger: 'blur'}
          ],
          contUserPhone: [
            {required: true, message: '紧急联系人电话不能为空', trigger: 'blur'}
          ],
          secondContUserName: [
            {required: true, message: '紧急联系人2不能为空', trigger: 'blur'}
          ],
          secondContUserPhone: [
            {required: true, message: '紧急联系人2电话不能为空', trigger: 'blur'}
          ],
          stuUserAge: [
            {required: true, message: '请输入年龄', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/sys/role/select'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.roleList = data && data.code === 0 ? data.list : []
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (this.dataForm.id) {
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
              this.dataForm.secondContUserName = res.data.stuUserEntity.secondContUserName
              this.dataForm.secondContUserPhone = res.data.stuUserEntity.secondContUserPhone
            }).catch(err => {
              console.log(err)
            })
          }
        })
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
      // 根据身份证获取信息
      getUserInfo () {
        regCheckCardId(this.dataForm.cardId).then(res => {
          if(res.data && res.data.code === 1002){
            this.dataForm.regAddr = res.data.data.regAddr
            this.dataForm.stuSex = res.data.data.stuSex
            this.dataForm.stuUserAge = res.data.data.stuUserAge
          }
          if(res.data.code === 500){
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
            this.$http({
              url: this.$http.adornUrl(`/stu/user/${!this.dataForm.id ? 'save' : 'update'}`),
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
                'secondContUserName': this.dataForm.secondContUserName,
                'secondContUserPhone': this.dataForm.secondContUserPhone,
                'stuStatus': this.dataForm.stuStatus,
                'stuUserId': this.dataForm.stuUserId,
                'creatorId': this.dataForm.creatorId,
                'createTime': this.dataForm.createTime
              })
            }).then(({data}) => {
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

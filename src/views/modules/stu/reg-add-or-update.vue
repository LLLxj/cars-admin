<template>
<div>
  <div>
    <!-- <el-dialog :title="!this.index ? '报名表新增' : '报名表编辑'" :close-on-click-modal="false" :visible.sync="visible" width="70%"> -->
    <el-dialog  :close-on-click-modal="false" :visible.sync="visible" width="70%">

    <div>
        <!-- 学员信息 -->
        <el-form :model="dataForm" :inline="true" :rules="dataRule" ref="dataForm" label-width="100px">
          <h2 style="padding-left:20px;color:#333333">学员个人信息</h2>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="身份证号" prop="cardId" clearable>
                <el-input v-model="dataForm.cardId" class="box-input" :disabled="noDesign"  placeholder="身份证号" v-on:blur="cardIdBlurFunction"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="学员" prop="stuName" >
                <el-input v-model="dataForm.stuName" class="box-input" :disabled="edit" placeholder="学员姓名" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性别" size="mini" prop="stuSex">
                <el-radio-group v-model="dataForm.stuSex" :disabled="edit">
                  <el-radio :label="0">女</el-radio>
                  <el-radio :label="1">男</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
                <el-form-item label="联系方式" prop="stuPhone">
                    <el-input v-model="dataForm.stuPhone" class="box-input" :disabled="edit" placeholder="联系方式" maxlength="20"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="年龄" prop="stuUserAge" >
                <el-input-number v-model="dataForm.stuUserAge" :min="1" class="box-input" :max="100" :disabled="edit" controls-position="right"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="学历" prop="educType">
                  <el-select v-model="dataForm.educType" class="box-input" :disabled="edit" placeholder="请选择学历">
                      <el-option v-for="item in educTypeOptions" :key="item.value" :label="item.label" :value="item.value"/>
                  </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="户籍" prop="regAddr">
                <el-input v-model="dataForm.regAddr" placeholder="户籍" class="box-input" :disabled="edit" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="现住地" prop="addr">
                  <el-input v-model="dataForm.addr" placeholder="现所住地区" class="box-addr" :disabled="edit" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系人" prop="contUserName">
                  <el-input v-model="dataForm.contUserName" placeholder="紧急联系人" class="box-input" :disabled="edit" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24"> 
            <el-col :span="8">
              <el-form-item label="联系人电话" prop="contUserPhone">
                <el-input v-model="dataForm.contUserPhone" placeholder="紧急联系人电话" class="box-input" :disabled="edit" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="渠道" prop="channeId">
                <resourceSelect v-model="dataForm.channeId" :clearable="noSelect" :disabled="edit" @changeResource="getChannelVal"></resourceSelect>
              </el-form-item>
            </el-col>
          </el-row>
          <h2 style="padding-left:20px;color:#333333">报读课程</h2>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="校区" prop="schoolId">
                <school-select v-model="dataForm.schoolId" :disabled="noDesign" :clearable="noSelectSchool"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="报读班型" prop="classTypeName">
                <el-input v-model="dataForm.classTypeName" placeholder="点击选择班型" class="box-input" readonly @click.native="selectClassTypeHandle()" prefix-icon="el-icon-search"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="课程价格:" prop="classTypePrice">
                <!-- <template slot-scope="scope">
                  <span v-model="dataForm.classTypePrice"></span>
                </template> -->
                <el-button type="text" style="color:black" v-model="dataForm.classTypePrice">{{ this.dataForm.classTypePrice }}</el-button>
                <!-- <el-input-number v-model="dataForm.classTypePrice" :min="0" class="box-input" :max="100000" controls-position="right"></el-input-number> -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="订单价格:" prop="payPrice">
                <el-button type="text" style="color:black" v-model="dataForm.payPrice">{{ this.dataForm.payPrice }}</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="未缴金额:" prop="confPayPrice">
                <el-button type="text" style="color:black" v-model="dataForm.confPayPrice">{{ this.dataForm.confPayPrice }}</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="已缴金额:" prop="stayPayPrice">
                <el-button type="text" style="color:black" v-model="dataForm.stayPayPrice">{{ this.dataForm.stayPayPrice }}</el-button>
              </el-form-item>
            </el-col>  
            <el-col :span="8" v-show="outerSubVisible">
              <el-form-item label="电邀老师" prop="spreadStuRegSaleEntity">
                <el-input v-model="dataForm.spreadStuRegSaleEntity.userName" placeholder="点击选择电邀老师" class="box-input" readonly @click.native="selectTgTeacherHandle()" prefix-icon="el-icon-search"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8"> 
              <el-form-item label="招生老师" >
                <el-tag v-for="teacher in dataForm.recruitStuRegSaleEntities" :key="teacher.userId" @close="handleJobClose(teacher)" closable>
                  {{teacher.userName}}
                </el-tag>
                <el-button class="button-new-tag" size="small" @click="selectJobHandle">+ 老师</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="!outerSubVisible">
              <el-form-item label="介绍人" prop="nickName1">
                <el-input v-model="dataForm.nickName1" placeholder="输入介绍人姓名" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备注" prop="remark">
                <el-input type="textarea" class="box-remark" v-model="dataForm.remark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

    </div>

    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    </el-dialog>
  </div>

  <!-- 弹窗部分 -->
  <div>
      <classType ref="classType" v-if="classTypePopVisible" @classType-pop-event="callBackClassType"></classType>
      <schoolPop ref="schoolPop" v-if="schoolPopVisible"  @school-pop-event="callBackSchoolPop"></schoolPop>
      <teacherPop ref="teacherPop" v-if="teacherPopVisible" @tg-pop-event="callBackTgPop"></teacherPop>
      <zsTeacherPop ref="zsTeacherPop" v-if="zsTeacherPopVisible" @zs-pop-event="callBackZsPop"></zsTeacherPop>
  </div>
</div>
</template>
<style>
  /* .box-remark {
    width:250%;
  } */
</style>
<script>
  import classType from '@/views/common-pop/class-type-pop'
  import teacherPop from '@/views/common-pop/tg-teacher-pop'
  import zsTeacherPop from '@/views/common-pop/zs-teacher-pop'
  import { isMobile } from '@/utils/validate'
  import { regInfo, regSave, regUpdate, regCheckCardId } from '@/api/reg'
  import { parseTime } from '@/utils/index'
  import { getEduTypeList } from '@/utils/educTypeUtil'
  import schoolSelect from '@/views/common-select/school-select'
  import resourceSelect from '@/views/common-select/recource-select'

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
        classTypePopVisible: false,
        schoolPopVisible: false,
        teacherPopVisible: false,
        zsTeacherPopVisible: false,
        edit: true,
        noDesign: false,
        educTypeOptions: getEduTypeList(false),
        noSelect: true,
        noSelectSchool: true,
        outerSubVisible: true,
        dataForm: {
          addr: '',
          cardId: '',
          classTypeId: '',
          classTypeName: '',
          classTypePrice: '--',
          payPrice: '--',
          confPayPrice: '--',
          discPrice: '--',
          stayPayPrice: '--',
          contUserName: '',
          contUserPhone: '',
          educType: 1,
          regAddr: '',
          regId: '',
          regStatus: 1,
          remark: '',
          schoolId: '',
          schoolName: '',
          sellUserId: '',
          stuName: '',
          stuPhone: '',
          stuSex: 0,
          stuUserAge: '',
          stuUserId: '',
          recruitStuRegSaleEntities: [],
          // recruitStuRegSaleEntities: [],
          spreadStuRegSaleEntity: {},
          channeId: '',
          nickName1: '',
          updateClassTypeStatus: ''
        },
        index: '',
        dataRule: {
          stuName: [
            { required: true, message: '学员姓名不能为空', trigger: 'blur' }
          ],
          stuPhone: [
            { required: true, message: '联系方式不能为空', trigger: 'blur' }
          ],
          stuUserAge: [
            { required: true, message: '年龄不能为空', trigger: 'blur' }
          ],
          educType: [
            { required: true, message: '学历不能为空', trigger: 'blur' }
          ],
          addr: [
            { required: true, message: '现住地不能为空', trigger: 'blur' }
          ],
          regAddr: [
            { required: true, message: '户籍不能为空', trigger: 'blur' }
          ],
          schoolId: [
            { required: true, message: '校区不能为空', trigger: 'blur' }
          ],
          userName: [
            { required: true, message: '销售老师不能为空', trigger: 'change' }
          ],
          payPrice: [
            { required: true, message: '成交金额不能为空', trigger: 'blur' }
          ],
          classTypeName: [
            { required: true, message: '报读班型不能为空', trigger: 'change' }
          ],
          channeId: [
            { required: true, message: '来源渠道不能为空', trigger: 'blur' }
          ],
          cardId: [
            { required: true, message: '身份证号不能为空', trigger: 'blur' }
          ],
          spreadStuRegSaleEntity: [
            { required: true, message: '电邀老师不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
      teacherPop, 
      classType, 
      schoolSelect,
      zsTeacherPop,
      resourceSelect
    },
    methods: {
      init (id) {
        // console.log(id)
        this.dataForm.regId = id
        this.index = id || 0
        this.edit = true
        this.noDesign = false
        this.visible = true
        this.outerSubVisible = true
        this.dataForm.recruitStuRegSaleEntities = []
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        if (this.index) {
          this.noDesign = true
          regInfo(this.index).then(res => {
            if (res.data && res.data.code === 0) {
              console.log(res)
              this.dataForm = res.data.stuRegVo
              // this.dataForm.payPrice = res.data.stuRegVo.payPrice || 0
              // this.dataForm.confPayPrice = res.data.stuRegVo.confPayPrice || 0
              // this.dataForm.payPrice = res.data.stuRegVo.classTypePrice - res.data.stuRegVo.discPrice
              // this.dataForm.stayPayPrice = res.data.stuRegVo.classTypePrice - res.data.stuRegVo.discPrice
            }
          }).catch(err => { 
            console.log(err)
          })
        } else {
          this.noDesign = false
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
      // 推广老师弹窗
      selectTgTeacherHandle () {
        this.teacherPopVisible = true
        this.$nextTick(() => {
          this.$refs.teacherPop.init()
        })
      },
      callBackTgPop (userId, userName) {
        this.dataForm.spreadStuRegSaleEntity = {
          'userName': userName,
          'userId': userId
        }
      },
      // 选择班型弹窗
      selectClassTypeHandle () {
        this.classTypePopVisible = true
        this.$nextTick(() => {
          this.$refs.classType.init()
        })
      },
      callBackClassType (classTypeId, classTypeName, classTypePrice) {
        this.dataForm.classTypeId = classTypeId
        this.dataForm.classTypeName = classTypeName
        this.dataForm.payPrice = classTypePrice
        this.dataForm.classTypePrice = classTypePrice
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (this.index) {
              if(this.noSelect == false){
                this.dataForm.channeId = ''
              }
              if(this.noSelectSchool == false){
                this.dataForm.schoolId = ''
              }
              regUpdate({
                'regId': this.dataForm.regId,
                'classTypeId': this.dataForm.classTypeId,
                'channeId': this.dataForm.channeId,
                'classTypePrice': this.dataForm.classTypePrice,
                'payPrice': this.dataForm.payPrice,
                'discPrice': this.dataForm.discPrice,
                'confPayPrice': this.dataForm.confPayPrice,
                'stayPayPrice': this.dataForm.payPrice,
                'spreadStuRegSaleEntity': this.dataForm.spreadStuRegSaleEntity,
                'recruitStuRegSaleEntities': this.dataForm.recruitStuRegSaleEntities,
                'nickName': this.dataForm.nickName,
                'updateClassTypeStatus': this.dataForm.updateClassTypeStatus,
                'remark': this.dataForm.remark 
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
              if(this.noSelect == false){
                this.dataForm.channeId = ''
              }
              regSave({
                'cardId': this.dataForm.cardId,
                'stuName': this.dataForm.stuName,
                'stuSex': this.dataForm.stuSex,
                'stuPhone': this.dataForm.stuPhone,
                'stuUserAge': this.dataForm.stuUserAge,
                'educType': this.dataForm.educType,
                'addr': this.dataForm.addr,
                'regAddr': this.dataForm.regAddr,
                'contUserName': this.dataForm.contUserName,
                'contUserPhone': this.dataForm.contUserPhone,
                'channeId': this.dataForm.channeId,
                'schoolId': this.dataForm.schoolId,
                'classTypeId': this.dataForm.classTypeId,
                'classTypePrice': this.dataForm.classTypePrice,
                'payPrice': this.dataForm.payPrice,
                'discPrice': this.dataForm.stayPayPrice || 0,
                'confPayPrice': this.dataForm.confPayPrice,
                'stayPayPrice': this.dataForm.stayPayPrice,
                'spreadStuRegSaleEntity': this.dataForm.spreadStuRegSaleEntity,
                'recruitStuRegSaleEntities': this.dataForm.recruitStuRegSaleEntities,
                'nickName': this.dataForm.nickName,
                'remark': this.dataForm.remark
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
            }
          }
        })
      },
      cardIdBlurFunction () {
        if(this.dataForm.cardId !== ''){
          regCheckCardId(this.dataForm.cardId).then(res => {
            if (res.data && res.data.code === 0 && res.data.stuUserEntity.cardId !== null) {
              this.edit = true
              this.dataForm.stuUserId = res.data.stuUserEntity.stuUserId
              this.dataForm.stuName = res.data.stuUserEntity.stuName
              this.dataForm.stuSex = res.data.stuUserEntity.stuSex
              this.dataForm.stuPhone = res.data.stuUserEntity.stuPhone
              this.dataForm.stuUserAge = res.data.stuUserEntity.stuUserAge
              this.dataForm.educType = res.data.stuUserEntity.educType
              this.dataForm.addr = res.data.stuUserEntity.addr
              this.dataForm.regAddr = res.data.stuUserEntity.regAddr
              this.dataForm.contUserName = res.data.stuUserEntity.contUserName
              this.dataForm.contUserPhone = res.data.stuUserEntity.contUserPhone
            } else {
              this.dataForm.stuName = ''
              this.dataForm.stuSex = 0
              this.dataForm.stuPhone = ''
              this.dataForm.stuUserAge = ''
              this.dataForm.educType = 1
              this.dataForm.addr = ''
              this.dataForm.regAddr = ''
              this.dataForm.contUserName = ''
              this.dataForm.contUserPhone = ''
              this.edit = false
            }
          }).catch(err => {
            console.log(err)
          })
        }
        
      },
      // 招生老师弹窗
      selectJobHandle () {
        this.zsTeacherPopVisible = true
        this.$nextTick(() => {
          this.$refs.zsTeacherPop.init()
        })
      },
      // 招生老师回调事件
      callBackZsPop (userId, userName) {
        if (this.dataForm.recruitStuRegSaleEntities === null) {
          this.dataForm.recruitStuRegSaleEntities = []
        }
        // 处理重复选择角色问题
        let i = 0
        for (; i < this.dataForm.recruitStuRegSaleEntities.length; i++) {
          if (this.dataForm.recruitStuRegSaleEntities[i].userId === userId) {
            return
          }
        }
        this.dataForm.recruitStuRegSaleEntities.push({'userName': userName, 'userId': userId})
      },
      handleJobClose (teacher) {
        if (teacher !== null && this.dataForm.recruitStuRegSaleEntities !== null && this.dataForm.recruitStuRegSaleEntities.length > 0) {
          let i = 0
          for (; i < this.dataForm.recruitStuRegSaleEntities.length; i++) {
            if (this.dataForm.recruitStuRegSaleEntities[i].userId === teacher.userId) {
              this.dataForm.recruitStuRegSaleEntities.splice(i, 1)
              break
            }
          }
        }
      },
      // 监听渠道ID
      getChannelVal (val) {
        if(val == 42 || val == 43){
          this.outerSubVisible = false
        }else{
          this.outerSubVisible = true
        }
      }
    }
  }
</script>

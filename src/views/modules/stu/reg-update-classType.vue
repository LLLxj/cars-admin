<template>
<div>
  <div>
    <el-dialog :close-on-click-modal="false" :visible.sync="visible" width="70%">
    <!-- <el-dialog  :close-on-click-modal="false" :visible.sync="visible" width="70%"> -->

    <div>
        <!-- 学员信息 -->
        <el-form :model="dataForm" :inline="true" ref="dataForm" label-width="100px">
          <h2 style="padding-left:20px;color:#333333">学员个人信息</h2>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="身份证号" prop="cardId" clearable>
                <el-input v-model="dataForm.cardId" class="box-input" :disabled="edit"  placeholder="身份证号"></el-input>
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
                <school-select v-model="dataForm.schoolId" :disabled="edit" :clearable="noSelectSchool"/>
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
                <el-button type="text" style="color:black" v-model="dataForm.classTypePrice">{{ this.dataForm.classTypePrice || '--' }}</el-button>
                <!-- <el-input-number v-model="dataForm.classTypePrice" :min="0" class="box-input" :max="100000" controls-position="right"></el-input-number> -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="订单价格:" prop="payPrice">
                <el-button type="text" style="color:black" v-model="dataForm.payPrice">{{ this.dataForm.payPrice || '--' }}</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="未缴金额:" prop="confPayPrice">
                <el-button type="text" style="color:black" v-model="dataForm.confPayPrice">{{ this.dataForm.confPayPrice || '--' }}</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="已缴金额:" prop="stayPayPrice">
                <el-button type="text" style="color:black" v-model="dataForm.stayPayPrice">{{ this.dataForm.stayPayPrice || '--' }}</el-button>
              </el-form-item>
            </el-col>  
            <!-- <el-col :span="8" v-show="outerSubVisible">
              <el-form-item label="电邀老师" prop="spreadStuRegSaleEntity.userName">
                <el-input v-model="dataForm.spreadStuRegSaleEntity.userName" placeholder="点击选择电邀老师" class="box-input" readonly @click.native="selectTgTeacherHandle()" prefix-icon="el-icon-search"></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="8"> 
              <el-form-item label="招生老师">
                <el-tag v-for="teacher in dataForm.recruitStuRegSaleEntities" :key="teacher.userId" @close="handleJobClose(teacher)" closable>
                  {{teacher.userName}}
                </el-tag>
                <el-button class="button-new-tag" size="small" @click="selectJobHandle">+ 老师</el-button>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8" v-show="!outerSubVisible">
              <el-form-item label="介绍人" prop="nickName1">
                <el-input v-model="dataForm.nickName1" placeholder="输入介绍人姓名" maxlength="20"></el-input>
              </el-form-item>
            </el-col> -->
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
        <!-- <el-button type="primary" @click="dataFormSubmit()">确定</el-button> -->
        <el-button type="primary" v-if="isAuth('stu:reg:updateClassType:save')" @click="dataFormSubmit()">确定</el-button>
        <!-- <el-button type="primary" v-if="isAuth('stu:reg:info')" @click="dataFormSubmit()">确定111</el-button> -->
    </span>
    </el-dialog>
  </div>

  <!-- 弹窗部分 -->
  <div>
      <classType ref="classType" v-if="classTypePopVisible" @classType-pop-event="callBackClassType"></classType>
      <schoolPop ref="schoolPop" v-if="schoolPopVisible"  @school-pop-event="callBackSchoolPop"></schoolPop>
      <!-- <teacherPop ref="teacherPop" v-if="teacherPopVisible" @tg-pop-event="callBackTgPop"></teacherPop> -->
      <zsTeacherPop ref="zsTeacherPop" v-if="zsTeacherPopVisible" @all-teacher-pop-event="callBackZsPop"></zsTeacherPop>
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
  // import teacherPop from '@/views/common-pop/tg-teacher-pop'
  import zsTeacherPop from '@/views/common-pop/all-teacher-pop'
  import { isMobile } from '@/utils/validate'
  import { parseTime } from '@/utils/index'
  import { getEduTypeList } from '@/utils/educTypeUtil'
  import schoolSelect from '@/views/common-select/school-select'
  import resourceSelect from '@/views/common-select/recource-select'
  import { regGetUserInfo, updateClassTypeSave } from '@/api/reg'

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
        educTypeOptions: getEduTypeList(false),
        noSelect: true,
        noSelectSchool: true,
        dataForm: {
          addr: '',
          cardId: '',
          classTypeId: '',
          classTypeName: '',
          classTypePrice: '',
          payPrice: '',
          confPayPrice: '',
          discPrice: 0,
          stayPayPrice: '',
          contUserName: '',
          contUserPhone: '',
          educType: '',
          regAddr: '',
          regId: '',
          remark: '',
          schoolId: '',
          schoolName: '',
          sellUserId: '',
          stuName: '',
          stuPhone: '',
          stuSex: '',
          stuUserAge: '',
          stuUserId: '',
          recruitStuRegSaleEntities: [],
          // spreadStuRegSaleEntity: {},
          channeId: '',
          nickName1: '',
          stuUserId: ''
        },
        index: '',
      }
    },
    components: {
      classType, 
      schoolSelect,
      zsTeacherPop,
      resourceSelect
    },
    methods: {
      init (id) {
        this.dataForm.regId = id
        this.index = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        
        regGetUserInfo(this.index).then(res => {
        if (res.data && res.data.code === 0) {
            console.log(res.data.stuRegVo.classTypePrice)
            console.log(res.data.stuRegVo.payPrice)
            console.log(res.data.stuRegVo.discPrice)
            console.log(res.data.stuRegVo.confPayPrice)
            console.log(res.data.stuRegVo.stayPayPrice)
            this.dataForm = res.data.stuRegVo
            this.dataForm.discPrice = res.data.stuRegVo.discPrice || 0
            this.dataForm.confPayPrice = res.data.stuRegVo.confPayPrice || 0
            this.dataForm.stayPayPrice = res.data.stuRegVo.stayPayPrice || 0
            // this.dataForm.discPrice = res.data.stuRegVo.discPrice || 0
        }
        }).catch(err => {
        console.log(err)
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
      // // 推广老师弹窗
      // selectTgTeacherHandle () {
      //   this.teacherPopVisible = true
      //   this.$nextTick(() => {
      //     this.$refs.teacherPop.init()
      //   })
      // },
      // callBackTgPop (userId, userName) {
      //   this.dataForm.spreadStuRegSaleEntity = {
      //     'userName': userName,
      //     'userId': userId
      //   }
      // },
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
            console.log(this.dataForm)
              updateClassTypeSave({
                'regId': this.dataForm.regId,
                'stuUserId': this.dataForm.stuUserId,
                'schoolId': this.dataForm.schoolId,
                'channeId': this.dataForm.channeId,
                'classTypeId': this.dataForm.classTypeId,
                'classTypePrice': this.dataForm.classTypePrice,
                'payPrice': this.dataForm.payPrice,
                'discPrice': 0,
                'confPayPrice': this.dataForm.confPayPrice,
                'stayPayPrice': this.dataForm.stayPayPrice,
                'recruitStuRegSaleEntities': this.dataForm.recruitStuRegSaleEntities,
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
        })
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
        console.log(val)
        // if(val == 42 || val == 43){
        //   this.outerSubVisible = false
        // }else{
        //   this.outerSubVisible = true
        // }
      }
    }
  }
</script>

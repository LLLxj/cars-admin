<template>
  <!--业绩修改-->
    <el-dialog  :close-on-click-modal="false" :visible.sync="visible" width="70%" top="20vh">
    <el-form :model="dataForm" :inline="true" ref="dataForm">
      <div style="padding:0 1%">
        <!-- 学员个人信息 -->
        <div class="reg-detail-row">
          <h1>学员个人信息</h1>
          <el-row :gutter="24">
            <el-col :span="6" >
              <div class="span-content">
                身份证号:{{stuInfos.cardId}}
              </div>

            </el-col>

            <el-col :span="6">
              <div class="span-content">
                学员姓名：{{stuInfos.stuName}}
              </div>
            </el-col>
            <el-col :span="6">
              <div class="span-content">
                性别:
                <span v-if="stuInfos.stuSex == 0">女</span>
                <span v-if="stuInfos.stuSex == 1">男</span>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="span-content">
                联系方式:{{stuInfos.stuPhone}}
              </div>
            </el-col>

            <el-col :span="6">
              <div class="span-content">
                年龄:{{stuInfos.stuUserAge}}
              </div>
            </el-col>

            <el-col :span="6">
              <div class="span-content">
                学历:
                <span v-if="stuInfos.educType == 0">本科</span>
                <span v-if="stuInfos.educType == 1">专科</span>
                <span v-if="stuInfos.educType == 2">职高</span>
                <span v-if="stuInfos.educType == 3">初中</span>
                <span v-if="stuInfos.educType == 4">初中以下</span>
                <span v-if="stuInfos.educType == 5">本科以上</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="span-content">
                户籍:{{stuInfos.regAddr}}
              </div>
            </el-col>
            <el-col :span="6">
              <div class="span-content">
                现住地:{{stuInfos.addr}}
              </div>
            </el-col>
            <el-col :span="6">
              <div class="span-content">
                联系人:{{stuInfos.contUserName || '--'}}
              </div>
            </el-col>
            <el-col :span="6">
              <div class="span-content">
                联系人电话:{{stuInfos.contUserPhone || '--'}}
              </div>
            </el-col>
            <el-col :span="6">
              <div class="span-content">
                渠道:{{stuInfos.channeName}}
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- 报读课程 -->
        <div class="reg-detail-row">
          <h1>报读课程</h1>
          <el-row :gutter="24">
            <el-col :span="6">
              <div class="span-content">
                校区:{{stuInfos.schoolName}}
              </div>
            </el-col>
              <!-- schoolName: '',
          classTypeName: '',
          // 课程价格
          classTypePrice: '',
          // 订单价格
          payPrice: '',
          // 未缴
          stayPayPrice: '',
          // 已缴
          confPayPrice: '',
          // 招生老师
          recruitStuRegSaleEntities: [],
          // 电邀老师
          spreadStuRegSaleEntity: {} -->
            <el-col :span="6">
              <div class="span-content">
                报读班型:{{stuInfos.classTypeName}}
              </div>
            </el-col>
            <el-col :span="6">
              <div class="span-content">
                课程价格:{{stuInfos.classTypePrice}}
              </div>
            </el-col>
            <el-col :span="6">
              <div class="span-content">
                订单价格:{{stuInfos.payPrice}}
              </div>
            </el-col>
            <el-col :span="6">
              <div class="span-content">
                未缴金额:{{stuInfos.stayPayPrice}}
              </div>
            </el-col>
            <el-col :span="6">
              <div class="span-content">
                已缴金额:{{stuInfos.confPayPrice}}
              </div>
            </el-col>
            <el-col :span="6">
              <!-- <el-form-item label="电邀老师" prop="spreadStuRegSaleEntity" v-show="!outerSubVisible">
                <el-input v-model="dataForm.dyTeacherName" placeholder="点击选择电邀老师" class="box-input" readonly @click.native="selectTgTeacherHandle()" prefix-icon="el-icon-search"></el-input>
              </el-form-item> -->
              <el-form-item label="电邀老师" prop="dyTeacherId" v-show="!outerSubVisible">
                <tgTeacher v-model="dataForm.dyTeacherId" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <!-- <el-form-item label="招生老师" prop="recruitStuRegSaleEntities">
                <el-tag v-for="teacher in dataForm.recruitStuRegSaleEntities" :key="teacher.userId" @close="handleJobClose(teacher)" closable>
                  {{teacher.userName}}
                </el-tag>
                <el-button class="button-new-tag" size="small" @click="selectJobHandle">+ 老师</el-button>
              </el-form-item> -->
              <el-form-item label="招生老师" prop="recruitStuRegSaleEntities">
                <zsTeacher v-model="dataForm.recruitStuRegSaleEntities" @changeZsTeacher="getZsTeacher"/>
              </el-form-item>
            </el-col>

            <el-col :span="6" v-show="outerSubVisible">
              <el-form-item label="介绍人" prop="nickName">
                <el-input v-model="dataForm.nickName" placeholder="输入介绍人姓名" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="4">
              <div class="span-content">
                电邀老师:{{dyTeacher}}
              </div>
            </el-col>
            <el-col :span="4">
              <div class="span-content">
                招生老师:
                <span v-for="teacher in recruitStuRegSaleEntities" :key="teacher.userName">
                  {{teacher.userName}}
                </span>
              </div>
            </el-col> -->
          </el-row>
        </div>
      </div>
    </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <!-- <el-button v-if="isAuth('stu:reg:payment:save')" type="primary" @click="dataFormSubmit()">确定</el-button> -->
        <el-button type="primary" v-if="isAuth('stu:reg:sale:update')" @click="dataFormSubmit()">确定</el-button>
      </span>

      <teacherPop ref="teacherPop" v-if="teacherPopVisible" @tg-pop-event="callBackTgPop"></teacherPop>
      <zsTeacherPop ref="zsTeacherPop" v-if="zsTeacherPopVisible" @zs-pop-event="callBackZsPop"></zsTeacherPop>
    </el-dialog>
</template>
<script>

  import { regInfo, changeWorkBelongs } from '@/api/reg'
  import teacherPop from '@/views/common-pop/tg-teacher-pop'
  import zsTeacherPop from '@/views/common-pop/zs-teacher-pop'
  import tgTeacher from '@/views/common-select/tg-teacher-all-select'
  import zsTeacher from '@/views/common-select/zs-teacher-all-select'

  export default {
    data () {
      return {
        visible: false,
        selectRegId: '',
        stuInfos: {},
        classInfos: [],
        dataForm: {
          dyTeacherName: '',
          dyTeacherId: '',
          spreadStuRegSaleEntity: [],
          recruitStuRegSaleEntities: [],
          nickName: ''
        },
        outerSubVisible: false,
        // 电邀老师
        dyTeacher: '',
        // 招生老师
        recruitStuRegSaleEntities: [],
        zsTeacherPopVisible: false,
        teacherPopVisible: false
      }
    },
    components: {
        zsTeacherPop, teacherPop, tgTeacher, zsTeacher
    },
    methods: {
      init (id) {
        this.selectRegId = id
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        this.getDataList()
      },
      getDataList () {
        regInfo(this.selectRegId).then(res => {
          if (res.data && res.data.code === 0) {
            // 个人信息
            this.stuInfos = res.data.data.stuRegVo
            if(res.data.data.stuRegVo.channeId === 42 || res.data.data.stuRegVo.channeId === 43) {
              this.outerSubVisible = true
            } else {
              this.outerSubVisible = false
            }
            if (res.data.data.stuRegVo.spreadStuRegSaleEntity !== null) {
              this.dataForm.dyTeacherName = res.data.data.stuRegVo.spreadStuRegSaleEntity.userName
              this.dataForm.dyTeacherId = res.data.data.stuRegVo.spreadStuRegSaleEntity.userId
              this.dataForm.nickName = res.data.data.stuRegVo.nickName
            }
            let zsTeacherList = res.data.data.stuRegVo.recruitStuRegSaleEntities
            zsTeacherList.forEach(item => {
              this.dataForm.recruitStuRegSaleEntities.push(item.userId)
            });
            // this.dataForm.recruitStuRegSaleEntities = res.data.data.stuRegVo.recruitStuRegSaleEntities
            // 招生老师
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
      },
      // 招生老师下拉
      getZsTeacher (val) {
        this.recruitStuRegSaleEntities = []
        let tempDate = this.dataForm.recruitStuRegSaleEntities
        tempDate.forEach(item => {
          let obj = {'userId': item}
          this.recruitStuRegSaleEntities.push(obj)
        });
      },
      // 推广老师弹窗
      selectTgTeacherHandle () {
        this.teacherPopVisible = true
        this.$nextTick(() => {
          this.$refs.teacherPop.init()
        })
      },
      callBackTgPop (userId, userName) {
        this.dataForm.dyTeacherId = userId
        this.dataForm.dyTeacherName = userName
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
      // 提交数据
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            changeWorkBelongs({
              'regId': this.selectRegId,
              'nickName': this.dataForm.nickName,  // 介绍人昵称
              'recruitStuRegSaleEntities': this.recruitStuRegSaleEntities, // 招生老师集合
              'spreadStuRegSaleEntity': { // 推广老师
                'userId': this.dataForm.dyTeacherId,
                'nickName': this.dataForm.nickName
              }
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
      }
    }
  }
</script>
<style scoped>
  .reg-detail-row{
    padding:0 0 15px 0;
  }
 .span-content{
   padding:10px 0;
  }
</style>


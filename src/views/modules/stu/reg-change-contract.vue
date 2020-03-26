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
              <div class="span-content">
                电邀老师:{{dyTeacher}}
              </div>
            </el-col>
            <el-col :span="6">
              <div class="span-content">
                招生老师:<span v-for="teacher in recruitStuRegSaleEntities" :key="teacher.userName">
                  {{teacher.userName}}
                </span>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="span-content">
                介绍人:{{stuInfos.nickName || '--'}}
              </div>
              
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同编号" prop="contractNo">
                <el-input v-model="dataForm.contractNo" placeholder="输入合同编号" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <!-- <el-button v-if="isAuth('stu:reg:payment:save')" type="primary" @click="dataFormSubmit()">确定</el-button> -->
        <el-button type="primary" v-if="isAuth('stu:reg:contract:update')" @click="dataFormSubmit()">确定</el-button>
      </span>

    </el-dialog>
</template>
<script>

  import { regInfo, editContract } from '@/api/reg'

  export default {
    data () {
      return {
        visible: false,
        selectRegId: '',
        stuInfos: {},
        classInfos: [],
        dataForm: {
          contractNo: '',
          contractId: ''
        },
        // 电邀老师
        dyTeacher: '',
        // 招生老师
        recruitStuRegSaleEntities: [],
      }
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
            this.dataForm.contractNo = res.data.data.stuRegVo.contractNo
            this.dataForm.contractId = res.data.data.stuRegVo.contractId
            // 电邀老师
            if(res.data.data.stuRegVo.spreadStuRegSaleEntity !== null){
              this.dyTeacher = res.data.data.stuRegVo.spreadStuRegSaleEntity.userName
            } else {
              this.dyTeacher = '--'
            }
            // 招生老师
            this.recruitStuRegSaleEntities = res.data.data.stuRegVo.recruitStuRegSaleEntities
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
      },
      // 提交数据
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            editContract({
              'regId': this.selectRegId,
              'contractId': this.dataForm.contractId,
              'contractNo': this.dataForm.contractNo
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


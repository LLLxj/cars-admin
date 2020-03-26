<template>
<div>
  <div>
    <el-dialog  :close-on-click-modal="false" :visible.sync="visible" width="80%" top="15vh">
      <div style="padding:0 3%">
        <el-form :model="dataForm" :inline="true" :rules="dataRule" ref="dataForm">
          <!-- 学员个人信息 -->
          <div class="reg-detail-row">
              <h1>学员个人信息</h1>
              <el-row :gutter="24">
                <el-col :span="5">
                 <el-form-item label="学员" prop="stuName">
                    <el-input v-model="dataForm.stuName" style="width:80%" class="box-input" readonly @click.native="selectStuHandle()" prefix-icon="el-icon-search" maxlength="20"></el-input>
                 </el-form-item>
                </el-col>

                  <el-col :span="5"> 
                    <div class="span-content">
                      报读课程:{{stuInfo.classTypeName || '--'}}
                    </div>
                  </el-col>

                  <el-col :span="5">
                    <div class="span-content">
                      课程价格:{{stuInfo.classTypePrice || '--'}}
                    </div>  
                  </el-col>

                  <el-col :span="5">
                    <div class="span-content">
                      订单金额:{{stuInfo.payPrice || '--'}}
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div class="span-content">
                      优惠金额:{{stuInfo.discPrice || '--'}}
                    </div>
                  </el-col>      
              </el-row>

                <el-row :gutter="24">

                  <el-col :span="5">
                    <div class="span-content">
                      已缴金额:{{stuInfo.confPayPrice || '--'}}
                    </div>
                  </el-col>
                  <el-col :span="5">
                    <div class="span-content">
                      需缴金额:{{stuInfo.stayPayPrice || '--'}}
                    </div>
                  </el-col>
                  
                  
                  <el-col :span="5" v-if="outerSubVisible">
                    <div class="span-content">
                      <div>
                        电邀老师:
                        <span v-if="stuInfo.spreadStuRegSaleEntity">{{stuInfo.spreadStuRegSaleEntity.userName}}</span>
                        <span v-else>--</span>
                        <!-- <span>{{dyTeacher || '--'}}</span> -->
                      </div>
                    </div>
                  </el-col> 
                  <el-col :span="5">
                    <div class="span-content">
                      <div>
                        招生老师:
                        <span v-for="teacher in stuInfo.recruitStuRegSaleEntities" :key="teacher.userName">
                        {{ teacher.userName || '--'}}
                        </span>
                      </div>    
                    </div>  
                  </el-col>
                  <el-col :span="5" v-if="!outerSubVisible">
                    <div class="span-content">
                        介绍人:{{stuInfo.nickName || '--'}}
                    </div>
                  </el-col>

                  <el-col :span="4">
                    <div class="span-content">
                      <div>
                        合同编号:
                        <!-- <span>{{stuInfo.spreadStuRegSaleEntity.userName}}</span> -->
                        <span>{{stuInfo.contractNo || '--'}}</span>
                      </div>
                    </div>
                  </el-col>
                  
                </el-row>

                

          </div>
          <!-- 本次缴费 -->
          <div class="reg-detail-row">
              <h1>申请优惠</h1>
              <el-row :gutter="24" style="background:#FAFBFD;height:50px;line-height:50px;">
                  <el-col :span="5">
                    <span>优惠单号:</span>
                  </el-col>
                  <el-col :span="5">
                      <span>本次优惠金额</span>
                  </el-col>
                  <el-col :span="5">
                      <span>钉钉单号</span>
                  </el-col>
                  <el-col :span="5">
                      <span>备注</span>
                  </el-col>

                  <el-col :span="5">
                      <span>{{offNo}}</span>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item prop="offPrice" class="tabel-input">
                      <el-input-number v-model="dataForm.offPrice" class="box-input" controls-position="right"></el-input-number>
                    </el-form-item> 
                  </el-col>

                  <el-col :span="5">
                      <el-form-item prop="ddingCode" class="tabel-input">
                        <el-input v-model="dataForm.ddingCode" class="box-input"  placeholder="钉钉单号"></el-input>
                      </el-form-item> 
                  </el-col>

                  <el-col :span="5">
                      <el-form-item prop="remark" class="tabel-input">
                          <el-input type="textarea" v-model="dataForm.remark" maxlength="50" class="box-remark" ></el-input>
                      </el-form-item> 
                  </el-col>
                
              </el-row>
              
          </div>
        </el-form>
      </div>
    
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button v-if="isAuth('stu:reg:off:save')" type="primary" @click="dataFormSubmit()">确定</el-button>
      </span>
    </el-dialog>
  </div>
  <!-- 弹窗部分 -->
  <regPop ref="regPop" v-if="regPopVisible" @benefitRegPop-pop-event="callBackRegPop"></regPop>
  <firstBenefit ref="firstBenefit" v-if="firstBenefitVisible"></firstBenefit>
  
</div>
</template>
<style>
  /* .box-remark {
    width:250%;s
  } */
</style>
<script>

  import regPop from '@/views/common-pop/benefit-reg-pop'
  import payStyle from '@/views/common-select/payStyle-select'
  import payType from '@/views/common-select/payType-select'
  import firstBenefit from './benefit-first-add'
  import { getBenefitInfo, benefitSave, putBenefitNo, checkBenfitDing } from '@/api/benefit'

  export default {
    data () {
      var checkBenefitPrice = (rule, value, callback) => {
        if(value < 1){
          callback('优惠金额错误')
        } else {
          callback()
        }
      }
      var checkDingCode = (rule, value, callback) => {
        if(value){
          checkBenfitDing(this.dataForm.ddingCode).then(res => {
            if(res.data && res.data.code === 0) {
              callback()
            } else {
              callback(new Error('钉钉单号有误'))
            }
          }).catch(err => {
            console.log(err)
          })
        }
      }
      return {
        visible: false,
        regPopVisible: false,
        dataForm: {
          stuName: '',
          regId: '',
          offPrice: '',
          ddingCode: '',
          remark: '',
        },
        dataList: [],
        // 个人信息
        stuInfo: [],
        firstPayOrNot: false,
        selectRowData:[],
        noSelectPayStyle: true,
        noSelectType: true,
        firstBenefitVisible: false,
        // 外部介绍人
        outerSubVisible: true,
        // 报名表id
        selectRegId: '',
        // offNo
        offNo: '',
        //电邀老师
        dyTeacher: '',
        dataRule: {
          offPrice: [
            { required: true, message: '优惠金额不能为空', trigger: 'blur' },
            { validator: checkBenefitPrice, trigger: 'blur' }
          ],
          stuName: [
            { required: true, message: '姓名不能为空', trigger: 'change' },
          ]

          
          // ddingCode: [
          //   { required: false, message: '', trigger: 'blur' },
          //   { validator: checkDingCode, trigger: 'blur' }
          // ]
        }
      }
    },
    components:{
      regPop, payStyle, payType
    },
    methods: {
      init () {
        // 获取regId
        // this.selectRegId = data.regId
        this.stuInfo = []
        this.visible = true
        this.selectRowData = []
        this.putOffNo()
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      },
      putOffNo () {
        putBenefitNo().then(res => {
          if(res.data && res.data.code === 0){
            this.offNo = res.data.data
          }else{
            this.$message.error(res.data.msg)   
          }
        }).catch(err => {
            console.log(err)
        })
      },
      //   报名表弹窗
      selectStuHandle () {
        this.regPopVisible = true
        this.$nextTick(() => {
          this.$refs.regPop.init()
        })
      },
    //   报名表弹窗回调
      callBackRegPop (regId,regNo,data) {
        this.dataForm.regId = data.regId
        this.dataForm.stuName = data.stuName
        this.stuInfo = data
        if(this.stuInfo.channeId == 42 || this.stuInfo.channeId == 43){
          this.outerSubVisible = false
        }else{
          this.outerSubVisible = true
        }
        if(data.spreadStuRegSaleEntity !== null){
          this.dyTeacher = data.spreadStuRegSaleEntity.userName
        } else {
          this.dyTeacher = '--'
        }
        
      },
      // 新增优惠
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            benefitSave({
             stuRegPaymentOffEntity: {
              'regId': this.dataForm.regId,
              'offNo': this.offNo,
              'offPrice': this.dataForm.offPrice,
              'ddingCode': this.dataForm.ddingCode,
              'remark': this.dataForm.remark
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
                    this.dataForm.regId = ''
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
  .table-head{
    text-align:center;
  }
  .tabel-input{
    margin-top:10px;
  }
</style>


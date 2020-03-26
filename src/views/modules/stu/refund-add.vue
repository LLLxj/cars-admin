<template>
<div>
  <div>
    <el-dialog  :close-on-click-modal="false" :visible.sync="visible" width="80%" top="15vh">
      <div style="padding:0 3%">
        
          <!-- 学员个人信息 -->
          <div class="reg-detail-row">
              <h1>学员个人信息</h1>
              <el-row :gutter="24">
                <el-col :span="5">
                  <div class="span-content">
                    学员姓名:{{stuInfo.stuName}}
                  </div>
                </el-col>

                  <el-col :span="5"> 
                    <div class="span-content">
                      报读课程:{{stuInfo.classTypeName}}
                    </div>
                  </el-col>

                  <el-col :span="5">
                    <div class="span-content">
                      课程价格:{{stuInfo.classTypePrice}}
                    </div>  
                  </el-col>

                  <el-col :span="5">
                      <div class="span-content">
                          订单金额:{{stuInfo.payPrice || 0}}
                      </div>
                  </el-col>
                  <el-col :span="4">
                      <div class="span-content">
                          优惠金额:{{stuInfo.discPrice || 0}}
                      </div>
                  </el-col>

                  <el-col :span="5">
                      <div class="span-content">
                        已缴金额:{{stuInfo.confPayPrice || 0}}
                      </div>
                  </el-col>

                  <el-col :span="5">
                    <div class="span-content">
                      需缴金额:{{stuInfo.stayPayPrice || 0}}
                    </div>
                  </el-col>

                  
                  <el-col :span="5" v-if="outerSubVisible">
                      <div class="span-content">
                        <div>
                          电邀老师:
                          <!-- <span>{{stuInfo.spreadStuRegSaleEntity.userName}}</span> -->
                          <span>{{dyTeacher}}</span>
                        </div>
                      </div>
                  </el-col>

                    <el-col :span="5">
                      <div class="span-content">
                        <div>
                          招生老师:
                          <span v-for="teacher in stuInfo.recruitStuRegSaleEntities" :key="teacher.userName">
                          {{ teacher.userName }}
                          </span>
                        </div>    
                      </div>  
                  </el-col>


                   <el-col :span="4" v-if="!outerSubVisible">
                      <div class="span-content">
                        <div>
                          介绍人:
                          <!-- <span>{{stuInfo.spreadStuRegSaleEntity.userName}}</span> -->
                          <span>{{stuInfo.nickName || '--'}}</span>
                        </div>
                      </div>
                  </el-col>

                  <el-col :span="4">
                    <div class="span-content">
                      <div>
                        合同编号:
                        <!-- <span>{{stuInfo.spreadStuRegSaleEntity.userName}}</span> -->
                        <span>{{stuInfo.contractNo}}</span>
                      </div>
                    </div>
                  </el-col>

                </el-row>

          </div>
          <!-- 缴费记录 -->
          <div class="reg-detail-row">
              <h1>缴费记录</h1>
              <el-row :gutter="24" v-for="item in dataListPayment" :key="item.paymentId" :value="item.paymentId">
                <el-col :span="4" >
                  <div class="span-content overLength" :title="item.paymentNo">
                    缴费单号:{{item.paymentNo}}
                  </div>
                </el-col>
                <el-col :span="3">
                  <div class="span-content overLength" :title="item.payPrice">
                  缴费金额：{{item.payPrice}}
                  </div> 
                </el-col>
                
                <el-col :span="3">
                  <div class="span-content">
                  缴费类型：
                    <span v-if="item.paymentType === 1">定金</span>
                    <span v-if="item.paymentType === 2">学费</span>
                  </div>  
                </el-col>
                <el-col :span="3">
                  <div class="span-content overLength" :title="item.payTypeName">
                  缴费方式：{{item.payTypeName}}
                  </div>  
                </el-col>
                <el-col :span="4"> 
                  <div class="span-content overLength" :title="item.receiptNo">
                  收据单号: {{item.receiptNo}}
                  </div>
                </el-col>
                <el-col :span="4"> 
                  <div class="span-content overLength" :title="item.payTime">
                  缴费时间: {{item.payTime || '--'}}
                  </div>
                </el-col>
                <el-col :span="3">
                  <div class="span-content overLength" :title="item.remark">
                  备注：{{item.remark || '--'}}
                  </div>  
                </el-col>
              </el-row>
          </div>
          <!-- 优惠记录 -->
          <div class="reg-detail-row">
              <h1>优惠记录</h1>
              <el-row :gutter="24" v-for="item in dataList" :key="item.paymentId" :value="item.paymentId">
                <el-col :span="5" >
                  <div class="span-content overLength" :title="item.offNo">
                    优惠单号:{{item.offNo}}
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="span-content overLength" :title="item.offPrice">
                  优惠金额：{{item.offPrice}}
                  </div> 
                </el-col>
                <el-col :span="5"> 
                  <div class="span-content overLength" :title="item.ddingCode">
                  钉钉单号: {{item.ddingCode || '--'}}
                  </div>
                </el-col>
                <!-- <el-col :span="5">
                  <div class="span-content">
                  缴费类型：
                    <span v-if="item.paymentType === 1">定金</span>
                    <span v-if="item.paymentType === 2">学费</span>
                  </div>  
                </el-col>
                <el-col :span="5">
                  <div class="span-content">
                  缴费方式：{{item.payTypeName}}
                  </div>  
                </el-col>-->
                <el-col :span="5">
                  <div class="span-content overLength" :title="item.remark">
                  备注：{{item.remark || '--'}}
                  </div>  
                </el-col> 
                <el-col :span="4">
                  <div class="span-content overLength" :title="item.reason">
                  审批理由：{{item.reason || '--'}}
                  </div>  
                </el-col> 
              </el-row>
              <el-row :gutter="24" v-if="dataList.length == 0">
                <el-col :span="5" >
                  <div class="span-content">
                    优惠单号:--
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="span-content">
                  优惠金额：--
                  </div> 
                </el-col>
                <el-col :span="5"> 
                  <div class="span-content">
                  钉钉单号: --
                  </div>
                </el-col>
                <!-- <el-col :span="5">
                  <div class="span-content">
                  缴费类型：
                    <span v-if="item.paymentType === 1">定金</span>
                    <span v-if="item.paymentType === 2">学费</span>
                  </div>  
                </el-col>
                <el-col :span="5">
                  <div class="span-content">
                  缴费方式：{{item.payTypeName}}
                  </div>  
                </el-col>-->
                <el-col :span="5">
                  <div class="span-content">
                  备注：--
                  </div>  
                </el-col> 
                <el-col :span="4"> 
                  <div class="span-content">
                  审批理由: --
                  </div>
                </el-col>
              </el-row>
          </div>
          <!-- 本次退费 -->
          <div class="reg-detail-row">
              <h1>申请退款</h1>
              <el-row :gutter="24" style="background:#FAFBFD;height:50px;line-height:50px;">
                  <el-col :span="5">
                    <span>退款单号:</span>
                  </el-col>
                  <el-col :span="5">
                      <span>本次退款金额</span>
                  </el-col>
                  <el-col :span="5">
                      <span>退款类型</span>
                  </el-col>
                  <el-col :span="5">
                      <span>钉钉单号</span>
                  </el-col>
                  <el-col :span="4">
                    <span>备注</span>
                  </el-col>

                  <el-col :span="5">
                      <span>{{refundNo}}</span>
                  </el-col>
                <el-form :model="dataForm" :inline="true" ref="dataForm" :rules="dataRule">
                  <el-col :span="5">
                    <el-form-item prop="refundPrice" class="tabel-input">
                      <el-input-number v-model="dataForm.refundPrice" class="box-input" controls-position="right"></el-input-number>
                    </el-form-item> 
                  </el-col>

                  <el-col :span="5">
                    <el-form-item prop="refundType" class="tabel-input">
                      <refundType v-model="dataForm.refundType" :clearable="noSelectRefundStyle"></refundType>
                    </el-form-item>
                  </el-col>

                  <el-col :span="5">
                      <el-form-item prop="ddingCode" class="tabel-input">
                        <el-input v-model="dataForm.ddingCode" class="box-input"  placeholder="钉钉单号"></el-input>
                      </el-form-item> 
                  </el-col>

                  <el-col :span="4">
                      <el-form-item prop="remark" class="tabel-input">
                          <el-input type="textarea" v-model="dataForm.remark" maxlength="50" class="box-remark" ></el-input>
                      </el-form-item> 
                  </el-col>
                </el-form>
              </el-row>
              
          </div>
        
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button v-if="isAuth('stu:reg:refund:save')" type="primary" @click="dataFormSubmit()">确定</el-button>
      </span>
    </el-dialog>
  </div>
  <!-- 弹窗部分 -->
  <regPop ref="regPop" v-if="regPopVisible" @regPop-pop-event="callBackRegPop"></regPop>
  
</div>
</template>
<script>

  import regPop from '@/views/common-pop/reg-pop'
  import refundType from '@/views/common-select/refundType-select'
  import { refundInfo, getRefundNo, saveRefund, checkRefundDing } from '@/api/refund'

  export default {
    data () {
      var validateRefundPrice = (rule, value, callback) => {
        if(value >= 1){
          callback()
        }
        if(value > this.stuInfo.confPayPrice){
          callback(new Error('退费金额错误'))
        }
        if(value < 1) {
          callback(new Error('退费金额错误'))
        }
      }
      var validateRefundDing = (rule, value, callback) => {
        if(value) {
          checkRefundDing(this.dataForm.ddingCode).then(res => {
            if(res.data && res.data.code === 0) {
              callback()
            } else {
              callback(new Error('钉钉单号已存在'))
            }
          })
        }
      }
      return {
        visible: false,
        regPopVisible: false,
        dataForm: {
          refundPrice: '',
          ddingCode: '',
          remark: '',
          refundType: '',
        },
        dataList: [],
        // 个人信息
        stuInfo: [],
        // 缴费记录
        dataListPayment: [],
        firstPayOrNot: false,
        selectRowData:[],
        noSelectRefundStyle: true,
        // 报名表id
        selectRegId: '',
        // 退费单No
        refundNo: '',
        //电邀老师
        dyTeacher: '',
        // 外部介绍人
        outerSubVisible: false,
        dataRule: {
          refundPrice: [
            { required: true, message: '退费金额不能为空', trigger: 'blur' },
            { validator: validateRefundPrice, trigger: 'blur' }
          ],
          ddingCode: [
            { required: true, message: '钉钉单号不能为空', trigger: 'blur' },
            { validator: validateRefundDing, trigger: 'blur' }
          ]
        }
      }
    },
    components:{
      regPop, refundType
    },
    methods: {
      init (data) {
        // 获取regId
        this.selectRegId = data
        this.visible = true
        this.selectRowData = []
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        this.putRefundNo()
        this.getRefundData()
      },
      putRefundNo () {
        getRefundNo().then(res => {
          if(res.data && res.data.code === 0){
            this.refundNo = res.data.data
          }else{
            this.$message.error(res.data.msg)   
          }
        }).catch(err => {
            console.log(err)
        })
      },
      // 获取缴费单信息
      getRefundData () {
        refundInfo(this.selectRegId).then(res => {
          if(res.data && res.data.code === 0){
            this.dataList = res.data.data.stuRegPaymentOffEntities
            this.stuInfo = res.data.data.stuRegCallVo
            if(this.stuInfo.channeId == 42 || this.stuInfo.channeId == 43){
              this.outerSubVisible = false
            }else{
              this.outerSubVisible = true
            }
            var tempDate = res.data.data.stuRegPaymentEntities
            for(var i in tempDate){
              tempDate[i].payTime = tempDate[i].payTime.substring(0,10)
            }
            this.dataListPayment = tempDate
            if(res.data.data.stuRegCallVo.spreadStuRegSaleEntity !== null){
              this.dyTeacher = res.data.data.stuRegCallVo.spreadStuRegSaleEntity.userName
            } else {
              this.dyTeacher = '--'
            }
          }else{
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
      },
      // 退费操作
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            saveRefund({
             stuRegRefundEntity: {
                'regId': this.selectRegId,
                'refundNo': this.refundNo,
                'refundPrice': this.dataForm.refundPrice,
                'ddingCode': this.dataForm.ddingCode,
                'refundType': this.dataForm.refundType,
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
  .overLength{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
</style>


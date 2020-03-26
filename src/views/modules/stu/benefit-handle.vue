<template>
<div>
  <div>
    <el-dialog  :close-on-click-modal="false" :visible.sync="visible" width="80%" top="15vh">
      <div style="padding:0 3%">
        <el-form :model="dataForm" :inline="true" ref="dataForm">
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
                        <span>{{dyTeacher || '--'}}</span>
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
                
                  <el-col :span="5" v-if="!outerSubVisible">
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
          <!-- 优惠记录 -->
          <div class="reg-detail-row">
              <h1>优惠记录</h1>
              <el-row :gutter="24" v-for="item in dataList" :key="item.offId" :value="item.offId">
                <el-col :span="5" >
                  <div class="span-content">
                    优惠单号:{{item.offNo}}
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="span-content">
                    优惠金额：{{item.offPrice}}
                  </div> 
                </el-col>
                <el-col :span="5"> 
                  <div class="span-content">
                    钉钉单号: {{item.ddingCode || '--'}}
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="span-content">
                  备注：{{item.remark || '--'}}
                  </div>  
                </el-col>
              </el-row>
              <el-row :gutter="24" v-if="dataList == null">
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
                <el-col :span="5">
                  <div class="span-content">
                  备注：--
                  </div>  
                </el-col>
              </el-row>
          </div>
          <!-- 本次缴费 -->
          <div class="reg-detail-row">
              <h1>本次优惠</h1>
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
                <el-col :span="4">
                    <span>审核理由</span>
                </el-col>
                <el-col :span="5">
                    <span>{{benefitRecent.offNo}}</span> 
                </el-col>
                <el-col :span="5">
                    <span>{{benefitRecent.offPrice}}</span> 
                </el-col>
                <el-col :span="5">
                    <span>{{benefitRecent.ddingCode || '--'}}</span> 
                </el-col>
                <el-col :span="5">
                  <span>{{benefitRecent.remark ||'--'}}</span> 
                </el-col>
                <el-form :model="dataForm" :inline="true" ref="dataForm">
                  <el-col :span="4">
                    <el-form-item prop="reason" class="tabel-input">
                      <el-input type="textarea" v-model="dataForm.reason" class="box-remark"  placeholder="审核理由"></el-input>
                    </el-form-item> 
                  </el-col>
                </el-form>
              </el-row>
          </div>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button v-if="isAuth('stu:reg:off:update')" @click="refuse()">拒绝优惠</el-button>
        <el-button v-if="isAuth('stu:reg:off:update')" type="primary" @click="accept()">同意优惠</el-button>
      </span>
    </el-dialog>
  </div>
  <!-- 弹窗部分 -->
  <regPop ref="regPop" v-if="regPopVisible" @regPop-pop-event="callBackRegPop"></regPop>
  
</div>
</template>
<style>
  /* .box-remark {
    width:250%;s
  } */
</style>
<script>

  import regPop from '@/views/common-pop/reg-pop'
  import payStyle from '@/views/common-select/payStyle-select'
  import payType from '@/views/common-select/payType-select'
  import { getBenefitInfo, benefitList, refuseBenefit, acceptBenefit } from '@/api/benefit'

  export default {
    data () {
      return {
        visible: false,
        regPopVisible: false,
        dataForm: {
          thisPayPrice: '',
          remark: '',
          payStyle: '',
          payType: '',
          payTime: '',
          reason: ''
        },
        dataList: [],
        // 个人信息
        stuInfo: [],
        // 本次优惠
        benefitRecent: [],
        firstPayOrNot: false,
        selectRowData:[],
        noSelectPayStyle: true,
        noSelectType: true,
        // 外部介绍人
        outerSubVisible: true,
        // 报名表id
        selectRegId: '',
        // 新缴费的offNo
        offNo: '',
        offId: '',
        //电邀老师
        dyTeacher: '',
      }
    },
    components:{
      regPop, payStyle, payType
    },
    methods: {
      init (data) {
        // 获取regId
        this.selectRegId = data.regId
        // 获取offNo
        this.offNo = data.offNo
        // 获取paymentId
        this.offId = data.offId
        this.visible = true
        this.selectRowData = []
        this.resetForm()
        this.getPaymentData()
        this.getBenefitRecent()
      },
      resetForm () {
        this.dataForm = {
          thisPayPrice: '',
          remark: '',
          payStyle: '',
          payType: '',
          payTime: '',
          reason: ''
        }
      },
      // 获取优惠单信息
      getPaymentData () {
        getBenefitInfo(this.selectRegId).then(res => {
          if(res.data && res.data.code === 0){
            // var tempDate = res.data.data.stuRegPaymentEntities
            var tempDate = res.data.data.stuRegPaymentOffEntities
            // for(var i in tempDate){
            //   tempDate[i].payTime = tempDate[i].payTime.substring(0,10)
            // }
            this.dataList = tempDate
            this.stuInfo = res.data.data.stuRegCallVo
            if(this.stuInfo.channeId == 42 || this.stuInfo.channeId == 43){
              this.outerSubVisible = false
            }else{
              this.outerSubVisible = true
            }
            if(res.data.data.stuRegCallVo.spreadStuRegSaleEntity !== null){
              this.dyTeacher = res.data.data.stuRegCallVo.spreadStuRegSaleEntity.userName
            }else {
              this.dyTeacher = '--'
            }
            
          }else{
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
      },
      //获取本次缴费信息
      getBenefitRecent () {
        benefitList({
          'offNo': this.offNo
        }).then(res => {
          this.benefitRecent = res.data.data.list[0]
        }).catch(err => {
          console.log(err)
        })
      },
      // 通过操作
      accept () {
        this.$confirm(`确定通过?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          acceptPayment(this.paymentId).then(res => {
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
          })
        }).catch(err => {
          console.log(err)
        })
      },
      // 收款失败操作
      refuse () {
        this.$confirm(`确定收款失败?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          refusePayment(this.paymentId).then(res => {
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
          })
        }).catch(err => {
          console.log(err)
        })
      },
      // 拒绝优惠
      refuse () {
        this.$confirm(`确定拒绝优惠?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          refuseBenefit({
            'offId': this.offId,
            'reason': this.dataForm.reason
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
          })
        })
      },
      // 同意优惠
      accept () {
        this.$confirm(`确定同意优惠?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          acceptBenefit({
            'offId': this.offId,
            'reason': this.dataForm.reason
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
          })
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


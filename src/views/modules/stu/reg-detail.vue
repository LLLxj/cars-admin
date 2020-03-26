<template>
    
      <div >
        <!-- 学员个人信息 -->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="box-card-title">学员个人信息</span>
          </div>
          <el-row :gutter="10">
            <el-col :xl="4" :lg="6" :md="8">
              <div class="span-content">
                身份证号：{{stuInfos.cardId}}
              </div>
            </el-col>

            <el-col :xl="4" :lg="6" :md="8" >
              <div class="span-content">
                学员姓名：{{stuInfos.stuName}}
              </div> 
            </el-col>
            <el-col :xl="4" :lg="6" :md="8"> 
              <div class="span-content">
                性别：
                <span v-if="stuInfos.stuSex == 0">女</span>
                <span v-if="stuInfos.stuSex == 1">男</span>
              </div>
            </el-col>

            <el-col :xl="4" :lg="6" :md="8">
              <div class="span-content overLength">
                联系方式：{{stuInfos.stuPhone}}
              </div>  
            </el-col>

            <el-col :xl="4" :lg="6" :md="8">
              <div class="span-content">
                年龄：{{stuInfos.stuUserAge}}
              </div>
            </el-col>
 
            <el-col :xl="4" :lg="6" :md="8">
              <div class="span-content">
                学历：
                <span v-if="stuInfos.educType == 0">本科</span>
                <span v-if="stuInfos.educType == 1">专科</span>
                <span v-if="stuInfos.educType == 2">职高</span>
                <span v-if="stuInfos.educType == 3">初中</span>
                <span v-if="stuInfos.educType == 4">初中以下</span>
                <span v-if="stuInfos.educType == 5">本科以上</span>
              </div>
            </el-col>
            <el-col :xl="4" :lg="6" :md="8">
              <div class="span-content">
                户籍：{{stuInfos.regAddr}}
              </div>
            </el-col>
            <el-col :xl="4" :lg="6" :md="8">
              <div class="span-content">
                现住地：{{stuInfos.addr}}
              </div>
            </el-col>
            <el-col :xl="4" :lg="6" :md="8">
              <div class="span-content">
                联系人：{{stuInfos.contUserName || '--'}}
              </div>
            </el-col>
            <el-col :xl="4" :lg="6" :md="8">
              <div class="span-content overLength">
                联系人电话：{{stuInfos.contUserPhone || '--'}}
              </div>
            </el-col>
            <el-col :xl="4" :lg="6" :md="8">
              <div class="span-content overLength">
                联系人2：{{stuInfos.secondContUserName || '--'}}
              </div>
            </el-col>
            <el-col :xl="4" :lg="6" :md="8">
              <div class="span-content overLength">
                联系人2电话：{{stuInfos.secondContUserPhone || '--'}}
              </div>
            </el-col>
          </el-row>
        </el-card>
        <!-- 报读课程 -->
        <el-card class="box-card box-margin">
          <div slot="header" class="clearfix">
            <span class="box-card-title">报读课程</span>
          </div>
          <!-- <div> -->
            <el-row :gutter="10">
              <el-col :xl="4" :lg="6" :md="8">
                <div class="span-content">
                  校区：{{stuInfos.schoolName}}
                </div>
              </el-col>
              <el-col :xl="4" :lg="6" :md="8">
                <div class="span-content">
                  报读班型：{{stuInfos.classTypeName}}
                </div>
              </el-col>
              <el-col :xl="4" :lg="6" :md="8">
                <div class="span-content">
                  课程价格：{{stuInfos.classTypePrice}}
                </div>
              </el-col>
              <el-col :xl="4" :lg="6" :md="8">
                <div class="span-content">
                  订单价格：{{stuInfos.payPrice}}
                </div>
              </el-col>
              <el-col :xl="4" :lg="6" :md="8">
                <div class="span-content">
                  未缴金额：{{stuInfos.stayPayPrice}}
                </div>
              </el-col>
              <el-col :xl="4" :lg="6" :md="8">
                <div class="span-content">
                  已缴金额：{{stuInfos.confPayPrice}}
                </div>
              </el-col>
              <el-col :xl="4" :lg="6" :md="8" v-if="outerSubVisible">
                <div class="span-content">
                  电邀老师：{{dyTeacher || '--'}}
                </div>
              </el-col>
              <el-col :xl="4" :lg="6" :md="8">
                <div class="span-content">
                  招生老师：
                  <span v-for="teacher in recruitStuRegSaleEntities" :key="teacher.userName">
                    {{teacher.userName}}
                  </span>
                </div>
              </el-col>
              <el-col :xl="4" :lg="6" :md="8" v-if="!outerSubVisible">
                <div class="span-content">
                  介绍人：{{stuInfos.nickName || '--'}}
                </div>
              </el-col>

              <el-col :xl="4" :lg="6" :md="8">
                <div class="span-content">
                  合同编号：{{stuInfos.contractNo || '--'}}
                </div>
              </el-col>

              <el-col :xl="4" :lg="6" :md="8">
                <div class="span-content">
                  渠道：{{stuInfos.channeName}}
                </div>
              </el-col>
            </el-row>
          <!-- </div> -->
        </el-card>
        <!-- 优惠信息 -->
        <el-card class="box-card box-margin">
          <div slot="header" class="clearfix">
            <span class="box-card-title">优惠信息</span>
          </div>
          <el-row :gutter="24" v-for="discInfo in stuRegPaymentOffEntities" :key="discInfo.offId">
            <el-col :span="4">
              <div class="span-content overLength" :title="discInfo.offNo">
                优惠单号：{{discInfo.offNo}}
              </div>
            </el-col>

            <el-col :span="4">
              <div class="span-content overLength" :title="discInfo.offPrice">
                优惠金额：{{discInfo.offPrice}}
              </div> 
            </el-col>
            <el-col :span="4"> 
              <div class="span-content overLength" :title="discInfo.ddingCode">
                钉钉单号：{{discInfo.ddingCode || '--'}}
              </div>
            </el-col>

            <el-col :span="4">
              <div class="span-content overLength" :title="discInfo.createTime">
                申请时间：{{discInfo.createTime || '--'}}
              </div>  
            </el-col>

            <el-col :span="4">
              <div class="span-content overLength" :title="discInfo.remark">
                备注：{{discInfo.remark || '--'}}
              </div>  
            </el-col>

            
            <el-col :span="4">
              <div class="span-content overLength" :title="discInfo.reason">
                审批理由：{{discInfo.reason || '--'}}
              </div> 
            </el-col>

          </el-row>
          <el-row :gutter="24" v-if="stuRegPaymentOffEntities.length === 0">
            <el-col :span="4">
              <div class="span-content">
                优惠单号：--
              </div>
            </el-col>

            <el-col :span="4">
              <div class="span-content">
                优惠金额：--
              </div> 
            </el-col>
            <el-col :span="4"> 
              <div class="span-content">
                钉钉单号：--
              </div>
            </el-col>

            <el-col :span="4">
              <div class="span-content">
                申请时间：--
              </div>  
            </el-col>

            <el-col :span="4">
              <div class="span-content">
                备注：--
              </div>  
            </el-col>

            <el-col :span="4">
              <div class="span-content">
                审批理由：--
              </div>  
            </el-col>

          </el-row>
        </el-card>
        <!-- 缴费记录 -->
        <el-card class="box-card box-margin">
          <div slot="header" class="clearfix">
            <span class="box-card-title">缴费记录</span>
          </div>
          <el-row :gutter="24" v-if="stuRegPaymentEntities.length === 0">
             <el-col :span="4" >
              <div class="span-content">
                缴费单号：--
              </div>
            </el-col>
            <el-col :span="3">
              <div class="span-content">
                缴费金额：--
              </div> 
            </el-col>
            
            <el-col :span="3">
              <div class="span-content">
                <!-- 付款方式 -->
                缴费方式：--
              </div>  
            </el-col>
            <el-col :span="3">
              <div class="span-content">
                <!-- 定金/学费 -->
                缴费类型：--
              </div>  
            </el-col>
            <el-col :span="3">
              <div class="span-content">
                收据单号：--
              </div>  
            </el-col>
            <el-col :span="3"> 
              <div class="span-content">
                缴费时间：--
              </div>
            </el-col>
            <el-col :span="3">
              <div class="span-content">
                备注：--
              </div>  
            </el-col>
          </el-row>
          <el-row :gutter="24" v-for="paymentInfo in stuRegPaymentEntities" :key="paymentInfo.paymentId">
            <el-col :span="4" >
              <div class="span-content overLength" :title="paymentInfo.paymentNo">
                缴费单号：{{paymentInfo.paymentNo}}
              </div>
            </el-col>
            <el-col :span="3">
              <div class="span-content overLength" :title="paymentInfo.paymentPayPrice">
                缴费金额：{{paymentInfo.paymentPayPrice || 0}}
              </div> 
            </el-col>
            
            <el-col :span="3">
              <div class="span-content overLength" :title="paymentInfo.payTypeName">
                <!-- 付款方式 -->
                缴费方式：{{paymentInfo.payTypeName}}
              </div>  
            </el-col>
            <el-col :span="3">
              <div class="span-content overLength">
                <!-- 定金/学费 -->
                缴费类型：{{paymentInfo.paymentType == 1 ? '定金' : '学费' }}
              </div>  
            </el-col>
            <el-col :span="3">
              <div class="span-content overLength" :title="paymentInfo.receiptNo">
                <!-- 定金/学费 -->
                收据单号：{{paymentInfo.receiptNo }}
              </div>  
            </el-col>
            <el-col :span="3"> 
              <div class="span-content overLength" :title="paymentInfo.payTime">
                缴费时间：{{paymentInfo.payTime}}
              </div>
            </el-col>
            <el-col :span="3">
              <div class="span-content overLength" :title="paymentInfo.remark">
                备注：{{paymentInfo.remark || '--'}}
              </div>  
            </el-col>
          </el-row>
        </el-card>
        <!-- 退费记录 -->
        <el-card class="box-card box-margin">
          <div slot="header" class="clearfix">
            <span class="box-card-title">退费记录</span>
          </div>
          <el-row :gutter="24" v-if="stuRegRefundEntities.length === 0">
            <el-col :span="4" >
              <div class="span-content">
                退费单号：--
              </div>
            </el-col>
            <el-col :span="4">
              <div class="span-content">
                退费金额：--
              </div> 
            </el-col>
            <el-col :span="4"> 
              <div class="span-content">
                钉钉单号：--
              </div>
            </el-col>
            <el-col :span="4"> 
              <div class="span-content">
                退费时间：--
              </div>
            </el-col>
            <el-col :span="4">
              <div class="span-content">
                退费类型：--
              </div>  
            </el-col>
            <el-col :span="4">
              <div class="span-content">
                备注：--
              </div>  
            </el-col>
          </el-row>
          <el-row :gutter="24" v-for="refundInfo in stuRegRefundEntities" :key="refundInfo.refundId">
            <el-col :span="4" >
              <div class="span-content overLength" :title="refundInfo.refundNo">
                退费单号：{{refundInfo.refundNo}}
              </div>
            </el-col>
            <el-col :span="4">
              <div class="span-content overLength" :title="refundInfo.refundPrice">
                退费金额：{{refundInfo.refundPrice}}
              </div> 
            </el-col>
            <el-col :span="4"> 
              <div class="span-content overLength" :title="refundInfo.createTime">
                钉钉单号：{{refundInfo.ddingCode || '--'}}
              </div>
            </el-col>
            <el-col :span="4"> 
              <div class="span-content overLength" :title="refundInfo.createTime">
                退费时间：{{refundInfo.createTime || '--'}}
              </div>
            </el-col>
            <el-col :span="4">
              <div class="span-content overLength">
                退费类型：
                <span v-if="refundInfo.refundType == 1">退费退学</span>
                <span v-if="refundInfo.refundType == 2">退费不退学</span>
              </div>  
            </el-col>
            <el-col :span="4" >
              <div class="span-content overLength" :title="refundInfo.remark">
                备注：{{refundInfo.remark || '--'}}
              </div>  
            </el-col>
          </el-row>
        </el-card>
        <!-- 风控记录 -->
        <el-card class="box-card box-margin">
          <div slot="header" class="clearfix">
            <span class="box-card-title">风控记录</span>
          </div>
          <el-row :gutter="24" v-if="dangerousList.length === 0">
            <el-col :span="5" >
              <div class="span-content">
                创建人：--
              </div>
            </el-col>
           
            <el-col :span="5"> 
              <div class="span-content">
                创建时间：--
              </div>
            </el-col>
            
            <el-col :span="14">
              <div class="span-content">
                内容：--
              </div>  
            </el-col>
          </el-row>
           <el-row :gutter="24" v-for="danControlInfo in dangerousList" :key="danControlInfo.controlId">
            <el-col :span="5" >
              <div class="span-content overLength" :title="danControlInfo.createUserName">
                创建人：{{danControlInfo.createUserName}}
              </div>
            </el-col>
            
            <el-col :span="5"> 
              <div class="span-content overLength" :title="danControlInfo.createTime">
                创建时间：{{danControlInfo.createTime || '--'}}
              </div>
            </el-col>
            <el-col :span="14" >
              <div class="span-content overLength" :title="danControlInfo.controlContent">
                内容：{{danControlInfo.controlContent || '--'}}
              </div>  
            </el-col>
          </el-row>
        </el-card>
      </div>

</template>
<script>

  import { regInfo } from '@/api/reg'

  export default {
    data () {
      return {
        visible: false,
        selectRegId: '',
        // 个人信息
        cardId: '',
        stuInfos: [],
        classInfos: [],
        stuInfo: {
          stuName: '',
          cardId: '',
          stuPhone: '',
          stuSex: '',
          stuUserAge: '',
          educType: '',
          addr: '',
          regAddr:'',
          contUserName: '',
          contUserPhone: '',
          channeName: ''
        },
        // 报读信息
        classInfo: {
          schoolName: '',
          classTypeName: '',
          // 课程价格
          classTypePrice: '',
          // 订单价格
          payPrice: '',
          // 未缴
          stayPayPrice: '',
          // 已缴
          confPayPrice: '',
          // 电邀老师
          dyTeacher: ''
        },
        // 电邀老师
        dyTeacher: '',
        // 招生老师
        recruitStuRegSaleEntities: [],
        // 优惠信息
        stuRegPaymentOffEntities:[],
        // 缴费信息
        stuRegPaymentEntities: [],
        // 退费记录
        stuRegRefundEntities: [],
        // 风控记录
        dangerousList: [],
        // 外部介绍人
        outerSubVisible: false
      }
    },
    created() {
      this.selectRegId = this.$route.query.regId
      this.init()
    },
    methods: {
      init () {
        this.visible = true
        this.getDataList()
      },
      getDataList () {
        regInfo(this.selectRegId).then(res => {
          if(res.data && res.data.code === 0){
            // 个人信息
            this.stuInfos = res.data.data.stuRegVo
            if(this.stuInfos.channeId == 42 || this.stuInfos.channeId == 43){
              this.outerSubVisible = false
            }else{
              this.outerSubVisible = true
            }
            // 优惠信息
            this.stuRegPaymentOffEntities = res.data.data.stuRegPaymentOffEntities
            for(var i in this.stuRegPaymentOffEntities){
              this.stuRegPaymentOffEntities[i].createTime = this.stuRegPaymentOffEntities[i].createTime.substring(0,10)
            }
            // 缴费信息
            this.stuRegPaymentEntities = res.data.data.stuRegPaymentEntities
            for(var i in this.stuRegPaymentEntities){
              this.stuRegPaymentEntities[i].payTime = this.stuRegPaymentEntities[i].payTime.substring(0,10)
            }
            // 退费记录
            this.stuRegRefundEntities = res.data.data.stuRegRefundEntities
            for(var i in this.stuRegRefundEntities){
              this.stuRegRefundEntities[i].createTime = this.stuRegRefundEntities[i].createTime.substring(0,10)
            }
            // 风控记录
            this.dangerousList = res.data.data.stuRegControlEntities
            // 招生老师
            this.recruitStuRegSaleEntities = res.data.data.stuRegVo.recruitStuRegSaleEntities
            // 电邀老师
            if(res.data.data.stuRegVo.spreadStuRegSaleEntity !== null){
              this.dyTeacher = res.data.data.stuRegVo.spreadStuRegSaleEntity.userName
            } else {
              this.dyTeacher = '--'
            }
            
          }else{
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
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
  .overLength{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  /* .overLength:hover{
    overflow: visible;
  } */
  .box-margin{
    margin-top: 15px;
  }
  .box-card-title{
    font-weight: bold;
    font-size: 18px;
  }
</style>


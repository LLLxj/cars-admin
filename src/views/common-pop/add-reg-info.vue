<template>
  <el-dialog title="报名表档案" :close-on-click-modal="false" :visible.sync="visible" append-to-body width="800px" top="10vh" center>
    <el-row :span="24" class="l-form-container">
      <!-- <h1>报名表编号:<span>{{data.stuUserEntity.stuName}}</span></h1> -->
      <el-col :span="8" style="border:1px solid #333333">
        <!-- <div class="form-titlt-container">姓名: <span>{{data.stuUserEntity.stuName}}</span></div> -->
        <div class="form-titlt-container">
          <span class="form-left-title">姓名:</span>
          <span style="font-weight:bold;color:red;font-size:20px;">{{data.stuUserEntity.stuName}}</span>
          </div>
      </el-col>
      <el-col :span="4" style="border:1px solid #333333">
        <div class="form-titlt-container">
          <span class="form-left-title form-left-title1">性别: </span>  
          <span v-if="data.stuUserEntity.stuSex === 1">男</span>
          <span v-if="data.stuUserEntity.stuSex === 0">女</span>
        </div>
      </el-col>
      <el-col :span="12" style="border:1px solid #333333">
        <div class="form-titlt-container">
          <span class="form-left-title form-left-title1">身份证:</span>
          <span style="font-weight:bold;color:red;font-size:20px;">{{data.stuUserEntity.cardId}}</span></div>
      </el-col>
      <el-col :span="24" class="regInfo-detail-container" style="border:1px solid #333333">
        <div class="form-row-l">
          <span class="form-left-title">联系方式:</span>
          <span style="font-weight:bold;font-size:18px;">{{data.stuUserEntity.stuPhone}}</span>
        </div>
        <div class="form-row-l">
          <span class="form-left-title">年龄:</span>
          <span>{{data.stuUserEntity.stuUserAge}}</span>
        </div>
        <div class="form-row-l">
          <span class="form-left-title">学历:</span>
          <!-- <dict-show :dictValue="data.stuUserEntity.educType" code="EDU_TYPE" :textShow="false">
            <span slot-scope="scope">
              <span>{{scope.dictLabel}}</span>
            </span>
          </dict-show> -->
          <span style="font-weight:bold;">{{data.stuUserEntity.eduName}}</span>
        </div>
        <div class="form-row-l">
          <span class="form-left-title">户籍:</span>
          <span>{{data.stuUserEntity.addr}}</span>
        </div>
        <div class="form-row-l">
          <span class="form-left-title">居住地址:</span>
          <span>{{data.stuUserEntity.regAddr}}</span>
        </div>
        <div class="form-row-l">
          <span class="form-left-title">联系人1:</span>
          <span>{{data.stuUserEntity.contUserName}}</span>
        </div>
        <div class="form-row-l">
          <span class="form-left-title">联系人2:</span>
          <span>{{data.stuUserEntity.secondContUserName}}</span>
        </div>
      </el-col>
      <el-col :span="24" class="regInfo-detail-container" style="border:1px solid #333333">
        <div class="form-row-l">
          <span class="form-left-title">报读班型:</span>
          <span style="font-weight:bold;font-size:18px;">{{data.stuRegEntity.classTypeName}}</span>
        </div>
        <div class="form-row-l">
          <span class="form-left-title">校区:</span>
          <span style="font-weight:bold;font-size:18px;">{{data.stuRegEntity.schoolName}}</span>
        </div>
        <div class="form-row-l">
          <span class="form-left-title">订单价格:</span>
          <span>{{data.stuRegEntity.payPrice}}元</span>
        </div>
        <div class="form-row-l">
          <span class="form-left-title">已缴金额:</span>
          <span style="color:red;font-size:18px;">{{data.stuRegEntity.payPrice}}元</span>
        </div>
        <div class="form-row-l">
          <span class="form-left-title">需缴金额:</span>
          <span style="color:red;font-size:18px;">{{data.stuRegEntity.confPayPrice}}元</span>
        </div>
        <div class="form-row-l">
          <span class="form-left-title">合同编号:</span>
          <span>{{data.stuRegContractEntity.contractNo}}</span>
        </div>
      </el-col>
      <el-col :span="24" class="regInfo-detail-container" style="border:1px solid #333333">
        <div class="form-row-l">
          <span class="form-left-title">渠道:</span>
          <span style="font-weight:bold;font-size:18px;">{{data.stuRegEntity.channeName}}</span>
        </div>
        <div class="form-row-l">
          <span class="form-left-title">电邀:</span>
          <!-- spreadStuRegSaleEntity -->
          <span style="font-weight:bold;font-size:18px;">{{data.stuRegEntity.dyTeacherName}}</span>
        </div>
        <div class="form-row-l">
          <span class="form-left-title">招生:</span>
          <!-- recruitStuRegSaleEntities -->

          <span style="font-weight:bold;font-size:18px;" v-for="item in data.stuRegEntity.zsTeacherList" :key="item.$index">
            {{item}}
          </span>
        </div>
      </el-col>
      <el-col :span="24" class="regInfo-detail-container" style="border:1px solid #333333">
        <div class="form-row-l">
          <span class="form-left-title">优惠单号:</span>
          <span style="font-size:18px;">{{data.stuRegPaymentOffEntity.benefitNo}}</span>
        </div>
        <div class="form-row-l">
          <span class="form-left-title">优惠金额:</span>
          <span>{{data.stuRegPaymentOffEntity.offPrice}}元</span>
        </div>
      </el-col>
      <el-col :span="24" class="regInfo-detail-container" style="border:1px solid #333333">
        <div class="form-row-l">
          <span class="form-left-title">缴费单号:</span>
          <span style="font-weight:bold;font-size:18px">{{data.stuRegPaymentEntity.paymentNo}}</span>
        </div>
        <div class="form-row-l">
          <span class="form-left-title">缴费金额:</span>
          <span style="color:red">{{data.stuRegPaymentEntity.payPrice}}元</span>
        </div>
        <div class="form-row-l">
          <span class="form-left-title">缴费类型:</span>
          <span v-if="data.stuRegPaymentEntity.paymentType === 1">定金单</span>
          <span v-if="data.stuRegPaymentEntity.paymentType === 2">缴费单</span>
        </div>
        <div class="form-row-l">
          <span class="form-left-title">支付方式:</span>
          <!-- <span>{{data.stuRegPaymentEntity.payTypeId}}</span> -->
          <span>{{data.stuRegPaymentEntity.paymentName}}</span>
        </div>
        <div class="form-row-l">
          <span class="form-left-title">收据单号:</span>
          <span>{{data.stuRegPaymentEntity.receiptNo}}</span>
        </div>
        <div class="form-row-l">
          <span class="form-left-title">缴费时间:</span>
          <span>{{data.stuRegPaymentEntity.payTime}}</span>
        </div>
        <div class="form-row-l">
          <span class="form-left-title">备注:</span>
          <span>{{data.stuRegPaymentEntity.remark}}</span>
        </div>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancleHandle()">取 消</el-button>
      <el-button type="primary" @click="confirmHandle()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { userAuthList, allDyTeacher, allZsTeacher, resourceList, allSchoolList } from '@/api/sys'
  import ClassType from '@/api/classType'
  // import dictShow from '@/views/common-select/dict-show'
  import { dictList } from '@/api/dict'
  import Vue from 'vue'

  export default {
    data () {
      return {
        dataList: [],
        dataListLoading: false,
        visible: false,
        dataForm: {
          username: '',
          userId: ''
        },
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        schoolName: '',
        channeName: '',
        payTypeName: '',
        eduName: '',
        data:{
          stuRegContractEntity:{
            contractNo: ''
          },
          stuRegEntity: {
            channeId: '',
            channeName: '',
            classTypeId: "",
            classTypeName: "",
            classTypePrice: "",
            confPayPrice: "",
            discPrice: "",
            nickName: undefined,
            payPrice: "",
            readStatus: "",
            recruitStuRegSaleEntities: [],
            dyTeacherName: "",
            remark: "",
            schoolId: "",
            schoolName: "",
            spreadStuRegSaleEntity: {},
            stayPayPrice: "",
            zsTeacherList: [],
          },
          stuRegPaymentEntity: {
            payPrice: '',
            payTime: "",
            payTypeId: "",
            paymentNo: "",
            paymentName: '',
            paymentType: "",
            receiptNo: "",
            remark: "",
          },
          stuRegPaymentOffEntity: {
            benefitNo: "",
            ddingCode: "",
            offPrice: 0,
            remark: "",
          },
          stuUserEntity:{
            addr: "",
            cardId: "",
            contUserName: "",
            contUserPhone: "",
            educType: 1,
            eduName: '',
            regAddr: "",
            secondContUserName: "",
            secondContUserPhone: "",
            stuName: "",
            stuPhone: "",
            stuSex: 0,
            stuUserAge: 1,
          }
        },
        dialogVisible: false,
        schoolList: [],
        classTypeList: [],
        dyTeacherList: [],
        zsTeacherList: [],
        paymentTypeList: [],
        resourceList: [],
        code: 'EDU_TYPE',
        payCode: 'PAY_TYPE',
        eduList: [],
        dyTeacherName: '',
        zsTeacherNameList: [],
      }
    },
    created () {
     
    },
    mounted () {
    
    },
    components: {
      // 'dict-show': dictShow,
    },
    watch: {
    },
    methods: {
      init (data) {
        // 显示弹窗
        this.visible = true
        // 加载列表数据
        this.data = data
      },
      // 确定
      confirmHandle () {
        this.visible = false
        this.$emit('addRegInfo-pop-event', 1)
      },
      // 取消
      cancleHandle () {
        this.visible = false
      },
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .l-form-container{
    height:65vh;
    overflow: auto;
    h1{
      padding:0;
      margin:0;
    }
    .form-left-title{
      // padding-left:30px;
      width:80px;
      text-align: right;
      display: inline-block;
      // border:1px solid red;
      line-height: 32px;
      height:32px;
      color:#33CCCC;
    }
    .form-left-title1{
      width:60px;
    }
    .form-titlt-container{
      height:32px;
      line-height: 32px;
      color:#33CCCC;
      span{
        color:#000000;
      }
    }
    .el-form-item__label{
      color:#33CCCC!important;
    }
  }
  .regInfo-detail-container{
    .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
      margin-bottom: 0px;
    }
    span{
      color:#000000;
    }
  }
  .el-form-item .el-form-item--small .el-form-item__label {
    color:#33CCCC!important;
  }
  .test{
    color:#33CCCC!important;
  }
 
  // .el-dialog__body{
  //   padding:0 20px 20px 0;
  // }
  // .el-dialog--center .el-dialog__body{
  //   padding:0 25px;
  // }
</style>


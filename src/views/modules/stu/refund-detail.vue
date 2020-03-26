<template>
<div>
  <div>
    <el-dialog  :close-on-click-modal="false" :visible.sync="visible" width="80%" top="15vh">
      <div style="padding:0 3% 2% 3%">
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
          <!-- 退款记录 -->
          <div class="reg-detail-row">
              <h1>退款记录</h1>
              <el-row :gutter="24" v-for="item in dataList" :key="item.paymentId" :value="item.paymentId">
                <el-col :span="5" >
                  <div class="span-content overLength" :title="item.refundNo">
                    退款单号:{{item.refundNo}}
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="span-content overLength" :title="item.refundPrice">
                   退款金额：{{item.refundPrice}}
                  </div> 
                </el-col>
                <el-col :span="5">
                  <div class="span-content overLength" >
                  退款类型：
                    <span v-if="item.refundType === 1">定金</span>
                    <span v-if="item.refundType === 2">学费</span>
                  </div>  
                </el-col>
                <el-col :span="5">
                  <div class="span-content overLength" :title="item.ddingCode">
                  钉钉单号：{{item.ddingCode || '--'}}
                  </div>  
                </el-col>
                <el-col :span="4">
                  <div class="span-content overLength" :title="item.remark">
                    备注：{{item.remark || '--'}}
                  </div>  
                </el-col>
              </el-row>
              <el-row :gutter="24" v-if="dataList.length == 0">
                <el-col :span="5" >
                  <div class="span-content">
                    退款单号:--
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="span-content">
                  退款金额：--
                  </div> 
                </el-col>
                <el-col :span="5"> 
                  <div class="span-content">
                  退款类型: --
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="span-content">
                  钉钉单号：--
                  </div>  
                </el-col>
                <el-col :span="4">
                  <div class="span-content">
                  备注：--
                  </div>  
                </el-col>
              </el-row>
          </div>
          <!-- 本次退费 -->
          <div class="reg-detail-row">
              <h1>本次退款</h1>
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
                    <span>{{refundRecent.refundNo}}</span>
                  </el-col>
                  <el-col :span="5">
                    <span>{{refundRecent.refundPrice}}</span>
                  </el-col>
                  <el-col :span="5">
                    <span v-if="refundRecent.refundType == 1">退费退学</span>
                    <span v-else>退费不退学</span>
                  </el-col>
                  <el-col :span="5">
                    <span>{{refundRecent.ddingCode || '--'}}</span>
                  </el-col>
                  <el-col :span="4">
                    <span>{{refundRecent.remark || '--'}}</span>
                  </el-col>
              </el-row>
              
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
  
</div>
</template>
<style>
  /* .box-remark {
    width:250%;s
  } */
</style>
<script>

  import { refundInfo, refundList } from '@/api/refund'

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
        },
        dataList: [],
        // 个人信息
        stuInfo: [],
        // 本次退费
        refundRecent: [],
        firstPayOrNot: false,
        selectRowData:[],
        noSelectPayStyle: true,
        noSelectType: true,
        // 报名表id
        selectRegId: '',
        // 外部介绍人
        outerSubVisible: true,
        // 新缴费的refundNo
        refundNo: '',
        refundId: '',
        //电邀老师
        dyTeacher: '',
      }
    },
    components:{
      
    },
    methods: {
      init (data) {
        // 获取regId
        this.selectRegId = data.regId
        // 获取refundNo
        this.refundNo = data.refundNo
        // 获取refundId
        this.refundId = data.refundId
        this.visible = true
        this.selectRowData = []
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        this.getRefundData()
        this.getRefundRecent()
      },
      // 获取退费单信息
      getRefundData () {
        refundInfo(this.selectRegId).then(res => {
          if(res.data && res.data.code === 0){
            this.dataList = res.data.data.stuRegRefundEntities
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
      //获取本次退费信息
      getRefundRecent () {
        refundList({
          'refundNo': this.refundNo
        }).then(res => {
          this.refundRecent = res.data.data.list[0]
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


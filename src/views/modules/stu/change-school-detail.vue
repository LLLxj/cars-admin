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

                    <el-col :span="4" v-if="!outerSubVisible">
                        <div class="span-content">
                        <div>
                            介绍人:
                            <!-- <span>{{stuInfo.spreadStuRegSaleEntity.userName}}</span> -->
                            <span>{{stuInfo.nickName || '--'}}</span>
                        </div>
                        </div>
                    </el-col>
                </el-row>

                
          </div>
          
          <!-- 转校信息 -->
          <div class="reg-detail-row">
              <h1>转校信息</h1>
              <el-row :gutter="24" style="background:#FAFBFD;height:50px;line-height:50px;">
                  <el-col :span="5">
                    <span>报名表号:</span>
                  </el-col>
                  <el-col :span="5">
                      <span>转入校区</span>
                  </el-col>
                  <el-col :span="5">
                      <span>已上课时</span>
                  </el-col>
                  <el-col :span="5">
                      <span>钉钉单号</span>
                  </el-col>
                  <el-col :span="4">
                    <span>转校原因</span>
                  </el-col>
                  <el-col :span="5">
                    <span>{{regNo}}</span>
                  </el-col>

                  <el-col :span="5">
                    <span>{{changeSchoolInfo.newSchoolName}}</span>
                  </el-col>
                  
                  <el-col :span="5">
                    <span>{{changeSchoolInfo.hadClassTime}}</span>
                  </el-col>

                  <el-col :span="5">
                    <span>{{changeSchoolInfo.ddingCode}}</span>
                  </el-col>

                  <el-col :span="4">
                    <span>{{changeSchoolInfo.remark}}</span>
                  </el-col>

              </el-row>
              
          </div>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <!-- <el-button type="info"  @click="visible = false">取消</el-button>
        <el-button type="primary" @click="visible = false">确定</el-button> -->
      </span>
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

  import schooList from "@/views/common-select/all-school-select"
  import { changeSchoolInfo, changeSchoolSuc, changeSchoolFail, getChangeSchoolDetail } from '@/api/changeSchool'
 
  export default {
    data () {
      return {
        visible: false,
        selectId: '',
        selectTransferId: '',
        dataForm: {
          schoolName: '',
          classTime: '',
          ddingCode: '',
          remark: ''
        },
        // 报名表号
        regNo: '',
        // 转校信息
        changeSchoolInfo: [],
        noSelectType: true,
        outerSubVisible: false,
        dataList: [],
        // 个人信息
        stuInfo: [],
        noEdit: true
      }
    },
    components:{
      schooList
    },
    methods: {
      init (data) {
        this.visible = true
        this.selectId = data.regId
        this.selectTransferId = data.transferId
        this.getDataList()
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      },
      // 获取转校信息
      getDataList () {
        getChangeSchoolDetail(this.selectTransferId).then(res => {
          if(res.data && res.data.code === 0){
            this.stuInfo = res.data.data.stuRegCallVo
            this.regNo = res.data.data.stuRegCallVo.regNo
            this.changeSchoolInfo = res.data.data.stuRegTransferCallVo
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
</style>


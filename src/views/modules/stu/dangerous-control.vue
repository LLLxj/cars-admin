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
          <!-- 风控记录 -->
          <div class="reg-detail-row">
            <h1>风控记录</h1>
            <el-row :gutter="24" v-for="item in dataList" :key="item.controlId" :value="item.controlId">
              <el-col :span="5">
                <div class="span-content overLength" :title="item.createUserName">
                  创建人:{{item.createUserName}}
                </div>
              </el-col>
              <el-col :span="5"> 
                <div class="span-content overLength" :title="item.createTime">
                  创建时间: {{item.createTime || '--'}}
                </div>
              </el-col>
              <el-col :span="14">
                <div class="span-content overLength" :title="item.controlContent">
                  内容:{{item.controlContent || '--'}}
                </div>  
              </el-col>
            </el-row>
            <el-row :gutter="24" v-if="dataList.length == 0">
              <el-col :span="5" >
                <div class="span-content">
                  创建人:--
                </div>
              </el-col>
              <el-col :span="5"> 
                <div class="span-content">
                创建时间: --
                </div>
              </el-col>
              <el-col :span="14">
                <div class="span-content">
                  内容：--
                </div>  
              </el-col>
            </el-row>
          </div>
          <!-- 本次风控 -->
          <div class="reg-detail-row">
            <h1>本次风控</h1>
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="内容" prop="content">
                  <el-input type="textarea" v-model="dataForm.content" style="width:200%"  :rows="4" class="box-remark"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button v-if="isAuth('stu:reg:control:save')" type="primary" @click="dataFormSubmit()">确定</el-button>
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

  // import regPop from '@/views/common-pop/reg-pop'
  // import payStyle from '@/views/common-select/payStyle-select'
  // import payType from '@/views/common-select/payType-select'
  import { controlInfo, controlSave } from '@/api/reg'

  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          content: ''
        },
        dataList: [],
        // 个人信息
        stuInfo: [],
        selectRowData:[],
        // 报名表id
        selectRegId: '',
        //电邀老师
        dyTeacher: '',
        // 外部介绍人
        outerSubVisible: false,
        dataRule: {
          content: [
            { required: true, message: '风控内容不能为空', trigger: 'blur' }
          ], 
        }
      }
    },
    components:{
      
    },
    methods: {
      init (data) {
        // 获取regId
        this.selectRegId = data
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        this.getDataInfo()
      },
      // 获取缴费单信息
      getDataInfo () {
        controlInfo(this.selectRegId).then(res => {
          if(res.data && res.data.code === 0){
            // var tempDate = res.data.data.stuRegControlEntities
            // for(var i in tempDate){
            //   tempDate[i].payTime = tempDate[i].payTime.substring(0,10)
            // }
            this.dataList = res.data.data.stuRegControlEntities
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
      // 新增风控
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            controlSave({
              'regId': this.selectRegId,
              'controlContent': this.dataForm.content,
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


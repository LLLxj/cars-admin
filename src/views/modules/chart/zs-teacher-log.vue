<template>
  <div class="mod-user">
    <!-- 布局容器 -->
    <el-container>
      <!--<el-header>
        校区成交统计信息
      </el-header>-->
      <el-main>
        <!--按钮组-->
        <el-card>
          <el-row :gutter="24">
            <el-col :span="3">
              <el-radio-group v-model="val" size="mini">
                <el-radio-button label="1">日</el-radio-button>
                <el-radio-button label="2">周</el-radio-button>
                <el-radio-button label="3">月</el-radio-button>
              </el-radio-group>
            </el-col>
            <el-col :span="8">
              <el-date-picker v-model="chooseTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
              </el-date-picker>
            </el-col>
          </el-row>

        </el-card>

        <el-table :data="dataList" border stripe v-loading="dataListLoading" :default-sort = "{prop: 'payPriceTotal', order: 'descending'}" style="width: 100%;margin-top:15px;" >
          <!--隐藏列-->
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left"  class="demo-table-expand">
                <el-form-item label="定金数量"><span>{{ props.row.earnestCount }}</span></el-form-item>
                <el-form-item label="回款数量"><span>{{ props.row.paymentPriceCount }}</span></el-form-item>
                <el-form-item label="退费数量"><span>{{ props.row.offCount }}</span></el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <!--展示列-->
          <el-table-column type="index" label="NO" align="center" header-align="center" width="80">
          </el-table-column>
          <el-table-column prop="userName" header-align="center" align="center" label="姓名">
          </el-table-column>
          <el-table-column prop="schoolName"  header-align="center" align="center" label="校区">
          </el-table-column>
          <el-table-column prop="regCount" sortable header-align="center" align="center" label="成交笔数"/>
          <el-table-column prop="payPriceTotal" sortable header-align="center" align="center" label="成交金额"/>
          <el-table-column prop="earnestTotal" sortable header-align="center" align="center" label="定金金额"/>
          <el-table-column prop="paymentPriceTotal" sortable header-align="center" align="center" label="回款金额"/>
          <el-table-column prop="offPriceTotal" sortable header-align="center" align="center" label="退费金额"/>
          <el-table-column prop="unRegCount" sortable header-align="center" align="center" label="未完成报名表"/>
        </el-table>
        <el-alert title="说明：" type="warning" :closable="false">
          <div>
            <p class="el-alert__description">1. 当天，本周，本月统计数据每十分钟统计一次</p>
          </div>
        </el-alert>
      </el-main>
      
    </el-container>
  </div>

</template>

<script>

  import { zsTeacherDayInfo, zsTeacherWeekInfo, zsTeacherMonthInfo } from '@/api/regSchoolLog'
  import { parseTime } from '@/utils'

  export default {
    data () {
      return {
        val: 1,
        chooseTime: '',
        dataList: [],
        dataListLoading: false,
        noChangeDate: false,
      }
    },
    watch: {
      val (newV, oldV) {
        if (newV !== oldV) {
          if(newV == 1 && oldV == 2 || newV == 1 && oldV == 3) {
            this.noChangeDate = true
          }
          this.initData()
        }
      },
      chooseTime (newV , oldV) {
        if (newV !== oldV) {
          this.noChangeDate = true
          this.chooseTime = newV
          this.initData()
        }
      }
    },
    activated () {
      this.initData()
    },
    methods: {
       init () {
        this.initData()
      },
      initData () {
        this.val = parseInt(this.val)
        switch (this.val) {
          case 1:
            this.loadInfoDay()
            break
          case 2:
            this.loadInfoWeek()
            break
          case 3:
            this.loadInfoMonth()
            break
          default:
            this.loadInfoDay()
            break
        }
      },
      // 加载数据 日
      loadInfoDay () {
        if(this.noChangeDate == false){
          this.chooseTime = new Date()
          this.chooseTime = parseTime(this.chooseTime).substring(0,10)
        }
        this.dataListLoading = true
        zsTeacherDayInfo(this.chooseTime).then(res => {
          if(res.data && res.data.code === 0){
            this.dataList = res.data.data
          }
          this.dataListLoading = false
        }).catch(err => {
          console.log(err)
          this.dataListLoading = false
        })

      },
       // 加载数据 周
      loadInfoWeek () {
        this.dataListLoading = true
        zsTeacherWeekInfo(this.chooseTime).then(res => {
          if(res.data && res.data.code === 0){
            this.dataList = res.data.data
          }
          this.dataListLoading = false
        }).catch(err => {
          console.log(err)
          this.dataListLoading = false
        })

      },
      loadInfoMonth () {
        this.dataListLoading = true
        zsTeacherMonthInfo(this.chooseTime).then(res => {
          if(res.data && res.data.code === 0){
            this.dataList = res.data.data
          }
          this.dataListLoading = false
        }).catch(err => {
          console.log(err)
          this.dataListLoading = false
        })
      }
    }
  }
</script>

<style lang="scss">
  .box-card {
    width: 100%;
  }
  .mod-demo-echarts {
    width: 100%;
    > .el-alert {
      margin-bottom: 10px;
    }
    > .el-row {
      margin-top: -10px;
      margin-bottom: -10px;
      .el-col {
        padding-top: 10px;
        padding-bottom: 10px;
      }
    }
    .chart-box {
      min-height: 400px;
    }
  }
</style>

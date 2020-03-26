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
          <el-radio-group v-model="val" size="mini">
            <el-radio-button label="1">日</el-radio-button>
            <el-radio-button label="2">周</el-radio-button>
            <el-radio-button label="3">月</el-radio-button>
          </el-radio-group>
        </el-card>
        <!--最新数据-->
        <!-- <el-card style="margin-bottom:10px;margin-top: 10px">
          <schoolLogTitleInfo v-model="val" />
        </el-card> -->
        <div style="margin-bottom:15px;margin-top: 15px">
          <schoolLogTitleInfo v-model="val" />
        </div>
        <!--echarts-->
        <div class="mod-demo-echarts">
          <el-row :gutter="20">
            <!--第一行-->
            <el-col :span="24">
              <el-card>
                <schoolLogPayTotal v-model="val"/>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card>
                <schoolLogPayment v-model="val"/>
              </el-card>
            </el-col>
            <!--第二行-->
            <el-col :span="12">
              <el-card>
                <schoolLogoffPrice v-model="val"/>
              </el-card>
            </el-col>
          </el-row>

          <el-alert
            title="说明："
            type="warning"
            :closable="false">
            <!-- <div slot-scope="description"> -->
            <div>
              <p class="el-alert__description">1. 成交金额是指：学员报名时，已缴定金或者分期后，报名表应缴金额（不是实缴）的总额。</p>
              <p class="el-alert__description">2. 回款金额是指：学费和定金确认后的总和，统计时间是确认收款时间。</p>
              <p class="el-alert__description">3. 退费金额是指：确认退费后的金额总和。</p>
            </div>
          </el-alert>
        </div>

      </el-main>
    </el-container>
  </div>

</template>

<script>
  import schoolLogTitleInfo from './school-log-title-info'
  import schoolLogPayTotal from './school-log-pay-total'
  import schoolLogPayment from './school-log-pay-ment'
  import schoolLogoffPrice from './school-log-off-price'
  export default {
    data () {
      return {
        val: 1
      }
    },
    watch: {
      val (newV, oldV) {
        if (newV !== oldV) {
          // console.log(newV)
        }
      }
    },
    components: {
      schoolLogTitleInfo,
      schoolLogPayTotal,  // 成交额
      schoolLogPayment,   // 回款额
      schoolLogoffPrice   // 退费额
    },
    activated () {
    },
    methods: {
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

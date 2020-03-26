<template>
  <el-row :gutter="24" class="panel-group">
    <el-col :span="4" class="card-panel-col">
      <div class="card-panel">
        <!-- <div class="card-panel-icon-wrapper icon-people">
          <icon-svg name="zhedie" class-name="card-panel-icon" />
        </div> -->
        <div class="card-panel-description">
          <div class="card-panel-text">成交金额</div>
          <count-to :start-val="0" :end-val="payPriceTotal" :duration="2600" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :span="4" class="card-panel-col">
      <div class="card-panel">
        <!-- <div class="card-panel-icon-wrapper icon-message">
          <icon-svg name="zhedie" class-name="card-panel-icon" />
        </div> -->
        <div class="card-panel-description">
          <div class="card-panel-text">成交笔数</div>
          <count-to :start-val="0" :end-val="regCount" :duration="3000" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :span="4" class="card-panel-col">
      <div class="card-panel">
        <!-- <div class="card-panel-icon-wrapper icon-money">
          <icon-svg name="zhedie" class-name="card-panel-icon" />
        </div> -->
        <div class="card-panel-description">
          <div class="card-panel-text">订金金额</div>
          <count-to :start-val="0" :end-val="earnestTotal" :duration="3200" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :span="4" class="card-panel-col">
      <div class="card-panel">
        <!-- <div class="card-panel-icon-wrapper icon-people">
          <icon-svg name="zhedie" class-name="card-panel-icon" />
        </div> -->
        <div class="card-panel-description">
          <div class="card-panel-text">回款金额</div>
          <count-to :start-val="0" :end-val="paymentPriceTotal" :duration="3600" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :span="4" class="card-panel-col">
      <div class="card-panel">
        <!-- <div class="card-panel-icon-wrapper icon-message">
          <icon-svg name="zhedie" class-name="card-panel-icon" />
        </div> -->
        <div class="card-panel-description">
          <div class="card-panel-text">退费金额</div>
          <count-to :start-val="0" :end-val="offPriceTotal" :duration="3600" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :span="4" class="card-panel-col">
      <div class="card-panel">
        <!-- <div class="card-panel-icon-wrapper icon-money">
          <icon-svg name="zhedie" class-name="card-panel-icon" />
        </div> -->
        <div class="card-panel-description">
          <div class="card-panel-text">未完成报名表</div>
          <count-to :start-val="0" :end-val="unRegCount" :duration="3600" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
  </el-row>

</template>

<script>
  import {infoDay, infoWeek, infoMonth} from '@/api/teacherLog'
  import CountTo from 'vue-count-to'

  export default {
    components: {
      CountTo
    },
    props: {
      value: {   // 1.日报 2.周报 3.月报 // 接受外部v-model传入的值
        type: [Number, String],
        default: 1
      }
    },
    data () {
      return {
        loading: false,
        // 定金数量
        earnestCount: 0,
        // 回款数量
        paymentPriceCount: 0,
        // 成交
        payTotalNum: 0,
        payTotal: 0.00,
        // 回款
        payment: 0,
        // 退费
        offPrice: 0,
        // 定金
        payPrice: 0,
        // 未缴完报名表 笔
        unRegCount: 0,
        // 成交金额
        payPriceTotal: 0,
        // 成交笔数
        regCount: 0,
        // 订金金额
        earnestTotal: 0,
        // 回款金额
        paymentPriceTotal: 0,
        // 退费金额
        offPriceTotal: 0
        // 未缴完订单
      }
    },
    watch: {
      value (newV, oldV) {
        if (newV !== oldV) {
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
        this.loading = true
        switch (parseInt(this.value)) {
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
        infoDay().then(res => {
          this.successFun(res)
        }).catch(e => {
          console.log(e)
          this.loading = false
        })
      },
      // 加载数据 周
      loadInfoWeek () {
        infoWeek().then(res => {
          this.successFun(res)
        }).catch(e => {
          console.log(e)
          this.loading = false
        })
      },
      // 加载数据 月
      loadInfoMonth () {
        infoMonth().then(res => {
          this.successFun(res)
        }).catch(e => {
          console.log(e)
          this.loading = false
        })
      },
      // 成功回调事件
      successFun (res) {
        if (res.data && res.data.code === 0) {
          if(res.data.data !== null){
            this.payPriceTotal = res.data.data.payPriceTotal || 0
            this.regCount = res.data.data.regCount || 0
            this.earnestTotal = res.data.data.earnestTotal || 0
            this.paymentPriceTotal = res.data.data.paymentPriceTotal || 0
            this.offPriceTotal = res.data.data.offPriceTotal || 0.00
            this.unRegCount = res.data.data.unRegCount || 0
          }
        } else {
          console.log(res)
          alert(res.data.msg)
        }
        this.loading = false
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dataTitle {
    display: block;
    height: 90px;
    width: 28px;
    background: #2d8cf0;
    border-radius: 4px;
    color: #fff;
    font-size: 14px;
    text-align: center;
    line-height: 22px;
    word-wrap: break-word;
    letter-spacing: 2px;
    cursor: pointer;
    position: absolute;
    top: 10px;
    left: 0px;
  }

  .panel-group {
    margin-top: 18px;

    .card-panel-col {
      margin-bottom: 32px;
    }

    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);

      &:hover {
        // .card-panel-icon-wrapper {
        //   color: #fff;
        // }
        // .icon-people {
        //    background: #40c9c6;
        // }
        // .icon-message {
        //   background: #36a3f7;
        // }
        // .icon-money {
        //   background: #f4516c;
        // }
        // .icon-shoppingCard {
        //   background: #34bfa3
        // }
      }

      .icon-people {
        color: #40c9c6;
      }

      .icon-message {
        color: #36a3f7;
      }

      .icon-money {
        color: #f4516c;
      }

      .icon-shoppingCard {
        color: #34bfa3
      }

      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      .card-panel-icon {
        float: left;
        font-size: 48px;
      }

      .card-panel-description {
        // float: right;
        width: 100%;
        text-align: center;
        // width:35%;
        // border:1px solid red;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;

        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }

        .card-panel-num {
          font-size: 20px;
          color: red;
        }
      }
    }
  }
</style>

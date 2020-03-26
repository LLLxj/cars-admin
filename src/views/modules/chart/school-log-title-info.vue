<template>
  <div>
    <el-row :gutter="24" class="panel-group" v-for="item in dataList" :key="item.schoolId">
      <el-col :span="4" class="card-panel-col"> 
        <div class="card-panel">
          <!-- <div class="card-panel-icon-wrapper icon-people">
            <icon-svg name="zhedie" class-name="card-panel-icon" />
          </div> -->
          <div class="card-panel-description">
            <div class="card-panel-text">成交总数</div>
            <count-to :start-val="0" :end-val="item.payTotalNum" :duration="2600" class="card-panel-num"/>
          </div>
        </div>
        <span class="button dataTitle">{{item.schoolName}}</span>
      </el-col>
      <el-col :span="4" class="card-panel-col">
        <div class="card-panel">
          <!-- <div class="card-panel-icon-wrapper icon-message">
            <icon-svg name="zhedie" class-name="card-panel-icon" />
          </div> -->
          <div class="card-panel-description">
            <div class="card-panel-text">成交总额</div>
            <count-to :start-val="0" :end-val="item.payTotal" :duration="3000" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :span="4" class="card-panel-col">
        <div class="card-panel">
          <!-- <div class="card-panel-icon-wrapper icon-money">
            <icon-svg name="zhedie" class-name="card-panel-icon" />
          </div> -->
          <div class="card-panel-description">
            <div class="card-panel-text">回款总额</div>
            <count-to :start-val="0" :end-val="item.payment" :duration="3200" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :span="4" class="card-panel-col">
        <div class="card-panel">
          <!-- <div class="card-panel-icon-wrapper icon-shoppingCard">
            <icon-svg name="zhedie" class-name="card-panel-icon" />
          </div> -->
          <div class="card-panel-description">
            <div class="card-panel-text">退费总额</div>
            <count-to :start-val="0" :end-val="item.offPrice" :duration="3600" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :span="4" class="card-panel-col">
        <div class="card-panel">
          <!-- <div class="card-panel-icon-wrapper icon-shoppingCard">
            <icon-svg name="zhedie" class-name="card-panel-icon" />
          </div> -->
          <div class="card-panel-description">
            <div class="card-panel-text">定金总额</div>
            <count-to :start-val="0" :end-val="item.payPrice" :duration="3600" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :span="4" class="card-panel-col">
        <div class="card-panel">
          <!-- <div class="card-panel-icon-wrapper icon-shoppingCard">
            <icon-svg name="zhedie" class-name="card-panel-icon" />
          </div> -->
          <div class="card-panel-description">
            <div class="card-panel-text">未完成</div>
            <count-to :start-val="0" :end-val="item.unFinRegNum" :duration="3600" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { infoDay, infoWeek, infoMonth } from '@/api/regSchoolLog'
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
        dataList: [],
        loading: false,
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
        unFinRegNum: 0
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
          if(res.data.data.length !== 0){
            this.dataList = res.data.data
          }
          // this.payTotalNum = res.data.data.payTotalNum || 0
          // this.payTotal = res.data.data.payTotal || 0.00
          // this.payment = res.data.data.payment || 0
          // this.offPrice = res.data.data.offPrice || 0
          // this.unFinRegNum = res.data.data.unFinRegNum || 0
          // this.payPrice = res.data.data.payPrice || 0
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
  .dataTitle{
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
  .card-panel-col{
   
    // margin-bottom: 32px;
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
      width:100%;
      text-align: center;
      // width:35%;
      // border:1px solid red;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        width:100%;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
        color:red;
      }
    }
  }
}
</style>
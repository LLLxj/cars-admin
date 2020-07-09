<template>
  <div class="list-histor-box" :style="{right:right ,width: width,zIndex:9999}">
    <!-- 申请记录 -->
    <span class="button" @click="isShowpaymentHistor()" :style="{top: 20 + 'px', background: paymentRecordVisible? '#19be6b': '#2d8cf0'}">申请记录</span>
    <transition :name="paymentTransition">
      <paymentRecord v-show="paymentRecordVisible" ref="paymentRecord"></paymentRecord>
    </transition>

    <!-- 保证金 -->
    <span class="button" @click="isShowBenefitHistor()" :style="{top: 150 + 'px', background: benefitRecordVisible? '#19be6b': '#2d8cf0'}">保证金记录</span>
    <transition :name="benefitTransition">
      <benefitRecord v-show="benefitRecordVisible" ref="benefitRecord"></benefitRecord>
    </transition>

    <!-- 退费单 -->
    <span class="button" @click="isShowQuitHistor()" :style="{top: 280 + 'px', background: quitRecordVisible? '#19be6b': '#2d8cf0'}">退费记录</span>
    <transition :name="quitTransition">
      <quitRecord v-show="quitRecordVisible" ref="quitRecord"></quitRecord>
    </transition>

    <!-- 金融单 -->
    <span class="button" @click="isShowClassHistor()" :style="{top: 410 + 'px', background: assignClassRecordVisible? '#19be6b': '#2d8cf0'}">金融记录</span>
    <transition :name="transitionNam">
      <assignClassRecord  v-show="assignClassRecordVisible" ref="assignClassRecord"></assignClassRecord>
    </transition>
  </div>
</template>

<script>
  import regHandleRecord from './user-apply-record'
  import assignClassRecord from './user-bzj-record'
  import paymentRecord from './user-finance-record'
  import quitRecord from './user-refund-record'
  import benefitRecord from './user-apply-record'

  export default {
    data () {
      return {
        regHandleRecordVisible: false,
        assignClassRecordVisible: false,
        paymentRecordVisible: false,
        quitRecordVisible: false,
        benefitRecordVisible: false,
        regId: null,
        historList: false,
        right: '-40px',
        width: '0%',
        transitionName: '',
        transitionNam:'',
        benefitTransition: '',
        quitTransition: '',
        paymentTransition: ''
      }
    },
    props: {
      top: {}
    },
    components: {
      regHandleRecord, assignClassRecord, paymentRecord, quitRecord, benefitRecord
    },
    methods: {
      init (id) {
        this.regId = id
        // 初始化 学员
        // this.$refs.regHandleRecord.init(this.regId)
        this.$refs.assignClassRecord.init(this.regId)
        this.$refs.paymentRecord.init(this.regId)
        this.$refs.quitRecord.init(this.regId)
        this.$refs.benefitRecord.init(this.regId)
      },
      // 打开历史记录
      isShowHistor () {
        this.regHandleRecordVisible = !this.regHandleRecordVisible
        this.assignClassRecordVisible = false
        // if (this.classStuListVisible) {
        //   this.right = '0px'
        //   this.width = '50%'
        // } else {
        //   this.right = '-40px'
        //   this.width = '0px'
        // }
        if (this.regHandleRecordVisible) {
          this.width = '60%'
          this.transitionName = 'slide-fade'
        }else{
          this.width = '0%'
        }
      },
       // 打开分班记录
      isShowClassHistor () {
        this.assignClassRecordVisible = !this.assignClassRecordVisible
        // this.regHandleRecordVisible = false
        this.paymentRecordVisible = false
        this.quitRecordVisible = false
         this.benefitRecordVisible = false
        if (this.assignClassRecordVisible) {
          this.width = '60%'
          this.transitionNam = 'slide-fade'
        }else{
          this.width = '0%'
        }
      },

      // 缴费记录
      isShowpaymentHistor () {
        this.paymentRecordVisible = !this.paymentRecordVisible
        this.assignClassRecordVisible = false
        this.quitRecordVisible = false
         this.benefitRecordVisible = false
        if (this.paymentRecordVisible) {
          this.width = '60%'
          this.quitTransition = 'slide-fade'
        }else{
          this.width = '0%'
        }
      },

      // 退费记录
      isShowQuitHistor () {
        this.quitRecordVisible = !this.quitRecordVisible
        this.assignClassRecordVisible = false
        this.paymentRecordVisible = false
        this.benefitRecordVisible = false
         if (this.quitRecordVisible) {
          this.width = '60%'
          this.paymentTransition = 'slide-fade'
        }else{
          this.width = '0%'
        }
      },

      // 优惠记录
      isShowBenefitHistor () {
        this.benefitRecordVisible = !this.benefitRecordVisible
        this.assignClassRecordVisible = false
        this.paymentRecordVisible = false
        this.quitRecordVisible = false
         if (this.benefitRecordVisible) {
          this.width = '60%'
          this.benefitTransition = 'slide-fade'
        }else{
          this.width = '0%'
        }
      }
    }
  }
</script>

<style lang="scss">
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(50%);
  }
  .list-histor-box {
    position: fixed;
    top: 100px;
    right: -40px;
    z-index: 1111;
    height: 100%;
    background: #fff;
    padding: 20px;
    .list {

    }
    .button {
      display: block;
    //   height: 90px;
      padding: 4px 0;
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
      top: 0px;
      left: -28px;
    }
    .button:active {
      background: #19be62
    }
    .button:hover {
      background: #6feca8
    }
  }
</style>

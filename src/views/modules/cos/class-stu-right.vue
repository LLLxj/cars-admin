<template>
  <!-- <div class="list-histor-box" :style="{right:right ,width: width,zIndex:9999}">
    <span class="button" @click="isShowHistor()" :style="{top: 20 + 'px', background: classStuListVisible? '#19be6b': '#2d8cf0'}">学员信息</span>
    <classStuList v-show="classStuListVisible" ref="classStuListRef"></classStuList>
  </div> -->

  <div class="list-histor-box" :style="{right:right ,width: width,zIndex:9999}">
    <span class="button" @click="isShowHistor()" :style="{top: 20 + 'px', background: classStuListVisible? '#19be6b': '#2d8cf0'}">学员信息</span>
    <transition :name="transitionName" >
      <classStuList v-show="classStuListVisible" ref="classStuListRef"></classStuList>
    </transition>
  </div>
</template>

<script>
  import classStuList from './class-stu-list'

  export default {
    data () {
      return {
        classStuListVisible: false,
        classId: null,
        historList: false,
        right: '-40px',
        width: '0%',
        transitionName: '',
      }
    },
    props: {
      top: {}
    },
    components: {
      classStuList
    },
    methods: {
      init (id) {
        this.classId = id
        // 初始化 学员
        this.$refs.classStuListRef.init(this.classId)
      },
      // 打开历史记录
      isShowHistor () {
        this.classStuListVisible = !this.classStuListVisible
        if (this.classStuListVisible) {
          this.width = '50%'
          this.transitionName = 'slide-fade'
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

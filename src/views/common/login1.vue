<template>
  <div class="site-wrapper site-page--login">
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="brand-info">
          <!-- <h2 class="brand-info__text">传递科学运动，健康天下人！</h2>
          <p class="brand-info__intro">黑格力斯-教务系统</p> -->
        </div>
        <div class="login-main">
          <img class="login-title" style="width:346px;height:90px;display:block;margin:0 auto" src="~@/assets/img/login_logo1.png" alt="黑格力斯"/>
          <h3 class="login-title">教务系统</h3>
          
          <el-form style="margin:40px 20px 20px 20px;" :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" v-if="useful">
          <!-- <el-form style="margin:20px;" :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon> -->
            <el-form-item prop="phone">
              <el-input v-model="dataForm.phone" placeholder="手机号码" maxlength="11" prefix-icon="el-icon-service" class="input-style"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" type="password" placeholder="密码" prefix-icon="el-icon-edit" class="input-style" show-password></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">登录</el-button>
            </el-form-item>
          </el-form>
          <el-form style="margin:40px 20px 20px 20px;" @keyup.enter.native="dataFormSubmit1()" v-if="!useful">
          <!-- <el-form style="margin:20px;" :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon> -->
            <el-form-item>
              <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit1()">请下载谷歌浏览器</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>


    <div class="canvas-box">
      <canvas id="canvas" style="opacity:0.2">你的浏览器不支持canvas</canvas>
    </div>
  </div>

</template>

<script>
  import {login} from '@/api/sys'
  import {saveUserSchoolId, setToken} from '@/utils/userInfoUtil'

  export default {
    data () {
      return {
        useful: false,
        dataForm: {
          phone: '',
          password: ''
        },
        dataRule: {
          phone: [
            {required: true, message: '手机号码不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ]
        },
        WINDOW_WIDTH: document.body.offsetWidth,
        WINDOW_HEIGHT: document.body.offsetHeight,
        canvas: null,
        context: null,
        num: 500,
        stars: [],
        mouseX: this.WINDOW_WIDTH / 2,
        mouseY: this.WINDOW_HEIGHT / 2,
        rnd: null
      }
    },
    created () {
    },
    mounted () {
      this.initLogin()
      this.myBrowser()
    },
    methods: {
      myBrowser() {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isOpera = userAgent.indexOf("Opera") > -1;
        if (isOpera) { //判断是否Opera浏览器
          this.useful = false
          return "Opera"
        };
        if (userAgent.indexOf("Firefox") > -1) { //判断是否Firefox浏览器
          this.useful = false
          return "FF";
        };
        if (userAgent.indexOf("Chrome") > -1) {
          this.useful = true
          return "Chrome";
        };
        if (userAgent.indexOf("Safari") > -1) { //判断是否Safari浏览器
          this.useful = false
          return "Safari";
        };
        if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) { //判断是否IE浏览器
          this.useful = false
          return "IE";
        };
    },
    dataFormSubmit1 () {
      window.open('https://www.google.cn/chrome/index.html', '_blank')
    },
      // 提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            login(this.dataForm).then(({data}) => {
              if (data && data.code === 0) {
                setToken(data.data.token)
                saveUserSchoolId(data.data.schoolId)
                this.$router.replace({name: 'home'})
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
        
      },
      initLogin () {
        // var WINDOW_WIDTH = document.body.offsetWidth;
        // var WINDOW_HEIGHT = document.body.offsetHeight;
        // var canvas,context;
        // var num = 500;
        // var stars = [];
        // var mouseX = WINDOW_WIDTH/2;
        // var mouseY = WINDOW_HEIGHT/2;
        // var rnd;
        var _this = this
        window.onload = function () {
          _this.canvas = document.getElementById('canvas')
          _this.canvas.width = _this.WINDOW_WIDTH
          _this.canvas.height = _this.WINDOW_HEIGHT

          _this.context = _this.canvas.getContext('2d')

          _this.addStar()
          setInterval(_this.render, 33)
          _this.liuxing()

          // render();
          document.body.addEventListener('mousemove', _this.mouseMove)
        }
      },
      liuxing () {
        var time = Math.round(Math.random() * 3000 + 33)
        var _this = this
        setTimeout(function () {
          _this.rnd = Math.ceil(Math.random() * _this.stars.length)
          _this.liuxing()
        }, time)
      },
      mouseMove (e) {
        // 因为是整屏背景，这里不做坐标转换
        this.mouseX = e.clientX
        this.mouseY = e.clientY
      },
      render () {
        this.context.fillStyle = 'rgba(0,0,0,0.1)'
        this.context.fillRect(0, 0, this.WINDOW_WIDTH, this.WINDOW_HEIGHT)
        // this.context.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT)
        for (var i = 0; i < this.num; i++) {
          var star = this.stars[i]
          if (i == this.rnd) {
            star.vx = -5
            star.vy = 20
            this.context.beginPath()
            this.context.strokeStyle = 'rgba(255,255,255,' + star.alpha + ')'
            this.context.lineWidth = star.r
            this.context.moveTo(star.x, star.y)
            this.context.lineTo(star.x + star.vx, star.y + star.vy)
            this.context.stroke()
            this.context.closePath()
          }
          star.alpha += star.ra
          if (star.alpha <= 0) {
            star.alpha = 0
            star.ra = -star.ra
            star.vx = Math.random() * 0.2 - 0.1
            star.vy = Math.random() * 0.2 - 0.1
          } else if (star.alpha > 1) {
            star.alpha = 1
            star.ra = -star.ra
          }
          star.x += star.vx
          if (star.x >= this.WINDOW_WIDTH) {
            star.x = 0
          } else if (star.x < 0) {
            star.x = this.WINDOW_WIDTH
            star.vx = Math.random() * 0.2 - 0.1
            star.vy = Math.random() * 0.2 - 0.1
          }
          star.y += star.vy
          if (star.y >= this.WINDOW_HEIGHT) {
            star.y = 0
            star.vy = Math.random() * 0.2 - 0.1
            star.vx = Math.random() * 0.2 - 0.1
          } else if (star.y < 0) {
            star.y = this.WINDOW_HEIGHT
          }
          this.context.beginPath()
          var bg = this.context.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.r)
          bg.addColorStop(0, 'rgba(255,255,255,' + star.alpha + ')')
          bg.addColorStop(1, 'rgba(255,255,255,0)')
          this.context.fillStyle = bg
          this.context.arc(star.x, star.y, star.r, 0, Math.PI * 2, true)
          this.context.fill()
          this.context.closePath()
        }
      },
      addStar () {
        for (var i = 0; i < this.num; i++) {
          var aStar = {
            x: Math.round(Math.random() * this.WINDOW_WIDTH),
            y: Math.round(Math.random() * this.WINDOW_HEIGHT),
            r: Math.random() * 3,
            ra: Math.random() * 0.05,
            alpha: Math.random(),
            vx: Math.random() * 0.2 - 0.1,
            vy: Math.random() * 0.2 - 0.1
          }
          this.stars.push(aStar)
        }
      }
    }
  }
</script>
<style>
  /** {*/
    /*margin: 0;*/
    /*padding: 0;*/
  /*}*/

  html, body {
    height: 100%;
  }

  .canvas-box {
    position: fixed;
    left: 0;
    top: 0;
    z-index: -1;
  }
  /* .el-input input {
    border-radius:0px;
    border-color:none;
    border:none;
    background: none;
    border-bottom:1px solid blue!important;
  }
  .el-input__inner:focus{
    border-bottom:1px solid red!important;
  }
  .el-input input:focus {
    border-color:none!important;
    border:none;
    background: none;
    border-bottom:1px solid red!important;
  } */

</style>
<style lang="scss">
  .site-wrapper.site-page--login {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    /*background-color: rgba(38, 50, 56, .6);*/
    overflow: hidden;

    &:before {
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      content: "";
      background-image: url(~@/assets/img/login_bg1.jpg);
      background-size: cover;
    }

    .site-content__wrapper {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 0;
      margin: 0;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: transparent;
    }

    .site-content {
      min-height: 100%;
      padding: 30px 500px 30px 30px;
    }

    .brand-info {
      margin: 220px 100px 0 90px;
      color: #fff;
    }

    .brand-info__text {
      margin: 0 0 22px 0;
      font-size: 60px;
      /*font-weight: 400;*/
      text-transform: uppercase;
      font-weight: bold;
    }

    .brand-info__intro {
      margin: 10px 0;
      font-size: 40px;
      line-height: 1.58;
      opacity: .6;
    }

    .login-main {
      position: absolute;
      top:0;
      right: 0;
      padding: 150px 60px;
      width: 450px;
      min-height: 100%;
      background-image: url(~@/assets/img/login_side.jpg);
    }

    .login-title {
      font-size: 16px;
      color: #717171;
      text-align: center;
      margin-top: 30px;
    }

    .login-captcha {
      overflow: hidden;

      > img {
        width: 100%;
        cursor: pointer;
      }
    }

    .login-btn-submit {
      width: 100%;
      margin-top: 5px;
    }
  }
</style>

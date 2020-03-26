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
          <el-form style="margin:40px 20px 20px 20px;" :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()">
          <!-- <el-form style="margin:20px;" :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon> -->
            <el-form-item prop="mobile">
              <el-input v-model="dataForm.mobile" placeholder="手机号码" maxlength="11" prefix-icon="el-icon-service" class="input-style"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" type="password" placeholder="密码" prefix-icon="el-icon-edit" class="input-style" show-password></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>


    <div class="canvas-box">
      <canvas id="canvas" style="opacity:0.1" >你的浏览器不支持canvas</canvas>
    </div>
  </div>

</template>

<script>
  import {login} from '@/api/sys'
  import {saveUserSchoolId, setToken} from '@/utils/userInfoUtil'

  export default {
    data () {
      return {
        dataForm: {
          mobile: '',
          password: ''
        },
        dataRule: {
          mobile: [
            {required: true, message: '手机号码不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ]
        },
        // 星星参数
        canvas: null,
        ctx: null,
        w: null,
        h: null,
        hue: null,
        stars: null,
        count: null,
        maxStars: null,

        canvas2: null,
        ctx2: null,
        gradient2: null
      }
    },
    created () {
    },
    mounted () {
      this.initLogin()
    },
    methods: {
      // 提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            login(this.dataForm).then(({data}) => {
              if (data && data.code === 0) {
                setToken(data.token)
                saveUserSchoolId(data.schoolId)
                this.$router.replace({name: 'home'})
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      // 星星方法
      initLogin () {
        let _this = this
        _this.canvas = document.getElementById('canvas')
        _this.ctx = _this.canvas.getContext('2d')
        _this.w = _this.canvas.width = window.innerWidth
        _this.h = _this.canvas.height = window.innerHeight

        _this.hue = 217
        _this.stars = []
        _this.count = 0
        // 星星数量
        _this.maxStars = 500
        // _this.maxStars = 1300

        _this.canvas2 = document.createElement('canvas')
        _this.ctx2 = _this.canvas2.getContext('2d')
        _this.canvas2.width = 100
        _this.canvas2.height = 100
        let half = _this.canvas2.width / 2
        _this.gradient2 = _this.ctx2.createRadialGradient(half, half, 0, half, half, half)
        _this.gradient2.addColorStop(0.025, '#CCC')
        _this.gradient2.addColorStop(0.1, 'hsl(' + _this.hue + ', 61%, 33%)')
        _this.gradient2.addColorStop(0.25, 'hsl(' + _this.hue + ', 64%, 6%)')
        _this.gradient2.addColorStop(1, 'transparent')

        _this.ctx2.fillStyle = _this.gradient2
        _this.ctx2.beginPath()
        _this.ctx2.arc(half, half, half, 0, Math.PI * 2)
        _this.ctx2.fill()

        var Star = function () {
          // let _this = this
          this.orbitRadius = _this.random(_this.maxOrbit(_this.w, _this.h))
          this.radius = _this.random(60, this.orbitRadius) / 8
          // 星星大小
          this.orbitX = _this.w / 2
          this.orbitY = _this.h / 2
          this.timePassed = _this.random(0, _this.maxStars)
          this.speed = _this.random(this.orbitRadius) / 50000
          // 星星移动速度
          this.alpha = _this.random(2, 10) / 1000

          _this.count++
          _this.stars[_this.count] = this
        }
        Star.prototype.draw = function () {
          let x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX
          let y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY
          let twinkle = _this.random(10)

          if (twinkle === 1 && this.alpha > 0) {
            this.alpha -= 0.05
          } else if (twinkle === 2 && this.alpha < 1) {
            this.alpha += 0.05
          }

          _this.ctx.globalAlpha = this.alpha
          _this.ctx.drawImage(_this.canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius)
          this.timePassed += this.speed
        }

        for (let i = 0; i < _this.maxStars; i++) {
          new Star()
        }

        this.animation()
      },

      // 星空
      random (min, max) {
        if (arguments.length < 2) {
          max = min
          min = 0
        }

        if (min > max) {
          var hold = max
          max = min
          min = hold
        }

        return Math.floor(Math.random() * (max - min + 1)) + min
      },
      maxOrbit (x, y) {
        let max = Math.max(x, y)
        let diameter = Math.round(Math.sqrt(max * max + max * max))
        return diameter / 2
        // 星星移动范围，值越大范围越小
      },
      animation () {
        let _this = this
        _this.ctx.globalCompositeOperation = 'source-over'
        _this.ctx.globalAlpha = 0.3// 尾巴
        _this.ctx.fillStyle = 'hsla(' + _this.hue + ', 64%, 6%, 2)'
        _this.ctx.fillRect(0, 0, _this.w, _this.h)

        _this.ctx.globalCompositeOperation = 'lighter'
        for (let i = 1, l = _this.stars.length; i < l; i++) {
          _this.stars[i].draw()
        };

        window.requestAnimationFrame(this.animation)
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

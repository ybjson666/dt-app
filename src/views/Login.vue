<template>
  <div class="login h100" :style="{'backgroundImage': 'url(' + url + ')'}">
    <div class="lg-content" :style="{'backgroundImage': 'url(' + url2 + ')'}">
      <div class="lg-cont">
        <img :src="imgURL">
        <h3>丁太后台管理系统</h3>
        <el-form :model="loginForm"
                 ref="loginForm"
                 :rules="loginFormRules"
                 class="login_form"
        >
          <el-form-item prop="phone">
            <el-input v-model="loginForm.phone"
                      placeholder="请输入账号" @focus="focus()" @blur="blur()">
              <i slot="prefix" class="el-input__icon el-icon-phone">
                <img :src="userImage" alt="">
              </i>
            </el-input>
            <div class="lg-line" :class="isActive ? 'on' : ''"></div>
            <div class="lg-line2"></div>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="text" style="display: none;" />
            <el-input v-model="loginForm.password"
                      placeholder="请输入密码"
                      autocomplete="new-password"
                      type="password" @focus="focus2()" @blur="blur2()">
              <i slot="prefix" class="el-input__icon el-icon-phone">
                <img :src="pasImage" alt="">
              </i>
            </el-input>
            <div class="lg-line" :class="isActive2 ? 'on' : ''"></div>
            <div class="lg-line2"></div>
          </el-form-item>
          <el-form-item prop="yzm" ref="yzm">
            <div class="lg-move">
              <SliderVerificationCode 
                v-model="loginForm.yzm" 
                @change="handleChange" 
                content="向右滑动到底部"
                background="#F1F7FF" textColor="#B0D1FF"/>
            </div>
          </el-form-item>
          <el-form-item class="btns">
            <el-button @click="login('loginForm')">立即登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import {toLogin} from '@/api/api'
  import {mapGetters,mapMutations} from 'vuex'

  export default {
    name: 'Login',
    data() {
      return {
        url: require('../assets/images/bg.png'),
        url2: require('../assets/images/login.png'),
        imgURL: require('../assets/images/logo.png'),
        userImage: require('../assets/images/username.png'),
        pasImage: require('../assets/images/password.png'),
        isActive: false,
        isActive2: false,
        loginForm: {
          phone: '',
          password: '',
          yzm: ''
        },
        // 这是表单的验证规则对象
        loginFormRules: {
          // 验证用户名是否合法
          phone: [
            {required: true, message: '请输入账号'},
          ],
          password: [
            {required: true, message: '请输入密码'},
            {min: 4, message: '密码长度最小为4位'}
          ],
          yzm: [
            {required: true, message: '请将验证码滑动到指定位置'},
          ]
        }
      }
    },
    computed: {
      ...mapGetters([
        'getUsers',
        'getUsersToken'
      ])
    },
    created() {
      // let token = localStorage.getItem('token')
      // if (token) {
      //   toLogin({
      //     app: 3,
      //     device: 5,
      //     token: token
      //   }).then(res => {
      //     if (res.code == 200) {
      //       this.$router.push('/container')
      //     } else {
      //       this.$myMessage('error', res.msg);
      //       this.loginForm.phone = this.getUsers.phone;
      //       this.getUsers.pwd && (this.loginForm.password = this.getUsers.pwd);
      //     }
      //   })
      // }
    },
    methods: {
      ...mapMutations(['setRoleMenus']),
      focus() {
        this.isActive = true
      },
      blur() {
        this.isActive = false
      },
      focus2() {
        this.isActive2 = true
      },
      blur2() {
        this.isActive2 = false
      },
      handleChange(value) {
        this.loginForm.yzm = value
      },
      login(loginForm) {
        this.$refs[loginForm].validate((valid) => {
          if (valid) {
            let params = {
              app: 3,
              device: 5,
              phone: this.loginForm.phone,
              pwd: this.loginForm.password
              // token: this.getUsers.token ? this.getUsers.token : ''
            }
            toLogin(params).then(res => {
              if (res.code == 200) {
               
                this.$store.commit('updateUsers', res.data)
                localStorage.setItem('users', JSON.stringify(res.data))
                localStorage.setItem('token', res.data.token)
                if(res.data.sysRoleMenus){
                  localStorage.setItem('roleId',res.data.sysRoleMenus[0].roleId)
                  let arr=res.data.sysRoleMenus.map(item=>item.menuId)
                  this.setRoleMenus(arr)
                }
                this.$myMessage('success', '登录成功！')
                this.$router.push('/home')
                this.$router.replace({
                    path: '/container',
                    query: { param: Date.now() }
                })
              } else {
                this.$myMessage('error', res.msg)
              }
            })
          } else {
            // this.$myMessage('error', '请输入正确格式的参数')
            return false
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .login {
    min-width: 1067px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;

    .lg-content {
      width: 1067px;
      height: 740px;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -370px;
      margin-left: -533px;
      z-index: 100;

      .lg-cont {
        width: 320px;
        position: absolute;
        top: 170px;
        left: 71px;
        // img{}
        h3 {
          height: 38px;
          font-size: 39px;
          font-family: PingFang SC;
          font-weight: 600;
          color: rgba(0, 0, 0, 1);
          line-height: 38px;
          margin: 10px 0 40px;
        }

        .lg-line {
          width: 0;
          height: 1PX;
          background: #C6C9CC;
          position: absolute;
          left: 0;
          bottom: 0;
          transition: width .45s;
          -moz-transition: width .45s;
          -webkit-transition: width .45s;
          -o-transition: width .45s;
        }

        .lg-line.on {
          width: 100%;
          background: #1882FC;
          z-index: 1;
        }

        .lg-line2 {
          height: 1PX;
          background: #ccc;
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .btns {
          margin-top: 60px;

          .el-button {
            display: block;
          }
        }
      }
    }
  }
</style>

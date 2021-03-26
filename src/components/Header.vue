<template>
  <div class="header">
    <div class="wrap clearfix">
      <div class="logo" :class="getFlag2 ? '' : 'on'">
        <img :src="logoimg"/>
        <!-- <a href="javascript:void(0);" @click="toIndex()">
          <img :src="logoimg"/>
        </a> -->
      </div>
      <div class="header-title">
        <!-- {{$route.path.replace('/','') == 'talentAudit'?'雇员列表':''}} -->
        <span v-if="$route.path.replace('/','') == 'talentAudit' || $route.path.replace('/','') == 'talentSummary'">雇员列表</span>
        <span v-if="$route.path.replace('/','') == 'talentEvaluation' || $route.path.replace('/','') == 'talentFeedback' || $route.path.replace('/','') == 'talentExamine'">审核列表</span>
        <span v-if="$route.path.replace('/','') == 'talentTrain'">培训列表</span>
        <span v-if="$route.path.replace('/','') == 'talentStore'">答题列表</span>
        <span v-if="$route.path.replace('/','') == 'user'">用户列表</span>
        <span v-if="$route.path.replace('/','') == 'role'">角色列表</span>
        <span v-if="$route.path.replace('/','') == 'orderProcess' || $route.path.replace('/','') == 'orderService' || $route.path.replace('/','') == 'orderRenewal'">订单列表</span>
        <span v-if="$route.path.replace('/','') == 'authenFee' || $route.path.replace('/','') == 'orderReview' || $route.path.replace('/','') == 'wageSettlement'">订单列表</span>
      </div>
      <div class="header-right clearfix">
        <div class="header-user">
          <el-dropdown>
            <span class="el-dropdown-link super">{{getUsers.name?getUsers.name:getUsers.phone}}</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <router-link to="/login" class="exit"  @click.native="exit">退出登录</router-link>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <img :src="getUsers.headPic?imgurl+getUsers.headPic:userImg"/>
        </div>
        <!-- <div class="header-news">
              <div class="ling">

                  <a href="javascript:void(0);"><img :src="lingImg"/></a>
                  <div class="hot"></div>
                  <div class="tooltip"><span></span>您有1条未读消息</div>
              </div>
        </div> 
        <div class="header-set">
          <img :src="setImg"/>
        </div> -->
      </div>
      <!-- <div class="search">
        <el-input placeholder="Search keyword" v-model="searchText" @focus="focus()" @blur="blur()">
          <i slot="prefix" class="el-input__icon" :style="{'backgroundImage': 'url(' + searchImg + ')'}"></i>
        </el-input>
        <div class="line" :class="isActive ? 'on' : ''"></div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import imgurl from '@/utils/common.js' 
export default {
  name: 'Header',
  computed: {
    ...mapGetters([
        'getFlag2',
        'getUsers'
    ])
  },
  data() {
    const lgUrl = require('@/assets/images/logo.png')
    const searchUrl = require('@/assets/images/search.png')
    const setUrl = require('@/assets/images/set.png')
    const lingUrl = require('@/assets/images/ling.png')
    const userUrl = require('@/assets/images/head_man.png')
    return {
      logoimg: lgUrl,
      searchImg: searchUrl,
      searchText: '',
      isActive: false,
      setImg: setUrl,
      lingImg: lingUrl,
      userImg: userUrl,
      value: '0',
      imgurl
    }
  },
  created() {
    let token = localStorage.getItem('token')
    let users = JSON.parse(localStorage.getItem('users'))
    if (users === null || users === {} || token === null || token === '' || users === undefined || token === undefined) {
      this.$store.commit('updateUsers', {})
    } else {
      this.$store.commit('updateUsers', users)
    }
  },
  methods: {
    focus() {
        this.isActive = true
    },
    blur() {
        this.isActive = false
    },
    exit() {
      localStorage.removeItem('token')
      localStorage.removeItem('users')
      this.$store.commit('updateUsers', {})
      this.$store.commit('updateTalent', {})
      this.$store.commit('updateExamDetail', {})
      this.$store.commit('updateOrder', {})
      if (this.$route.path !== '/login'){
        this.$router.push({ path: '/login' })
      } 
    }
  
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.header {
  width: 100%;
  height: 80px;
  background-color: rgba(255, 255, 255, 0.85);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 500;
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.1);
}
.logo {
  float: left;
  width: 240px;
  height: 80px;
  padding-top: 16px;
  text-align: center;
  -webkit-transition: all .2s;
  transition: all .2s;
  img {
    width: 197px;
  }
}
.logo.on{
  // box-shadow:0px -4px 8px 0px rgba(0, 0, 0, 0.06);
  -moz-box-shadow: 0.01rem 0 0.02rem 0 rgba(0, 0, 0, 0.06);
  box-shadow: 0.01rem 0 0.02rem 0 rgba(0, 0, 0, 0.06);
}
.header-title{
  float: left;
  margin-left: 20px;
  height: 80px;
  line-height: 80px;
  font-size: 0.2rem;
  font-family: PingFang SC;
  font-weight: 600;
  color: rgba(42,53,74,1);
}
.search{
  float: right;
  width: 230px;
  height: 40px;
  line-height: 40px;
  margin-top: 20px;
  margin-right: 44px;
  // border-bottom: 1px solid #ccc;
  position: relative;
  .el-input{
    height: 100%;
    padding:0 40px;
    font-size:18px;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(204,204,204,1);
    line-height:40px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .el-input__inner{
      position: absolute;
      top:0;
      bottom: 0;
    }
  }
  .el-input__prefix{
    left: 0;
  }
  .el-input__icon{
    width:22px;
    height: 22px;
    display: block;
    position: absolute;
    top: 50%;
    left: 0;
    margin-top:-11px;
    background-size: 100% 100%;
  }
  .line{
    height: 1PX;
    margin: 0;
    border: none;
    background: #1882FC;
    position: absolute;
    left: 0;
    right: 0;
    bottom:0;
    -webkit-transform: scaleX(0);
    -ms-transform: scaleX(0);
    transform: scaleX(0);
    -webkit-transition: -webkit-transform .45s cubic-bezier(.23,1,.32,1);
    transition: -webkit-transform .45s cubic-bezier(.23,1,.32,1);
    transition: transform .45s cubic-bezier(.23,1,.32,1);
    transition: transform .45s cubic-bezier(.23,1,.32,1),-webkit-transform .45s cubic-bezier(.23,1,.32,1);
  }
  .line.on{
    -webkit-transform: scaleX(1);
    -ms-transform: scaleX(1);
    transform: scaleX(1);
  }
}
.header-right{
  float:right;
  height:80px;
  line-height:80px;
  padding-right:35px;
  .header-set{
    float:right;
    width:80px;
    height:80px;
    text-align: center;
    &:hover{
      background:rgba(245,249,255,.6)
    }
    img{
      height:21px;
    }
  }
  .header-news{
    float:right;
    width:80px;
    height:80px;
    margin-left:10px;
    margin-right:10px;
    position:relative;
    .tooltip{
      display: none;
      min-width: 1.4rem;
      height: .3rem;
      line-height: .3rem;
      background:#303133;
      -moz-border-radius: .04rem;
      border-radius: .04rem;
      position: absolute;
      top: .34rem;
      left: 0;
      margin-left: -.6rem;
      padding: 0 5px;
      font-size: .14rem;
      color: #fff;
      text-align: center;
      span{
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 10px solid #303133;
        position: absolute;
        top: -6px;
        left: 50%;
        margin-left: -5px;
      }
    }
    &:hover{
      background:rgba(245,249,255,.6);
      .tooltip{
        display:block
      }
    }
    
    .ling{
      width:21px;
      height:21px;
      position:absolute;
      top:50%;
      left:50%;
      -webkit-transform: translate(-50%,-50%);
      -ms-transform: translate(-50%,-50%);
      transform: translate(-50%,-50%);
      img{
        width:21px;
        height:21px;
        position:absolute;
        top:0;
        left:0;
      }
      .hot{
        background-color: #FF0000;
        width: 10px;
        height: 10px;
        -moz-border-radius: 100%;
        border-radius: 100%;
        position:absolute;
        top: -2px;
        right: 2px;
      }
    }
  }
  .header-user{
    float:right;
    font-size:16px;
    font-weight:600;
    color:#333;
    padding:0 10px 0 15px;
    &:hover{
      background:rgba(245,249,255,.6)
    }
    img{
      width:45px;
      height:45px;
      overflow: hidden;
      -moz-border-radius:100%;
      border-radius:100%;
      margin-left:21px;
    }
  }
  .exit{
    font-size: 20px;
  }
}
</style>

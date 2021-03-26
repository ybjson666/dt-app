<template>
  <div class="home">
    <Header></Header>
    <!-- <Header @toIndex="handleSelect"></Header> -->
    <div class="content">
      <div class="navMenu" :class="getFlag2 ? 'on' : ''" :style="{'backgroundImage': 'url(' + navbg + ')'}">
        <el-menu :default-active="$route.path"
                 :collapse-transition="false"
                 router
                 :collapse="getFlag2"
                 unique-opened
                 :default-openeds="openeds"
                 @open="handleSelect">
          <template v-for="(item,index) in menus">
            <template v-if="!getFlag2">
              <el-submenu :index="item.id + ''"
                          :key="item.id"
                          :class="getFlag?`st${index}`:''"
                          v-if="item.isShow"
              >
                <template slot="title" >
                    <i class="iconft" :class="`iconft${index}`"></i>
                    <span >{{item.authName}}</span>
                </template>
                <el-menu-item-group :title="item.authName" @click.native.prevent="reClick(item)"  v-if="item.children.length>0">
                  <template v-for="(subItem) in item.children" >
                    <el-menu-item :index="'/' + subItem.path"
                                :key="subItem.id"
                                :class='{on:subItem.path===($route.path.split("/")[1])}'
                                v-if="subItem.isShow"
                    >             
                      <template slot="title">
                          <i class="line-left"></i>
                          <span>
                            {{subItem.authName}}
                            <b class="num1" :class="subItem.authName == '证件审核' && getNumber1 > 0 &&getNumber1 < 10 ?'on':subItem.authName == '证件审核' && getNumber1 >= 10?'on2':''" v-show="showNum1">{{getNumber1 > 99?'99+':getNumber1}}</b>
                            <b class="num2" :class="subItem.authName == '服务反馈' && getNumber2 > 0 && getNumber2 < 10 ?'on':subItem.authName == '服务反馈' && getNumber2 >= 10?'on2':''" v-show="showNum2">{{getNumber2 > 99?'99+':getNumber2}}</b>
                          </span>
                      </template>
                    </el-menu-item>
                  </template>
                  
                </el-menu-item-group>
              </el-submenu>
            </template>

            <template v-if="getFlag2">
              <el-submenu :index="item.id + ''"
                          :key="item.id"
                          :class='{"is-active":item.id==curId}'
                          @click.native.prevent="muClick(item,index)"
                          v-if="item.isShow"
              >
                <template slot="title">
                    <i class="iconft" :class="`iconft${index}`"></i>
                    <span>{{item.authName}}</span>
                    <div class="menu-bg"></div>
                </template>
                <el-menu-item-group :title="item.authName" @click.native.prevent="reClick(item)">
                  <template v-for="(subItem) in item.children">
                    <el-menu-item :index="'/' + subItem.path"
                                :key="subItem.id"
                                :class='{"is-active":subItem.path===($route.path.split("/")[1])}'
                                @click.native.prevent="muClick(item,index)"
                                v-if="subItem.isShow"
                    >
                      <template slot="title">
                          <i class="line-left"></i>
                          <span>{{subItem.authName}}</span>
                      </template>
                    </el-menu-item>
                  </template>
                </el-menu-item-group>
              </el-submenu>
            </template>
          </template>
        </el-menu>
        <a href="javascript:void(0);" class="zhimg" @click="zhClick(true)" v-show="!getFlag2">
          <img :src="zhUrl" alt="">
        </a>
        <a href="javascript:void(0);" class="shimg" @click="zhClick(false)" v-show="getFlag2">
          <img :src="shUrl" alt="">
        </a>
      </div>
      <div class="cont" :class="getFlag2 ? 'on' : ''">
        <router-view></router-view>
      </div>
    </div>
    <div class="message" >
      <div class="message-hd" :style="{'backgroundImage': 'url(' + mbg + ')'}">
      <div class="news" @click="newsDialog()">
        <img :src="newsImg" alt="">
        <div class="newsNum">{{totalCount}}</div>
      </div>
      </div>
    </div>
    <NewsDialog ref="dialog"></NewsDialog>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'
import NewsDialog from '@/components/NewsDialog.vue'
import { mapGetters,mapState } from 'vuex'
export default {
  name: 'home',
  components: {
    Header,
    NewsDialog
  },
  computed: {
    ...mapGetters([
        'getFlag',
        'getFlag2',
        'getNumber1',
        'getNumber2',
        'totalCount'
    ]),
    ...mapState(['roleMenus']),
    openeds(){
      let curPath=this.$route.path.split('/')[1];
      let arr=['1'];
      this.menulist.forEach(ele => {
        if(ele.children.length>0){
          ele.children.forEach(item=>{
            if(item.path==curPath){
              arr[0]=ele.id
            }
          })
        }
      });
      return arr;
    },
    menus(){
      let arr= JSON.parse(JSON.stringify(this.menulist))
      arr.forEach(item=>{
        this.roleMenus.forEach(menu =>{
          if(item.menuid==menu){
            item.isShow=true
          }
          if(item.children.length){
            item.children.forEach(child=>{
              if(child.menuid==menu){
                child.isShow=true
              }
            })
          }
        })
      })
      return arr
    }
  },
  watch:{
    totalCount(val){
      this.$refs.dialog.renderChatList()
    }
  },
  data() {
    return {
      navbg: require('@/assets/images/navbg.png'),
      mbg:require('@/assets/images/bg-message.png'),
      newsImg:require('@/assets/images/news.png'),
      zhUrl: require('@/assets/images/left.png'),
      shUrl: require('@/assets/images/right.png'),
      menulist: [
        {
            id: '1',
            authName: '首页',
            path: 'home',
            menuid:'1',
            isShow:false,
            children: [
              // { id: 101, authName: '占位字符', path: 'home' } 
            ]
        },
        {
            id: '2',
            authName: '雇员中心',
            menuid:'2',
            isShow:false,
            children: [
                { id: 201, authName: '雇员认证', path: 'talentAudit',isShow:false,menuid:'9', },
                { id: 203, authName: '雇员总表', path: 'talentSummary',isShow:false,menuid:'10', },
                { id: 204, authName: '证件审核', path: 'talentExamine',isShow:false,menuid:'11', },
                // { id: 205, authName: '占位字符', path: 'home',menuid:'12', }
            ]
        },
        {
            id: '3',
            authName: '雇主中心',
            menuid:'13',
            isShow:false,
            children: [
                { id: 301, authName: '订单处理', path: 'orderProcess',isShow:false,menuid:'13' },
                { id: 302, authName: '订单服务', path: 'orderService',isShow:false,menuid:'14' },
                { id: 303, authName: '待续签', path: 'orderRenewal',isShow:false,menuid:'15' },
                // { id: 304, authName: '占位文字', path: 'home',menuid:'16' }
            ]
        },
        {
            id: '4',
            authName: '消息沟通',
            menuid:'4',
            isShow:false,
            children: [
                { id: 401, authName: '消息沟通',isShow:false,menuid:'17', path: 'news' }
            ]
        },
        {
            id: '5',
            authName: '专家中心',
            menuid:'5',
            isShow:false,
            children: [
                { id: 501, authName: '专家测评', path: 'talentEvaluation',isShow:false,menuid:'18' },
                { id: 502, authName: '培训中', path: 'talentTrain',isShow:false,menuid:'19' },
                { id: 503, authName: '服务反馈', path: 'talentFeedback',isShow:false,menuid:'20' },
            ]
        },
        {
            id: '6',
            authName: '客服访问',
            menuid:'100',
            isShow:false,
            children: [
                { id: 601, authName: '用户管理',isShow:false,menuid:"102", path: 'user' },
                { id: 602, authName: '系统设置',isShow:false,menuid:"103", path: 'role' }
            ]
        },
        {
            id: '7',
            authName: '会员管理',
            menuid:'6',
            isShow:false,
            children: [
                { id: 701, authName: '会员管理1', path: 'home',isShow:false,menuid:'24' },
                { id: 702, authName: '会员管理2', path: 'home',isShow:false,menuid:'25' }
            ]
        },
        {
            id: '8',
            authName: '财务报表',
            menuid:'7',
            isShow:false,
            children: [
                { id: 801, authName: '认证/培训费', path: 'authenFee',isShow:false,menuid:'26' },
                { id: 802, authName: '订单审核', path: 'orderReview',isShow:false,menuid:'27' },
                { id: 803, authName: '雇员工资结算', path: 'wageSettlement',isShow:false,menuid:'28' },
                { id: 804, authName: '占位文字', path: 'home',isShow:false,menuid:'29' }
            ]
        },
        {
            id: '9',
            authName: '系统设置',
            menuid:'8',
            isShow:false,
            children: [
                { id: 901, authName: '用户管理', path: 'user',isShow:false,menuid:'30' },
                { id: 902, authName: '角色管理', path: 'role',isShow:false,menuid:'31' },
                { id: 903, authName: '题库', path: 'talentStore',isShow:false,menuid:'23' }
            ]
        }
      ],
      currentIndex: 0,
      showNum1: true,
      showNum2: true,
      curId:localStorage.getItem('curId')
    }
  },
  methods: {
    zhClick(flag) {
      this.$store.commit('updateFlag2', flag)
    },
    muClick(item,idx) {
      this.curId=item.id
      localStorage.setItem('curId',this.curId)
      this.$store.commit('updateFlag', false)
      if(idx == 0){
        this.$router.push('/home')
        this.$store.commit('updateFlag', true)
      }
    },
    reClick(name) {
      this.$store.commit('updateFlag', false)
    },
    handleSelect(key, keyPath) {
      this.$store.commit('updateFlag', false)
      if(key == 1){
        this.$router.push('/home')
        this.$store.commit('updateFlag', true)
      }
    },
    newsDialog(){
      this.$refs.dialog.showDialog()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.navMenu{
  width:240px;
  background-color: #fff;
  background-position: left center;
	background-repeat: no-repeat;
	background-size: cover;
  position: fixed;
  top: 80px;
  left: 0;
  bottom: 0;
  // box-shadow:0px 0px 8px 0px rgba(0, 0, 0, 0.06);
  -moz-box-shadow: 0.01rem 0 0rem 0 rgba(0, 0, 0, 0.06);
  box-shadow: 0.01rem 0 0rem 0 rgba(0, 0, 0, 0.06);
  z-index: 800;
  -moz-transition: all .2s;
	-webkit-transition: all .2s;
	-o-transition: all .2s;
	transition: all .2s;
  .el-menu{
    width:100% !important;
    height: 100%;
    padding-top: 25px;
    border:none;
    overflow-y: auto;
    .el-menu-item-group{
      padding-top: 10px;
      li{
        margin-bottom: 10px;
        span{
          position: relative;
        }
        &:last-child{
          margin-bottom: 0;
        }
      }
    }
  }
}
.navMenu.on{
  width:70px;
  -moz-border-top-right-radius: 7px;
  border-top-right-radius: 7px;
  .el-menu{
    -moz-box-shadow:0px 0px 8px 0px rgba(0, 0, 0, 0.06);
    box-shadow:0px 0px 8px 0px rgba(0, 0, 0, 0.06);
  }
}
.cont{
  position: absolute;
  top: 0;
  left: 260px;
  right: 0;
  bottom:20px;
  -moz-transition: all .2s;
	-webkit-transition: all .2s;
	-o-transition: all .2s;
	transition: all .2s;
}
.cont.on{
  left: 89px;
}
.iconft{
  width: 34px;
  height: 34px;
  display: inline-block;
  // position: absolute;
  left: 32px;
  top: 50%;
  // margin-top:-17px;
  background-image: url('../assets/images/menu1.png');
  background-size: 100% 100%;
}
.iconft0{
  // background-position: 0 0;
  background-image: url('../assets/images/menu1.png');
}
.iconft1{
  // background-position: 0 -34px;
  background-image: url('../assets/images/menu4.png');
}
.iconft2{
  // background-position: 0 -68px;
  background-image: url('../assets/images/menu7.png');
}
.iconft3{
  // background-position: 0 -102PX;
  background-image: url('../assets/images/menu10.png');
}
.iconft4{
  // background-position: 0 -136PX;
  background-image: url('../assets/images/menu16.png');
}
.iconft5{
  // background-position: 0 -170PX;
  background-image: url('../assets/images/menu13.png');
}
.iconft6{
  // background-position: 0 -204PX;
  background-image: url('../assets/images/menu19.png');
}
.iconft7{
  // background-position: 0 -238PX;
  background-image: url('../assets/images/menu22.png');
}
.iconft8{
  // background-position: 0 -238PX;
  width: 23px;
  height:23px;
  margin-right: 3px;
  background-image: url('../assets/images/menu25.png');
}

.zhimg,.shimg{
  width: 40px;
  height: 40px;
  position: absolute;
  right:10px;
  bottom:10px;
  z-index: 100;
  img{
    width: 40px;
    height: 40px;
    position: absolute;
    top:0;
    left: 0;
  }
}
.shimg{
  right:15px;
}
.message{
  width: 60px;
  height: 167px;
  position: fixed;
  right: 0;
  bottom: 180px;
  z-index: 100;
  .message-hd{
    width: 60px;
    height: 167px;
    background-size: 100% 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  .news{
    width: 30px;
    height: 26px;
    position: absolute;
    top:50%;
    left: 50%;
    margin-top: -13px;
    margin-left: -15px;
    cursor: pointer;
    img{
      width: 30px;
      height: 26px;
      position: absolute;
      top: 0;
      left: 0;
    }
    .newsNum{
      height: 0.18rem;
      background-color: #FF0000;
      line-height: .16rem;
      border-radius: 50%;
      position: absolute;
      top: -0.09rem;
      right: -0.06rem;
      font-size: .12rem;
      color: #fff;
      text-align: center;
      padding: 0 .06rem;
    }
  }
}

.num1,.num2{
  display:none;
  position: absolute;
  top: -.06rem;
  right: -.22rem;
  width: 0.18rem;
  height: 0.18rem;
  line-height: 0.18rem;
  background: #F42121;
  border-radius: 50%;
  font-size: 0.14rem;
  font-weight: 400;
  color: #fff;
  text-align: center;
  margin-left: .02rem;
}
.num1.on,.num2.on,.num1.on2,.num2.on2{
  display:inline-block;
}
.num1.on2,.num2.on2{
  width: auto;
  height: auto;
  border-radius: .15rem;
  padding: 0 .05rem;
}
</style>

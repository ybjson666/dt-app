<template>
  <div class="tinntay-cont empl">
    <div class="talentAudit">
      <div class="talent-cont">
        <div class="pages-menu-block">
          <el-menu :default-active="activeIndex" class="el-menu-demo pages-menu" mode="horizontal">
            <el-menu-item index="1"><router-link to="/orderProcess/orderProcessing">订单处理</router-link></el-menu-item>
            <el-menu-item index="2"><router-link to="/orderProcess/orderRecycle">订单回收站</router-link></el-menu-item>
            <el-menu-item index="3"><router-link to="/orderProcess/orderHistory">历史订单</router-link></el-menu-item>
          </el-menu>
        </div>
        <div class="pages-content-block">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'orderProcess',
    computed:{
      activeIndex(){
        let path=this.$route.path;
        if(path==='/orderProcess/orderProcessing'){
          return '1'
        }else if(path==='/orderProcess/orderRecycle'){
          return '2'
        }else if(path==='/orderProcess/orderHistory'){
          return '3'
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
.talentAudit{
  height:100%;
  padding-top:20px;
  box-sizing:border-box;
}
.pages-content-block{
  height:calc(100% - 64px);
  background: #fff;
}
</style>

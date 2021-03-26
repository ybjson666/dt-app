<template>
  <div class="tinntay-cont">
    <div class="talentAudit">
      <div class="talent-cont">
        <div class="pages-menu-block">
            <el-menu :default-active="activeIndex" class="pages-menu" mode="horizontal">
              <el-menu-item index="1"><router-link to="/orderReview/entryAudit">入账审核</router-link></el-menu-item>
              <el-menu-item index="2"><router-link to="/orderReview/expenditureAudit">支出审核</router-link></el-menu-item>
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
    name: 'orderReview',
    computed:{
      activeIndex(){
        let path=this.$route.path;
        if(path==='/orderReview/entryAudit'){
          return '1'
        }else if(path==='/orderReview/expenditureAudit'){
          return '2'
        }
      }
    }
  }
</script>


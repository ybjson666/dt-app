<template>
  <div class="tinntay-cont">
    <div class="talentAudit">
      <div class="talent-cont">
        <div class="pages-menu-block">
            <el-menu :default-active="activeIndex" class="el-menu-demo pages-menu" mode="horizontal">
              <el-menu-item index="1"><router-link to="/talentAudit/talentQualified">实名合格</router-link></el-menu-item>
              <el-menu-item index="2"><router-link to="/talentAudit/talentTheory">理论测试</router-link></el-menu-item>
              <el-menu-item index="3"><router-link to="/talentAudit/talentImprove">档案审核</router-link></el-menu-item>
              <el-menu-item index="4"><router-link to="/talentAudit/talentFailed">未通过</router-link></el-menu-item>
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
    name: 'talentAudit',
    computed:{
      activeIndex(){
        let path=this.$route.path;
        if(path==='/talentAudit/talentQualified'){
          return '1'
        }else if(path==='/talentAudit/talentTheory'){
          return '2'
        }else if(path==='/talentAudit/talentImprove'){
          return '3'
        }else if(path==='/talentAudit/talentFailed'){
          return '4'
        }
      }
    },
  }
</script>



<template>
  <div class="tinntay-cont">
    <div class="talentAudit">
      <div class="talent-cont">
        <div class="pages-menu-block">
          <el-menu :default-active="activeIndex" class="el-menu-demo pages-menu" mode="horizontal">
            <el-menu-item index="1"><router-link to="/talentSummary/talentWait">等单中</router-link></el-menu-item>
            <el-menu-item index="2"><router-link to="/talentSummary/talentOnduty">已上岗</router-link></el-menu-item>
            <el-menu-item index="3"><router-link to="/talentSummary/talentSuspend">暂停中</router-link></el-menu-item>
            <el-menu-item index="4"><router-link to="/talentSummary/talentBlacklist">黑名单</router-link></el-menu-item>
            <el-menu-item index="5"><router-link to="/talentSummary/talentCollection">我的收藏</router-link></el-menu-item>
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
        if(path==='/talentSummary/talentWait'){
          return '1'
        }else if(path==='/talentSummary/talentOnduty'){
          return '2'
        }else if(path==='/talentSummary/talentSuspend'){
          return '3'
        }else if(path==='/talentSummary/talentBlacklist'){
          return '4'
        }else if(path==='/talentSummary/talentCollection'){
          return '5'
        }
      }
    }
  }
</script>


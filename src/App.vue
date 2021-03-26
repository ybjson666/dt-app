<template>
  <div id="app">
    <router-view></router-view>
    <VideoDialog/>
    <Link/>
    <Inviting/>
  </div>
</template>

<script>
import { techInterface} from '@/api/api'
import VideoDialog from './components/VideoDialog.vue'
import Link from './components/Link.vue'
import Inviting from './components/Inviting.vue'
export default {
  name: 'app',
  data(){
    return{
      tabList:[],
    }
  },
  created() {
    // 元数据list
    this.gettechList()
    this.refresh()
  },
  components:{
    VideoDialog,
    Link,
    Inviting
  },
  beforeMount(){
    let user=JSON.parse(localStorage.getItem('users'))
    if(user&&user.id){
      const userName = user.id;
      const password = user.pwd;
      var options = {
        user: userName,
        pwd: password,
        appKey: WebIM.config.appkey,
        success:(res)=>{
          let webImToken = res.access_token
          localStorage.setItem('webImToken',webImToken)
        }
      };
      WebIM.conn.open(options);
    }
  },
  methods: {
    // 元数据list
    gettechList() {
      techInterface().then(res => {
        if(res.code == 200) {
          this.$store.state.sysMetaData = res.data;
          res.data.forEach(item =>{
            this.tabList[item.id] = item.name
            localStorage.setItem('tabKey',JSON.stringify(this.tabList))
          })
        }
      })
    },
    refresh() {
      // 在页面刷新时将vuex里的信息保存到localStorage里
      window.addEventListener('beforeunload', () => {
        localStorage.setItem('messageStore', JSON.stringify(this.$store.state))
      })
      // 在页面加载时读取localStorage里的状态信息
      localStorage.getItem('messageStore') && this.$store.replaceState(Object.assign(this.$store.state, JSON.parse(localStorage.getItem('messageStore'))))
    }
  }
}
</script>

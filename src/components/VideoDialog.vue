<template>
<div class="contractor-wraps">
  <el-dialog class="callDialog" :visible.sync="callVideo" :close-on-click-modal="false"
  width="1000px" @close="closeDialog" :show-close="false">
    <div class="contracton-header" slot="title">
      <span class="cl">视频会议</span>
      <!-- <a href="javascript:void(0);" @click="closeDialog" class="close fr"><span></span></a> -->
      <div class="cl"></div>
    </div>
    <div class="meeting-container">
        <div class="meeting-top">
          <!--主视频-->
          <div class="meeting-video-wraper" v-loading="isLoading">
            <video id="main-video" class="main-video" autoplay/>
          </div>
          <div class="meeting-users-list">
            <ul class="user-list">
              <li v-for="(item,index) in roomList" :key="index" @click="seleUser(item.video_src,item.uid)" :class="{active:curUid==item.uid}">
                  <div class="user-video-wraps" v-if="item.video_src">
                    <!--成员视频-->
                    <div class="user-video-wraper">
                      {{renderUserVideo(item)}}
                      <video :id="`${item.video_src.id}`" autoplay v-if="!item.isMe" />
                      <video autoplay v-else id="memberMine"/>
                    </div>
                    <div class="user-name-wraper">
                      <span>{{item.name}}</span>
                    </div>
                  </div>
                  <div class="user-info-wraps" v-else>
                    <div class="nick_name-wraper">
                      <span v-if="!item.isLink">{{item.nick_name}}</span>
                      <span v-else>呼叫中...</span>
                    </div>
                    <div class="user-name-wraper">
                      <span>{{item.name}}</span>  
                    </div>  
                  </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="meeting-bottom">
          <div class="btn-groups">
            <div class="btn-wraps">
              <div class="btn-icon-wraps" @click="handleForbied">
                <img :src="voice" alt="" width="25px" v-if="!isForbied">
                <img :src="voice2" alt="" width="25px" v-else>
              </div>
              <p class="btn-name">静音</p>
            </div>
            <div class="btn-wraps" @click="handleOverMeet">
              <div class="btn-icon-wraps over">
                <img :src="phone" alt="" width="30px">
              </div>
              <p class="btn-name">结束会议</p>
            </div>
            <div class="btn-wraps" @click="invites">
              <div class="btn-icon-wraps">
                <img :src="user" alt="" width="20px">
              </div>
              <p class="btn-name">邀请</p>
            </div>
          </div>
        </div>
    </div>
  </el-dialog>
  <!--结束会议弹框-->
  <div class="over-meet-modal" v-show="showOverMeet">
    <h2 class="meet-title">结束会议</h2>
    <p>你确定要结束会议?</p>
    <div class="meet-btn-block">
      <span class="btn cancel-btn fl" @click="showOverMeet=false">取消</span>
      <span class="btn sure-btn fr" @click="sureOverMeet">确定</span>
      <div class="cl"></div>
    </div>
  </div>
  <Invitor ref="invitor"/>
</div>
</template>

<script>
import { mapState,mapMutations } from 'vuex'
import Invitor from './Invitor.vue'
export default {
  name: 'videoDialog',
  props: [],
  data() {
    return {
      rtcCall:null,
      curVideoSrc:"",
      curUid:null,
      voice:require('@/assets/images/mkf.png'),
      phone:require('@/assets/images/gddh.png'),
      user:require('@/assets/images/yq.png'),
      voice2:require('@/assets/images/forbied.png'),
      isForbied:false,
      showOverMeet:false,
      isLoading:true
    }
  },
  computed:{
    ...mapState(['callVideo','roomList','conference','pushedStream','userList'])
  },
  mounted(){
    WebIM.emedia.mgr.onConferenceExit = (reason, failed)=> {//监听会议链接情况
      reason = (reason || 0);
      switch (reason){
          case 0:
              reason = "正常挂断";
              this.clearDom()
              break;
          case 1:
              reason = "没响应";
              break;
          case 2:
              reason = "服务器拒绝";
              break;
          case 3:
              reason = "对方忙";
              break;
          case 4:
              reason = "失败,可能是网络或服务器拒绝";
              if(failed === -9527){
                  reason = "失败,网络原因";
              }
              if(failed === -500){
                  reason = "Ticket失效";
              }
              if(failed === -502){
                  reason = "Ticket过期";
              }
              if(failed === -504){
                  reason = "链接已失效";
              }
              if(failed === -508){
                  reason = "会议无效";
              }
              if(failed === -510){
                  reason = "服务端限制";
              }
              break;
          case 5:
              reason = "不支持";
              break;
          case 10:
              reason = "其他设备登录";
              break;
          case 11:
              reason = "会议关闭";
              console.log(reason)
              this.clearDom()
              break;
      }
    }
    WebIM.emedia.mgr.onMemberJoined = (member)=> {//监听成员加入
      this.setUser(member,"")
    }
    WebIM.emedia.mgr.onStreamAdded = (member, stream) =>{//监听视频流
      if(!stream.located()){
        this.setUser(member,stream,()=>{
          this.$nextTick(()=>{
            console.log(555)
            let videoEle=document.getElementById(stream.id)
            WebIM.emedia.mgr.subscribe(member,stream,true,true,videoEle)
            WebIM.emedia.mgr.streamBindVideo(stream,videoEle)  
          })
        })
      }
    },
    WebIM.emedia.mgr.onMemberExited = (member)=> {// member: 退出会议成员信息
      if(member) this.deleMember(member.name)
    } 
  },
  components:{
    Invitor
  },
  watch:{
    callVideo(val){
      if(val){
        this.createRoom()
      }
    }
  },
  methods: {
    ...mapMutations(['updateVideoStatus','setRoomList','resetRoomList','delUserById']),
    seleUser(src,id){//点击成员列表
      this.curVideoSrc=src
      this.curUid=id
      this.renderMainVideo()
    },
    handleForbied(){//静音控制
      this.isForbied=!this.isForbied
      if(this.isForbied){
        WebIM.emedia.mgr.muteAll(this.conference.confrId)
      }else{
        WebIM.emedia.mgr.unmuteAll(this.conference.confrId)
      }
    },
    handleOverMeet(){//点击结束会议
      this.showOverMeet=true;
    },
    sureOverMeet(){//确定结束会议
      WebIM.emedia.mgr.exitConference(this.conference.confrId)
      this.showOverMeet=false;
      this.resetRoomList()
      this.updateVideoStatus(false);
    },
    clearDom(){
      let doms=document.getElementsByClassName('.user-video-wraper')
      this.isLoading=true
      for(var i=0;i<doms.length;i++){
        doms[i].innerHTML="";
      }
    },
    closeDialog(){
      this.updateVideoStatus(false)
      this.resetRoomList()
      this.curIndex=0;
    },
    invites(){
      if(this.roomList.length<3){
        this.$refs.invitor.showInvitor=true
      }else{
        this.$message.error('会议人数已超限制')
      }
    },
    async createRoom(){//创建视频会议
      let user=JSON.parse(localStorage.getItem('users'))
      const join_result = await WebIM.emedia.mgr.joinConference(this.conference.confrId, this.conference.password)
      if(join_result.joinId){
        let constaints = {
          audio: true,// 指定音频码率
          video: true
        }
        const pushedStream = await WebIM.emedia.mgr.publish(constaints)
        this.setRoomList({uid:user.id,nick_name:user.nick_name,name:'我',video_src:pushedStream,isLink:false,isMe:true})//将自己加入会议成员里面
        this.curVideoSrc=pushedStream
        this.curUid=user.id
        this.renderMainVideo()
      }
    },
    renderMainVideo(){//渲染主视频
      this.$nextTick(()=>{
        if(this.curVideoSrc){
          setTimeout(() => {
            let videoEle=document.getElementById('main-video')
            WebIM.emedia.mgr.streamBindVideo(this.curVideoSrc, videoEle)
            this.isLoading=false;
          },100)
        }
      })
    },
    renderUserVideo(item){//渲染成员视频
      this.$nextTick(()=>{
        if(item.video_src){
          setTimeout(() => {
            if(item.isMe){
              let videoEle=document.getElementById('memberMine')
              WebIM.emedia.mgr.streamBindVideo(item.video_src,videoEle)
            }else{
              let videoEle=document.getElementById(item.video_src.id)
              WebIM.emedia.mgr.streamBindVideo(item.video_src,videoEle)
            }
          },100)
        }
      })
    },
    getUser(uid){//根据用户id获取用户信息
      let user={}
      this.userList.forEach(item=>{
          if(uid==item.uid){
              user=item
          }
      })
      return user
    },
    setUser(member,src,callBack){//设置成员
      let me=localStorage.getItem('users');
      let video_src=""
      let isLink=false
      if(member.name&&member.name!=me.uid){
        let user=this.getUser(member.name);
        if(src&&src.owner.name!=me.uid){
          video_src=src
          isLink=true
        }
        let user2={
          uid:user.uid,
          nick_name:user.nick_name,
          name:user.name,
          video_src,
          isLink,
          isMe:false
        }
        this.setRoomList(user2)
        callBack&& callBack()
      }
    },
    deleMember(uid){//删除成员
      let me=localStorage.getItem('users')
      if(uid!=me.uid){
        this.delUserById([uid,(index)=>{
          console.log(index)
          if(this.roomList.length<=1){
            this.sureOverMeet()
          }else{
            this.curUid=this.roomList[index].uid
            this.curVideoSrc=this.roomList[index].video_src
            this.renderMainVideo();
          }
        }])
      } 
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.contractor-wraps{
  overflow:hidden;
  .meeting-container{
    height:700px;
    .meeting-top{
      height:580px;
      display:flex;
      .meeting-video-wraper{
        background:#26292d;
        flex:2.5;
        padding:15px;
        box-sizing: border-box;
        >>> .main-video{
          width:100%;
          height:100%;
        }
      }
      .meeting-users-list{
        flex:1;
        background:#2b2e32;
        border-left: 15px solid #33363b;
        padding:15px;
        box-sizing: border-box;
        height:580px;
        .user-list{
          margin-bottom: 0;
          li{
            height:180px;
            margin-bottom: 15px;
            background:#fff;
            cursor: pointer;
            padding:5px;
            box-sizing: border-box;
            border-radius: 8px;
            .user-video-wraps{
              height:100%;
              height:100%;
              background:#333;
              border-radius: 8px;
              overflow:hidden;
              position: relative;
              .user-video-wraper{
                width:100%;
                height:100%;
              }
              .user-video{
                width:100%;
                height:100%;
              }
            }
            .user-info-wraps{
              background:#219ff3;
              border-radius: 8px;
              height:100%;
              position: relative;
              color: #fff;
              .nick_name-wraper{
                display:flex;
                height:100%;
                align-items:center;
                justify-content:center;
                font-size:28px;
              }
            }
            .user-name-wraper{
              position:absolute;
              z-index:10;
              left:0;
              bottom: 10px;
              height:40px;
              line-height: 40px;
              font-size: 16px;
              padding: 0 10px;
              box-sizing: border-box;
              color: #fff;
            }
          }
          .active{
            background:goldenrod
          }
        }
        li:last-child{
          margin-bottom: 0;
        }
      }
    }
    .meeting-bottom{
      height:120px;
      background:#57555a;
      display:flex;
      justify-content:center;
      align-items:center;
      padding-top: 15px;
      box-sizing: border-box;
      .btn-groups{
        display:flex;
        justify-content:center;
        align-items:center;
        .btn-wraps{
          margin-right: 30px;
          cursor: pointer;
          .btn-icon-wraps{
            width:100px;
            height:50px;
            background:#43464a;
            border-radius: 30px;
            display:flex;
            justify-content:center;
            align-items:center;
            margin-bottom: 5px;
          }
          .over{
            background:#ff5521;
          }
          p{
            text-align: center;
            color:#fff;
          }
        }
      }
    }
  }
  .over-meet-modal{
    position:fixed;
    left:50%;
    top:50%;
    margin-left: -300px;
    margin-top: -80px;
    width:600px;
    height:160px;
    background:#333;
    z-index: 3000;
    border-radius: 10px;
    box-shadow: 0 0 10px #666;
    padding:15px;
    box-sizing: border-box;
    .meet-title{
      font-size: 24px;
      text-align:center;
      color: #fff;
      margin-bottom: 0;
    }
    p{
      text-align: center;
      color: #fff;
    }
    .meet-btn-block{
      .btn{
        color:#fff;
        width:80px;
        height:40px;
        text-align: center;
        line-height:40px;
        font-size: 15px;
        cursor: pointer;
        border-radius: 10px;
      }
      .cancel-btn{
        border:1px solid #fff;
      }
      .sure-btn{
        background:#ff5521;
      }
    }
  }
  .close{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    margin-right: 5px;
  }
  .close span{
    width: 18px;
    height: 3px;
    background: #45516E;
    border-radius: 2px;
  }
}

</style>

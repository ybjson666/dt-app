<template>
<div class="tinntay-cont talent-eva">
    <div class="talentAudit r410" style="padding:0;">
      <el-row class="h101">
          <el-row class="zscore1" style="padding-top:0;padding-right:0;">
            <div class="whole-wrapper">
              <!-- 左边的聊天列表 -->
              <div class="left_whole_wrapper">
                <div class="left-lt">
                  <span>消息列表</span>
                </div>
                <!-- 搜索框 -->
                <div class="search-bd">
                  <el-input class="bd" placeholder="搜索" v-model="find" @input="searchChange">
                    <i slot="prefix" class="el-input__icon" :style="{'backgroundImage': 'url(' + searchImg + ')'}"></i>
                  </el-input>
                </div>
                <!-- 聊天列表 -->
                <div class="left_wrapper" style="overflow-y:auto;">
                  <div>
                    <div class="left-item" v-for="(item,index) in chatList" :key="index" @click="clickItem(item,index)" :class="{active:curUid===item.uid}">
                      <div class="left-item-left">
                        <!-- <div class="left-item-head">
                          <img :src="item.head" class="eee">
                        </div> -->
                        <div class="left-item-info">
                          <div class="left-item-info_title">
                            <div class="left-item-info_tl">
                              <span v-if="item.userType==1">雇员：</span>
                              <span v-else-if="item.userType==2">雇主：</span> 
                              <span v-else-if="item.userType==3">顾问：</span> 
                              <span v-else>用户：</span>  
                              <span>{{item.nickname||item.name||item.uid}}</span>
                            </div>
                            <div class="left-item-time-time">
                              <span>{{renderTime(item.chat_time)}}</span>
                            </div>
                          </div>
                          <div class="left-item-info_content">
                            <span v-if="item.msgInfo.type=='txt'">{{item.msgInfo.msg}}</span>
                            <span v-if="item.msgInfo.type=='audio'">一条语音消息...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 中间的对话-->
              <div class="center_whole_wrapper">
                <div class="center_wrapper">
                  <!-- 上面的表头 -->
                  <div class="center_wrapper_top">
                    <div class="center_wrapper_top_name">
                      <div class="chat-top">
                          <span v-if="getUType(curUser.uid)">{{getUType(curUser.uid)}}</span> 
                          <span v-else>用户</span> 
                          <span v-if="getuserNickname(curUser.uid)">{{getuserNickname(curUser.uid)}}</span>
                          <span v-else>{{curUser.uid}}</span>
                      </div>
                    </div>
                  </div>
                  <!-- 中间的聊天框，尝试模拟数据 -->
                  <div class="center_wrapper_center" v-loading="isLoading" :class="{overFlow:isLoading}" ref="scrollWraps">
                    <div class="moreMsgs" @click="loadMoreMsgs">{{loadText}}</div>
                    <div v-for="(item,index) in msgList" :key="index" class="message-group">
                        <h4>{{item.from}}</h4>
                        <!-- 撤回消息 -->
                        <div v-if="item.status == 'recall'" class="recallMsg">{{item.msg}}</div>
                        <div v-if="item.status == 'recall'" class="recallMsg">{{renderTime(item.time)}}</div>
                        <!-- 撤回消息 end -->
                        <a-dropdown
                          v-else
                          :trigger="['contextmenu']"
                          :style="{'float':item.bySelf ? 'right':'left'}"
                          :disabled="!item.bySelf"
                        >
                          <div style="user-select: none">
                            <!-- 图片消息 -->
                            <img
                              :key="item.msg"
                              :src="item.msg?item.msg:''"
                              v-if="item.type === 'img'"
                              class="img-style"
                            />
                            <!-- 文件card -->
                            <div
                              v-else-if="item.type==='file'"
                              class="file-style"
                              :style="{'float':item.bySelf ? 'right':'left'}"
                            >
                              <el-card :body-style="{ padding: '0px' }">
                                <div style="padding: 14px;">
                                  <h2>文件</h2>
                                  <span>
                                    <h3>{{item.filename}}</h3>
                                  </span>
                                  <div class="bottom clearfix">
                                    <span>{{readablizeBytes(item.file_length)}}</span>
                                    <a :href="item.msg" :download="item.filename">点击下载</a>
                                  </div>
                                </div>
                              </el-card>
                            </div>
                            <!-- 名片card -->
                            <div
                              v-else-if="item.type==='card'"
                              class="file-style"
                              :style="{'float':item.bySelf ? 'right':'left'}"
                            >
                              <el-card :body-style="{ padding: '0px'}">
                                <div class="card-wraps">
                                  <h2 class="card-title">名片</h2>
                                  <div class="card-body">
                                    <div class="avatar-block">
                                      <img :src="item.fileData.userImage |imgFormat" alt="" v-if="item.fileData.userImage">
                                      <img :src="avatar" alt="" v-else>
                                    </div>
                                    <div class="body-bottom">
                                        <div v-if="item.fileData.name" class="card-rows"><span class="row-label">姓名:</span><span>{{item.fileData.name}}</span></div>
                                        <div v-if="item.fileData.nickname" class="card-rows"><span class="row-label">昵称:</span><span>{{item.fileData.nickname}}</span></div>
                                        <div v-if="item.fileData.age" class="card-rows"><span class="row-label">年龄:</span><span>{{item.fileData.age}}</span></div>
                                        <div v-if="item.fileData.level" class="card-rows"><span class="row-label">职位:</span><span>{{item.fileData.level}}</span></div>
                                        <div v-if="!item.fileData.nickname&&!item.fileData.name" class="card-rows">
                                          <span class="row-label" v-if="item.fileData.userType=='1'">雇员:</span>
                                          <span class="row-label" v-if="item.fileData.userType=='2'">雇主:</span>
                                          <span>{{item.fileData.hid}}</span>
                                        </div>
                                        <div v-if="item.fileData.phone" class="card-rows"><span class="row-label">电话:</span><span>{{item.fileData.phone}}</span></div>
                                    </div>
                                  </div>
                                </div>
                              </el-card>
                            </div>
                            <!--订单消息-->
                            <div class="order-wrapers" 
                              v-else-if="item.type==='order'"
                              :style="{'float':item.bySelf ? 'right':'left'}">
                              <el-card :body-style="{ padding: '0px'}">
                                <div class="order-contents">
                                  <h2 class="card-title">订单消息</h2>
                                  <div class="order-title">{{item.fileData.title}}</div>
                                  <div class="order-info">
                                    <span>需求时间:</span>
                                    <span>{{item.fileData.startTime}}</span>
                                    <span class="salary">{{item.fileData.salary}}</span>
                                  </div>
                                </div>
                              </el-card>
                            </div>
                            <!-- 音频消息 -->
                            <div v-else-if="item.type==='audio'" :style="{'float':item.bySelf ? 'right':'left'}" class="audio-row">
                              <audio :src="item.msg" controls v-if="item.msg.substring(item.msg.length - 3) !== 'amr'"></audio>
                              <img :src="renderIcon(item.play_icon)" alt="" v-else class="voice-icon" @click="playVoice(item)"/>
                            </div>
                            <!-- 视频消息 -->
                            <div v-else-if="item.type==='video'">
                              <video :src="item.msg" width="200" controls></video>
                            </div>
                            <!-- 聊天消息 -->
                            <p
                              style="user-select: text"
                              v-else
                              
                              :class="{ 'byself': item.bySelf}"
                            >
                              <span v-if="!isEmoji(item.msg)">{{item.msg}}</span>
                              <span v-else>
                                <img :src="getEmojis(emojis)" v-for="(emojis,idn) in item.msg.split(',')" :key="idn">
                              </span>
                            </p>

                          </div>
                          <a-menu slot="overlay" >
                              <a-menu-item  key="1" @click="handleCommand(item)">撤回</a-menu-item>
                          </a-menu>
                        </a-dropdown>
                        <!-- 聊天时间 -->
                        <div
                          v-if="item.status !== 'recall'"
                          class="time-style"
                          :style="{'text-align':item.bySelf ? 'right':'left'}"
                        >{{renderTime(item.time)}} {{item.bySelf?status[item.status]:''}}
                        </div>
                    </div>
                    <p class="noneData" v-if="!msgList.length">暂无消息</p>
                  </div>
                  <!-- 下面的输入框，发送 -->
                  <div class="center_wrapper_right">
                    <div class="icon-list clearfix">
                      <!-- 表情 -->
                      <div class="icon-item" title="表情">
                        <el-popover placement="top" width="346" v-model="showEmoji" ref="popover">
                          <div style="width: 100%;height: 200px;display: flex;flex-wrap: wrap;overflow-y:auto;">
                            <div class="emoji_icon" v-for="(item,index) in emojiList" :key="index"
                                  @click="clickEmoji(index)">
                              <img :src="require(`../../static/faces/${item}`)" alt="" class="emoji-pic">
                            </div>
                          </div>
                        </el-popover>
                        <span slot="reference"><img :src="emImg1" alt="" v-popover:popover></span>
                      </div>
                      <!-- 发送图片 -->
                      <div class="icon-item">
                        <div class="icon-item" title="发送图片" @click="clickFile"><img :src="emImg2" alt="" ></div>
                        <input type="file" class="hide" ref="imgDom" @change="pictureChange" />
                      </div>
                      <!-- 发送文件 -->
                      <div class="icon-item" title="发送文件">
                        <div class="icon-item" title="发送文件" @click="clickFile2"><img :src="emImg3" alt="" ></div>
                        <input type="file" class="hide" ref="fileDom" @change="fileChange" /> 
                      </div>
                      <!-- 名片 -->
                      <div class="icon-item" title="雇员名片" @click="openSendCard"> <img :src="emImg4" alt=""> </div>
                      <!-- 视频通话 -->
                      <div class="icon-item" title="视频会议" @click="createRoom"> <img :src="emImg5" alt=""> </div>
                      <!-- 用户信息 -->
                      <div class="icon-item" title="需求订单" @click="clickHistory"> <img :src="emImg6" alt=""> </div>
                      <!-- 模拟消息提醒弹框 -->
                    </div>
                    <el-input type="textarea" :rows="2" placeholder="" v-model="sendMsg" @focus="focusInput" class="msgEara"></el-input>
                    <el-button type="primary" class="bd" @click="sendMessage">发送</el-button>
                  </div>
                </div>
              </div>
              <!-- 右边信息 -->
              <div class="center_whole_wrapper right_whole_wrapper" v-if="!showHistory">
                <div class="member">
                  <div class="member-content">
                    <OrderCard @sendOrder="sendOrder"/>
                  </div>
                </div>
              </div>
            </div>
          </el-row>
      </el-row>
    </div>
    <Contractor ref="contractor" @sendPerson="sendPerson"/>
  </div>
</template>
<script>
import moment from "moment";
import emoji from "../../config/emoji";
import Contractor from '../../components/contractor/Contractor.vue'
import { mapGetters,mapActions,mapState,mapMutations } from 'vuex'
import BenzAMRRecorder from 'benz-amr-recorder'
import OrderCard from '@/components/OrderCard.vue'
import config from "../../utils/WebIMConfig";
export default {
  components: {
      Contractor,
      OrderCard
  },
  data() {
    return {
      searchImg: require('@/assets/images/search.png'),
      addImg: require('@/assets/images/addmember.png'),
      emImg1: require('@/assets/images/em1.png'),
      emImg2: require('@/assets/images/em2.png'),
      emImg3: require('@/assets/images/em7.png'),
      emImg4: require('@/assets/images/em4.png'),
      emImg5: require('@/assets/images/em5.png'),
      emImg6: require('@/assets/images/files.png'),
      avatar: require('@/assets/images/head_man.png'),
      findList: [],
      find: '',
      sendMsg: '',
      showHistory: false,
      emojiList: emoji.obj,
      status: {
        sending: "发送中",
        sent: "已发送",
        read: "已读"
      },
      curUser:{},
      showEmoji:false,
      emojiArr:[],
      isLoading:false,
      loadText:"加载更多",
      getType:'refresh',
      curUid:localStorage.getItem('curUid2')||"",
      chatList:[],
      listArr:[]
    }
  },
  computed:{
    ...mapGetters({
        getShowFlag:'getShowFlag',
        userList:"getChatUserListGetters",
        friendsList:"getUserListGetters",
        msgList:"getMsgListGetters"
      }
    ),
    ...mapState(['unReadMsg'])
  },
  destroyed(){
    this.$store.commit('resetMsgList',[])
  },
  methods: {
    ...mapActions(['onSendText','getHistoryMessage','sendImgMessage','sendFileMessage',
    'shareFriends','sendOrderMsg','sendConferenceMsg']),
    ...mapMutations(['updateLinkStatus','updateVideoStatus','setConference','setPushedStream',
    'setChatUsers','setCurChatId','redMsg']),
    getuserName(uid){//根据id获取用户名字
      let username=""
      this.friendsList.forEach(item=>{
        if(item.uid==uid){
          if(item.nickname){
            username=item.nickname
          }else{
            username=item.uid
          }
        }else{
          username=uid
        }
      })
      return username
    },
    renderTime(time){
      const nowStr = new Date();
      const localStr = time ? new Date(time) : nowStr;
      const localMoment = moment(localStr);
      const localFormat = localMoment.format("MM-DD hh:mm ");
      return localFormat;
    },
    // 点击出现聊天记录
    clickHistory() {
      this.showHistory = !this.showHistory;
    },
    clickItem(item) {  // 点击聊天列表的某一项
      this.isLoading=true
      this.curUid=item.uid
      localStorage.setItem('curUid2',item.uid)
      this.curUser=item
      this.getType='refresh'
      this.getMsgList()
    },
    getMsgList(){//获取消息
      WebIM.conn.mr_cache = []
      this.getHistoryMessage([{id:this.curUser.uid,getType:this.getType},(data)=>{
        if(data.hasMore){
          this.loadText="加载更多"
        }
        this.isLoading=false;
        this.scollBottom()
      }])
    },
    readablizeBytes(value){
      let s = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
      let e = Math.floor(Math.log(value) / Math.log(1024));
      return (value / Math.pow(1024, Math.floor(e))).toFixed(2) + " " + s[e];
    },
    isEmoji(txt){//判断是否是emoji表情
      const regex = /(\[.*?\])/g;
      if(regex.exec(txt)){
        return true
      }else{
        return false
      }
    },
    getEmojis(txt){//返回相对应的表情
      const regex = /(\[.*?\])/g;
      let match = null;
      let imgSrc=""
      while ((match = regex.exec(txt))) {
        if (match[1] in emoji.obj) {
          let v = emoji.obj[match[1]];
          imgSrc=require(`../../static/faces/${v}`)
        }
      }
      return imgSrc
    },
    customEmoji(value) {
      let imgSrc=require(`../../static/faces/${value}`)
      return `<img src="${imgSrc}" style="width:20px"/>`;
    },
    sendMessage(){//发送消息
      this.getType='refresh'
      if(!this.sendMsg){
        this.$message.error('请输入消息')
        return false;
      }
      let params={
        chatType: 'singleChat',
        message: this.sendMsg,
        chatId:this.curUser.uid,
      }
      this.onSendText([params,()=>{
        this.loadText="加载更多"
        this.sendMsg = ""
        this.emojiArr=[]
        this.scollBottom()
      }]);
    },
    clickEmoji(e){//选择表情
      this.emojiArr.push(e)
      this.sendMsg=this.emojiArr.join(',')
      this.showEmoji=false
    },
    clickFile() {//点击发送图片
      let img = this.$refs.imgDom;
      img && img.click();
    },
    clickFile2(){//点击发送文件
      let img = this.$refs.fileDom;
      img && img.click();
    },
    pictureChange(e) {
      let file = WebIM.utils.getFileUrl(e.target);
      if (!file.filename) {
        this.$refs.imgDom.value = null;
        return false;
      }
      let obj = {
        chatType: 'chatroom',
        chatId: this.curUser.uid,
        file: file,
        roomType: true,
        callback: () => {
          this.$refs.imgDom.value = null;
        }
      };
      this.sendImgMessage(obj,'img');
    },
    fileChange(e){
			let file = WebIM.utils.getFileUrl(e.target);
			if(!file.filename){
				this.$refs.fileDom.value = null;
				return false;
			}
			let obj = {
				chatType: 'singleChat',
        chatId: this.curUser.uid,
				file: file,
				roomType: false,
				callback: () => {
					this.$refs.fileDom.value = null;
				}
			};
			this.sendFileMessage([obj,()=>{
        this.scollBottom()
      }]);
		},
    loadMoreMsgs(){//加载更多消息
      this.getType="loadMore"
      this.isLoading=true
      this.getHistoryMessage([{id:this.curUser.uid,getType:this.getType},(data)=>{
        if(!data.hasMore){
          this.loadText="暂无更多消息"
        }
        setTimeout(() => {
          this.isLoading=false;
        }, 500);
      }])
    },
    focusInput(){
      this.scollBottom()
    },
    scollBottom() {
      setTimeout(() => {
        const dom = this.$refs.scrollWraps;
        if (!dom) return;
        dom.scrollTop = dom.scrollHeight;
      }, 0);
    },
    openSendCard(){//点击发送名片
      this.$refs.contractor.showContractor=true
    },
    getUserType(uid){//根据id获取用户类型
      let type=""
      this.friendsList.forEach(item=>{
        if(item.uid==uid){
          type=item.userType
        }
      })
      return type
    },
    sendPerson(person){//发送名片
      let usertype=this.getUserType(this.curUser.uid)
      if(usertype==1){//雇员，发送雇主需求订单
        this.$message.error('当前用户为雇员不能向雇员发送名片')
      }else if(usertype==2){//雇主，发送雇员名片
        let customExts=person;
        this.shareFriends([{customExts,chatId:this.curUser.uid},()=>{
            this.scollBottom()
        }])
      }
    },
    sendOrder(order){//发送订单
      let usertype=this.getUserType(this.curUser.uid)
      if(usertype==1){//雇员，发送雇主需求订单
        let customExts={}
          customExts.id=order.orderDemandCommon.id
          customExts.title=order.orderDemandCommon.title,
          customExts.startTime=order.orderDemandCommon.startTime
          let arr=order.orderDemandCommon.title.split('|')
          customExts.salary=arr[arr.length-2]
        this.sendOrderMsg([{customExts,chatId:this.curUser.uid},()=>{
            this.scollBottom()
        }])
      }else if(usertype==2){//雇主，发送雇员名片
        this.$message.error('当前用户为雇主不能向雇主发送订单')
      }
    },
    playVoice(item){//播放语音
      item.play_icon="voice2.png"
      this.playRec = new BenzAMRRecorder();
      this.playRec.initWithUrl(item.url).then(()=> {
        this.playRec.play();
      });
      this.playRec.onEnded(() =>{
        setTimeout(() => {
         item.play_icon="voice.png"
        },500)
      })
    },
    renderIcon(url){
      return require(`@/assets/images/${url}`)
    },
    async createRoom(){//创建视频会议
      if(this.curUser.uid){
        this.updateLinkStatus(true)
        let webImToken=localStorage.getItem('webImToken')
        let user=JSON.parse(localStorage.getItem('users'))
        let memName=`${config.appkey}_${user.id}`;
        WebIM.emedia.mgr.setIdentity(memName, webImToken)
        let password='123456'
        let params={
          confrType:10, //会议类型 10:普通会议模式、11:大会议模式、12:直播模式
          password,
          eventType:'chatroom', 
          rec:false, //是否录制
          recMerge:false, //是否合并
          supportWechatMiniProgram:false //是否支持小程序
        }
        const result=await WebIM.emedia.mgr.createConference(params)
        let confercnce={
          confrId:result.confrId,
          password:result.password
        }
        this.setConference(confercnce)//设置当前会议消息
        let curUser={
          uid:this.curUser.uid,
          name:this.getuserName(this.curUser.uid),
          nick_name:this.getuserNickname(this.curUser.uid),
          isLink:true,
          video_src:""
        }
        let payload={
          curUser:curUser,
          customExts:{
            confrId:result.confrId,
            password:result.password
          }
        }
        this.sendConferenceMsg([payload,()=>{//发送会议消息给对方
        this.scollBottom()
        if(result.confrId){
          setTimeout(() => {
            this.updateLinkStatus(false)
            this.updateVideoStatus(true)
          },100)
        }
      }])
      }else{
        this.$message.error('请选择联系人')
      }
    },
    searchChange() {// 搜索框变化
      let arr=[]
      if(this.find){
        this.listArr.forEach((item) => {
          if (item.uid.indexOf(this.find) != -1||item.nickname&&item.nickname.indexOf(this.find)!= -1||item.name&&item.name.indexOf(this.find)!= -1) {
            arr.push(item)
          }
        })
      }else{
        arr=this.listArr
      }
      this.chatList=arr;
    },
    renderChatList(){//渲染聊天列表
      let arr=this.userList.map(user=>{
        this.friendsList.map(item=>{
          if(item.uid==user.uid){
            user={
              ...user,
              ...item
            }
          }
        })
        return user
      })
      arr=arr.map(item=>{
        Object.keys(this.unReadMsg).map(uid=>{
          if(item.uid==uid){
            item.count=this.unReadMsg[uid].count
          }
        })
        return item
      })
      this.chatList=arr;
      this.listArr=arr;
    },
    getuserNickname(uid){//根据id获取用户昵称
      let nickname=""
      this.friendsList.forEach(item=>{
        if(item.uid==uid){
          if(item.nickname){
            nickname=item.nickname
          }else{
            nickname=item.uid
          }
        }
      })
      return nickname
    },
    getUType(uid){
      let username=""
      this.friendsList.forEach(item=>{
        if(item.uid==uid){
          if(item.userType==1){
            username='雇员'
          }else if(item.userType==2){
            username='雇主'
          }else{
            username='顾问'
          }
        }
      })
      return username
    },
  },
  mounted(){
    this.$nextTick(()=>{
      this.renderChatList()
    })
  }
}
</script>


<style scoped lang="scss">
  .whole-wrapper {
    display: flex;
    height: 100%;
  }
  /* 左边部分 */
  .left_whole_wrapper {
    display: flex;
    flex-direction: column;
    width: 280PX;
    border-radius: .07rem;
    border-right: 1px solid #E5E7E9;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .left-lt{
    padding: 15px 0;
    padding-left: 15px;
    line-height: 36px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
  }
  .left-lt a{
    width: 20px;
    height: 40px;
    border-radius: 4px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border: 1px solid #DCDFE6;
    border-left: 0;
    margin-right: 12px;
    position: relative;
  }
  .left-lt span{
    font-size: 20px;
    font-weight: 500;
    color: #202D40;
  }
  .left_wrapper {
    flex: 1;
  }

  .left_whole_wrapper .left-item {
    display: flex;
    /* justify-content: space-between; */
    padding: 18px 10px;
    cursor: default;
    border-bottom: 1px solid #E5E7E9;
  }
  .left-item:hover{
    background: #F7FBFF;
  }
  .active {
    background: #F7FBFF;
  }

  .left-item-left {
    width: 100%;
    display: flex;
  }
  
  .left-item-head{
    position: relative;
    width: 58px;
    height: 58px;
    border-radius: 4px;
  }
  .left-item-head img {
    width: 58px;
    height: 58px;
    border-radius: 4px;
    position: absolute;
    top: 0;
    left: 0;
  }

  .left-item-info {
    width: 100%;
    padding-left: 10px;
    box-sizing: border-box;
    position: relative;
    
  }

  .left-item-info_title {
    overflow:hidden;
  }
  .left-item-info_tl{
    float: left;
    width: 55%;
    font-size: 16px;
    font-weight: 500;
    text-align: left;
    color: #202D40;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .left-item-info_content {
    width: 80%;
    font-size: 14px;
    font-weight: 400;
    text-align: left;
    color: #8592A6;
    margin-top: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .left-item-time-time {
    float: right;
    font-size: 15px;
    font-weight: 400;
    text-align: right;
    color: #8592A6;
  }

  .search-bd {
    padding: 0 20px 10px;
    position: relative;
    height: .4rem;
    margin-bottom: .1rem;
  }
  .search-bd .el-input{
    position: absolute;
    top: 0;
    left: 0.2rem;
    right: .2rem;
    width: auto;
    height:40px;
    padding: 0 10px;
    padding-left: 40px;
  }
  .search-bd .el-input__icon{
    width: 0.22rem;
    height: 0.22rem;
    display: block;
    position: absolute;
    top: 50%;
    left: 0;
    margin-top: -0.11rem;
    background-size: 100% 100%;
    opacity: .5;
  }

  /* 中间部分*/
  .center_whole_wrapper {
    /* width: 500PX; */
    flex: 1;
  }

  .center_wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .center_wrapper_top {
    /* display: flex;
    align-items: center; */
    padding: 0 15px;
    /* flex: 1; */
    height: 56px;
  }

  .center_wrapper_top_name {
    display: flex;
    height: 100%;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    text-align: left;
    color: #202D40;
  }
  .center_wrapper_top_name img{
    width: 36px;
    height: 36px;
    overflow: hidden;
    border-radius: 4px;
    margin-right: 10px;
  }
  .center_wrapper_top_name span{
    background: #E2EBFF;
    border-radius: 2px;
    font-size: 12px;
    font-weight: 400;
    color: #427BFF;
    margin-left: 10px;
    padding: 0 4px;
  }


  .center_wrapper_center {
    flex: 10;
    padding: 15px;
    border-top: 1px solid #E5E7E9;
    border-bottom: 1px solid #E5E7E9;
    overflow-y: auto;
    box-sizing: border-box;
  }
  .center_wrapper_center::-webkit-scrollbar-corner, .center_wrapper_center::-webkit-scrollbar-track {
    background: #f8f8f8;
  }
 
  .center_wrapper_right {
    /* flex: 4; */
    height: 180PX;
    padding: 15px;
    position: relative;
  }
  /* 右边样式 */
  .right_whole_wrapper {
    width: 5rem;
    flex: none;
    border: none;
    color: #909090;
  }
  /* 几个图标 */
  .icon-list{
    margin-bottom: 10px;
  }
  .icon-list>div:not(:first-child) {
    margin-left: 15px;
    
  }
  .icon-list .icon-item{
    float: left;
    font-size: 14px;
    cursor: pointer;
  }
  .icon-list .icon-item img{
    width: 20px;
  }

  /* 修改组件样式 */
  .whole-wrapper .el-input__inner {
    border-radius: 5px;
  }

  .whole-wrapper .el-button--primary {
    width: 100px;
    height: 40px;
    background: #FF7E00;
    position: absolute;
    bottom: 20px;
    right: 20px;
    font-size: 16px;
    color: #fff;
  }
  .whole-wrapper .el-button--primary:hover {
    background: #FF7E00;
    color:#fff;
  }
/* emoji */
.emoji_icon{
    /* width: 5%; */
    padding: 5PX;
    cursor: default;
}
.eee{
  border: 1px solid #eee;
}

/* 联系人列表 */

.member{
  height: 100%;
  display: flex;
  flex-direction: column;
}
.member-content{
  flex: 1;
  border-top: 1px solid #E5E7E9;
  border-left: 1px solid #E5E7E9;
  overflow-y: auto;
  padding:0 10px;
  box-sizing: border-box;
  overflow:hidden;
}
.message-group{
    padding-top: 3px;
    font-size: 14px;
    line-height: 1.5;
    clear: both;
    width: 100%;
    overflow:hidden;
    p{
      list-style: none;
      background: #fff;
      text-align: left;
      margin: 5px 0 0 0;
      display: inline-block;
      padding: 13px 15px;
      margin-top: 11px;
      border-radius: 25px;
      border: 1px solid #eceff1;
      min-width: 100px;
      word-break: break-all;
    }
    .time-style{
      clear: both;
      margin-left: 2px;
      margin-top: 10px;
      font-size: 12px;
      color: #888c98;
    }
    .file-style{
      width: 240px;
      margin: 2px 2px 2px 0;
      font-size: 13px;
      h2{
        border-bottom: 1px solid #e0e0e0;
        font-weight: 300;
        text-align: left;
        font-size:13px;
      }
      span{
        h3{
          font-size:13px;
        }
        
      }
      .bottom{
        span{
          color: #999999;
          text-align: left;
        }
      }
      a{
        color: #999999;
        float: right;
        text-decoration: none;
      }
    }
    .img-style{
      width:200px;
    }
    .card-wraps{
      .card-title{
        padding:0 15px;
        box-sizing: border-box;
        line-height:40px;
      }
      .card-body{
        padding:15px;
        box-sizing: border-box;
        .avatar-block{
          width:80px;
          height:80px;
          border-radius: 50%;
          overflow:hidden;
          margin:0 auto;
          margin-bottom: 10px;
          img{
            width:100%;
            height:100%;
          }
        }
        .body-bottom{
          border-top:1px solid #eaeaea;
          padding-top:10px;
          box-sizing: border-box;
          .card-rows{
            line-height:30px;
            .row-label{
              margin-right:5px;
            }
          }
        }
      }
    }
    .audio-row{
      margin-bottom: 5px;
    }
    .voice-icon{
      width:30px;
      cursor: pointer;
    }
    .order-wrapers{
      background:#fff;
      .order-contents{
        padding:10px;
        box-sizing: border-box;
        h2{
          padding: 0 0.15rem;
          box-sizing: border-box;
          line-height: 0.4rem;
          font-size: 14px;
          border-bottom: 1px solid #e0e0e0;
          margin-bottom: 10px;
        }
        .order-title{
          color: #333;
          font-size: 18px;
          font-weight: 700;
        }
        .order-info{
          line-height:40px;
          font-size: 15px;
          color: #999;
          .salary{
            margin-left: 5px;
            color: red;
            font-size: 16px;
          }
        }
      }
    }
    
}
.hide {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 100%;
  min-height: 100%;
  filter: alpha(opacity=0);
  opacity: 0;
  cursor: inherit;
  display: none;
}
.overFlow{
  overflow-y:hidden!important;
}
.noneData{
  text-align: center;
  color:#eaeaea;
  font-size: 16px;
  line-height:60px;
}
.moreMsgs {
  background: #ccc !important;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  margin-bottom: 15PX;
}
.msgEara{
  border-top:1px solid #eaeaea;
}
</style>
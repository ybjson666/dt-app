import Vue from 'vue'
import Vuex from 'vuex'
import { getUserNickName } from '../api/api.js'
Vue.use(Vuex)

export default new Vuex.Store({
  // 模型
  state: {
    users: {
      birthday: null,
      channel: '',
      headPic: null,
      id: '',
      name: '',
      newUser: '',
      nickname: '',
      openid: null,
      phone: '',
      rimToken: null,
      sex: null,
      token: '',
      userType: null
    },
    // flag
    flag:true,
    flag2:false,
    // 实名合格flag
    flag3:true,
    // 雇员中心-认证table-cell
    talentDetail:JSON.parse(sessionStorage.getItem('talentDetail')),
    // 题库理论测试题答案
    talentExamDetail:sessionStorage.getItem('talentExamDetail'),
    // 元数据list
    sysMetaData:[],
    // 雇员认证activeName
    talentActiveName: 'first',
    // 雇员新增审核消息
    number1: 0,
    // 专家服务反馈审核消息
    number2: 0,
    // 雇主中心-table-cell
    orderDetail:JSON.parse(sessionStorage.getItem('orderDetail')),
    // 订单处理未发布处理中
    orderFlag:true,
    // 订单回收站可xx
    orderFlag2:true,
    // 订单详情-服务反馈(顾问专家)
    orderFlag3:true,
    // 操作日志-资金动向
    orderFlag4:true,
    // 财务报表-入账审核-待处理-历史审核
    entryFlag:true,
    // 消息联系人列表图标
    listFlag:true,
    // 显示隐藏消息联系人列表图标
    showFlag:true,
    // news 会话列表
    chatList:[],
    // receivemessage
    receiveMessage:{},
    // videoMessage
    videoMessage:{},
    // 无效丢单解约终止status
    setStatus:1,
    //聊天信息
    msgList:[],
    currentMsgs: [],
    noticeCallMsg: {},
    //黑名单
    blackList: {},
    //好友列表
    userList:[],
    //历史聊天用户列表
    chatUserList:[],
    isLinking:false,//视频连接弹框
    callVideo:false,//视频会议弹框
    inviting:false,//显示是否接收视频会议弹框,
    conference:{},//当前视频会议
    roomList:[//视频会议成员列表,
    ],
    conferUserId:"",//收到视频会议发起人的id
    pushedStream:{},//视频流
    unReadMsg:{},//所有未读消息
    curChatId:"",//当前聊天人id
    roleMenus:[]//权限菜单id
  },
  mutations: {
    // user
    updateUsers: (state, payload) => {
      state.users = payload
    },
    updateUsersToken: (state, payload) => {
      state.users.token = payload
    },
    // flag
    updateFlag: (state, payload) => {
      state.flag = payload
    },
    updateFlag2: (state, payload) => {
      state.flag2 = payload
    },
    // 实名合格flag
    updateFlag3: (state, payload) => {
      state.flag3 = payload
    },
    // 雇员中心-认证table-cell
    updateTalent: (state, payload) => {
      state.talentDetail = payload
    },
    // 题库理论测试题答案
    updateExamDetail: (state, payload) => {
      state.talentExamDetail = payload
    },
    // 元数据list
    updateSysMetaData: (state, data) => {
      for (let i = 0; i < state.sysMetaData.length; i++) {
        if(state.sysMetaData[i].id == data.id) state.sysMetaData[i] = data;
      }
    },
    // 雇员认证activeName
    updateTalentActiveName: (state, payload) => {
      state.talentActiveName = payload
    },
    // 雇员新增审核消息
    updateNumber1: (state, payload) => {
      state.number1 = payload
    },
    // 专家服务反馈审核消息
    updateNumber2: (state, payload) => {
      state.number2 = payload
    },
    // 雇主中心-table-cell
    updateOrder: (state, payload) => {
      state.orderDetail = payload
    },
    // 订单处理未发布处理中
    updateOrderFlag: (state, payload) => {
      state.orderFlag = payload
    },
    // 订单回收站可xx
    updateOrderFlag2: (state, payload) => {
      state.orderFlag2 = payload
    },
    // 订单详情-服务反馈(顾问专家)
    updateOrderFlag3: (state, payload) => {
      state.orderFlag3 = payload
    },
    // 操作日志-资金动向
    updateOrderFlag4: (state, payload) => {
      state.orderFlag4 = payload
    },
    // 财务报表-入账审核-待处理-历史审核
    updateEntryFlag: (state, payload) => {
      state.entryFlag = payload
    },
    // 消息联系人列表图标
    updateListFlag: (state, payload) => {
      state.listFlag = payload
    },
    // 显示隐藏消息联系人列表图标
    updateShowFlag: (state, payload) => {
      state.showFlag = payload
    },
    // news 会话列表
    updateChatList: (state, payload) => {
      state.chatList = payload
    },
    // receivemessage
    updateReceiveMessage: (state, payload) => {
      state.receiveMessage = payload
    },
    // videoMessage
    updateVideoMessage: (state, payload) => {
      state.videoMessage = payload
    },
    // 无效丢单解约终止status
    updateSetStatus: (state, payload) => {
      state.setStatus = payload
    },
    //更新消息阅读状态
    updateMessageStatus(state, message) {
      const { id, mid, action, readUser } = message;
      const { name} = 'chatroom';
      Object.keys(state.msgList[name]).forEach((user) => {
        if (action == "oneUserReadMsgs") {
          if (state.msgList[name][readUser]) {
            state.msgList[name][readUser].forEach((msg) => {
              if (msg.status != "recall") {
                msg.status = "read";
              }
            });
          }
        }
        else if (state.msgList[name][user].length) {
          state.msgList[name][user].forEach((msg) => {
            if (action === "readMsgs" && !msg.bySelf) {
              if (msg.status != "recall") {
                msg.status = "read";
              }
            }
            else if (msg.mid == id || msg.mid == mid) {
              msg.status = message.status;
              if (message.msg) {
                msg.msg = message.msg;
              }
            }
          });
        }
      });
    },
    //更新消息
    updateMsgList(state,payload){
      const { msg, bySelf, chatType, id,type } = payload;
    
			if(!state.msgList){
				state.msgList = [{
					msg,
					bySelf,
          chatType,
					type: type || "",
					mid: id,
					...payload
				}];
			}
			else{
				state.msgList.push({
					msg,
					bySelf,
          chatType,
					type: type || "",
					mid: id,
					...payload
				});
				state.msgList = state.msgList.sort((a, b) => {
					return a.time - b.time;
				});
			}
      // console.log(state.msgList)
			state.msgList = Object.assign([], state.msgList);
    },
    updateMessageMid(state, message){
			console.log(message)
			const { id, mid } = message;
      state.msgList.forEach((item) => {
			    if(item.mid == id){
			        item.mid = mid
			    }
			})
		},
		updateMessageStatus(state, message){//更新消息状态
			const { id, mid, action } = message;   
				if(action == "oneUserReadMsgs"){
						state.msgList.forEach((msg) => {
							if(msg.status != "recall"){
								msg.status = "read";
							}
						});
				}
				else if(state.msgList.length){
					state.msgList.forEach((msg) => {
						if(action === "readMsgs" && !msg.bySelf){
							if(msg.status != "recall"){
								msg.status = "read";
							}
						}
						else if(msg.mid == id || msg.mid == mid){
							msg.status = message.status;
							if(message.msg){
								msg.msg = message.msg;
							}
						}
					});
				}
		},
    resetMsgList(state,list){//重置会话消息
      state.msgList=list
    },
    setMsgList(state,list){//设置会话消息
      state.msgList=list.concat(state.msgList)
    },
    setUserList(state,user){//设置好友列表
      state.userList.push(user)
      // state.msgList = Object.assign([], state.msgList);
    },
    resetUserList(state){
      state.userList=[]
    },
    setChatUsers(state,list){//设置历史聊天会话列表
      state.chatUserList=list
    },
    updateLinkStatus(state,status){//更新视频链接状态
      state.isLinking=status
    },
    updateVideoStatus(state,status){//更新视频链接状态
      state.callVideo=status
    },
    updateInvitingStatus(state,status){//更新是否接收发起视频状态
      state.inviting=status
    },
    setConference(state,conference){//设置当前创建的视频会议
      state.conference=conference
    },
    setRoomList(state,user){//设置当前视频会议成员列表
      let arr=state.roomList
      let result=arr.find(item=>{
        return item.uid==user.uid
      })
      if(!result&&user.uid){
        arr.push(user)
      }else{
        arr=arr.map(item=>{
          if(item.uid==user.uid){
            item=user
            return item
          }else{
            return item
          }
        })
      }
      state.roomList=arr
    },
    setConferUserId(state,id){//设置视频发起人的id
      state.conferUserId=id
    },
    setPushedStream(state,stream){//设置视频流
      state.pushedStream=stream
    },
    resetRoomList(state){//重置会议成员列表
      state.roomList=[]
    },
    delUserById(state,[uid,callback]){//通过uid删除成员
      let index=state.roomList.findIndex(item=>item.uid==uid)
      state.roomList.splice(index,1)
      console.log(index)
      let preIndex=0;
      preIndex=index>0?index-1:state.roomList.length-1
      callback&&callback(preIndex)
    },
    setUnReadMsgs(state,msgId){//设置未读消息
      if(msgId!=state.curChatId){//排除正在和自己聊天的人
        let msgObj=state.unReadMsg
        if(!msgObj[msgId]){
          msgObj[msgId]={}
          msgObj[msgId].count=1
        }else{
          msgObj[msgId].count+=1
        }
        state.unReadMsg=msgObj
      }
    },
    setCurChatId(state,uid){//设置当前聊天人id
      state.curChatId=uid
    },
    redMsg(state,uid){//读取消息
      let obj=state.unReadMsg
      for(let msg in obj){
        if(msg==uid){
          obj[msg].count=0
        }
      }
      state.unReadMsg=obj
    },
    setRoleMenus(state,list){//设置权限菜单
      state.roleMenus=list
    }
  },
  getters: {
    // user
    getUsers: state => state.users,
    getUsersToken: state => state.users.token,
    // flag
    getFlag: state => state.flag,
    getFlag2: state => state.flag2,
    // 实名合格flag
    getFlag3: state => state.flag3,
    // 雇员中心-认证table-cell
    getTalent: state => state.talentDetail,
    // 题库理论测试题答案
    getExamDetail: state => state.talentExamDetail,
    // 元数据list
    getSysMetaData: state => state.sysMetaData,
    // 雇员认证activeName
    getTalentActiveName: state => state.talentActiveName,
    // 雇员新增审核消息
    getNumber1: state => state.number1,
    // 专家服务反馈审核消息
    getNumber2: state => state.number2,
    // 雇主中心-table-cell
    getOrder: state => state.orderDetail,
    // 订单处理未发布处理中
    getOrderFlag: state => state.orderFlag,
    // 订单回收站可xx
    getOrderFlag2: state => state.orderFlag2,
    // 订单详情-服务反馈(顾问专家)
    getOrderFlag3: state => state.orderFlag3,
    // 操作日志-资金动向
    getOrderFlag4: state => state.orderFlag4,
    // 财务报表-入账审核-待处理-历史审核
    getEntryFlag: state => state.entryFlag,
    // 消息联系人列表图标
    getListFlag: state => state.listFlag,
    // 显示隐藏消息联系人列表图标
    getShowFlag: state => state.showFlag,
    // news 会话列表
    getChat: state => state.chatList,
    // receivemessage
    getReceiveMessage: state => state.receiveMessage,
    // videoMessage
    getVideoMessage: state => state.videoMessage,
    // 无效丢单解约终止status
    getSetStatus: state => state.setStatus,
    getConStatus: state => state.connectStatus,
    /**环信模块 */
    getMsgListGetters:state=>state.msgList,
    getUserListGetters:state=>state.userList,
    getChatUserListGetters:state=>state.chatUserList,
    totalCount:(state)=>{//未读消息数
      let obj=state.unReadMsg
      let count=0
      for(let msg in obj){
        count+=obj[msg].count
      }
      return count
    }
  },
  actions: {
    /**环信模块 */
    onSendText: (context, [payload,callback])=>{//发送文字消息
			const { chatType, chatId, message } = payload;
			const id = WebIM.conn.getUniqueId();
			const time = Date().now;
			const msgObj = new WebIM.message("txt", id);
			msgObj.set({
				msg: message,
				to: chatId,
				chatType,
				success: function(){
					context.commit("updateMsgList", {
						chatType,
						chatId,
						msg: message,
						bySelf: true,
						time: time,
						mid: id,
						status: "sending"
					});
          callback&&callback()
				},
				fail: function(e){
					console.log("Send private text error", e);
				}
			});
			WebIM.conn.send(msgObj.body);
		},
    getHistoryMessage: (context, [payload,callback])=>{//获取历史消息
     
      const { id,getType }=payload
			const options = {
				queue: id,
				isGroup: false,
				count: 10, // 每次获取消息条数
				success: function(msgs){
          // console.log(msgs)
          let arr=[];
					try{
						if(msgs.length){
							const userInfo = JSON.parse(localStorage.getItem("users"));
							const userId = userInfo && userInfo.id;
							msgs.forEach((item) => {
								let time = Number(item.time);
								let msg = {};
								const bySelf = item.from == userId;
								if(!item.filename){
                  if(item.ext&&item.ext.hid){
                    console.log(item)
                    msg = {
                      chatType: "singleChat",
                      chatId: bySelf ? item.to : item.from,
                      msg:"",
                      bySelf: bySelf,
                      fileData:item.ext,
                      time: time,
                      mid: item.id,
                      status: "read",
                      type:'card'
                    };
                  }else if(item.ext&&item.ext.confrId){
                      msg = {
                        chatType: "singleChat",
                        chatId: bySelf ? item.to : item.from,
                        msg: `快来加入会议-${item.ext.confrId}`,
                        bySelf: bySelf,
                        time: time,
                        mid: item.id,
                        status: "read"
                      };
                  }else if(item.ext&&item.ext.id){
                    msg = {
                      chatType: "singleChat",
                      chatId: bySelf ? item.to : item.from,
                      fileData:item.ext,
                      bySelf: bySelf,
                      time: time,
                      mid: item.id,
                      type:'order',
                      status: "read"
                    };
                  }else{
                    msg = {
                      chatType: "singleChat",
                      chatId: bySelf ? item.to : item.from,
                      msg: item.data,
                      bySelf: bySelf,
                      time: time,
                      mid: item.id,
                      status: "read"
                    };
                  }
								}else{
                  if(!item.ext.file_length && item.filename !== "audio" && item.filename.substring(item.filename.length - 3) !== "mp4"&& item.filename.substring(item.filename.length - 3) !== "amr"){ // 为图片的情况
                    msg = {
                      msg: item.url,
                      chatType: "singleChat",
                      chatId: bySelf ? item.to : item.from,
                      bySelf: bySelf,
                      type: "img",
                      time: time,
                      mid: item.id,
                      status: "read"
                    };
                  }
                  else if(!item.ext.file_length&&item.filename.substring(item.filename.length - 3)=='amr'){
                    // console.log(item)
                    msg = {
                      msg: item.filename,
                      chatType: "singleChat",
                      chatId: bySelf ? item.to : item.from,
                      bySelf: bySelf,
                      type: "audio",
                      time: time,
                      url:item.url,
                      play_icon:'voice.png'
                    };
                    
                  }
                  else if(item.filename.substring(item.filename.length - 3) === "mp4"){
                    msg = {
                      msg: item.url,
                      chatType: "singleChat",
                      chatId: bySelf ? item.to : item.from,
                      bySelf: bySelf,
                      type: "video",
                      time: time,
                    };
                  }
                  else{
                    msg = {
                      msg: item.url,
                      chatType: "singleChat",
                      chatId: bySelf ? item.to : item.from,
                      bySelf: bySelf,
                      type: "file",
                      filename: item.filename,
                      file_length: item.file_length,
                      time: time,
                      mid: item.id,
                      status: "read"
                    };
                  }
                }
								
								msg.isHistory = true;
                arr.push(msg)
                
							});
              arr = arr.sort((a, b) => {
                return a.time - b.time;
              });
              // console.log(arr)
              if(getType==='refresh'){
                context.commit('resetMsgList',arr)
              }else{
                context.commit('setMsgList',arr)
              }
              callback&&callback({hasMore:true})
							context.commit("updateMessageStatus", { action: "readMsgs" });
						}else{
              if(getType==='refresh'){
                context.commit('resetMsgList',arr)
                callback&&callback({hasMore:false})
              }else{
                context.commit('setMsgList',arr)
                callback&&callback({hasMore:false})
              }
             
            }
					}
					catch(e){
						console.log("error", e);
					}
				},
				fail: function(){ }
			};
			WebIM.conn.fetchHistoryMessages(options);
		},
    sendImgMessage: (context, [payload,callback])=>{//发送图片
			const { chatType, chatId, roomType, file} = payload;
			const id = WebIM.conn.getUniqueId();
		
			const msgObj = new WebIM.message("img", id);
			msgObj.set({
				apiUrl: WebIM.config.apiURL,
				file: file,
				to: chatId,
				roomType: roomType,
				onFileUploadError: function(error){
					console.log("图片上传失败", error);
					callback&&callback();
				},
				onFileUploadComplete: function(data){
					let url = data.uri + "/" + data.entities[0].uuid;
					context.commit("updateMsgList", {
						msg: url,
						chatType,
						chatId: chatId,
						bySelf: true,
						type: "img",
						time: data.timestamp,
						mid: id,
						status: "sending"
					});
				},
				success: function(){
					console.log("图片发送成功");
          callback();
				}
			});
			WebIM.conn.send(msgObj.body);
		},
    sendFileMessage: (context, [payload,callback])=>{//发送文件
			const { chatType, chatId, roomType, file } = payload;
			const id = WebIM.conn.getUniqueId();
			const msgObj = new WebIM.message("file", id);
			msgObj.set({
				apiUrl: WebIM.config.apiURL,
				file: file,
				ext: {
					file_length: file.data.size
				},
				to: chatId,
				roomType: roomType,
				onFileUploadError: function(error){
					console.log("文件上传失败", error);
					callback&&callback();
				},
				onFileUploadComplete: function(data){
					let url = data.uri + "/" + data.entities[0].uuid;
					context.commit("updateMsgList", {
						msg: url,
						chatType,
						chatId: chatId,
						bySelf: true,
						type: "file",
						filename: file.data.name,
						file_length: file.data.size,
						time: data.timestamp,
						mid: id,
						status: "sending"
					});
				},
				success: function(){
					callback();
				}
			});
			WebIM.conn.send(msgObj.body);
		},
    shareFriends:(context, [payload,callback])=>{//发送名片
      const {customExts,chatId }=payload
      var id = WebIM.conn.getUniqueId();                 // 生成本地消息id
      var msg = new WebIM.message('custom', id);   // 创建自定义消息
      var customEvent = "MP";             // 创建自定义事件
      const time = Date.now();
      msg.set({
          to: chatId,                          // 接收消息对象（用户id）
          customEvent,
          customExts,
          ext:customExts,                                  // 消息扩展
          roomType: false,
          success:(id)=> {
            context.commit("updateMsgList", {
              msg: "",
              chatType: "singleChat",
              chatId: chatId,
              bySelf: true,
              type: "card",
              time: time,
              fileData:customExts,
              status: "sending",
              id
            });
            callback&&callback()
          },
          fail: function(e){}
      });
      WebIM.conn.send(msg.body);
    },
    getUsers:(context)=>{//获取好友列表
      WebIM.conn.getRoster().then((res) => {
        if(res.data.length){
            res.data.forEach(async (item)=>{
                let params={
                    uid:item,
                }
                let user={}
                const result=await getUserNickName(params)
                if(result.code===200){
                    user={...result.data,uid:item}
                }
                context.commit("setUserList", user)
            })
        }
      })
    },
    getChatUsers:(context,callback)=>{//获取历史会话人列表
      WebIM.conn.getSessionList().then(data=>{
        let list=data.data.channel_infos;
        let arr=[];
        arr=list.map(item=>{
          let user={}
          let str=item.channel_id.split('#')[1]
          let str2=str.split("_")[1]
          let str3=str2.split("@")[0]
              user.uid=str3
              user.chat_time=item.meta.timestamp
              user.msgInfo=JSON.parse(item.meta.payload).bodies[0]
              user.msgId=item.meta.id
            return user
        })
        context.commit('setChatUsers',arr)
        callback&&callback()
      })
    },
    sendConferenceMsg:(context,[payload,callback])=>{//发送会议消息
      let {customExts,curUser }=payload
      var id = WebIM.conn.getUniqueId();                 // 生成本地消息id
      var msg = new WebIM.message('custom', id);   // 创建自定义消息
      var customEvent = "SP"; 
      const time = Date.now();
      msg.set({
          to: curUser.uid,
          msg:`快来加入会议-${customExts.confrId}`,                          // 接收消息对象（用户id）
          ext:customExts,                                  // 消息扩展
          chatType: "singleChat",
          customEvent,
          msg_custom_invited:true, 
          success:()=> {
            context.commit('setRoomList',curUser)
            context.commit("updateMsgList", {
              msg: `快来加入会议-${customExts.confrId}`,
              chatType: "singleChat",
              chatId: curUser.uid,
              bySelf: true,
              type: "",
              time: time,
              status: "sending",
              id
            });
            callback()
          },
          fail: function(e){}
      });
      WebIM.conn.send(msg.body);
    },
    sendOrderMsg(context,[payload,callback]){//发送订单消息
      const {customExts,chatId }=payload
      var id = WebIM.conn.getUniqueId();                 // 生成本地消息id
      var msg = new WebIM.message('custom', id);   // 创建自定义消息
      var customEvent = "OD";             // 创建自定义事件
      const time = Date.now();
      msg.set({
          to: chatId,                          // 接收消息对象（用户id）
          customEvent,
          customExts:{},
          ext:customExts,                                  // 消息扩展
          roomType: false,
          success:(id)=> {
            context.commit("updateMsgList", {
              msg: "",
              chatType: "singleChat",
              chatId,
              bySelf: true,
              type: "order",
              time: time,
              fileData:customExts,
              status: "sending",
              id
            });
            callback&&callback()
          },
          fail: function(e){}
      });
      WebIM.conn.send(msg.body);
    }
  },
  modules: {}
})

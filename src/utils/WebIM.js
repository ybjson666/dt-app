import config from "./WebIMConfig";
import websdk from "easemob-websdk";
import emedia from 'easemob-emedia';
import { Message } from "element-ui";

function ack(message) {
	var bodyId = message.id; // 需要发送已读回执的消息id
	var msg = new WebIM.message("read", WebIM.conn.getUniqueId());
	msg.set({
		id: bodyId,
		to: message.from
	});
	WebIM.conn.send(msg.body);
}

// 初始化IM SDK
var WebIM = {};
WebIM = window.WebIM = websdk;
WebIM.config = config;
WebIM.emedia=emedia;
WebIM.conn = new WebIM.connection({
	appKey: WebIM.config.appkey,
	isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
	https: WebIM.config.https,
	isAutoLogin: true,
	heartBeatWait: WebIM.config.heartBeatWait,
	autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
	autoReconnectInterval: WebIM.config.autoReconnectInterval,
	isStropheLog: WebIM.config.isStropheLog,
	delivery: WebIM.config.delivery,

	//公有云 isHttpDNS 默认配置为true
	isHttpDNS: WebIM.config.isHttpDNS,

	// 私有云设置，详细文档：http://docs-im.easemob.com/im/web/other/privatedeploy
	// isHttpDNS: false,
	// url: 'xxx', // 设置为私有云的websocket server url
	// apiUrl: 'xxx' // 设置为私有云的rest server url
});

// 注册监听回调
WebIM.conn.listen({
	onOpened: function (message) { // 连接成功回调
		console.log('链接成功')
		localStorage.setItem('isConnect',true)
		Vue.$store.commit("resetUserList")
		Vue.$store.dispatch("getUsers")
		Vue.$store.dispatch("getChatUsers")
		WebIM.emedia.config({
			appkey:WebIM.config.appkey,
			consoleLogger: true,
		 });
	},
	onClosed: function (message) {
		console.log('掉线啦')
	}, // 连接关闭回调
	onTextMessage: (message)=> {// 收到文本消息
		console.log(message)
		const { from,id,data,to } = message;
		let user=JSON.parse(localStorage.getItem('users')) 
		if(user.id==to){
			Vue.$store.commit("setUnReadMsgs",from)
			Vue.$store.commit("updateMsgList", {
				chatType: 'singleChat',
				chatId: from,
				msg: data,
				bySelf: false,
				from: from,
				mid:id,
				isRead:false
			});
		}
	}, 
	onEmojiMessage: function (message) {// 收到表情消息
		console.log("onEmojiMessage", message);
		const { from,to } = message;
		let user=JSON.parse(localStorage.getItem('users')) 
		if(user.id==to){
			Vue.$store.commit("setUnReadMsgs",from)
		}
	}, 
	onPictureMessage: function (message) {// 收到图片消息
		const { from, to, type } = message;
		let user=JSON.parse(localStorage.getItem('users')) 
		if(user.id==to){
			Vue.$store.commit("setUnReadMsgs",from)
			const chatId = type !== "chat" ? to : from;
			const typeMap = {
				chat: "contact",
				groupchat: "group",
				chatroom: "chatroom"
			};
			Vue.$store.commit("updateMsgList", {
				chatType: typeMap[message.type],
				chatId: chatId,
				msg: message.url,
				bySelf: false,
				type: "img",
				from: message.from
			});
			type === 'chat' && ack(message);
		}
	}, 
	onCmdMessage: function (message) {// 收到命令消息
		console.log("onCmdMessage", message);
		// Vue.$store.commit("setUnReadMsgs",message.from)
	}, 
	onAudioMessage: function (message) {// 收到音频消息
		const { from, to,type} = message;
		let user=JSON.parse(localStorage.getItem('users')) 
		if(user.id==to){
			Vue.$store.commit("setUnReadMsgs",from)
			const chatId = type !== "chat" ? to : from;
			let options = {
				url: message.url,
				headers: { Accept: "audio/mp3" },
				onFileDownloadComplete: function (response) {
					let objectUrl = WebIM.utils.parseDownloadResponse.call(WebIM.conn, response);
					Vue.$store.commit("updateMsgList", {
						chatType: 'singleChat',
						chatId: chatId,
						msg: objectUrl,
						bySelf: false,
						type: "audio",
						from: message.from
					});
				},
				onFileDownloadError: function () {
					console.log("音频下载失败");
				}
			};
			WebIM.utils.download.call(WebIM.conn, options);
			message.type === 'chat' && 	ack(message);
		}
	}, 
	onLocationMessage: function (message) {// 收到位置消息
		console.log("onLocationMessage", message);
		message.type === 'chat' && 	ack(message);
	}, 
	onFileMessage: function (message) {// 收到文件消息
		console.log(message)
		const { from, to, type } = message;
		let user=JSON.parse(localStorage.getItem('users')) 
		if(user.id==to){
			Vue.$store.commit("setUnReadMsgs",from)
			const chatId = type !== "chat" ? to : from;
			const typeMap = {
				chat: "contact",
				groupchat: "group",
				chatroom: "chatroom"
			};
			Vue.$store.commit("updateMsgList", {
				chatType: typeMap[message.type],
				chatId: chatId,
				msg: message.url,
				bySelf: false,
				type: "file",
				filename: message.filename,
				file_length: message.file_length,
				from: message.from
			});
			type === 'chat' && 	ack(message);
		}
	}, 
	onVideoMessage: function (message) {// 收到视频消息
		console.log("onVideoMessage", message);
		const { from, to, type } = message;
		let user=JSON.parse(localStorage.getItem('users')) 
		if(to==user.id){
			Vue.$store.commit("setUnReadMsgs",from)
			const chatId = type !== "chat" ? to : from;
			const typeMap = {
				chat: "contact",
				groupchat: "group",
				chatroom: "chatroom"
			};
			let options = {
				url: message.url,
				headers: {
					Accept: "audio/mp4"
				},
				onFileDownloadComplete: function (response) {
					let objectURL = WebIM.utils.parseDownloadResponse.call(WebIM.conn, response);
					Vue.$store.commit("updateMsgList", {
						chatType: typeMap[message.type],
						chatId: chatId,
						msg: objectURL,
						bySelf: false,
						type: "video",
						filename: message.filename,
						file_length: message.file_length,
						from: message.from
					});
				},
				onFileDownloadError: function () {
					console.log("视频下载失败");
				}
			};
			WebIM.utils.download.call(WebIM.conn, options);
			type === 'chat' && 	ack(message);
		}
	}, 
	onPresence: function (message) { // 处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢解散等消息
		console.log("收到一条新的消息", message);
	},
	onRoster: function (message) {// 处理好友申请
		// console.log("onRoster", message);
	}, 
	onInviteMessage: function (message) {// 处理群组邀请
		console.log("onInviteMessage", message);
	}, 
	onOnline: function () {// 本机网络连接成功
		console.log("onOnline 网络已连接");
	}, 
	onOffline: function () {// 本机网络掉线
		console.log("onOffline 网络已断开");
	}, 
	onError: function (message) {// 失败回调
	}, 
	onRecallMessage: message => {
		console.log("撤回消息", message);
		message.status = "recall";
		message.msg = "对方撤回了一条消息";
		Vue.$store.commit("updateMessageStatus", message);
	},
	onBlacklistUpdate: function (list) { // 黑名单变动
		// 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
		// 更新好友黑名单
		console.log("黑名单变动", list);
		let blackList = list;
		Vue.$store.commit("updateBlackList", blackList);
	},
	onReceivedMessage: function (message) {// 收到消息送达服务器回执
		// console.log("onReceivedMessage", message);
		Vue.$store.commit("updateMessageMid", message);
		message.status = "sent";
		Vue.$store.commit("updateMessageStatus", message);
	}, 
	onDeliveredMessage: function (message) {// 收到消息送达客户端回执
		console.log("onDeliveredMessage", message);
		// Vue.$store.commit('updateMessageStatus', message)
	}, 
	onReadMessage: function (message) {// 收到消息已读回执
		// console.log("onReadMessage", message);
		// message.status = "read";
		// Vue.$store.commit("updateMessageStatus", message);
	}, 
	onCreateGroup: function (message) {// 创建群组成功回执（需调用createGroupNew）
		console.log("onCreateGroup", message);
		Vue.$store.dispatch("onGetGroupUserList");
	}, 
	onMutedMessage: function (message) {// 如果用户在A群组被禁言，在A群发消息会走这个回调并且消息不会传递给群其它成员
		console.log("onMutedMessage", message);
	},
	onCustomMessage:(message)=>{//收到自定义消息
		console.log(message)
		const { ext,from,id,to }=message
		let user=JSON.parse(localStorage.getItem('users')) 
		if(user.uid==to){
			console.log(111)
			Vue.$store.commit("setUnReadMsgs",from)
			if(ext.confrId&&to==user.id){
				let callVideo=Vue.$store.state.callVideo
				if(callVideo){
					emedia.mgr.exitConference(ext.confrId)
					Message.error('当前正在通话中,新的视频通话已挂断')
				}else{
					let conference={
						confrId:ext.confrId,
						password:ext.password
					}
					Vue.$store.commit('setConferUserId',from)
					Vue.$store.commit("setConference",conference)
					Vue.$store.commit("updateInvitingStatus",true)
				}
				Vue.$store.commit("updateMsgList", {
					chatType: 'singleChat',
					chatId:from,
					msg: `快来加入会议-${customExts.confrId}`,
					bySelf: false,
					from:from,
					mid:id
				});

			}
		}
	} 
});
WebIM.WebRTC = window.webrtc; // 本项目引入 UMD 文件有问题，暂时这样引入
WebIM.EMedia = window.emedia ;

export default WebIM;

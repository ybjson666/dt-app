<template>
    <div class='invite-container' v-show="inviting">
        <div class="invite-content">
            <div class="invite-name">
                <span>{{invite_user.nickname||invite_user.uid}}</span>
            </div>
            <div class="invite-info">
                <p>{{invite_user.name||invite_user.uid}}</p>
                <p>邀请你加入{{invite_user.name||invite_user.uid}}发起的视频会议</p>
            </div>
        </div>
        <div class="btn-groups">
            <div class="btn-wraps fl" @click="refuseInvit">
                <div class="btn-icon refuse">
                    <img :src="phone_refuse" alt="" width="25px"/>
                </div>
                <p>拒绝</p>
            </div>
            <div class="btn-wraps fr" @click="acceptInvit">
                <div class="btn-icon accept">
                    <img :src="phone_accept" alt="" width="15px"/>
                </div>
                <p>接听</p>
            </div>
            <div class="cl"></div>
        </div>
    </div>
</template>

<script>
import { mapState,mapMutations } from 'vuex'
export default {
    name:'',
    data () {
        return {
           invite_user:{},
           phone_accept:require('@/assets/images/phone.png'),
           phone_refuse:require('@/assets/images/gddh.png'),
        };
    },
    computed:{
        ...mapState(['inviting','conferUserId','userList','conference'])
    },
    watch:{
        inviting(val){
            if(val){
                this.getUser()
            }
        }
    },
    methods: {
        ...mapMutations(['updateInvitingStatus','setRoomList','updateVideoStatus']),
        refuseInvit(){
            WebIM.emedia.mgr.exitConference(this.conference.confrId);
            this.updateInvitingStatus(false)
        },
        getUser(){//根据用户id获取用户信息
            let uid=this.conferUserId
            this.userList.forEach(item=>{
                if(uid==item.uid){
                    this.invite_user=item
                }
            })
        },
        acceptInvit(){//接收会议邀请
            this.updateInvitingStatus(false)
            this.updateVideoStatus(true)
        }
    }
}

</script>
<style lang='scss' scoped>
.invite-container{
    width:800px;
    height:500px;
    position:fixed;
    z-index: 2600;
    left:50%;
    margin-left: -400px;
    top:50%;
    margin-top: -250px;
    background:#333;
    border-radius: 6px;
    padding:40px 20px 30px 20px;
    box-sizing: border-box;
   .invite-content{
       display: flex;
       .invite-name{
           width:100px;
           height:100px;
           border-radius: 100%;
           background:#0380fe;
           color: #fff;
           text-align: center;
           line-height:100px;
           font-size: 14px;
           margin-right: 20px;
           overflow: hidden;
           text-overflow: ellipsis;
           white-space: nowrap;
       }
       .invite-info{
           height:100px;
           p{
               color:#fff;
               line-height:50px;
               margin-bottom: 0;
               font-size: 18px;
           }
       }
   }
   .btn-groups{
       width:60%;
       height:80px;
       left:20%;
       bottom:30px;
       position:absolute;
       .btn-wraps{
           .btn-icon{
                width:50px;
                height:50px;
                border-radius:100%;
                margin-bottom: 5px;
                display:flex;
                justify-content:center;
                align-items:center;
                cursor: pointer;
           }
           .refuse{
               background:#ff5407;
           }
           .accept{
               background:#00da25;
           }
           p{
               text-align: center;
               color:#fff;
               font-size: 18px;
           }
       }
   }
}
</style>
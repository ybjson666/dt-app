<template>
    <div class='invite-container'>
        <el-dialog 
        :visible.sync="showInvitor"
        :modal="true"
        :close-on-click-modal="false"
        :show-close="true"
        title="会议邀请"
        width="600px">
            <div class="dia-container">
                <div class="send-block">
                    <div class="send-body">
                        <div class="search-block">
                            <el-autocomplete
                                class="search-input"
                                v-model="searchPerson"
                                :fetch-suggestions="querySearch"
                                placeholder="搜索联系人"
                                :trigger-on-focus="false"
                                @select="handleSelectPerson"
                                v-if="hasPerson">
                                <template slot-scope="{ item }">
                                    <div class="interview-name">
                                        <span style="margin-right:5px">用户</span>
                                        <span v-if="item.nickname">{{item.nickname}}</span>
                                        <span v-if="item.name">{{item.name}}</span>
                                        <span v-else>{{item.uid}}</span>
                                    </div>
                                </template>
                            </el-autocomplete>
                            <div class="serach-result-block" v-if="findPerson.uid">
                                <span class="find-name" v-if="findPerson.nickname">{{findPerson.nickname}}</span>
                                <span class="find-name" v-else-if="findPerson.name">{{findPerson.name}}</span>
                                <span class="find-name" v-else>{{findPerson.uid}}</span>
                                <span class="clear" @click="clearPerson">x</span>
                            </div>
                        </div>
                    </div>
                    <div class="send-bottom">
                        <div class="btn-groups">
                            <el-button type="primary" class="btns send-btn" :disabled="!findPerson.uid"
                             @click="sendCard">确定({{sendNums}}/1)</el-button>
                            <el-button class="btns cancel-btn" @click="clearPerson">取消</el-button>
                        </div>
                    </div>
                </div>
                <div class="contract-block">
                    <h2 class="contact-title">通讯录</h2>
                    <ul class="contract-list">
                        <li v-for="(item,index) in userList" :key="index">
                            <el-radio-group v-model="selectId">
                                <el-radio :label="item.uid" @change="handleRadioChanges(item.uid)">
                                    <span style="margin-right:5px">用户</span>
                                    <span v-if="item.nickname">{{item.nickname}}</span>
                                    <span v-if="item.name">{{item.name}}</span>
                                    <span v-else>{{item.uid}}</span>
                                </el-radio>
                            </el-radio-group>
                        </li>
                    </ul>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters,mapState,mapActions} from 'vuex'
export default {
name:'',
    data () {
        return {
            searchPerson:"",
            hasPerson:true,
            findPerson:{},
            showInvitor:false,
            selectId:""
        };
    },
    computed:{
        ...mapGetters({userList:'getUserListGetters'}),
        ...mapState(['conference']),
        sendNums(){
            if(this.findPerson.uid){
                return 1
            }else{
                return 0
            }
        }
    },
    methods: {
        ...mapActions(['sendConferenceMsg']),
         querySearch(queryString,cb) {// 输入搜索人员时的匹配
            var restaurants = this.userList;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            cb(results)
        },
        createFilter(queryString) {
            return (restaurant) => {
                return Object.keys(restaurant).some(function(key) {
                    return (String(restaurant[key]).toLowerCase().indexOf(queryString.toLowerCase()) === 0)
                })
            };
        },
        handleSelectPerson(item){
            if(this.findPerson.name){
                this.$message.error('只能发送一个人')
                this.searchPerson=""
            }else{
                this.findPerson = item
            } 
        },
        handleRadioChanges(id){
            this.userList.map(item=>{
                if(item.uid==id){
                    this.findPerson=item
                }
            })
        },
        clearPerson(){
            this.findPerson={}
            this.selectId=""
        },
        sendCard(){//确定邀请
            const {confrId,password}=this.conference
            let curUser={
                uid:this.findPerson.uid,
                name:this.findPerson.name,
                nick_name:this.findPerson.nickname,
                isLink:true,
                video_src:"",
                isMe:false
            }
            let payload={
                curUser:curUser,
                customExts:{
                    confrId,
                    password
                }
            }
            this.sendConferenceMsg([payload,()=>{//发送会议消息给对方
                this.showInvitor=false;
                this.clearPerson();
            }])
        }, 
    }
}

</script>
<style lang='scss' scoped>
.invite-container{
    .dia-container{
        height:100%;
        display:flex;
        .send-block{
            flex:1;
            border-right: 1px solid #eaeaea;
            box-sizing: border-box;
            .send-body{
                height:calc(100% - 150px);
                .search-block{
                    padding:15px 20px;
                    box-sizing: border-box;
                    position:relative;
                    .search-input{
                        height:40px;
                        line-height:30px;
                        width:300px;
                        display:block;
                        border:1px solid #eaeaea;
                        border-radius: 16px;
                        color:#666;
                        padding-left:10px;
                        box-sizing: border-box;
                    }
                    .serach-result-block{
                        background:#ccc;
                        height:40px;
                        line-height: 32px;
                        box-sizing: border-box;
                        position:absolute;
                        left: 21px;
                        top:16px;
                        border-radius: 16px;
                        padding:0 5px;
                        .clear{
                            font-size: 26px;
                            margin-left: 8px;
                            cursor: pointer;
                        }
                    }
                }
            }
            .send-bottom{
                height:150px;
                border-top:1px solid #eaeaea;
                position:relative;
                .btn-groups{
                    position:absolute;
                    left:0;
                    bottom: 0;
                    padding:15px;
                    box-sizing: border-box;
                    .btns{
                        padding: 0.12rem 0.2rem;
                        border:1px solid #DCDFE6;
                    }
                    .send-btn{
                        color: #FFF;
                        background-color: #409EFF;
                        border-color: #409EFF;
                    }
                }
            }
        }
        .contract-block{
            width:350px;
            .contact-title{
                text-align: center;
                font-size: 24px;
                line-height:40px;
                padding-top:15px;
                height:40px;
                box-sizing: border-box;
            }
            .contract-list{
                margin-top: 20px;
                border-top:1px solid #eaeaea;
                padding:15px;
                box-sizing: border-box;
                overflow-y: scroll;
                height:calc(100% - 60px);
                margin-bottom: 0;
                li{
                    margin:5px 0;
                }
            }
        }
    }
}
</style>
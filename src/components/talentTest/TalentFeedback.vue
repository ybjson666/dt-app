<template>
  <div class="tinntay-cont talent-eva">
    <div class="talentAudit r410" style="padding:0;">
      <el-row class="h101">
        <el-row class="talent-exam">
          <el-col class="talent-exam-hd" :span="8">
            <el-row class="talent-exam-title color1 fw6">
              待审核消息
              <span class="talent-exam-news" :class="number >=10?'on':''" v-if="number > 0">{{number > 99?'99+':number}}</span>
            </el-row>
            <el-row class="talent-exam-btm" v-if="ecamList && ecamList.length > 0">
            <el-row class="talent-exam-list">
              <ul>
                <li :class="currentIndex == index?'on':''" v-for="(item,index) in ecamList" :key="index" @click="changeExamClick(index)">
                  <el-row class="talent-exam-lt flexbox align-items-center">
                    <img :src="item.headPic | imgFormat" alt="">
                    <div class="talent-exam-name flexbox flex-direction-column flex1">
                      <div class="gzname ft16 color1 fw5">
                        {{getUserType(item.userType)}}：{{item.name?item.name:'--'}}
                        <span class="date ft15 fw4 color4">{{item.createTime.substr(11,5)}}</span>
                      </div>
                      <div class="ft14 color4 fw4 ellips" style="margin-top:3px">{{item.title}}</div>
                    </div>
                  </el-row>
                </li>
              </ul>
            </el-row>
            <Page :currentPage="currentPage" :pageSize="pageSize" :total="total" @changePage="changePage"></Page>
            </el-row>
            <div class="zwsj" v-else>
              <img :src="zwsjImg" alt=""><br />
              暂无数据
            </div>
          </el-col>
          <el-col class="talent-exam-bd hd" :span="16">
            <el-row class="talent-exam-title color1 fw6">诉求详情</el-row>
            <el-row class="talent-exam-content" v-if="ecamList && ecamList.length > 0">
              <el-row class="talent-exam-cont" :class="currentIndex == index?'active':''" v-for="(item,index) in ecamList" :key="index">
                <el-row class="talent-exam-ct flexbox align-items-center">
                  <img :src="item.headPic | imgFormat" alt="" class="uimg">
                  <div class="talent-exam-cname flexbox flex-direction-column">
                    <span class="color1 fw5 ft16">{{item.name}}</span>
                    <span class="color3 fw4 ft16">ID:{{item.uid}}</span>
                  </div>
                  <div class="talent-exam-bt">
                    <el-button size="small" class="fen-btn">
                      <img :src="fenImg1" alt="" class="fenimg1">
                      <img :src="fenImg2" alt="" class="fenimg2">
                    </el-button>
                    <el-button size="small" class="fen-btn talent-exam-dot" title="转为顾问处理" @click="changeGu"></el-button>
                  </div>
                  <div class="talent-exam-num">
                    <p>订单编号：{{item.oid}}</p>
                    <p>反馈单号：{{item.id}}</p>
                    <p>反馈时间：{{item.createTime}}</p>
                  </div>
                </el-row>
                <el-row class="talent-exam-review">
                  <el-col :span="16" class="talent-exam-reviewlf">
                    <el-row class="talent-exam-review-title ft16 fw6 color1">{{item.title}}</el-row>
                    <el-row class="talent-exam-review-des fw4 color3">
                      <template v-if="item.msg !== null">
                        <el-row v-for="(sitem,index) in item.msg.answers" :key="index">
                          <template v-if="sitem.doStatus == 0 || sitem.doStatus == 11">
                          {{sitem.content}}
                          </template>
                        </el-row>
                      </template>
                      <template v-else>--</template>
                    </el-row>
                    <el-row class="talent-exam-review-cont">
                      <el-input type="textarea" class="talent-exam-review-tea" :rows="6" v-model="reviewTextarea" 
                       :placeholder="placeholder" :class="bdcolor?'on':''" @focus="textareaFocus" @blur="textareaBlur"></el-input>
                      <el-row class="talent-exam-review-back">
                        <el-button @click="replyClick(item.id,1)">回复给雇员</el-button>
                        <el-button @click="replyClick(item.id,2)">回复</el-button>
                      </el-row>
                    </el-row>
                  </el-col>
                  <el-col :span="8" class="talent-exam-reviewrt">
                      <el-row class="talent-exam-reviewlist" v-for="(item,index) in answerArr" :key="index">
                        <div class="talent-exam-left">
                          <div class="talent-exam-date ft14 fw6 color2">{{item.time.substr(5,2)+'月'+item.time.substr(8,2)+'日'}}</div>
                          <div class="talent-exam-time ft14 fw4 color3">{{item.time.substr(11,5)}}</div>
                          <div class="talent-exam-border"></div>
                          <div class="talent-exam-line"></div>
                        </div>
                        <div class="talent-exam-right">
                          <!-- 处理状态 0问题描述 1客服受理/专家受理 2专家受理 3客服跟进 4转至专家处理 5处理结果 6等待评价 7客服再次受理 8专家再次受理 9已评价 10超时未评价 11问题补充 -->
                          <div class="talent-exam-rtitle ft14 fw6 color2" v-if="item.doStatus == 0">问题描述</div>
                          <div class="talent-exam-rtitle ft14 fw6 color2" v-if="item.doStatus == 1">客服受理</div>
                          <div class="talent-exam-rtitle ft14 fw6 color2" v-if="item.doStatus == 2">专家受理</div>
                          <div class="talent-exam-rtitle ft14 fw6 color2" v-if="item.doStatus == 3">客服跟进</div>
                          <div class="talent-exam-rtitle ft14 fw6 color2" v-if="item.doStatus == 4">转至专家处理</div>
                          <div class="talent-exam-rtitle ft14 fw6 color2" v-if="item.doStatus == 5">处理结果</div>
                          <div class="talent-exam-rtitle ft14 fw6 color2" v-if="item.doStatus == 6">等待评价</div>
                          <div class="talent-exam-rtitle ft14 fw6 color2" v-if="item.doStatus == 7">客服再次受理</div>
                          <div class="talent-exam-rtitle ft14 fw6 color2" v-if="item.doStatus == 8">专家再次受理</div>
                          <div class="talent-exam-rtitle ft14 fw6 color2" v-if="item.doStatus == 9">已评价</div>
                          <div class="talent-exam-rtitle ft14 fw6 color2" v-if="item.doStatus == 10">超时未评价</div>
                          <div class="talent-exam-rtitle ft14 fw6 color2" v-if="item.doStatus == 11">问题补充</div>
                          <div class="talent-exam-rcont ft14 fw4 color4">{{item.content !== null?item.content:'--'}}</div>
                          <div class="talent-exam-expert ft14 fw6 color2">
                            <span v-if="item.doStatus == 0 || item.doStatus == 2 || item.doStatus == 3 || item.doStatus == 4 || item.doStatus == 5 || item.doStatus == 6 || item.doStatus == 8 || item.doStatus == 11">
                              专家{{item.ename?item.ename:'--'}}
                            </span>
                          </div>
                        </div>
                      </el-row>
                  </el-col>
                </el-row>
              </el-row>
            </el-row>
            <div class="zwsj" v-else>
              <img :src="zwsjImg" alt=""><br />
              暂无数据
            </div>
          </el-col>
        </el-row>
      </el-row>
    </div>
  </div>
</template>

<script>
import { questionList, replyAnswer,updateQuestionList } from '@/api/api'
import Page from '@/components/Page.vue'
import { mapGetters } from 'vuex'
  export default {
    name: 'talentExamine',
    components: {
      Page
    },
    data() {
      const fenimgUrl1 = require('@/assets/images/msg1.png')
      const fenimgUrl2 = require('@/assets/images/msg2.png')
      const zwsjUrl = require('@/assets/images/zwsj.png')
      return {
        zwsjImg: zwsjUrl,
        fenImg1: fenimgUrl1,
        fenImg2: fenimgUrl2,
        ecamList:[],
        answerDetail:{},
        answerArr:[],
        currentIndex: 0,
        number: 0,
        reviewTextarea:'',
        // page
        currentPage: 1,
        pageSize: 6,
        total: 0,
        current: 0,
        placeholder: '请输入回复内容',
        bdcolor: false,
        qid:""//反馈问题的id
      }
    },
    created() {
      this.getQuestionList()
    },
    computed:{
      ...mapGetters([
          'getUsers',
          'getSysMetaData'
      ])
    },
    methods: {
      getQuestionList() {
        let params = {
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          token: this.getUsers.token,
          type:2
        }
        questionList(params).then(res =>{
          if(res.code == 200) {
            this.answerDetail = res.data
            this.ecamList = res.data.records
            this.total = res.data.total
            this.number = res.data.total
            this.current = res.data.current
            this.$store.commit('updateNumber2', this.number)
            if(res.data.records.length){
                this.qid=res.data.records[this.currentIndex].id
                this.answerArr = res.data.records[this.currentIndex].msg.answers.sort((a,b) => {
                return Date.parse(b.time.replace(/-/g,"/"))-Date.parse(a.time.replace(/-/g,"/"));
              })
              
            }
          }
        })
      },
      replyClick(id,n) {
        if(!this.reviewTextarea){
          this.$myMessage('error','请输入回复内容')
          return false;
        }
        let params = {
          content: this.reviewTextarea,
          qid: id,
          token: this.getUsers.token,
          uType: n,//用户类型 1 worker 2customer 3业务员
        }
        replyAnswer(params).then(res =>{
          if(res.code == 200) {
            if(this.currentPage <= this.current && this.ecamList.length == 1){
              this.currentPage = this.current == 1?1:this.current - 1
            }
            this.getQuestionList()
            this.$store.commit('updateNumber2', this.number)
            this.reviewTextarea = ''
          }
        })
      },
      changeExamClick(index) {
        this.currentIndex = index
        this.getQuestionList()
        this.reviewTextarea = ''
      },
      changePage(val) {
        this.currentPage = val
        this.getQuestionList()
      },
      textareaFocus(){
        this.bdcolor = true
        this.placeholder = '请输入回复内容'
      },
      textareaBlur(){
        this.bdcolor = false
      },
      getUserType(type){//根据用户类型数字获取用户类型
        switch(type){
          case 1:
            return '雇员'
          case 2:
            return '雇主'
          case 3:
            return '顾问'
        }
      },
      async changeGu(){//转为顾问处理
        let params={
          type:'1',//1顾问，2专家
          token: this.getUsers.token,
          qid:this.qid
        }
        const result=await updateQuestionList(params)
        if(result.code==200){
          this.getQuestionList()
        }
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.fen-btn{
  width:36px;
  height:36px;
  background: #edf5ff;
  -moz-border-radius: 100%;
  border-radius: 100%;
  position: relative;
  text-align: center;
  margin-left: 0 !important;
  margin-right: 20px;
}
.fen-btn img{
  width: 18px;
  height: 18px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -9px;
  margin-left: -9px;
}
.fen-btn .fenimg2{
  display: none;
}
.fen-btn:hover,.delete-btn:hover{
  background: #1882fc;
}
.fen-btn:hover .fenimg1{
  display: none;
}
.fen-btn:hover .fenimg2{
  display: inline-block;
}
.fen-btn:visited{
  background: #1882fc;
}
.talent-exam-dot{
  &:before{
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate3d(-50%, -50%, 0);
    transform: translate3d(-50%, -50%, 0);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: #1882FC;
    box-shadow: 8px 0 0 #1882FC, -8px 0 0 #1882FC;
  }
  &:hover{
    &:before{
      background-color: #fff;
      box-shadow: 8px 0 0 #fff, -8px 0 0 #fff;
    }
  }
}
.talent-exam-news.on{
  width: auto;
  height: auto;
  border-radius: .15rem;
  padding: 0 .05rem;
}
</style>

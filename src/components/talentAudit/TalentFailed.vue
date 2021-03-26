<template>
  <div class="pages-container">
    <div class="pages-wraps">
      <div class="page-table-content">
        <div class="tablent-md">
          <div class="tablent-search bd">
            <el-input placeholder="编号/手机号/关键字" v-model="taSearchText" @input="changeInput">
            </el-input>
            <a href="javascript:void(0);" class="talent-btn" @click="search"><img :src="sUrl" alt=""></a>
          </div>
        </div>
        <div class="tablent-content">
          <el-table :data="tableDataList" highlight-current-row  @row-click="cellClick" border style="width: 100%">
            <el-table-column prop="date" label="投递时间" width="">
              <template slot-scope="scope">
                <span v-if="scope.row.date">
                  {{ (scope.row.date).substr(0,10) }}<br />{{ (scope.row.date).substr(11,8) }}
                </span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="">
              <template slot-scope="scope">
                <span class="bold">{{scope.row.name ?scope.row.name: '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="age" label="年龄" width="">
              <template slot-scope="scope">
                <span class="bold">{{scope.row.age ?scope.row.age: '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="rskill" label="认证技能" width="">
              <template slot-scope="scope">
                <span class="bold" v-if="scope.row.rskill">{{scope.row.rskill}}</span>
                <span class="bold" v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="phone" label="手机号" width="">
              <template slot-scope="scope">
                <span class="bold" v-if="scope.row.phone">{{scope.row.phone | numMask }}</span>
                <span class="bold" v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column label="原因" width="">
              <template slot-scope="scope">
                <span class="red" v-if="scope.row.healthStatus === 3">健康未通过</span>
                <span class="red" v-if="scope.row.status === 4">超时未到店</span>
                <span class="red" v-if="scope.row.status === 3">
                  <span v-if="scope.row.skill && scope.row.lstatus != 2">理论未通过</span>
                  <span v-if="scope.row.skillOperation && scope.row.lstatus2 != 2">实操未通过</span>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="100">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" size="small" class="fen-btn">
                  <img :src="fenImg1" alt="" class="fenimg1">
                  <img :src="fenImg2" alt="" class="fenimg2">
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <Page :currentPage="currentPage" :pageSize="pageSize" :total="total" @changePage="changePage" v-if="this.tableDataList.length > 0"></Page>
        </div>
      </div>
      <!--右边详情-->
      <div class="page-detail-block">
        <RightInfo activeName="fourth" :noticeList="noticeList"  :detail="detail" 
          :totalScore="totalScore" instr:="instr" :keyName="keyName"/>
      </div>
    </div>
    <Chat ref="chat" :curUser="targetUser"/>
  </div>
</template>

<script>
import { auditInfoList,getDetail } from '@/api/api'
import { fenImg1,fenImg2,sUrl } from '@/utils/imgConfig.js'
import Page from '@/components/Page.vue'
import { mapGetters } from 'vuex'
import Chat from '@/components/Chat.vue'
import RightInfo from "./RightInfo.vue"
  export default {
    name: 'talentTrial',
    components: {
      Page,
      Chat,
      RightInfo
    },
    data() {
      return {
        taSearchText: '',
        sUrl,
        fenImg1,
        fenImg2,
        tableData: [],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        tableDataList:[],
        targetUser:{},
        rowUid:"",
        totalScore:0,
        detail:{},
        keyName:0,
        instr:"",
        noticeList:[
          {
            date: '10-20 13:26:30',
            phoneNumber: '15900001113'
          },
          {
            date: '10-20 13:26:30',
            phoneNumber: '15900001113'
          },
          {
            date: '10-20 13:26:30',
            phoneNumber: '15900001113'
          },
          {
            date: '10-20 13:26:30',
            phoneNumber: '15900001113'
          },
          {
            date: '10-20 13:26:30',
            phoneNumber: '15900001113'
          }
        ]
      }
    },
    created() {
      this.getList()
    },
    computed:{
      ...mapGetters([
          'getTalent',
          'getUsers'
      ])
    },
    methods: {
      getList() {
        let params = {
          examType: '',
          operation: 3,
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          token: this.getUsers.token
        }
        auditInfoList(params).then(res => {
          if(res.code == 200) {
            let listArr=[];
            this.tableData = res.data.records
            listArr= res.data.records
            this.total = res.data.total
            listArr.forEach(item =>{
              if(item.examTime !== null){
                item.date = item.examTime.addTime
              } else {
                item.date = item.createTime
              }
              item.name = item.name
              item.age = item.age
              item.rskill = this.getcommonFun.tabKey(item.pid)
              item.lstatus = item.skill.status
              if(item.skillOperation !== null) {
                item.lstatus2 = item.skillOperation.status
              } else {
                item.lstatus2 = '--'
              }
              item.phone = item.phone
              item.status = item.status
            })
            this.tableDataList=listArr;
            //获取第一条数据的详情
            if(this.tableDataList[0]){
              this.rowUid=this.tableDataList[0].uid
              this.getDetailList()
              this.$store.commit('updateTalent', this.tableDataList[0])
              sessionStorage.setItem('talentDetail', JSON.stringify(this.tableDataList[0])) 
            }else{
              this.$store.commit('updateTalent', {})
              sessionStorage.setItem('talentDetail', JSON.stringify({})) 
            }
          }
        })
      },
      search() { // 搜索
        const search = this.taSearchText
        if (search) {
          this.tableDataList =  this.tableData.filter(data => {
            return Object.keys(data).some(key => {
              return String(data[key]).toLowerCase().indexOf(search) > -1
            })
          })
        } else {
            this.tableDataList =  this.tableData
        }
      },
      changeInput() {
        if(this.taSearchText === '') {
          this.tableDataList =  this.tableData
        }
      },
      handleClick(row) {//发送消息
        let user={}
        user.uid=row.id.toString();
        user.name=row.name;
        user.headImg=row.headimg
        this.targetUser=user;
        this.$refs.chat.showDialog()
      },
      cellClick(row,event,column) {// table整行点击
        this.rowUid=row.uid
        this.getDetailList()
        sessionStorage.setItem('talentDetail',JSON.stringify(row))
        this.$store.commit('updateTalent', row)
      },
      changePage(val) {
        this.currentPage = val
        this.getList()
      },
      async getDetailList(){// 阿姨详细信息
        let params = {
          "app": 3,
          "comments": true,
          "device": 5,
          "experience": true,
          "family": true,
          // 认证状态 0默认状态 1进行中 2通过 3未通过 4资料不齐 5remove 6禁用
          // "picStatus": [0,1],
          // 配合typeFiles上传时使用 1阿姨生身活照，2份证，3技能证书，4体检，5个人菜品等照片，6学历，7驾驶证，8护照，9港澳通行证, 10个人形象照
          "picTypes": [2,4,6,10],
          "score": true,
          "token": this.getUsers.token,
          // 获取签证、通行证 1获取 0或空不获取
          "visa": 1,
          "wid":this.rowUid
        }
        const res=await getDetail(params)
        if(res.code == 200) {
          this.detail = res.data
          if(res.data.assessment) {
            if(res.data.assessment.indexOf('/uploadFile/mp4') != -1) {
              this.instr = 0
            } else {
              this.instr = -1
            }
          }
          this.getScore()
        }
      },
      getScore() {// 获取分数
        let score1 = 0
        let score2 = 0
        let score3 = 0
        if(this.getTalent.skill.status==2||this.getTalent.skill.status==3){
          score1=this.getTalent.skill.score
        }
        if(this.getTalent.skillOperation){
          score2=this.getTalent.skillOperation.score
        }
        if(this.getTalent.record){
          score3=this.getTalent.record.score
        }
        this.totalScore = score1 + score2 + score3
        if(this.getTalent.skill){
          this.keyName = this.getTalent.pid
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
.tg-btn{
  width:80px;
  height:36px;
  line-height: 36px;
  background: #edf5ff;
  -moz-border-radius: 18px;
  border-radius: 18px;
  font-size: 16px;
  color: #257CFF;
  &:hover{
    background: #1882FC;
    color: #fff;
  }
}
</style>

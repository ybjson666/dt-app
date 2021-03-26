<template>
  <div class="pages-container">
    <div class="pages-wraps">
      <div class="page-table-content qualified-content">
        <div class="talent-all clearfix">
          <span class="sp1" :class="getFlag3?'on':''" @click="allClick(true)">无日期</span>
          <span class="sp2" :class="getFlag3?'':'on'" @click="tdClick(false)">今日到店</span>
        </div>
        <div class="tablent-md">
          <div class="tablent-search bd">
            <el-input placeholder="编号/手机号/关键字" v-model="taSearchText" @input="changeInput">
            </el-input>
            <a href="javascript:void(0);" class="talent-btn" @click="search()"><img :src="sUrl" alt=""></a>
          </div>
        </div>
        <div class="tablent-content">
          <el-table :data="tableDataList" highlight-current-row  @row-click="cellClick" border style="width: 100%">
            <el-table-column prop="date" label="投递时间" width="">
              <template slot-scope="scope">
                <span v-if="scope.row.date">
                  {{ (scope.row.date).substr(0,10) }}<br />{{ (scope.row.date).substr(11) }}
                </span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="">
              <template slot-scope="scope">
                <span class="bold">{{scope.row.name?scope.row.name:'--'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="phone" label="手机号" width="140">
              <template slot-scope="scope">
                <span class="bold" v-if="scope.row.phone">{{scope.row.phone | numMask }}</span>
                <span class="bold" v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="skill" label="认证技能" width="">
              <template slot-scope="scope">
                <span class="bold" v-if="scope.row.skill">{{scope.row.skill}}</span>
                  <!-- <span class="changeImg" @click="changeClick(scope.row.skill)"><img :src="changeUrl" alt=""></span> -->
                <span class="" v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="expectedDate" label="预计到店日期" width="">
              <template slot-scope="scope">
                <span v-if="scope.row.expectedDate">
                  {{(scope.row.expectedDate).substr(5,2) }}月{{ (scope.row.expectedDate).substr(8,2)}}日
                </span>
                <span v-else>未填写</span>
              </template>
            </el-table-column>
            <el-table-column prop="invite" label="邀请人" width="">
              <template slot-scope="scope">
                <span class="bold">{{scope.row.invite?scope.row.invite:'无'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="120">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" size="small" class="fen-btn">
                  <img :src="fenImg1" alt="" class="fenimg1">
                  <img :src="fenImg2" alt="" class="fenimg2">
                </el-button>
                <el-button @click="answerClick(scope.row,scope.$index)" size="small" class="tg-btn"
                           :class="cudx == scope.row.id?'on':''">
                           {{cudx == scope.row.id?'答题中':'答题'}}
                </el-button>
                <!-- <el-button @click="trainClick(scope.row)" size="small" class="tg-btn" 
                           v-if="scope.row.major === 3 || scope.row.service === 3">
                           培训
                </el-button>
                <el-button @click="evaluationClick(scope.row)" size="small" class="tg-btn" 
                           v-if="scope.row.major === 2 && scope.row.service === 2">
                           测评
                </el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <Page :currentPage="currentPage" :pageSize="pageSize" :total="total" @changePage="changePage" v-if="this.tableDataList.length > 0"></Page>
        </div>
      </div>
      <!-- <div class="page-detail-block">
        <RightInfo activeName="first" :noticeList="noticeList"  :detail="detail" 
          :totalScore="totalScore" instr:="instr" :keyName="keyName" />
      </div> -->
    </div>
    
    <!-- 更换大类 -->
    <el-dialog title="更换测试内容" :visible.sync="changeDialogVisible" 
    :close-on-click-modal="false" center class="addDialog hd" @close="cancelChange" width="600px">
      <el-row>
        <el-form :model="changeForm" :rules="changeFormRules" ref="changeForm" label-width="100px" class="adform-list">
          <el-form-item label="" prop="changeType" class="change-type">
            <el-radio-group v-model="changeForm.changeType" @change="changeType">
            <template v-for="(item,index) in changeTypeList">
              <el-radio-button :label="item.name" :key="index">{{item.name}}</el-radio-button>
            </template>
          </el-radio-group>
          </el-form-item> 
          <el-form-item class="aform-footer">
            <el-button @click="cancelChange">取 消</el-button>
            <el-button @click="submitForm('changeForm')">更 换</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-dialog>
    <!-- 聊天 -->
    <Chat ref="chat" :curUser="targetUser"/>
  </div>
</template>

<script>
import { start, answer,modifyPid,getDetail } from '@/api/api'
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
        currentPage: 1,
        pageSize: 10,
        total: 0,
        tableDataList:[],
        cudx: -1,
        changeDialogVisible: false,
        changeForm: {
          changeType: ''
        },
        changeFormRules: {
          changeType: [
            { required: true, message: '请选择更换测试的内容', trigger: 'blur' },
          ]
        },
        changeTypeList: [],
        targetUser:{},
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
        ],
        detail:{},
        totalScore:0,
        keyName:0,
        instr:"",
        rowUid:"",
        changePid:""
      }
    },
    created() {
      this.getList(this.getFlag3)
      this.getSysMetaData.forEach((item, index) => {
        if (item.pid === 2 && item.status == 1) {
          this.changeTypeList.push(item)
        }
      })
    },
    computed:{
      ...mapGetters([
          'getTalent',
          'getUsers',
          'getSysMetaData',
          'getFlag3'
      ])
    },
    methods: {
      getList(flag) {//获取表格列表数据
        let params = {
          // 到店标签 0或空默认全部 1今日到店 2明日到店 3后天 4无到店日期 5使用日期格式筛选
          dayType: flag?4:1,
          endTime: '',
          examType: '',
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          startTime: '',
          token: this.getUsers.token
        }
        start(params).then(res =>{
          if(res.code == 200){
            let listArr=[]
            this.tableData = res.data.records
            listArr = res.data.records
            this.total = res.data.total
            listArr.forEach(item =>{
             
              if(item.addTime !== null){
                item.date = item.addTime
              } else {
                item.date = item.createTime
              }
              item.name = item.name
              item.phone = item.phone
              item.skill = this.getcommonFun.tabKey(item.pid)
              item.expectedDate = item.examTime
             
            })
            this.tableDataList=listArr;
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
      search() {//搜索
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
      cellClick(row,event,column) { // table整行点击
        sessionStorage.setItem('talentDetail',JSON.stringify(row))
        this.$emit('fatherMethod',row)
        this.$store.commit('updateTalent', row)
      },
      changePage(val) {//分页
        this.currentPage = val
        this.getList(this.getFlag3)
      },
      handleClick(row) {//聊天
        let user={}
        user.uid=row.id.toString();
        user.name=row.name;
        user.headImg=row.headimg
        this.targetUser=user;
        this.$refs.chat.showDialog()
      },
      answerClick(row,index) {// 答题
        this.cudx = row.id
        let params = {
          app: 3,
          device: 5,
          id: '',
          pid: row.pid,
          token: this.getUsers.token,
          uid: row.id
        }
        answer(params).then(res =>{
          if(res.code == 200) {
            this.getList(this.getFlag3)
          }
        })
      },
      changeType (val) {
        this.changePid = val
        this.$refs.changeForm.clearValidate();
      },
      cancelChange(){//关闭更换大类弹框
        this.changeDialogVisible = false
        this.changeForm.changeType=""
        this.$refs.changeForm.clearValidate();
      },
      submitForm(changeForm) {//认证技能更换弹框提交
        this.$refs[changeForm].validate((valid) => {
          if (valid) {
            let params = {
              app: 3,
              device: 5,
              phone: '',
              pid: this.changePid,
              token: this.getUsers.token,
              uid: this.getTalent.id,
            }
            modifyPid(params).then(res =>{
              if(res.code == 200) {
                this.$message.success({ message: '更换成功！', offset: 50 })
                this.changeDialogVisible = false
                this.getList()
              }else{
                this.changeDialogVisible = false
                this.$myMessage("error","更换失败")
              }
            })
          }
        })
      },
      allClick(flag) {
        this.$store.commit('updateFlag3', flag)
        this.getList(flag)
      },
      tdClick(flag) {
        this.$store.commit('updateFlag3', flag)
        this.getList(flag)
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
.tg-btn.on{
  background: #9A9A9A;
  color: #fff;
}
.changeImg{
  cursor: pointer;
  img{
    width: 18px;
    margin-left: 6px;
  }
}
.talent-all{
  margin-bottom: 15px;
  span{
    float: left;
    display: block;
    width: 92px;
    height: 36px;
    line-height: 36px;
    font-size: 15px;
    color: #606D80;
    text-align: center;
    border: 0.01rem solid #DCDFE6;
    border-radius: 0.05rem;
    cursor: pointer;
  }
  span.on{
    background: #1882FC;
    color: #fff;
  }
  .sp1{
    border-right: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .sp2{
    border-left:0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}
</style>

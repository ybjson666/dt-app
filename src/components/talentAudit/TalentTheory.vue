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
                <span class="bold">{{scope.row.name === null?'--': scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="age" label="年龄" width="">
              <template slot-scope="scope">
                <span class="bold">{{scope.row.age ?scope.row.age:'--' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="rskill" label="认证技能" width="">
              <template slot-scope="scope">
                <span v-if="scope.row.rskill">
                  <span class="bold">{{scope.row.rskill}}</span>
                  <span class="changeImg" @click="changeClick(scope.row.rskill)"><img :src="changeUrl" alt=""></span>
                </span>
                <span class="green" v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="major" label="理论测试" width="">
              <template slot-scope="scope">
                <span class="orange" v-if="scope.row.major && scope.row.major === 1">答题中</span>
                <span class="green" v-else-if="scope.row.major && scope.row.major === 2">通过</span>
                <span class="red" v-else-if="scope.row.major && scope.row.major === 3">未通过</span>
                <span class="green" v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="160">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" size="small" class="fen-btn">
                  <img :src="fenImg1" alt="" class="fenimg1">
                  <img :src="fenImg2" alt="" class="fenimg2">
                </el-button>
                <el-button size="small" class="tg-btn active" v-if="scope.row.major && scope.row.major == 1">答题中</el-button>
                <el-button size="small" class="tg-btn" @click="evaluationClick(scope.row)" v-else-if="scope.row.major &&  scope.row.major == 2">实操</el-button>
                <el-button size="small" class="tg-btn" @click="trainClick(scope.row)" v-else-if="scope.row.major &&  scope.row.major == 3"> 培训 </el-button>
                <el-button size="small" class="tg-btn active" v-else> 未答题 </el-button>
              </template>
            </el-table-column>
          </el-table>
          <Page :currentPage="currentPage" :pageSize="pageSize" :total="total" @changePage="changePage" v-if="this.tableDataList.length > 0"></Page>
        </div>
      </div>
      <!--右边详情-->
      <div class="page-detail-block">
        <RightInfo activeName="second" :noticeList="noticeList"  :detail="detail" 
          :totalScore="totalScore" instr:="instr" :keyName="keyName"/>
      </div>
    </div>
    <!-- 更换大类 -->
    <el-dialog title="更换测试内容" :visible.sync="changeDialogVisible" :close-on-click-modal="false" center 
      class="addDialog hd" width="600px" @close="cancelChange">
      <el-row>
        <el-form :model="changeForm" :rules="changeFormRules" ref="changeForm" label-width="100px" class="adform-list">
          <el-form-item label="" prop="changeType" class="change-type">
            <el-radio-group v-model="changeForm.changeType" @change="changeType">
            <template v-for="(item,index) in changeTypeList">
              <el-radio-button :label="item.id" :key="index">{{item.name}}</el-radio-button>
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
import { auditInfoList, modifyPid, drill,getDetail } from '@/api/api'
import { fenImg1,fenImg2,sUrl,changeImg } from '@/utils/imgConfig.js'
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
        changeUrl: changeImg,
        fenImg1,
        fenImg2,
        tableData: [],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        tableDataList:[],
        tabList: [],
        changePid: '',
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
        keyName:0,
        rowUid:"",
        detail:{},
        totalScore:0,
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
        ],
      }
    },
    created() {
      this.tableDataList =  this.tableData
      this.getList()
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
          'getSysMetaData'
      ])
    },
    methods: {
      async getList() {//获取表格数据
        let params = {
          examType: '',
          operation: 0,
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          token: this.getUsers.token
        }
        const res =await auditInfoList(params);
        if(res.code == 200){
          let listArr=[];
          this.tableData = res.data.records
          listArr = res.data.records
          this.total = res.data.total
        
          listArr.forEach(item =>{
            if(item.examTime !== null){
              item.date = item.examTime.addTime
            } else {
              item.date = item.createTime
            }
            item.name = item.name
            // item.age = item.birthday+''
            item.age = item.age
            item.rskill = this.getcommonFun.tabKey(item.pid)
            item.major = item.skill.status
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
      },
      search() {// 搜索
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
      cellClick(row) {// table整行点击
        this.rowUid=row.uid
        this.getDetailList()
        sessionStorage.setItem('talentDetail',JSON.stringify(row))
        this.$store.commit('updateTalent', row)
      },
      changePage(val) {
        this.currentPage = val
        this.getList()
      },
      handleClick(row) {//聊天
        let user={}
        user.uid=row.id.toString();
        user.name=row.name;
        user.headImg=row.headimg
        this.targetUser=user;
        this.$refs.chat.showDialog()
      },
      trainClick(row) {// 培训
        let params = {
          app: 3,
          device: 5,
          id: row.id,
          token: this.getUsers.token,
          wid: row.uid
        }
        drill(params).then(res =>{
          if(res.code == 200) {
            this.$router.push('/talentTrain')
          }
        })
      },
      evaluationClick(row) {// 实操
        this.$router.push('/talentEvaluation')
      },
      changeClick(item) {// 更换大类
        this.changeDialogVisible = true
      },
      cancelChange(){//关闭更换大类弹框
        this.changeDialogVisible = false
        this.changeForm.changeType=""
        this.$refs.changeForm.clearValidate();
      },
      changeType (val) {
        this.changePid = val
        this.$refs.changeForm.clearValidate();
      },
      submitForm(changeForm) {
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
.tg-btn.active{
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
</style>

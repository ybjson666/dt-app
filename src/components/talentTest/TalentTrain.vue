<template>
  <div class="talentAudit">
    <div class="pages-container">
      <div class="pages-wraps">
        <div class="page-table-content">
          <div class="tablent-md clearfix">
            <div class="tablent-search bd">
              <el-input placeholder="编号/手机号/关键字" v-model="taSearchText" @input="changeInput">
              </el-input>
              <a href="javascript:void(0);" class="talent-btn" @click="search"><img :src="sUrl" alt=""></a>
            </div>
          </div>
          <div class="tablent-content">
            <el-table :data="tableDataList" highlight-current-row @row-click="cellClick" border style="width: 100%">
              <el-table-column prop="date" label="投递时间" width="">
                <template slot-scope="scope">
                  <!-- {{ (scope.row.date).replace("T","\n") }} -->
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
              <el-table-column prop="skill" label="认证技能" width="">
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
                  <span class="green" v-if="scope.row.major && scope.row.major === 1">进行中</span>
                  <span class="green" v-else-if="scope.row.major && scope.row.major === 2">通过</span>
                  <span class="red" v-else-if="scope.row.major && scope.row.major === 3">未通过</span>
                  <span class="green" v-else>未进行</span>
                </template>
              </el-table-column>
              <el-table-column prop="expert" label="实操测试" width="">
                <template slot-scope="scope">
                  <span class="green" v-if="scope.row.expert && scope.row.expert === 1">测试中</span>
                  <span class="green" v-else-if="scope.row.expert && scope.row.expert === 2">通过</span>
                  <span class="red" v-else-if="scope.row.expert && scope.row.expert === 3">未通过</span>
                  <span class="green" v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right" width="120">
                <template slot-scope="scope">
                  <el-button @click="trainClick(scope.row)" size="small" class="tg-btn" >答题</el-button>
                </template>
              </el-table-column>
            </el-table>
            <Page :currentPage="currentPage" :pageSize="pageSize" :total="total" @changePage="changePage" v-if="this.tableDataList.length > 0"></Page>
          </div>
        </div>
        <div class="page-detail-block">
          <RightInfo :detail="detail" :instr="instr" :totalScore="totalScore" 
          @updateDetail="getDetailList" :keyName="keyName" @updateList="getList"/>
        </div>
      </div>
      <!-- 更换大类 -->
      <el-dialog title="更换测试内容" :visible.sync="changeDialogVisible" :close-on-click-modal="false" 
      center class="addDialog hd" @close="cancelChange" width="600px">
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
    </div>
  </div>
</template>

<script>
import { getDetail, auditInfoList, modifyPid, reAnswer} from '@/api/api'
import Page from '@/components/Page.vue'
import RightInfo from './RightInfo.vue'
import { mapGetters } from 'vuex'
import imgurl from '@/utils/common.js'
  export default {
    name: 'talentTrain',
    components: {
      Page,
      RightInfo
    },
    data() {
      return {
        taSearchText: '',
        sUrl: require('@/assets/images/search2.png'),
        changeUrl: require('@/assets/images/change.png'),
        fenImg1: require('@/assets/images/msg1.png'),
        fenImg2: require('@/assets/images/msg2.png'),
        tableData: [],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        tableDataList:[],
        detail:{},
        instr: 0,
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
        totalScore: 0,
        keyName:0
      }
    },
    created() {
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
      getList() {// 培训列表
        let params = {
          examType: '',
          operation: 4,
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          token: this.getUsers.token
        }
        auditInfoList(params).then(res => {
          if(res.code == 200){
            this.tableData = res.data.records
            this.tableDataList = res.data.records
            this.total = res.data.total
            this.tableDataList.forEach(item =>{
              if(item.examTime !== null){
                item.date = item.examTime.addTime
              } else {
                item.date = item.createTime
              }
              item.name = item.name
              // 基本资料
              if(item.record !== null) {
                // item.basic = item.record.status
              }
              item.basic = item.status
              item.rskill = this.getcommonFun.tabKey(item.pid)
              // 专业技能
              item.major = item.skill.status
              // 专家评估
              if(item.skillOperation !== null) {
                item.expert = item.skillOperation.status
              } else {
                item.expert = '--'
              }
            })
             //获取第一条数据的详情
            if(this.tableDataList[0]){
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
      getDetailList(){// 阿姨详细信息
        let params = {
          "app": 3,
          "comments": true,
          "device": 5,
          "experience": true,
          "family": true,
          "picTypes": [2,4,6,10],
          "score": true,
          "token": this.getUsers.token,
          // 获取签证、通行证 1获取 0或空不获取
          "visa": 1,
          "wid": this.getTalent.uid
        }
        getDetail(params).then(res => {
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
        })
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
      },
      search() {// 搜索
       
      },
      changeInput() {
        if(this.taSearchText === '') {
          this.tableDataList =  this.tableData
        }
      },
      cellClick(row,event,column) {// table整行点击
        this.getDetailList()
        sessionStorage.setItem('talentDetail',JSON.stringify(row))
        this.$store.commit('updateTalent', row)
        this.getHeight()
        window.addEventListener('resize', this.getHeight);
      },
      changePage(val) { // 分页
        this.currentPage = val
        this.getList()
      },
      handleClick(row) {//聊天
        
      },
      trainClick(row) {// 答题
        let params = {
          app: 3,
          device: 5,
          id: row.id,
          phone: '',
          pid: row.pid,
          token: this.getUsers.token,
          uid: row.uid,
        }
        reAnswer(params).then(res => {
          if(res.code == 200) {
            console.log(res)
            this.$store.commit('updateTalentActiveName', 'second')
            this.$router.push('/talentAudit')
          }
        })
      },
      changeClick(item) {// 更换大类
        this.changeDialogVisible = true
      },
      changeType (val) {
        this.changePid = val
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
              }
            })
          } else {
            return false;
          }
        })
      },
      cancelChange(){//关闭更换大类弹框
        this.changeDialogVisible = false
        this.changeForm.changeType=""
        this.$refs.changeForm.clearValidate();
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.tg-btn{
  // width:80px;
  height:36px;
  line-height: 36px;
  background: #edf5ff;
  -moz-border-radius: 18px;
  border-radius: 18px;
  font-size: 16px;
  color: #257CFF;
  padding: 0 24.01px;
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
.ltest{
  .ltest-hd{
    font-size: 16px;
    font-weight: 400;
    color: #656566;
    margin-bottom: 12px;
    padding: 0 24px;
    span{
      color: #FF9A00;
      font-size: 14px;
    }
  }
  .ltest-bd{
    margin-bottom: 25px;
    padding: 0 60px;
    .ltest-bt{
      width: 24px;
      height:24px;
      line-height: 24px;
      -moz-border-radius: 100%;
      border-radius: 100%;
      background: #00CA41;
      font-size: 14px;
      font-weight: 400;
      color:#fff;
      text-align: center;
      margin-right: calc((100% - 240px)/9);
      cursor: pointer;
      &:last-child{
        margin-right: 0;
      }
    }
    .ltest-bt.on{
      background: #FF5A5A;
    }
  }
}
.ltest-title{
  width: 100%;
  background: #F9F9F9;
  line-height: 38px;
  padding: 0 24px;
  font-size: 16px;
    font-weight: 400;
  .el-col-10{
    color:#111;
  }
  .el-col-14{
    color:#656666;
    text-align: right;
  }
}
.ltest-select{
  margin-top: 18px;
}
.ltest-container{
  display: none;
}
.ltest-container.on{
  display: block;
}
.ltest-stitle{
  line-height: 24px;
  font-size: 16px;
  font-weight: 400;
  color:#111;
  padding: 0 60px;
  margin-bottom: 20px;
}
.ltest-scont{
  margin: 0 70px;
  .el-row{
    line-height: 42px;
    background: #F9F9F9;
    font-size: 14px;
    font-weight: 400;
    color:#999999;
    margin-bottom: 10px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    padding-left: 20px;
  }
  .el-row.on1{
    background: #00CB49;
    color:#fff;
  }
  .el-row.on2{
    background: #FF9898;
    color:#fff;
  }
}
.zqdn{
  padding-left:70px;
  font-size: 14px;
  font-weight: 400;
  color:#f00;
}
.ltest-close{
  margin-top: 50px;
  text-align: center;
  .el-button{
    width: 120px;
    height: 40px;
    line-height: 40px;
    background: #1882FC;
    border-radius:4px;
    font-size: 16px;
    font-weight: 400;
    color:#fff;
    &:first-child{
      background: #ccc;
    }
  }
}
.ltest-score{
  padding:0 24px;
  .ltest-score-hd{
    font-size: 16px;
    font-weight: 400;
    color:#111;
    margin-bottom: 20px;
  }
  .ltest-score-bd{
    padding-left: 30px;
    .el-radio-button{
      margin-right: 20px;
      -moz-border-radius: 5px;
      border-radius: 5px;
    }
  }
}
.ltest-score .el-form-item{
  position: relative;
}
.ltest-score .el-form-item.on::before{
  content:'';
  display:block;
  width: 100%;
  background:rgba(255,255,255,.3);
  position: absolute;
  top: 0;
  left:0;
  bottom: 0;
  z-index: 10;
}

.ltest-tabcont{
  display: none;
}
.ltest-tabcont.on{
  display: block;
}

.health {
  .el-col-8{
    padding-right: 10px;
    imh{
      -moz-border-radius: 4px;
      border-radius: 4px;
    }
  }
  .healthTg{
    -webkit-box-direction: normal;
		-webkit-box-orient: vertical;
		-moz-box-direction: normal;
		-moz-box-orient: vertical;
		-webkit-flex-direction: column;
		-ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: end;
    -moz-box-pack: end;
    -ms-flex-pack: end;
    -webkit-justify-content: flex-end;
    justify-content: flex-end;
    position: absolute;
    top:0;
    right: 0;
    bottom: 0;
    .el-button{
      background: #1882FC;
      height: 0.36rem;
      line-height: 0.36rem;
      border-radius: 0.18rem;
      padding: 0 0.2401rem;
      font-size: 0.16rem;
      font-weight: 400;
      color: #fff;
      margin-left: 0;
      &:first-child{
        margin-bottom: 10px;
      }
    }
  }
}
.zwpj{
  .zwpj-video{
    position:relative;
    border-radius: 4px;
    .video-img{
      width:100%;
      background:rgba(0,0,0,.7);
      position:absolute;
      top:0;
      left:0;
      bottom:0;
      z-index: 10;
      border-radius: 4px;
      cursor: pointer;
    }
    .video-play{
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 20;
      -webkit-transform: translate(-50%,-50%);
      -ms-transform: translate(-50%,-50%);
      transform: translate(-50%,-50%);
      font-size: 16PX;
      color: #fff;
      cursor: pointer;
    }
    .video-zhe{
      width: 100%;
      height: 100%;
      position: absolute;
      top:0;
      left: 0;
      cursor: pointer;
      z-index: 101;
    }
  }
}
#video{
  width:100%;
  height: 100%;
  border-radius: 4px;
}
</style>

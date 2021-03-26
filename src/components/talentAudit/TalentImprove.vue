<template>
  <div class="pages-container">
    <div class="pages-wraps">
      <div class="page-table-content">
        <div class="tablent-md">
          <div class="tablent-search bd">
            <el-input placeholder="编号/手机号/关键字" v-model="taSearchText">
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
            <el-table-column prop="name" label="姓名" width="130">
              <template slot-scope="scope">
                <span class="bold">{{scope.row.name === null?'--': scope.row.name}}</span>
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
                <span class="green" v-if="scope.row.major && scope.row.major === 1">进行中</span>
                <span class="green" v-else-if="scope.row.major && scope.row.major === 2">通过</span>
                <span class="red" v-else-if="scope.row.major && scope.row.major === 3">未通过</span>
                <span class="green" v-else>未进行</span>
              </template>
            </el-table-column>
            <el-table-column prop="expert" label="实操测试" width="130">
              <template slot-scope="scope">
                <span class="gray" v-if="scope.row.basic && scope.row.basic === 10">测试中</span>
                <span class="green" v-else-if="scope.row.expert && scope.row.expert === 2">通过</span>
                <span class="red" v-else-if="scope.row.expert && scope.row.expert === 3">未通过</span>
                <span class="green" v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="basic" label="基本资料" width="120">
              <template slot-scope="scope">
                <span class="dsh" v-if="scope.row.basic === 10">--</span>
                <span class="dsh" v-else-if="scope.row.basic === 6">--</span>
                <span class="dsh" v-else-if="scope.row.basic === 7">等待审核</span>
                <span class="dsh" v-else-if="scope.row.basic === 9">补交</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="160">
              <template slot-scope="scope">
                <span @click="handleClick(scope.row)" size="small" class="fen-btn">
                  <img :src="fenImg1" alt="" class="fenimg1">
                  <img :src="fenImg2" alt="" class="fenimg2">
                </span>
                <el-button size="small" class="tg-btn active" v-if="scope.row.basic && scope.row.basic == 10">答题中</el-button>
                <template v-else>
                <el-button @click="trainClick(scope.row)" size="small" class="tg-btn"  v-if="scope.row.expert && scope.row.expert === 3">培训</el-button>
                <el-button @click="evaluationClick(scope.row)" size="small" class="tg-btn" v-else>操作</el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
          <Page :currentPage="currentPage" :pageSize="pageSize" :total="total" @changePage="changePage" v-if="this.tableDataList.length > 0"></Page>
        </div>
      </div>
      <div class="page-detail-block">
        <RightInfo activeName="third" :noticeList="noticeList"  :detail="detail" 
          :totalScore="totalScore" instr:="instr" :keyName="keyName" @updateList="getList" @updateDetail="getDetailList"/>
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
    <!-- 聊天 -->
    <Chat ref="chat" :curUser="targetUser"/>

    <!-- new入档案 -->
    <el-dialog title="操作" :visible.sync="newRecordDialog" :close-on-click-modal="false" @close="closeDialog" width="500px" center class="newRecordAdd addDialog active hd hd2">
      <el-row class="newRecord">
        <el-form :model="newRecordForm" ref="newRecordForm">
          <el-row class="recd">
            <el-col :span="12">
              <el-row class="recd-item ">
                <el-col class="recd-img">
                  <template v-if="detail.photos && detail.photos.length > 0">
                    <template v-for="(item,index) in detail.photos">
                      <template v-if="item.picType == 10">
                        <template v-for="(sitem,index) in item.pic">
                          <img :src="sitem.path | imgFormat" alt="" class="user-img" :key="index+'pic'">
                        </template>
                      </template>
                      <el-row v-else :key="index" style="display:none;">暂无照片</el-row>
                    </template>
                  </template>
                </el-col>
                <el-col class="recd-cont">
                  <p class="pname color1 fw6">{{detail.name}}</p>
                  <p class="pidcard color3 fw4">ID: {{detail.id}}</p>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12">
              <el-row class="color3 fw4">期盼薪资: 
                <template v-if="detail.skills && detail.skills.length > 0">
                  <span v-for="(item,index) in detail.skills" :key="index">{{item.expectedSalary+'k'}}</span>
                </template>
                <span v-else>--</span>
              </el-row>
              <el-row class="color3 fw4">当前总分: <span class="red">{{newRecordForm.newscore}}分</span></el-row>
            </el-col>
          </el-row>
          <template v-if="newRecordForm.newscore >= 66 && newRecordForm.newscore <= 100">
            <template v-for="(item,index) in recordLevel">
              <el-row class="recd2"  :key="index+'lv'" v-if="newRecordForm.newscore >= item.minScore && newRecordForm.newscore <= item.maxScore">
                <el-col :span="12" class="color1 fw6">对应工资: 
                  <span class="fw6" >{{item.salary}}元</span>
                </el-col>
                <el-col :span="12" class="color1 fw6">对应等级: <span class="fw6" >{{getcommonFun.tabKey(newrecordId) +'T'+item.lv+'级'}}</span></el-col>
              </el-row>
            </template>
          </template>
          <el-row class="recd2" v-else>
              <el-col :span="12" class="color1 fw6">对应工资: 
                <span class="fw6" >--</span>
              </el-col>
              <el-col :span="12" class="color1 fw6">对应等级: <span class="fw6" >{{getcommonFun.tabKey(newrecordId) +'--'}}</span></el-col>
          </el-row>
          <el-row class="recd3 flexbox" v-if="picArr && picArr.length > 0">
            <span class="health color1 fw6">健康证书:</span>
            <template v-if="detail.photos && detail.photos.length > 0">
              <el-row class="health-img" v-for="(item,index) in detail.photos" :key="index">
                <template v-if="item.picType == 4">
                  <template v-for="sitem in item.pic" >
                  <el-image  :src="sitem.path | imgFormat" :preview-src-list="picArr" :key="sitem.id"></el-image>
                  </template>
                </template>
              </el-row>
            </template>
            <template v-else>--</template>
            <div class="health-check flexbox" style="margin-left:5px;">
              <el-radio-group v-model="newRecordForm.healthRadio" @change="changeHealth">
                <el-radio label="4">合格</el-radio>
                <el-radio label="7">补交</el-radio>
                <el-radio label="3">不合格</el-radio>
              </el-radio-group>
            </div>
          </el-row>
          <el-row class="recd4">
            <el-row class="color1 fw6">调整分:</el-row>
            <el-row class="recd-num">
              <el-button @click="dec(newRecordForm.recdNumber)" class="dec" :disabled="disable1">-</el-button>
              <el-input class="recd-ipt bd" v-model="newRecordForm.recdNumber" :min="newRecordForm.minValue" :max="newRecordForm.maxValue" @input="changeNumber(newRecordForm.recdNumber)"></el-input>
              <el-button @click="inc(newRecordForm.recdNumber)" class="inc" :disabled="disable2">+</el-button>
              <span class="newscore red">{{newRecordForm.newscore2}}分</span>
            </el-row>
            <template v-if="newRecordForm.newscore2 >= 66 && newRecordForm.newscore2 <= 100">
              <template v-for="(item,index) in recordLevel">
                <el-row class="p20" :key="index+'vl'" v-if="newRecordForm.newscore2 >= item.minScore && newRecordForm.newscore2 <= item.maxScore">
                  <el-col :span="12" class="color3 fw4">对应工资: <span class="">{{item.salary}}元</span></el-col>
                  <el-col :span="12" class="color3 fw4">对应等级: <span class="">{{getcommonFun.tabKey(newrecordId) +'T'+item.lv+'级'}}</span></el-col>
                </el-row>
              </template>
            </template>
            <el-row class="p20" v-else>
                <el-col :span="12" class="color3 fw4">对应工资: <span class="">--</span></el-col>
                <el-col :span="12" class="color3 fw4">对应等级: <span class="">{{getcommonFun.tabKey(newrecordId) +'--'}}</span></el-col>
            </el-row>
            <el-row class="recd-tarea">
              <el-input type="textarea" :rows="4" placeholder="请填写调整理由" v-model="newRecordForm.recdTarea"></el-input>
              <el-row class="recd-gu color4 fw4">操作人：{{getUsers.name}}</el-row>
            </el-row>
          </el-row>
          <el-row class="recd6">
            <el-row class="color1 fw6">工作经历:</el-row>
            <el-row class="recdexp" v-if="detail.workerExperience && detail.workerExperience.length > 0">
              <div class="exp clearfix" v-for="(item,index) in detail.workerExperience" :key="index">
                <div class="exp1">
                  <span class="exp-bd"></span>
                  <div class="exp-line"></div>
                </div>
                <div class="exp2">
                  <div class="exp-title fw6">
                    {{getcommonFun.tabKey(item.workType)}} {{item.startTime}} - {{item.endTime}}
                    <img :src="dlImg" alt="" class="dl" @click="dlClick(item.id,index)">
                  </div>
                  <div class="exp-cont fw4">{{item.desc}}</div>
                </div>
              </div>
            </el-row>
            <div v-else>--</div>
            <div class="wdh"></div>
          </el-row>
          <el-row class="recd5 aform-footer">
              <el-button @click="resetNewRecordForm('newRecordForm')">取 消</el-button>
              <el-button @click="submitNewRecordForm('newRecordForm')">提 交</el-button>
          </el-row>
        </el-form>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { auditInfoList, modifyPid, drill,getDetail,auditInfo } from '@/api/api'
import { fenImg1,fenImg2,sUrl,changeImg,dlImg } from '@/utils/imgConfig.js'
import Page from '@/components/Page.vue'
import { mapGetters } from 'vuex'
import Chat from '@/components/Chat.vue'
import RightInfo from "./RightInfo.vue"
import imgurl from '@/utils/common.js'
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
        dlImg,
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
        changeTypeList: [],
        targetUser:{},//聊天对象
        newRecordDialog:false,
        newRecordForm:{
          healthRadio: '0',//3不合格认证失败 4认证完成 7补交重新上传 5分配给其他员工 6培训中 0默认未认证 1联系不到人 2认证失败可重新认证
          recdNumber: 0,
          minValue: -100,
          maxValue: 100,
          newscore: '',
          newscore2: '',
          recdTarea: ''
        },
        detail:{},//阿姨详情
        newrecordId:"",
        totalScore:0,
        picArr:[],//健康证明照片
        disable1: false,
        disable2: false,
        recordLevel:"",//工资等级
        keyName:0,
        instr:"",
        rowUid:""//每行表格阿姨的uid
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
      ]),
      p1() {
        return this.newRecordForm.newscore2
      }
    },
    methods: {
      getList() {//获取表格数据
        let params = {
          examType: '',
          operation: 1,
          searchParameters:this.taSearchText,
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          token: this.getUsers.token
        }
        auditInfoList(params).then(res => {
          if(res.code == 200){
            let listArr=[];
            this.total = res.data.total
            listArr= res.data.records
            listArr.forEach(item =>{
              if(item.examTime !== null){
                item.date = item.examTime.addTime
              } else {
                item.date = item.createTime
              }
              item.name = item.name
              item.basic = item.status
              item.rskill = this.getcommonFun.tabKey(item.pid)
              item.major = item.skill.status
              // 服务礼仪
              item.service = item.quality.status
              // 专家评估
              if(item.skillOperation) {
                item.expert = item.skillOperation.status
              } else {
                item.expert = '--'
              }
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
      search() {//搜索
       this.getList()
      },
      cellClick(row) {// table整行点击
        this.rowUid=row.uid
        this.getDetailList()
        sessionStorage.setItem('talentDetail',JSON.stringify(row))
        this.$store.commit('updateTalent', row)
      },
      // page
      changePage(val) {
        this.currentPage = val
        this.getList()
      },
      // msg
      handleClick(row) {
        let user={}
        user.uid=row.id.toString();
        user.name=row.name;
        user.headImg=row.headimg
        this.targetUser=user;
        this.$refs.chat.showDialog()
      },
      // 培训
      trainClick(row) {
        let params = {
          app: 3,
          device: 5,
          id: row.id,
          token: this.getUsers.token,
          wid: row.uid
        }
        drill(params).then(res =>{
          if(res.code == 200) {
            this.$message.success({ message: '操作成功'})
            //this.$router.push('/talentTrain')
          }else{
            this.$message.error({ message: res.msg})
          }
        })
      },
      // 归档
      evaluationClick(row) {
        this.newRecordDialog=true;
      },
      changeClick(item) { // 更换大类
        this.changeDialogVisible = true
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
      submitNewRecordForm(newRecordForm) {//操作弹框里面提交
        if(this.newRecordForm.newscore != this.newRecordForm.newscore2 && this.newRecordForm.recdTarea == ''){
          this.$message.error({ message: '请填写调整理由', offset: 50 })
        }else{
          let params = {
            app: 3,
            description: this.newRecordForm.recdTarea,
            device: 5,
            id: this.getTalent.id,
            pid: this.newrecordId,
            score: this.newRecordForm.recdNumber,
            // 3认证失败 4认证完成 7补交 5分配给其他员工 6培训中 0默认未认证 1联系不到人 2认证失败可重新认证
            status: Number(this.newRecordForm.healthRadio),
            token: this.getUsers.token,
            wid: this.getTalent.uid,
          }
          auditInfo(params).then(res =>{
            if(res.code == 200) {
              if(this.newRecordForm.healthRadio == 4){
                this.$router.push('/talentSummary')
              } 
              if(this.newRecordForm.healthRadio == 3) {
                this.$store.commit('updateTalentActiveName','fourth')
                this.$router.push('/talentAudit')
              }
              this.newRecordForm.recdTarea=""
              this.getList();
              this.newRecordDialog = false
              this.$message.success({ message: '提交成功', offset: 50 })
            }
          })
        }
      },
      resetNewRecordForm(newRecordForm) {//操作弹框里面取消
        this.$refs[newRecordForm].resetFields()
        this.newRecordDialog = false
        this.newRecordForm.recdNumber = 0
        this.disable1 = false
        this.disable2 = false
        this.newRecordForm.healthRadio = 0
        this.newRecordForm.recdTarea=""
      },
      closeDialog(){//关闭操作弹框
        this.newRecordForm.recdNumber = 0
        this.newRecordForm.healthRadio = 0
        this.newRecordForm.recdTarea=""
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
          this.detail.photos.forEach(item =>{
            // 健康证明
            if(item.picType == 4){
              if(item.pic && item.pic.length > 0){
                item.pic.forEach(item =>{
                  this.picArr.push(imgurl + item.path)
                })
              }
            }
          })
         
           // 操作档案审核
          this.newRecordForm.newscore = this.totalScore
          this.newRecordForm.newscore2 = this.totalScore
          // 档案审核工资对应等级
          this.getSysMetaData.forEach(item =>{
            if (item.pid === 2 && item.status == 1) {
              if (this.newrecordId == item.id) {
                this.recordLevel = item.smData.level
              }
            }
          })
          this.getScore()
        }else{
          this.$message.error({ message: res.msg})
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
          this.newrecordId = this.getTalent.pid
        }
      },
      dec(num){//调整分减
        this.newRecordForm.recdNumber=Number(num)-1;
        this.newRecordForm.newscore2 = Number(this.newRecordForm.newscore) + Number(this.newRecordForm.recdNumber)
        if(this.p1 <= 66){
          this.disable1 = true
        }
        if(this.p1 >66 && this.p1 < 100){
          this.disable1 = false
          this.disable2 = false
        }
      },
      inc(num){//调整分加
        this.newRecordForm.recdNumber=Number(num)+1;
        this.newRecordForm.newscore2 = Number(this.newRecordForm.newscore) + Number(this.newRecordForm.recdNumber)
        if(this.p1 >66 && this.p1 < 100){
          this.disable1 = false
          this.disable2 = false
        }
        if(this.p1 >= 100){
          this.disable2 = true
        }
      },
      changeNumber(num) {//调整分数input输入值的改变方法
        this.newRecordForm.newscore2 = Number(this.newRecordForm.newscore) + Number(num)
        if(this.p1 <= 66){
          this.disable1 = true
          this.newRecordForm.newscore2 = 66
          this.newRecordForm.recdNumber = 66 - this.newRecordForm.newscore
        }
        if(this.p1 >= 100){
          this.disable2 = true
          this.newRecordForm.newscore2 = 100
          this.newRecordForm.recdNumber = 100 - this.newRecordForm.newscore
        }
        if(this.p1 >66 && this.p1 < 100){
          this.disable1 = false
          this.disable2 = false
        }
      },
      changeHealth(val) {
        this.newRecordForm.healthRadio = val
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
  display:inline-block;
  border-radius: 100%;
  position: relative;
  text-align: center;
  vertical-align:middle;
  margin-right:10px;
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

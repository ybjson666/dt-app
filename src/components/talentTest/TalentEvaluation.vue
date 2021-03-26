<template>
  <div class="tinntay-cont talent-eva">
    <div class="talentAudit r410" style="padding-top:0;">
      <el-row class="h101">
        <el-col :span="9" class="zscore1">
          <div class="tablent-md clearfix">
            <div class="tablent-search bd">
              <el-input placeholder="编号/手机号/关键字" v-model="taSearchText">
              </el-input>
              <a href="javascript:void(0);" class="talent-btn" @click="search"><img :src="sUrl" alt=""></a>
            </div>
          </div>
          <div class="tablent-content">
            <el-table :data="tableDataList" @current-change="handleCurrentChange" @row-click="cellClick" highlight-current-row border style="width: 100%">
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
                  <!-- <span class="bold">{{(new Date().getFullYear()) - (scope.row.age).substr(0,4)}}</span> -->
                  <span class="bold">{{scope.row.age === null?'--': scope.row.age}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="rskill" label="认证技能" width="">
                <template slot-scope="scope">
                  <span v-if="scope.row.rskill">
                    <span class="bold">{{scope.row.rskill}}</span>
                    <!-- <span class="changeImg" @click="changeClick(scope.row.skill)"><img :src="changeUrl" alt=""></span> -->
                  </span>
                  <span class="green" v-else>--</span>
                </template>
              </el-table-column>
              <!-- <el-table-column label="操作" fixed="right" width="120">
                <template slot-scope="scope">
                  <el-button @click="evaluationClick(scope.row)" size="small" class="tg-btn">
                      测评
                  </el-button>
                </template>
              </el-table-column> -->
            </el-table>
            <Page :currentPage="currentPage" :pageSize="pageSize" :total="total" @changePage="changePage" v-if="this.tableDataList.length > 0"></Page>
          </div>
        </el-col>
        <el-col :span="15" class="zscore">
          <el-row class="zscore-hd color1 fw6">专家打分</el-row>
          <el-row>
            <div class="zwsj" v-show="zjShow1">
              <img :src="zwsjImg" alt=""><br />
              暂无数据
            </div>
            <el-col :span="18" v-show="zjShow2">
              <el-row class="expert-name">
                <el-col>考生：{{expertName}}</el-col>
                <el-col>电话：{{expertPhone+'' | numMask}}</el-col>
              </el-row>
              <el-row class="addDialog active hd hd2">
                <el-row class="record">
                  <el-form :model="testForm" ref="testForm">
                    <el-row>
                      <el-form-item :label="item.name+'：'"  v-for="(item,index) in quality1" :key="index" class="record-item on" style="margin-top:10px">
                        <el-row class="bak1">
                          <el-radio-group v-model="qualityItems[index]" class="fen" @change="((label)=>{changeScore(label, item, index)}) ">
                            <el-radio-button :label="sitem" v-for="(sitem,index) in item.endScore" :key="index">{{sitem+'分'}}</el-radio-button>
                          </el-radio-group>
                        </el-row>
                      </el-form-item>
                      <el-form-item label="主要擅长：" class="record-item on">
                        <el-row class="bak1">
                          <el-checkbox-group v-model="testForm.zysc" class="zysc" @change="changeTag">
                            <el-checkbox-button v-for="item in zyscList" :label="item" :key="item">{{getcommonFun.tabKey(item)}}</el-checkbox-button>
                          </el-checkbox-group>
                        </el-row>
                      </el-form-item>
                      <el-form-item label="专家评价：" class="record-item on" style="margin-top:10px">
                        <el-row class="bak1 holder">
                          <el-input type="textarea" :placeholder="placeholder" v-model="testForm.zjpj" :class="bdcolor?'on':''" @focus="textareaFocus" @blur="textareaBlur"></el-input>
                        </el-row>
                      </el-form-item>
                      <el-form-item class="aform-footer" style="margin-top:10px;text-align:right;">
                        <el-button @click="submitTestForm('testForm')">提 交</el-button>
                      </el-form-item>
                    </el-row>
                  </el-form>
                </el-row>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { auditInfoList, addAnswer } from '@/api/api'
import Page from '@/components/Page.vue'
import { mapGetters } from 'vuex'
  export default {
    name: 'talentTrial',
    components: {
      Page
    },
    data() {
      const zwsjUrl = require('@/assets/images/zwsj.png')
      const searchIMg = require('@/assets/images/search2.png')
      return {
        zwsjImg: zwsjUrl,
        taSearchText: '',
        sUrl: searchIMg,
        currentPage: 1,
        pageSize: 10,
        total: 0,
        tableDataList:[],
        tabList: [],
        currentRow: [],
        // 测评结果
        testForm: {
          score:'',
          zysc:[],
          zjpj: ''
        },
        bdcolor: false,
        placeholder: '阿姨学习上有些困难，但愿意学，心态好，但各方面技能有待和宝 宝互动能力有待提高。',
        testResult:[],
        quality1: [],
        zyscList: [],
        qualityItems:[],
        scoreList:[],
        qscore: '',
        keyType: '',
        zjShow1: true,
        zjShow2: false,
        expertName: '',
        expertPhone: ''
      }
    },
    created() {
      this.getList()
    },
    computed:{
      ...mapGetters([
          'getTalent',
          'getUsers',
          'getSysMetaData'
      ])
    },
    methods: {
      getList() {
        let params = {
          examType: '',
          operation: 2,
          searchParameters:this.taSearchText,
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          token: this.getUsers.token
        }
        auditInfoList(params).then(res => {
          if(res.code == 200){
            this.tableDataList = res.data.records
            this.total = res.data.total
            this.tableDataList.forEach(item =>{
              if(item.examTime !== null){
                item.date = item.examTime.addTime
              } else {
                item.date = item.createTime
              }
              item.name = item.name
              item.age = item.age
              item.rskill = this.getcommonFun.tabKey(item.pid)
            })
          }
        })
      },
      // search
      search() {
       this.getList()
      },
      // table
      handleCurrentChange(val) {
        this.currentRow = val
      },
      // table整行
      cellClick(row,event,column) {
        this.zjShow1 = false
        this.zjShow2 = true
        this.keyType = row.pid
        this.expertName = row.name
        this.expertPhone = row.phone
        // 清空选项
        this.qualityItems = []
        
        this.getSysMetaData.forEach(item =>{
          if (item.pid === 2 && item.status == 1) {
            this.testResult.push(item)
            if (this.keyType == item.id) {
              this.quality1 = item.smData.quality;
              this.zyscList = item.smData.adept;
            }
          }
        })
        this.$store.commit('updateTalent', row)
        this.$emit('fatherMethod')
      },
      // page
      changePage(val) {
        this.currentPage = val
        this.getAuditList()
      },
      // 测评
      // evaluationClick(row) {
      //   console.log(row);
      // },
      changeScore(score,item){
        this.qualityItems.forEach(item =>{
          this.qscore = item
        })
        this.scoreList[item.id-1] = {
          id: item.id,
          score: score
        }
      },
      changeTag(val) {
        console.log(val)
      },
      // 测评结果提交-取消
      submitTestForm(testForm) {
        if((this.qualityItems+'').indexOf('0') == -1) {
        // if(this.qscore != 0) {
          let params = {
            app: 3,
            assessorComment: this.testForm.zjpj,
            device: 5,
            id: this.getTalent.id,
            listAnswer: this.scoreList,
            phone: '',
            tag: this.testForm.zysc,
            token: this.getUsers.token,
            type: this.keyType,
            uid: this.getTalent.uid,
          }
          addAnswer(params).then(res =>{
            if(res.code == 200) {
              this.$message.success({ message: '提交成功', offset: 50 })
              this.$store.commit('updateTalentActiveName','third')
              this.$router.push('/talentAudit')
            }
          })
        } else{
          this.$message.error({ message: '请选择剩下的分数', offset: 50 })
        }
      },
      // textareaFocus
      textareaFocus(){
        this.bdcolor = true
        this.placeholder = ''
      },
      textareaBlur(){
        this.bdcolor = false
        this.placeholder = '阿姨学习上有些困难，但愿意学，心态好，但各方面技能有待和宝 宝互动能力有待提高。'
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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

.expert-name{
  padding-top: 20px;
  padding-left: 20px;
  .el-col{
    font-size: 16px;
    font-weight: 400;
    color: #202D40;
    margin-bottom: 2px;
  }
}
</style>

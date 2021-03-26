<template>
  <div class="talentAudit">
    <div class="pages-container">
      <div class="pages-wraps">
        <div class="page-table-content">
          <div class="tablent-md clearfix">
            <div class="tablent-search bd">
              <el-input placeholder="请输入订单号/手机号/姓名/关键字搜索" v-model="searchParameters">
              </el-input>
              <a href="javascript:void(0);" class="talent-btn" @click="search"><img :src="sUrl" alt=""></a>
            </div>
            <div class="tablent-date fr flexbox align-items-center">
              <el-date-picker
                v-model="tablentDate"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                @change="changeDate">
              </el-date-picker>
              <el-select class="bd" v-model="selectValue" clearable filterable placeholder="请选择" :class="bdcolor?'bdcolor':''" @visible-change="changeBorder" @change="changeSelect">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="tablent-content">
            <el-table :data="tableDataList" highlight-current-row border style="width: 100%">
              <el-table-column prop="date" label="缴费时间" width="">
                <template slot-scope="scope">
                  <span v-if="scope.row.createTime">{{ (scope.row.createTime).substr(0,10) }}<br />{{ (scope.row.createTime).substr(11,8) }}</span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column width="">
                <template slot="header">
                  雇员ID<br />联系方式
                </template>
                <template slot-scope="scope">
                  <span>
                    ID：{{scope.row.id}}<br />
                    {{scope.row.phone}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="skill" label="认证项目" width="">
                <template slot-scope="scope">
                  <span class="ft16 fw6 color1">{{scope.row.authName}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="pay" label="缴费金额" width="">
                <template slot-scope="scope">
                  <span class="ft16 fw6 f13">¥{{scope.row.price}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="payment" label="支付方式" width="">
                <template slot-scope="scope">
                  <span v-if="scope.row.channel == 1">微信支付</span>
                  <span v-if="scope.row.channel == 2">支付宝支付</span>
                  <span v-if="scope.row.channel == 3">网银支付</span>
                  <span v-if="scope.row.channel == 4">线下支付</span>
                </template>
              </el-table-column>
              <el-table-column prop="recommender" label="推荐人" width="">
                <template slot-scope="scope">
                  <span>{{scope.row.inviteName||"--"}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="certification" label="认证情况" width="">
                <template slot-scope="scope">
                  <span class="green" v-if="scope.row.auth == 0">认证通过</span>
                  <span class="orange1" v-if="scope.row.auth == 1">身份证认证中</span>
                  <span class="f13" v-if="scope.row.auth == 2">身份证认证未通过</span>
                  <span class="orange1" v-if="scope.row.auth == 3">人脸识别认证中</span>
                  <span class="f13" v-if="scope.row.auth == 4">人脸识别认证未通过</span>
                  <span class="orange1" v-if="scope.row.auth == 5">征信认证中</span>
                  <span class="f13" v-if="scope.row.auth == 6">征信认证未通过</span>
                  <span class="orange1" v-if="scope.row.auth == 7">考试成绩验证中</span>
                  <span class="f13" v-if="scope.row.auth == 8">考试成绩不合格</span>
                  <span class="orange1" v-if="scope.row.auth == 9">能力测评验证中</span>
                  <span class="f13" v-if="scope.row.auth == 10">能力测评验证未通过</span>
                  <span class="orange1" v-if="scope.row.auth == 11">健康状态验证中</span>
                  <span class="f13" v-if="scope.row.auth == 12">健康状态验证未通过</span>
                  <span class="f13" v-if="scope.row.auth == 13">资料不齐全</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right" width="120">
                <template slot-scope="scope">
                  <span class="theme2 fw6" style="cursor:pointer;" v-if="scope.row.auth != 0&&scope.row.id" @click="refundClick(scope.row)" >
                    退款
                  </span>
                  <span class="f13 fw6" style="display: block;" v-else>
                    <span v-if="scope.row.status==7">
                      <span>-¥{{scope.row.refund}}</span>
                      <span class="refund" :style="{'backgroundImage': 'url(' + refundImg + ')'}">已退单</span>
                    </span>
                    <span v-else class="gray">退款</span>
                  </span>
                </template>
              </el-table-column>
            </el-table>
            <Page :currentPage="pageNo" :pageSize="pageSize" :total="total" @changePage="changePage" v-if="this.tableDataList.length > 0"></Page>
          </div>
        </div>
        <div class="page-detail-block">
          <div class="tin-right on">
            <div class="testList">
              <el-row class="theory">
                <div class="theory-list">
                  <el-row class="income-title">收入数据</el-row>
                  <el-row class="income-list">
                    今日收入<span>¥{{incomData.todayIncome||0}}</span>
                  </el-row>
                  <el-row class="income-list">
                    今日退款<span>¥{{incomData.todayRefund||0}}</span>
                  </el-row>
                </div>
                <div class="theory-list">
                  <el-row class="income-title">今日收入金额明细</el-row>
                  <el-row class="income-list">
                    支付宝收入<span>¥{{incomData.zfbIncome||0}}</span>
                  </el-row>
                  <el-row class="income-list">
                    微信收入<span>¥{{incomData.wxIncome||0}}</span>
                  </el-row>
                  <el-row class="income-list">
                    银联收入<span>¥{{incomData.unionIncome||0}}</span>
                  </el-row>
                </div>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 退款 -->
    <el-dialog title="退款" :visible.sync="refundDialog" :close-on-click-modal="false" @close="closeRefundDialog" width="" center class="newRecordAdd addDialog active hd hd2 invalid">
      <el-row class="orderInvalid">
        <el-row class="flexbox" style="margin-bottom:.15rem;">
        退款原因：
        <el-select v-model="refundReason" placeholder="--请选择--" class="elSelect flexauto" @change="changeRefund">
          <el-option
            v-for="item in refundList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        </el-row>
        <el-row class="flexbox">
          退款金额：
          <el-row class="refund-inp elSelect flexauto">
            <el-input v-model="refundInput" placeholder="默认退50%" class=""></el-input>
          </el-row>
          元
        </el-row>
      </el-row>
      <el-row class="aform-footer">
          <el-button @click="closeRefundDialog">取 消</el-button>
          <el-button @click="submitRefund">提 交</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getTrainFreeList,getIncomes,refund } from '@/api/api'
import Page from '@/components/Page.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'authenFee',
  components: {
    Page
  },
  data() {
    return {
      refundImg: require('@/assets/images/refund.png'),
      sUrl: require('@/assets/images/search2.png'),
      tableDataList: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      currentRow: [],
      tablentDate:'',
      options: [],
      selectValue: '--请选择--',
      refundDialog: false,
      refundMoney:'',//退款金额
      refundReason:"",//退款原因
      refundList:[
        {
          value: '认证未通过',
          label: '认证未通过'
        },
        {
          value: '介绍免认证费',
          label: '介绍免认证费'
        },
        {
          value: '销售免认证费',
          label: '销售免认证费'
        },
        {
          value: '其他',
          label: '其他'
        }
      ],
      refundInput: '',
      bdcolor:false,
      endTime:"",
      startTime:"",
      serviceId:"",
      searchParameters:"",
      incomData:{},
      pid:""
    }
  },
  created() {
    this.getSysMetaData.forEach(item =>{
      if (item.pid === 2 && item.status == 1) {
        this.options.push(item)
      }
    })
    this.getTableDatas()
    this.ReqIncomes()
  },
  computed:{
    ...mapGetters([
        'getUsers',
        'getSysMetaData'
    ])
  },
  methods: {
    async getTableDatas(){//获取表格数据
      const {serviceId,searchParameters,startTime,endTime,pageNo,pageSize} =this
      let params={
        serviceId,
        searchParameters,
        startTime,
        endTime,
        pageNo,
        pageSize,
      }
      const result=await getTrainFreeList(params)
      if(result.code===200){
        this.tableDataList =  result.data.records
        this.total = result.data.total
      }
      
    },
    async ReqIncomes(){//获取收入数据
      const result=await getIncomes()
      if(result.code===200){
        if(result.data){
          this.incomData=result.data
        }else{
          this.incomData={}
        }
      }
    },
    search() { // 搜索
      this.getTableDatas()
    },
    changePage(val) {//分页
      this.pageNo = val
      this.getTableDatas()
    },
    refundClick(row) { // 退款点击
      this.refundMoney=parseInt(row.price)
      this.pid=row.id
      this.refundDialog = true
    },
    reqRefund(callback){//申请退款
      const {refundMoney,refundReason,pid,refundInput}=this
      if(!pid||!refundMoney){
        return false;
      }
      let defaultMoney=(refundMoney*0.5).toFixed(2)
      let money=refundInput?refundInput:defaultMoney
      let params={
        "app": 0,
        "device": 0,
        pid,
        refundMoney:money,
        refundReason,
        "token": this.getUsers.token
      }

      refund(params).then(data=>{
        callback(data)
      })

    },
    changeRefund(val){
      this.refundReason=val
    },
    submitRefund(){
      if(!this.refundReason){
        this.$message.error('请选择退款原因')
      }else{
        this.reqRefund((data)=>{
          if(data.code===200){
            this.closeRefundDialog()
          }
        })
      }
    },
    closeRefundDialog(){
      this.refundDialog = false
      this.refundReason=""
      this.refundInput = ''
    },
    changeDate(val) {//日期筛选
      this.startTime=val[0]
      this.endTime=val[1]
      this.getTableDatas()
    },
    changeBorder(val){// select-border
      this.bdcolor = val
    },
    changeSelect(val){//服务筛选
      this.serviceId = val
      this.getTableDatas()
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

.fen-btn{
  width:36px;
  height:36px;
  background: #edf5ff;
  -moz-border-radius: 100%;
  border-radius: 100%;
  position: relative;
  text-align: center;
  margin-left: 0 !important;
  margin-right: 10px;
  &:last-child{
    margin-right: 0;
  }
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

.theoryOrderlist{
    height: 100%;
    background: #fff;
    box-shadow: 0 0 0.08rem 0 rgba(0, 0, 0, 0.06);
    border-radius: 0.07rem;
    padding: 0.24rem 0.15rem;
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

.income-title{
  font-size: 18px;
  font-weight: 600;
  color: #202D40;
  margin-bottom: 30px;
}
.income-list{
  font-size: 16px;
  font-weight: 600;
  color: #202D40;
  margin-bottom: 30px;
  padding:0 11px;
  span{
    float: right;
  }
}
.theory-list{
  .income-list:last-child{
    margin-bottom: 6px;
  }
}
.refund{
  display: block;
  float: right;
  width: 60px;
  height: 24px;
  line-height: 24px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  font-size: 12px;
  color: #fff;
  text-align: center;
  padding-left: 5px;
}
.refund-inp{
  min-width: auto;
  margin-right: 20px;
  .el-input{
    position: absolute;
    top: 0;
    left: 0;
  }
}
.gray{
  color:#ccc;
}
.green{
  color: rgb(27, 180, 65);
}

</style>

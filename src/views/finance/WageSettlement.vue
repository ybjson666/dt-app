<template>
  <div class="talentAudit wage">
    <div class="pages-container">
      <div class="pages-wraps">
        <div class="page-table-content">
          <div class="tablent-content">
            <el-row class="order-wage">
              <el-row class="order-gzjs">今日工资结算</el-row>
              <el-table :data="dataListTody" highlight-current-row @row-click="cellClick" border style="width: 100%">
                <el-table-column prop="oid" label="订单号" width="" fixed>
                  <template slot-scope="scope">
                    <el-popover trigger="hover" placement="bottom">
                      <div class="pd10 color1">{{scope.row.oid}}</div>
                      <span class="cf09 ellips" slot="reference">{{scope.row.oid}}</span>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column prop="wname" label="雇员" width="120">
                  <template slot-scope="scope">
                    <span class="pers">
                      <img v-if="scope.row.headimg" :src="scope.row.headimg |imgFormat"/>
                      <img :src="persImg" alt="" v-else/>
                      {{scope.row.wname}}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="demand" label="服务项目" width="120">
                  <template slot-scope="scope">
                    <span class="color1 fw6">{{scope.row.typeName}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="follow" label="跟进人" width="100">
                  <template slot-scope="scope">
                    <span class="color1">{{scope.row.ename}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="pstatus" label="雇主本月缴费情况" width="150">
                  <template slot-scope="scope">
                    <span class="color1" v-if="scope.row.status == 1">未缴费</span>
                    <span class="f13" v-if="scope.row.status == 2">已缴费</span>
                    <span class="f13" v-if="scope.row.status == 3">支付失败</span>
                    <span class="f13" v-if="scope.row.status == 4">已过期</span>
                  </template>
                </el-table-column>
                <el-table-column prop="money" label="工资结算金额" width="140">
                  <template slot-scope="scope">
                    <span class="f13 fw6">¥{{scope.row.workPay}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="date" label="结算日期" width="140">
                  <template slot-scope="scope">
                    <span>每月{{scope.row.payTime}}日</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button size="small" class="tg-btn on"  v-if="scope.row.payWorker == 1">已支付</el-button>
                    <el-button size="small" class="tg-btn"  v-else-if="scope.row.payWorker == 0" @click="goPay">去支付</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <Page :currentPage="cutPageTody" :pageSize="pSizeTody" :total="totalTody" @changePage="chPageTody"></Page>
            </el-row>
            <el-row class="order-wage">
              <el-row class="order-gzjs">7日内工资结算</el-row>
              <el-table :data="dataListSeven" highlight-current-row  @row-click="cellClick" border style="width: 100%">
                <el-table-column prop="number" label="订单号" width="" fixed>
                  <template slot-scope="scope">
                    <el-popover trigger="hover" placement="bottom">
                      <div class="pd10 color1">{{scope.row.oid}}</div>
                      <span class="cf09 ellips" slot="reference">{{scope.row.oid}}</span>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column prop="personal" label="雇员" width="120">
                  <template slot-scope="scope">
                    <span class="pers">
                      <img v-if="scope.row.headimg" :src="scope.row.headimg |imgFormat"/>
                      <img :src="persImg" alt="" v-else/>
                      {{scope.row.wname}}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="demand" label="服务项目" width="120">
                  <template slot-scope="scope">
                    <span class="color1 fw6">{{scope.row.typeName}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="follow" label="跟进人" width="100">
                  <template slot-scope="scope">
                    <span class="color1">{{scope.row.ename}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="pstatus" label="雇主本月缴费情况" width="150">
                  <template slot-scope="scope">
                    <span class="color1" v-if="scope.row.status == 1">未缴费</span>
                    <span class="f13" v-if="scope.row.status == 2">已缴费</span>
                    <span class="f13" v-if="scope.row.status == 3">支付失败</span>
                    <span class="f13" v-if="scope.row.status == 4">已过期</span>
                  </template>
                </el-table-column>
                <el-table-column prop="money" label="工资结算金额" width="140">
                  <template slot-scope="scope">
                    <span class="f13 fw6">¥{{scope.row.workPay}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="date" label="结算日期" width="140">
                  <template slot-scope="scope">
                    <span>每月{{scope.row.payTime}}日</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button size="small" class="tg-btn on"  v-if="scope.row.payWorker == 1">已支付</el-button>
                    <el-button size="small" class="tg-btn"  v-else-if="scope.row.payWorker == 0" @click="goPay">去支付</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <Page :currentPage="cutPageSeven" :pageSize="pSizeSeven" :total="totalSeven" @changePage="chPageSeven"></Page>
            </el-row>
          </div>
        </div>
        <div class="page-detail-block">
            <div class="tin-right on">
              <div class="testList" v-if="curOrder.id">
                <el-row class="theory">
                  <el-row class="theoryOrderlist">
                      <el-row class="orderNum">订单编号：{{curOrder.oid}}</el-row>
                      <el-row class="order-server">
                        <el-col>
                          <span>{{curOrder.title}}</span>
                        </el-col>
                      </el-row>
                      <el-row class="order-contract">
                        <el-row class="orderctlist flexbox flex-direction-row align-items-center">
                          <img :src="contractImg" alt="">
                          <el-col class="flexauto">
                            <p class="ft16 fw4 color1" style="margin-bottom:.05rem;">合同编号：{{curOrder.aid}}</p>
                            <p class="ft14 fw4 color4">{{curOrder.serviceTime}}</p>
                          </el-col>
                        </el-row>
                      </el-row>
                      <el-row class="order-review">
                        <el-row class="order-review-hd flexbox flex-direction-row align-items-center">
                          <img :src="curOrder.headimg |imgFormat" alt="" class="reviewimg1" v-if="curOrder.headimg"/>
                          <img :src="persImg" alt="" class="reviewimg1" v-else/>
                          <el-row class="flexauto">
                            <p class="p1 ft16 color1">{{curOrder.wname}}</p>
                            <p class="p2 ft16 color3">编号：{{curOrder.wid}}</p>
                          </el-row>
                        </el-row>
                        <el-row class="order-review-bd">
                          <el-row class="order-review-list">
                            <el-col :span="10" class="ft16 color3">每月薪资：</el-col>
                            <el-col :span="12" class="ft16 color2">{{curOrder.workPay||0}}元</el-col>
                          </el-row>
                          <el-row class="order-review-list">
                            <el-col :span="10" class="ft16 color3">工资代付日期：</el-col>
                            <el-col :span="12" class="ft16 color2">每月{{curOrder.payTime}}日</el-col>
                          </el-row>
                          <el-row class="order-review-total hd fw6 flexbox">
                            <el-col :span="16" class="flexauto">代付工资：<span class="f13">{{curOrder.workPay||0}}元</span></el-col>
                            <el-col :span="8">
                              <el-button class="review-btn on" v-if="curOrder.payWorker == 1">已支付</el-button>
                              <el-button class="review-btn" v-else-if="curOrder.payWorker == 0" @click="goPay">去支付</el-button>
                            </el-col>
                          </el-row>
                        </el-row>
                      </el-row>
                  </el-row>
                </el-row>
              </div>
              <div v-else class="none-datas">
                <div class="zwsj">
                  <img :src="zwsjImg" alt=""><br />
                  <span>暂无数据</span>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSettleTody, getSettleSeven,payOut } from '@/api/api'
import { mapGetters } from 'vuex'
import Page from '@/components/Page.vue'
  export default {
    name: 'entryAudit',
    data() {
      return {
        persImg: require('@/assets/images/head_man.png'),
        contractImg: require('@/assets/images/contract.png'),
        zwsjImg:require('@/assets/images/zwsj.png'),
        dataListTody: [],
        dataListSeven: [],
        cutPageSeven:1,
        cutPageTody:1,
        pSizeSeven:10,
        pSizeTody:10,
        totalSeven:0,
        totalTody:0,
        curOrder:{}
      }
    },
    components:{
      Page
    },
    created() {
      this.reqGetTodyDatas()
      this.reqGetSevenDatas()
    },
    computed:{
      ...mapGetters([
          'getUsers',
          'getSysMetaData',
          'getEntryFlag'
      ])
    },
    methods: {
      cellClick(row,event,column) {// table整行点击
        this.curOrder=row
      },
      async reqGetTodyDatas(){//获取今日工资结算
        let params={
          "app": 3,
          "device": 5,
          "pageNo": this.cutPageTody,
          "pageSize": this.pSizeTody,
          "token": this.getUsers.token
        }
        const result=await getSettleTody(params)
        if(result.code===200){
            this.dataListTody=result.data.records
            this.totalTody= result.data.total
        }else{
          this.$message.error({message:result.msg})
        }
      },
      async reqGetSevenDatas(){//获取七日工资结算
        let params={
          "app": 3,
          "device": 5,
          "pageNo": this.cutPageSeven,
          "pageSize": this.pSizeSeven,
          "token": this.getUsers.token
        }
        const result=await getSettleSeven(params)
        if(result.code===200){
            this.dataListSeven=result.data.records
            this.totalSeven=result.data.total
        }else{
          this.$message.error({message:result.msg})
        }
      },
      chPageTody(page){//今日工资结算分页
        this.cutPageTody=page
        this.reqGetTodyDatas()
      },
      chPageSeven(){//七日内工资结算分页
        this.cutPageSeven=page
        this.reqGetSevenDatas()
      },
      goPay(){//支付工资
        this.$confirm('是否确定支付工资?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
            let params={
              "app": 3,
              "device": 5,
              "pid": this.curOrder.id,
              "salary": this.curOrder.workPay,
              "token": this.getUsers.token,
              "wid":this.curOrder.wid
            }
            payOut(params).then(res =>{
              if(res.code == 200){
                this.$message.success({ message: '支付成功'})
                this.curOrder.payWorker=1
                this.reqGetTodyDatas()
                this.reqGetSevenDatas()
              }else{
                this.$message.error({ message:res.msg})
              }
            })

        }).catch((error)=>{
          this.$message.info({message:"支付已取消"})
        })
      }
    }
  }
</script>
<style scoped lang="scss">
.page-table-content{
  background:#f5f5f5;
}
.tg-btn{
  width:80px;
  height:36px;
  line-height: 36px;
  border-radius: 18px;
  border-radius: 18px;
  font-size: 16px;
  background: #1882FC;
  color: #fff;
}
.tg-btn.on{
  background: #9A9A9A;
  color: #fff;
  cursor: text;
}

.theoryOrderlist{
    height: 100%;
    background: #fff;
    box-shadow: 0 0 0.08rem 0 rgba(0, 0, 0, 0.06);
    border-radius: 0.07rem;
    padding: 0.24rem 0.15rem;
    // margin-bottom: 0.2rem;
    .orderNum{
      font-size: 18px;
      font-weight: 600;
      color: #202D40;
    }
    .order-server{
      padding: 12px 0;
      margin-top: 10px;
      .el-col{
        font-size: 16px;
        font-weight: 400;
        color: #202D40;
      }
    }
    .order-contract{
      padding: 12px 0;
      border-bottom: 1px solid #eee;
      .orderctlist{
        margin-bottom: 10px;
        img{
          width: 35px;
          // height: 40px;
          margin-right: 20px;
        }
        p{
          a{
            margin-right: 10px;
            &:hover{
              text-decoration: none;
              color: #009CFF;
            }
          }
        }
      }
    }
    .orderHlist{
      .orderHlist-hd{
        padding: 12px 10px;
        border-bottom: 1px solid #eee;
        .odimg{
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-right: 20px;
        }
        .orderHlist-p{
          margin-bottom: 5px;
        }
        .orderHlist-msg{
          cursor: pointer;
        }
      }
    }
    .order-review{
      padding: 12px 0;
      border-bottom: 1px solid #eee;
      .order-review-hd{
        .reviewimg1{
          width: 55px;
          height: 55px;
          margin-right: 26px;
          border-radius: 4px;
        }
        .reviewimg2{
          margin-right: 7px;
        }
        .p1{
          margin-bottom: 5px;
          padding-right: 10px;
          span{
            float: right;
            font-size: 14px;
            color: #FF8004;
          }
        }
      }
      .order-review-bd{
        margin-top: 25px;
        .order-review-list{
          margin-bottom: 10px;
          .el-col-10{
            text-align: right;
            padding-right: 20px;
          }
        }
        .order-review-total{
          font-size: 16px;
          color: #202D40;
          text-align: right;
          margin-top: 30px;
          padding-right: 10px;
        }
        .order-review-total.hd{
          line-height: 32px;
          text-align: left;
          padding-left: 10px;
          justify-content: space-between;
          .review-btn{
            display: block;
            float: right;
            width: 90px;
            height: 32px;
            line-height: 32px;
            background: #0081FF;
            font-size: 16px;
            text-align: center;
            color: #fff;
          }
          .on{
            background: #9A9A9A;
            color: #fff;
            cursor: text;
          }
        }
      }
    }
}

.pers{
  img{
    width: 26px;
    height:26px;
    border-radius: 4px;
  }
}
.order-gzjs{
    line-height: 0.16rem;
    font-size: 0.16rem;
    font-weight: 600;
    color: #202D40;
    padding-left: 0.15rem;
    margin-bottom: .15rem;
    &:before{
      width: 0.04rem;
      height: 0.16rem;
      background: #1882FC;
      position: absolute;
      top: 50%;
      left: 0;
      margin-top: -0.08rem;
    }
}
.none-datas{
  background: #fff;
  height:100%;
  border-radius: 7px;
}
</style>


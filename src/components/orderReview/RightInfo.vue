<template>
  <div class="tin-right on">
      <div class="testList">
        <el-row class="theory">
          <el-row class="theoryOrderlist">
              <el-row class="orderNum">订单编号：{{curOrder.id}}</el-row>
              <el-row class="order-server">
                <el-col>
                  服务项目：{{curOrder.title}}
                </el-col>
              </el-row>
              <el-row class="order-contract">
                <el-row class="orderctlist flexbox flex-direction-row align-items-center">
                  <img :src="contractImg" alt="">
                  <el-col class="flexauto">
                    <p class="ft16 fw4 color1" style="margin-bottom:.05rem;">
                      <span>合同编号：</span>
                      <a :href="`${contractUrl}/order/agreement/h5?gid=${curOrder.aid}&type=3`" v-if="curOrder.aid" target="blank">{{curOrder.aid}}</a> 
                      <span v-else>--</span> 
                    </p>
                    <p class="ft14 fw4 color4">合同有效期：{{curOrder.serviceTime||'--'}}</p>
                  </el-col>
                </el-row>
              </el-row>
              <el-row class="order-review">
                <el-row class="order-review-hd flexbox flex-direction-row align-items-center">
                  <img :src="curOrder.cheadImg |imgFormat" alt="" class="reviewimg1" v-if="curOrder.cheadImg">
                  <img :src="persImg" alt="" v-else class="reviewimg1">
                  <el-row class="flexauto">
                    <p class="p1 ft16 color1">
                      <span class="fl">{{curOrder.cname}}</span>
                      <span v-if="activeName == 'first'" class="fr">
                        <span v-if="curOrder.channel==1">微信支付</span>
                        <span v-else-if="curOrder.channel==2">字符包支付</span>
                        <span v-else-if="curOrder.channel==3">网银支付</span>
                        <span v-else-if="curOrder.channel==4">线下支付</span>
                      </span>
                    </p>
                    <p class="p2 ft16 color3">
                      <img :src="refundImg" alt="" class="reviewimg2">
                      <span>{{curOrder.phone}}</span>
                    </p>
                  </el-row>
                </el-row>
                <el-row class="order-review-bd" v-if="activeName == 'first'">
                  <el-row class="order-review-list">
                    <el-col :span="10" class="ft16 color3">前期服务费：</el-col>
                    <el-col :span="12" class="ft16 color2">{{curOrder.servicePay||0}}元</el-col>
                  </el-row>
                  <el-row class="order-review-list">
                    <el-col :span="10" class="ft16 color3">每月服务费：</el-col>
                    <el-col :span="12" class="ft16 color2">{{curOrder.serviceMonthPay||0}}元</el-col>
                  </el-row>
                  <el-row class="order-review-list">
                    <el-col :span="10" class="ft16 color3">雇员月工资：</el-col>
                    <el-col :span="12" class="ft16 color2">{{curOrder.workPay||0}}元</el-col>
                  </el-row>
                  <el-row class="order-review-list">
                    <el-col :span="10" class="ft16 color3">优惠券：</el-col>
                    <el-col :span="12" class="ft16 color2">-{{curOrder.amount||0}}元</el-col>
                  </el-row>
                  <el-row class="order-review-total fw6">
                    收入总计：<span class="f13">{{curOrder.payMoney}}元</span>
                  </el-row>
                </el-row>
                <el-row class="order-review-bd" v-if="activeName == 'second'">
                  <!-- <el-row class="order-review-list">
                    <el-col :span="10" class="ft16 color3">退还服务费：</el-col>
                    <el-col :span="12" class="ft16 color2">{{curOrder.relieveRefundCustomer||0}}元</el-col>
                  </el-row>
                  <el-row class="order-review-list">
                    <el-col :span="10" class="ft16 color3">退剩余工资：</el-col>
                    <el-col :span="12" class="ft16 color2">{{curOrder.relieveSalaryWorker||0}}元</el-col>
                  </el-row> -->
                  <el-row class="order-review-total hd fw6 flexbox">
                    <el-col :span="16" class="flexauto">总计退费：<span class="f13">{{curOrder.relieveRefundCustomer||0}}元</span></el-col>
                    <el-col :span="8"><el-button class="review-btn" @click="handleAgree" v-if="curOrder.relieveRefundCustomer>0">同意退款</el-button></el-col>
                  </el-row>
                </el-row>
              </el-row>
              <el-row class="order-review">
                <el-row class="order-review-hd flexbox flex-direction-row align-items-center">
                  <img :src="curOrder.headimg |imgFormat" alt="" class="reviewimg1" v-if="curOrder.headimg">
                  <img :src="persImg" alt="" class="reviewimg1" v-else>
                  <el-row class="flexauto">
                    <p class="p1 ft16 color1">{{curOrder.wname}}</p>
                    <p class="p2 ft16 color3">编号：{{curOrder.wid}}</p>
                  </el-row>
                </el-row>
                <el-row class="order-review-bd" v-if="activeName == 'first'">
                  <el-row class="order-review-list">
                    <el-col :span="10" class="ft16 color3">每月薪资：</el-col>
                    <el-col :span="12" class="ft16 color2">{{curOrder.workPay||0}}元</el-col>
                  </el-row>
                  <el-row class="order-review-list">
                    <el-col :span="10" class="ft16 color3">工资代付日期：</el-col>
                    <el-col :span="12" class="ft16 color2">每月{{curOrder.issuTime}}日</el-col>
                  </el-row>
                </el-row>
                <el-row class="order-review-bd" v-else-if="activeName == 'second'">
                  <el-row class="order-review-list">
                    <el-col :span="10" class="ft16 color3">每月薪资：</el-col>
                    <el-col :span="12" class="ft16 color2">{{curOrder.workPay||0}}元</el-col>
                  </el-row>
                  <el-row class="order-review-list">
                    <el-col :span="10" class="ft16 color3">工资结算：</el-col>
                    <el-col :span="12" class="ft16 color2">{{curOrder.relieveSalaryWorker||0}}元</el-col>
                  </el-row>
                  <el-row class="order-review-total hd fw6 flexbox" v-if="curOrder.relieveSalaryWorker>0">
                    <el-col :span="16" class="flexauto">工资结算：<span class="f13">{{curOrder.relieveSalaryWorker||0}}元</span></el-col>
                    <el-col :span="8"><el-button class="review-btn" @click="payMoney">支付工资</el-button></el-col>
                  </el-row>
                </el-row>
              </el-row>
          </el-row>
        </el-row>
      </div>
    </div>
</template>

<script>
import { agreeBack,checkOut } from '@/api/api'
import { mapGetters } from 'vuex'
import { contractUrl } from '@/utils/config.js'
export default {
name:'',
  data () {
    return {
      contractImg:require('@/assets/images/contract.png'),
      persImg:require('@/assets/images/head_man.png'),
      refundImg:require('@/assets/images/refund-phone.png'),
      contractUrl
    };
  },
  props:{
    activeName:{
      type:String,
      default:""
    },
    curOrder:{
      type:Object,
      default:{}
    }
  },
  computed:{
    ...mapGetters(['getUsers'])
  },
  methods: {
    handleAgree(){//同意退款操作
      this.$confirm('您确定要进行退款操作吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            app: '0',
            device: '0',
            id: this.curOrder.oid,
            token: this.getUsers.token
          }
          agreeBack(params).then(res=>{
            if(res.code == 200){
              this.$message.success({ message: '退款成功'})
              this.$emit('updateList')
            }else{
              this.$message.error({message: res.msg})
            }
          })
        }).catch((error) => {
          return false
      });
    },
    payMoney(){//工资结算操作
      this.$confirm('您确定要进行工资结算操作吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            app: '0',
            device: '0',
            id: this.curOrder.oid,
            token: this.getUsers.token
          }
          checkOut(params).then(res=>{
            if(res.code == 200){
              this.$message.success({ message: '结算成功'})
              this.$emit('updateList')
            }else{
              this.$message.error({message: res.msg})
            }
          })
        }).catch((error) => {
          return false
      });
    }
  }
}

</script>
<style lang='scss' scoped>
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
              width: 12px;
              margin-right: 5px;
            }
            .p1{
              margin-bottom: 5px;
              padding-right: 10px;
              overflow: hidden;
              span{
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
            }
        }
        }
    }
</style>
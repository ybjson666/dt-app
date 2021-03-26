<template>
  <div class="tin-right on">
      <div class="testList">
        <el-row class="theory">
          <el-row class="theoryOrderlist">
            <div class="zwsj" v-if="JSON.stringify(getOrder) == '{}' || getOrder == null">
              <img :src="zwsjImg" alt=""><br />
              暂无反馈信息~
            </div>
            <template v-else>
            <el-row class="orderNum">订单号：{{getOrder.orderDemandCommon.id}}</el-row>
            <el-row class="order-server">
              <el-col>服务项目：{{getOrder.orderDemandCommon.typeName+getOrder.orderDemandCommon.startLevel}}</el-col>
              <el-col>服务时间：{{getOrder.orderDemandCommon.startTime}}——{{getOrder.orderDemandCommon.endTime != null?getOrder.orderDemandCommon.endTime:'长期'}}</el-col>
              <el-col>合同编号：{{getOrder.orderDemandCommon.agreementId}}</el-col>
            </el-row>
            <el-row class="order-contract">
              <el-row class="orderctlist flexbox flex-direction-row align-items-center">
                <img :src="contractImg" alt="">
                <el-col class="flexauto">
                  <p class="ft16 fw4 color1">合同书：{{getOrder.orderDemandCommon.agreementId}}</p>
                  <p class="ft16 fw4">
                    <a target="blank" :href="`${contractUrl}/order/agreement/h5?gid=${getOrder.orderDemandCommon.agreementId}&type=3`" class="ft16 fw4 cf09">查看</a>
                    <!-- <a href="javascript:void(0);" class="ft16 fw4 cf09">下载</a> -->
                  </p>
                </el-col>
              </el-row>
              <el-row class="orderctlist flexbox flex-direction-row align-items-center">
                <img :src="contractImg" alt="">
                <el-col class="flexauto">
                  <p class="ft16 fw4 color1">出户单</p>
                  <p class="ft16 fw4">
                    <a target="blank" :href="`${contractUrl}/order/agreement/h5?gid=${getOrder.orderDemandCommon.agreementId}&type=1`" class="ft16 fw4 cf09">查看</a>
                    <!-- <a href="javascript:void(0);" class="ft16 fw4 cf09">下载</a> -->
                  </p>
                </el-col>
              </el-row>
            </el-row>
            <el-row class="orderHlist">
              <el-row class="orderHlist-hd flexbox align-items-center">
                <img :src="preSrc+getOrder.orderDemandCommon.headimg" alt="" class="odimg" v-if="getOrder.orderDemandCommon.headimg">
                <img :src="persImg" alt="" class="odimg" v-else>
                <el-row class="orderHlist-p flexauto">
                  <p class="ft16 fw6 color1">{{getOrder.orderDemandCommon.name||"--"}}</p>
                  <p class="ft14 fw4 color1">ID:{{getOrder.orderDemandCommon.id||"--"}}</p>
                </el-row>
                <el-row class="orderHlist-msg fen-btn" >
                  <img :src="fenImg1" alt="" class="fenimg1" @click="talks({uid:getOrder.orderDemandCommon.id,name:getOrder.orderDemandCommon.name})">
                  <!-- <img :src="fenImg2" alt="" class="fenimg2"> -->
                </el-row>
              </el-row>
              <el-row class="orderHlist-hd flexbox align-items-center">
                <img :src="preSrc+getOrder.orderDemandCommon.workerHeadImg" alt="" class="odimg" v-if="getOrder.orderDemandCommon.workerHeadImg">
                <img :src="persImg" alt="" class="odimg" v-else>
                <el-row class="orderHlist-p flexauto">
                  <p class="ft16 fw6 color1">{{getOrder.orderDemandCommon.workerName||"--"}}</p>
                  <p class="ft14 fw4 color1">ID:{{getOrder.orderDemandCommon.wid||"--"}}</p>
                </el-row>
                <el-row class="orderHlist-msg fen-btn" >
                  <img :src="fenImg1" alt="" class="fenimg1" @click="talks({uid:getOrder.orderDemandCommon.wid,name:getOrder.orderDemandCommon.workerName})">
                </el-row>
              </el-row>
              <el-row class="orderHlist-hd flexbox align-items-center">
                <img :src="preSrc+getOrder.orderDemandCommon.doHeadImg" alt="" class="odimg" v-if="getOrder.orderDemandCommon.doHeadImg">
                <img :src="persImg" alt="" class="odimg" v-else>
                <el-row class="orderHlist-p flexauto">
                  <p class="ft16 fw6 color1">{{getOrder.orderDemandCommon.documentName||"--"}}</p>
                  <p class="ft14 fw4 color1">ID:{{getOrder.orderDemandCommon.documentary||"--"}}</p>
                </el-row>
              </el-row>
            </el-row>
            </template>
          </el-row>
        </el-row>
      </div>
      <!-- 聊天 -->
    <Chat ref="chat" :curUser="curUser"/>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { zwsjImg,persImg,contractImg,fenImg1,fenImg2 } from '@/utils/imgConfig.js'
import imgurl from '@/utils/common.js'
import Chat from '@/components/Chat.vue'
import { contractUrl } from '@/utils/config.js'
export default {
name:'',
  data () {
    return {
      zwsjImg,
      persImg,
      contractImg,
      fenImg1,
      fenImg2,
      preSrc:imgurl,
      curUser:{},
      contractUrl
    };
  },
  computed:{
    ...mapGetters([
          'getOrder'
      ]),
  },
  components:{
    Chat
  },
  methods: {
    talks(item){//聊天
      this.curUser.uid=item.uid
      this.curUser.name=item.name
      this.$refs.chat.showDialog()
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
    overflow-y: scroll;
    // margin-bottom: 0.2rem;
    .orderNum{
      font-size: 18px;
      font-weight: 600;
      color: #202D40;
    }
    .order-server{
      padding: 12px 10px;
      border-bottom: 1px solid #eee;
      .el-col{
        font-size: 16px;
        font-weight: 400;
        color: #202D40;
        margin-bottom: 5px;
      }
    }
    .order-contract{
      padding: 12px 10px 0;
      border-bottom: 1px solid #eee;
      .orderctlist{
        margin-bottom: 20px;
        img{
          width: 32px;
          height: 40px;
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
}
</style>
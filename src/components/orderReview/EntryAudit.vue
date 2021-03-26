<template>
  <div class="pages-container">
    <div class="pages-wraps">
      <div class="page-table-content">
        <div class="talent-all clearfix">
          <span class="sp1" :class="getEntryFlag?'on':''" @click="allClick(true)">待处理</span>
          <span class="sp2" :class="getEntryFlag?'':'on'" @click="allClick(false)">历史审核</span>
        </div>
        <div class="tablent-content">
          <el-table :data="tableDataList" highlight-current-row  @row-click="cellClick" border style="width: 100%">
            <el-table-column prop="date" label="时间" width="">
              <template slot-scope="scope">
                <span v-if="scope.row.payTime">{{ (scope.row.payTime).substr(0,10) }}<br />{{ (scope.row.payTime).substr(11,8) }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="雇主" width="100">
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="bottom">
                  <div class="emname color1">电话：{{scope.row.phone}}</div>
                  <span class="emname2 cf09" slot="reference">
                    <img :src="scope.row.cheadImg |imgFormat" v-if="scope.row.cheadImg"/>
                    <img :src="persImg" alt="" v-else/>
                  </span>
                </el-popover>
                <span class="emname2 cf09" style="cursor:pointer;">
                  {{scope.row.cname}}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="demand" label="服务项目" width="">
              <template slot-scope="scope">
                <span class="color1 fw6">{{scope.row.typeName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="personal" label="雇员" width="">
              <template slot-scope="scope">
                <span class="pers">
                  <img :src="scope.row.headimg |imgFormat" alt="" v-if="scope.row.headimg" />
                  <img :src="persImg" alt="" v-else />
                  {{scope.row.wname}}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="follow" label="跟进人" width="120">
              <template slot-scope="scope">
                <span class="color1">{{scope.row.ename}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="payment" label="付款方式" width="170">
              <template slot-scope="scope">
                <span v-if="scope.row.channel == 1">微信支付</span>
                <span v-if="scope.row.channel == 2">支付宝支付</span>
                <span v-if="scope.row.channel == 3">网银支付</span>
                <span v-if="scope.row.channel == 4">线下支付</span>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="付款金额" width="">
              <template slot-scope="scope">
                <span class="f13 fw6">¥{{scope.row.payMoney}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="120">
              <template slot-scope="scope">
                <el-button @click="editClick(scope.row)" size="small" class="tg-btn" v-if="scope.row.serviceStatus == 3">通过</el-button>
                <el-button size="small" class="tg-btn on"  v-else>通过</el-button>
              </template>
            </el-table-column>
          </el-table>
          <Page :currentPage="pageNo" :pageSize="pageSize" :total="total" @changePage="changePage"></Page>
        </div>
      </div>
      <div class="page-detail-block">
        <RightInfo :curOrder="curOrder" activeName="first"/>
      </div>
    </div>
  </div>
</template>

<script>
import { getAudit,} from '@/api/api'
import { mapGetters } from 'vuex'
import Page from '@/components/Page.vue'
import RightInfo from "./RightInfo.vue"
  export default {
    name: 'entryAudit',
    components: {
      Page,
      RightInfo
    },
    data() {
      return {
        persImg: require('@/assets/images/head_man.png'),
        pageNo: 1,
        pageSize: 10,
        total: 0,
        tableDataList:[],
        curOrder:{}
      }
    },
    created() {
      this.reqGetDatas()
    },
    computed:{
      ...mapGetters([
          'getUsers',
          'getSysMetaData',
          'getEntryFlag'
      ])
    },
    methods: {
      async reqGetDatas(){//获取表格数据
        const{pageNo,pageSize}=this
        let params = {
          "app": 0,
          "device": 0,
          "oid": "",
          pageNo,
          pageSize,
          "serviceStatus": this.getEntryFlag?3:4,
          "token": this.getUsers.token
        }

        const result =await getAudit(params)
        if(result.code===200){
          this.tableDataList=result.data.records
          this.total=result.data.total
          if(result.data.records.length){
            this.curOrder=result.data.records[0]
          }else{
            this.curOrder={}
          }
        }
      },
      cellClick(row,event,column) {// table整行
        this.curOrder=row
      },
      changePage(val) {//分页
        this.pageNo = val
        this.reqGetDatas()
      },
      editClick(row) {// 通过
        // console.log(row);
      },
      allClick(flag) {
        this.$store.commit('updateEntryFlag', flag)
        this.reqGetDatas()
      },
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
  cursor: text;
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
// 订单处理
.pers{
  img{
    width: 26px;
    height:26px;
    border-radius: 4px;
  }
}
.ctract{
  img{
    width: 32px;
    height: 40px;
  }
}
.emname{
  padding: 10px;
  text-align: center;
}
.emname2{
  img{
    width: 26px;
    height: 26px;
    // margin-top: -5px;
    border-radius: 4px;
  }
}
.demand-detail{
  width:100%;
  padding:10px;
  h3{
    font-size: 16px;
    color: #202D40;
    font-weight: 600;
  }
  p{
    font-size: 14px;
    color: #606D80;
    font-weight: 400;
    margin-bottom: 2px;
  }
}
.dislist{
  li{
    line-height: 54px;
    padding:0 10px;
    cursor: pointer;
    font-size: 18px;
    color: #333;
    font-weight: 400;
    img{
      width: 36px;
      height: 36px;
      -moz-border-radius: 50%;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
  li.on{
    background: rgba(0,102,255,.04);
  }
}
.pays{
  padding-left: 30px;
}
</style>

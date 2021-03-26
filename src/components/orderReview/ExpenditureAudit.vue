<template>
  <div class="pages-container">
    <div class="pages-wraps">
      <div class="page-table-content">
        <div class="talent-all clearfix">
          <span class="sp1" :class="getEntryFlag?'on':''" @click="allClick(true)">待处理</span>
          <span class="sp2" :class="getEntryFlag?'':'on'" @click="allClick(false)">历史审核</span>
        </div>
        <div class="tablent-content">
          <el-table :data="tableDataList" highlight-current-row @row-click="cellClick" border style="width: 100%">
            <el-table-column prop="date" label="时间" width="">
              <template slot-scope="scope">
                <span>{{ (scope.row.createTime).substr(0,10) }}<br />{{ (scope.row.createTime).substr(11,8) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="雇主" width="120">
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="bottom">
                  <div class="emname color1">电话：{{scope.row.phone}}</div>
                  <span class="emname2 cf09" slot="reference">
                    <img :src="scope.row.cheadImg |imgFormat" alt="" v-if="scope.row.cheadImg">
                    <img :src="persImg" alt="" v-else>
                  </span>
                </el-popover>
                <span class="emname2 cf09" style="cursor:pointer;">
                  {{scope.row.cname}}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="demand" label="服务项目" width="160">
              <template slot-scope="scope">
                <span class="color1 fw6">{{scope.row.typeName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="personal" label="雇员" width="120">
              <template slot-scope="scope">
                <span class="pers">
                  <img :src="scope.row.headimg |imgFormat" alt="" v-if="scope.row.headimg">
                  <img :src="persImg" alt="" v-else>
                  {{scope.row.wname}}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="follow" label="跟进人" width="100">
              <template slot-scope="scope">
                <span class="color1">{{scope.row.ename}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="constatus" label="合同状态" width="100">
              <template slot-scope="scope">
                <span class="f13" v-if="scope.row.reasonStatus == 1">无效</span>
                <span class="f13" v-else-if="scope.row.reasonStatus == 2">丢单</span>
                <span class="f13" v-else-if="scope.row.reasonStatus == 3">已终止</span>
                <span class="f13" v-else-if="scope.row.reasonStatus == 4">已解约</span>
                <span v-else class="f13">--</span>
              </template>
            </el-table-column>
            <el-table-column prop="reason" label="理由" width="140">
              <template slot-scope="scope">
                <span class="color1">{{scope.row.reason||'--'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="salary" label="退费金额" width="" >
              <template slot-scope="scope">
                <p class="pays tagnlf color3">
                  雇主退费：
                  <span :class="scope.row.relieveRefundCustomer > 0?'f13':'color3'">{{scope.row.relieveRefundCustomer||0}}元</span>
                </p>
                <p class="pays tagnlf color3">
                  雇员结算：
                  <span :class="scope.row.relieveSalaryWorker > 0?'f13':'color3'">{{scope.row.relieveSalaryWorker||0}}元</span>
                </p>
              </template>
            </el-table-column>
          </el-table>
          <Page :currentPage="currentPage" :pageSize="pageSize" :total="total" @changePage="changePage"></Page>
        </div>
      </div>
      <div class="page-detail-block">
        <RightInfo activeName="second" :curOrder="curOrder" @updateList="reqGetDatas"/>
      </div>
    </div>
  </div>
</template>

<script>
import { getSpend } from '@/api/api'
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
        currentPage: 1,
        pageSize: 10,
        total: 0,
        tableDataList:[],
        curOrder: {}
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
        let params = {
          app: 0,
          device: 0,
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          token: this.getUsers.token,
          type: this.getEntryFlag?1:2
        }
        const result=await getSpend(params)
        if(result.code===200){
          this.tableDataList=result.data.records
          this.total = result.data.total
          if(result.data.records.length){
            this.curOrder=result.data.records[0]
          }else{
            this.curOrder={}
          }
        }else{
          this.$message.error(result.msg)
        }
      },
      cellClick(row,event,column) { // table整行
        this.curOrder=row
      },
      changePage(val) {//分页
        this.currentPage = val
        this.reqGetDatas()
      },
      allClick(flag) { // allClick
        this.$store.commit('updateEntryFlag', flag)
        this.reqGetDatas()
      },
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

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
.pays{
  padding-left: 30px;
}
</style>

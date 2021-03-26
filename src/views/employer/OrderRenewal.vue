<template>
  <div class="tinntay-cont talent-eva">
    <div class="talentAudit r410" style="padding-top:0;">
      <el-row class="h101">
          <div class="zscore1" style="padding-right:0;">
          <div class="tablent-md clearfix">
            <div class="tablent-search bd">
              <el-input placeholder="请输入订单号/手机号/姓名/关键字搜索" v-model="taSearchText">
              </el-input>
              <a href="javascript:void(0);" class="talent-btn" @click="search()"><img :src="sUrl" alt=""></a>
            </div>
          </div>
          <div class="tablent-content">
            <el-table :data="tableDataList" @row-click="cellClick" highlight-current-row border style="width: 100%">
              <el-table-column prop="date" label="发布时间" width="">
                <template slot-scope="scope">
                  <span>{{ (scope.row.date).substr(0,10) }}<br />{{ (scope.row.date).substr(11,8) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="雇主" width="">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="bottom">
                    <div class="emname color1">雇主：{{scope.row.name}}</div>
                    <span class="emname2 cf09" slot="reference">
                      <img :src="imgurl+scope.row.orderDemandCommon.headImg" v-if="scope.row.orderDemandCommon.headImg">
                      <img :src="persImg" alt="" v-else>
                    </span>
                  </el-popover>
                  <span class="emname2 cf09" style="cursor:pointer;" @click="editClick(scope.row)">
                    {{scope.row.name}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="demand" label="需要服务" width="">
                <template slot-scope="scope">
                  <el-popover width="200" trigger="hover" placement="right-start">
                    <!-- child doula housework safety teacher -->
                    <div class="demand-detail" v-if="scope.row.child && scope.row.child !== null">
                      <h3>客户情况</h3>
                      <p>宝宝年龄：{{parseInt((Date.parse(new Date()) - Date.parse(scope.row.child.childBirthday))/(24*3600*1000))}}天</p>
                      <p>饮食情况：{{scope.row.child.eatStatus.length > 0?scope.row.child.eatStatus+'':'--'}}</p>
                      <p>睡眠情况：{{scope.row.child.sleepStatus.length > 0?scope.row.child.sleepStatus+'':'--'}}</p>
                      <p>动作情况：{{scope.row.child.actionStatus.length > 0?scope.row.child.actionStatus+'':'--'}}</p>
                      <h3>客户要求</h3>
                      <p>
                        {{scope.row.orderDemandCommon.startWorkYear !==null || scope.row.orderDemandCommon.endWorkYear?scope.row.orderDemandCommon.startWorkYear+ '～' +scope.row.orderDemandCommon.endWorkYear+'年经验｜':''}}
                        <template v-if="scope.row.orderDemandCommon.startAge !==null || scope.row.orderDemandCommon.endAge !==null">
                          <template v-if="scope.row.orderDemandCommon.startAge == 0 || scope.row.orderDemandCommon.endAge == 0"></template>
                          <template v-else>{{scope.row.orderDemandCommon.startAge + '～' +scope.row.orderDemandCommon.endAge+ '岁｜'}}</template>
                        </template>
                        <template v-else></template>
                        {{scope.row.orderDemandCommon.startStature !==null || scope.row.orderDemandCommon.endStature !==null?scope.row.orderDemandCommon.startStature + '～' +scope.row.orderDemandCommon.endStature+ 'cm｜':''}}
                      </p>
                      <p>{{scope.row.orderDemandCommon.educationName && scope.row.orderDemandCommon.educationName.length > 0?scope.row.orderDemandCommon.educationName+''+'｜':''}}{{scope.row.orderDemandCommon.nativePlaceName !==null?scope.row.orderDemandCommon.nativePlaceName+''+'不考虑｜':''}}</p>
                      <p>{{scope.row.orderDemandCommon.chineseZodiacName !== null?scope.row.orderDemandCommon.chineseZodiacName+''+'不考虑':''}}</p>
                    </div>
                    <div class="demand-detail" v-if="scope.row.doula && scope.row.doula !== null">
                      <h3>客户情况</h3>
                      <p>生产类型：{{scope.row.doula.eatStatus !== null?scope.row.doula.eatStatus+'':'--'}}</p>
                      <p>喂养：{{scope.row.doula.pregnantStatus !== null?scope.row.doula.pregnantStatus+'':'--'}}</p>
                      <h3>客户要求</h3>
                      <p>
                        {{scope.row.orderDemandCommon.startWorkYear !==null || scope.row.orderDemandCommon.endWorkYear?scope.row.orderDemandCommon.startWorkYear+ '～' +scope.row.orderDemandCommon.endWorkYear+'年经验｜':''}}
                        <template v-if="scope.row.orderDemandCommon.startAge !==null || scope.row.orderDemandCommon.endAge !==null">
                          <template v-if="scope.row.orderDemandCommon.startAge == 0 || scope.row.orderDemandCommon.endAge == 0"></template>
                          <template v-else>{{scope.row.orderDemandCommon.startAge + '～' +scope.row.orderDemandCommon.endAge+ '岁｜'}}</template>
                        </template>
                        <template v-else></template>
                        {{scope.row.orderDemandCommon.startStature !==null || scope.row.orderDemandCommon.endStature !==null?scope.row.orderDemandCommon.startStature + '～' +scope.row.orderDemandCommon.endStature+ 'cm｜':''}}
                      </p>
                      <p>{{scope.row.orderDemandCommon.educationName && scope.row.orderDemandCommon.educationName.length > 0?scope.row.orderDemandCommon.educationName+''+'｜':''}}{{scope.row.orderDemandCommon.nativePlaceName !==null?scope.row.orderDemandCommon.nativePlaceName+''+'不考虑｜':''}}</p>
                      <p>{{scope.row.orderDemandCommon.chineseZodiacName !== null?scope.row.orderDemandCommon.chineseZodiacName+''+'不考虑':''}}</p>
                    </div>
                    <div class="demand-detail" v-if="scope.row.housework && scope.row.housework !== null">
                      <h3>客户情况</h3>
                      <p>家庭人数：{{scope.row.housework.familySize !== null?scope.row.housework.familySize+'':'--'}}</p>
                      <p>房屋面积：{{scope.row.housework.floorSpace !== null?scope.row.housework.floorSpace+'':''}}</p>
                      <p>口味要求：{{scope.row.housework.taste.length > 0?scope.row.housework.taste+'':''}}</p>
                      <h3>客户要求</h3>
                      <p>
                        {{scope.row.orderDemandCommon.startWorkYear !==null || scope.row.orderDemandCommon.endWorkYear?scope.row.orderDemandCommon.startWorkYear+ '～' +scope.row.orderDemandCommon.endWorkYear+'年经验｜':''}}
                        <template v-if="scope.row.orderDemandCommon.startAge !==null || scope.row.orderDemandCommon.endAge !==null">
                          <template v-if="scope.row.orderDemandCommon.startAge == 0 || scope.row.orderDemandCommon.endAge == 0"></template>
                          <template v-else>{{scope.row.orderDemandCommon.startAge + '～' +scope.row.orderDemandCommon.endAge+ '岁｜'}}</template>
                        </template>
                        <template v-else></template>
                        {{scope.row.orderDemandCommon.startStature !==null || scope.row.orderDemandCommon.endStature !==null?scope.row.orderDemandCommon.startStature + '～' +scope.row.orderDemandCommon.endStature+ 'cm｜':''}}
                      </p>
                      <p>{{scope.row.orderDemandCommon.educationName && scope.row.orderDemandCommon.educationName.length > 0?scope.row.orderDemandCommon.educationName+''+'｜':''}}{{scope.row.orderDemandCommon.nativePlaceName !==null?scope.row.orderDemandCommon.nativePlaceName+''+'不考虑｜':''}}</p>
                      <p>{{scope.row.orderDemandCommon.chineseZodiacName !== null?scope.row.orderDemandCommon.chineseZodiacName+''+'不考虑':''}}</p>
                    </div>
                    <div class="demand-detail" v-if="scope.row.safety && scope.row.safety !== null">
                      <h3>客户情况</h3>
                      <p>雇主年龄：{{scope.row.safety.age !== null?scope.row.safety.age:'--'}}</p>
                      <p>雇主国籍：{{scope.row.safety.country !== null?scope.row.safety.country:''}}</p>
                      <p>雇主性别：{{scope.row.safety.sex == 0?'女':'男'}}</p>
                      <h3>客户要求</h3>
                      <p>
                        {{scope.row.orderDemandCommon.startWorkYear !==null || scope.row.orderDemandCommon.endWorkYear?scope.row.orderDemandCommon.startWorkYear+ '～' +scope.row.orderDemandCommon.endWorkYear+'年经验｜':''}}
                        <template v-if="scope.row.orderDemandCommon.startAge !==null || scope.row.orderDemandCommon.endAge !==null">
                          <template v-if="scope.row.orderDemandCommon.startAge == 0 || scope.row.orderDemandCommon.endAge == 0"></template>
                          <template v-else>{{scope.row.orderDemandCommon.startAge + '～' +scope.row.orderDemandCommon.endAge+ '岁｜'}}</template>
                        </template>
                        <template v-else></template>
                        {{scope.row.orderDemandCommon.startStature !==null || scope.row.orderDemandCommon.endStature !==null?scope.row.orderDemandCommon.startStature + '～' +scope.row.orderDemandCommon.endStature+ 'cm｜':''}}
                      </p>
                      <p>{{scope.row.orderDemandCommon.educationName && scope.row.orderDemandCommon.educationName.length > 0?scope.row.orderDemandCommon.educationName+''+'｜':''}}{{scope.row.orderDemandCommon.nativePlaceName !==null?scope.row.orderDemandCommon.nativePlaceName+''+'不考虑｜':''}}</p>
                      <p>{{scope.row.orderDemandCommon.chineseZodiacName !== null?scope.row.orderDemandCommon.chineseZodiacName+''+'不考虑':''}}</p>
                    </div>
                    <div class="demand-detail" v-if="scope.row.teacher && scope.row.teacher !== null">
                      <h3>客户情况</h3>
                      <p>资格证书：{{scope.row.teacher.certificate.length > 0?scope.row.teacher.certificate+'':'--'}}</p>
                      <p>孩子年龄：{{scope.row.teacher.childAge !== null?scope.row.teacher.childAge:''}}</p>
                      <p>兴趣爱好：{{scope.row.teacher.hobby.length > 0?scope.row.teacher.hobby+'':''}}</p>
                      <p>综合素养：{{scope.row.teacher.school !== null?scope.row.teacher.school:'--'}}</p>
                      <h3>客户要求</h3>
                      <p>
                        {{scope.row.orderDemandCommon.startWorkYear !==null || scope.row.orderDemandCommon.endWorkYear?scope.row.orderDemandCommon.startWorkYear+ '～' +scope.row.orderDemandCommon.endWorkYear+'年经验｜':''}}
                        <template v-if="scope.row.orderDemandCommon.startAge !==null || scope.row.orderDemandCommon.endAge !==null">
                          <template v-if="scope.row.orderDemandCommon.startAge == 0 || scope.row.orderDemandCommon.endAge == 0"></template>
                          <template v-else>{{scope.row.orderDemandCommon.startAge + '～' +scope.row.orderDemandCommon.endAge+ '岁｜'}}</template>
                        </template>
                        <template v-else></template>
                        {{scope.row.orderDemandCommon.startStature !==null || scope.row.orderDemandCommon.endStature !==null?scope.row.orderDemandCommon.startStature + '～' +scope.row.orderDemandCommon.endStature+ 'cm｜':''}}
                      </p>
                      <p>{{scope.row.orderDemandCommon.educationName && scope.row.orderDemandCommon.educationName.length > 0?scope.row.orderDemandCommon.educationName+''+'｜':''}}{{scope.row.orderDemandCommon.nativePlaceName !==null?scope.row.orderDemandCommon.nativePlaceName+''+'不考虑｜':''}}</p>
                      <p>{{scope.row.orderDemandCommon.chineseZodiacName !== null?scope.row.orderDemandCommon.chineseZodiacName+''+'不考虑':''}}</p>
                    </div>
                    <div slot="reference">
                      <span class="color1">{{scope.row.demand}}</span>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="personal" label="服务人员" width="">
                <template slot-scope="scope">
                <span class="pers" v-if="scope.row.orderDemandCommon.workerName">
                  <img :src="scope.row.orderDemandCommon.workerHeadImg | imgFormat" alt=""><br />
                  {{scope.row.orderDemandCommon.workerName}}
                </span>
                <span class="pers" v-else> -- </span>
              </template>
              </el-table-column>
              <el-table-column prop="contract" label="合同" width="">
                <template slot-scope="scope">
                  <span class="ctract" v-if="scope.row.contract !== null">
                    <img :src="contractImg" alt=""><br />
                    合同书
                  </span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column prop="serviceTime" label="服务时间" width="160">
                <template slot-scope="scope">
                  <p class="pays tagnlf"><i class="gn1"></i>{{scope.row.orderDemandCommon.startTime}}</p>
                  <p class="pays tagnlf"><i class="gn2"></i>{{!scope.row.orderDemandCommon.endTime ?'长期':scope.row.orderDemandCommon.endTime}}</p>
                </template>
              </el-table-column>
              <el-table-column prop="serviceCharge" label="服务费" width="">
                <template slot-scope="scope">
                  <span class="color1">甲方：</span>
                  <span class="orange1" v-if="scope.row.serviceCharge == 0">待续签</span>
                  <span class="orange1" v-else-if="scope.row.serviceCharge == 1">待支付</span>
                </template>
              </el-table-column>
              <el-table-column prop="followStatus" label="跟进状态" width="">
                <template slot-scope="scope">
                  <span class="theme2" v-if="scope.row.orderDemandCommon.serviceStatus == 4">服务中</span>
                  <span class="theme2" v-else-if="scope.row.orderDemandCommon.serviceStatus == 5">解约待审核</span>
                  <span class="theme2" v-else-if="scope.row.orderDemandCommon.serviceStatus == 6">待续签</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right" width="120">
                <template slot-scope="scope">
                  <el-button @click="msgClick(scope.row)" size="small" class="fen-btn">
                    <img :src="fenImg1" alt="" class="fenimg1">
                    <img :src="fenImg2" alt="" class="fenimg2">
                  </el-button>
                  <el-button @click="editClick(scope.row)" size="small" class="fen-btn">
                    <img :src="editImg1" alt="" class="fenimg1">
                    <img :src="editImg2" alt="" class="fenimg2">
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <Page :currentPage="currentPage" :pageSize="pageSize" :total="total" @changePage="changePage" v-if="this.tableDataList.length > 0"></Page>
          </div>
          </div>
      </el-row>
    </div>
    <OrderProcessDetail ref="orderDetail" :row="currentRow" @updateList="getDemandList"></OrderProcessDetail>
    <!--聊天-->
    <Chat ref="chat" :curUser="targetUser"/>
  </div>
</template>

<script>
import { demandList } from '@/api/api'
import OrderProcessDetail from '@/views/employer/OrderProcessDetail.vue'
import Page from '@/components/Page.vue'
import { mapGetters } from 'vuex'
import Chat from '@/components/Chat.vue'
import { fenImg1,fenImg2,editImg1,editImg2,sUrl,
emurl,contractImg,zwsjImg,persImg } from '@/utils/imgConfig.js'
import imgurl from '@/utils/common.js'
  export default {
    name: 'orderRenewal',
    components: {
      OrderProcessDetail,
      Page,
      Chat
    },
    data() {
      return {
        imgurl,
        zwsjImg,
        fenImg1,
        fenImg2,
        editImg1,
        editImg2,
        emurl,
        persImg,
        sUrl,
        contractImg,
        taSearchText: '',
        currentPage: 1,
        pageSize: 10,
        total: 0,
        tableDataList:[],
        tabList: [],
        currentRow: [],
        targetUser:{}
      }
    },
    created() {
      this.getDemandList()
    },
    computed:{
      ...mapGetters([
          'getUsers',
          'getSysMetaData'
      ])
    },
    methods: {
      getDemandList(){// 待续签列表
        let params = {
          app: 3,
          device: 5,
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          serviceId: '',
          token: this.getUsers.token,
          type: 6,
          searchParameters:this.taSearchText 
        }
        demandList(params).then(res =>{
          if(res.code == 200) {
            this.tableData = res.data.records
            this.tableDataList = res.data.records
            this.total = res.data.total
            this.tableDataList.forEach(item =>{
              item.date = item.orderDemandCommon.createTime
              item.name = item.orderDemandCommon.name
              item.demand = item.orderDemandCommon.typeName + 'T'+ item.orderDemandCommon.startLevel + '-T' + item.orderDemandCommon.endLevel
              item.contract = item.orderDemandCommon.agreementId
              item.followStatus = item.orderDemandCommon.serviceStatus
              item.sex = item.orderDemandCommon.sex
              item.orderId =  item.orderDemandCommon.id
              item.orderDemandCommon.remark=item.orderDemandCommon.remark?item.orderDemandCommon.remark:[]
            })
          }
        })
      },
      search() { // 搜索
       this.getDemandList();
      },
      cellClick(row,event,column) { // table整行
        this.currentRow = row
        sessionStorage.setItem('orderDetail', JSON.stringify(row))
        this.$store.commit('updateOrder', row)
      },
      changePage(val) {//分页
        this.currentPage = val
        this.getDemandList()
      },
      msgClick(row) {// 聊天
        let user={}
        user.uid=row.orderDemandCommon.id.toString();
        user.name=row.orderDemandCommon.name;
        this.targetUser=user;
        this.$refs.chat.showDialog()
      },
      editClick(row) {
        this.$refs.orderDetail.orderDrawer()
      }
    }
  }
</script>
<style scoped lang="scss">
  @import '@/components/orderProcess/common.scss'
</style>

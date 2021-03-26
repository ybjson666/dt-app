<template>
  <div class="pages-container">
    <div class="pages-wraps">
      <div class="page-table-content all-screen">
        <div class="talent-all clearfix">
          <span class="sp1" :class="getOrderFlag?'on':''" @click="handleClick(true)">未发布</span>
          <span class="sp2" :class="getOrderFlag?'':'on'" @click="handleClick(false)">处理中</span>
        </div>
        <div class="tablent-md clearfix">
          <div class="tablent-search bd">
            <el-input placeholder="请输入订单号/手机号/姓名 搜索" v-model="taSearchText">
            </el-input>
            <a href="javascript:void(0);" class="talent-btn" @click="search"><img :src="sUrl" alt=""></a>
          </div>
          <div class="tablent-date fr flexbox align-items-center">
          <el-select class="bd" v-model="serviceId" clearable filterable placeholder="请选择" :class="bdcolor?'bdcolor':''" @visible-change="changeBorder" @change="changeSelect">
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
          <el-table :data="tableDataList" highlight-current-row  border style="width: 100%"  @row-click="cellClick">
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
                  <!-- {{scope.row.name.substr(0,1)}}{{scope.row.sex == 0?'女士':'先生'}} -->
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
            <el-table-column prop="demandTime" label="需求时间" width="">
              <template slot-scope="scope">
                <span>{{ (scope.row.demandTime).substr(0,10) }}<br />{{ (scope.row.demandTime).substr(11,8) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="服务地址" width="">
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="bottom">
                  <div class="emname color1">{{scope.row.address}}</div>
                  <span class="color1 ellips" style="display:block;" slot="reference">{{scope.row.address}}</span>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="salary" label="薪资范围" width="">
              <template slot-scope="scope">
                <span>{{scope.row.salary}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="personal" label="服务人员" width="">
              <template slot-scope="scope">
                <span class="persImg" v-if="scope.row.orderDemandCommon.workerName">
                  <img :src="scope.row.orderDemandCommon.workerHeadImg | imgFormat" alt=""><br />
                  {{scope.row.orderDemandCommon.workerName}}
                </span>
                <span class="persImg" v-else> -- </span>
              </template>
            </el-table-column>
            <el-table-column prop="contract" label="合同" width="">
              <template slot-scope="scope">
                <a class="ctract" v-if="scope.row.contract" target="blank" 
                :href="`${contractUrl}/order/agreement/h5?gid=${scope.row.contract}&type=3`">
                  <img :src="contractImg" alt="">
                  <br />
                  <span>合同书</span>
                </a>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="follow" label="跟进人" width="">
              <template slot-scope="scope">
                <span class="color1">{{scope.row.orderDemandCommon.documentName||'--'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="followStatus" label="跟进状态" width="">
              <template slot-scope="scope">
                <span class="orange1" v-if="scope.row.followStatus == 1">未发布</span>
                <span class="green1" v-if="scope.row.followStatus == 2">待处理</span>
                <span class="red1" v-if="scope.row.followStatus == 3">财务审核</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="180">
              <template slot-scope="scope">
                <el-button @click="msgClick(scope.row)" size="small" class="fen-btn">
                  <img :src="fenImg1" alt="" class="fenimg1">
                  <img :src="fenImg2" alt="" class="fenimg2">
                </el-button>
                <el-button @click="editClick(scope.row)" size="small" class="fen-btn">
                  <img :src="editImg1" alt="" class="fenimg1">
                  <img :src="editImg2" alt="" class="fenimg2">
                </el-button>
                <el-popover popper-class="dis" placement="right" trigger="click" @show="openDisPop">
                  <div class="dislist">
                    <ul>
                      <li :class="cur == index?'on':''" v-for="(item,index) in disList" :key="index" @click="disClick(index,item)">
                        <img :src="item.headimg" alt="" v-if="item.headimg">
                        <img :src="persImg" alt="" v-else>
                        <span>{{item.name}}</span>
                      </li>
                    </ul>
                    <div class="el-page">
                      <el-pagination small @current-change="handleCurrentChange" :current-page="curPage"
                          :page-size="pSize" layout="prev, pager,next,total" :total="pTotal" :pager-count="perCount" class="sele-page">
                      </el-pagination>
                    </div>
                  </div>
                  <el-button slot="reference" size="small" class="fen-btn">
                    <img :src="disImg1" alt="" class="fenimg1">
                    <img :src="disImg2" alt="" class="fenimg2">
                  </el-button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <Page :currentPage="currentPage" :pageSize="pageSize" :total="total" @changePage="changePage"></Page>
        </div>
      </div>
    </div>
    <!-- 雇主详情弹窗 -->
    <OrderProcessDetail ref="orderDetail"  :row="curUser" @updateList="getDemandList(getOrderFlag)"/>
    <!-- 聊天 -->
    <Chat ref="chat" :curUser="targetUser"/>
  </div>
</template>

<script>
import { demandList,employee,allotAdvisor } from '@/api/api'
import { fenImg1,fenImg2,editImg1,editImg2,sUrl,
emurl,disImg1,disImg2,contractImg,persImg } from '@/utils/imgConfig.js'
import { contractUrl } from '@/utils/config.js'
import Page from '@/components/Page.vue'
import { mapGetters } from 'vuex'
import Chat from '@/components/Chat.vue'
import OrderProcessDetail from '@/views/employer/OrderProcessDetail.vue'
import imgurl from '@/utils/common.js'
  export default {
    name: 'orderProcessing',
    components: {
      Page,
      Chat,
      OrderProcessDetail
    },
    data() {
      return {
        imgurl,
        taSearchText: '',
        options: [],
        sUrl:sUrl,
        emurl,
        fenImg1,
        fenImg2,
        editImg1,
        editImg2,
        disImg1,
        disImg2,
        contractImg,
        persImg,
        tableData: [],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        tableDataList:[],
        cur: -1,
        disList:[],
        bdcolor:false,
        targetUser:{},
        curUser:{},
        //当前订单id
        curOrderId:"",
        //服务项的id
        serviceId:"",
        contractUrl,
        curPage:1,
        pSize:5,
        pTotal:0,
        perCount:5
      }
    },
    created() {
      this.getDemandList(this.getOrderFlag)
      this.getSysMetaData.forEach(item =>{
        if (item.pid === 2 && item.status == 1) {
          this.options.push(item)
        }
      })
    },
    computed:{
      ...mapGetters([
          'getUsers',
          'getSysMetaData',
          'getOrderFlag',
          'getOrder'
      ])
    },
    methods: {
      getDemandList(){// 订单处理列表
        let params = {
          app: 3,
          device: 5,
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          serviceId: this.serviceId,
          token: this.getUsers.token,
          type: this.getOrderFlag?1:2,
          searchParameters:this.taSearchText 
        }
        demandList(params).then(res =>{
          if(res.code == 200) {
            this.tableDataList = res.data.records
            this.total = res.data.total
            this.tableDataList.forEach(item =>{
              item.date = item.orderDemandCommon.createTime
              item.name = item.orderDemandCommon.name
              item.demand = item.orderDemandCommon.typeName + 'T'+ item.orderDemandCommon.startLevel + '-T' + item.orderDemandCommon.endLevel
              item.demandTime = item.orderDemandCommon.startTime
              item.address = item.orderDemandCommon.userMailAddress.provinceName + item.orderDemandCommon.userMailAddress.cityName + item.orderDemandCommon.userMailAddress.placeDetail
              item.salary = item.orderDemandCommon.startPrePrice/1000 + '-' + item.orderDemandCommon.endPrePrice/1000 + 'k'
              item.contract = item.orderDemandCommon.agreementId
              item.followStatus = item.orderDemandCommon.serviceStatus
              item.sex = item.orderDemandCommon.sex
              item.orderId =  item.orderDemandCommon.id
              item.orderDemandCommon.remark=item.orderDemandCommon.remark?item.orderDemandCommon.remark:[]
            })
          }else{
            this.$myMessage('error',res.msg);
          }
        })
      },
      search() {//搜索
        this.getDemandList();
      },
      changePage(val) {//分页
        this.currentPage = val
        this.getDemandList(this.getOrderFlag)
      },
      msgClick(row) {// 聊天
        let user={}
        user.uid=row.orderDemandCommon.cid.toString();
        user.name=row.orderDemandCommon.name;
        this.targetUser=user;
        this.$refs.chat.showDialog()
      },
      async disClick(idx,item) {//分配顾问
        this.cur = idx
        let title=this.getOrder.orderDemandCommon.typeName + 'T'+ this.getOrder.orderDemandCommon.startLevel + '-T' + this.getOrder.orderDemandCommon.endLevel
        let params={
          oid:this.curOrderId,//订单id
          documentary:item.id,//顾问id
          documentaryb:this.getOrder.orderDemandCommon.documentary,//上一个顾问id
          eid:item.eid,
          token:this.getUsers.token,
          documentName:item.name,
          cid:this.getOrder.orderDemandCommon.cid,
          title
        }
        const result=await allotAdvisor(params)
        if(result.code===200){
          this.$myMessage('succsee','分配成功')
          this.getDemandList(this.getOrderFlag)
        }else{
          this.$myMessage('error',result.msg)
        }
      },
      handleClick(flag){//未发布，处理中状态切换
        this.$store.commit('updateOrderFlag', flag)
        this.getDemandList()
      },
      changeBorder(val){
        this.bdcolor = val
      },
      changeSelect(val){
        this.serviceId = val
        this.getDemandList(this.getOrderFlag)
      },
      editClick(row) {
        this.$refs.orderDetail.orderDrawer()
        this.curUser=row;
      },
      cellClick(row){//单行点击
        this.curOrderId=row.orderId
        sessionStorage.setItem('orderDetail', JSON.stringify(row))
        this.$store.commit('updateOrder', row)
      },
      async getDisList(){//获取顾问列表
        let params={
          pageNo:this.curPage,
          pageSize:this.pSize,
          token:this.getUsers.token,
          roleId:this.getOrder.orderDemandCommon.roleId
        }

        const result=await employee(params);
        if(result.code===200){
          this.disList=result.data.records
          this.pTotal=result.data.total
        }
      },
      handleCurrentChange(page){
        this.curPage=page
        this.getDisList()
      },
      openDisPop(){
        this.curPage=1
        this.getDisList()
      }
    }
  }
</script>

<style scoped lang="scss">
  @import './common.scss'
</style>

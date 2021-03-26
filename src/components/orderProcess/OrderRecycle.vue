<template>
  <div class="pages-container">
    <div class="pages-wraps">
      <div class="page-table-content all-screen">
        <div class="talent-all clearfix">
          <span class="sp1" :class="getOrderFlag2?'on':''" @click="handleClick(true)">可挽回</span>
          <span class="sp2" :class="getOrderFlag2?'':'on'" @click="handleClick(false)">不可挽回</span>
        </div>
        <div class="tablent-md clearfix">
          <div class="tablent-search bd">
            <el-input placeholder="请输入订单号/手机号/姓名/搜索" v-model="taSearchText" @input="changeInput">
            </el-input>
            <a href="javascript:void(0);" class="talent-btn" @click="search"><img :src="sUrl" alt=""></a>
          </div>
          <div class="tablent-date fr flexbox align-items-center">
            <span class="ft16 fw4 color2">作废时间：</span>
            <el-date-picker
              v-model="tablentDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              @change="changeDate">
            </el-date-picker>
            <el-select class="bd" v-model="value" clearable filterable placeholder="请选择" 
            :class="bdcolor?'bdcolor':''" @visible-change="changeBorder" @change="seleChange">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
              <div class="el-page">
                <el-pagination small @current-change="handleCurrentChange" :current-page="curPage" :pager-count="perCount"
                    :page-size="pSize" layout="prev, pager,next,total" :total="pTotal" class="sele-page">
                </el-pagination>
              </div>
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
            <el-table-column prop="name" label="雇主" width="130">
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
            <el-table-column prop="concact" label="联系方式" width="">
              <template slot-scope="scope">
                <span>{{scope.row.orderDemandCommon.phone||'--'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="salary" label="薪资范围" width="100">
              <template slot-scope="scope">
                <span>{{scope.row.salary}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="follow" label="跟进人" width="120">
              <template slot-scope="scope">
                <span class="color1">{{scope.row.orderDemandCommon.documentName||'--'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="followStatus" label="跟进状态" width="100px">
              <template slot-scope="scope">
                <span>{{getServiceStatus(scope.row.orderDemandCommon.serviceStatus)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="voidReason" label="作废理由" width="">
              <template slot-scope="scope">
                <span class="color1">{{scope.row.orderDemandCommon.reason||'--'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="voidDate" label="作废时间" width="120">
              <template slot-scope="scope">
                <span class="color1">
                  {{ (scope.row.orderDemandCommon.updateTime).substr(0,10) }}<br />
                  {{ (scope.row.orderDemandCommon.updateTime).substr(11,8) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="160">
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
                      <li :class="cur == index?'on':''" v-for="(item,index) in options" :key="index" @click="disClick(index,item)">
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
    <OrderProcessDetail ref="orderDetail"  :row="curUser" @updateList="getDemandList(getOrderFlag2)"></OrderProcessDetail>
    <!-- 聊天 -->
    <Chat ref="chat" :curUser="targetUser"/>
  </div>
</template>

<script>
import { demandList,employee,allotAdvisor } from '@/api/api'
import Page from '@/components/Page.vue'
import Chat from '@/components/Chat.vue'
import OrderProcessDetail from '@/views/employer/OrderProcessDetail.vue'
import { mapGetters } from 'vuex'
import { fenImg1,fenImg2,editImg1,editImg2,sUrl,
emurl,disImg1,disImg2,contractImg,persImg } from '@/utils/imgConfig.js'
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
        sUrl,
        emurl,
        fenImg1,
        fenImg2,
        editImg1,
        editImg2,
        disImg1,
        disImg2,
        persImg,
        contractImg,
        currentPage: 1,
        pageSize: 10,
        total: 0,
        tableDataList:[],
        cur: -1,
        options: [],
        value: '删除人',
        bdcolor:false,
        targetUser:{},
        curUser:{},
        //当前订单id
        curOrderId:"",
        tablentDate:"",
        curPage:1,
        pSize:5,
        pTotal:0,
        perCount:5
      }
    },
    created() {
      this.getDemandList(this.getOrderFlag2)
      this.getDeletList();
    },
    computed:{
      ...mapGetters([
          'getOrder',
          'getUsers',
          'getSysMetaData',
          'getOrderFlag2'
      ])
    },
    methods: {
      getDemandList(){// 订单回收站列表
        let params = {
          app: 3,
          device: 5,
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          token: this.getUsers.token,
          type: this.getOrderFlag2?7:8 ,
          searchParameters:this.taSearchText,
          oid:this.oid,
          startDelTime:this.startDelTime,
          endDelTime:this.endDelTime 
        }
        demandList(params).then(res =>{
          if(res.code == 200) {
            this.tableDataList = res.data.records
            this.total = res.data.total
            this.tableDataList.forEach(item =>{
              item.date = item.orderDemandCommon.createTime
              item.name = item.orderDemandCommon.name
              item.demand = item.orderDemandCommon.typeName + 'T'+ item.orderDemandCommon.startLevel + '-T' + item.orderDemandCommon.endLevel
              item.salary = item.orderDemandCommon.startPrePrice/1000 + '-' + item.orderDemandCommon.endPrePrice/1000 + 'k'
              item.follow = '--'
              item.followStatus = item.orderDemandCommon.serviceStatus
              item.sex = item.orderDemandCommon.sex
              item.orderId =  item.orderDemandCommon.id
              item.orderDemandCommon.remark=item.orderDemandCommon.remark?item.orderDemandCommon.remark:[]
            })
          }
        })
      },
      search() {
        this.getDemandList(this.getOrderFlag);
      },
      changeInput() {
        if(this.taSearchText === '') {
          this.tableDataList =  this.tableData
        }
      },
      changePage(val) {//分页
        this.currentPage = val
        this.getDemandList(this.getOrderFlag2)
      },
      msgClick(row) {//聊天
        let user={}
        user.id=row.orderDemandCommon.id.toString();
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
          this.getDemandList(this.getOrderFlag2)
        }else{
          this.$myMessage('error',result.msg)
        }
      },
      handleClick(flag) {
        this.$store.commit('updateOrderFlag2', flag)
        this.getDemandList()
      },
      changeDate(val) {
        this.tablentDate=val
        if(val){
          let startStr=val[0]
          let endStr=val[1]
          // var date1 = startStr.replace(/-/g,'/')
          // var date2 = endStr.replace(/-/g,'/')
          this.startDelTime= `${startStr} 00:00:00`
          this.endDelTime=`${endStr} 00:00:00`
        }else{
          this.startDelTime=""
          this.endDelTime=""
        }
        
        this.getDemandList(this.getOrderFlag2)
      },
      changeBorder(val){
        this.bdcolor = val
        if(val){
          this.curPage=1
          this.getDeletList()
        }
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
      async getDeletList(){//获取删除人列表
        let params={
          pageNo:this.curPage,
          pageSize:this.pSize,
          token:this.getUsers.token
        }

        const result=await employee(params)
        if(result.code===200){
          this.options=result.data.records
          this.pTotal=result.data.total
        }else{
          this.$myMessage("error",result.msg)
        }
      },
      handleCurrentChange(page){
        this.curPage=page
        this.getDeletList()
      },
      openDisPop(){//监听顾问弹窗打开
        this.curPage=1
        this.getDeletList()
      },
      getServiceStatus(status){//获取作废状态
        switch(status){
          case 1:
            return '未发布'
          case 2:
            return '待处理'
          case 3:
            return '财务审核中'
          case 4:
            return '服务中'
          case 5:
            return '待审核'
          case 6:
            return '待续签'
          case 7:
            return '可挽回'
          case 8:
            return '不可挽回'
          case 9:
            return '订单历史'
        }
      },
      seleChange(val){
        this.oid=val
        this.getDemandList(this.getOrderFlag2)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import './common.scss'
</style>

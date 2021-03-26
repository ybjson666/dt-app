<template>
  <div class="drawer-container">
    <!-- 雇主详情弹窗 -->
    <el-drawer class="orderDrawer" :visible.sync="drawer" :direction="direction" :modal="modal" @close="closeDrawer"  :withHeader="false" >
      <div v-if="JSON.stringify(getOrder) == '{}' || getOrder == null"></div>
      <el-row class="orderCont flexbox flex-direction-column" v-else>
        <el-row class="orderDt-cont">
          <el-row class="orderDt-hd">
            <el-col :span="12" class="flexbox align-items-center">
              <img v-if="getOrder.orderDemandCommon.headImg" :src="imgurl+getOrder.orderDemandCommon.headImg"/> 
              <img :src="persImg" alt="" class="orderImg" v-else>
              <el-col class="flexauto">
                <el-col class="ft18 fw4 color1">雇主：{{getOrder.orderDemandCommon.name}}</el-col>
                <el-col class="ft16 fw4 color1">订单号：{{getOrder.orderDemandCommon.id}}</el-col>
              </el-col>
            </el-col>
            <el-col :span="12" class="order-btn flexbox align-items-center">
              <span class="call">
                  <img :src="callImg" alt="" class="">
                  <div class="chat">打电话</div>
                </span>
              <span class="send" @click="callMsg">
                  <img :src="chatImg" alt="" class="">
                  <div class="chat">发起聊天</div>
                </span>
              <el-button class="order-btn1 on" v-if="getOrder.orderDemandCommon.serviceStatus == 1">未发布</el-button>
              <el-button class="order-btn1" v-if="getOrder.orderDemandCommon.serviceStatus == 2">处理中</el-button>
              <el-button class="order-btn1" v-if="getOrder.orderDemandCommon.serviceStatus == 4 || getOrder.orderDemandCommon.serviceStatus == 5">服务中</el-button>
              <el-button class="order-btn1 on1" v-if="getOrder.orderDemandCommon.serviceStatus == 7">无效</el-button>
              <el-button class="order-btn1 on1" v-if="getOrder.orderDemandCommon.serviceStatus == 8">丢单</el-button>
              <el-button class="order-btn1 on2" v-if="getOrder.orderDemandCommon.serviceStatus == 9">已完成</el-button>
              <el-popover trigger="hover" placement="bottom" popper-class="inherit" v-if="getOrder.orderDemandCommon.serviceStatus != 9">
                <div class="order-status">
                  <ul>
                    <li :class="setTitle == '设为无效'?'on':''" @click="invalidClick('one')" v-if="getOrder.orderDemandCommon.serviceStatus == 1 || getOrder.orderDemandCommon.serviceStatus == 2">设为无效</li>
                    <li :class="setTitle == '设为丢失'?'on':''" @click="invalidClick('two')" v-if="getOrder.orderDemandCommon.serviceStatus == 1 || getOrder.orderDemandCommon.serviceStatus == 2">设为丢单</li>
                    <li :class="setTitle == '解约'?'on':''" @click="breakClick" v-if="getOrder.orderDemandCommon.serviceStatus == 4||getOrder.orderDemandCommon.serviceStatus == 5">解约合同</li>
                    <li :class="setTitle == '终止'?'on':''" @click="terminationClick" v-if="getOrder.orderDemandCommon.serviceStatus == 4||getOrder.orderDemandCommon.serviceStatus == 5">终止订单</li>
                    <li :class="setTitle == '设为处理'?'on':''" @click="invalidClick('three')" v-if="getOrder.orderDemandCommon.serviceStatus == 7 || getOrder.orderDemandCommon.serviceStatus == 8">设为处理</li>
                  </ul>
                </div>
                <el-button class="order-btn2" slot="reference"></el-button>
              </el-popover>
              <el-button class="order-btn3 closed" @click="drawer =false"></el-button>
            </el-col>
          </el-row>
          <el-row class="orderDt-list">
            <el-col :span="3">
              <p class="orders1">服务</p>
              <p class="orders2">{{getOrder.orderDemandCommon.typeName + 'T'+ getOrder.orderDemandCommon.startLevel + '-T' + getOrder.orderDemandCommon.endLevel}}</p>
            </el-col>
            <el-col :span="3">
              <p class="orders1">雇员</p>
              <p class="orders2">
                <i class="plus" @click="addEmployee(1)" v-if="!getOrder.orderDemandCommon.workerName&&getOrder.followStatus!=9"></i>
                <el-popover trigger="hover" placement="bottom" v-if="getOrder.orderDemandCommon.workerName">
                  <div class="pd10 color5">雇员：{{getOrder.orderDemandCommon.workerName}}</div>
                  <i class="order-follower" slot="reference">
                    <span v-if="getOrder.orderDemandCommon.agreementId"><img :src="getOrder.orderDemandCommon.workerHeadImg | imgFormat" alt=""></span>
                    <span v-else>
                      <img :src="getOrder.orderDemandCommon.workerHeadImg | imgFormat" alt=""  v-if="getOrder.followStatus==9">
                      <img :src="getOrder.orderDemandCommon.workerHeadImg | imgFormat" alt="" @click="addEmployee(2)" v-else>
                    </span>
                  </i>
                </el-popover>
              </p>
            </el-col>
            <el-col :span="3">
              <p class="orders1">合同</p>
              <p class="orders2">
                <i class="plus" @click="addEmployee2" v-if="!getOrder.orderDemandCommon.agreementId"></i>
                <el-popover trigger="hover" placement="bottom" v-else>
                  <div class="pd10 color5">合同：{{getOrder.orderDemandCommon.agreementId}}</div>
                  <i class="order-follower" slot="reference" >
                    <a :href="`${contractUrl}/order/agreement/h5?gid=${getOrder.orderDemandCommon.agreementId}&type=3`" v-if="getOrder.followStatus==9">
                      <img :src="contractImg" alt="" style="width:auto;height:.26rem;" />
                    </a>
                    <a :href="`${contractUrl}/order/agreement/h5?gid=${getOrder.orderDemandCommon.agreementId}&type=3`" target="blank" v-else >
                        <img :src="contractImg" alt="" style="width:auto;height:.26rem;" @click="addEmployee2" >
                    </a>
                  </i>
                </el-popover>
              </p>
            </el-col>
            <el-col :span="3">
              <p class="orders1">服务期至</p>
              <el-popover trigger="hover" placement="bottom" v-if="getOrder.orderDemandCommon.endTime">
                <div class="pd10 color5">{{getOrder.orderDemandCommon.startTime}} 至 {{getOrder.orderDemandCommon.endTime}}</div>
                <p class="orders2" slot="reference" style="display:inline-block;">{{getOrder.orderDemandCommon.endTime}}</p>
              </el-popover>
              <p class="orders2" v-else>/</p>
            </el-col>
            <el-col :span="3">
              <p class="orders1">跟进人</p>
              <p class="orders2">
                <el-popover trigger="hover" placement="bottom">
                  <div class="pd10 color5 follow-cont">
                    <el-row class="follow-hd">
                      <el-row class="follow-hd-title">
                        <el-col :span="12">跟进人姓名</el-col>
                        <el-col :span="12">最近沟通时间</el-col>
                      </el-row>
                      <el-row class="follow-hd-cont">
                        <el-col :span="12">
                          <img :src="imgurl+getOrder.orderDemandCommon.doHeadImg" alt="">
                          <span>{{getOrder.orderDemandCommon.documentName||'--'}}</span>
                        </el-col>
                        <el-col :span="12">2020-06-24 13:24:45</el-col>
                      </el-row>
                    </el-row>
                    <el-row class="follow-collpase">
                      <el-collapse v-model="activeHsNames">
                        <el-collapse-item title="历史跟进人" name="1">
                          <el-row class="follow-hdlist">
                            <el-row class="follow-hd">
                              <el-row class="follow-hd-title">
                                <el-col :span="12">跟进人姓名</el-col>
                                <el-col :span="12">最近沟通时间</el-col>
                              </el-row>
                              <el-row class="follow-hd-cont" v-for="(item,index) in getOrder.orderDemandCommon.remark" :key="index">
                                <el-col :span="12"><img :src="imgurl+item.headImg" alt="">{{item.name}}</el-col>
                                <el-col :span="12">{{item.time}}</el-col>
                              </el-row>
                            </el-row>
                          </el-row>
                        </el-collapse-item>
                      </el-collapse>
                    </el-row>
                  </div>
                  <i class="order-follower" slot="reference">
                    <img :src="imgurl+getOrder.orderDemandCommon.doHeadImg" alt="">
                  </i>
                </el-popover>
              </p>
            </el-col>
            <el-col :span="3">
              <p class="orders1">跟进状态</p>
              <p class="orders2">
                <span v-if="getOrder.orderDemandCommon.serviceStatus==1">未发布</span>
                <span v-else-if="getOrder.orderDemandCommon.serviceStatus==2">待处理</span>
                <span v-else-if="getOrder.orderDemandCommon.serviceStatus==3">处理中</span>
                <span v-else-if="getOrder.orderDemandCommon.serviceStatus==4">服务中</span>
                <span v-else-if="getOrder.orderDemandCommon.serviceStatus==5">解约待审核</span>
                <span v-else-if="getOrder.orderDemandCommon.serviceStatus==6">待续签</span>
                <span v-else-if="getOrder.orderDemandCommon.serviceStatus==7">可挽回</span>
              </p>
            </el-col>
            <el-col :span="3">
              <div class="orders1">支付</div>
              <div class="orders2">
                <div v-if="getOrder.orderDemandCommon.serviceStatus==6">
                  <strong style="color:red">待续签</strong>
                </div>
                <div v-else>
                  <div v-if="orderTabName=='fourth'">
                    <el-popover trigger="hover" placement="bottom-end">
                      <div class="pd10 color5">
                        <p>前期服务费：{{getOrder.orderDemandCommon.servicePay}}元</p>
                        <p>雇员工资：{{getOrder.orderDemandCommon.workPay}}元</p>
                      </div>
                      <p class="orders2" slot="reference" style="color:red" v-if="getOrder.orderDemandCommon.workPay">{{totalPay}}</p>
                    </el-popover>
                  </div>
                  <p v-else>
                      <span v-if="getOrder.orderDemandCommon.workPay" style="color:#1b9dfb">已支付</span>
                      <span style="color:#FF9900" v-else>待支付</span>
                  </p>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-row>
        <el-row class="order-tab flexauto">
          <el-tabs v-model="orderTabName" @tab-click="orderTabClick">
            <el-tab-pane label="订单详情" name="first" class="">
              <el-row class="order100">
              <el-row class="pdl28" style="padding-top:.09rem">
                <el-row class="orderTab-lt">
                  <el-row class="orderTab-lthd">主要需求</el-row>
                </el-row>
                <el-row class="orderTab-title flexbox align-items-center">
                  <span class="ft14 color1" style="width:1rem;">发布标题：</span>
                  <template v-if="getOrder.orderDemandCommon.serviceStatus == 1">
                    <el-input v-model="orderInput" placeholder="" class="orderIpt" :class="bdcolor?'on':''" @focus="bdcolor = true" @blur="bdcolor = false"></el-input>
                    <el-button class="orderTab-btn1" @click="releaseClick">发布</el-button>
                    <el-button class="orderTab-btn2" @click="matchClick">智能匹配</el-button>
                  </template>
                  <template v-else>
                    <span>{{orderInput}}</span>
                    <el-button class="orderTab-btn2" @click="matchClick" v-if="getOrder.orderDemandCommon.serviceStatus == 2||getOrder.orderDemandCommon.serviceStatus == 3">智能匹配</el-button>
                  </template>
                </el-row>
                <el-row class="orderTab-bt">
                    <el-col :span="8">
                      <template v-if="getOrder.child !== null">
                        <el-row><span>宝宝年龄：</span>
                        {{parseInt((Date.parse(new Date()) - Date.parse(getOrder.child.childBirthday))/(24*3600*1000))}}天
                        </el-row>
                        <el-row><span>饮食情况：</span>{{getOrder.child.eatStatus ?getOrder.child.eatStatus+'':''}}</el-row>
                        <el-row><span>睡眠情况：</span>{{getOrder.child.sleepStatus ?getOrder.child.sleepStatus+'':''}}</el-row>
                        <el-row><span>动作情况：</span>{{getOrder.child.actionStatus ?getOrder.child.actionStatus+'':''}}</el-row>
                      </template>
                      <template v-if="getOrder.doula">
                        <el-row><span>生产类型：</span>{{getOrder.doula.eatStatus ?getOrder.doula.eatStatus+'':''}}</el-row>
                        <el-row><span>喂养：</span>{{getOrder.doula.pregnantStatus ?getOrder.doula.pregnantStatus+'':''}}</el-row>
                      </template>
                      <template v-if="getOrder.housework">
                        <el-row><span>家庭人数：</span>{{getOrder.housework.familySize ?getOrder.housework.familySize+'':''}}</el-row>
                        <el-row><span>房屋面积：</span>{{getOrder.housework.floorSpace ?getOrder.housework.floorSpace+'':''}}</el-row>
                        <el-row><span>口味要求：</span>{{getOrder.housework.taste.length > 0?getOrder.housework.taste+'':''}}</el-row>
                      </template>
                      <template v-if="getOrder.safety ">
                        <el-row><span>雇主年龄：</span>{{getOrder.safety.age?getOrder.safety.age+'':''}}</el-row>
                        <el-row><span>雇主国籍：</span>{{getOrder.safety.country?getOrder.safety.country+'':''}}</el-row>
                        <el-row><span>雇主性别：</span>{{getOrder.safety.sex == 0?'女':'男'}}</el-row>
                      </template>
                      <template v-if="getOrder.teacher ">
                        <el-row><span>资格证书：</span>{{getOrder.teacher.certificate.length > 0?getOrder.teacher.certificate+'':''}}</el-row>
                        <el-row><span>孩子年龄：</span>{{getOrder.teacher.childAge ?getOrder.teacher.childAge:''}}</el-row>
                        <el-row><span>兴趣爱好：</span>{{getOrder.teacher.hobby.length > 0?getOrder.teacher.hobby+'':''}}</el-row>
                        <el-row><span>综合素养：</span>{{getOrder.teacher.school?getOrder.teacher.school:''}}</el-row>
                      </template>
                      <el-row><span>需求日期：</span>{{getOrder.orderDemandCommon.startTime}}</el-row>
                      <el-row v-if="getOrder.orderDemandCommon.workProp == 0"><span>工作性质：</span>白班</el-row>
                      <el-row v-if="getOrder.orderDemandCommon.workProp == 1"><span>工作性质：</span>住家--{{getOrder.orderDemandCommon.stay == 1?'独立卧室':getOrder.orderDemandCommon.stay == 2?'非独立卧室':'无'}}</el-row>
                    </el-col>
                    <el-col :span="8">
                      <el-row><span>年龄要求：</span>
                        <template v-if="getOrder.orderDemandCommon.startAge || getOrder.orderDemandCommon.endAge ">
                          <template v-if="getOrder.orderDemandCommon.startAge == 0 || getOrder.orderDemandCommon.endAge == 0"></template>
                          <template v-else>{{getOrder.orderDemandCommon.startAge + '～' +getOrder.orderDemandCommon.endAge+ '岁'}}</template>
                        </template>
                        <template v-else></template>
                      </el-row>
                      <el-row><span>身高要求：</span>{{getOrder.orderDemandCommon.startStature  || getOrder.orderDemandCommon.endStature ?getOrder.orderDemandCommon.startStature +'～'+getOrder.orderDemandCommon.endStature+'cm':''}}</el-row>
                      <el-row><span>学历要求：</span>{{getOrder.orderDemandCommon.educationName ?getOrder.orderDemandCommon.educationName+'':''}}</el-row>
                      <el-row><span>地区要求：</span>{{getOrder.orderDemandCommon.nativePlaceName ?getOrder.orderDemandCommon.nativePlaceName+''+'不考虑':''}}</el-row>
                      <el-row><span>属相要求：</span>{{getOrder.orderDemandCommon.chineseZodiacName ?getOrder.orderDemandCommon.chineseZodiacName+''+'不考虑':''}}</el-row>
                      <el-row><span>工作经验：</span>{{getOrder.orderDemandCommon.startWorkYear  || getOrder.orderDemandCommon.endWorkYear ?getOrder.orderDemandCommon.startWorkYear +'～'+ getOrder.orderDemandCommon.endWorkYear+'年':''}}</el-row>
                    </el-col>
                    <el-col :span="8">
                      <el-row>
                        <span>福利待遇：</span>
                        <div><b v-for="(item,index) in getOrder.orderDemandCommon.benefitNames" :key="index">{{index == getOrder.orderDemandCommon.benefitNames.length - 1?item.name:item.name+','}}</b></div>
                      </el-row>
                      <el-row style="opacity:0;"><span>--</span></el-row>
                      <el-row>
                        <span>用户备注：</span>
                        {{getOrder.orderDemandCommon.description}}
                      </el-row>
                      <el-row><span></span></el-row>
                    </el-col>
                </el-row>
                <el-row class="orderTab-lt">
                  <el-row class="orderTab-lthd">订单信息</el-row>
                </el-row>
                <el-row class="orderTab-bt">
                    <el-col :span="8">
                      <el-row><span>下单时间：</span>{{getOrder.orderDemandCommon.createTime}}</el-row>
                      <el-row><span>服务地址：</span>{{getOrder.orderDemandCommon.userMailAddress.provinceName + getOrder.orderDemandCommon.userMailAddress.cityName + getOrder.orderDemandCommon.userMailAddress.placeDetail}}</el-row>
                    </el-col>
                    <el-col :span="8">
                      <el-row><span>薪资范围：</span>{{getOrder.orderDemandCommon.startPrePrice !==null || getOrder.orderDemandCommon.endPrePrice!==null?getOrder.orderDemandCommon.startPrePrice/1000 +'-'+ getOrder.orderDemandCommon.endPrePrice/1000 +'k':''}}</el-row>
                    </el-col>
                </el-row>
                <el-row class="orderTab-lt">
                  <el-row class="orderTab-lthd">备注信息</el-row>
                </el-row>
                <el-row class="orderTab-bt">
                  <el-row class="order-tarea">
                    <!-- <el-input type="textarea" placeholder="时刻记录雇主的特殊需求，并填写备注信息。" v-model="orderTextarea" :rows="4" maxlength="200" show-word-limit :class="sendShow?'on':''" @focus="sendShow = true" @blur="sendShow = false"></el-input> -->
                    <el-input type="textarea" placeholder="时刻记录雇主的特殊需求，并填写备注信息。" v-model="orderTextarea" :rows="4" maxlength="200" show-word-limit :class="sendShow?'on':''" @focus="sendShow = true"></el-input>
                    <span class="closed" @click="sendClose()"></span>
                  </el-row>
                  <el-row class="sendRemark" v-if="sendShow">
                    <el-button @click="sendRemark()">发送</el-button>
                  </el-row>
                </el-row>
              </el-row>
              <el-row class="order-total">全部</el-row>
              <el-row class="pdl28" style="padding-right:.28rem;">
                <template v-if="getOrder.orderDemandCommon.remark && getOrder.orderDemandCommon.remark.length > 0">
                  <el-row class="order-total-list flexbox align-items-center" v-for="(item,index) in getOrder.orderDemandCommon.remark" :key="index">
                    <span>{{item.time.substr(0,10)}}<br />{{item.time.substr(11,8)}}</span>
                    <img :src="getcommonFun.errorimg" alt="" class="order-total-listimg" v-if="item.headImg == null || item.headImg == ''">
                    <img :src="item.headImg | imgFormat" alt="" class="order-total-listimg" v-else>
                    <el-row class="order-total-listhd flexbox flexauto align-items-center">
                      <el-col :span="20" class="flexauto">{{item.content}}</el-col>
                      <el-col :span="4">
                        {{item.name}}<br />
                        {{item.type == 1?'跟进':item.type == 2?'调查':'回访'}}记录
                      </el-col>
                    </el-row>
                  </el-row>
                </template>
                <el-row class="ft14 center pd10"  v-else style="margin-top:10px">暂无跟进记录</el-row>
              </el-row>
              <!-- <Page :currentPage="currentPage" :pageSize="pageSize" :total="total" @changePage="changePage"></Page> -->
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="服务反馈" name="second" class="">
              <el-row class="order-serve">
                <el-row class="talent-exam">
                  <el-col class="talent-exam-hd" :span="8">
                    <el-row class="talent-exam-title" style="padding-left:.2rem;">
                      <div class="talent-all clearfix" style="margin-bottom:0;">
                        <span class="sp1" :class="getOrderFlag3?'on':''" @click="allClick(true,'1')">顾问反馈</span>
                        <span class="sp2" :class="getOrderFlag3?'':'on'" @click="allClick(false,'2')">专家反馈</span>
                      </div>
                    </el-row>
                    <el-row class="talent-exam-btm" v-if="ecamList && ecamList.length > 0">
                    <el-row class="talent-exam-list">
                      <ul>
                        <li :class="currentIndex2 == index?'on':''" v-for="(item,index) in ecamList" :key="index" @click="changeExamClick(index)" style="padding:.08rem .2rem;">
                          <el-row class="talent-exam-lt flexbox align-items-center">
                            <span class="dtimg">
                              <img :src="imgurl+item.headPic" alt="">
                              <span v-if="item.status == 0"></span>
                            </span>
                            <div class="talent-exam-name flexbox flex-direction-column flex1">
                              <div class="gzname ft16 color1 fw5">
                                {{getUserType(item.userType)}}：{{item.name||'--'}}
                                <span class="date ft15 fw4 color4">{{item.createTime.substr(11,5)}}</span>
                              </div>
                              <div class="ft14 orange1 fw4 ellips" style="margin-top:3px" v-if="item.status == 0">处理中</div>
                              <div class="ft14 color4 fw4 ellips" style="margin-top:3px" v-if="item.status == 1">已解决</div>
                            </div>
                          </el-row>
                        </li>
                      </ul>
                    </el-row>
                    </el-row>
                  </el-col>
                  <el-col class="talent-exam-bd hd order100" :span="16">
                    <el-row class="talent-exam-content" v-if="ecamList && ecamList.length > 0">
                      <el-row class="talent-exam-cont" :class="currentIndex2 == index?'active':''" v-for="(item,index) in ecamList" :key="index">
                        <el-row class="talent-exam-ct">
                          <div class="talent-exam-ct-left fl">
                            <div class="talent-exam-ct-wraps">
                              <img :src="imgurl+item.headPic" alt="" class="uimg">
                              <div class="talent-exam-cname">
                                <p class="color1 fw5 ft16">{{item.name}}</p>
                                <p class="color3 fw4 ft16">ID:{{item.eid}}</p>
                              </div>
                            </div>
                          </div>
                          <div class="talent-exam-bt fl" v-if="getOrderFlag3">
                            <el-button size="small" class="fen-btn">
                              <img :src="fenImg1" alt="" class="fenimg1">
                              <img :src="fenImg2" alt="" class="fenimg2">
                            </el-button>
                            <el-button size="small" class="fen-btn talent-exam-dot" @click="changeZhuan" title="转为专家处理"></el-button>
                          </div>
                          <div class="talent-exam-num fr">
                            <p>订单编号：{{item.oid}}</p>
                            <p>反馈单号：{{item.id}}</p>
                            <p>反馈时间：{{item.createTime}}</p>
                          </div>
                        </el-row>
                        <el-row class="talent-exam-review">
                          <el-col :span="16" class="talent-exam-reviewlf">
                            <el-row class="talent-exam-review-title ft16 fw6 color1">{{item.title}}</el-row>
                            <el-row class="talent-exam-review-des fw4 color3">
                              <template v-if="item.msg">
                                <el-row v-for="(sitem,index) in item.msg.answers" :key="index">
                                  <template v-if="sitem.doStatus == 0 || sitem.doStatus == 11">
                                  {{sitem.content}}
                                  </template>
                                </el-row>
                              </template>
                              <template v-else>--</template>
                            </el-row>
                            <el-row class="talent-exam-review-cont" v-if="getOrderFlag3">
                              <el-input type="textarea" class="talent-exam-review-tea" :rows="6" v-model="reviewTextarea" 
                              :placeholder="placeholder" :class="bdcolor?'on':''" @focus="textareaFocus" @blur="textareaBlur"></el-input>
                              <el-row class="talent-exam-review-back">
                                <el-button @click="replyClick2(item.id,1)" v-if="item.userType==1">回复给雇员</el-button>
                                <el-button @click="replyClick2(item.id,2)" v-else-if="item.userType==2">回复</el-button>
                              </el-row>
                            </el-row>
                          </el-col>
                          <el-col class="fwrecord">跟进记录</el-col>
                          <el-col :span="8" class="talent-exam-reviewrt">
                              <el-row class="talent-exam-reviewlist" v-for="(item,index) in answerArr" :key="index">
                                <div class="talent-exam-left">
                                  <div class="talent-exam-date ft14 fw6 color2">{{item.time.substr(5,2)+'月'+item.time.substr(8,2)+'日'}}</div>
                                  <div class="talent-exam-time ft14 fw4 color3">{{item.time.substr(11,5)}}</div>
                                  <div class="talent-exam-border"></div>
                                  <div class="talent-exam-line"></div>
                                </div>
                                <div class="talent-exam-right">
                                  <!-- 处理状态 0问题描述 1客服受理/专家受理 2专家受理 3客服跟进 4转至专家处理 5处理结果 6等待评价 7客服再次受理 8专家再次受理 9已评价 10超时未评价 11问题补充 -->
                                  <div class="talent-exam-rtitle ft14 fw6 color2" v-if="item.doStatus == 0">问题描述<span>{{item.ename?item.ename:'--'}}</span></div>
                                  <div class="talent-exam-rtitle ft14 fw6 color2" v-if="item.doStatus == 1">客服受理</div>
                                  <div class="talent-exam-rtitle ft14 fw6 color2" v-if="item.doStatus == 2">专家受理<span>{{item.ename?item.ename:'--'}}</span></div>
                                  <div class="talent-exam-rtitle ft14 fw6 color2" v-if="item.doStatus == 3">客服跟进<span>{{item.ename?item.ename:'--'}}</span></div>
                                  <div class="talent-exam-rtitle ft14 fw6 color2" v-if="item.doStatus == 4">转至专家处理<span>{{item.ename?item.ename:'--'}}</span></div>
                                  <div class="talent-exam-rtitle ft14 fw6 color2" v-if="item.doStatus == 5">处理结果<span>{{item.ename?item.ename:'--'}}</span></div>
                                  <div class="talent-exam-rtitle ft14 fw6 color2" v-if="item.doStatus == 6">等待评价<span>{{item.ename?item.ename:'--'}}</span></div>
                                  <div class="talent-exam-rtitle ft14 fw6 color2" v-if="item.doStatus == 7">客服再次受理</div>
                                  <div class="talent-exam-rtitle ft14 fw6 color2" v-if="item.doStatus == 8">专家再次受理<span>{{item.ename?item.ename:'--'}}</span></div>
                                  <div class="talent-exam-rtitle ft14 fw6 color2" v-if="item.doStatus == 9">已评价</div>
                                  <div class="talent-exam-rtitle ft14 fw6 color2" v-if="item.doStatus == 10">超时未评价</div>
                                  <div class="talent-exam-rtitle ft14 fw6 color2" v-if="item.doStatus == 11">问题补充<span>{{item.ename?item.ename:'--'}}</span></div>
                                  <div class="talent-exam-rcont ft14 fw4 color4">{{item.content !== null?item.content:'--'}}</div>
                                  <div class="talent-exam-expert ft14 fw6 color2"></div>
                                </div>
                              </el-row>
                          </el-col>
                        </el-row>
                      </el-row>
                    </el-row>
                    <div class="zwsj" v-else>
                      <img :src="zwsjImg" alt=""><br />
                      暂无反馈信息~
                    </div>
                  </el-col>
                </el-row>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="雇员" name="third">
              <el-row class="order100">
                <el-row class="pdl28" style="padding-top:.09rem;">
                  <el-row class="orderTab-lt" style="margin-bottom:0;">
                    <el-row class="orderTab-lthd">面试</el-row>
                  </el-row>
                  <el-row class="order-interview">
                    <span class="order-interview-list" v-if="interviewlist3 && interviewlist3.length > 0">
                      <el-col :span="8" class="flexbox align-items-center" v-for="(item,index) in interviewlist3" :key="index">
                        <img :src="getcommonFun.errorimg" alt="" class="iv1" v-if="!item.headImg">
                        <img :src="item.headImg | imgFormat" alt="" class="iv1" v-else>
                        <el-row class="flex1">
                          <p>雇员：{{item.name}}</p>
                          <p>面试时间：{{item.time}}</p>
                        </el-row>
                        <span class="order-interview-chat">
                          <img :src="chatImg" alt="" class="">
                        </span>
                        <span class="order-interview-del" @click="delClick(item.cid, item.oid, item.wid, item.time,item.name)">
                          <img :src="dlImg" alt="" class="">
                        </span>
                      </el-col>
                    </span>
                    <el-button class="add-interview" @click="handleAddInterview" v-if="!getOrder.orderDemandCommon.agreementId">添加面试</el-button>
                  </el-row>
                  <el-row class="orderTab-lt">
                    <el-row class="orderTab-lthd">雇员信息</el-row>
                  </el-row>
                  <el-row v-if="JSON.stringify(serviceList) == '{}'">
                    <div class="zwsj">
                      <img :src="zwsjImg" alt=""><br />
                      暂无信息~
                    </div>
                  </el-row>
                  <el-row class="orderTab-bt" v-else>
                      <el-col :span="7">
                        <el-row><span>工作性质：</span>{{serviceList.workProp == 0?'白班':'住家'}}</el-row>
                        <el-row v-if="serviceList.workdayStartTime == null || serviceList.workdayEndTime == null || serviceList.workdayStartTime == '' || serviceList.workdayEndTime == ''"><span >上班时间：</span>--</el-row>
                        <el-row v-else><span>上班时间：</span>{{serviceList.workdayStartTime}}——{{serviceList.workdayEndTime}}</el-row>
                        <el-row><span>工作时间：</span>{{serviceList.workTime == null || serviceList.workTime == '' ?'--':serviceList.workTime}}</el-row>
                      </el-col>
                      <el-col :span="8">
                        <el-row><span>签约时间：</span>{{serviceList.workerSignTime !== null?serviceList.workerSignTime:'--'}}</el-row>
                        <el-row v-if="serviceList.startTime != null && serviceList.endTime != null"><span>服务期限：</span>{{(serviceList.startTime+'').substr(0,11)}}——{{(serviceList.endTime+'').substr(0,11)}}</el-row>
                        <el-row v-if="serviceList.startTime == null && serviceList.endTime == null"><span>服务期限：</span>--</el-row>
                        <el-row v-if="serviceList.startTime != null && serviceList.endTime == null"><span>服务期限：</span>{{(serviceList.startTime+'').substr(0,11)}}—— 长期</el-row>
                        <el-row v-if="serviceList.startTime == null && serviceList.endTime != null"><span>服务期限：</span>--</el-row>
                      </el-col>
                      <el-col :span="9">
                        <el-row>
                          <span v-if="serviceList.payType == 1">代付工资日期：</span>
                          <span v-else>工资支付日期：</span>
                          {{serviceList.payTime !== null?'每月'+serviceList.payTime+'日':'--'}}
                        </el-row>
                      </el-col>
                  </el-row>
                  <el-row class="pdr28" v-if="serviceList.workers && serviceList.workers.length> 0">
                    <el-table :data="serviceList.workers" border style="width: 100%" class="interview-table">
                      <el-table-column>
                        <template slot="header">
                          雇员
                          <el-button class="termination" v-if="getOrder.orderDemandCommon.serviceStatus == 5">解约合同</el-button>
                        </template>
                        <template slot-scope="scope">
                          <img :src="getcommonFun.errorimg" alt="" class="i1" v-if="scope.row.headImg == null || scope.row.headImg == ''">
                          <img :src="scope.row.headImg | imgFormat" alt="" class="i1" v-else>
                          <span class="color3">
                            {{scope.row.name}}
                          </span>
                          <img :src="chatImg" alt="" class="i2">
                        </template>
                      </el-table-column>
                      <el-table-column prop="workPay" label="雇员工资（元/月）">
                        <template slot-scope="scope">
                          <span class="color3">
                            {{scope.row.workPay}}
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="contract" label="合同">
                        <template slot-scope="scope">
                          <img :src="contractImg" alt="" class="i3">
                          <span class="color3">
                            {{scope.row.gid}}
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="" label="工资结算状况" v-if="serviceList.payType == 1" key="daifu">
                        <template>
                          <span class="color3">
                            已结清
                          </span>
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-row class="renewal-btn">
                      <el-button class="renewal" v-if="getOrder.orderDemandCommon.serviceStatus == 6" @click="addEmployee3">立即续签</el-button>
                      <el-button class="match" v-if="getOrder.orderDemandCommon.serviceStatus == 5" @click="matchClick">重新匹配</el-button>
                    </el-row>
                  </el-row>
                  <el-row class="orderTab-lt" style="margin-top:.3rem">
                    <el-row class="orderTab-lthd">历史雇员</el-row>
                  </el-row>
                  <el-row class="pdr28" v-if="serviceList.workersHistory && serviceList.workersHistory.length> 0">
                    <el-table :data="serviceList.workersHistory" border style="width: 100%" class="interview-table">
                      <el-table-column prop="date" label="服务时间" width="225">
                        <template slot-scope="scope">
                          <span class="color3">
                            {{scope.row.serviceStartTime}}——{{scope.row.serviceEndTime}}
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="name" label="雇员">
                        <template slot-scope="scope">
                          <el-popover trigger="hover" placement="bottom">
                            <div class="pd10 color5">工资：{{scope.row.workPay}}元</div>
                            <img :src="scope.row.headImg | imgFormat" alt="" class="i1" slot="reference">
                          </el-popover>
                          <span class="color3">
                            {{scope.row.name}}
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="contract" label="合同">
                        <template slot-scope="scope">
                          <img :src="contractImg" alt="" class="i3">
                          <span class="color3">
                            {{scope.row.contract}}
                          </span>
                          <a href="javascript:void(0);" class="lk">查看</a>
                          <a href="javascript:void(0);" class="lk">下载</a>
                        </template>
                      </el-table-column>
                      <el-table-column prop="contract2" label="出户单">
                        <template slot-scope="scope">
                          <img :src="contractImg" alt="" class="i3">
                          <span class="color3">
                            {{scope.row.contract2}}
                          </span>
                          <a href="javascript:void(0);" class="lk">查看</a>
                          <a href="javascript:void(0);" class="lk">下载</a>
                        </template>
                      </el-table-column>
                      <el-table-column prop="relieve" label="解除理由">
                        <template slot-scope="scope">
                          <el-popover trigger="hover" placement="bottom">
                            <div class="pd10 color3">{{scope.row.reason}}</div>
                            <span class="color3 ellips" style="display:block;" slot="reference">
                              {{scope.row.reason}}
                            </span>
                          </el-popover>
                        </template>
                      </el-table-column>
                      <el-table-column prop="settlement" label="工资结算状况" v-if="serviceList.payType == 1" key="daifu2">
                        <template slot-scope="scope">
                          <span class="orange1" v-if="scope.row.settlement == 0">
                            结算中
                          </span>
                          <span class="color3" v-if="scope.row.settlement == 1">
                            已结清
                          </span>
                          <a href="javascript:void(0);" class="lk mx">明细</a>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-row>
                  <div class="zwsj" v-else>
                    <img :src="zwsjImg" alt=""><br />
                    暂无反馈信息~
                  </div>
                </el-row>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="支付" name="fourth">
              <el-row class="order100">
                <el-row class="pdl28" style="padding-top:.09rem;">
                  <el-row class="orderTab-lt">
                    <el-row class="orderTab-lthd">支付详情</el-row>
                  </el-row>
                  <el-row class="orderTab-bt">
                      <!-- 无后续服务 -->
                      <el-col :span="9" v-if="serviceRadio2 == 0">
                        <el-row><span>签约日期：</span>{{customerSignTime}}</el-row>
                        <el-row><span>前期服务费：</span>{{getOrder.orderDemandCommon.servicePay}}元</el-row>
                      </el-col>
                      <!-- 有后续服务-平台代付 -->
                      <el-col :span="9" v-if="serviceRadio2 == 1 && serviceRadio3 == 1">
                        <el-row><span>签约日期：</span>{{customerSignTime}}</el-row>
                        <el-row><span>前期服务费：</span>{{getOrder.orderDemandCommon.servicePay}}元 <i class="bg-status bg-theme2" v-if="paystatus == 3">已支付</i></el-row>
                        <el-row><span>每月服务费：</span>{{serviceMonthPay}}元</el-row>
                        <el-row><span>雇员月工资：</span>{{getOrder.orderDemandCommon.workPay}}元</el-row>
                      </el-col>
                      <el-col :span="9" v-if="serviceRadio2 == 1 && serviceRadio3 == 1">
                        <el-row><span style="opacity:0;">--</span></el-row>
                        <el-row><span>工资代付日期：</span>每月{{payTime}}号</el-row>
                      </el-col>
                      <!-- 有后续服务-直接支付给雇员 -->
                      <el-col :span="9" v-if="serviceRadio2 == 1 && serviceRadio3 == 0">
                        <el-row><span>签约日期：</span>{{customerSignTime}}</el-row>
                        <el-row><span>前期服务费：</span>{{getOrder.orderDemandCommon.servicePay}}元</el-row>
                        <el-row><span>每月服务费：</span>{{serviceMonthPay}}元</el-row>
                      </el-col>
                  </el-row>
                  <el-row class="orderTab-lt">
                    <el-row class="orderTab-lthd">月收支明细</el-row>
                  </el-row>
                  <el-row class="orderTab-bt">
                      <el-col :span="9">
                        <!-- 无后续服务 -->
                        <el-row v-if="serviceRadio2 == 0">
                          <span>支付金额：</span>
                          <b>{{totalPay}}元</b>
                          <i class="bg-status bg-orange1" v-if="paystatus == 2">待支付</i>
                          <i class="bg-status bg-orange1" v-if="paystatus == 1">待审核</i>
                          <i class="bg-status bg-theme2" v-if="paystatus == 3">已支付</i>
                        </el-row>
                        <!-- 有后续服务-平台代付 -->
                        <el-row v-if="serviceRadio2 == 1 && serviceRadio3 == 1">
                          <span>支付金额：</span>
                          <b>{{totalPay}}元</b>
                          <i class="bg-status bg-orange1" v-if="paystatus == 2">待支付</i>
                          <i class="bg-status bg-orange1" v-if="paystatus == 1">待审核</i>
                          <i class="bg-status bg-theme2" v-if="paystatus == 3">已支付</i>
                        </el-row>
                        <el-row v-if="serviceRadio2 == 1 && serviceRadio3 == 1 && paystatus != 2">
                          <span>雇主余额：</span>{{currentBalance}}元
                        </el-row>
                        <!-- 有后续服务-直接支付给雇员 -->
                        <el-row v-if="serviceRadio2 == 1 && serviceRadio3 == 0">
                          <span>支付金额：</span>
                          <b>{{totalPay}}元</b>
                          <i class="bg-status bg-orange1" v-if="paystatus == 2">待支付</i>
                          <i class="bg-status bg-orange1" v-if="paystatus == 1">待审核</i>
                          <i class="bg-status bg-theme2" v-if="paystatus == 3">已支付</i>
                        </el-row>
                      </el-col>
                      <el-col :span="9" v-if="serviceRadio2 == 1 && serviceRadio3 == 0 || serviceRadio2 == 1 && serviceRadio3 == 1 || serviceRadio2 == 0">
                        <el-row>
                          <span>支付方式：  </span>
                          <!-- <b @click="offlineClick" v-if="serviceRadio2 == 1 && serviceRadio3 == 0" style="cursor:pointer;">线下支付</b> -->
                          <b v-if="serviceRadio2 == 1 && serviceRadio3 == 0" style="cursor:pointer;">线下支付</b>
                          <b v-else-if="serviceRadio2 == 1&&serviceRadio3==1">平台代付</b>
                          <b v-else>线上支付</b>
                        </el-row>
                      </el-col>
                  </el-row>
                  <el-row class="pdr28">
                    <el-table :data="payData" border style="width: 100%" class="interview-table" :cell-class-name="cellName" v-if="serviceRadio2 == 1 || serviceRadio2 == 0">
                      <el-table-column v-if="serviceRadio2 == 1 && serviceRadio3 == 0 || serviceRadio2 == 1 && serviceRadio3 == 1 ||
                       serviceRadio2 == 0" key="head" width="180px">
                        <template slot="header">
                          雇主支付日期
                        </template>
                        <template slot-scope="scope">
                          <div class="flexbox align-items-center">
                            <el-popover trigger="hover" placement="bottom">
                              <!-- 支付宝支付 微信支付  招商银行（7782） 线下支付-->
                              <div class="pd10 color1">支付方式：支付宝支付</div>
                              <img :src="persImg" alt="" class="i1" slot="reference">
                            </el-popover>
                            <p class="flexauto">
                              <span class="ft14 color4">合同编号：{{getOrder.orderDemandCommon.agreementId}}</span><br />
                              <span class="color3" v-if="paystatus != 2">{{scope.row.payTime}}</span>
                            </p>
                          </div>
                        </template>
                      </el-table-column>
                      <!-- 无后续服务 -->
                      <el-table-column prop="salary" label="前期服务费（元）" v-if="serviceRadio2 == 0" key="salary" width="120px">
                        <template slot-scope="scope">
                          <span class="f081" v-if="paystatus != 2">{{scope.row.servicePay}}</span>
                        </template>
                      </el-table-column>
                      <!-- 有后续服务-直接支付给雇员 -->
                      <el-table-column prop="salary" label="每月服务费（元）" v-if="serviceRadio2 == 1 && serviceRadio3 == 0 || serviceRadio2 == 1 && serviceRadio3 == 1" 
                      key="salary2" width="120px">
                        <template slot-scope="scope">
                          <span class="f081" v-if="paystatus != 2">{{scope.row.servicePay}}</span>
                          <!-- <el-input v-model="mdsalary" class="bd" v-if="!scope.row.mdShow"></el-input> -->
                        </template>
                      </el-table-column>
                      <!-- 无后续服务/有后续服务-直接支付给雇员 -->
                      <el-table-column prop="approve" label="审批" v-if="serviceRadio2 == 0 || serviceRadio2 == 1 && serviceRadio3 == 0" key="approve">
                        <template slot-scope="scope">
                          <span class="" v-if="paystatus == 2">待支付</span>
                          <span class="orange1" v-if="paystatus == 1">待审核</span>
                          <span class="color3" v-if="paystatus == 3">{{scope.row.eName}}</span>
                        </template>
                      </el-table-column>
                      <!-- 有后续服务-平台代付 -->
                      <el-table-column label="雇员工资（元）" v-if="serviceRadio2 == 1 && serviceRadio3 == 1" key="collect">
                        <el-table-column prop="Collection" label="收款" width="80">
                          <template slot-scope="scope">
                            <span class="cf526" v-if="paystatus != 2">
                              {{scope.row.workPay}}
                            </span>
                          </template>
                        </el-table-column>
                        <el-table-column prop="payoff" label="支付" width="80">
                          <template slot-scope="scope">
                            <span class="cf526" v-if="paystatus != 2">{{scope.row.workPay}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column prop="balance" label="余额" width="80">
                          <template slot-scope="scope">
                            <span class="cf526" :class="scope.row.currentBalance > 0?'f404':''" v-if="paystatus != 2">{{scope.row.currentBalance}}</span>
                          </template>
                        </el-table-column>
                      </el-table-column>
                      <el-table-column prop="approve" label="审批" v-if="serviceRadio2 == 1 && serviceRadio3 == 1" key="ap" width="80px">
                        <template slot-scope="scope">
                          <span class="" v-if="paystatus == 2"></span>
                          <el-row v-if="paystatus == 1">
                            <p>
                              <span style="color:#d6d6d6;margin-right:.05rem;">收</span>
                              <span class="orange1">待审核</span>
                            </p>
                            <p>
                              <span style="color:#d6d6d6;margin-right:.05rem;">支</span>
                              <span class="color3"></span>
                            </p>
                          </el-row>
                          <el-row v-if="paystatus == 3">
                            <p>
                              <span style="color:#d6d6d6;margin-right:.05rem;">收</span>
                              <span class="color3">{{scope.row.eName}}</span>
                            </p>
                            <p>
                              <span style="color:#d6d6d6;margin-right:.05rem;">支</span>
                              <span class="color3">{{scope.row.eName}}</span>
                            </p>
                          </el-row>
                        </template>
                      </el-table-column>
                      <el-table-column prop="date2" label="平台代付日期" v-if="serviceRadio2 == 1 && serviceRadio3 == 1" key="dt">
                        <template slot-scope="scope">
                          <el-popover trigger="hover" placement="bottom">
                            <div class="pd10">
                              雇员：{{scope.row.workerName}}<br />
                              薪资：{{scope.row.workPay}}元
                            </div>
                            <img :src="scope.row.workerHeadImg" alt="" class="i1" slot="reference">
                          </el-popover>
                          <span class="" v-if="paystatus != 2">{{scope.row.payTime}}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                    <div class="zwsj" v-else>
                      <img :src="zwsjImg" alt=""><br />
                      暂无数据
                    </div>
                  </el-row>
                </el-row>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="操作日志" name="fifth">
              <el-row class="order100">
                <el-row style="padding:.15rem .2rem;">
                  <div class="talent-all clearfix" style="margin-bottom:0;">
                    <span class="sp1" :class="getOrderFlag4?'on':''" @click="opClick(true)">操作日志</span>
                    <span class="sp2" :class="getOrderFlag4?'':'on'" @click="opClick(false)">资金动向</span>
                  </div>
                </el-row>
                <el-row class="opration-cont" v-if="getOrderFlag4">
                  <el-row class="opration" v-for="item in logList" :key="item.id">
                    <el-row class="opration-date">{{item.createTime&&item.createTime.slice(0,10)}}</el-row>
                    <el-row class="opration-list">
                      <el-row class="opration-left">
                        <el-row class="opration-time">{{item.createTime&&item.createTime.slice(11)}}</el-row>
                        <el-row class="opration-img">
                          <img :src="opimg" alt="">
                        </el-row>
                        <el-row class="opration-line"></el-row>
                      </el-row>
                      <el-row class="opration-right">
                        <el-row class="opration-rtitle">
                          {{getLogTypes(item.type)}}
                          <span>{{item.name}}</span>
                        </el-row>
                        <el-row class="opration-rcont">{{item.description}}</el-row>
                      </el-row>
                    </el-row>
                  </el-row>
                </el-row>
                <el-row class="opration-cont" v-if="!getOrderFlag4">
                  <el-row class="opration">
                    <el-row class="opration-date">星期三  2020年09月27日</el-row>
                    <el-row class="opration-list on">
                      <el-row class="opration-left">
                        <el-row class="opration-time">11:34</el-row>
                        <el-row class="opration-img">
                          <img :src="opimg2" alt="">
                        </el-row>
                        <el-row class="opration-line"></el-row>
                      </el-row>
                      <el-row class="opration-right">
                        <el-row class="opration-rtitle">
                          手动录入12000元
                          <span>财务娜娜</span>
                        </el-row>
                        <el-row class="opration-rcont">
                          前期服务费：2000元 <br />
                          每月服务费：2000元 <br />
                          雇员月工资：4000元；<br />
                          变更为；<br />
                          雇员工资：8000元
                        </el-row>
                      </el-row>
                    </el-row>
                    <el-row class="opration-list on">
                      <el-row class="opration-left">
                        <el-row class="opration-time">11:34</el-row>
                        <el-row class="opration-img">
                          <img :src="opimg2" alt="">
                        </el-row>
                        <el-row class="opration-line"></el-row>
                      </el-row>
                      <el-row class="opration-right">
                        <el-row class="opration-rtitle">
                          手动录入12000元
                          <span>财务娜娜</span>
                        </el-row>
                        <el-row class="opration-rcont">
                          前期服务费：2000元 <br />
                          每月服务费：2000元 <br />
                          雇员月工资：4000元；<br />
                          变更为；<br />
                          雇员工资：8000元
                        </el-row>
                      </el-row>
                    </el-row>
                  </el-row>
        
                  <!-- <Page :currentPage="currentPage" :pageSize="pageSize" :total="total" @changePage="changePage"></Page> -->
                </el-row>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="发票" name="sixth" v-if="getOrder.orderDemandCommon.invoiceId">
              <el-row class="order100">
                <el-row class="pdl28" style="padding-top:.09rem;">
                  <el-row class="orderTab-lt">
                    <el-row class="orderTab-lthd">
                      发票信息
                      <el-row class="invoice">
                        发票状态： 
                        <!-- 0 默认申请 1可以开票 2已开票 3未邮寄 4已邮寄 5作废 -->
                        <el-button  @click="mdinvoice(invoice.invoiceId,4)" v-if="invoice.status == 3">未邮寄</el-button>
                        <el-button class="on" v-if="invoice.status == 4"> 已寄出 </el-button>
                        <span v-if="invoice.status != 3 || invoice.status != 4 ">--</span>
                      </el-row>
                    </el-row>
                  </el-row>
                  <el-row class="invoice-list">
                    <el-col>
                      <span>抬头类型：</span> {{invoice.type == 1?'企业':invoice.type == 2?'个人':'--'}}
                    </el-col>
                    <el-col>
                      <span>公司名称： </span> {{invoice.company?invoice.company:'--'}}
                    </el-col>
                    <el-col>
                      <span>公司税号： </span> {{invoice.code?invoice.code:'--'}}
                    </el-col>
                  </el-row>
                  <el-row class="orderTab-lt">
                    <el-row class="orderTab-lthd">
                      邮寄信息
                    </el-row>
                  </el-row>
                  <el-row class="invoice-list">
                    <el-col>
                      <span>姓名：</span>{{invoice.name?invoice.name:'--'}}
                    </el-col>
                    <el-col>
                      <span>联系方式： </span>{{invoice.phone?invoice.phone:'--'}}
                    </el-col>
                    <el-col>
                      <span>邮寄地址： </span>{{invoice.address?invoice.address:'--'}}
                    </el-col>
                  </el-row>
                </el-row>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-row>
        <!-- 添加雇员 -->
        <el-row class="addEmployee" :class="emshow1?'on':''">
          <el-row class="employHidden scrollbar">
          <el-row class="employSearch">
            <el-input v-model="employSearchText" placeholder="编号、姓名、关键字搜索" @input="changeCurrent">
              <i slot="prefix" class="el-input__icon" :style="{'backgroundImage': 'url(' + searchImg + ')'}"></i>
            </el-input>
          </el-row>
          <el-row class="employSearchList">
            <ul v-if="searchList2.length > 0">
              <li class="flexbox align-items-center" :class="currentIndex == index?'on':''" 
                  v-for="(item,index) in searchList2" :key="index" @click="searchClick(item,index)">
                <span class="dot"></span>
                <img :src="item.headImg | imgFormat" alt="">
                <span class="employSname ft16 color3">
                  <i class="ft18 color1">{{item.name}}</i><br />
                  {{item.typeName + 'T' + item.level+'级'}}
                </span>
              </li>
            </ul>
            <div class="ft14 color1" v-else>暂无数据</div>
          </el-row>
          <el-button @click="employeeCancel" class="employCancel">取消</el-button>
          <el-button @click="employeeConfirm" class="employConfirm" v-if="searchList2.length > 0">添加</el-button>
          </el-row>
        </el-row>
        <!-- 添加合同 -->
        <el-row class="addEmployee add-frame hd" :class="emshow2?'on':''">
          <el-row class="employContract scrollbar">
            <el-row class="add-contract-title flexbox align-items-center">
              <img :src="contractImg" alt="" class="emctimg">
              <div class="add-contract-txt flexauto">
                <p>家庭雇佣居间协议</p>
                合同编号：{{odlist.id||'--'}}
              </div>
            </el-row>
            <el-row class="add-contract-cont">
              <el-row class="add-contract-list flexbox align-items-center">
                <span class="add-contract-serve ft14 color1">服务方式</span>
                  <el-radio-group v-model="serviceRadio" @change="changeServe">
                    <el-radio label="1">住家</el-radio>
                    <el-radio label="0">白班</el-radio>
                  </el-radio-group>
              </el-row>
              <el-row class="add-contract-list flexbox align-items-center" v-if="serviceRadio == 0">
                <span class="add-contract-serve ft14 color1">上班时间</span>
                <el-row class="add-contract-time flexauto">
                  <el-time-select
                    v-model="time1"
                    :picker-options="{
                      start: '08:00',
                      step: '00:15',
                      end: '20:00',
                      maxTime: time2
                    }"
                    placeholder="选择时间">
                  </el-time-select>
                  <span class="hline"></span>
                  <el-time-select
                    v-model="time2"
                    :picker-options="{
                      start: '08:00',
                      step: '00:15',
                      end: '20:00',
                      minTime: time1
                    }"
                    placeholder="选择时间">
                  </el-time-select>
                </el-row>
              </el-row>
              <el-row class="add-contract-list flexbox align-items-center" v-if="serviceRadio == 1 || serviceRadio == 0">
                <span class="add-contract-serve ft14 color1">工作时间</span>
                <el-row class="add-contract-time hd flexauto">
                  <el-input v-model="wtime" class="" placeholder="无休/做六休一"></el-input>
                </el-row>
              </el-row>
              <el-row class="add-contract-list flexbox align-items-center" style="margin-top:.4rem;">
                <span class="add-contract-serve ft14 color1">后续服务</span>
                  <el-radio-group v-model="serviceRadio2" @change="changeServe2">
                    <el-radio label="1">有</el-radio>
                    <el-radio label="0">无</el-radio>
                  </el-radio-group>
              </el-row>
              <el-row class="add-contract-list flexbox align-items-center" v-if="serviceRadio2 == 1 || serviceRadio2 == 0">
                <span class="add-contract-serve ft14 color1">开始时间</span>
                <el-row class="add-contract-time hd flexauto">
                  <el-date-picker v-model="startTime" type="date" placeholder="选择时间" class="stime" value-format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
                </el-row>
              </el-row>
              <el-row class="add-contract-list flexbox align-items-center" v-if="serviceRadio2 == 0">
                <span class="add-contract-serve ft14 color1">结束时间</span>
                <el-row class="add-contract-time hd flexauto">
                  <el-date-picker v-model="endTime" type="date" placeholder="选择时间" class="stime" value-format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
                </el-row>
              </el-row>
              <el-row style="margin-top:.4rem;"></el-row>
              <el-row class="add-contract-list flexbox align-items-center" style="margin-bottom:0;" v-if="serviceRadio2 == 1">
                <span class="add-contract-serve ft14 color1">工资支付方式</span>
              </el-row>
              <el-row class="add-contract-list flexbox align-items-center" v-if="serviceRadio2 == 1">
                  <el-radio-group v-model="serviceRadio3" @change="changeServe3">
                    <el-radio label="0">直接支付给雇员</el-radio>
                    <el-radio label="1">平台代付</el-radio>
                  </el-radio-group>
              </el-row>
              <el-row class="add-contract-list flexbox align-items-center" v-if="serviceRadio3 == 0 || serviceRadio3 == 1 || serviceRadio2 == 0">
                <span class="add-contract-serve ft14 color1">前期服务费</span>
                <el-row class="add-contract-time hd flexauto">
                  <el-input v-model="serviceCharge1" class="" placeholder=""></el-input>
                </el-row>
                <span class="add-contract-serve ft14 color1 mr">元</span>
              </el-row>
              <el-row class="add-contract-list flexbox align-items-center" v-if="serviceRadio2 == 1  && serviceRadio3 == 0 || serviceRadio2 == 1  && serviceRadio3 == 1">
                <span class="add-contract-serve ft14 color1">每月服务费</span>
                <el-row class="add-contract-time hd flexauto">
                  <el-input v-model="serviceCharge2" class="" placeholder=""></el-input>
                </el-row>
                <span class="add-contract-serve ft14 color1 mr">元</span>
              </el-row>
              <el-row class="add-contract-list flexbox align-items-center" v-if="serviceRadio3 == 0 || serviceRadio3 == 1 || serviceRadio2 == 0">
                <span class="add-contract-serve ft14 color1">雇员月工资</span>
                <el-row class="add-contract-time hd flexauto">
                  <el-input v-model="serviceCharge3" class="" placeholder=""></el-input>
                </el-row>
                <span class="add-contract-serve ft14 color1 mr">元/月</span>
              </el-row>
              <!-- <el-row class="add-contract-list flexbox align-items-center" v-if="serviceRadio2 == 0 || serviceRadio3 == 0 || serviceRadio3 == 1">
                <span class="add-contract-serve ft14 color1" v-if="serviceRadio2 == 1 && serviceRadio3 == 0 || serviceRadio2 == 0">工资支付日期</span>
                <span class="add-contract-serve ft14 color1" v-if="serviceRadio2 == 1 && serviceRadio3 == 1">代付工资日期</span>
                <el-row class="add-contract-time hd flexauto">
                  <el-popover trigger="click" placement="bottom-start" v-model="chargeShow">
                  <div class="contract-show-time">
                    <ul class="clearfix">
                      <li :class="cidx == index?'on':''" v-for="(item,index) in 31" :key="index" @click="changeDate(item,index)">{{item}}</li>
                    </ul>
                  </div>
                  <el-input v-model="serviceCharge4" class="" placeholder="每月31日" slot="reference"></el-input>
                  </el-popover>
                </el-row>
              </el-row> -->
              <el-row class="add-contract-list flexbox align-items-center" style="margin-top:.4rem;margin-bottom:0;" v-if="serviceRadio2 == 1 || serviceRadio2 == 0">
                <span class="add-contract-serve ft14 color1">家政保险</span>
                  <el-radio-group v-model="serviceRadio4" @change="changeServe4">
                    <el-radio label="1" disabled>雇主买</el-radio>
                    <el-radio label="2" disabled>雇员买</el-radio>
                  </el-radio-group>
              </el-row>
              <el-row class="add-contract-list flexbox align-items-center" v-if="serviceRadio2 == 1 || serviceRadio2 == 0">
                  <el-checkbox v-model="checkList" @change="changeServe5" disabled>家政意外险</el-checkbox>
                  <el-checkbox v-model="checkList2" @change="changeServe6" disabled>社会保险</el-checkbox>
              </el-row>
              <el-button @click="employeeCancel2" class="employCancel">取消</el-button>
              <el-button @click="employeeConfirm2" class="employConfirm">添加</el-button>
            </el-row>
          </el-row>
        </el-row>
        <!-- 雇员-解约合同 -->
        <el-row class="addEmployee hd" :class="emshow3?'on':''">
          <el-row class="employContract scrollbar">
            <el-row class="add-contract-title flexbox align-items-center">
              <img :src="contractImg" alt="" class="emctimg">
              <div class="add-contract-txt flexauto">
                <p>{{getOrder.orderDemandCommon.workerName}}雇员出户确认单</p>
                编号：{{getOrder.orderDemandCommon.agreementId}}
              </div>
            </el-row>
            <el-row class="add-contract-cont">
              <el-row class="add-contract-list flexbox align-items-center">
                <span class="add-contract-serve ft14 color1">退还雇主费用</span>
                <el-row class="add-contract-time hd flexauto">
                  <el-input v-model="gbackValue1" class="" placeholder=""></el-input>
                </el-row>
                <span class="add-contract-serve ft14 color1 mr">元</span>
              </el-row>
              <el-row class="add-contract-list flexbox align-items-center">
                <span class="add-contract-serve ft14 color1">结算雇员工资</span>
                <el-row class="add-contract-time hd flexauto">
                  <el-input v-model="gbackValue2" class="" placeholder=""></el-input>
                </el-row>
                <span class="add-contract-serve ft14 color1 mr">元</span>
              </el-row>
              <el-button @click="gbackCancle" class="employCancel">取消</el-button>
              <el-button @click="gbackConfirm" class="employConfirm">{{gbackValue1 > 0 || gbackValue2 > 0?'提交审核':'确认'}}</el-button>
            </el-row>
          </el-row>
        </el-row>
      </el-row>
    </el-drawer>
    <!-- 设为无效订单 -->
    <HandleDialog
                  :invalidList="invalidList"
                  :setTitle="setTitle"
                  :bdcolor2="bdcolor2"
                  @resetOrder="resetOrder"
                  @submitOrder="submitOrder"
                  @changeInvalid="changeInvalid"
                  @changeBorder="changeBorder"
                  ref="dialog1"
    />
    <!-- 设为丢失订单 -->
    <HandleDialog 
                  :invalidList="invalidList2"
                  :setTitle="setTitle"
                  @resetOrder="resetOrder"
                  @submitOrder="submitOrder"
                  @changeInvalid="changeInvalid"
                  @changeBorder="changeBorder"
                  ref="dialog2"
    />
    <!-- 设为处理订单 -->
    <HandleDialog 
                  :invalidList="invalidList"
                  :setTitle="setTitle"
                  @resetOrder="resetOrder"
                  @submitOrder="submitOrder"
                  @changeInvalid="changeInvalid"
                  @changeBorder="changeBorder"
                  ref="dialog3"
    />
    <!-- 面试 -->
    <el-dialog title="面试" :visible.sync="orderInterviewDialog" :close-on-click-modal="false" @close="closeInterviewDialog" width="" center class="newRecordAdd addDialog active hd hd2 invalid">
      <el-row class="orderInvalid">
        <el-row class="flexbox" style="margin-bottom:.15rem;">
          面试人员：
          <el-row class="interview-person flexauto">
            <el-autocomplete
              class=""
              v-model="interviewValue"
              :fetch-suggestions="querySearch"
              placeholder="请输入雇员编号、姓名"
              :trigger-on-focus="false"
              @select="handleSelectPerson"
              v-if="interviewShow">
              <template slot-scope="{ item }">
                <div class="interview-name">
                  <img :src="item.headImg | imgFormat" alt="">
                  {{item.name}}
                </div>
              </template>
            </el-autocomplete>
            <el-row class="interview-lt" v-if="!interviewShow">
              <img :src="interviewValue2.headImg | imgFormat" alt="">
              {{interviewValue2.name}}
              <el-button class="el-icon-circle-close" @click="closeInterviewPerson"></el-button>
            </el-row>
          </el-row>
        </el-row>
        <el-row class="flexbox">
        面试时间：
        <el-date-picker class="interview-date flexauto" 
                        v-model="interviewDate"
                        type="datetime"
                        placeholder="请输入面试时间"
                        format="yyyy.MM.dd HH:mm"
                        @change="changeInterviewDate">
        </el-date-picker>
        </el-row>
      </el-row>
      <el-row class="aform-footer">
          <el-button @click="resetOrderInterview">取 消</el-button>
          <el-button @click="submitOrderInterview">提 交</el-button>
      </el-row>
    </el-dialog>
    <!-- 线下支付 -->
    <el-dialog title="线下收款" :visible.sync="offlineDialog" :close-on-click-modal="false" @close="closeOfflineDialog" width="" center class="newRecordAdd addDialog active hd hd2 invalid">
      <el-row class="orderInvalid flexbox">
        收款金额：<el-input type="number" v-model="totalPay" placeholder="输入收款金额" class="offlineipt flexauto" :class="bdcolor?'bdcolor':''" 
        @focus="bdcolor = true" @blur="bdcolor = false" disabled></el-input>
      </el-row>
      <el-row class="aform-footer">
          <el-button @click="resetOffline">取 消</el-button>
          <el-button @click="submitOffline">提交审核</el-button>
      </el-row>
    </el-dialog>
    <!-- 雇员-解约合同 -->
    <el-dialog title="解约/终止原因" :visible.sync="tmDialog" :close-on-click-modal="false" @close="closeTmDialog" width="" center class="newRecordAdd addDialog active hd hd2 invalid">
      <el-row class="orderInvalid flexbox">
        <el-input type="textarea" placeholder="请填写解除原因。" v-model="tmTextarea" :rows="4" maxlength="300" show-word-limit></el-input>
      </el-row>
      <el-row class="aform-footer">
          <el-button @click="resetTerm">取 消</el-button>
          <el-button @click="submitTerm">提交</el-button>
      </el-row>
    </el-dialog>
    <!--聊天-->
    <Chat ref="chat" :curUser="targetUser"/>

    <!--智能匹配弹框-->
    <el-dialog title="匹配到的雇员" :visible.sync="showMate" :close-on-click-modal="false" >
    </el-dialog>
  </div>
</template>

<script>
import { publish, match, remark, workers, addWorkers, service, interviewList, 
addInterview, delInterview, getAgreement, addOrModify, getInvoice, modifyInvoice,
 updateStatus, updateExitOrder,getPays,getOperats,questionList,replyAnswer,addOrModifyRenew,updateQuestionList } from '@/api/api'
import Page from '@/components/Page.vue'
import { mapGetters } from 'vuex'
import Chat from '@/components/Chat.vue'
import HandleDialog from './HandleDialog.vue'
import imgurl from '@/utils/common.js'
import { fenImg1,fenImg2,sUrl,contractImg,zwsjImg,persImg,dlImg,opimg,opimg2,callImg,chatImg,imageUrl } from '@/utils/imgConfig.js'
import { contractUrl } from '@/utils/config.js'
  export default {
    name: 'orderProcessDetail',
    components: {
      Page,
      Chat,
      HandleDialog
    },
    props: ['row'],
    data() {
      return {
        row1:{},
        zwsjImg,
        persImg,
        callImg,
        chatImg,
        dlImg,
        contractImg,
        fenImg1,
        fenImg2,
        opimg,
        opimg2,
        searchImg: sUrl,
        imgurl,
        odDetail:{},
        modal:false,
        drawer: false,
        direction: 'rtl',
        disabled:false,
        orderText:'',
        currentIndex: -1,
        reason:"",
        searchList:[],
        searchItem:{},
        show1:true,
        show2:true,
        emshow1: false,
        emshow2: false,
        employSearchText:'',
        odlist: {},
        // 工作性质
        serviceRadio: null,//工作性质 0白班 1住家
        // 后续服务
        serviceRadio2: null,//后续服务 0无 1有-长期
        // 工资支付方式
        serviceRadio3: 2,// 0直接支付给雇员 1平台代付 2无服务
        // 家政保险
        serviceRadio4: '2',//家政保险 1雇主买 2雇员买
        checkList: true,
        checkList2: true,
        time1:'',
        time2:'',
        wtime:'',
        startTime:'',
        endTime:'',
        serviceCharge1:'',
        serviceCharge2:'',
        serviceCharge3:'',
        serviceCharge4:'10',
        activeHsNames:['0'],
        orderTabName: 'first',
        orderInput:'',
        orderInputShow: true,
        placeholder: '请输入回复内容',
        bdcolor: false,
        bdcolor2: false,
        orderTextarea:'',
        sendShow:false,
        remarkList:[],
        // page
        currentPage: 1,
        pageSize: 10,
        total: 25,
        // 订单设置
        setTitle:'',
        invalidList: [
          {
            value: '雇主不需要',
            label: '雇主不需要'
          },
          {
            value: '雇主随意下单',
            label: '雇主随意下单'
          },
          {
            value: '无效假雇主',
            label: '无效假雇主'
          },
          {
            value: '其他',
            label: '其他'
          }
        ],
        invalidList2: [
          {
            value: '雇主近期不考虑',
            label: '雇主近期不考虑'
          },
          {
            value: '价格过高',
            label: '价格过高'
          },
          {
            value: '未满足雇主需求',
            label: '未满足雇主需求'
          },
          {
            value: '联系不上雇主',
            label: '联系不上雇主'
          },
          {
            value: '需求变更',
            label: '需求变更'
          },
          {
            value: '其他',
            label: '其他'
          }
        ],
        // 服务反馈
        ecamList:[],
        currentIndex2: 0,
        number: 0,
        reviewTextarea:'',
        answerArr: [],
        // 面试
        orderInterviewDialog: false,
        interviewValue:'',
        interviewValue2:{},
        interviewShow: true,
        interViewList:[],
        interViewList2:[],
        interviewDate:'',
        // 添加面试列表
        interviewlist3:[],
        serviceList:{},
        // 雇员-解约合同
        tmDialog: false,
        tmTextarea: '',
        emshow3: false,
        gbackValue1: 0,
        gbackValue2: 0,
        // 支付
        paystatus:2,//2待支付，1待审核，3已支付
        // 无后续服务
        payData:[],
        offlineDialog: false,
        offlineValue: '',
        // 订单发票
        invoice:{},
        // 支付单元格编辑
        mdsalary: '',
        // 添加合同---选择今天之后的时间
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;//如果没有后面的-8.64e7就是不可以选择今天的
          }
        },
        chargeShow: false,
        cidx: -1,
        targetUser:{},
        empleeList:[],
        customerSignTime:"",//合同签约日期
        serviceMonthPay:"",//每月服务费
        payTime:"",//工资代付日期
        currentBalance:"",//雇主余额,
        currentPay:"",//本月支付金额
        totalPay:0,//支付金额
        logList:[],//操作日志,
        addType:1,//1添加雇员，2更换雇员,
        contractType:"first",//合同签订类型first第一次,second续签
        serviceType:'1',//1顾问反馈，2专家反馈
        qid:"",//反馈问题id
        contractUrl,
        mateList:[],//智能匹配成功后的列表数据
        showMate:false,//智能匹配对话框显示
      }
    },
    computed:{
      ...mapGetters([
          'getOrder',
          'getUsers',
          'getSysMetaData',
          'getOrderFlag3',
          'getOrderFlag4',
          'getSetStatus'
      ]),
      searchList2() {// search
        const search = this.employSearchText
        if (search) {
          return this.searchList.filter(function(data) {
            return Object.keys(data).some(function(key) {
              return String(data[key]).toLowerCase().indexOf(search) > -1
            })
          })
        }
        return this.searchList;
      }
    },
    watch: {
        row(newVal,oldVal){
            this.row1 = newVal;
            const exp1 = this.row1.orderDemandCommon.startWorkYear !== null || this.row1.orderDemandCommon.endWorkYear?this.row1.orderDemandCommon.startWorkYear + '-' + this.row1.orderDemandCommon.endWorkYear+ '年经验 | ':''
            const exp2 = this.row1.orderDemandCommon.startPrePrice !== null || this.row1.orderDemandCommon.endPrePrice?this.row1.orderDemandCommon.startPrePrice/1000 + '-' + this.row1.orderDemandCommon.endPrePrice/1000+ 'k | ':''
            this.orderInput = this.row1.orderDemandCommon.typeName + ' | ' + exp1 + exp2
        }
    },
    methods: {
      orderDrawer(){
        this.drawer = true
      },
      addEmployee(type){ // 添加雇员按钮点击操作获取雇员列表
        this.emshow1 = true
        this.addType=type
        if(this.emshow2 || this.emshow3) {
          this.emshow2 = false
          this.emshow3 = false
        }
        let params = {
          app: 3,
          cid: '',
          device: 5,
          oid: this.getOrder.orderDemandCommon.id,
          time: '',
          token: this.getUsers.token,
          wid: '',
          workType: this.getOrder.orderDemandCommon.type,
          type:'3'
        }
        workers(params).then(res =>{//获取雇员列表
          if(res.code == 200) {
            this.searchList = res.data
          }
        })
      },
      employeeCancel(){
        this.emshow1 = false
        this.employSearchText = ''
        this.currentIndex = -1
      },
      employeeConfirm(){//添加雇员操作
        let title=this.getOrder.orderDemandCommon.typeName + 'T'+ this.getOrder.orderDemandCommon.startLevel + '-T' + this.getOrder.orderDemandCommon.endLevel
        let params = {
          app: 3,
          cid: '',
          device: 5,
          oid: this.searchItem.oid,
          time: '',
          token: this.getUsers.token,
          wid: this.searchItem.wid,
          workType: this.searchItem.workType,
          type:this.addType,
          title,
          workerName:this.searchItem.name
        }
        addWorkers(params).then(res =>{
          if(res.code == 200) {
            this.$myMessage('success','添加成功')
            this.$emit('updateList')
            this.emshow1 = false
            this.employSearchText = ''
            this.currentIndex = -1
            this.show1 = false
            this.closeDrawer();
          }
        })
      },
      getService(){ // 雇员信息与列表
        let params = {
          app: 3,
          device: 5,
          oid: this.getOrder.orderDemandCommon.id,
          token: this.getUsers.token
        }
        service(params).then(res =>{
          if(res.code == 200){
            this.serviceList = res.data
          }
        })
      },
      getAgreemt(){// 获取家庭居家协议合同信息
        let params = {
          app: 3,
          device: 5,
          id: this.getOrder.orderDemandCommon.id,
          token: this.getUsers.token
        }
        getAgreement(params).then(res =>{
          if(res.code == 200) {
            this.odlist = res.data
          }
        })
      },
      addEmployee2(){//添加，修改合同按钮点击
        this.contractType="first"
        if(!this.getOrder.orderDemandCommon.wid){
            this.$myMessage('error','请先添加雇员')
        }else{
          this.getAgreemt()
          this.emshow2 = true
          if(this.emshow1 || this.emshow3) {
            this.emshow1 = false
            this.emshow3 = false
          }
        }
      },
      addEmployee3(){//续签合同
        this.contractType="second"
        this.getAgreemt()
        this.emshow2 = true
        if(this.emshow1 || this.emshow3) {
          this.emshow1 = false
          this.emshow3 = false
        }
      },
      employeeCancel2(){
        this.emshow2 = false
        this.serviceRadio = null
        this.serviceRadio2 = null
        this.serviceRadio3 = null
        this.serviceRadio4 = null
        this.startTime = ''
        this.endTime = ''
        this.time1 = ''
        this.time2 = ''
        this.wtime = ''
        this.serviceCharge1 = ''
        this.serviceCharge2 = ''
        this.serviceCharge3 = ''
        this.serviceCharge4 = ''
        this.checkList = false
        this.checkList2 = false
        this.cidx = -1
      },
      employeeConfirm2(){//添加合同
        const { contractType }=this
        let contractId=contractType==='first'?this.getOrder.orderDemandCommon.agreementId:this.getOrder.orderDemandCommon.agreementOldId
        let title=this.getOrder.orderDemandCommon.typeName + 'T'+ this.getOrder.orderDemandCommon.startLevel + '-T' + this.getOrder.orderDemandCommon.endLevel
        let params = {
          "app": 3,
          "cid": this.getOrder.orderDemandCommon.cid,
          "content": null,
          "device": 5,
          "endTime": this.endTime == ''?null:this.endTime,
          "followUp": this.serviceRadio2,//后续服务 0无 1有-长期
          "id":contractId||"",//合同编号无是创建，有是修改
          "insurancePay": this.checkList?1:0,//家政意外险 0不够买 1购买
          "insuranceType": this.serviceRadio4,//家政保险 1雇主买 2雇员买
          "nowTime": null,
          "oid": this.getOrder.orderDemandCommon.id,//订单id
          "payTime":"10",
          // "payTime": this.serviceCharge4,//薪酬代发日期 日 1-31数字
          "payType": this.serviceRadio3,// 0直接支付给雇员 1平台代付 2无服务
          "serviceId": this.getOrder.orderDemandCommon.type,
          "serviceMonthPay": this.serviceCharge2,//客户月服务费
          "servicePay": this.serviceCharge1,//客户前期服务费
          "socialSecurityPay": this.checkList2?1:0,//社保 0不够买 1购买
          "startTime": this.startTime == ''?null:this.startTime,
          "token": this.getUsers.token,
          "wid": this.getOrder.orderDemandCommon.wid,//签约阿姨(雇员)ID
          "workPay": this.serviceCharge3,//雇员月工资
          "workProp": this.serviceRadio,//工作性质 阿姨住宿 0白班 1住家
          "workTime": this.wtime == ''?null:this.wtime,
          "workdayEndTime": this.time2 == ''?null:this.time2,
          "workdayStartTime": this.time1 == ''?null:this.time1,
          "title":title
        }
        if(contractType=='first'){
          addOrModify(params).then(res =>{
            if(res.code == 200) {
                this.$myMessage('success', '添加成功');
                this.$emit('updateList')
                this.closeDrawer();
            } else {
              this.$myMessage('error', res.msg);
            }
          })
        }else{
          addOrModifyRenew(params).then(res =>{
            if(res.code == 200) {
                this.$myMessage('error', '续签成功');
                this.$emit('updateList')
                this.closeDrawer();
            } else {
              this.$myMessage('error', res.msg);
            }
          })
        }
        
        this.emshow2 = false
        this.show2 = false
        this.serviceRadio = null
        this.serviceRadio2 = null
        this.serviceRadio3 = null
        this.serviceRadio4 = null
        this.startTime = ''
        this.endTime = ''
        this.time1 = ''
        this.time2 = ''
        this.wtime = ''
        this.serviceCharge1 = ''
        this.serviceCharge2 = ''
        this.serviceCharge3 = ''
        this.serviceCharge4 = ''
        this.checkList = false
        this.checkList2 = false
        this.cidx = -1
      },
      searchClick(item,idx){// search
        this.currentIndex = idx
        this.searchItem = item
      },
      changeCurrent(){
        this.currentIndex = -1
      },
      changeServe(val){// 服务方式
        this.serviceRadio = val
      },
      changeServe2(val2){// 后续服务
        this.serviceRadio2 = val2
      },
      changeServe3(val3){// 工资支付方式
        this.serviceRadio3 = val3
      },
      changeServe4(val4){// 家政保险
        this.serviceRadio4 = val4
      },
      changeServe5(val5){
        this.checkList = val5
      },
      changeServe6(val6){
        this.checkList2 = val6
      },
      changeDate(item, index){
        this.cidx = index
        this.serviceCharge4 = item
        this.chargeShow = false
      },
      terminationClick(){//终止
        this.setTitle = '终止'
        this.tmDialog = true
        this.$store.commit('updateSetStatus', 3)
        if(this.emshow3) {
          this.tmDialog = false
        }
        if(this.emshow1 || this.emshow2){
          this.emshow1 = false
          this.emshow2 = false
        }
      },
      breakClick(){//解约
        this.setTitle = '解约'
        this.tmDialog = true
        this.$store.commit('updateSetStatus', 4)
        if(this.emshow3) {
          this.tmDialog = false
        }
        if(this.emshow1 || this.emshow2){
          this.emshow1 = false
          this.emshow2 = false
        }
      },
      invalidClick(type){// 订单设置
        if(type==='one'){
          this.$refs.dialog1.showDialog = true;
          this.setTitle = '设为无效'
          this.$store.commit('updateSetStatus', 1)
        }else if(type==='two'){
          this.$refs.dialog2.showDialog = true;
          this.setTitle = '设为丢失'
          this.$store.commit('updateSetStatus', 2)
        }else{
          this.$refs.dialog3.showDialog = true;
          this.setTitle = '设为处理'
          this.$store.commit('updateSetStatus', 5)
        }
      },
      changeInvalid(val){
        this.reason=val;
      },
      resetOrder(){
        this.setTitle = ''
      },
      submitOrder(){//更改订单状态
        let params = {
          "app": 3,
          "device": 5,
          "oid": this.getOrder.orderDemandCommon.id,
          "reason":this.reason,
          "token": this.getUsers.token,
          "type": this.getSetStatus,
          "delPid":this.getUsers.id
        }
        updateStatus(params).then(res =>{
          if(res.code == 200) {
            this.closeDrawer()
            this.$emit('updateList')
          }else{
            this.$myMessage('error',res.msg)
          }
          this.setTitle = ''
        })
      },
      orderTabClick(tab, event) {// orderTab点击
        if(tab.name == 'third'){
          // 雇员面试列表
          this.getInterviewList()
          // 合同信息
          this.getAgreemt()
          // 雇员信息与列表
          this.getService()
        }else if(tab.name == 'sixth'){
          this.getInvoice()
        }else if(tab.name=='fourth'){
          this.getPayDetail()
          // if(this.getOrder.orderDemandCommon.agreementId){
          //     this.getPayDetail()
          // }
        }else if(tab.name=='fifth'){
          this.getLogs()
        }else if(tab.name=='second'){
          this.getQuestionList()
        }
      },
      async getPayDetail(){//获取支付详情信息
        let params = {
          oid:this.getOrder.orderId
        }
        const result=await getPays(params);
        if(result.code===200){
          this.serviceRadio2=result.data.followUp
          this.serviceRadio3=result.data.payType
          this.customerSignTime=result.data.customerSignTime
          this.paystatus=result.data.paystatus;
          this.serviceMonthPay=result.data.serviceMonthPay
          this.payTime=result.data.payTime
          this.payData=result.data.payList
          this.currentBalance=result.data.currentBalance
          this.currentPay=result.data.currentPay
          this.totalPay=result.data.serviceMonthPay+result.data.servicePay+result.data.workPay
        }else{
          this.$myMessage('error',result.msg)
        }
      },
      releaseClick(){ // 发布匹配
        let params = {
          app: 3,
          desc: null,
          device: 5,
          oid: this.getOrder.orderDemandCommon.id,
          title: this.orderInput,
          token: this.getUsers.token,
          cid:this.getOrder.orderDemandCommon.cid
        }
        publish(params).then(res =>{
          if(res.code == 200) {
            this.$message.success({ message: '发布成功', offset: 50 })
            this.closeDrawer()
            this.$emit('updateList')
          }
        })
      },
      matchClick(id){//智能匹配
        let params = {
          app: 3,
          device: 5,
          oid: this.getOrder.orderDemandCommon.id,
          pageNo: 1,
          pageSize: 10,
          token: this.getUsers.token,
        }
        match(params).then(res =>{
          if(res.code == 200){
            if(res.data.records.length){
              this.mateList=res.data.records
            }else{
              this.$myMessage('error','没有匹配到合适的雇员')
            }
            
          }else{
            this.$myMessage('error',res.msg);
          }
        })
      },
      sendRemark(){// 备注信息
        let params = {
          app: 3,
          desc: this.orderTextarea,
          device: 5,
          oid: this.getOrder.orderDemandCommon.id,
          title: null,
          token: this.getUsers.token
        }
        remark(params).then(res =>{
          if(res.code == 200){
            this.getOrder.orderDemandCommon.remark.push(res.data)
            this.orderTextarea=""
          }else{
            this.$myMessage('error',res.msg)
          }
        })
      },
      sendClose(){
        this.orderTextarea = ''
        this.sendShow = false
      },
      changePage(val) {// 分页

      },
      allClick(flag,type) {// 服务反馈
        this.$store.commit('updateOrderFlag3', flag)
        this.serviceType=type;
        this.getQuestionList();
      },
      changeExamClick(index) {
        this.currentIndex2 = index
        this.reviewTextarea = ''
        this.answerArr = this.ecamList[this.currentIndex2].msg.answers
      },
      replyClick2(id,n){//服务反馈,回复消息
        if(!this.reviewTextarea){
          this.$myMessage('error','请输入回复内容')
          return false;
        }
        let params = {
          content: this.reviewTextarea,
          qid: id,
          token: this.getUsers.token,
          uType: n,//用户类型 1 worker 2customer 3业务员
        }
        replyAnswer(params).then(res =>{
          if(res.code == 200) {
            if(this.currentPage <= this.current && this.ecamList.length == 1){
              this.currentPage = this.current == 1?1:this.current - 1
            }
            this.getQuestionList()
            this.$store.commit('updateNumber2', this.number)
            this.reviewTextarea = ''
          }
        })
      },
      textareaFocus(){ // textareaFocus
        this.bdcolor = true
        this.placeholder = ''
      },
      textareaBlur(){
        this.bdcolor = false
        this.placeholder = '请输入回复内容'
      },
      handleAddInterview(){//添加面试按钮点击
        this.orderInterviewDialog = true
        let params = {
          app: 3,
          cid: '',
          device: 5,
          oid: this.getOrder.orderDemandCommon.id,
          time: '',
          token: this.getUsers.token,
          wid: '',
          workType: this.getOrder.orderDemandCommon.type,
          type:'3'
        }
        workers(params).then(res =>{//获取雇员列表
          if(res.code == 200) {
            this.empleeList = res.data
          }
        })

      },
      closeInterviewDialog(){
        this.orderInterviewDialog = false
        this.interviewShow = true
        this.interviewDate = ''
      },
      querySearch(queryString,cb) {// 输入面试人员时的匹配
        var restaurants = this.empleeList;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        cb(results)
      },
      createFilter(queryString) {
        return (restaurant) => {
          return Object.keys(restaurant).some(function(key) {
            return (String(restaurant[key]).toLowerCase().indexOf(queryString.toLowerCase()) === 0)
          })
        };
      },
      handleSelectPerson(item){
        this.interviewValue2 = item
        this.interviewShow = false
      },
      closeInterviewPerson(){//关闭输入面试人时显示的候选人列表
        this.interviewShow = true
      },
      changeInterviewDate(val){//选择面试时间
        const v1 = this.getcommonFun.formatDateTime(val).substr(0,16)
        this.interviewDate = v1
      },
      getInterviewList(){//获取已面试员列表
        let params = {
          app: 3,
          cid: '',
          device: 5,
          oid: this.getOrder.orderDemandCommon.id,
          time: '',
          token: this.getUsers.token,
          wid: '',
          workType: this.getOrder.orderDemandCommon.type
        }
        interviewList(params).then(res =>{
          if(res.code == 200) {
            this.interviewlist3 = res.data
          }
        })
      },
      submitOrderInterview(){//添加面试提交
        if(!this.interviewValue2.wid){
          this.$myMessage('error','暂无该候选人');
          return false;
        }else if(!this.interviewDate){
          this.$myMessage('error','请选择面试时间');
          return false;
        }
        let title=this.getOrder.orderDemandCommon.typeName + 'T'+ this.getOrder.orderDemandCommon.startLevel + '-T' + this.getOrder.orderDemandCommon.endLevel
        let params = {
          app: 3,
          cid: this.interviewValue2.cid,
          device: 5,
          oid: this.interviewValue2.oid,
          time: this.interviewDate,
          token: this.getUsers.token,
          wid: this.interviewValue2.wid,
          workType: this.interviewValue2.workType,
          workerName:this.interviewValue2.name,
          title
        }
        addInterview(params).then(res =>{
          if(res.code == 200) {
            this.getInterviewList()
          }
        })
        this.orderInterviewDialog = false
        this.interviewValue2={}
      },
      resetOrderInterview(){//添加面试取消
        this.orderInterviewDialog = false
        this.interviewShow = true
        this.interviewDate = ''
        this.interviewValue=""
      },
      delClick(cid,oid,wid,time,name){// 删除面试人员
        let title=this.getOrder.orderDemandCommon.typeName + 'T'+ this.getOrder.orderDemandCommon.startLevel + '-T' + this.getOrder.orderDemandCommon.endLevel
        this.$confirm('此操作将永久删除该面试人员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            app: 3,
            cid: cid,
            device: 5,
            oid: oid,
            time: time,
            token: this.getUsers.token,
            wid: wid,
            workType: '',
            workerName:name,
            title,
          }
          delInterview(params).then( res =>{
            if(res.code == 200) {
              this.$message({type: 'success', message: '删除成功!'});
              this.getInterviewList()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      submitTerm(){// 雇员-解约合同
        let params = {
          "app": 3,
          "device": 5,
          "oid": this.getOrder.orderDemandCommon.id,
          "reason": this.tmTextarea,
          "token": this.getUsers.token,
          "type": this.getSetStatus,
          "wid":this.getOrder.orderDemandCommon.wid
        }
        updateStatus(params).then(res =>{
          if(res.code == 200) {
            this.$myMessage('success', '解约成功');
            this.tmDialog = false
            if(this.getOrder.orderDemandCommon.serviceStatus==4){
              this.emshow3 = true
            }
            this.$emit('updateList')
          }else{
            this.$myMessage('error',res.msg)
          }
        })
      },
      resetTerm(){//合同解约取消
        this.tmDialog = false
        this.tmTextarea = ''
      },
      closeTmDialog(){
        this.tmDialog = false
        this.tmTextarea = ''
      },
      gbackCancle(){//雇员出户弹框取消
        this.emshow3 = false
        this.gbackValue1 = 0
        this.gbackValue2 = 0
      },
      gbackConfirm(){//雇员出户确认提交
        let params = {
          "app": 3,
          "device": 5,
          "oid": this.getOrder.orderDemandCommon.id,
          "refundCustomer": this.gbackValue1,
          "relieveEndTime": '',
          "salaryWorker": this.gbackValue2,
          "token": this.getUsers.token
        }
        updateExitOrder(params).then(res =>{
          if(res.code == 200) {
            this.$myMessage('success','提交成功')
            this.$emit("updateList")
            this.closeDrawer()
          }else{
            this.$myMessage('error',res.msg)
          }
        })
        this.emshow3 = false
        this.gbackValue1 = 0
        this.gbackValue2 = 0
      },
      opClick(flag) {// 操作日志
        this.$store.commit('updateOrderFlag4', flag)
        this.getLogs();
      },
      offlineClick(){// 线下支付
        this.offlineDialog = true
      },
      closeOfflineDialog(){
        this.offlineDialog = false
        this.offlineValue = ''
      },
      submitOffline(){//线下支付
        this.offlineDialog = false
        this.offlineValue = ''
      },
      resetOffline(){
        this.offlineDialog = false
        this.offlineValue = ''
      },
      getInvoice(){// 订单发票
        let params = {
          app: 3,
          device: 5,
          id: this.getOrder.orderDemandCommon.invoiceId,
          token: this.getUsers.token
        }
        getInvoice(params).then(res =>{
          if(res.code == 200){
            this.invoice = res.data
          }
        })
      },
      mdinvoice(id, status){ // 更改发票状态
        this.$confirm('此操作将邮寄发票, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            app: 3,
            device: 5,
            id: id,
            status: status,//0 默认申请 1可以开票 2已开票 3未邮寄 4已邮寄 5作废
            token: this.getUsers.token
          }
          modifyInvoice(params).then(res =>{
            if(res.code == 200) {
              this.$message({
                type: 'success',
                message: '邮寄成功!'
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
      },
      closeDrawer(){// closeDrawer
        this.drawer=false;
        this.emshow1 = false
        this.emshow2 = false
        this.emshow3 = false
        this.serviceRadio = null
        this.serviceRadio2 = null
        this.serviceRadio3 = null
        this.serviceRadio4 = null
        this.startTime = ''
        this.endTime = ''
        this.time1 = ''
        this.time2 = ''
        this.wtime = ''
        this.serviceCharge1 = ''
        this.serviceCharge2 = ''
        this.serviceCharge3 = ''
        this.serviceCharge4 = ''
        this.checkList = false
        this.checkList2 = false
        this.orderTextarea = ''
        // this.$store.commit('updateOrder', {})
        this.orderTabName = 'first'
        this.sendShow = false
        this.cidx = -1
      },
      changeBorder(val){
        this.bdcolor2 = val
      },
      cellName({row, column, rowIndex, columnIndex}){// 支付单元格编辑
        // console.log(row, column, rowIndex, columnIndex)
        // row.rowIndex = rowIndex
      },
      callMsg(){//聊天
        let user={}
        user.uid=this.getOrder.orderId.toString();
        user.name=this.getOrder.name;
        user.headImg=this.getOrder.orderDemandCommon.workerHeadImg
        this.targetUser=user;
        this.$refs.chat.showDialog()
        
      },
      async getLogs(){//获取操作日志
        let params={
          order_id:this.getOrder.orderId
        }

        const result=await getOperats(params)
        if(result.code===200){
          if(this.getOrderFlag4){
            this.logList=result.data
          }else{

          }
        }else{
          this.$myMessage('error',result.msg)
        }

      },
      getLogTypes(type){//根据logtype获取type类型
        switch(type){
          case 0:
            return '新增订单'
          case 1:
            return '订单发布'
          case 2:
            return '更改订单状态'
          case 3:
            return '新增面试'
          case 4:
            return '删除面试'
          case 5:
            return '添加雇员'
          case 6:
            return '更换雇员'
          case 7:
            return '添加合同'
          case 8:
            return '修改合同'
          case 9:
            return '添加顾问'
          case 10:
            return '更换顾问'
        }
      },
      getQuestionList() {//获取服务反馈列表
        let params = {
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          token: this.getUsers.token,
          oid:this.getOrder.orderId,
          type:this.serviceType
        }
        questionList(params).then(res =>{
          if(res.code == 200) {
            this.ecamList = res.data.records
            if(res.data.records.length){
              this.qid=res.data.records[this.currentIndex2].id
              this.answerArr = res.data.records[this.currentIndex2].msg.answers.sort((a,b) => {
                return Date.parse(b.time.replace(/-/g,"/"))-Date.parse(a.time.replace(/-/g,"/"));
              })
            }
          }
        })
      },
      getUserType(type){//根据用户类型数字获取用户类型
        switch(type){
          case 1:
            return '雇员'
          case 2:
            return '雇主'
          case 3:
            return '顾问'
        }
      },
      async changeZhuan(){//转为专家处理
        let params={
          type:'2',//1顾问，2专家
          token: this.getUsers.token,
          qid:this.qid
        }
        const result=await updateQuestionList(params)
        if(result.code==200){
          this.getQuestionList()
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/components/orderProcess/common.scss'
</style>

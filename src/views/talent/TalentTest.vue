<template>
<div class="tinntay-cont">
  <div class="talentAudit r410">
    <!-- <div class="talent-title">人才列表</div> -->
    <div class="talent-cont">
      <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
      <el-tab-pane label="待测评" name="first">
        <TalentEvaluation @fatherMethod="getDetailList"></TalentEvaluation>
      </el-tab-pane>
      <el-tab-pane label="培训中" name="second">
        <TalentTrain></TalentTrain>
      </el-tab-pane>
      <el-tab-pane label="题库" name="third">
        <TalentStore @updateTest="gettechList"></TalentStore>
      </el-tab-pane>
    </el-tabs>
    </div>
  </div>
  <div class="tin-right">
    <div class="testList">
      <!-- 待测评 培训中 -->
      <template v-if="this.activeName != 'third'">
        <div class="testList-hd clearfix">
          档案合格
          <a href="javascript:void(0);" class="delay" @click="delayClick(getTalent.id)" v-if="this.activeName == 'second'">
            <img :src="reUrl" alt="">未通过
          </a>
        </div>
        <div class="testList-bd">
          <el-row class="tb1">
            <el-row style="margin-bottom:4px;">
              <el-col :span="12" style="padding-right:10px;">
                <img :src="userUrl" alt="" class="user-img">
                <!-- <el-row v-for="(item,index) in photos" :key="index">
                  <img :src="item.img | imgFormat" alt="" class="user-img"  v-if="item.picType == 10">
                  <el-row v-else>暂无形象照</el-row>
                </el-row> -->
              </el-col>
              <el-col :span="12" v-if="this.activeName != 'third'">
                <el-row>
                  <el-col class="gray">姓名:<span class="blak" style="margin-left:2px">{{detail.name?detail.name:'--'}}</span></el-col>
                </el-row>
                <el-row>
                  <el-col class="gray">年龄:<span class="blak" style="margin-left:2px">{{detail.birthday?(new Date().getFullYear()) - (detail.birthday+'').substr(0,4):'--'}}</span></el-col>
                </el-row>
                <el-row>
                  <el-col class="gray">身高:
                    <span class="blak" style="margin-left:2px" v-if="detail.stature">{{detail.stature === null?'--':detail.stature+'cm'}}</span>
                    <span class="blak" style="margin-left:2px" v-else>--</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col class="gray">学历:<span class="blak" style="margin-left:2px">{{detail.education?this.getcommonFun.tabKey(detail.education):'--'}}</span></el-col>
                </el-row>
                <el-row>
                  <el-col class="gray">工作年限:
                    <span class="blak" style="margin-left:2px" v-if="detail.workYear">{{detail.workYear=== null?'--':detail.workYear+'年'}}</span>
                    <span class="blak" style="margin-left:2px" v-else>--</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col class="gray">特长:<span class="blak" style="margin-left:2px">{{this.skills.length !== 0?this.getcommonFun.tabKey(this.speciality+''):'--'}}</span></el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-row>
        </div>
        <!-- 初审合格 -->
        <el-row class="testList-bd archives">
          <el-tabs v-model="archivesName" type="card" >
            <el-tab-pane label="档案" name="first">
              <el-collapse v-model="activeNames2">
                <el-collapse-item title="基本资料" name="1">
                  <el-row class="tb1" style="border-bottom:0">
                      <el-row>
                        <el-col :span="12" class="gray">籍贯</el-col>
                        <el-col :span="12" class="blak">{{detail.nativePlace !== null?this.getcommonFun.province(detail.nativePlace):'--'}}</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="12" class="gray">出生日期</el-col>
                        <el-col :span="12" class="blak">{{detail.birthday?(detail.birthday+'').substr(0,10):'--'}}</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="12" class="gray">属相</el-col>
                        <el-col :span="12" class="blak">{{detail.chineseZodiac?this.getcommonFun.chineseZodiac(detail.chineseZodiac):'--'}}</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="12" class="gray">体重</el-col>
                        <el-col :span="12" class="blak" v-if="detail.weight">{{detail.weight  === null?'--':detail.weight+'kg'}}</el-col>
                        <el-col :span="12" class="blak" v-else>--</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="12" class="gray">宗教信仰</el-col>
                        <el-col :span="12" class="blak">
                          <span v-if="detail.faith == 0">无</span>
                          <span v-if="detail.faith == 1">基督教</span>
                          <span v-if="detail.faith == 2">佛教</span>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="12" class="gray">政治面貌</el-col>
                        <el-col :span="12" class="blak">
                          <span v-if="detail.partyMember == 0">无</span>
                          <span v-if="detail.partyMember == 1">党员</span>
                          <span v-if="detail.partyMember == 2">团员</span>
                        </el-col>
                      </el-row>
                  </el-row>
                </el-collapse-item>
                <el-collapse-item title="家庭情况" name="2">
                  <el-row class="tb1" style="border-bottom:0">
                      <el-row>
                        <el-col :span="12" class="gray">家庭情况</el-col>
                        <el-col :span="12" class="blak">
                          {{detail.maritalStatus == 0?'已婚':detail.maritalStatus == 1?'未婚':detail.maritalStatus == 2?'离异':''}}
                          {{detail.giveBirthTo == 0?'有小孩':detail.giveBirthTo == 1?'无小孩':''}}
                        </el-col>
                      </el-row>
                      <el-row v-for="(item,index) in family" :key="index">
                        <el-row>
                          <el-col :span="12" class="gray">{{item.relationship == 1?'配偶':item.relationship == 2?'子女':item.relationship == 3?'父母':'亲友'}}联系方式</el-col>
                          <el-col :span="12" class="blak">{{item.phone}}</el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="12" class="gray">{{item.relationship == 1?'配偶':item.relationship == 2?'子女':item.relationship == 3?'父母':'亲友'}}工作</el-col>
                          <el-col :span="12" class="blak">{{item.work}}</el-col>
                        </el-row>
                      </el-row>
                  </el-row>
                </el-collapse-item>
                <el-collapse-item title="工作技能" name="3">
                  <el-row class="tb1" style="border-bottom:0">
                    <el-row>
                      <el-col :span="12" class="gray">期盼工作</el-col>
                      <el-col :span="12" class="blak">{{detail.workTypes?this.getcommonFun.tabKey(detail.workTypes):'--'}}</el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12" class="gray">工作年限</el-col>
                      <el-col :span="12" class="blak" v-if="detail.workYear">{{detail.workYear === null?'--':detail.workYear+'年'}}</el-col>
                      <el-col :span="12" class="blak" v-else>--</el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12" class="gray">可工作区域</el-col>
                      <el-col :span="12" class="blak">{{this.workPlace.length !== 0?this.getcommonFun.tabKey(this.workPlace+''):'--'}}</el-col>
                    </el-row>
                    <el-row>
                      <el-row class="gray" style="margin-bottom:4px">工作经验</el-row>
                      <div v-if="workExp.length > 0">
                      <div class="exp clearfix" v-for="(item,index) in workExp" :key="index">
                        <div class="exp1">
                          <span class="exp-bd"></span>
                          <div class="exp-line"></div>
                        </div>
                        <div class="exp2">
                          <div class="exp-title">{{getcommonFun.tabKey(item.workType)}} {{item.startTime}} - {{item.endTime}}</div>
                          <div class="exp-cont gray">{{item.description}}</div>
                        </div>
                      </div>
                      </div>
                      <div v-else>--</div>
                    </el-row>
                  </el-row>
                </el-collapse-item>
                <el-collapse-item title="自我评价" name="4">
                  <el-row class="tb1" style="border-bottom:0">
                    <!-- <el-row class="gray">自我评价</el-row> -->
                    <el-row class="zwpj" v-if="detail.assessment">{{detail.assessment === null?'--':detail.assessment}}</el-row>
                    <el-row class="zwpj" v-else>--</el-row>
                  </el-row>
                </el-collapse-item>
                <el-collapse-item title="认证照片" name="5">
                  <el-row class="tb1" style="border-bottom:0">
                    <el-row class="gray">证件照</el-row>
                    <div v-if="photos.length > 0">
                    <template v-for="(item,index) in photos">
                      <el-row class="idPhoto" v-if="item.picType == 2" :key="index">
                        <!-- <img :src="userUrl | imgFormat" alt="">
                        <img :src="userUrl | imgFormat" alt=""> -->
                        <img :src="item.img | imgFormat" alt="">
                        <img :src="item.img2 | imgFormat" alt="">
                      </el-row>
                    </template>
                    </div>
                    <div v-else>--</div>
                    <el-row class="gray">相关证书</el-row>
                    <div v-if="skills.length > 0">
                    <template v-for="(item,index) in skills">
                      <!-- <el-row class="idPhoto" v-if="item.picType == 3" :key="index"> -->
                      <el-row class="idPhoto" :key="index" v-if="item.certificateImg !== null">
                        <!-- <img :src="userUrl | imgFormat" alt=""> -->
                        <img :src="item.certificateImg | imgFormat" alt="">
                      </el-row>
                      <div :key="index" v-else>--</div>
                    </template>
                    </div>
                    <div v-else>--</div>
                    <el-row class="gray">相关证书</el-row>
                    <div v-if="photos.length > 0">
                    <template v-for="(item,index) in photos">
                      <el-row class="idPhoto" v-if="item.picType == 4" :key="index">
                        <!-- <img :src="userUrl | imgFormat" alt=""> -->
                        <img :src="item.img | imgFormat" alt="">
                      </el-row>
                    </template>
                    </div>
                    <div v-else>--</div>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
              <el-row style="margin-left:-10PX">
                <el-row class="auRadio">
                  <el-col :span="12">形象是否通过：</el-col>
                  <el-col :span="12">
                    <el-radio v-model="faceRadio" label="1">是</el-radio>
                    <el-radio v-model="faceRadio" label="2">否</el-radio>
                  </el-col>
                </el-row>
                <el-row class="auRadio">
                  <el-col :span="12">健康是否通过：</el-col>
                  <el-col :span="12">
                    <el-radio v-model="healthRadio" label="1">是</el-radio>
                    <el-radio v-model="healthRadio" label="2">否</el-radio>
                  </el-col>
                </el-row>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="定级" name="second">
              <el-row class="tscore" v-if="skills.length > 0">
                <el-tabs v-model="activeName2" type="card" class="tscore-hd">
                  <!-- <el-tab-pane label="育婴服务" name="first"> -->
                    <el-tab-pane :label="getcommonFun.tabKey(item.pid)" :name="String(skills.length)" v-for="(item,index) in skills" :key="index">
                    <el-row>
                      <el-col :span="12" class="bold1">基本资料分</el-col>
                      <el-col :span="12" class="green" v-if="activeName == 'first'">通过</el-col>
                      <el-col :span="12" class="green" v-if="activeName == 'second'">18分</el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12" class="bold1">专业技能分</el-col>
                      <el-col :span="12" class="green" v-if="activeName == 'first'">通过</el-col>
                      <el-col :span="12" class="green" v-if="activeName == 'second'">
                        <el-col :span="12">18分</el-col>
                        <el-col :span="12">
                          <el-button class="look" @click="lookDg(item.pid,item.wid,0)">查看</el-button>
                        </el-col>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12" class="bold1">服务礼仪分</el-col>
                      <el-col :span="12" class="green" v-if="activeName == 'first'">通过</el-col>
                      <el-col :span="12" :class="activeName == 'second'?'brown':'green'" v-if="activeName == 'second'">
                        <el-col :span="12">23分</el-col>
                        <el-col :span="12">
                          <el-button class="look" @click="lookDg(item.pid,item.wid,2)">查看</el-button>
                        </el-col>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12" class="bold1">专家评估分</el-col>
                      <el-col :span="12" class="green">
                        <el-col v-if="activeName == 'first'">--</el-col>
                        <template v-if="activeName == 'second'">
                          <el-col :span="12" class="brown">13分</el-col>
                          <el-col :span="12">
                            <el-button class="look" @click="lookDg(item.pid,item.wid,1)">查看</el-button>
                          </el-col>
                        </template>
                      </el-col>
                    </el-row>
                    <el-row style="margin-top:30px;" v-if="activeName == 'second'">
                      <el-col :span="12" class="bold1">综合测试分</el-col>
                      <el-col :span="12" class="red">
                        <el-col v-if="activeName == 'first'">--</el-col>
                        <el-col v-if="activeName == 'second'">72分</el-col>
                      </el-col>
                    </el-row>
                    <el-row class="tping" v-if="activeName == 'second'">
                      <el-row class="tping-hd" style="margin-bottom:0">
                        <el-col :span="8">级别评测：</el-col>
                        <el-col :span="16">
                          <el-row >--</el-row>
                          <!-- <el-row v-if="this.activeName == 'second'">育婴服务T7级</el-row> -->
                        </el-col>
                      </el-row>
                      <el-row class="tping-bd">专家测评</el-row>
                      <!-- <el-row class="tping-bd" v-if="this.activeName == 'first'">专家测评</el-row> -->
                      <!-- <el-row class="tping-bd" v-if="this.activeName == 'second' && this.improveExp == '未通过'">未通过</el-row>
                      <el-row class="tping-bd on" @click.native="recordDialogVisible = true" v-if="this.activeName == 'second' && this.improveExp == '通过'">合格入档案</el-row> -->
                    </el-row>
                  </el-tab-pane>
                  <!-- <el-tab-pane label="月嫂服务" name="second">
                    222
                  </el-tab-pane> -->
                </el-tabs>
              </el-row>
              <el-row class="tscore" v-else>暂无数据</el-row>
            </el-tab-pane>
          </el-tabs>
        </el-row>
      </template>
      <!-- 题库 -->
      <template v-if="this.activeName == 'third'">
        <div class="testList-hd">理论测试题</div>
        <div class="testList-md">
          <p>{{getExamDetail && getExamDetail.tagMore == 1?'多选题':getExamDetail && getExamDetail.tagMore == 2 ? '问答题':'单选题'}}</p>
          <!-- <div class="testList-title">{{answerList.info}}</div> -->
          <div class="testList-title">{{getExamDetail.info}}</div>
          <div class="testList-cont">
            <el-radio-group v-model="radio" disabled>
              <el-row class="testList-row" :class="getExamDetail.answer.indexOf(index) != -1?'on':''" v-for="(item,index) in getExamDetail.options" :key="index">
                <el-radio :label="item"  :key="index" v-if="item != ''">
                  <span v-for="(letter,index) in letters[index]" :key="index">{{letter}}、</span>
                  {{item}}
                </el-radio>
              </el-row>
            </el-radio-group>
          </div>
          <div class="red">
            正确答案：
            <!-- {{getExamDetail.answer == 0?'A':getExamDetail.answer == 1?'B':getExamDetail.answer == 2?'C':getExamDetail.answer == 3?'D':''}} -->
            {{this.getcommonFun.getLetter(getExamDetail.answer)}}
          </div>
        </div>
      </template>
    </div>
  </div>
  <!-- 人才测评分数 -->
  <!-- 理论测试 -->
    <el-dialog title="专业技能育婴测试" :visible.sync="testDialogVisible" :close-on-click-modal="false" width="30%" center class="addDialog active">
      <el-row class="ltest" v-for="(item,index) in ltest" :key="index">
        <el-row class="ltest-hd">
          {{item.name}}
          <span class="brown">(未通过)</span>
        </el-row>
        <el-row class="ltest-bd">
          <el-col class="ltest-bt" :class="index==6?'on':''" v-for="(subItem,index) in item.children" :key="index">{{subItem.num}}</el-col>
        </el-row>
      </el-row>
      <el-row class="ltest-title">
        <el-col :span="10">单选题</el-col>
        <el-col :span="14">7/10</el-col>
      </el-row>
      <template>
      <el-row class="ltest-select">
        <el-row class="ltest-stitle">7、家政服务人员在工作中要热情解答雇主提出的问题，要做到（     ）</el-row>
        <el-row class="ltest-scont">
          <el-row class="on1">A、及时回答、问多不烦、事多不厌</el-row>
          <el-row class="on2">B、想回答就回答</el-row>
          <el-row>C、觉得问题幼稚，讥笑讽刺</el-row>
          <el-row>D、凭心情，心情好就回答</el-row>
        </el-row>
      </el-row>
      <el-row class="zqdn">正确答案：A</el-row>
      </template>
      <el-row class="ltest-close"><el-button @click="testDialogVisible = false">重新测试</el-button></el-row>
    </el-dialog>
    <!-- 专家评估分 -->
    <el-dialog title="专家评估分" :visible.sync="testDialogVisible3" :close-on-click-modal="false" width="258px" center class="addDialog active">
      <el-row class="expert">
        <el-col :span="6">专业度：</el-col>
        <el-col :span="18" class="green">5分</el-col>
      </el-row>
      <el-row class="expert">
        <el-col :span="6">熟练度：</el-col>
        <el-col :span="18" class="green">4分</el-col>
      </el-row>
      <el-row class="expert">
        <el-col :span="6">服务意识：</el-col>
        <el-col :span="18" class="green">3分</el-col>
      </el-row>
      <el-row class="expert">
        <el-col :span="6">礼仪礼节：</el-col>
        <el-col :span="18" class="red">2分</el-col>
      </el-row>
      <el-row class="expert">
        <el-col :span="6">个人习惯：</el-col>
        <el-col :span="18" class="red">1分</el-col>
      </el-row>
      <el-row class="expert">
        <el-col :span="6">主要擅长：</el-col>
        <el-col :span="18">早教</el-col>
      </el-row>
      <el-row class="expert">
        <el-col :span="6">专家评价：</el-col>
        <el-col :span="18">阿姨学习上有些困难，但愿意学，心 态好，但各方面技能有待和宝宝互动 能力有待提高。 </el-col>
      </el-row>
    </el-dialog>
    <!-- 入档案 -->
    <el-dialog title="录入信息" :visible.sync="recordDialogVisible" :close-on-click-modal="false" width="" center class="addDialog active hd hd2">
      <el-row class="record">
        <el-form :model="recordForm" ref="recordForm">
          <el-row>
            <el-col :span="17">
              <el-form-item label="档案编号：" prop="idNum">
                <span class="bak1">{{recordForm.idNum}}</span>
              </el-form-item>
              <el-form-item label="姓名：" prop="name">
                <span class="bak1">{{recordForm.name}}</span>
              </el-form-item>
              <el-form-item label="级别测评：" prop="jbie">
                <span class="bak1">{{recordForm.jbie}}</span>
              </el-form-item>
              <el-form-item label="岗位工资：" prop="money">
                <span class="bak1">{{recordForm.money}}</span>
              </el-form-item>
              <el-form-item label="工作经验：" prop="exp">
                <span class="bak1">{{recordForm.exp}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="7" class="ldimg">
              <el-form-item  label="形象照："></el-form-item>
              <el-row class="ldimg-hd">
                <el-upload
                  class="avatar-uploader"
                  :class="this.imageUrl !== ''?'on':''"
                  :action="actionUrl"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  accept=".jpg, .JPG"
                  :limit="1">
                  <img v-if="imageUrl !== ''" :src="imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon">
                    <img :src="cameraImg" alt=""><br />上传我的工作形象照
                  </i>
                </el-upload>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="综合素质：" >
              <el-row class="bak1">
                <span class="information" v-for="(item,index) in recordForm.zhsz" :key="index">
                  {{item}}
                </span>
              </el-row>
            </el-form-item>
            <el-form-item label="特别擅长：">
               <span class="bak1">{{recordForm.tbsc}}</span>
            </el-form-item>
            <el-form-item label="专家评价：">
              <span class="bak1">{{recordForm.zjpj}} </span>
            </el-form-item>
            <el-form-item label="工作经历：" style="margin-top:10px">
              <el-row class="work">
                <el-row v-for="(item,index) in recordForm.workExp" :key="index">
                  <!-- <el-col :span="6">
                    <el-date-picker v-model="item.date1" type="month" :clearable="false"  placeholder="选择日期"> </el-date-picker>
                  </el-col>
                  <el-col :span="2">-</el-col>
                  <el-col :span="6">
                    <el-date-picker v-model="item.date2" type="month" :clearable="false"  placeholder="选择日期"> </el-date-picker>
                  </el-col> -->
                  <el-row>
                  <el-col :span="14">
                    <el-date-picker
                      v-model="item.date1"
                      type="monthrange"
                      :editable= false
                      start-placeholder="选择日期"
                      end-placeholder="选择日期"
                      :default-time="['00:00:00', '23:59:59']"
                      format="yyyy - MM"
                      value-format="timestamp"
                      @change="changeDate1">
                    </el-date-picker>
                  </el-col>
                  <el-col :span="3">
                    <el-button @click="removeExp(item)"><img :src="wImg1" alt=""></el-button>
                  </el-col>
                  </el-row>
                  <el-row>
                  <el-col :span="14">
                    <el-input class="bd" v-model="item.title" placeholder="服务类型如：育婴、月嫂..."></el-input>
                  </el-col>
                  </el-row>
                  <el-row>
                  <el-col :span="24">
                    <el-input type="textarea" placeholder="请填写工作内容" v-model="item.tarea"></el-input>
                  </el-col>
                  </el-row>
                </el-row>
                <el-row class="addexp">
                  <el-button @click="addExp()"><img :src="wImg2" alt="">添加工作经验 </el-button>
                </el-row>
              </el-row>
            </el-form-item>
            <el-form-item label="健康证明：" style="margin-top:10px">
              <el-row class="bak1 uploadImg">
                <el-upload action="#" list-type="picture-card" :auto-upload="false" ref="upload">
                    <!-- <i slot="default" class="el-icon-plus"></i> -->
                    <i slot="default" class="el-icon-plus avatar-uploader-icon">
                      <img :src="cameraImg" alt=""><br />上传照片
                    </i>
                    <div slot="file" slot-scope="{file}">
                      <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" >
                      <span class="el-upload-list__item-actions">
                        <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                          <i class="el-icon-zoom-in"></i>
                        </span>
                        <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                          <i class="el-icon-delete"></i>
                        </span>
                      </span>
                    </div>
                </el-upload>
              </el-row>
            </el-form-item>
            <el-form-item label="学历证书：" style="margin-top:10px">
              <el-row class="bak1 uploadImg">
                <el-upload action="#" list-type="picture-card" :auto-upload="false" ref="upload2">
                    <!-- <i slot="default" class="el-icon-plus"></i> -->
                    <i slot="default" class="el-icon-plus avatar-uploader-icon">
                      <img :src="cameraImg" alt=""><br />上传照片
                    </i>
                    <div slot="file" slot-scope="{file}">
                      <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" >
                      <span class="el-upload-list__item-actions">
                        <span class="el-upload-list__item-preview" @click="handlePictureCardPreview2(file)">
                          <i class="el-icon-zoom-in"></i>
                        </span>
                        <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove2(file)">
                          <i class="el-icon-delete"></i>
                        </span>
                      </span>
                    </div>
                </el-upload>
              </el-row>
            </el-form-item>
            <el-form-item label="技能证书：" style="margin-top:10px">
              <el-row class="bak1 uploadImg">
                <el-upload action="#" list-type="picture-card" :auto-upload="false" ref="upload3">
                    <!-- <i slot="default" class="el-icon-plus"></i> -->
                    <i slot="default" class="el-icon-plus avatar-uploader-icon">
                      <img :src="cameraImg" alt=""><br />上传照片
                    </i>
                    <div slot="file" slot-scope="{file}">
                      <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" >
                      <span class="el-upload-list__item-actions">
                        <span class="el-upload-list__item-preview" @click="handlePictureCardPreview3(file)">
                          <i class="el-icon-zoom-in"></i>
                        </span>
                        <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove3(file)">
                          <i class="el-icon-delete"></i>
                        </span>
                      </span>
                    </div>
                </el-upload>
              </el-row>
            </el-form-item>
            <el-form-item label="相关证书：" style="margin-top:10px">
              <el-row class="bak1 uploadImg">
                <el-upload action="#" list-type="picture-card" :auto-upload="false" ref="upload4">
                    <!-- <i slot="default" class="el-icon-plus"></i> -->
                    <i slot="default" class="el-icon-plus avatar-uploader-icon">
                      <img :src="cameraImg" alt=""><br />上传照片
                    </i>
                    <div slot="file" slot-scope="{file}">
                      <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" >
                      <span class="el-upload-list__item-actions">
                        <span class="el-upload-list__item-preview" @click="handlePictureCardPreview4(file)">
                          <i class="el-icon-zoom-in"></i>
                        </span>
                        <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove4(file)">
                          <i class="el-icon-delete"></i>
                        </span>
                      </span>
                    </div>
                </el-upload>
              </el-row>
            </el-form-item>
            <el-form-item class="aform-footer" style="margin-top:10px">
              <el-button @click="resetRecordForm('recordForm')">取 消</el-button>
              <el-button @click="submitRecordForm('recordForm')">提 交</el-button>
            </el-form-item>
          </el-row>
          <!-- <el-row class="ltest-close" style="margin-top:20px;">
            <el-button style="border-radius:4px;" @click="submitRecordForm('recordForm')">录入人才总表</el-button>
          </el-row> -->
        </el-form>
      </el-row>
    </el-dialog>
    <!-- upload--健康证明--学历--技能--相关 -->
    <el-dialog :visible.sync="uploadDialogVisible" :close-on-click-modal="false">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <el-dialog :visible.sync="uploadDialogVisible2" :close-on-click-modal="false">
      <img width="100%" :src="dialogImageUrl2" alt="">
    </el-dialog>
    <el-dialog :visible.sync="uploadDialogVisible3" :close-on-click-modal="false">
      <img width="100%" :src="dialogImageUrl3" alt="">
    </el-dialog>
    <el-dialog :visible.sync="uploadDialogVisible4" :close-on-click-modal="false">
      <img width="100%" :src="dialogImageUrl4" alt="">
    </el-dialog>
</div>
</template>

<script>
import { getDetail, lookAnswer } from '@/api/api'
import TalentEvaluation from '@/components/talentTest/TalentEvaluation.vue'
import TalentTrain from '@/components/talentTest/TalentTrain.vue'
import TalentStore from '@/components/talentTest/TalentStore.vue'
import { mapGetters } from 'vuex'
  export default {
    name: 'talentAudit',
    components: {
      TalentEvaluation,
      TalentTrain,
      TalentStore
    },
    computed:{
      ...mapGetters([
          'getExamDetail',
          'getTalent',
          'getUsers'
      ])
    },
    data() {
      const userImg = require('@/assets/images/uimg2.png')
      const reImg = require('@/assets/images/reback.png')
      // 入档案
      const wUrl1 = require('@/assets/images/w1.png')
      const wUrl2 = require('@/assets/images/w2.png')
      const cameraUrl = require('@/assets/images/camera.png')
      return {
        activeName: 'first',
        // txg1: '理论题',
        txg2: '全部',
        // 题库table list
        listMoudle: '单选题',
        listTitle: '1/344、家政服务人员在工作中要热情的解答 雇主提出的问题，要做到（    ）',
        radio: 'A、及时回答、问多不烦、事多不厌',
        listAnswer: 'A',
        list:[
          {
            label: '',
            name: 'A、及时回答、问多不烦、事多不厌'
          },
          {
            label: '',
            name: 'B、想回答就回答'
          },
          {
            label: '',
            name: 'C、觉得问题太幼稚，讥讽嘲笑'
          },
          {
            label: '',
            name: 'D、凭心情，心情好就回答'
          }
        ],
        // 暂不处理
        reUrl: reImg,
        userUrl:userImg,
        activeNames: ['0'],
        // detail
        detail:{},
        skills:[],
        speciality:[],
        workPlace:[],
        family: [],
        workExp: [],
        photos:[],
        faceRadio: '1',
        healthRadio: '1',
        // 初审合格
        archivesName: 'second',
        activeNames2: ['0'],
        activeName2: '1',
        testDialogVisible: false,
        testDialogVisible2: false,
        testDialogVisible3: false,
        ltest:[
          {
            name: '收纳',
            children:[
              {
                num: '1'
              },
              {
                num: '2'
              },
              {
                num: '3'
              },
              {
                num: '4'
              },
              {
                num: '5'
              },
              {
                num: '6'
              },
              {
                num: '7'
              },
              {
                num: '8'
              },
              {
                num: '9'
              },
              {
                num: '10'
              }
            ]
          }
        ],
        // 入档案
        recordDialogVisible: false,
        recordForm:{
          idNum: 'D011516',
          name: '张正华',
          jbie: '育婴服务T6级、月嫂服务T3级',
          money: '12000元',
          exp: '7年',
          zhsz: ['气质优雅', '性格开朗', '素质良好', '安全意识好', '科学喂养'],
          tbsc: '早教、辅食',
          zjpj:  '阿姨学习上有些困难，但愿意学，心态好，但各方面技能有待 和宝宝互动能力有待提高。 ',
          workExp: [
            {
              date1: [],
              title: '',
              tarea: ''
            }
          ]
        },
        wImg1: wUrl1,
        wImg2: wUrl2,
        // upload 形象照
        actionUrl: 'https://jsonplaceholder.typicode.com/posts/',
        imageUrl: '',
        cameraImg: cameraUrl,
        // 证书
        dialogImageUrl: '',
        uploadDialogVisible: false,
        dialogImageUrl2: '',
        uploadDialogVisible2: false,
        dialogImageUrl3: '',
        uploadDialogVisible3: false,
        dialogImageUrl4: '',
        uploadDialogVisible4: false,
        disabled: false,
        // 通过-未通过
        improveExp: '',
        // 理论测试题答案
        // answerList: {}
        letters:['A','B','C','D','E','F','G','H','I','J','K','L','M','N']
      }
    },
    created() {
      // console.log(this.screenHeight)
      // 元数据list
      // this.gettechList()
      // 阿姨详细信息
      this.getDetailList()
    },
    methods: {
      // 元数据list
      gettechList(data) {
        // this.$store.state.sysMetaData
        // console.warn("gettechList");
        this.$store.commit("updateSysMetaData", data);
        // this.$store.state.sysMetaData.forEach((e,i)=>{
        //   if(e.pid == 2){
        //     console.log("sddddddddddddd", e);
        //   }
        // })
      },
      evaClick(flag) {
        this.recordDialogVisible = flag
      },
      // 阿姨详细信息
      getDetailList(exp){
        this.improveExp = exp
        let params = {
          "app": 3,
          "comments": true,
          "device": 5,
          "experience": true,
          "family": true,
          "picStatus": [0],
          "picTypes": [0],
          "score": true,
          "token": this.getUsers.token,
          "wid": this.getTalent.id
        }
        getDetail(params).then(res => {
          if(res.code == 200) {
            console.log(res)
            this.detail = res.data
            this.skills = res.data.skills
            // sessionStorage.setItem('talentDetail2', JSON.stringify(this.detail))
            this.family = res.data.workerFamilies
            res.data.skills.forEach(item =>{
              this.speciality = item.speciality
              this.workPlace = item.workPlace
            })
            // this.workExp = (res.data.workerExperience).reverse()
            const wk = res.data.workerExperience
            this.workExp = wk.sort((a,b) => {
              let a1 = a.startTime
              let b1 = b.endTime
              return b1 -a1
            })
            this.photos = res.data.photos
          }
        })
      },
      // tab 切换
      tabClick(tab, event) {
        // console.log(tab, event)
        console.log(this.activeName)
      },
      // msg
      // handleClick(row) {
      //   // console.log(row);
      // },
      // 入档案添加取消工作经历
      addExp() {
        this.recordForm.workExp.push({'date1': [], 'title': '', 'tarea': ''})
        // console.log(this.recordForm.workExp)
      },
      removeExp(item) {
        var index = this.recordForm.workExp.indexOf(item)
        if (index !== -1) {
          this.recordForm.workExp.splice(index, 1)
        }
      },
      // 入档案添加取消
      submitRecordForm(recordForm) {
        this.recordDialogVisible = false
        this.$message.success({ message: '提交成功', offset: 50 })
        const arr = this.recordForm.workExp
        arr.forEach( item => {
          console.log(item.date1,item.title,item.tarea)
        })
      },
      resetRecordForm(recordForm) {
        this.$refs[recordForm].resetFields()
        this.recordDialogVisible = false
      },
      // upload
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        console.log(file)
      },
      // 头像上传前,判断下格式
      beforeAvatarUpload(file) {
          const isJPG = file.type === 'image/jpeg'
          const isLt2M = file.size / 1024 / 1024 < 2
          if (!isJPG) {
              this.$myMessage('error', '上传头像图片只能是 JPG 格式!')
          }
          if (!isLt2M) {
              this.$myMessage('error', '上传头像图片大小不能超过 2MB!')
          }
          return isJPG && isLt2M
      },
      // 证书
      handleRemove(file) {
        console.log(file);
        let fileList = this.$refs.upload.uploadFiles
        let index = fileList.findIndex(fileItem => {
          return fileItem.uid === file.uid
        })
        fileList.splice(index, 1)
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.uploadDialogVisible = true;
      },
      handleRemove2(file) {
        console.log(file);
        let fileList2 = this.$refs.upload2.uploadFiles
        let index = fileList2.findIndex(fileItem => {
          return fileItem.uid === file.uid
        })
        fileList2.splice(index, 1)
      },
      handlePictureCardPreview2(file) {
        this.dialogImageUrl2 = file.url;
        this.uploadDialogVisible2 = true;
      },
      handleRemove3(file) {
        console.log(file);
        let fileList3 = this.$refs.upload3.uploadFiles
        let index = fileList3.findIndex(fileItem => {
          return fileItem.uid === file.uid
        })
        fileList3.splice(index, 1)
      },
      handlePictureCardPreview3(file) {
        this.dialogImageUrl3 = file.url;
        this.uploadDialogVisible3 = true;
      },
      handleRemove4(file) {
        console.log(file);
        let fileList4 = this.$refs.upload4.uploadFiles
        let index = fileList4.findIndex(fileItem => {
          return fileItem.uid === file.uid
        })
        fileList4.splice(index, 1)
      },
      handlePictureCardPreview4(file) {
        this.dialogImageUrl4 = file.url;
        this.uploadDialogVisible4 = true;
      },
      // date
      changeDate1(val) {
        console.log(val)
      },
      // 查看专业技能分
      lookDg(pid,wid,n) {
        if(n === 0 || n === 2){
          this.testDialogVisible = true
        } else if(n === 1) {
          this.testDialogVisible3 = true
        }
        // type:0理论 1专家评分 2素质礼仪题 3系统评分
        let params = {
          pid: pid,
          token: this.getUsers.token,
          type: n===0?0:n===2?2:1,
          wid: wid
        }
        lookAnswer(params).then(res =>{
          console.log(res)
        })
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.h20{
  height:20px;
  background:#F5F5F5;
  margin-bottom:10px;
}

.testList{
  .testList-md{
    padding:0 9px;
    p,.testList-title{
      font-size: 16px;
      color: #111;
      font-weight: 600;
    }
    .testList-title{
      margin-top: 10px;
      margin-bottom: 20px;
      font-weight: 600;
    }
    .testList-cont{
      margin-top: 30px;
    }
    .testList-row{
      margin-bottom: 34px;
      .el-radio{
        font-size: 16px;
        color: #111;
        font-weight: 600;
      }
    }
    .red{
      font-size: 16px;
      color: #f00;
      font-weight: 400;
    }
  }
}

.ltest{
  .ltest-hd{
    font-size: 16px;
    font-weight: 400;
    color: #656566;
    margin-bottom: 12px;
    padding: 0 24px;
  }
  .ltest-bd{
    margin-bottom: 25px;
    padding: 0 60px;
    .ltest-bt{
      width: 24px;
      height:24px;
      line-height: 24px;
      -moz-border-radius: 100%;
      border-radius: 100%;
      background: #00CA41;
      font-size: 14px;
      font-weight: 400;
      color:#fff;
      text-align: center;
      margin-right: calc((100% - 240px)/9);
      cursor: pointer;
      &:last-child{
        margin-right: 0;
      }
    }
    .ltest-bt.on{
      background: #FF5A5A;
    }
  }
}
.ltest-title{
  width: 100%;
  background: #F9F9F9;
  line-height: 38px;
  padding: 0 24px;
  font-size: 16px;
    font-weight: 400;
  .el-col-10{
    color:#111;
  }
  .el-col-14{
    color:#656666;
    text-align: right;
  }
}
.ltest-select{
  margin-top: 18px;
}
.ltest-stitle{
  line-height: 24px;
  font-size: 16px;
  font-weight: 400;
  color:#111;
  padding: 0 60px;
  margin-bottom: 20px;
}
.ltest-scont{
  margin: 0 70px;
  .el-row{
    line-height: 42px;
    background: #F9F9F9;
    font-size: 14px;
    font-weight: 400;
    color:#999999;
    margin-bottom: 10px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    padding-left: 20px;
  }
  .el-row.on1{
    background: #00CB49;
    color:#fff;
  }
  .el-row.on2{
    background: #FF9898;
    color:#fff;
  }
}
.zqdn{
  padding-left:70px;
  font-size: 14px;
  font-weight: 400;
  color:#f00;
}
.ltest-close{
  margin-top: 50px;
  text-align: center;
  .el-button{
    width: 260px;
    height: 40px;
    line-height: 40px;
    background: #1882FC;
    border-radius:20px;
    font-size: 16px;
    font-weight: 400;
    color:#fff;
  }
}
.ltest-score{
  padding:0 24px;
  .ltest-score-hd{
    font-size: 16px;
    font-weight: 400;
    color:#111;
    margin-bottom: 20px;
  }
  .ltest-score-bd{
    padding-left: 30px;
    .el-radio-button{
      margin-right: 20px;
      -moz-border-radius: 5px;
      border-radius: 5px;
    }
  }
}
.ltest-score .el-form-item{
  position: relative;
}
.ltest-score .el-form-item.on::before{
  content:'';
  display:block;
  width: 100%;
  background:rgba(255,255,255,.3);
  position: absolute;
  top: 0;
  left:0;
  bottom: 0;
  z-index: 10;
}
</style>

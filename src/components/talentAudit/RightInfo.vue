<template>
  <div class="tin-right" :class="activeName !== 'first'?'on':'on2' ">
    <div class="testList">
      <div class="tdpay flexbox flex-direction-column" v-if="activeName == 'first'">
          <div class="tdpay-hd">今日认证付款</div>
          <div class="tdpay-bd flexauto">
            <ul class="ul-list" :class="{anim:animate}" @mouseenter="Stop" @mouseleave="Up">
              <li v-for="(item,index) in noticeList" :key="index" class="clearfix">
                <span class="s1">{{item.date}}</span> <span class="s2">{{item.phoneNumber}}</span>
              </li>
            </ul>
          </div>
      </div>
      <el-row class="theory" v-if="activeName !== 'first'">
        <div class="theory-list" style="padding-bottom:0">
          <div class="testList-hd clearfix" v-if="JSON.stringify(getTalent)!='{}'">
            <span>{{getcommonFun.tabKey(getTalent.pid)}}</span>
            <a href="javascript:void(0);" class="delay"  @click="delayClick(activeName,getTalent.id,getTalent.uid,getTalent.pid)">
              <template v-if="activeName == 'second' || activeName == 'third'"><img :src="reUrl" alt="">未通过</template>
              <template v-if="activeName == 'fourth' && getTalent.healthStatus != 3"><img :src="reUrl" alt="">理论测试</template>
            </a>
            <div class="testList-hdline1"></div>
          </div>
          <div class="testList-bd">
            <div style="height:0;"><div ref="twidth"></div></div>
            <el-row class="tscore" v-if="detail.skills && detail.skills.length > 0">
              <el-tabs v-model="activeName2" type="card" class="tscore-hd">
                <el-tab-pane :label="getcommonFun.tabKey(item.pid)" :name="String(detail.skills.length)" v-for="(item,index) in detail.skills" :key="index">
                  <el-row>
                    <el-col :span="12" class="bold1">理论测试分</el-col>
                    <el-col :span="12" class="green" v-if="activeName !='first'">
                      <template v-if="getTalent.skill">
                        <el-col :span="12">
                          <el-col>
                            <span id="score1" ref="score1">{{getTalent.skill.status == 2 || getTalent.skill.status == 3?getTalent.skill.score:'--'}}</span>
                            <template v-if="getTalent.skill.status == 2 || getTalent.skill.status == 3">分</template>
                          </el-col>
                        </el-col>
                        <el-col :span="12" v-if="getTalent.skill.status == 2 || getTalent.skill.status == 3">
                          <el-button class="look" @click="lookDg(item.pid,item.wid,0)">查看</el-button>
                        </el-col>
                      </template>
                      <el-col :span="12" id="score1" v-else>--</el-col>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12" class="bold1">实操测试分</el-col>
                    <el-col :span="12" class="green">
                      <el-col v-if="activeName == 'second'">--</el-col>
                      <template v-if="activeName == 'third' || activeName == 'fourth'">
                        <el-col v-if="getTalent.skillOperation">
                          <el-col :span="12" :class="getTalent.skillOperation.status == 2?'green':'brown'">
                            <el-col><span id="score2">{{getTalent.skillOperation.score}}</span>分</el-col>
                          </el-col>
                          <el-col :span="12">
                            <el-button class="look" @click="lookDg(item.pid,item.wid,1)">查看</el-button>
                          </el-col>
                        </el-col>
                        <el-col :span="12" class="green" id="score2" v-else>--</el-col>
                      </template>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12" class="bold1">基本资料分</el-col>
                    <el-col :span="12" class="green">
                      <el-col v-if="activeName == 'second'">--</el-col>
                      <el-col v-if="activeName == 'third' || activeName == 'fourth'">
                        <el-col v-if="getTalent.record"><span id="score3">{{getTalent.record.score}}</span>分</el-col>
                        <el-col id="score3" v-else>--</el-col>
                      </el-col>
                    </el-col>
                  </el-row>
                  <el-row v-if="activeName == 'third' || activeName == 'fourth'">
                    <el-col :span="12" class="bold1" v-if="getTalent.record">综合测试分</el-col>
                    <el-col :span="12" class="bold1" v-else></el-col>
                    <el-col :span="12" class="red">
                      <el-col v-if="getTalent.record">{{totalScore?totalScore+'分':'--'}}</el-col>
                    </el-col>
                  </el-row>
                  <el-row class="tping" v-if="activeName == 'third' || activeName == 'fourth'">
                    <el-row class="tping-hd" style="margin-bottom:0" v-if="getTalent.record">
                      <el-col :span="8">岗位级别：</el-col>
                      <el-col :span="16">
                        <template v-if="detail.level && detail.level.length > 0">
                        <el-row v-for="(sitem,index) in detail.level" :key="index">
                          <template v-if="totalScore > 64">
                            {{getcommonFun.tabKey(sitem.id)}}{{'T'+sitem.lv+'级'}}
                          </template>
                          <template v-else>--</template>
                        </el-row>
                        </template>
                        <el-row v-else><el-col :span="12">--</el-col></el-row>
                      </el-col>
                    </el-row>
                  </el-row>
                </el-tab-pane>
              </el-tabs>
            </el-row>
            <el-row class="tscore" v-else>
              <div class="zwsj">
                <img :src="zwsjImg" alt=""><br />
                暂无数据
              </div>
            </el-row>
          </div>
        </div>
        <div class="theory-list hd">
          <div class="testList-hd clearfix">
            <span>基本资料</span>
            <div class="testList-hdline1"></div>
          </div>
          <div class="testList-bd hd">
            <div class="p15" v-if="getTalent.record">
              <div class="testList-bd">
                <el-row class="tb1" style="border-bottom:0">
                  <el-row style="margin-bottom:4px;" class="flexbox">
                    <el-col :span="12" style="padding-right:10px;">
                      <template v-if="detail.photos && detail.photos.length > 0">
                        <template v-for="(item,index) in detail.photos">
                          <el-row class="headimg" :key="index" style="height:100%;" v-if="item.picType == 10">
                            <template v-for="(sitem,index) in item.pic">
                              <img :src="sitem.path | imgFormat" alt="" class="user-img" :key="index+'sitem'">
                            </template>
                          </el-row>
                          <el-row class="hdimg" :key="index" style="height:100%;" v-else>暂无形象照</el-row>
                        </template>
                      </template>
                      <el-row class="headimg" v-else>暂无形象照</el-row>
                    </el-col>
                    <el-col :span="12">
                      <el-row>
                        <el-col class="gray">姓名：<span class="blak" style="margin-left:2px">{{detail.name?detail.name:'--'}}</span></el-col>
                      </el-row>
                      <el-row>
                        <el-col class="gray">年龄：<span class="blak" style="margin-left:2px">{{detail.birthday?(new Date().getFullYear()) - (detail.birthday+'').substr(0,4):'--'}}</span></el-col>
                      </el-row>
                      <el-row>
                        <el-col class="gray">身高：
                          <span class="blak" style="margin-left:2px" v-if="detail.stature">{{detail.stature?detail.stature+'cm':'--'}}</span>
                          <span class="blak" style="margin-left:2px" v-else>--</span>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col class="gray">籍贯：<span class="blak" style="margin-left:2px">{{detail.nativePlace ?this.getcommonFun.province(detail.nativePlace):'--'}}</span></el-col>
                      </el-row>
                      <el-row>
                        <el-col class="gray">工作年限：
                          <span class="blak" style="margin-left:2px" v-if="detail.workYear">{{detail.workYear? detail.workYear+'年':'--'}}</span>
                          <span class="blak" style="margin-left:2px" v-else>--</span>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </el-row>
                <el-collapse v-model="activeNames">
                  <el-collapse-item title="健康证明" name="1">
                    <el-row class="tb1" style="border-bottom:0">
                        <el-row class="healthImgList">
                          <template v-if="detail.photos && detail.photos.length > 0">
                            <span v-for="(item,index) in detail.photos" :key="index">
                              <template v-if="item.picType == 4">
                                <el-col :span="8" v-for="sitem in item.pic" :key="sitem.id" :style="{'height':pdb+'px'}">
                                  <el-row class="healthImgItem">
                                    <el-image  :src="sitem.path | imgFormat" :preview-src-list="picArr41"></el-image>
                                  </el-row>
                                </el-col>
                              </template>
                              <el-col :span="8" v-else style="display:none"></el-col>
                            </span>
                          </template>
                          <template v-else>--</template>
                        </el-row>
                    </el-row>
                  </el-collapse-item>
                  <el-collapse-item title="基本资料" name="2">
                    <el-row class="tb1" style="border-bottom:0">
                        <el-row>
                          <el-col class="gray">属相：
                            <span class="blak">{{detail.chineseZodiac?this.getcommonFun.chineseZodiac(detail.chineseZodiac):'--'}}</span>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col class="gray">婚姻：
                            <span class="blak">{{detail.maritalStatus == 0?'已婚':detail.maritalStatus == 1?'未婚':detail.maritalStatus == 2?'离异':''}}</span>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col class="gray">学历：
                            <span class="blak">{{detail.education?this.getcommonFun.tabKey(detail.education):'--'}}</span>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col class="gray">出生日期：
                            <span class="blak">{{detail.birthday?(detail.birthday+'').substr(0,10):'--'}}</span>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col class="gray">宗教信仰：
                          <span class="blak">
                            <span v-if="detail.faith == 0">无</span>
                            <span v-if="detail.faith == 1">基督教</span>
                            <span v-if="detail.faith == 2">佛教</span>
                          </span>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col class="gray">政治面貌：
                          <span class="blak">
                            <span v-if="detail.partyMember == 0">无</span>
                            <span v-if="detail.partyMember == 1">党员</span>
                            <span v-if="detail.partyMember == 2">团员</span>
                          </span>
                          </el-col>
                        </el-row>
                    </el-row>
                  </el-collapse-item>
                  <el-collapse-item title="工作技能" name="4">
                    <el-row class="tb1" style="border-bottom:0">
                      <el-row>
                        <el-col class="gray">认证技能：
                        <template v-if="detail.skills && detail.skills.length > 0">
                          <span :span="12" class="blak" v-for="(item,index) in detail.skills" :key="index">{{getcommonFun.tabKey(item.pid)}}</span>
                        </template>
                        <span :span="12" class="blak" v-else>--</span>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col class="gray">工作性质：
                        <template v-if="workProp && workProp.length > 0">
                          <span class="blak" v-for="(item,index) in workProp" :key="index">
                            {{item == 0?'白班':'住家'}}
                          </span>
                        </template>
                        <span class="blak" v-else>--</span>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col class="gray">个人特长：
                          <span class="blak">{{speciality && speciality.length ?getcommonFun.tabKey(this.speciality+''):'--'}}</span>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col class="gray">可工作区域：
                          <span class="blak">{{detail.workPlace && detail.workPlace.length ?getcommonFun.tabKey(detail.workPlace+''):'--'}}</span>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col class="gray">期盼工资：
                        <template v-if="detail.skills && detail.skills.length > 0">
                          <span class="blak" v-for="(item,index) in detail.skills" :key="index">{{item.expectedSalary+'k'}}</span>
                        </template>
                        <span class="blak" v-else>--</span>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col class="gray">工作年限：
                        <span class="blak" v-if="detail.workYear">{{detail.workYear === null?'--':detail.workYear+'年'}}</span>
                        <span class="blak" v-else>--</span>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-row class="gray" style="margin-bottom:4px">工作经验：</el-row>
                        <div v-if="detail.workerExperience && detail.workerExperience.length > 0">
                        <div class="exp clearfix" v-for="(item,index) in detail.workerExperience" :key="index">
                          <div class="exp1">
                            <span class="exp-bd"></span>
                            <div class="exp-line"></div>
                          </div>
                          <div class="exp2">
                            <div class="exp-title">{{getcommonFun.tabKey(item.workType)}} {{item.startTime}} - {{item.endTime}}</div>
                            <div class="exp-cont gray">{{item.desc}}</div>
                          </div>
                        </div>
                        </div>
                        <div v-else>--</div>
                      </el-row>
                    </el-row>
                  </el-collapse-item>
                  <el-collapse-item title="家庭情况" name="3">
                    <el-row class="tb1" style="border-bottom:0">
                        <el-row v-for="(item,index) in detail.workerFamilies" :key="index" style="margin-bottom:.1rem;">
                          <el-row>
                            <el-col :span="12" class="blak">
                              <span class="el-icon-user-solid"></span>
                              <span style="padding-left:.2rem;">{{item.name}}({{item.relationship == 1?'配偶':item.relationship == 2?'子女':item.relationship == 3?'父母':'亲友'}})</span>
                            </el-col>
                            <el-col :span="12" class="gray" style="text-align:right;padding-right:.1rem">{{item.phone}}</el-col>
                          </el-row>
                          <el-row class="gray">
                            <span class="el-icon-user-solid" style="opacity:0;"></span>
                            <span style="padding-left:.2rem;">{{item.description !== null?item.description:'--'}}</span>
                          </el-row>
                        </el-row>
                    </el-row>
                  </el-collapse-item>
                  <el-collapse-item title="自我评价" name="5">
                    <el-row class="tb1" style="border-bottom:0">
                      <!-- <el-row class="gray">自我评价</el-row> -->
                      <el-row class="gray" style="margin-bottom:.2rem">
                        个人标签：
                        <span class="blak">
                          {{detail.style && detail.style.length > 0?getcommonFun.tabKey(detail.style+''):'--'}}
                          {{detail.personality && detail.personality.length > 0?'性格'+getcommonFun.tabKey(detail.personality+''):'--'}}
                        </span>
                      </el-row>
                      <template v-if="detail.assessment">
                        <el-row class="zwpj" v-if="instr == 0">
                          <el-col :span="8" class="zwpj-video" :style="{'height':pdb+'px'}">
                            <video :src="detail.assessment | imgFormat" id="video" width="100%" controls="controls">
                                Your browser does not support the video tag.
                            </video>
                            <div class="video-img" v-show="vdshow"></div>
                            <div class="video-play el-icon-video-play" v-show="vdshow2"></div>
                            <div class="video-zhe" @click="vdClick()"></div>
                          </el-col>
                        </el-row>
                        <el-row class="zwpj" v-else>{{detail.assessment}}</el-row>
                      </template>
                      <el-row class="zwpj" v-else>--</el-row>
                    </el-row>
                  </el-collapse-item>
                  <el-collapse-item title="认证照片" name="6">
                    <el-row class="tb1 pto" style="border-bottom:0">
                      <template v-if="detail.photos && detail.photos.length > 0">
                        <span v-for="(item,index) in detail.photos" :key="index">
                          <!-- 1阿姨生身活照，2身份证，3技能证书，4体检，5个人菜品等照片，6学历，7驾驶证，8护照，9港澳通行证, 10个人形象照 -->
                          <!-- 2证件照 -->
                          <template v-if="item.picType == 2" >
                            <el-col :span="8" v-for="sitem in item.pic" :key="sitem.id" :style="{'height':pdb+'px'}">
                                  <el-row class="idPhoto on" >
                                    <el-image  :src="sitem.path | imgFormat" :preview-src-list="picArr21"></el-image>
                                  </el-row>
                            </el-col>
                          </template>
                          <!-- 学历 -->
                          <template v-if="item.picType == 6" >
                            <el-col :span="8" v-for="sitem in item.pic" :key="sitem.id" :style="{'height':pdb+'px'}">
                                  <el-row class="idPhoto on">
                                    <el-image  :src="sitem.path | imgFormat" :preview-src-list="picArr61"></el-image>
                                    <el-row class="dClick" @click.native="dClick(item.id,sitem.id)">x</el-row>
                                  </el-row>
                            </el-col>
                          </template>
                        </span>
                      </template>
                      <el-row v-else>--</el-row>
                    </el-row>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </div>
            <div class="zwsj" v-else>
              <img :src="zwsjImg" alt=""><br />
              暂无数据
            </div>
          </div>
        </div>
      </el-row>
    </div>
    <!-- 自我评价视频不全屏 -->
    <el-dialog :visible.sync="fullscreen" class="assessment" :close-on-click-modal="false" :show-close="false">
      <a href="javascript:void(0);" @click="closeAssessment" class="close-assessment closed"></a>
      <div class="assessment-video">
        <video :src="detail.assessment | imgFormat" id="video" width="100%" controls="controls" autoplay="autoplay" ref="vd">
            Your browser does not support the video tag.
        </video>
      </div>
    </el-dialog>
     <!-- 理论测试 -->
     <el-dialog :title="'专业技能'+`${getcommonFun.tabKey(keyName)}`+'测试'" :visible.sync="testDialogVisible" :close-on-click-modal="false" width="30%" center class="addDialog active on">
      <el-row >
        <el-row class="ltest" :class="cur1 == item.id?'on':''" v-for="item in ltest" :key="item.id">
          <el-row class="ltest-hd">
            {{getcommonFun.getSubName(item.pid,item.pidSmallType)}}
            {{item.pid == 120?'素质礼仪题':''}}
            <span class="brown" v-if="item.status == 1">(通过)</span>
            <span class="brown" v-else>(未通过)</span>
          </el-row>
          <el-row class="ltest-bd">
            <el-col class="ltest-bt" :class="subItem.answer != subItem.bodyAnswer?'on':''" v-for="(subItem,index2) in item.examQuestions" :key="index2" @click.native="ltstClick(index2,item.id)">{{index2+1}}</el-col>
          </el-row>
        </el-row>
        <el-row class="ltest-tabcont" :class="cur1 == item.id?'on':''" v-for="(item,index) in ltest" :key="index">
        <el-row class="ltest-container" v-for="(subItem,idx1) in item.examQuestions" :key="idx1" :class="cur == idx1?'on':''">
          <el-row class="ltest-title">
            <el-col :span="10">{{subItem.more == 1?'多选题':subItem.more == 2?'问答题':'单选题'}}</el-col>
            <el-col :span="14">{{idx1+1}}/{{item.examQuestions.length}}</el-col>
          </el-row>
          <el-row class="ltest-select">
            <el-row class="ltest-stitle">{{idx1+1}}、{{subItem.info}}</el-row>
            <el-row class="ltest-scont">
              <el-row :class="subItem.answer.indexOf(i) != -1?'on1':subItem.bodyAnswer.indexOf(i) != -1 && subItem.answer != subItem.bodyAnswer?'on2':''"
                      v-for="(v,i) in subItem.options" :key="i">
                <template v-if="v !=''">
                  <span v-for="(letter,idx) in letters[i]" :key="idx">{{letter}}、</span>{{v}}
                </template>
                <template v-else></template>
              </el-row>
            </el-row>
            <el-row class="zqdn" :key="idx1">正确答案：{{getcommonFun.getLetter(subItem.answer)}}</el-row>
          </el-row>
        </el-row>
        <el-row class="ltest-close" v-if="activeName != 'fourth'">
          <el-button @click="testDialogVisible = false">取消</el-button>
          <el-button v-if="reTest == '确认'" @click="testDialogVisible = false">确认</el-button>
          <el-button v-if="reTest == '重新测试'" @click="reTestDialog(getTalent.id,getTalent.pid,getTalent.uid)" :class="getTalent.skill.status != 3?'on':''" :disabled="getTalent.skill.status != 3?true:false">重新测试</el-button>
        </el-row>
        </el-row>
      </el-row>
    </el-dialog>
    <!-- 专家评估分 -->
    <el-dialog title="专家评估分" :visible.sync="testDialogVisible3" :close-on-click-modal="false" width="300px" center class="addDialog active">
      <el-row class="expert" v-for="(item,index) in ltest" :key="index">
        <el-row v-if="item.pidSmallType == 1">
          <el-col :span="6">专业度：</el-col>
          <el-col :span="18" class="green">{{item.score+'分'}}</el-col>
        </el-row>
        <el-row v-if="item.pidSmallType == 2">
          <el-col :span="6">熟练度：</el-col>
          <el-col :span="18" class="green">{{item.score+'分'}}</el-col>
        </el-row>
        <el-row v-if="item.pidSmallType == 3">
          <el-col :span="6">服务意识：</el-col>
          <el-col :span="18" class="green">{{item.score+'分'}}</el-col>
        </el-row>
        <el-row v-if="item.pidSmallType == 4">
          <el-col :span="6">礼仪礼节：</el-col>
          <el-col :span="18" class="red">{{item.score+'分'}}</el-col>
        </el-row>
        <el-row v-if="item.pidSmallType == 5">
          <el-col :span="6">个人习惯：</el-col>
          <el-col :span="18" class="red">{{item.score+'分'}}</el-col>
        </el-row>
      </el-row>
      <el-row class="expert">
        <el-col :span="6">主要擅长：</el-col>
        <el-col :span="18" v-if="detail.tag && detail.tag.length > 0">{{getcommonFun.tabKey(detail.tag+'')}}</el-col>
        <el-col :span="18" v-else>--</el-col>
      </el-row>
      <el-row class="expert">
        <el-col :span="6">专家评价：</el-col>
        <el-col :span="18">{{detail.assessorComment?detail.assessorComment:'--'}}</el-col>
      </el-row>
      <el-row class="expert hd">
        <el-button @click="testDialogVisible3 = false">确定</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import imgurl from '@/utils/common.js'
import { lookAnswer,fail,del } from '@/api/api'
import { zwsjImg,} from '@/utils/imgConfig.js'
export default{
  data(){
    return{
      zwsjImg,
      reUrl:"",
      animate:false,
      activeNames:"",
      imgHeight:65,
      vdshow: true,
      vdshow2: true,
      fullscreen:false,
      cur: 0,
      cur1: 0,
      activeName2: '1',
      testDialogVisible: false,
      testDialogVisible3: false,
      ltest:[],
      letters:['A','B','C','D','E','F','G','H','I','J','K','L','M','N'],
      reTest:"确认",
      animate: false
    }
  },
  props:{
    activeName:{
      type:String,
      default:""
    },
    noticeList:{
      type:Array,
      default:[]
    },
    detail:{
      type:Object,
      default:{}
    },
    totalScore:{
      type:Number,
      default:0
    },
    instr:{
      type:Number,
      default:0
    },
    keyName:{
      type:Number,
      default:0
    }
  },
  computed:{
    ...mapGetters([
      'getTalent',
      'getUsers' 
    ]),
    speciality(){
      this.detail.photos&&this.detail.skills.forEach(item =>{
        return item.speciality
      })
    },
    workProp(){
      this.detail.photos&&this.detail.skills.forEach(item =>{
        return item.workProp
      })
    },
    picArr21(){ // 身份证照片
      let arr=[];
      this.detail.photos&&this.detail.photos.forEach(item =>{
        if(item.picType == 2){
          if(item.pic && item.pic.length > 0){
            item.pic.forEach(pic =>{
              arr.push(imgurl + pic.path)
            })
          }
        }
      })
      return arr;
    },
    picArr41(){// 健康证明照片
      let arr=[];
      this.detail.photos&&this.detail.photos.forEach(item =>{
        if(item.picType == 4){
          if(item.pic && item.pic.length > 0){
            item.pic.forEach(pic =>{
              arr.push(imgurl + pic.path)
            })
          }
        }
      })
      return arr;
    },
    picArr61(){// 学历照片
      let arr=[];
      this.detail.photos.forEach(item =>{
        if(item.picType == 6){
          if(item.pic && item.pic.length > 0){
            item.pic.forEach(pic =>{
              arr.push(imgurl + pic.path)
            })
          }
        }
      })
      return arr;
    },
    pdb() {
      return this.imgHeight
    }
  },
  methods:{
    ScrollUp() {// 今日认证付款
      this.intNum = setInterval(() => {
          this.animate = true
          setTimeout(() => {
            this.noticeList.push(this.noticeList[0])
            this.noticeList.shift()
            this.animate = false
          }, 500)
        }, 1000)
      },
    Stop() {
      clearInterval(this.intNum)
    },
    Up() {
      this.ScrollUp()
    },
    vdClick() {
      this.fullscreen = true
    },
    closeAssessment(){
      this.fullscreen = false
    },
    delayClick(name,id,uid,pid) {// 未通过
      if(name == 'second' || name == 'third'){
        let params = {
          app: 3,
          device: 5,
          id: id,
          phone: '',
          pid: pid,
          token: this.getUsers.token,
          uid: uid
        }
        fail(params).then(res =>{
          if(res.code == 200) {
            this.$router.push("/talentFailed")
          } else {
            this.$message.error({ message: res.msg, offset: 50 })
          }
        })
      }
    },
    lookDg(pid,wid,n) {// 查看专业技能分
      this.cur = 0
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
        if(res.code == 200) {
          this.ltest = res.data.workerScores
          for(var k in res.data.workerScores){
            this.cur1 = res.data.workerScores[0].id
          }
          if(res.data.status == 1) {
            this.reTest = '确认'
          } else {
            this.reTest = '重新测试'
          }
        }else{
          this.$message.error({ message:res.msg})
        }
      })
    },
    reTestDialog(id, pid1, uid1){// 重新测试
      this.$confirm('','操作', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        message: '确认对此雇员重新进行理论测试？'
      }).then(() => {
        let params = {
          app: 3,
          device: 5,
          id: id,
          phone: '',
          pid: pid1,
          token: this.getUsers.token,
          uid: uid1,
        }
        reAnswer(params).then(res => {
          if(res.code == 200) {
            this.testDialogVisible = false
            if(this.activeName == 'second') {
              this.$emit('updateList');
            }
          }
        })
      }).catch(() => {
        this.testDialogVisible = false
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
    },
    dClick(id,childid){
      this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {// 删除认证照片
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          childId: childid,
          delData: 2,// 是否删除数据 1不删除 2删除
          id: id,
          token: this.getUsers.token
        }
        del(params).then(res =>{
          if(res.code == 200) {
            this.$emit('updateDetail')
            this.$message({
              type: 'success',
              message: '删除成功！'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    ltstClick(v,id){// 查看专业技能分弹窗
      this.cur = v
      this.cur1 = id
    }
  },
  mounted(){
   this.$nextTick(()=>{
    if(this.activeName==='first'){
        this.ScrollUp()
      }
   })
  }
}
</script>
<style  lang="scss" scoped >
.ltest{
  .ltest-hd{
    font-size: 16px;
    font-weight: 400;
    color: #202D40;
    margin-bottom: 12px;
    padding: 0 24px;
    span{
      color: #FF9A00;
      font-size: 14px;
    }
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
      margin-bottom: 10px;
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
    font-weight: 400;
    color:#202D40;
  }
  .el-col-14{
    color:#111;
    font-weight: 400;
    text-align: right;
  }
}
.ltest-select{
  margin-top: 18px;
}
.ltest-container{
  display: none;
}
.ltest-container.on{
  display: block;
}
.ltest-stitle{
  line-height: 24px;
  font-size: 16px;
  font-weight: 400;
  color:#202D40;
  padding: 0 60px;
  margin-bottom: 20px;
}
.ltest-scont{
  margin: 0 70px;
  .el-row{
    line-height: 32px;
    background: #F9F9F9;
    font-size: 14px;
    font-weight: 400;
    color:#8592A6;
    margin-bottom: 10px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    padding-left: 20px;
    padding-right: 20px;
    // white-space: nowrap;
    // overflow: hidden;
    // text-overflow: ellipsis;
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
    width: 120px;
    height: 40px;
    line-height: 40px;
    background: #1882FC;
    border-radius:4px;
    font-size: 16px;
    font-weight: 400;
    color:#fff;
    &:first-child{
      background: #ccc;
    }
  }
  .el-button.on{
    background: #ccc;
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

.ltest-tabcont{
  display: none;
}
.ltest-tabcont.on{
  display: block;
}

.tdpay{
  height: 100%;
  .tdpay-hd{
    line-height: 0.18rem;
    font-size: 0.18rem;
    font-weight: 600;
    color: #010000;
    margin-bottom: 0.25rem;
  }
  .tdpay-bd{
    height: calc(100% - .2rem);
    overflow: hidden;
    .ul-list{
      transition: top 0.5s;
      li{
        line-height:50px;
        font-size: 16px;
        color: #424C58;
        padding:0 10px;
        .s1,.s2{
          float: left;
        }
        .s2{
          float: right;
        }
      }
    }
    .anim{
      transition: all 0.5s;
      margin-top: -50px;
    }
  }
}

.healthImgList{
  .el-col-8{
    overflow: hidden;
  }
  .healthImgItem{
    height: 100%;
    padding-right: 5px;
    padding-bottom: 5px;
    .el-image{
      height:100%;
      border-radius: 4px;
      img{
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }
    }
  }
}

.zwpj{
  .zwpj-video{
    position:relative;
    border-radius: 4px;
    .video-img{
      width:100%;
      background:rgba(0,0,0,.7);
      position:absolute;
      top:0;
      left:0;
      bottom:0;
      z-index: 10;
      border-radius: 4px;
      cursor: pointer;
    }
    .video-play{
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 20;
      -webkit-transform: translate(-50%,-50%);
      -ms-transform: translate(-50%,-50%);
      transform: translate(-50%,-50%);
      font-size: 16PX;
      color: #fff;
      cursor: pointer;
    }
    .video-zhe{
      width: 100%;
      height: 100%;
      position: absolute;
      top:0;
      left: 0;
      cursor: pointer;
      z-index: 101;
    }
  }
}
#video{
  width:100%;
  height: 100%;
  border-radius: 4px;
}
.dClick{
  width: 20px;
  height:20px;
  line-height: 20px;
  background: #000;
  border-radius: 50%;
  font-size: 16px;
  color: #fff;
  text-align: center;
  position: absolute;
  top:-3px;
  right:-3px;
  cursor: pointer;
}
// 今日认证付款隐藏
.talentAudit.on{
  right:20px;
}
</style>
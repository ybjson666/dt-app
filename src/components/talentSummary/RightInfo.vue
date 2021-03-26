<template>
  <div class='tin-right on2'>
      <div v-if="!isOn">
        <div class="testList flexbox flex-direction-column">
          <div class="testList-hd clearfix" style="padding-left:0;">
            档案编号：{{detail.id}}
            <!-- <a href="javascript:void(0);" class="collect" :class="isCollect?'on':''" @click="collectClick(getTalent.id)">
              <img :src="clImg1" alt="" class="cl1">
              <img :src="clImg2" alt="" class="cl2">
            </a> -->
          </div>
          <div class="testList-bd auto flexauto" style="margin-top:.15rem;">
            <el-row class="tb1">
              <div v-if="JSON.stringify(detail)!='{}'">
                  <el-row class="flexbox" style="margin-bottom:4px;">
                    <el-col :span="12" style="padding-right:10px;">
                      <template v-if="detail.photos && detail.photos.length > 0">
                        <template v-for="(item,index) in detail.photos">
                        <el-row class="headimg" style="height:100%;" :key="index" v-if="item.picType == 10">
                          <template v-for="(sitem,index) in item.pic">
                            <img :src="sitem.path | imgFormat" alt="" class="user-img" :key="index+'pic2'">
                          </template>
                        </el-row>
                        <el-row class="headimg" v-else style="display:none;" :key="index">暂无形象照</el-row>
                        </template>
                      </template>
                      <el-row v-else>暂无形象照</el-row>
                    </el-col>
                    <el-col :span="12">
                      <el-row>
                        <el-col class="gray">
                          姓名:
                          <span class="blak" style="margin-left:2px">{{detail.name||'--'}}</span>
                          <span class="status">{{detail.status == 2?'(等单中...)':detail.status == 3?'(已上岗...)':detail.status == 4?'(暂停中...)':detail.status == 5?'(黑名单...)':''}}</span>
                        </el-col>
                      </el-row>
                      <el-row style="text-align:center">
                        <el-col :span="8">
                          <el-col class="blak">{{(new Date().getFullYear()) - (detail.birthday+'').substr(0,4)||'--'}}</el-col>
                          <el-col class="color4">年龄</el-col>
                        </el-col>
                        <el-col :span="8">
                          <el-col class="blak">{{detail.weight?detail.weight+'kg':'--'}}</el-col>
                          <el-col class="color4">体重</el-col>
                        </el-col>
                        <el-col :span="8">
                          <el-col class="blak">{{detail.stature+'cm'||'--'}}</el-col>
                          <el-col class="color4">身高</el-col>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col class="gray">属相:
                          <span class="blak" style="margin-left:2px">{{getcommonFun.chineseZodiac(detail.chineseZodiac)||'--'}}</span>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col class="gray">籍贯:
                          <span class="blak" style="margin-left:2px">{{getcommonFun.province(detail.nativePlace)||'--'}}</span>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col class="gray">出生日期:
                          <span class="blak" style="margin-left:2px">{{detail.birthday}}</span>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-col class="zx1"><img :src="zxUrl1" alt="">身份认证</el-col>
                    </el-col>
                    <el-col :span="8">
                      <!-- 征信状态 0默认状态 1进行中 2通过 3未通过 4资料不齐 5remove 6禁用 -->
                      <el-col class="zx1" v-if="detail.creditClack == 2"><img :src="zxUrl1" alt="">征信认证</el-col>
                      <el-col class="zx2" v-else><img :src="zxUrl2" alt="">征信认证</el-col>
                    </el-col>
                    <el-col :span="8">
                      <!-- 健康状态 0默认状态 1进行中 2通过 3未通过 4资料不齐 5remove 6禁用 -->
                      <el-col class="zx1" v-if="detail.healthStatus == 2"><img :src="zxUrl1" alt="">健康认证</el-col>
                      <el-col class="zx2" v-else><img :src="zxUrl2" alt="">健康认证</el-col>
                    </el-col>
                  </el-row>
              </div>
              <div class="zwsj" v-else>
                <img :src="zwsjImg" alt=""><br />
                暂无数据
              </div>
            </el-row>
            <el-row class="hline"></el-row>
            <el-row class="tb1">
              <div v-if="JSON.stringify(detail)!='{}'">
                <el-row class="sum-title">
                  <el-col :span="8" class="blak">服务情况</el-col>
                  <el-col :span="16" class="blak" v-if="detail.skills && detail.skills.length > 0">
                    <span v-for="(item,index) in detail.skills" :key="index" style="margin-right:0">{{getcommonFun.tabKey(item.pid)}}</span>
                    <span v-for="(item,index) in detail.level" :key="index+'lv'">T{{item.lv}}级</span>
                  </el-col>
                  <el-col :span="16" class="blak" v-else>--</el-col>
                </el-row>
                <el-row class="sum-title">
                  <el-col :span="8" class="blak">工作性质</el-col>
                  <el-col :span="16" class="blak" v-if="workProp && workProp.length > 0">
                    <span v-for="(item,index) in workProp" :key="index" style="margin-right:2px">{{item == 0?'白班':'住家'}}</span>
                  </el-col>
                  <el-col :span="16" class="blak" v-else>--</el-col>
                </el-row>
                <el-row class="sum-title">
                  <el-col :span="8" class="blak">工作年限</el-col>
                  <el-col :span="16" class="blak" v-if="detail.workYear">{{detail.workYear=== null?'--':detail.workYear+'年'}}</el-col>
                  <el-col :span="16" class="blak" v-else>--</el-col>
                </el-row>
                <el-row class="sum-title">
                  <el-col :span="8" class="blak">最高学历</el-col>
                  <el-col :span="16" class="blak">{{detail.education?this.getcommonFun.tabKey(detail.education):'--'}}</el-col>
                </el-row>
                <el-row class="sum-title">
                  <el-col :span="8" class="blak">个人特长</el-col>
                  <el-col :span="16" class="blak">{{speciality&&speciality.length !== 0?this.getcommonFun.tabKey(speciality+''):'--'}}</el-col>
                </el-row>
                <el-row class="sum-title">
                  <el-row class="gray">可工作区域</el-row>
                  <el-row class="work-area">
                    <template v-if="detail.workPlace && detail.workPlace.length > 0">
                    <el-button v-for="(item,index) in detail.workPlace" :key="index" style="margin-bottom:.1rem">
                      {{getcommonFun.tabKey(item+'')}}
                    </el-button>
                    </template>
                    <template v-else>--</template>
                  </el-row>
                </el-row>
              </div>
              <div class="zwsj" v-else>
                <img :src="zwsjImg" alt=""><br />
                暂无数据
              </div>
            </el-row>
            <el-row class="hline"></el-row>
            <el-row class="tb1">
              <el-row class="grsz">个人标签</el-row>
              <el-row class="sum-title" v-if="JSON.stringify(detail)!='{}'">
                <span class="gray">
                  {{detail.style && detail.style.length > 0?getcommonFun.tabKey(detail.style+''):'--'}}
                  {{detail.personality && detail.personality.length > 0?'性格'+getcommonFun.tabKey(detail.personality+''):'--'}}
                </span>
              </el-row>
              <div class="zwsj" v-else>
                <img :src="zwsjImg" alt=""><br />
                暂无数据
              </div>
            </el-row>
            <el-row class="hline"></el-row>
            <el-row class="tb1" style="border-bottom:0">
              <el-row>
                <el-row class="grsz" style="margin-bottom:4px">工作经历</el-row>
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
                <div class="zwsj" v-else>
                  <img :src="zwsjImg" alt=""><br />
                  暂无数据
                </div>
              </el-row>
            </el-row>
          </div>
        </div>
      </div>
      <!-- 筛选 -->
      <div v-if="isOn">
        <div class="testList flexbox flex-direction-column">
          <div class="testList-hd clearfix" style="padding-left:0;">筛选条件</div>
          <div class="testList-bd auto flexauto" style="margin-top:.15rem;padding-left:0">
            <el-row class="shai">
              <el-col :span="8">服务类型：</el-col>
              <el-col :span="16">
                <el-row class="sel bd">
                <el-cascader placeholder="--请选择--" :options="options" :props="params" v-model="traValue" collapse-tags clearable @change="changeCascader"></el-cascader>
                </el-row>
              </el-col>
            </el-row>
            <el-row class="shai">
              <el-col :span="8">工作经验：</el-col>
              <el-col :span="16">
                <el-select v-model="expValue" placeholder="--请选择--" class="bd">
                  <el-option
                    v-for="item in selExp"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row class="shai">
              <el-col :span="8">可工作区域：</el-col>
              <el-col :span="16" class="selMultple">
                <el-select v-model="workPlace" @change="changeWorkPlace" multiple collapse-tags placeholder="--请选择--" class="bd">
                  <el-option
                    v-for="item in selWork"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row class="shai m30">
              <el-col :span="8">工资范围：</el-col>
              <el-col :span="15">
                <el-row class="rangeVal">
                  <span class="range1" ref="range1" :style="{left:left1}">{{rangeValue1}}</span>
                  <span class="range2" ref="range2" :style="{left:left2}">{{rangeValue2}}</span>
                  <el-slider v-model="rangeValue" range :show-tooltip="false" :min='6' :max='25'  @change="changeRange"></el-slider>
                </el-row>
              </el-col>
            </el-row>
            <el-row class="shai">
              <el-col :span="8">年龄：</el-col>
              <el-col :span="15">
                <el-row class="rangeVal">
                  <span class="range1" ref="range3" :style="{left:left3}">{{rangeValue3}}</span>
                  <span class="range2" ref="range4" :style="{left:left4}">{{rangeValue4}}</span>
                  <el-slider v-model="rangeVal2" range :show-tooltip="false" :min='20' :max='60' @change="changeRange2"></el-slider>
                </el-row>
              </el-col>
            </el-row>
            <el-row class="shai">
              <el-col :span="8">身高：</el-col>
              <el-col :span="15">
                <el-row class="rangeVal">
                  <span class="range1" ref="range5" :style="{left:left5}">{{rangeValue5}}</span>
                  <span class="range2" ref="range6" style="text-indent:-8px" :style="{left:left6}">{{rangeValue6}}</span>
                  <el-slider v-model="rangeVal3" range :show-tooltip="false" :min='150' :max='180' @change="changeRange3"></el-slider>
                </el-row>
              </el-col>
            </el-row>
            <el-row class="shai">
              <el-col :span="8">不考虑籍贯：</el-col>
              <el-col :span="16" class="selMultple">
                <el-select v-model="place" multiple collapse-tags placeholder="--请选择--" class="bd" @change="changePlace">
                  <el-option
                    v-for="(item,index) in getcommonFun.arr"
                    :key="index"
                    :label="item"
                    :value="index">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row class="shai">
              <el-col :span="24">不考虑属相：</el-col>
              <el-col :span="24" class="selanimal">
                <el-checkbox-group v-model="animal" @change="changeAnimal">
                  <el-checkbox-button v-for="(item,index) in selAnimal" :label="item.id" :key="index">{{item.name}}</el-checkbox-button>
                </el-checkbox-group>
              </el-col>
            </el-row>
            <el-row class="tping-bd on" style="margin-top:20px;margin-bottom:30px;" @click.native="seekClick">搜索</el-row>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { clImg1,clImg2,zxUrl1,zxUrl2,zwsjImg} from '@/utils/imgConfig.js'
export default {
name:'',
  data () {
    return {
      isCollect:false,
      clImg1,
      clImg2,
      zxUrl1,
      zxUrl2,
      zwsjImg,
      params: { multiple: true },
      options:[
        {
          value: 1,
          label: '育婴服务',
          children: [
            {
              value: 2,
              label: 'T3级'
            }, 
            {
              value: 3,
              label: 'T4级'
            }, 
            {
              value: 4,
              label: 'T5级'
            }, 
            {
              value: 5,
              label: 'T6级'
            }, 
            {
              value: 6,
              label: 'T7级'
            }
          ]
        }, 
        {
          value: 7,
          label: '月嫂服务',
          children: [
            {
              value: 8,
              label: 'T3级'
            }, 
            {
              value: 9,
              label: 'T4级'
            }, 
            {
              value: 10,
              label: 'T5级'
            }, 
            {
              value: 11,
              label: 'T6级'
            }, 
            {
              value: 12,
              label: 'T7级'
            }
          ]
        }, 
        {
          value: 13,
          label: '家务服务',
          children: [
            {
              value: 14,
              label: 'T3级'
            }, 
            {
              value: 15,
              label: 'T4级'
            }, 
            {
              value: 16,
              label: 'T5级'
            }, 
            {
              value: 17,
              label: 'T6级'
            }, 
            {
              value: 18,
              label: 'T7级'
            }
          ]
        }, 
        {
          value: 19,
          label: '蒙式教育',
          children: [
            {
              value: 20,
              label: 'T3级'
            }, 
            {
              value: 21,
              label: 'T4级'
            }, 
            {
              value: 22,
              label: 'T5级'
            }, 
            {
              value: 23,
              label: 'T6级'
            }, 
            {
              value: 24,
              label: 'T7级'
            }
          ]
        }, 
        {
          value: 25,
          label: '安全护卫',
          children: [
            {
              value: 26,
              label: 'T3级'
            }, 
            {
              value: 27,
              label: 'T4级'
            }, 
            {
              value: 28,
              label: 'T5级'
            }, 
            {
              value: 29,
              label: 'T6级'
            }, 
            {
              value: 30,
              label: 'T7级'
            }
          ]
        }
      ],
      selExp:[
        {
          label: '1年以下',
          value: '0'
        },
        {
          label: '1年',
          value: '1'
        },
        {
          label: '2年',
          value: '2'
        },
        {
          label: '3年以下',
          value: '3'
        },
        {
          label: '3年',
          value: '4'
        }
      ],
      rtaValue:0,
      rangeValue: 6,
      rangeValue1: '6K',
      rangeValue2: '25k+',
      rangeVal2: 20,
      rangeValue3: '20岁',
      rangeValue4: '60岁',
      rangeVal3: 150,
      rangeValue5: '150cm',
      rangeValue6: '180cm',
      language: [],
      selLanguage:[],
      // 籍贯
      place: [],
      selPlace:[],
      // 属相
      animal: [],
      selAnimal:[
        {
          id: 4,
          name: '鼠'
        },
        {
          id: 5,
          name: '牛'
        },
        {
          id: 6,
          name: '虎'
        },
        {
          id: 7,
          name: '兔'
        },
        {
          id: 8,
          name: '龙'
        },
        {
          id: 9,
          name: '蛇'
        },
        {
          id: 10,
          name: '马'
        },
        {
          id: 11,
          name: '羊'
        },
        {
          id: 0,
          name: '猴'
        },
        {
          id: 1,
          name: '鸡'
        },
        {
          id: 2,
          name: '狗'
        },
        {
          id: 3,
          name: '猪'
        }
      ],
      traValue:[],
      expValue: '',
      //工作区域
      workPlace:[],
      selWork:[],
      left1: '',
      left2: '',
      left3: '',
      left4: '',
      left5: '',
      left6: '',
      isCollect:false
    }
  },
  props: {
    isOn:{
      type:Boolean,
      default:false
    },
    detail:{
      type:Object,
      default:{}
    },
  },
  computed:{
    ...mapGetters([
        'getUsers',
        'getSysMetaData'
    ]),
    workProp(){
      this.detail.photos&&this.detail.skills.forEach(item =>{
        return item.workProp
      })
    },
    speciality(){
      this.detail.photos&&this.detail.skills.forEach(item =>{
        return item.speciality
      })
    }
  },
  methods: {
    collectClick(id) {// 收藏
      this.isCollect = !this.isCollect
    },
    changeCascader(val){
      this.rtaValue = val
    },
    changeWorkPlace(val) {//选择工作经验
      this.workPlace = val
    },
    changeWorkPlace(val) {
      this.workPlace = val
    },
    getListDataType() {
      this.getSysMetaData.forEach((item, index) => {
        if (item.pid === 1 && item.status == 1) {
          this.selWork.push(item)
        }
        if (item.pid === 4 && item.status == 1) {
          this.selLanguage.push(item)
        }
      });
    },
    changeRange(val) {//选择工资范围
      this.rangeValue1 = val[0]+'k'
      if(val[1] < 25){
        this.rangeValue2 = val[1]+'k'
      } else {
        this.rangeValue2 = val[1]+'k+'
      }
      if(val) {
        var slideButton1  = document.getElementsByClassName("el-slider__button-wrapper")[0]
        var slideButton2  = document.getElementsByClassName("el-slider__button-wrapper")[1]
        var val1 = slideButton1.style.left
        var val2 = slideButton2.style.left
        this.left1 = val1
        this.left2 = val2
        if(parseFloat(val2) < parseFloat(val1)) {
          this.rangeValue1 = this.rangeValue[1]+'k'
          this.rangeValue2 = this.rangeValue[0]+'k'
        }
      }
      if(this.rangeValue[0] == 6){
        this.$refs.range1.style.left = -4+'PX'
      }
      if(this.rangeValue[1] == 25){
        this.$refs.range2.style.left = 80+'%'
      }
    },
    changeRange2(val) {//选择年龄
      this.rangeValue3 = val[0]+'岁'
      this.rangeValue4 = val[1]+'岁'
      if(val) {
        var slideButton3  = document.getElementsByClassName("el-slider__button-wrapper")[2]
        var slideButton4  = document.getElementsByClassName("el-slider__button-wrapper")[3]
        var val3 = slideButton3.style.left
        var val4 = slideButton4.style.left
        this.left3 = val3
        this.left4 = val4
        if(parseFloat(val4) < parseFloat(val3)) {
          this.rangeValue3 = this.rangeVal2[1]+'岁'
          this.rangeValue4 = this.rangeVal2[0]+'岁'
        }
      }
      if(this.rangeVal2[0] == 20){
        this.$refs.range3.style.left = -4+'PX'
      }
      if(this.rangeVal2[1] == 60){
        this.$refs.range4.style.left = 90+'%'
      }
    },
    changeRange3(val) {//选择身高
      this.rangeValue5 = val[0]+'cm'
      this.rangeValue6 = val[1]+'cm'
      if(val) {
        var slideButton5  = document.getElementsByClassName("el-slider__button-wrapper")[4]
        var slideButton6  = document.getElementsByClassName("el-slider__button-wrapper")[5]
        var val5 = slideButton5.style.left
        var val6 = slideButton6.style.left
        this.left5 = val5
        this.left6 = val6
        if(parseFloat(val6) < parseFloat(val5)) {
          this.rangeValue5 = this.rangeVal3[1]+'cm'
          this.rangeValue6 = this.rangeVal3[0]+'cm'
        }
      }
      if(this.rangeVal3[0] == 150){
        this.$refs.range5.style.left = -4+'PX'
      }
      if(this.rangeVal3[1] == 180){
        this.$refs.range6.style.left = 90+'%'
      }
    },
    changeLanguage(val) {// 选择语言
      this.language = val
    },
    changePlace(val) {// 选择籍贯
      this.place = val
    },
    changeAnimal(val) {// 选择属相
      this.animal = val
    },
    changeWorkPlace(val) {// 选择工作区域
      this.workPlace = val
    },
    seekClick(){//搜索

    }
  },
  created(){
    this.getListDataType()
  }
}
</script>
<style lang='scss' scoped>
.collect{
  float: right;
  img{
    width: 25px;
    margin-top: -6px;
  }
  .cl2{
    display: none;
  }
}
.collect.on{
  .cl1{
    display: none;
  }
  .cl2{
    display: inline;
  }
}
.status{
  font-size: 12px;
  color: #FF9900;
  margin-left: 2px;
}
.sum-title{
  padding-left: 15px;
  span{
    margin-right: 10px;
  }
}
.grsz{
  font-size: 17px;
  color: #202D40;
}

.m30{
  margin: 30px 0;
}
.rangeVal{
  margin-right: 5px;
}
.range1,.range2{
  width: 40px;
  font-size: 14px;
  color: #1882FC;
  position: absolute;
  top: -16PX;
}
.range2{
  left: auto;
  right: 0;
}

.hline{
  height: 1px;
  background: #eee;
}
</style>
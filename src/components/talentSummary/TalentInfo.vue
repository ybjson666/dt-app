<template>
    <div class="talent-container">
        <el-row class="rczb">
            <el-col class="rczb-left">
                <el-row class="rczb-row">
                    <el-row>
                    <el-col :span="10">
                        <template v-if="detail.photos && detail.photos.length > 0">
                        <template v-for="(item,index) in detail.photos">
                        <el-row class="headimg" style="height:100%;" :key="index" v-if="item.picType == 10">
                            <template v-for="(sitem,index) in item.pic">
                            <img :src="sitem.path | imgFormat" alt="" class="user-img" :key="index+'pic4'">
                            </template>
                        </el-row>
                        <el-row class="headimg" v-else style="display:none;" :key="index">暂无形象照</el-row>
                        </template>
                        </template>
                        <el-row v-else>暂无形象照</el-row>
                    </el-col>
                    <el-col :span="14">
                        <el-col class="title">档案编号:{{detail.id}}</el-col>
                        <el-col class="a9">
                        姓名<span class="a12">{{detail.name}}</span>
                        <el-button class="fen-btn" @click="chatMsg">
                            <img :src="fenImg1" alt="" class="fenimg1">
                            <img :src="fenImg2" alt="" class="fenimg2">
                        </el-button>
                        </el-col>
                        <el-col class="a9">年龄
                        <span class="a12">{{detail.birthday?(new Date().getFullYear()) - (detail.birthday+'').substr(0,4):'--'}}</span>
                        </el-col>
                        <el-col class="a9">属相<span class="a12">{{detail.chineseZodiac?this.getcommonFun.chineseZodiac(detail.chineseZodiac):'--'}}</span></el-col>
                        <el-col class="a9">籍贯<span class="a12">{{detail.nativePlace !== null?this.getcommonFun.province(detail.nativePlace):'--'}}</span></el-col>
                        <el-col class="a9">出生日期<span class="a12">{{detail.birthday}}</span></el-col>
                    </el-col>
                    </el-row>
                    <el-row class="zxrz">
                    <el-col :span="8">
                        <p v-if="detail.creditClack == 2" class="zx1"><img :src="zxUrl1" alt="" >身份认证</p>
                        <p v-else class="zx2"><img :src="zxUrl2" alt="" >身份认证</p>
                    </el-col>
                    <el-col :span="8" >
                        <p class="zx1" v-if="detail.creditClack == 2"><img :src="zxUrl1" alt="">征信认证</p>
                        <p v-else class="zx2"><img :src="zxUrl2" alt="" >征信认证</p>
                    </el-col>
                    <el-col :span="8" class="zx1" v-if="detail.healthStatus == 2"><img :src="zxUrl1" alt="">健康认证</el-col>
                    <el-col :span="8" class="zx2" v-else><img :src="zxUrl2" alt="">健康认证</el-col>
                    </el-row>
                </el-row>
                <el-row class="rczb-row">
                    <el-col :span="8" class="a9" style="padding-left:5px">服务类型</el-col>
                    <el-col :span="16" class="a12">
                    <span v-for="(item,index) in detail.level" :key="index">
                        {{getcommonFun.tabKey(item.id) +'T'+item.lv+'级'}}
                    </span>
                    </el-col>
                </el-row>
                <el-row class="rczb-row">
                    <el-col :span="8" class="a9" style="padding-left:5px">工作性质</el-col>
                    <el-col :span="16" class="a12">
                    <template v-if="workProp && workProp.length > 0">
                        <span v-for="(item,index) in workProp" :key="index" style="margin-right:2px">
                        {{item == 0?'白班':'住家'}}
                        </span>
                    </template>
                    <template v-else>--</template>
                    </el-col>
                </el-row>
                <el-row class="rczb-row">
                    <el-col :span="8" class="a9" style="padding-left:5px">接单情况</el-col>
                    <el-col :span="16" class="a12">
                    <el-select v-model="jiedan" :class="jiedan == 2?'dsh':jiedan == 3?'onduty':jiedan == 4?'suspend':'blacklist'" @change="changStatus">
                        <el-option v-for="item in jdList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    </el-col>
                </el-row>
                <el-row class="rczb-row">
                    <el-col :span="8" class="a9" style="padding-left:5px">薪资</el-col>
                    <el-col :span="16" class="a12">
                    <span style="word-break: break-all;" v-for="(item,index) in detail.level" :key="index">
                        {{item.salary?item.salary:'--'}}元
                    </span>
                    <span @click="changeSalary" class="adjust">调整</span>
                    </el-col>
                </el-row>
                <el-row class="rczb-row">
                    <el-col :span="8" class="a9" style="padding-left:5px">联系电话</el-col>
                    <el-col :span="16" class="a12">{{detail.phone+'' | numMask}}</el-col>
                </el-row>
            </el-col>
            <el-col class="rczb-right">
                <el-tabs type="card" v-model="activeName">
                    <el-tab-pane label="基本资料" name="one">
                        <el-row class="base-data">
                            <el-row class="base-dt">
                            <el-col :span="10" class="flexbox">
                                <el-col :span="3" class="a9">照片：</el-col>
                                <el-col :span="7" class="rczb-uploadimg">
                                    <template v-if="detail.photos && detail.photos.length > 0">
                                    <template v-for="(item,index) in detail.photos">
                                    <el-row class="headimg" style="height:100%;" :key="index" v-if="item.picType == 10">
                                        <template v-for="(sitem,index) in item.pic">
                                        <img :src="sitem.path | imgFormat" alt="" class="user-img" :key="index+'pic5'">
                                        </template>
                                    </el-row>
                                    <el-row class="headimg" v-else style="display:none;" :key="index">暂无形象照</el-row>
                                    </template>
                                    </template>
                                    <el-row v-else>暂无形象照</el-row>
                                </el-col>
                                <el-col :span="7" class="rczb-upload" style="display:none;">
                                    <el-upload
                                    class="avatar-uploader"
                                    :class="imageUrl?'':'on'"
                                    :action="actionUrl"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess"
                                    :before-upload="beforeAvatarUpload"
                                    accept=".jpg, .JPG"
                                    :limit="1">
                                    <img :src="imageUrl" class="avatar">
                                    <i class="el-icon-plus avatar-uploader-icon">
                                        更换照片
                                    </i>
                                    </el-upload>
                                </el-col>
                                <el-col :span="13" class="flexbox flexauto" style="display:none;">
                                    <el-col :span="5" class="a9 flexauto" style="text-align:right;">自拍介绍：</el-col>
                                    <el-col :span="7" class="rczb-upload">
                                    <video id="video" width="100%" controls="controls" ref="vd">
                                        <source src="http://www.tinntay.com/video/video.mp4" type="video/mp4">
                                        您的浏览器不支持 video 标签。
                                    </video>
                                    <div class="video-img"></div>
                                    <div class="video-play el-icon-video-play"></div>
                                    <div class="video-zhe" @click="vdClick"></div>
                                    </el-col>
                                </el-col>
                            </el-col>
                            <el-col :span="4" style="width:60PX;height:1PX"></el-col>
                            <el-col :span="10">
                                <el-row class="rczb-ew">
                                    <el-col :span="5" class="a9">身高：</el-col>
                                    <el-col :span="18" class="a12">
                                        <span v-if="detail.stature">{{detail.stature ?detail.stature+'cm':'--'}}</span>
                                        <span v-else>--</span>
                                    </el-col>
                                    </el-row>
                                    <el-row class="rczb-ew">
                                    <el-col :span="5" class="a9">体重：</el-col>
                                    <el-col :span="18" class="a12">
                                        <span v-if="talShow">{{detail.weight ?detail.weight+'kg':'--'}}</span>
                                        <el-input v-else type="number" v-model="talDetail.weight" class="bd"></el-input>
                                    </el-col>
                                    </el-row>
                                    <el-row class="rczb-ew">
                                    <el-col :span="5" class="a9">学历：</el-col>
                                    <el-col :span="18" class="a12">{{detail.education?this.getcommonFun.tabKey(detail.education):'--'}}</el-col>
                                </el-row>
                            </el-col>
                            </el-row>
                            <el-row>
                            <el-col :span="10">
                                <el-row class="rczb-ew">
                                <el-col :span="5" class="a9">姓名：</el-col>
                                <el-col :span="18" class="a12">
                                    <span v-if="talShow">{{detail.name?detail.name:'--'}}</span>
                                    <el-input v-else v-model="talDetail.name" class="bd"></el-input>
                                </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="4" style="width:60PX;height:1PX"></el-col>
                            <el-col :span="10">
                                <el-row class="rczb-ew">
                                <el-col :span="5" class="a9">籍贯：</el-col>
                                <el-col :span="18" class="a12">{{detail.nativePlace !== null?this.getcommonFun.province(detail.nativePlace):'--'}}</el-col>
                                </el-row>
                            </el-col>
                            </el-row>
                            <el-row>
                            <el-col :span="10">
                                <el-row class="rczb-ew">
                                <el-col :span="5" class="a9">年龄：</el-col>
                                <el-col :span="18" class="a12">{{detail.birthday?(new Date().getFullYear()) - (detail.birthday+'').substr(0,4):'--'}}</el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="4" style="width:60PX;height:1PX"></el-col>
                            <el-col :span="10">
                                <el-row class="rczb-ew">
                                <el-col :span="5" class="a9">证件：</el-col>
                                <el-col :span="18" class="a12">
                                    <span v-if="picArr('7') && picArr('7').length > 0">驾驶证</span>
                                    <span v-else-if="picArr111 && picArr111.length > 0">签证</span>
                                    <span v-else>--</span>
                                </el-col>
                                </el-row>
                            </el-col>
                            </el-row>
                            <el-row>
                            <el-col :span="10">
                                <el-row class="rczb-ew">
                                <el-col :span="5" class="a9">属相：</el-col>
                                <el-col :span="18" class="a12">{{detail.chineseZodiac?this.getcommonFun.chineseZodiac(detail.chineseZodiac):'--'}}</el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="4" style="width:60PX;height:1PX"></el-col>
                            <el-col :span="10">
                                <el-row class="rczb-ew">
                                <el-col :span="5" class="a9">户口所在地：</el-col>
                                <el-col :span="18" class="a12">{{detail.address?detail.address.substr(0,6):'--'}}</el-col>
                                </el-row>
                            </el-col>
                            </el-row>
                            <el-row>
                            <el-col :span="10">
                                <el-row class="rczb-ew">
                                <el-col :span="5" class="a9">出生日期：</el-col>
                                <el-col :span="18" class="a12">{{detail.birthday?detail.birthday:'--'}}</el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="4" style="width:60PX;height:1PX"></el-col>
                            <el-col :span="10">
                                <el-row class="rczb-ew">
                                <el-col :span="5" class="a9">联系方式：</el-col>
                                <el-col :span="18" class="a12">{{detail.phone}}</el-col>
                                </el-row>
                            </el-col>
                            </el-row>
                            <el-row>
                            <el-col :span="10">
                                <el-row class="rczb-ew">
                                <el-col :span="5" class="a9">身份证号：</el-col>
                                <el-col :span="18" class="a12">{{detail.idNo?detail.idNo:'--'}}</el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="4" style="width:60PX;height:1PX"></el-col>
                            </el-row>
                            <el-row style="padding-top:20PX">
                            <el-col class="fw6 color1" style="font-size:.18rem;">家庭情况：</el-col>
                            </el-row>
                            <el-row>
                            <!-- 关系 1配偶 2子女 3父母 4亲友 -->
                            <el-row class="family">
                                <template v-for="(item,index) in detail.workerFamilies" >
                                <el-col :span="10" :key="index">
                                <el-row class="rczb-ew">
                                    <el-col :span="5" class="a9">
                                    {{item.relationship == 1?'配偶':item.relationship == 2?'子女':item.relationship == 3?'父母':'亲友'}}姓名：
                                    </el-col>
                                    <el-col :span="18" class="a12">{{item.name}} ({{item.relationship == 1?'配偶':item.relationship == 2?'子女':item.relationship == 3?'父母':'亲友'}})</el-col>
                                </el-row>
                                <el-row class="rczb-ew">
                                    <el-col :span="5" class="a9">联系方式：</el-col>
                                    <el-col :span="18" class="a12">{{item.phone}}</el-col>
                                </el-row>
                                <el-row class="rczb-ew">
                                    <el-col :span="5" class="a9">基本情况：</el-col>
                                    <el-col :span="18" class="a12 ellips" :title="item.description">{{item.description}}</el-col>
                                </el-row>
                                </el-col>
                                <el-col :span="4" style="width:60PX;height:1PX" :key="index+'relashion'"></el-col>
                                </template>
                            </el-row>
                            </el-row>
                            <el-row style="padding-top:20PX">
                            <el-col class="fw6 color1" style="font-size:.18rem;">其他情况：</el-col>
                            </el-row>
                            <el-row>
                            <el-col :span="10">
                                <el-row class="rczb-ew">
                                <el-col :span="5" class="a9">宗教信仰：</el-col>
                                <el-col :span="18" class="a12">
                                    <span v-if="detail.faith == 0">无</span>
                                    <span v-if="detail.faith == 1">基督教</span>
                                    <span v-if="detail.faith == 2">佛教</span>
                                </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="4" style="width:60PX;height:1PX"></el-col>
                            <el-col :span="10">
                                <el-row class="rczb-ew">
                                <el-col :span="5" class="a9">政治面貌：</el-col>
                                <el-col :span="18" class="a12">
                                    <span v-if="detail.partyMember == 0">无</span>
                                    <span v-if="detail.partyMember == 1">党员</span>
                                    <span v-if="detail.partyMember == 2">团员</span>
                                </el-col>
                                </el-row>
                            </el-col>
                            </el-row>
                            <el-row>
                            <el-col>
                                <el-row class="rczb-ew">
                                <el-col :span="5" class="a9">个人标签：</el-col>
                                <el-col :span="18" class="a12">
                                    {{detail.style && detail.style.length > 0?getcommonFun.tabKey(detail.style+''):'--'}}
                                    {{detail.personality && detail.personality.length > 0?'性格'+getcommonFun.tabKey(detail.personality+''):'--'}}
                                </el-col>
                                </el-row>
                            </el-col>
                            </el-row>
                            <!-- <el-button class="edit" @click="talDetailClick(talShow)">{{talShow?'编辑':'保存'}}</el-button> -->
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane label="认证" name="two">
                        <el-row class="base-data rczb-rz">
                            <el-row class="a9 m35">
                                <span>人脸扫描：</span>
                                <span class="zx1" v-if="detail.creditClack == 2"><img :src="zxUrl1" alt="">已通过</span>
                                <span class="zx2" v-else><img :src="zxUrl2" alt="">未通过</span>
                            </el-row>
                            <el-row class="a9 m35">
                                <span>征信认证：</span>
                                <span class="zx1" v-if="detail.creditClack == 2"><img :src="zxUrl1" alt="">已通过</span>
                                <span class="zx2" v-else><img :src="zxUrl2" alt="">未通过</span>
                            </el-row>
                            <el-row class="a9 m35">
                                <el-row>
                                    <span>身份认证：</span>
                                    <span class="zx1" v-if="detail.creditClack == 2" ><img :src="zxUrl1" alt="">已通过</span>
                                    <span class="zx2" v-else><img :src="zxUrl2" alt="">未通过</span>
                                </el-row>
                                <el-row class="rczb-hd">
                                    <template v-if="detail.photos && detail.photos.length > 0">
                                        <div class="renzh" v-for="(item,index) in detail.photos" :key="index">
                                            <template v-if="item.picType == 2" >
                                                <el-col class="renzhimg" v-for="sitem in item.pic" :key="sitem.id">
                                                    <el-row class="idPhoto on" >
                                                        <el-image  :src="sitem.path | imgFormat" :preview-src-list="picArr('2')"></el-image>
                                                    </el-row>
                                                </el-col>
                                            </template>
                                        </div>
                                    </template>
                                    <template v-else>--</template>
                                </el-row>
                            </el-row>
                            <el-row class="a9 m35" v-if="picArr('4') && picArr('4').length > 0">
                                <el-row>
                                    <span >健康证明：</span>
                                    <span class="dhealth" :class="detail.healthStatus ==2?'green':'orange'" >{{detail.healthStatus ==2?'通过':'未通过'}}</span>
                                </el-row>
                            <el-row class="rczb-hd">
                                    <el-row class="renzh">
                                        <el-row class="idPhoto on" >
                                            <el-col class="renzhimg">
                                                <el-image  :preview-src-list="picArr('4')" :src="picType('4').path| imgFormat"></el-image>
                                            </el-col>
                                        </el-row>
                                    </el-row>
                                </el-row>
                            </el-row>
                            <el-row class="a9 m35" v-if="picArr('6') && picArr('6').length > 0">
                                <el-row>
                                    <span>学历证明：</span>
                                    <span class="dhealth" :class="xueliStatus ==2?'green':'orange'">{{xueliStatus ==2?'通过':'未通过'}}</span>
                                </el-row>
                                <el-row class="rczb-hd">
                                    <el-row class="renzh">
                                        <el-row class="idPhoto on" >
                                            <el-col class="renzhimg">
                                                <el-image  :preview-src-list="picArr('6')" :src="picType('6').path| imgFormat"></el-image>
                                            </el-col>
                                        </el-row>
                                    </el-row>
                                </el-row>
                            </el-row>
                            <el-row class="a9 m35" v-if="picArr('7') && picArr('7').length > 0">
                                <el-row>
                                    <span >驾驶证：</span>
                                    <span class="dhealth" :class="jszStatus ==2?'green':'orange'">{{jszStatus ==2?'通过':'未通过'}}</span>
                                </el-row>
                                <el-row class="rczb-hd">
                                    <el-row class="renzh">
                                        <el-row class="idPhoto on" >
                                            <el-col class="renzhimg">
                                                <el-image  :preview-src-list="picArr('7')" :src="picType('7').path| imgFormat"></el-image>
                                            </el-col>
                                        </el-row>
                                    </el-row>
                                </el-row>
                            </el-row>
                            <el-row class="a9 m35" v-if="picArr111 && picArr111.length > 0">
                                <span >其他证件：</span>
                                <el-row class="rczb-hd">
                                    <div class="rczb-rzbd" style="display:none;">
                                        <el-upload action="#" list-type="picture-card" :auto-upload="false" ref="upload4">
                                            <i slot="default" class="el-icon-plus avatar-uploader-icon">
                                                <img :src="cameraImg" alt=""><br />上传照片
                                            </i>
                                            <div slot="file" slot-scope="{file}">
                                                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" >
                                                <span class="el-upload-list__item-actions">
                                                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                                                    <i class="el-icon-zoom-in"></i>
                                                </span>
                                                <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove4(file)">
                                                    <i class="el-icon-delete"></i>
                                                </span>
                                                </span>
                                            </div>
                                        </el-upload>
                                    </div>
                                    <template v-if="detail.photos && detail.photos.length > 0">
                                    <div class="renzh" v-for="(item,index) in detail.photos" :key="index">
                                        <template v-if="item.picType !== 2 && item.picType !== 3 && item.picType !== 4 && item.picType !== 5 && item.picType !== 6 && item.picType !== 7 && item.picType !== 10" >
                                            <el-col class="renzhimg" v-for="sitem in item.pic" :key="sitem.id">
                                                <el-row class="idPhoto on" >
                                                    <el-image  :src="sitem.path | imgFormat" :preview-src-list="picArr111"></el-image>
                                                </el-row>
                                            </el-col>
                                        </template>
                                    </div>
                                    </template>
                                </el-row>
                            </el-row>
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane label="技能测评" name="three">
                        <el-row class="base-data rczb-jn">
                            <el-row class="rczb-jnhd m35">
                            <el-col >
                                <el-col :span="4" class="ft18 c34">专业技能：</el-col>
                                <el-col :span="16" class="ft18 c00" style="margin-top:-2px">
                                <el-select v-model="major2" class="selt" @change="changeSkill">
                                    <el-option v-for="item in detail.skills" :key="item.id" :label="item.pid" :value="item.pid">
                                    {{getcommonFun.tabKey(item.pid)}}
                                    </el-option>
                                </el-select>
                                </el-col>
                            </el-col>
                            </el-row>
                            <div class="rczb-jnbd m35" v-for="(item,index) in detail.workerSkillAuths" :key="index">
                                <ul class="clearfix">
                                    <li>
                                    <p class="p1">
                                        <span class="red">{{item.skill.score + (item.skillOperation !== null?item.skillOperation.score:0) + item.record.score}}</span>分
                                    </p>
                                    <p class="p2">综合能力测评结果</p>
                                    </li>
                                    <li>
                                    <p class="p1"><span>{{item.skill.score}}</span>分</p>
                                    <p class="p2">理论测试</p>
                                    </li>
                                    <li>
                                    <p class="p1"><span>{{item.skillOperation !== null?item.skillOperation.score:'--'}}</span>分</p>
                                    <p class="p2">实操测试</p>
                                    </li>
                                    <li>
                                    <p class="p1"><span>{{item.record.score}}</span>分</p>
                                    <p class="p2">基本资料</p>
                                    </li>
                                    <li>
                                    <div class="teacher">理论测试：{{getUsers.name}}</div>
                                    <div class="teacher">实操测试：{{getUsers.name}}</div>
                                    <div class="teacher">档案审核：{{getUsers.name}}</div>
                                    </li>
                                </ul>
                                <!-- <el-button class="edit rz1">继续认证</el-button> -->
                            </div>
                            <el-row>
                            <el-col :span="12">
                                <el-row class="rczb-jnhd m35">
                                <el-col :span="4" class="ft18 c34">服务情况：</el-col>
                                <el-col :span="16" class="ft18 c00">
                                    <span v-for="(item,index) in detail.level" :key="index">
                                    {{getcommonFun.tabKey(item.id) +'T'+item.lv+'级'}}
                                    </span>
                                </el-col>
                                </el-row>
                                <el-row class="rczb-jnhd m35">
                                <el-col :span="4" class="ft18 c34">岗位工资：</el-col>
                                <el-col :span="16" class="ft18 c00">
                                    <span v-for="(item,index) in detail.level" :key="index">
                                    {{item.salary !== null?item.salary:'--'}}
                                    </span>
                                </el-col>
                                </el-row>
                                <el-row class="rczb-jnhd m35">
                                <el-col :span="4" class="ft18 c34">个人特长：</el-col>
                                <el-col :span="16" class="ft18 c00">{{this.speciality && this.speciality.length !== 0?this.getcommonFun.tabKey(this.speciality+''):'--'}}</el-col>
                                </el-row>
                                <el-row class="rczb-jnhd m35">
                                <el-col :span="4" class="ft18 c34">工作区域：</el-col>
                                <el-col :span="16" class="ft18 c00">
                                    <template v-if="detail.workPlace && detail.workPlace.length > 0">
                                    <span v-for="(item,index) in detail.workPlace" :key="index" style="margin-bottom:.1rem">
                                        {{getcommonFun.tabKey(item+'')}}
                                    </span>
                                    </template>
                                    <template v-else>--</template>
                                </el-col>
                                </el-row>
                                <el-row class="rczb-jnhd m35">
                                <el-col :span="4" class="ft18 c34">特别擅长：</el-col>
                                <el-col :span="16" class="ft18 c00">
                                    <span v-for="(item,index) in zyscList" :key="index">{{getcommonFun.tabKey(item)}}</span>
                                </el-col>
                                </el-row>
                                <el-row class="rczb-jnhd m35">
                                <el-col :span="4" class="ft18 c34">专家评价：</el-col>
                                <el-col :span="16" class="ft18 c00 f16">{{detail.assessorComment?detail.assessorComment:'--'}} </el-col>
                                </el-row>
                                <el-row class="rczb-jnhd m35">
                                <el-col :span="4" class="ft18 c34">工作经验：</el-col>
                                <el-col :span="16" class="ft18 c00">{{detail.workYear?detail.workYear+'年':'--'}}</el-col>
                                </el-row>
                                <el-row class="rczb-jnhd m35">
                                <el-col :span="4" class="ft18 c34">工作经历：</el-col>
                                <el-col :span="16" class="ft18 c00" style="padding-top:5px;">
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
                                </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="12">
                                <el-row class="rczb-jnhd m35">
                                <el-col :span="4" class="ft18 c34" v-if="picArr('3') && picArr('3').length > 0">技能证书：</el-col>
                                <el-col :span="16">
                                    <template v-if="detail.photos && detail.photos.length > 0">
                                    <el-row class="jnzs" v-for="(item,index) in detail.photos" :key="index">
                                        <template v-if="item.picType == 3" >
                                            <el-col class="jnzsimg" v-for="sitem in item.pic" :key="sitem.id">
                                                <el-row class="idPhoto on" >
                                                    <el-image  :src="sitem.path | imgFormat" :preview-src-list="picArr('3')"></el-image>
                                                </el-row>
                                            </el-col>
                                        </template>
                                    </el-row>
                                    </template>
                                    <template v-else>--</template>
                                </el-col>
                                </el-row>
                                <el-row class="rczb-jnhd m35">
                                <el-col :span="4" class="ft18 c34" v-if="picArr('5') && picArr('5').length > 0">个人展示照：</el-col>
                                <el-col :span="16" class="show-image" style="display:none;">
                                    <el-upload action="#" list-type="picture-card" :auto-upload="false" ref="upload6">
                                        <i slot="default" class="el-icon-plus avatar-uploader-icon">
                                            <img :src="cameraImg" alt=""><br />上传展示照片
                                        </i>
                                        <div slot="file" slot-scope="{file}">
                                            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" >
                                            <span class="el-upload-list__item-actions">
                                                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                                                    <i class="el-icon-zoom-in"></i>
                                                </span>
                                                <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove6(file)">
                                                    <i class="el-icon-delete"></i>
                                                </span>
                                            </span>
                                        </div>
                                    </el-upload>
                                </el-col>
                                <el-col :span="16">
                                    <template v-if="detail.photos && detail.photos.length > 0">
                                    <el-row class="jnzs" v-for="(item,index) in detail.photos" :key="index">
                                        <template v-if="item.picType == 5" >
                                            <el-col class="jnzsimg" v-for="sitem in item.pic" :key="sitem.id">
                                                <el-row class="idPhoto on" >
                                                    <el-image  :src="sitem.path | imgFormat" :preview-src-list="picArr('5')"></el-image>
                                                </el-row>
                                            </el-col>
                                        </template>
                                    </el-row>
                                    </template>
                                    <template v-else>--</template>
                                </el-col>
                                </el-row>
                            </el-col>
                            </el-row>
                        </el-row>
                    </el-tab-pane>
                    <!-- <el-tab-pane label="用户评价" name="four">
                        <el-row class="base-data">用户评价</el-row>
                    </el-tab-pane>
                    <el-tab-pane label="占位文字" name="five">
                        <el-row class="base-data">占位文字</el-row>
                    </el-tab-pane> -->
                </el-tabs>
            </el-col>
        </el-row>
        <!--聊天-->
        <Chat ref="chat" :curUser="curUser"/>
    </div>
</template>

<script>
import imgurl from '@/utils/common.js'
import { fenImg1,fenImg2,zxUrl1,zxUrl2,cameraImg,imageUrl} from '@/utils/imgConfig.js'
import { mapGetters } from 'vuex'
import { modifyStatus,modifySalary } from '@/api/api'
import Chat from '@/components/Chat.vue'
export default {
    name:'',
    data () {
        return {
            fenImg1,
            fenImg2,
            zxUrl1,
            zxUrl2,
            cameraImg,
            imageUrl,
            jdList: [
                {
                    value: 2,
                    label: '等单中'
                },
                {
                    value: 3,
                    label: '已上岗'
                },
                {
                    value: 4,
                    label: '暂停中'
                },
                {
                    value: 5,
                    label: '黑名单'
                }
            ],
            actionUrl:'https://jsonplaceholder.typicode.com/posts/',
            fullscreen:false,
            talShow: true,
            // 人才总表详情编辑
            talDetail:{
                name: '',
                age: '',
                height: '165',
                weight: '120',
                eduation: '',
                nativePlace: '',
                chineseZodiac: '',
                birthday: '',
                idCard: '',
                card: '',
                address: '',
                hukou: '',
                phone: '',
                partyMember: '',
                faith: '',
                assessment: '',
                speciality: [],
                workFamilies:[
                    {
                    description: null,
                    id: "",
                    name: '',
                    phone: "",
                    relationship: 1,
                    wid: "",
                    work: ""
                    },
                    {
                    description: null,
                    id: "",
                    name: '',
                    phone: "",
                    relationship: 2,
                    wid: "",
                    work: ""
                    }
                ],
                workPlace:['','']
            },
            major:"",
            major2:"",
            activeName: 'one',
            curUser:{},
            salary:"",
            xueliStatus:"0",//学历证明审核状态
            jszStatus:"0"//驾驶证审核状态
        };
    },
    props: {
        detail:{
            type:Object,
            default:{}
        },
        jiedan:{
            type:Number,
            default:2
        }
    },
    components: {
        Chat
    },
    computed:{
        ...mapGetters([
          'getUsers',
          'getSysMetaData'
        ]),
        picArr111(){
            let arr=[]
            this.detail.photos&&this.detail.photos.forEach(item=>{
                if(item.picType !== 2 && item.picType !== 3 && item.picType !== 4 && item.picType !== 5 && item.picType !== 6 && item.picType !== 7 && item.picType !== 10){
                    if(item.pic && item.pic.length > 0){
                        item.pic.forEach(item =>{
                            arr.push(imgurl + item.path)
                        })
                    }
                }
            })
            return arr
        },
        workProp(){
            let arr=[]
            this.detail.skills&&this.detail.skills.forEach(item =>{
                arr=item.workProp
            })
            return arr
        },
        speciality(){
            this.detail.photos&&this.detail.skills.forEach(item =>{
                return item.speciality
            })
        },
        zyscList(){
            this.getSysMetaData.forEach((item, index) => {
              if (item.pid === 2 && item.status == 1) {
                if (this.major == item.id) {
                  return item.smData.adept
                }
              }
            })
        }
    },
    methods: {
        changStatus(val){//更改接单状态
            this.$emit('updateJiedan',val)
            let params = {
                status: this.jiedan,
                token: this.getUsers.token,
                uid: this.detail.id,
            }
             modifyStatus(params).then(res =>{
                if(res.code == 200) {
                   this.$emit('updateList')
                }else{
                    this.$myMessage("error",res.msg)
                }
            })
        },
        handleAvatarSuccess(res, file) {//上传照片
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {// 头像上传前,判断下格式
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
        vdClick(){ //视频播放
            if(!this.$refs.vd.paused){
                this.fullscreen = false
            } else {
                this.fullscreen = false
            }
            if (this.fullscreen) {
                if (this.$refs.vd.exitFullscreen) {
                    this.$refs.vd.exitFullscreen();
                } else if (this.$refs.vd.webkitCancelFullScreen) {
                    video.webkitCancelFullScreen();
                } else if (this.$refs.vd.mozCancelFullScreen) {
                    this.$refs.vd.mozCancelFullScreen();
                } else if (this.$refs.vd.msExitFullscreen) {
                    this.$refs.vd.msExitFullscreen();
                }
            } else {
                this.$refs.vd.play()
                if (this.$refs.vd.requestFullscreen) {
                    this.$refs.vd.requestFullscreen();
                } else if (this.$refs.vd.webkitRequestFullScreen) {
                    this.$refs.vd.webkitRequestFullScreen();
                } else if (this.$refs.vd.mozRequestFullScreen) {
                    this.$refs.vd.mozRequestFullScreen();
                } else if (this.$refs.vd.msRequestFullscreen) {
                    this.$refs.vd.msRequestFullscreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        },
        picArr(types){
            let arr=[]
            this.detail.photos&&this.detail.photos.forEach(item=>{
                if(item.picType == types){//2身份证、3技能证书、4健康证明、5个人菜品等照片、6学历、7驾驶证
                    if(item.pic && item.pic.length > 0){
                        item.pic.forEach(item =>{
                            arr.push(imgurl + item.path)
                        })
                    }
                }
            })
            return arr
        },
        picType(types){//获取证件类型的图片
            let pic={}
            this.detail.photos&&this.detail.photos.forEach(item=>{
                if(item.picType == types){
                    switch(types){
                        case '6':
                            this.xueliStatus=item.status
                            break;
                        case '7':
                            this.jszStatus=item.status
                            break;
                    }
                    if(item.pic && item.pic.length > 0){
                        pic=item.pic[0]
                    }
                }
            })
            return pic
        },
        changeSkill(val){//更改技能
            this.major = val
            this.major2 = this.getcommonFun.tabKey(this.major)
        },
        changeSalary(){//调整薪资
            //此处未调接口
            this.$prompt('','调整薪资', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^([0-9]+|[0-9]{1,3}(,[0-9]{3})*)(.[0-9]{1,2})?$/,
                inputErrorMessage: '输入格式不正确，请重新输入！'
                }).then(({ value }) => {
                this.salary = value
                // console.log(this.detail)
                let params = {
                    token: this.getUsers.token,
                    salary:this.salary,
                    pid:this.detail.level[0].id,
                    wid:this.detail.id
                }
                modifySalary(params).then(res=>{
                    if(res.code===200){
                        this.$message({
                            type: 'success',
                            message: '薪资调整成功！'
                        });
                        this.$emit('close')
                        this.$emit('updateList')
                    }else{
                        this.$message.error(res.message)
                    }
                })
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });
        },
        chatMsg(){//聊天
            let user={}
            user.uid=this.detail.id
            user.name=this.detail.name
            this.curUser=user;
            this.$refs.chat.showDialog()
        }
    }
}

</script>
<style lang='scss' scoped>
    .talent-container{
        height: 100%;
    }
    .rczb-upload{
        position: relative;
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
            -webkit-transform: translate(-50%,-50%);
            -ms-transform: translate(-50%,-50%);
            transform: translate(-50%,-50%);
            font-size: 16PX;
            color: #fff !important;
            cursor: pointer;
            z-index: 20;
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
    .dhealth.green{
        color: #00CA41;
    }
    .dhealth.orange{
        color: #FF9900;
    }
    .renzh{
        position: relative;
        display: inline-block;
        margin-top: .46rem;
        .renzhimg{
            width:240px;
            height: 140px;
            overflow: hidden;
            border-radius: .04rem;
            margin-right: 0.08rem;
        }
        .title{
            position: absolute;
            top: -.46rem;
        }
    }
</style>
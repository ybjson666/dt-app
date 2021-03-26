<template>
  <div class="tinntay-cont talent-eva">
    <div class="talentAudit r410" style="padding:0;">
      <el-row class="h101">
        <el-row class="talent-exam">
          <el-col class="talent-exam-hd" :span="8">
            <el-row class="talent-exam-title color1 fw6">
              待审核消息
              <span class="talent-exam-news" :class="num >=10?'on':''" v-if="num > 0">{{num > 99?'99+':num}}</span>
            </el-row>
            <el-row class="talent-exam-btm" v-if="ecamList && ecamList.length > 0">
            <el-row class="talent-exam-list">
              <ul>
                <li :class="currentIndex == index?'on':''" v-for="(item,index) in ecamList" :key="index" @click="changeExamClick(index)">
                  <el-row class="talent-exam-lt flexbox align-items-center">
                    <img :src="item.headImg | imgFormat" alt="">
                    <div class="talent-exam-name flexbox flex-direction-column flexauto">
                      <div class="ename color1 fw5">
                        {{item.name?item.name:'--'}}
                        <!-- 1阿姨生活照，2身份证，3技能证书，4体检，5个人菜品等照片，6学历，7驾驶证，8护照，9港澳通行证, 10个人形象照 11签证 -->
                        <span class="talent-exam-type flexauto" v-if="item.picType == 3">相关证书</span>
                        <span class="talent-exam-type flexauto" v-if="item.picType == 4">健康证</span>
                        <span class="talent-exam-type flexauto" v-if="item.picType == 7">驾驶证</span>
                        <span class="talent-exam-type flexauto" v-if="item.picType == 8">护照</span>
                        <span class="talent-exam-type flexauto" v-if="item.picType == 9">港澳通行证</span>
                        <span class="talent-exam-type flexauto" v-if="item.picType == 11">{{getcommonFun.tabKey(item.pid)+'签证'}}</span>
                      </div>
                      <span class="eid color3 fw4">ID:{{item.uid}}</span>
                    </div>
                  </el-row>
                  <el-row class="talent-exam-time color4 fw4">提交时间：{{item.createTime}}</el-row>
                </li>
              </ul>
            </el-row>
            <Page :currentPage="currentPage" :pageSize="pageSize" :total="total" @changePage="changePage"></Page>
            </el-row>
            <div class="zwsj" v-else>
              <img :src="zwsjImg" alt=""><br />
              暂无数据
            </div>
          </el-col>
          <el-col class="talent-exam-bd" :span="16">
            <el-row class="talent-exam-title color1 fw6">审核信息</el-row>
            <el-row class="talent-exam-content" v-if="ecamList && ecamList.length > 0">
              <el-row class="talent-exam-cont" :class="currentIndex == index?'active':''" v-for="(item,index) in ecamList" :key="index">
                <el-row class="talent-exam-ct flexbox align-items-center">
                  <img :src="item.headImg | imgFormat" alt="" class="uimg">
                  <div class="talent-exam-cname flexbox flex-direction-column">
                    <span class="color1 fw5 ft16">{{item.name?item.name:'--'}}</span>
                    <span class="color3 fw4 ft16">ID:{{item.uid}}</span>
                  </div>
                </el-row>
                <el-row class="talent-exam-ctype color1 fw6 ft16" v-if="item.picType == 3">{{getcommonFun.tabKey(item.pid)+'证书'}}审核：</el-row>
                <el-row class="talent-exam-ctype color1 fw6 ft16" v-if="item.picType == 4">健康证审核：</el-row>
                <el-row class="talent-exam-ctype color1 fw6 ft16" v-if="item.picType == 7">驾驶证审核：</el-row>
                <el-row class="talent-exam-ctype color1 fw6 ft16" v-if="item.picType == 8">护照审核：</el-row>
                <el-row class="talent-exam-ctype color1 fw6 ft16" v-if="item.picType == 9">港澳通行证审核：</el-row>
                <el-row class="talent-exam-ctype color1 fw6 ft16" v-if="item.picType == 11">{{getcommonFun.tabKey(item.pid)+'签证'}}审核：</el-row>
                <el-row class="talent-exam-cimg" v-if="item.pic && item.pic.length > 0">
                  <el-col class="talent-exam-cimgitem" v-for="subItem in item.pic" :key="subItem.id">
                      <el-image  :src="subItem.path | imgFormat" :preview-src-list="picArr"></el-image>
                  </el-col>
                </el-row>
                <el-row class="talent-exam-cimg" v-else>--</el-row>
                <el-row class="talent-exam-date ft16 fw6 color1">
                  <template v-if="item.picType == 3"></template>
                  <template v-else-if="item.picType == 4">
                    体检时间：{{item.startTime}}
                  </template>
                  <template v-else>
                    有效期至：{{item.endTime}}
                  </template>
                </el-row>
                <el-row class="talent-exam-btn">
                  <el-button @click="tgClick(item.id,1)">通过</el-button>
                  <el-button @click="tgClick(item.id,2)">不通过</el-button>
                </el-row>
              </el-row>
            </el-row>
            <div class="zwsj" v-else>
              <img :src="zwsjImg" alt=""><br />
              暂无数据
            </div>
          </el-col>
        </el-row>
      </el-row>
    </div>
  </div>
</template>

<script>
import { addList, checkImg } from '@/api/api'
import Page from '@/components/Page.vue'
import { mapGetters } from 'vuex'
import imgurl from '@/utils/common.js'
  export default {
    name: 'talentExamine',
    components: {
      Page
    },
    data() {
      // const searchIMg = require('@/assets/images/search2.png')
      const userImg = require('@/assets/images/uimg1.png')
      const userImg2 = require('@/assets/images/uimg2.png')
      const zwsjUrl = require('@/assets/images/zwsj.png')
      return {
        zwsjImg: zwsjUrl,
        ecamList:[],
        currentIndex: 0,
        num: 0,
        picArr: [],
        // page
        currentPage: 1,
        pageSize: 6,
        total: 0,
        current: 0
      }
    },
    created() {
      // 新增审核列表
      this.getList()
    },
    computed:{
      ...mapGetters([
          'getUsers'
      ])
    },
    methods: {
      // 新增审核列表
      getList(){
        let params = {
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          token: this.getUsers.token,
        }
        addList(params).then(res =>{
          if(res.code == 200) {
            this.ecamList = res.data.records
            this.total = res.data.total
            this.num = res.data.total
            this.current = res.data.current
            this.$store.commit('updateNumber1', this.num)
            this.ecamList.forEach(item =>{
              if(item.pic !== null) {
                item.pic.forEach((subItem,i) =>{
                  this.picArr.push(imgurl + subItem.path)
                })
              }
            })
          }
        })
      },
      changeExamClick(index) {
        this.currentIndex = index
      },
      // page
      changePage(val) {
        this.currentPage = val
        this.getList()
      },
      tgClick(id,n) {
        let params = {
          id: id,
          status: n,
          token: this.getUsers.token
        }
        checkImg(params).then(res =>{
          if(res.code == 200) {
            this.$store.commit('updateNumber1', this.num)
            this.$myMessage('success','操作成功')
            if(this.currentPage <= this.current && this.ecamList.length == 1){
              this.currentPage = this.current == 1?1:this.current - 1
            }
            this.getList()
          } else {
            this.$myMessage('error',res.msg)
          }
        })
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.talent-exam-news.on{
  width: auto;
  height: auto;
  border-radius: .15rem;
  padding: 0 .05rem;
}
</style>

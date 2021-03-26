<template>
  <div class="pages-container">
    <div class="pages-wraps">
      <div class="page-table-content">
        <div class="tablent-md clearfix">
          <div class="tablent-search bd">
            <el-input placeholder="编号/手机号/关键字" v-model="taSearchText" @input="changeInput">
            </el-input>
            <a href="javascript:void(0);" class="talent-btn" @click="search"><img :src="sUrl" alt=""></a>
          </div>
          <div class="tablent-menu">
            <a href="javascript:void(0);" :class="isOn?'on':''" @click.prevent="selClick">
              <img :src="shaiImg" alt="" class="shaimg1">
              <img :src="shaiImg2" alt="" class="shaimg2">
              筛选
            </a>
          </div>
        </div>
        <div class="tablent-content">
          <el-table :data="tableDataList" highlight-current-row  @row-click="cellClick" border style="width: 100%">
            <el-table-column prop="num" label="编号" width="">
              <template slot-scope="scope">
                <span>{{scope.row.num}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="">
              <template slot-scope="scope">
                <span class="bold">{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="levArr" label="工作类型" width="">
              <template slot-scope="scope">
                <span class="bold" v-for="(item,index) in scope.row.levArr" :key="index">
                  {{scope.row.levArr && scope.row.levArr.length > 0?getcommonFun.tabKey(item.id)+'T'+item.lv+'级':'--'}}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="exprence" label="经验" width="">
              <template slot-scope="scope">
                <span class="bold">{{scope.row.exprence}}年</span>
              </template>
            </el-table-column>
            <el-table-column prop="age" label="年龄" width="">
              <template slot-scope="scope">
                <span class="bold">{{scope.row.age?(new Date().getFullYear()) - (scope.row.age+'').substr(0,4):'--'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="xli" label="学历" width="">
              <template slot-scope="scope">
                <span>{{scope.row.xli?getcommonFun.tabKey(scope.row.xli):'--'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="shux" label="属相" width="">
              <template slot-scope="scope">
                <span>{{scope.row.chineseZodiac?getcommonFun.chineseZodiac(scope.row.chineseZodiac):'--'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="jguan" label="籍贯" width="">
              <template slot-scope="scope">
                <span>{{scope.row.nativePlace !== null?getcommonFun.province(scope.row.nativePlace):'--'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="">
              <template slot-scope="scope">
                <!-- 上单状态0默认未认证 1认证失败 2可上单 3上单中 4暂停中 5黑名单 -->
                <span class="onduty">{{scope.row.status == 3?'已上岗':'--'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="levArr" label="工资" width="">
              <template slot-scope="scope">
                <span class="bold" v-for="(item,index) in scope.row.levArr" :key="index">
                  {{item.salary !== null?'¥'+item.salary:'--'}}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="120">
              <template slot-scope="scope">
                <el-button @click="msgClick(scope.row)" size="small" class="delete-btn">
                  <img :src="fenImg1" alt="" class="deletimg1">
                  <img :src="fenImg2" alt="" class="deletimg2">
                </el-button>
                <el-button @click="editClick(scope.$index, scope.row)" size="small" class="edit-btn">
                  <img :src="editImg1" alt="" class="editimg1">
                  <img :src="editImg2" alt="" class="editimg2">
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <Page :currentPage="currentPage" :pageSize="pageSize" :total="total" @changePage="changePage" v-if="this.tableDataList.length > 0"></Page>
        </div>

      </div>
      <div class="page-detail-block">
        <RightInfo :isOn="isOn" :detail="detail" />
      </div>
    </div>
    
    <!-- 人才总表认证 -->
    <el-drawer title="人才考核详情" :visible.sync="drawer" :direction="direction">
      <TalentInfo :detail="detail" :jiedan="jiedan" @updateJiedan="updateJiedan" @updateList="getList"/>
    </el-drawer>

    <!--聊天-->
    <Chat ref="chat" :curUser="targetUser"/>
  </div>
</template>

<script>
import { summaryList,getDetail } from '@/api/api'
import { editImg1,editImg2,fenImg1,fenImg2,shaiImg,shaiImg2,sUrl } from '@/utils/imgConfig.js'
import { mapGetters } from 'vuex'
import Page from '@/components/Page.vue'
import Chat from '@/components/Chat.vue'
import RightInfo from "./RightInfo.vue"
import TalentInfo from "./TalentInfo.vue"
  export default {
    name: 'talentAudit',
    components: {
      Page,
      Chat,
      RightInfo,
      TalentInfo
    },
    data() {
      return {
        editImg1,
        editImg2,
        fenImg1,
        fenImg2,
        shaiImg,
        shaiImg2,
        sUrl,
        isOn:false,
        taSearchText: '',
        tableData: [],
        tableDataList:[],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        targetUser:{},
        detail:{},
        rowUid:"",
        drawer:false,
        direction: 'rtl',
        jiedan:3
      }
    },
    created() {
      this.getList()
    },
    computed:{
      ...mapGetters([
          'getUsers',
          'getSysMetaData'
      ])
    },
    methods: {
      getList(){
        let params = {
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          status: 3, //上单状态 2可上单 3上单中 4暂停中 5黑名单 11我的收藏
          token: this.getUsers.token,
        }
        summaryList(params).then(res =>{
          if(res.code == 200) {
            this.tableData = res.data.records
            this.tableDataList = res.data.records
            this.total = res.data.total
            this.tableDataList.forEach(item =>{
              item.num = item.id
              item.levArr = item.level
              item.exprence = item.workyear
              item.age = item.birthday
              item.xli = item.education
              item.shux = item.chineseZodiac
              item.jguan = item.nativePlace
              item.status = item.status
            })

            if(this.tableDataList.length>0){
              this.rowUid=this.tableDataList[0].id
              this.getDetailList()
            }
          }
        })
      },
      search() {// 搜索
        const search = this.taSearchText
        if (search) {
          this.tableDataList =  this.tableData.filter(data => {
            return Object.keys(data).some(key => {
              return String(data[key]).toLowerCase().indexOf(search) > -1
            })
          })
        } else {
            this.tableDataList =  this.tableData
        }
      },
      changeInput() {
        if(this.taSearchText === '') {
          this.tableDataList =  this.tableData
        }
      },
      cellClick(row,event,column) {// table整行点击
        this.rowUid=row.id
        this.getDetailList()
      },
      msgClick(row) {
        let user={}
        user.uid=row.id.toString();
        user.name=row.name;
        user.headImg=row.headimg
        this.targetUser=user;
        this.$refs.chat.showDialog()
      },
      editClick(index,row) {
        this.drawer = true
      },
      changePage(val) {// 分页
        this.currentPage = val
        this.getList()
      },
      selClick() { // 筛选
        this.isOn = !this.isOn
      },
      getDetailList(){// 阿姨详细信息
        let params = {
          "app": 3,
          "comments": true,
          "device": 5,
          "experience": true,
          "family": true,
          "picTypes": [1,2,3,4,5,6,7,8,9,10,11],
          "score": true,
          "token": this.getUsers.token,
          // 获取签证、通行证 1获取 0或空不获取
          "visa": 1,
          "wid": this.rowUid
        }
        getDetail(params).then(res => {
          if(res.code == 200) {
            this.detail = res.data
          }
        })
      },
      updateJiedan(val){
        this.jiedan=val
      }
    }
  }
</script>
<style scoped lang="scss">
  @import './common.scss';
</style>

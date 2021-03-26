<template>
  <div class="talentAudit">
    <div class="pages-container">
      <div class="pages-wraps">
        <div class="page-table-content">
            <div class="h101 flexbox flex-direction-column">
            <div id="tstoreMain" ref="tHeight1" >
            <div class="tstore"  >
              <div class="txing">
                <div class="txing-cont clearfix">
                  <span class="txing-title">类型</span>
                  <el-radio-group v-model="txg2" @change="txClick">
                    <el-radio-button label="全部"></el-radio-button>
                    <el-radio-button v-for="(item,index) in txing" :label="item.id" :key="index">{{item.name}}</el-radio-button>
                  </el-radio-group>
                </div>
                <div class="txing-container" v-if="this.childType1.length > 0">
                  <div class="txing-ct" v-if="this.childType1.length > 0">
                    <div class="txing-cont clearfix">
                      <span class="txing-title"></span>
                      <el-radio-group v-model="txing2" @change="jpClick2">
                        <el-radio-button label="-1" v-if="this.childType1.length > 0">全部</el-radio-button>
                        <el-radio-button :label="item.id" v-for="(item,index) in childType1" :key="index">{{item.name}}
                        </el-radio-button>
                      </el-radio-group>
                    </div>
                  </div>
                </div>
              </div>
              <el-button class="ctrule" @click="makeDialogVisible = true"><img :src="setImg" alt="">制定出题规则</el-button>
            </div>
            </div>
            <div class="tablent-md clearfix" ref="tHeight2">
              <!-- <div class="tablent-search bd">
                <el-input placeholder="编号/手机号/关键字" v-model="taSearchText" @input="changeInput" class="">
                </el-input>
                <a href="javascript:void(0);" class="talent-btn" @click="search()"><img :src="sUrl" alt=""></a>
              </div> -->
              <div class="tablent-menu">
                <el-button class="bt1 ft" @click="deletAll" :disabled="isDel"><img :src="dallImg" alt="">删除</el-button>
                <el-button class="bt2 ft" @click="importExcell"><img :src="importImg" alt="">导入</el-button>
                <el-button class="bt3 ft" @click="addDialogVisible = true"><img :src="addImg" alt="">新增</el-button>
                <input type="file" ref="fileInput" style="display:none" @change="fileChange($event)"/>
              </div>
            </div>
            <div class="tablent-content flexauto">
              <el-table ref="multipleTable" :data="tableDataList" 
                        @selection-change="handleSelectionChange" @row-click="cellClick" highlight-current-row border style="width: 100%;">
                <el-table-column label="全选" type="selection" width=""></el-table-column>
                <el-table-column label="编号" type="index" width=""></el-table-column>
                <el-table-column
                  prop="tagMore"
                  label="类型"
                  width="80"
                  :filters="[{ text: '单选', value: 0 }, { text: '多选', value: 1 }]"
                  :filter-method="filterTag"
                  filter-placement="bottom-end">
                  <template slot-scope="scope">
                    <el-tag
                      :type="scope.row.tagMore == 0 ? '' : ''"
                      disable-transitions>
                      {{scope.row.tagMore == 1?'多选':scope.row.tagMore == 2?'问答题':'单选'}}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="test" label="试题">
                  <template slot-scope="scope">
                    <span class="ellips" :title="scope.row.test">
                      {{scope.row.test}}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="创建时间" width="">
                  <template slot-scope="scope">
                    <span class="dtcc" v-if="scope.row.date">
                      {{ (scope.row.date).substr(0,10) }}<br />{{ (scope.row.date).substr(11) }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="dan" label="正确答案" width="">
                  <template slot-scope="scope">
                  <span class="dtcc">
                    {{scope.row.dan}}
                  </span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="120">
                  <template slot-scope="scope">
                    <el-button @click="editClick(scope.row)" size="small" class="edit-btn">
                      <img :src="editImg1" alt="" class="editimg1">
                      <img :src="editImg2" alt="" class="editimg2">
                    </el-button>
                    <el-button @click="deleteClick(scope.row)" size="small" class="delete-btn">
                      <img :src="deletImg1" alt="" class="deletimg1">
                      <img :src="deletImg2" alt="" class="deletimg2">
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <Page :currentPage="currentPage" :pageSize="pageSize" :total="total" @changePage="changePage"></Page>
            </div>
          </div>
        </div>
        <div class="page-detail-block">
          <div class="tin-right">
            <div class="testList">
              <div class="testList-hd" style="padding-left:0;">理论测试题</div>
              <div class="testList-md" style="padding-top:.15rem" v-if="getExamDetail && JSON.stringify(getExamDetail) != '{}'">
                <p>{{getExamDetail && getExamDetail.tagMore == 1?'多选题':getExamDetail && getExamDetail.tagMore == 2 ? '问答题':'单选题'}}</p>
                <div class="testList-title">{{getExamDetail?getExamDetail.info:'--'}}</div>
                <div class="testList-cont">
                  <el-radio-group v-model="radio" disabled>
                    <template v-if="getExamDetail">
                    <el-row class="testList-row" :class="getExamDetail.answer.indexOf(index) != -1?'on':''" v-for="(item,index) in getExamDetail.options" :key="index">
                      <el-radio :label="item"  :key="index" v-if="item != ''">
                        <span v-for="(letter,index) in letters[index]" :key="index">{{letter}}、</span>
                        {{item}}
                      </el-radio>
                    </el-row>
                    </template>
                  </el-radio-group>
                </div>
                <div class="red">正确答案： {{getExamDetail?this.getcommonFun.getLetter(getExamDetail.answer):'--'}}</div>
              </div>
              <div class="testList-md" style="padding-top:.15rem" v-else>
                <div class="zwsj">
                  <img :src="zwsjImg" alt=""><br />
                  暂无数据
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增题库 -->
    <el-dialog title="新增试题" :visible.sync="addDialogVisible" :close-on-click-modal="false" center class="addDialog hd">
      <el-row>
        <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="100px" class="adform-list">
          <el-form-item label="类型:" prop="mold">
            <el-select v-model="addForm.mold" placeholder="--请选择--" class="bd" @change="moldChange">
              <el-option :label="item.name" :value="item.id" v-for="item in txing" :key="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <template v-if="addForm.mold != '--请选择--'">
            <el-form-item label="" class="adform-item">
              <el-radio-group v-model="addForm.sub1" @change="changeSubItem1">
                <template v-for="(item,index) in smallType">
                  <div class="ra" @dblclick="dblClick(item,index,true)" :key="index">
                    <el-radio-button :label="item.id" :key="item.id">{{item.name}}</el-radio-button>
                  </div>
                </template>
              </el-radio-group>
              <el-button class="btn-add" @click="addYuClick(true)"><img :src="addImg2" alt="">添加</el-button>
            </el-form-item>
          </template>
          <el-form-item label="试题:" prop="test">
            <el-input type="textarea" v-model="addForm.test"></el-input>
          </el-form-item>
          <el-form-item
            v-for="domain in addForm.domains"
            :key="domain.key"
            class="addtest">
            <span>{{domain.lab}}</span>
            <el-input v-model="domain.value" class="quest-input"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button @click="addDomain()" class="btn-add2"><img :src="addImg2" alt="">添加</el-button>
          </el-form-item>
          <el-form-item label="正确答案:" prop="answ2" class="testansw">
            <el-checkbox-group v-model="addForm.answ2" @change="dmClick">
              <el-checkbox-button v-for="domain2 in addForm.domains" :label="domain2.lab"
                                  :key="domain2.key"></el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item class="aform-footer">
            <el-button @click="resetForm('addForm')">取 消</el-button>
            <el-button @click="submitForm('addForm')">添 加</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-dialog>

    <!-- 制定出题规则 -->
    <el-dialog title="制定出题规则" :visible.sync="makeDialogVisible" :close-on-click-modal="false" 
      center class="addDialog on ctgz" width="1200px">
      <el-row>
        <el-form :model="makeForm" :rules="makeFormRules" ref="makeForm" class="adform-list">
          <el-form-item label="出题类型:" prop="mold" class="line">
            <el-select v-model="makeForm.mold" placeholder="--请选择--" class="bd" @change="moldChange">
              <el-option :label="item.name" :value="item.id" v-for="item in txing" :key="item.id+'n1'">
              </el-option>
            </el-select>
            <span class="zhu">注：实操+理论总分必须=70分</span>
          </el-form-item>
          <el-row class="ctgz-cont">
            <el-col :span="14" class="ctgz-list">
              <el-form-item label="理论测试总分:" prop="totalScore1" class="ctgz-list1">
                <el-input v-model.number="makeForm.totalScore1" type="number"  class="bd" @input="changeScore1"></el-input>
                <span>分</span>
              </el-form-item>
              <el-form-item :label="makeForm.ctgzService.name+':'"  class="ctgz-list2" v-if="makeForm.mold != '--请选择--'">
                <el-input v-model="makeForm.ctgzService.randomRq" class="bd" @change="changes1"></el-input>
                <span class="sa3">题</span>
                <!-- <span class="sa1">每</span> -->
                <el-input v-model="makeForm.ctgzService.score" class="bd" @change="changes2"></el-input>
                <span class="sa2">分/每题</span>
                <span class="sa1 red">低于</span>
                <el-input v-model="makeForm.ctgzService.pass" class="bd"></el-input>
                <span class="sa3 red">分不合格</span>
              </el-form-item>
              <el-form-item :label="subItem.name+':'" v-for="subItem in smallType" :key="subItem.id+Math.random()" class="ctgz-list2">
                <el-input v-model="subItem.randomRq" class="bd" @change="changes4"></el-input>
                <span class="sa3">题</span>
                <!-- <span class="sa1">每</span> -->
                <el-input v-model="subItem.score" class="bd" @change="changes5"></el-input>
                <span class="sa2">分/每题</span>
                <span class="sa1 red">低于</span>
                <el-input v-model="subItem.pass" class="bd"></el-input>
                <span class="sa3 red">分不合格</span>
              </el-form-item>
            </el-col>
            <el-col :span="10" class="ctgz-list">
              <el-form-item label="专家实操总分:" prop="totalScore2" class="ctgz-list1">
                <el-input v-model.number="makeForm.totalScore2" type="number" class="bd" @input="changeScore2"></el-input>
                <span>分</span>
              </el-form-item>
              <el-form-item :label="subItem.name+':'" v-for="subItem in makeForm.quality" :key="subItem.id+Math.random()"  class="ctgz-list2">
                <el-input v-model="subItem.score" class="bd" @change="changes6"></el-input>
                <span class="sa2">分</span>
                <span class="sa1 red">低于</span>
                <el-input v-model="subItem.pass" class="bd"></el-input>
                <span class="sa3 red">分不合格</span>
              </el-form-item>
            </el-col>
            <div class="ctgz-hr"></div>
          </el-row>
          <el-form-item class="aform-footer ctgz-btn">
            <el-button @click="resetMakeForm('makeForm')">取 消</el-button>
            <el-button @click="submitMakeForm('makeForm')">确认规则</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-dialog>

    <!-- 修改试题 -->
    <el-dialog title="更改试题" :visible.sync="modifyDialogVisible" :close-on-click-modal="false" center class="addDialog hd">
      <el-row>
        <el-form :model="modifyForm" :rules="modifyFormRules" ref="modifyForm" label-width="100px" class="adform-list">
          <el-form-item label="类型:" prop="mold">
            <el-select v-model="modifyForm.mold" placeholder="--请选择--" class="bd" @change="moldChangeText">
              <el-option :label="item.name" :value="item.id" v-for="item in txing" :key="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" class="adform-item">
            <template v-if="modifyForm.mold != '-1'">
              <el-radio-group v-model="modifyForm.sub1" @change="modifySubItem1">
                <template v-for="(item,index) in smallType">
                  <div class="ra" @dblclick="dblClick(item,index,false)" :key="index">
                    <el-radio-button :label="item.id" :key="item.value">{{item.name}}</el-radio-button>
                  </div>
                </template>
              </el-radio-group>
              <el-button class="btn-add" @click="addYuClick(false)"><img :src="addImg2" alt="">添加</el-button>
            </template>
          </el-form-item>
          <el-form-item label="试题:" prop="test">
            <el-input type="textarea" v-model="modifyForm.test"></el-input>
          </el-form-item>
          <el-form-item
            v-for="domain in modifyForm.domains"
            :key="domain.key"
            class="addtest">
            <span>{{domain.lab}}</span>
            <el-input v-model="domain.value" class="quest-input" @input="changeIp($event)"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button @click="addDomainTest()" class="btn-add2"><img :src="addImg2" alt="">添加</el-button>
          </el-form-item>
          <el-form-item label="正确答案:" prop="answ2" class="testansw">
            <el-checkbox-group v-model="modifyForm.answ2" @change="dmClickTest">
              <el-checkbox-button v-for="domain2 in modifyForm.domains" :label="domain2.lab"
                                  :key="domain2.key"></el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item class="aform-footer">
            <el-button @click="resetForm2('modifyForm')">取 消</el-button>
            <el-button @click="submitForm2('modifyForm')">更改</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import {exam, addExam, updateExam, modifySmallType, updateSmallBatch,delExam,importExcell} from '@/api/api'
  import Page from '@/components/Page.vue'
  import {mapGetters} from 'vuex'
  export default {
    name: 'talentAudit',
  components: {
      Page
    },
    data() {
      return {
        zwsjImg: require('@/assets/images/zwsj.png'),
        sUrl: require('@/assets/images/search2.png'),
        editImg1: require('@/assets/images/edit1.png'),
        editImg2: require('@/assets/images/edit2.png'),
        deletImg1: require('@/assets/images/delet1.png'),
        deletImg2: require('@/assets/images/delet2.png'),
        dallImg: require('@/assets/images/delet3.png'),
        importImg: require('@/assets/images/import.png'),
        addImg: require('@/assets/images/add.png'),
        setImg: require('@/assets/images/set2.png'),
        addImg2: require('@/assets/images/add2.png'),
        taSearchText: '',
        // txg1: '理论题',
        txg2: '全部',
        // txing1: '全部',
        txing2: '-1',
        txing: [],
        childTypeList: [],
        childType1: [],
        smallType: [],
        tableDataList: [],
        multipleSelection: [],
        addDialogVisible: false,
        addForm: {
          mold: '--请选择--',
          sub1: '',
          domains: [
            {
              value: '',
              key: 'A',
              lab: 'A'
            },
            {
              value: '',
              key: 'B',
              lab: 'B'
            },
            {
              value: '',
              key: 'C',
              lab: 'C'
            },
            {
              value: '',
              key: 'D',
              lab: 'D'
            }
          ],
          answ2: []
        },
        addFormRules: {
          mold: [
            {required: true, message: '请选择一个分类', trigger: 'blur'}
          ],
          sub1: [
            {message: '请选择一个小类', trigger: 'blur'}
          ],
          test: [
            {required: true, message: '请填写试题', trigger: 'blur'}
          ],
          domains: [
            {required: true, message: '请填写试题答案', trigger: 'blur'}
          ],
          answ2: [
            {required: true, message: '请选择答案', trigger: 'blur'}
          ]
        },
        cont: Date.now(),
        currentPage: 1,
        pageSize: 10,
        total: 0,
        num1: 1,
        num2: 0,
        num3: 1,
        num4: 0,
        // 制定出题规则
        makeDialogVisible: false,
        // 出题makeForm
        makeForm: {
          // subject: '理论题',
          mold: '--请选择--',
          totalScore1: 0,
          totalScore2: 0,
          tnumArr:[],
          quality: [],
          ctgzService: {}
        },
        makeFormRules: {},
        totals1: 0,
        totals2: 0,
        totals3: 0,
        cdType1: [],
        cdType2: [],
        cdType3: {},
        score: 2,
        score2: 4,
        mold1: [],
        moldSum: 0,
        // exam id
        examId: '',
        smallId: '',
        aswArr: [],
        // add exam
        moldId: '',
        smallMoldId: '',
        answNum: '',
        moreIdx: 0,
        addSmallType: {
          id: '',
          name: ''
        },
        // 修改试题
        modifyDialogVisible: false,
        modifyForm: {
          mold: '-1',
          sub1: '',
          test: '',
          domains: [],
          answ2: []
        },
        modifyFormRules: {
          mold: [
            {required: true, message: '请选择一个分类', trigger: 'blur'}
          ],
          sub1: [
            {message: '请选择一个小类', trigger: 'blur'}
          ],
          test: [
            {message: '请填写试题', trigger: 'blur'}
          ],
          domains: [
            {message: '请填写试题答案', trigger: 'blur'}
          ],
          answ2: [
            {required: true, message: '请选择答案', trigger: 'blur'}
          ]
        },
        // 类型select
        aswArr2: [],
        moldId2: '',
        answNum2: '',
        moreIdx2: 0,
        addSmallType2: {
          id: '',
          name: ''
        },
        smId: null,
        smId2: null,
        newHeight: 0,
        radio: 'A、及时回答、问多不烦、事多不厌',
        listAnswer: 'A',
        // 理论测试题答案
        letters:['A','B','C','D','E','F','G','H','I','J','K','L','M','N'],
        isDel:false
      }
    },
    computed: {
      ...mapGetters([
        'getExamDetail',
        'getSysMetaData',
        'getUsers'
      ]),
      pdb: function() {
        return this.newHeight
      }
    },
    created() {
      // 获取理论测试题
      this.getExam()
      this.getListDataType()
      window.addEventListener('resize', this.getHeight);
      this.getHeight()
    },
    destroyed(){
      window.removeEventListener('resize', this.getHeight)
    },
    methods: {
      getListDataType() {
        this.txing = [];
        this.getSysMetaData.forEach((item, index) => {
          if (item.pid === 2 && item.status == 1) {
            this.txing.push(item)
            if (this.txg2 == item.id) {
              this.childType1 = item.smData.childType;
              this.smallType = this.childType1;
            }
          }
        });
      },
      changeInput() {
        if (this.taSearchText === '') {
          this.tableDataList = this.tableData
        }
      },
      txClick(val) {// 五大类型
        this.txg2 = val
        this.currentPage = 1
        if (this.txg2 == '全部') {
          this.examId = ''
          this.smallId = ''
          this.childType1 = [];
          this.addForm.mold = "--请选择--";
          this.makeForm.mold = "--请选择--";
          this.smallType = [];
          this.makeForm.ctgzService = '';
          this.makeForm.tnumArr = [];
          this.makeForm.quality = [];
        } else {
          this.smallId = ''
          this.examId = val;
          this.addForm.mold = val;
          this.makeForm.mold = val;
          this.txing.forEach((e, i) => {
          if (e.id == val) {
              this.makeForm.ctgzService = e.smData.service;
              this.makeForm.tnumArr = e.smData.childType;
              this.makeForm.quality = e.smData.quality;
              this.getStore()
              this.makeForm.totalScore1 = this.totals1 + this.totals2
              this.makeForm.totalScore2 = this.totals3
            }
          })
        }
        this.getExam()
        this.txing2 = "全部"
        this.txing.forEach((e, i) => {
          if (e.id == val) {
            this.childType1 = e.smData.childType;
            this.smallType = this.childType1;
          }
        })
        // getHeight
        setTimeout(() => {
            let height = this.$refs.tHeight1.offsetHeight
            if(height < 600){
                this.newHeight = height
            }
        }, 300);
      },
      getHeight() {// getHeight
        setTimeout(() => {
            let height = this.$refs.tHeight1.offsetHeight
            if(height < 600){
                this.newHeight = height
            }
        }, 300);
      },
      jpClick2(val) {
        this.currentPage = 1
        this.txing2 = val
        if (this.txing2 == '-1') {
          this.smallId = ''
        } else {
          this.smallId = val;
        }
        this.addForm.sub1 = val;
        this.getExam()
      },
      getExam() {// 获取理论测试题
        let params = {
          app: 3,
          device: 5,
          examType: this.examId,
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          smallType: this.smallId,
          status: '',
          token: this.getUsers.token
        }
        exam(params).then(res => {
          if (res.code == 200) {
            this.tableDataList = res.data.records
            this.total = res.data.total
            this.tableDataList.forEach(item => {
              item.tagMore = item.more
              item.test = item.info
              item.date = item.createTime
              item.dan = this.getcommonFun.getLetter(item.answer)
            })
          }
        })
      },
      editClick(row) {// 修改
        this.modifyDialogVisible = true
        this.modifyForm.mold = row.type
        this.modifyForm.sub1 = row.smallType
        this.modifyForm.test = row.info
        this.modifyForm.domains = [];
        for (let i = 0; i < row.options.length; i++) {
          this.modifyForm.domains[i] = {
            value: row.options[i],
            key: String.fromCharCode(65 + i),
            lab: String.fromCharCode(65 + i)
          };
        }
        this.txing.forEach((e, i) => {
          if (row.type == e.id) {
            this.smallType = e.smData.childType;
          }
        })
        this.modifyForm.answ2 = (this.getcommonFun.getLetter(row.answer)+'').split(',')
      },
      deleteClick(row) {// 删除一条
        const { id }=row
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            id
          }
          delExam(params).then(res => {
            if(res.code == 200){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getExam()
            }else{
              this.$message.error({ message:res.msg})
            }
          })
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleSelectionChange(val) {// 全选
        let idArr=val.map(item=>item.id)
        this.multipleSelection = idArr.join(',');
      },
      deletAll() { // 全删
        if(!this.multipleSelection.length){
          this.$message.error({ message:'请选择要删除的内容'})
        }else{
          this.isDel=true
          let params = {
            id:this.multipleSelection
          }
          delExam(params).then(res => {
            if(res.code == 200){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.isDel=false
              this.getExam()
            }else{
              this.isDel=false
              this.$message.error({ message:res.msg})
            }
          })
        }
      },
      cellClick(row, event, column) {// 整行
        sessionStorage.setItem('talentExamDetail', row)
        this.$store.commit('updateExamDetail', row)
      },
      filterTag(value, row) {// 排序
        return row.tagMore === value;
      },
      changePage(page) {// 分页
        this.currentPage = page
        this.getExam()
      },
      moldChange(val) { // 类型
        this.addForm.mold = val
        this.makeForm.mold = val
        this.txing.forEach((e, i) => {
          if (e.id == val) {
            this.smallType = e.smData.childType;
            if (this.smallType != null && this.smallType.length > 0) {
              this.addForm.sub1 = this.smallType[0].id;
              this.makeForm.sub1 = this.smallType[0].id;
            }
            this.makeForm.ctgzService = e.smData.service;
            this.makeForm.tnumArr = e.smData.childType;
            this.makeForm.quality = e.smData.quality;
            this.getStore()
            this.makeForm.totalScore1 = this.totals1 + this.totals2
            this.makeForm.totalScore2 = this.totals3
          }
        })
      },
      addYuClick(addOrUp) {
        if (addOrUp && (this.addForm.mold == '--请选择--' || this.addForm.mold == '-1') || !addOrUp && (this.modifyForm.mold == '-1')) {
          alert("请选择试题分类");
          return;
        }
        this.$prompt('', '新增分类', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[\u4e00-\u9fa5]{0,}$/,
          inputErrorMessage: '内容格式不正确'
        }).then(({value}) => {
          if (value != null) {
            let params = {
              pass: '',
              randomRq: '',
              score: '',
              // smallType: this.smallMoldId,
              smallType: '',
              smallTypeName: value,
              type: addOrUp ? this.addForm.mold : this.modifyForm.mold
            }
            modifySmallType(params).then(res => {
              if (res.code == 200) {
                this.$message({
                  type: 'success',
                  message: '新增成功！',
                });
                let data = res.data;
                this.smallType = data.smData.childType;
                if (addOrUp) {
                  this.addForm.sub1 = this.smallType[this.smallType.length - 1].id;
                } else {
                  this.modifyForm.sub1 = this.smallType[this.smallType.length - 1].id;
                }
                // this.$emit('updateTest', data)
                this.$store.commit("updateSysMetaData", data);
                this.getListDataType();
                // this.getExam()
              }
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
      },
      dblClick(v, idx, addOrUp) {
        this.$prompt('', '重命名', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[\u4e00-\u9fa5]{0,}$/,
          inputErrorMessage: '内容格式不正确'
        }).then(({value}) => {
          if (value != null) {
            let params = {
              pass: '',
              randomRq: '',
              score: '',
              smallType: addOrUp ? this.addForm.sub1 : this.modifyForm.sub1,
              smallTypeName: value,
              type: addOrUp ? this.addForm.mold : this.modifyForm.mold
            }
            modifySmallType(params).then(res => {
              if (res.code == 200) {
                this.$message({
                  type: 'success',
                  message: '重命名成功！',
                });
                this.smallType.forEach(item => {
                  this.smallType[idx].value = Date.now()
                  this.smallType[idx].label = value
                  this.smallType[idx].name = value
                })
                this.$store.commit("updateSysMetaData", res.data);
                this.getListDataType();
              }
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
      },
      addDomain() {// 添加答案
        if (this.num1 > 2) {
          this.$message({
            type: 'error',
            message: '选项超过填写限制'
          });
          return;
        }
        this.addForm.domains.push({
          value: '',
          key: String.fromCharCode(65 + 2 + (++this.num1)),
          lab: String.fromCharCode(65 + 2 + this.num1),
        })
      },
      dmClick(val) {// 正确答案
        this.answNum = this.getcommonFun.getLetterNum(this.addForm.answ2)
        if (val.length === 1) {
          this.moreIdx = 0
        } else if (val.length > 1) {
          this.moreIdx = 1
        } else if (val.length === 0) {
          this.moreIdx = ''
        } else {
          this.moreIdx = 2
        }
        // this.getExam()
      },
      changeSubItem1(val) {
        this.addForm.sub1 = val
      },
      submitForm(addForm) {// 提交新增试题
        this.$refs[addForm].validate((valid) => {
          if (valid) {
            const arr = this.addForm.domains.map(item => {
              return item.value
            })
            this.aswArr = arr
            let params = {
              answer: this.getcommonFun.getLetterNum(this.addForm.answ2),
              // answer: this.answNum,
              difficulty: '',
              info: this.addForm.test,
              more: this.moreIdx,
              myFile: '',
              op1: this.aswArr[0],
              op2: this.aswArr[1],
              op3: this.aswArr[2],
              op4: this.aswArr[3],
              op5: this.aswArr[4],
              op6: this.aswArr[5],
              score: '1',
              smallType: this.addForm.sub1,
              // smallType: this.smallMoldId,
              // smallType: this.addForm.mold == '精品家务'?this.getcommonFun.getSubId('精品家务',this.addForm.sub1):this.addForm.mold == '私家月嫂'?this.getcommonFun.getSubId('私家月嫂',this.addForm.sub2):this.addForm.mold == '特色育婴'?this.getcommonFun.getSubId('特色育婴',this.addForm.sub3):this.addForm.mold == '家庭教师'?this.getcommonFun.getSubId('家庭教师',this.addForm.sub4):this.addForm.mold == '安全护卫'?this.getcommonFun.getSubId('安全护卫',this.addForm.sub5):this.getcommonFun.getSubId('蒙氏教育',this.addForm.sub6),
              // smallTypeName: this.addSmallType.name,
              tinyType: '',
              type: this.addForm.mold
            }
            console.log("----", params);
            addExam(params).then(res => {
              if (res.code == 200) {
                this.resetForm("addForm");
                this.$myMessage('success', '添加成功！')
                this.addDialogVisible = false
                this.getExam()
              }
            })
          } else {
            this.$myMessage('error', '请输入正确格式的参数')
            return false
          }
        })
      },
      resetForm(addForm) {// 重置新增试题表单
        this.$refs[addForm].resetFields();
        this.num1 = 1;
        this.num2 = 0;
        this.addForm.domains.splice(4, this.addForm.domains.length - 1);
        this.addForm.domains.forEach((e, i) => {
          e.value = "";
        });
        this.addDialogVisible = false
      },
      submitMakeForm(makeForm) {// 提交出题规则
        this.$refs[makeForm].validate((valid) => {
          if (valid) {
            this.getSysMetaData.forEach((item, index) => {
              if (item.pid === 2 && item.status == 1) {
                if (this.makeForm.mold == item.id) {
                  item.smData.service = this.makeForm.ctgzService;
                  item.smData.childType = this.makeForm.tnumArr;
                  item.smData.quality = this.makeForm.quality;
                  if((this.totals1 + this.totals2) > this.makeForm.totalScore1 || this.totals3 > this.makeForm.totalScore2) {
                    this.$myMessage('error', '您输入的分数不合理，请重新输入！')
                  } else {
                    updateSmallBatch(item).then(res =>{
                      console.log(res)
                      this.$myMessage('success', '修改成功！')
                      this.makeDialogVisible = false
                      this.getListDataType()
                    })
                    return;
                  }
                }
              }
            });
          } else {
            this.$myMessage('error', '请输入正确格式的参数')
            return false
          }
        })
      },
      resetMakeForm(makeForm) {// 重置出题规则表单
        // this.$refs[makeForm].resetFields()
        this.makeDialogVisible = false
        this.disabled = false
      },
      getStore(){// 出题规则理论测试总分
        const sarr2 = this.makeForm.tnumArr.map(item =>{
          return (item.randomRq) * (item.score)
        })
        const sarr3 = this.makeForm.quality.map(item =>{
          return item.score
        })
        this.totals1 = (this.makeForm.ctgzService.randomRq) * (this.makeForm.ctgzService.score)
        this.totals2 = eval(sarr2.join("+"))
        this.totals3 = eval(sarr3.join("+"))
      },
      changeScore1(val){
        this.makeForm.totalScore1 = val
        this.makeForm.totalScore2 = 70 - val
        if(val < 0 || val > 70) {
          this.makeForm.totalScore1 = 0
          this.makeForm.totalScore2 = 0
          this.$myMessage('error', '您输入的理论测试分数不合理，请重新输入！')
        }
      },
      changeScore2(val){ // 出题规则实操总分
        this.makeForm.totalScore2 = val
        this.makeForm.totalScore1 = 70 - val
        if(val < 0 || val > 70) {
          this.makeForm.totalScore1 = 0
          this.makeForm.totalScore2 = 0
          this.$myMessage('error', '您输入的实操分数不合理，请重新输入！')
        }
      },
      changes1(val){
        this.getStore()
        if((this.totals1 + this.totals2) > this.makeForm.totalScore1) {
          this.$myMessage('error', '您输入的理论测试分数不合理，请重新输入！')
        }
      },
      changes2(val){
        this.getStore()
        if((this.totals1 + this.totals2) > this.makeForm.totalScore1) {
          this.$myMessage('error', '您输入的理论测试分数不合理，请重新输入！')
        }
      },
      changes4(val){
        this.getStore()
        if((this.totals1 + this.totals2) > this.makeForm.totalScore1) {
          this.$myMessage('error', '您输入的理论测试分数不合理，请重新输入！')
        }
      },
      changes5(val){
        this.getStore()
        if((this.totals1 + this.totals2) > this.makeForm.totalScore1) {
          this.$myMessage('error', '您输入的理论测试分数不合理，请重新输入！')
        }
      },
      changes6(val){
        this.getStore()
        if(this.totals3 > this.makeForm.totalScore2) {
          this.$myMessage('error', '您输入的实操分数不合理，请重新输入！')
        }
      },
      moldChangeText(val) {// 更改试题类型
        this.addForm.mold = val
        this.makeForm.mold = val
        this.txing.forEach((e, i) => {
          if (e.id == val) {
            this.smallType = e.smData.childType;
            if (this.smallType != null && this.smallType.length > 0) this.modifyForm.sub1 = this.smallType[0].id;
          }
        })
      },
      addDomainTest() {// 添加答案
        if (this.num1 > 2) {
          this.$message({
            type: 'error',
            message: '选项超过填写限制'
          });
          return;
        }
        const dmArr = this.modifyForm.domains
        const lastLab = dmArr[dmArr.length-1]
        console.log(lastLab,lastLab.key,lastLab.lab)
        console.log(dmArr.length)
        if (dmArr.length == 5){
          this.modifyForm.domains.push({
            value: '',
            key: String.fromCharCode(65 + 3 + (++this.num1)),
            lab: String.fromCharCode(65 + 3 + this.num1)
          })
          this.num1 = 3
        }
        if (dmArr.length == 4){
          this.modifyForm.domains.push({
            value: '',
            key: String.fromCharCode(65 + 3 + this.num1),
            lab: String.fromCharCode(65 + 3 + this.num1),
          })
        }
        if (dmArr.length == 6){
          this.$message({
            type: 'error',
            message: '选项超过填写限制'
          });
        }

        // this.modifyForm.domains.push({
        //   value: '',
        //   key: String.fromCharCode(65 + 2 + (++this.num1)),
        //   lab: String.fromCharCode(65 + 2 + this.num1),
        // })
        
      },
      dmClickTest(val) {// 正确答案
        this.answNum2 = this.getcommonFun.getLetterNum(this.modifyForm.answ2)
        if (val.length === 1) {
          this.moreIdx2 = 0
        } else if (val.length > 1) {
          this.moreIdx2 = 1
        } else if (val.length === 0) {
          this.moreIdx2 = ''
        } else {
          this.moreIdx2 = 2
        }
        // this.getExam()
      },
      modifySubItem1(val) {
        this.modifyForm.sub1 = val;
      },
      submitForm2(modifyForm) {
        this.$refs[modifyForm].validate((valid) => {
          if (valid) {
            const arr = this.modifyForm.domains.map(item => {
              return item.value
            })
            this.aswArr2 = arr
            let params = {
              answer: this.getcommonFun.getLetterNum(this.modifyForm.answ2),
              difficulty: '',
              id: this.getExamDetail.id,
              info: this.modifyForm.test,
              more: this.moreIdx2,
              myFile: '',
              op1: this.aswArr2[0],
              op2: this.aswArr2[1],
              op3: this.aswArr2[2],
              op4: this.aswArr2[3],
              op5: this.aswArr2[4],
              op6: this.aswArr2[5],
              score: '',
              smallType: this.modifyForm.sub1,
              tinyType: '',
              type: this.modifyForm.mold
            }
            updateExam(params).then(res => {
              if (res.code == 200) {
                this.$myMessage('success', '更改成功！')
                this.modifyDialogVisible = false
                this.getExam()
                this.currentPage = 1
                this.$refs[modifyForm].resetFields()
              }
            })
          } else {
            this.$myMessage('error', '请输入正确格式的参数')
            return false
          }
        })
      },
      resetForm2(formName) {// 重置更改试题表单
        this.$refs[formName].resetFields();
        this.num1 = 1;
        this.num2 = 0;
        this.modifyForm.domains.splice(4, this.addForm.domains.length - 1);
        this.modifyForm.domains.forEach((e, i) => {
          e.value = "";
        });
        this.modifyDialogVisible = false
      },
      changeIp(e){
        this.$forceUpdate()
      },
      importExcell(){//点击导入
          this.$refs.fileInput.click()
      },
      isExcell(file){//判断是否是excell类型的文件
        let fileName = file.name.split('.');
        if(fileName[fileName.length -1]=== "xlsx" ||
            fileName[fileName.length -1]=== "xls" ||
            filfileName[fileName.length -1]=== "xltx" ||
            fileName[fileName.length -1]=== "xlt" ||
            fileName[fileName.length -1]=== "xlsm" ||
            fileName[fileName.length -1]=== "xlsb" ||
            fileName[fileName.length -1]=== "xltm" ||
            fileName[fileName.length -1]=== "csv"
        ){
          return true
        }else{
          return false;
        }
      },
      fileChange(e){
        let file=this.$refs.fileInput.files[0]
        if(this.isExcell(file)){
          importExcell({file}).then(res => {
            if(res.code == 200){
              this.$message.success({message:"上传成功"})
              this.getExam()
            }else{
              this.$message.error({ message:res.msg})
            }
          })
        }else{
          this.$message.error({ message:"请上传excell格式的文件"})
        }
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .tstore {
    position: relative;
    .txing {
      margin-bottom: 15px;
      padding-right:1.5rem;
      .txing-cont {
        margin-bottom: 10px;
        .txing-title {
          display: block;
          float: left;
          margin-right: 10px;
          font-size: 17px;
          font-family: PingFang SC;
          font-weight: 600;
          color: #111;
          line-height: 24px;
        }

        .el-radio-group {
          width: 90%;
          display: block;
          float: left;
          line-height: 24px;
        }

        .el-radio-button {
          margin-bottom: 10px;
          margin-right: 5px;
        }
      }

      .txing-container {
        padding-left: 44px;
      }
    }

    .ctrule {
      // width: 150px;
      height: 38px;
      line-height: 38px;
      background: #8F82BC;
      color: #fff;
      position: absolute;
      top: 0;
      right: 0;
      font-size: 15px;
      font-family: PingFang SC;
      font-weight: 400;
      padding: 0 .14rem;

      &:hover {
        background: rgba(143, 130, 188, .8);
      }

      img {
        width: 22px;
        height: 22px;
        margin-top: -4px;
        margin-right: 10px;
      }
    }
  }

  .h20 {
    height: 20px;
    background: #F5F5F5;
    margin-bottom: 10px;
  }

  .adform-list .btn-add img, .adform-list .btn-add2 img {
    height: 18px;
    margin-right: 10px;
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

</style>

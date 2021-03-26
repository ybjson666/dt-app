<template>
  <div class='contractor-wraps'>
        <div class="order-contents">
            <div class="search-block">
                <span>订单搜索：</span>
                <div class="search-section">
                    <el-input placeholder="订单名,订单号,雇员名..." v-model="serachStr" @keyup.enter.native="search"/>
                    <img :src="searchImg" alt="" class="search-icon" @click="search"/>
                </div>
            </div>
            <div class="result-block">
                <el-table
                :data="orderList"
                style="width: 100%"
                ref="multipleTable"
                size="mini"
                class="order-table"
                >
                    <el-table-column label="" width="20">
                        <template scope="scope">
                        <el-radio :label="scope.$index+1" v-model="selectId" @change.native="getCurrentRow(scope.row)"></el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="orderId"
                        label="订单号"
                        >
                        <template slot-scope="scope">
                            <span>{{scope.row.orderDemandCommon.id }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="雇主"
                        >
                        <template slot-scope="scope">
                            <span>{{scope.row.orderDemandCommon.name||"--" }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="type"
                        label="服务类容"
                        >
                        <template slot-scope="scope">
                            <span>{{scope.row.orderDemandCommon.typeName }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="page-block">
                <Page :currentPage="currentPage" :pageSize="pageSize" :total="total" @changePage="changePage" v-if="hasNext"></Page>
            </div>
            <div class="send-block">
                <el-button  class="send-btn" @click="send" :disabled="!selectId">发送</el-button>
            </div>
        </div>
  </div>
</template>

<script>
import Page from '@/components/Page.vue'
import { demandList} from '@/api/api'
import { mapGetters } from 'vuex'
export default {
    name:'',
    data () {
        return {
            searchImg: require('@/assets/images/search.png'),
            serachStr:"",
            currentPage:1,
            pageSize:10,
            total:0,
            orderList:[],
            hasNext:false,
            selectId:"",
            selectOrder:{}
        };
    },
    computed:{
        ...mapGetters(['getUsers'])
    },
    components:{
        Page
    },
    methods: {
        async search(){//搜索
            let params = {
                app: 3,
                device: 5,
                pageNo: this.currentPage,
                pageSize: this.pageSize,
                serviceId: "",
                token: this.getUsers.token,
                type: '2',
                searchParameters:this.serachStr 
            }
            const result=await demandList(params)
            if(result.code===200){
                let list=result.data.records;
                this.orderList=list;
                this.total=result.data.total;
                this.hasNext=result.data.total>result.data.size
            }
        },
        changePage(val){//分页
            this.currentPage = val
            this.search()
        },
        send(){
            this.$emit('sendOrder',this.selectOrder)
            this.currentPage=1;
            this.serachStr=""
            this.orderList=[]
            this.hasNext=false
            this.selectOrder={}
            this.selectId=""
        },
        getCurrentRow(row) {
            this.selectOrder=row
        }
    }
}

</script>
<style lang='scss' scoped>
.contractor-wraps{
    width:100%;
    .order-contents{
        height:100%;
        .search-block{
            padding:10px 0;
            width: 100%;
            display: flex;
            span{
                width: 0.9rem;
                height: 30px;
                line-height:30px;
                font-size:13px;
            }
            .search-section{
                flex: 1;
                height:30px;
                position: relative;
                line-height: 26px;
                font-size: 13px;
                .search-icon{
                    position:absolute;
                    right:0px;
                    top:8px;
                    display:block;
                    width:16px;
                    height:16px;
                    cursor: pointer;
                }
            }
        }
        .result-block{
            border-top:1px solid #eaeaea;
            height:2.7rem;
            padding-top:5px;
            box-sizing: border-box;
            overflow-y: scroll;
        }
        .page-block{
            height:30px;
            line-height:30px;
        }
        .send-block{
            margin-top: 10px;
            padding:10px 20px;
            box-sizing: border-box;
            border-top:1px solid #eaeaea;
            .send-btn{
                padding:10px 30px;
                background:#1890ff;
                color: #fff;
                border-radius: 6px;
            }
        }
    }
}
</style>
<template>
    <div class="tinntay-cont talent-eva">
        <div class="talentAudit r410" style="padding:0;">
            <div class="user-container">
                <div class="user-top-block">
                    <div class="searchs-block">
                        <el-input placeholder="请输入姓名" v-model="name">
                        </el-input>
                    </div>
                    <button class="btns seek-btn" @click="search">查询</button>
                    <button class="btns add-btn" @click="handleAddUser">添加</button>
                </div>
                <div class="user-content">
                    <el-table :data="userList" highlight-current-row  border style="width: 100%" class="user-table">
                        <el-table-column prop="num" label="序号" width="">
                            <template slot-scope="scope">
                                <span>{{scope.$index+1}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="user_name" label="姓名" width="">
                            <template slot-scope="scope">
                                <span>{{scope.row.name||'--'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="user_nicks" label="昵称" width="">
                            <template slot-scope="scope">
                                <span>{{scope.row.nickname||'--'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="roleName" label="角色" width="">
                            <template slot-scope="scope">
                                <span>{{scope.row.roleName||'--'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="email" label="电话" width="">
                            <template slot-scope="scope">
                                <span>{{scope.row.phone||'--'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="status" label="状态" width="">
                            <template slot-scope="scope">
                                <span v-if="scope.row.status==0" class="green">可以使用</span>
                                <span v-else-if="scope.row.status==1" class="red">工作排满</span>
                                <span v-if="scope.row.status==2" class="blue">请假</span>
                                <span v-if="scope.row.status==3" class="orange">离职</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" label="创建时间" width="">
                            <template slot-scope="scope">
                                <span>{{scope.row.createTime||'--'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="operate" label="操作" width="">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" title="编辑" @click="handleEditUser(scope.row)"/>
                                <el-button type="warning" icon="el-icon-lock" title="更改状态" @click="handleStatus(scope.row.status,scope.row.id)"/>
                                <el-button type="success" icon="el-icon-setting" title="重置密码" @click="resetPwd(scope.row.id)"/>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="page-block">
                    <Page :currentPage="pageNo" :pageSize="pageSize" :total="total" @changePage="changePage"></Page>
                </div>
            </div>
        </div>
        <!--添加用户-->
        <el-dialog
            title="添加用户"
            :visible.sync="showAddUser"
            width="600px"
            @close="closeAddFrame"
        >
            <el-form :model="addForm" :rules="addrules" ref="addForm" label-width="90PX" class="add-form">
                <el-form-item label="姓名：" prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="电话：" prop="phone">
                    <el-input v-model="addForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="密码：" prop="pwd">
                    <el-input v-model="addForm.pwd"></el-input>
                </el-form-item>
                <el-form-item label="昵称：" prop="nickname">
                    <el-input v-model="addForm.nickname"></el-input>
                </el-form-item>
                <el-form-item label="性别：" prop="sex">
                    <el-radio-group v-model="addForm.sex">
                        <el-radio label="1">男</el-radio>
                        <el-radio label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="查看权限：" prop="dataScope">
                    <el-radio-group v-model="addForm.dataScope">
                        <el-radio label="1">部门所有权限</el-radio>
                        <el-radio label="2">仅能查看自己的权限</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="角色：" prop="roleId">
                    <el-select v-model="addForm.roleId" placeholder="请选择" @change="changeSele">
                        <el-option
                        v-for="item in rolesList"
                        :key="item.roleId"
                        :label="item.roleName"
                        :value="item.roleId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addUser" :disabled="isAdd">添加</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--编辑用户-->
        <el-dialog
            title="编辑用户"
            :visible.sync="showEditUser"
            width="600px"
            @close="closeEditFrame"
        >
            <el-form :model="editForm" :rules="addrules" ref="editForm" label-width="90PX" class="add-form">
                <el-form-item label="姓名：" prop="name">
                    <el-input v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="电话：" prop="phone">
                    <el-input v-model="editForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="密码：" prop="pwd">
                    <el-input v-model="editForm.pwd"></el-input>
                </el-form-item>
                <el-form-item label="昵称：" prop="nickname">
                    <el-input v-model="editForm.nickname"></el-input>
                </el-form-item>
                <el-form-item label="性别：" prop="sex">
                    <el-radio-group v-model="editForm.sex">
                        <el-radio label="1">男</el-radio>
                        <el-radio label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="查看权限：" prop="dataScope">
                    <el-radio-group v-model="editForm.dataScope">
                        <el-radio label="1">部门所有权限</el-radio>
                        <el-radio label="2">仅能查看自己的权限</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="editUser" :disabled="isEdit">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--更改状态-->
        <el-dialog
            title="更改状态"
            :visible.sync="showStatus"
            width="600px"
        >
            <el-row>
                <el-radio-group v-model="userStatus">
                    <el-radio label="0">可以使用</el-radio>
                    <el-radio label="1">工作排满</el-radio>
                    <el-radio label="2">请假</el-radio>
                    <el-radio label="3">离职</el-radio>
                </el-radio-group>
            </el-row>
            <el-row class="status-rows">
                <el-button type="primary" @click="sureStatus" >确定</el-button>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
import Page from '@/components/Page.vue'
import { getUserList,addUserList,editUserList,modifyUserStatus,modifyUserPwd,getRoles } from '@/api/api'
import { isvalidPhone } from '@/utils/regex.js'
export default {
name:'',
    data () {
        var validPhone=(rule, value,callback)=>{
            if (!value){
                callback(new Error('请输入电话号码'))
            }else  if (!isvalidPhone(value)){
                callback(new Error('请输入正确的11位手机号码'))
            }else {
                callback()
            }
        }
        return {
            name:"",
            userList:[],
            pageNo:1,
            pageSize:10,
            total:0,
            showAddUser:false,
            addForm:{
                app:3,
                device: 5,
                name:"",
                phone:"",
                pwd:"",
                nickname:"",
                roleId:"",
                roleName:"",
                dataScope:"1",
                sex:'1'//0女，1男
            },
            addrules:{
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ],
                phone:[
                    { required: true, trigger: 'blur', validator: validPhone}
                ],
                pwd:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, message: '长度在6位以上', trigger: 'blur' }
                ],
                nickname:[
                    { required: true, message: '请输入昵称', trigger: 'blur' },
                ],
                roleId:[
                    { required: true, message: '请选择角色', trigger: 'blur' },
                ]
            },
            showEditUser:false,
            editForm:{
                app:3,
                device: 5
            },
            showStatus:false,
            userStatus:"",
            modifyUid:"",//要修改用户的id
            rolesList:[],//角色列表
            isEdit:false,
            isAdd:false
        };
    },
    components: {
        Page
    },
    computed:{},
    created(){
        this.reqGetDatas()
        this.reqGetRoles()
    },
    methods: {
        reqGetRoles(){//获取角色
            getRoles().then(res=>{
                if(res.code===200){
                    this.rolesList=res.data.records
                }
            })
        },
        changePage(page){//分页
            this.pageNo=page
            this.reqGetDatas()
        },
        async reqGetDatas(){//获取用户列表
            const { pageNo,pageSize,name}=this
            let params = {
                pageNo,
                pageSize,
                name
            }
            const result=await getUserList(params)
            if(result.code===200){
                this.userList=result.data.records
                this.total=result.data.total
            }
        },
        closeAddFrame(){//关闭添加用户，模态框
            this.$refs.addForm.resetFields()	
        },
        closeEditFrame(){
            this.$refs.editForm.resetFields()
        },
        search(){//搜索
            this.reqGetDatas()
        },
        addUser(){//添加用户
            this.isAdd=true
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    addUserList(this.addForm).then(data=>{
                        if(data.code===200){
                            this.$message.success({ message: '添加成功'})
                            this.showAddUser=false
                            this.isAdd=false
                            this.reqGetDatas()
                            this.$refs.addForm.resetFields()
                            
                        }else{
                            this.$message.error({message:data.msg})
                            this.isAdd=false
                        }
                    })
                } else {
                    this.isAdd=false
                }
            });
        },
        handleAddUser(){
            this.showAddUser=true
        },
        handleEditUser(form){
            const { id,name,phone,pwd,nickname,sex,roleId,dataScope }=form
            this.editForm={ id,name,phone,pwd,nickname,dataScope,sex:sex.toString(),roleId:parseInt(roleId)||"" }
            this.showEditUser=true
        },
        handleStatus(status,id){
            this.userStatus=status.toString()
            this.modifyUid=id
            this.showStatus=true
        },
        resetPwd(id){//重置密码
            this.$prompt('','重置密码', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern:  /^[0-9A-Za-z]{1,12}$/,
                inputErrorMessage: '输入格式不正确，请重新输入！'
            }).then(({ value }) => {
                let params={
                    pwd:value,
                    id
                }
                modifyUserPwd(params).then(data =>{
                    if(data.code===200){
                        this.$message.success({ message: '修改成功'})
                        this.reqGetDatas()
                    }else{
                        this.$message.success({ message: data.msg})
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            })
        },
        editUser(){//编辑用户
            this.isEdit=true
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    editUserList(this.editForm).then(data=>{
                        if(data.code===200){
                            this.$message.success({ message: '修改成功'})
                            this.showEditUser=false
                            this.isEdit=false
                            this.reqGetDatas()
                            this.$refs.editForm.resetFields()
                        }else{
                            this.$message.error({message:data.msg})
                            this.isEdit=false
                        }
                    })
                } else {
                    this.isEdit=false
                }
            });
        },
        sureStatus(){//更改状态
            let params = {
                id:this.modifyUid,
                status:this.userStatus
            }
            modifyUserStatus(params).then(data=>{
                if(data.code===200){
                    this.showStatus=false
                    this.$message.success({ message: '修改成功'})
                    this.reqGetDatas()
                }   
            })
        },
        changeSele(val){
            this.rolesList.forEach(item=>{
                if(item.roleId==val){
                    this.addForm.roleName=item.roleName
                }   
            })
        }
    }
}

</script>
<style lang='scss' scoped>
.user-container{
    height:100%;
    overflow-y: scroll;
    padding:20px 30px;
    padding-top: 50px;
    box-sizing: border-box;
    .user-top-block{
        display:flex;
        .searchs-block{
            height:40px;
            width: 240px;
            margin-right: 20px;
        }
        .btns{
            width:80px;
            height:40px;
            line-height:40px;
            text-align:center;
            color: #fff;
            border:none;
            border-radius: 6px;
            margin-right: 20px;
            font-size: 16px;
        }
        .seek-btn{
            background:#409EFF;
        }
        .add-btn{
            background:#1ab394;
        }
        .del-btn{
            background:#ed5565;
        }
    }
    .user-content{
        margin-top: 50px;
        .user-table{
            .green{
                color:#1ab394;
            }
            .red{
                color:#ed5565;
            }
            .blue{
                color: #409EFF;
            }
            .orange{
                color:orange;
            }
        }
    }
    .page-block{
        margin-top: 30px;
    }
}
</style>
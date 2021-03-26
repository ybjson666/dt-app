<template>
    <div class='tinntay-cont talent-eva'>
        <div class="talentAudit r410" style="padding:0;">
            <div class="role-container">
                <div class="role-top-block">
                    <button class="btns add-btn" @click="handleAddUser">添加</button>
                </div>
                <div class="user-content">
                    <el-table :data="rolesList" highlight-current-row  border style="width: 100%" class="user-table">
                        <el-table-column prop="num" label="序号" width="">
                            <template slot-scope="scope">
                                <span>{{scope.$index+1}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="num" label="角色名" width="">
                            <template slot-scope="scope">
                                <span>{{scope.row.roleName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createBy" label="创建者" width="">
                            <template slot-scope="scope">
                                <span>{{scope.row.createBy}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="status" label="状态" width="">
                            <template slot-scope="scope">
                                <span v-if="scope.row.status==0" class="green">启用</span>
                                <span v-else-if="scope.row.status==1" class="red">停用</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="num" label="备注" width="">
                            <template slot-scope="scope">
                                <span>{{scope.row.remark}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" label="创建时间" width="">
                            <template slot-scope="scope">
                                <span>{{scope.row.createTime}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="operate" label="操作" width="">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" title="编辑" @click="handleEditRole(scope.row)"/>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <!--添加角色-->
        <el-dialog
            title="添加角色"
            :visible.sync="showAddRole"
            width="600px"
            @close="clearAddForm"
        >
            <el-form :model="addForm" :rules="addrules" ref="addForm" label-width="90PX" class="add-form">
                <el-form-item label="角色名：" prop="roleName">
                    <el-input v-model="addForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                    <el-input v-model="addForm.remark"></el-input>
                </el-form-item>
                <el-form-item label="使用状态：" prop="sex">
                    <el-radio-group v-model="addForm.status">
                        <el-radio label="0">启用</el-radio>
                        <el-radio label="1">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="菜单权限：" prop="menuId">
                    <el-tree
                        :data="menuList"
                        node-key="id"
                        ref="addTree"
                        show-checkbox
                        @check-change="checkChange"
                       >
                    </el-tree>
                </el-form-item>
                 <el-form-item label="专家类型：" prop="examType" v-show="isAddSeleExam" :rules="addrules.examType">
                    <el-select v-model="addForm.examType">
                        <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                            >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="sureAddRole" :disabled="isAdd">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--编辑角色-->
        <el-dialog
            title="编辑角色"
            :visible.sync="showEditRole"
            width="600px"
            @close="clearEditForm"
        >
            <el-form :model="editForm" :rules="addrules" ref="editForm" label-width="100PX" class="add-form">
                <el-form-item label="角色名：" prop="roleName">
                    <el-input v-model="editForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                    <el-input v-model="editForm.remark"></el-input>
                </el-form-item>
                <el-form-item label="使用状态：" prop="sex">
                    <el-radio-group v-model="editForm.status">
                        <el-radio label="0">启用</el-radio>
                        <el-radio label="1">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="菜单权限：" prop="menuId">
                    <el-tree
                        :data="menuList"
                        node-key="id"
                        ref="editTree"
                        show-checkbox
                        @check-change="checkChange2"
                        >
                    </el-tree>
                </el-form-item>
                <el-form-item label="专家类型：" prop="examType" v-show="isEditSeleExam">
                    <el-select v-model="editForm.examType">
                        <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                            >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="sureEditRole" :disabled="isEdit">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import { getRoles,getPowers,addRoles,editRoles,getMenuById} from '@/api/api'
import { mapGetters,mapMutations } from 'vuex'
export default {
    name:'',
    data () {
        return {
            rolesList:[],
            showAddRole:false,
            showEditRole:false,
            addForm:{
                roleName:"",
                remark:"",
                status:"0",
                createBy:"",
                examType:"",
                menuId:""//添加角色时选中的权限菜单
            },
            addrules:{
                roleName:[
                    { required: true, message: '请输入角色名', trigger: 'blur' },
                ],
                menuId:[
                    { required: true, message: '请选择菜单权限', trigger: 'blur' },
                ],
                examType:[
                    { required: false, message: '请选择专家类型', trigger: 'blur' },
                ] 
            },
            editForm:{
                roleName:"",
                remark:"",
                status:"",
                updateBy:"",
                menuId:"",
                examType:""
            },
            menuList:[],//菜单列表
            isAdd:false,
            isEdit:false,
            options:[
                {
                    name:"全部",
                    id:"75"
                },
                {
                    name:"特色育婴",
                    id:"76"
                },
                {
                    name:"高端月嫂",
                    id:"77"
                },
                {
                    name:"精品家务",
                    id:"78"
                },
                {
                    name:"安全护卫",
                    id:"79"
                },
                {
                    name:"家教老师",
                    id:"80"
                }
            ],
            isAddSeleExam:false,
            isEditSeleExam:false
        };
    },
    created(){
        this.reqGetDatas()
        this.reqGetPowers()
    },
    computed:{
        ...mapGetters(['getUsers'])
    },
    methods: {
        ...mapMutations(['setRoleMenus']),
        reqGetDatas(){//获取角色列表
            getRoles().then(res=>{
                if(res.code===200){
                    this.rolesList=res.data.records
                }
            })
        },
        reqGetPowers(){//获取菜单列表
            getPowers().then(res=>{
                if(res.code===200){
                    if(res.data.length){
                        let list=res.data;
                        list=list.map(item=>{
                            let menu={}
                            menu.id=item.menuId
                            menu.label=item.menuName
                            menu.children=[]
                            if(item.children&&item.children.length){
                                item.children.forEach(child=>{
                                    let childMenu={}
                                    childMenu.id=child.menuId
                                    childMenu.label=child.menuName
                                    menu.children.push(childMenu)
                                })
                            }
                            return menu
                        })
                        this.menuList=list
                    }
                }else{
                    this.$message.error({ message:res.msg})
                }
            })
        },
        handleAddUser(){//添加角色
            this.showAddRole=true
        },
        handleEditRole(row){
            this.showEditRole=true
            this.editForm.roleName=row.roleName
            this.editForm.remark=row.remark
            this.editForm.status=row.status
            this.editForm.roleId=row.roleId 
            this.editForm.examType=row.examType
            this.reqGetMenuById(row.roleId)
        },
        sureAddRole(){//确定添加角色
            let checkedKeys=this.$refs.addTree.getCheckedKeys()
            let halfCheckedKeys=this.$refs.addTree.getHalfCheckedKeys()
            let arr=checkedKeys.concat(halfCheckedKeys)
            this.addForm.menuId=arr.join(',')
            this.addForm.createBy=this.getUsers.name
            this.isAdd=true
            this.$refs.addForm.validate((valid) => {
                if(valid){
                    addRoles(this.addForm).then(res=>{
                        if(res.code===200){
                            this.$message.success({ message: '创建成功'})
                            this.showAddRole=false
                            this.isAdd=false
                            this.reqGetDatas()
                        }else{
                            this.$message.error({ message: res.msg})
                            this.isAdd=false
                        }
                    })
                }else {
                    this.isAdd=false
                }
            })
        },
        sureEditRole(){//确定编辑角色
            let checkedKeys=this.$refs.editTree.getCheckedKeys()
            let halfCheckedKeys=this.$refs.editTree.getHalfCheckedKeys()
            let arr=checkedKeys.concat(halfCheckedKeys)
            let roleId=localStorage.getItem('roleId')
            if (this.editForm.roleId==roleId){
                this.setRoleMenus(arr)
            } 
            this.editForm.menuId=arr.join(',')
            this.editForm.updateBy=this.getUsers.name
            this.isEdit=true
            this.$refs.editForm.validate((valid) => {
                if(valid){
                    editRoles(this.editForm).then(res=>{
                        if(res.code===200){
                            this.$message.success({ message: '修改成功'})
                            this.showEditRole=false
                            this.isEdit=false
                            this.reqGetDatas()
                        }else{
                            this.$message.error({ message: res.msg})
                            this.isEdit=false
                        }
                    })
                }else{
                    this.isEdit=false
                }
            })
        },
        clearAddForm(){//清空表单字段
            this.$refs.addForm.resetFields()
            this.addForm.menuId=[]
            this.$nextTick(()=>{
                this.$refs.addTree.setCheckedKeys([])
            })
        },
        clearEditForm(){
            this.$nextTick(()=>{
                let list = this.menuList
                for (let i = 0; i < list.length; i++) {
                    this.$refs.editTree.store.nodesMap[list[i].id].expanded = false
                    this.$refs.editTree.setCheckedKeys([])
                }
                this.editForm.menuId=[]
                this.$refs.editForm.resetFields()
            })
            
        },
        reqGetMenuById(roleId){
            let params={
                roleId
            }
            getMenuById(params).then(res=>{
                if(res.code===200){
                    let list=res.data;
                    let arr=list.map(item=>item.menuId)
                    this.editForm.menuId=arr.join(',')
                    this.$nextTick(()=>{
                        arr.forEach(item =>{
                            this.$refs.editTree.setChecked(item,true,false)
                        })
                    }) 
                }
            })
        },
        checkChange(data){
            let checkedKeys=this.$refs.addTree.getCheckedKeys()
            let halfCheckedKeys=this.$refs.addTree.getHalfCheckedKeys()
            let arr=checkedKeys.concat(halfCheckedKeys)
            if(arr.indexOf(5)>-1){
                this.isAddSeleExam=true
                this.addrules.examType=[
                    { required: true, message: '请选择专家类型', trigger: 'blur' },
                ]
            }else{
                this.isAddSeleExam=false
                this.addrules.examType=[
                    { required: false, message: '请选择专家类型', trigger: 'blur' },
                ]
            }
        },
        checkChange2(){
            let checkedKeys=this.$refs.editTree.getCheckedKeys()
            let halfCheckedKeys=this.$refs.editTree.getHalfCheckedKeys()
            let arr=checkedKeys.concat(halfCheckedKeys)
            if(arr.indexOf(5)>-1){
                this.isEditSeleExam=true
            }else{
                this.isEditSeleExam=false
            }
        }
    }
}

</script>
<style lang='scss' scoped>
.role-container{
    height:100%;
    overflow-y: scroll;
    padding:20px 30px;
    padding-top: 50px;
    box-sizing: border-box;
    .role-top-block{
        display:flex;
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
        .add-btn{
            background:#1ab394;
        }
        .del-btn{
            background:#ed5565;
        }
    }
    .user-content{
        margin-top: 50px;
    }
}
</style>
<template>
    <el-dialog :title="setTitle+'订单'" :visible.sync="showDialog" :close-on-click-modal="false" @close="closeDialog" width="" center class="newRecordAdd addDialog active hd hd2 invalid">
      <el-row class="orderInvalid flexbox">
        原因：
        <el-select v-model="invalidValue" placeholder="--请选择--" class="elSelect flexauto" :class="bdcolor2?'bdcolor':''" @visible-change="changeBorders" @change="changeVal">
          <el-option
            v-for="item in invalidList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-row>
      <el-row class="aform-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button @click="hadSubmit">提 交</el-button>
      </el-row>
    </el-dialog>
</template>
<script>
export default {
    data(){
        return{
            invalidValue:"",
            showDialog:false
        }
    },
    props:{
        bdcolor2:{
            type:Boolean,
            default:false
        },
        invalidList:{
            type:Array,
            default:[]
        },
        setTitle:{
            type:String,
            default:""
        }
    },
    methods:{
        closeDialog(){
            this.invalidValue="";
            this.showDialog=false;
            this.$emit('resetOrder')
        },
        hadSubmit(){
            this.invalidValue="";
            this.showDialog=false;
            this.$emit('submitOrder')
        },
        changeVal(val){
            this.$emit('changeInvalid',val)
        },
        changeBorders(val){
            this.$emit('changeBorder',val)
        }
    }
}
</script>
<style>

</style>
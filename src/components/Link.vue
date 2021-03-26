<template>
    <div class='link-container' v-show="isLinking">
        <div class="link-content">
            <span>链接中...</span>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
name:'',
    data () {
        return {
        };
    },
    computed:{
        ...mapState(['isLinking'])
    },
}

</script>
<style lang='scss' scoped>
.link-container{
    position:fixed;
    width: 600px;
    height:300px;
    left:50%;
    margin-left: -200px;
    top:50%;
    margin-top: -150px;
    background:rgb(17, 127, 190);
    z-index: 10000;
    .link-content{
        height:100%;
        display: flex;
        align-items: center;
        justify-content:center;
        color: #fff;
        font-size: 24px;
    }
}
</style>
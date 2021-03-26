<template>
  <div class="page">
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="prev, pager, next"
      :pager-count="5"
      small
      :hide-on-single-page="value"
      :total="total">
    </el-pagination>
  </div>  
</template>

<script>
  export default {
    name: 'page',
    props: ['currentPage', 'pageSize', 'total'],
    data() {
      return {
        value:true
      }
    },
    created() {},
    methods: {
      // page
      handleCurrentChange(newPage) {
        // console.log('当前页:', newPage)
        this.$emit('changePage',newPage)
      }
    }
  }
</script>


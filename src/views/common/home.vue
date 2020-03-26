<template>
  <div class="mod-home">
    <!-- <h3>报名表统计</h3>
    <el-table
      :data="stuRegData"
      stripe
      style="width: 100%">
      <el-table-column
        type="index"
        width="50"/>
      <el-table-column
        prop="schoolName"
        label="校区名称"/>
      <el-table-column
        prop="createDate"
        label="日期"
        :formatter="formateCreateDate"/>
      <el-table-column
        prop="allCount"
        label="总数"/>
      <el-table-column
        prop="count1"
        label="作废数"/>
      <el-table-column
        prop="count2"
        label="待审数"/>
      <el-table-column
        prop="count3"
        label="通过数"/>
    </el-table>

    <h3>课次统计</h3>
    <el-table
      :data="cplanContData"
      stripe
      style="width: 100%">
      <el-table-column
        type="index"
        width="50"/>
      <el-table-column
        prop="schoolName"
        label="校区名称"/>
      <el-table-column
        prop="cplanOpenDate"
        label="日期"
        :formatter="formateCplanOpenDate"/>
      <el-table-column
        prop="allCount"
        label="总数"/>
    </el-table> -->
  </div>
</template>


<script>
  import { cplanContCount, stuRegCount } from '@/api/homeApi'
  export default {
    data () {
      return {
        cplanContData: [],
        cplanContDataListLoading: false,
        stuRegData: [],
        cplanStuRegListLoading: false
      }
    },
    activated () {
      // // 加载课次统计
      // this.getCplanContCountList()
      // // 加载报名表统计
      // this.getStuRegCountList()
    },
    methods: {
      getCplanContCountList: function () {
        this.cplanContDataListLoading = true
        cplanContCount().then(res => {
          if (res.data && res.data.code === 0) {
            this.cplanContData = res.data.data
          } else {
            this.cplanContData = []
          }
          this.cplanContDataListLoading = false
        })
      },
      getStuRegCountList: function () {
        this.cplanStuRegListLoading = true
        stuRegCount().then(res => {
          if (res.data && res.data.code === 0) {
            this.stuRegData = res.data.data
          } else {
            this.stuRegData = []
          }
          this.cplanStuRegListLoading = false
        })
      },
      formateCreateDate: function (row, column) {
        return row.createDate != null ? row.createDate.substring(0, 10) : ''
      },
      formateCplanOpenDate: function (row, column) {
        return row.cplanOpenDate != null ? row.cplanOpenDate.substring(0, 10) : ''
      }
    }
  }
</script>

<style>
  .mod-home {
    line-height: 1.5;
  }
</style>


<template>
  <el-dialog title="学员列表" :close-on-click-modal="false" :visible.sync="visible">
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column type="index"  align="center" header-align="center" width="80" label="NO">
      </el-table-column>
      <el-table-column prop="stuName" header-align="center" align="center" label="姓名">
      </el-table-column>
      <el-table-column prop="stuPhone" header-align="center" align="center" label="手机">
      </el-table-column>
      <el-table-column prop="classTypeName" header-align="center" align="center" label="报名班型">
      </el-table-column>
      <el-table-column prop="regNo" header-align="center" align="center" label="报名表号">
      </el-table-column>
    </el-table>

  </el-dialog>
</template>

<script>
  import { classGetStuInfo } from '@/api/class'

  export default {
    data () {
      return {
        visible: false,
        dataList: [],
        selectId: '',
        dataListLoading: true
      }
    },
    methods: {
      init (id) {
        this.visible = true
        this.selectId = id
        if (this.selectId) {
          classGetStuInfo(this.selectId).then(res => {
            if (res.data && res.data.code === 0) {
              this.dataList = res.data.stuRegEntitise
            } else {
              this.$message.error(res.data.msg)
            }
            this.dataListLoading = false
          }).catch(err => {
            console.log(err)
          })
        }
      }
    }
  }
</script>

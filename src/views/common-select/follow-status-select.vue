<template>
  <el-select v-loading="dataListLoading" v-model="currentValue" :clearable="temp_clearable" placeholder="跟进状态" @change="selectChange">
    <el-option v-for="item in dataList" :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>


  export default {
    props: {
      value: {
        type: [Number, String]
      },// 接受外部v-model传入的值
      clearable: {
        type: [Boolean]
      }// 接受外部v-model传入的值
    },
    mounted () {
    //   this.getDataList()
    },
    computed: {
      currentValue: {
        get: function () {
          return this.value // 将props中的value赋值给currentValue
        },
        set: function (val) {
          this.$emit('input', val) // 通过$emit触发父组件
        }
      }
    },
    data () {
      return {
        temp_clearable: this.clearable || false,
        dataListLoading: false,
        dataList: null,
        temp_value: this.value,
        dataList: [
          { value: 0, label: '作废' },
          { value: 1, label: '待处理' },
          { value: 2, label: '已完成' }
        ],
        // value: ''
      }
    },
    methods: {
      selectChange (val) {
        // console.log(val)
        // this.$emit('orderStatus',val)
      },
      getDataList () {
        this.dataList = this.dataList1
      }  
    }

  }
</script>

<template>
  <el-select v-loading="dataListLoading" v-model="currentValue" :clearable="temp_clearable" placeholder="客户类型" @change="selectChange">
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
      },// 接受外部v-model传入的值s
      clearable: {
        type: [Boolean]
      }// 接受外部v-model传入的值
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
        dataList: [
          {value: 0, label: '个人用户'},
          {value: 1, label: '企业用户'},
        ],
        // value: ''
      }
    },
    methods: {
      selectChange (val) {
      }  
    }

  }
</script>

<template>
  <el-select v-loading="dataListLoading" v-model="currentValue" :clearable="temp_clearable" placeholder="退费类型" @change="selectChange">
    <el-option v-for="item in dataList" :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>

  import { resourceList } from '@/api/sys'

  export default {
    props: {
      value: {
        type: [Number, String]
      },// 接受外部v-model传入的值s
      clearable: {
        type: [Boolean]
      }// 接受外部v-model传入的值
    },
    // mounted () {
    //   this.getDataList()
    // },
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
          {value: 1, label: '退费退学'},
          {value: 2, label: '退费不退学'},
        ],
        // value: ''
      }
    },
    methods: {
      selectChange (val) {
        // console.log(val)
        // this.$emit('changePayType',val)
      }  
    }

  }
</script>

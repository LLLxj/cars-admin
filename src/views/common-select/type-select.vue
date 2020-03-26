<template>
  <el-select v-loading="dataListLoading" v-model="value" style="border:0px solid red!important" :clearable="temp_clearable" placeholder="编码类型" @change="selectChange">
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
      // value: {
      //   type: [Number, String]
      // },// 接受外部v-model传入的值
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
          {value: 0, label: '字符串'},
          {value: 1, label: '整形'},
          {value: 2, label: '浮点型'},
          {value: 3, label: '布尔'},
          {value: 4, label: 'json对象'}
        ],
        value: ''
      }
    },
    methods: {
      selectChange (val) {
        // console.log(val)
        // this.$emit('changePayment',val)
      }  
    }

  }
</script>

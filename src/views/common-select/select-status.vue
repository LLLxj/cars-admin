<template>
  <el-select v-loading="dataListLoading" v-model="temp_value" filterable placeholder="请选择状态" @change="getCity">
    <el-option
      v-for="item in dataList"
      :key="item.val"
      :label="item.title"
      :value="item.val">
    </el-option>
  </el-select>
</template>

<script>
  import Areas from '@/api/area'
  import Bus from '@/utils/bus'
  export default {
    props: {
      value: {
        // 接受外部v-model传入的值
        type: [Number, String]
      },
    },
    mounted () {
    },
    computed: {
      temp_value: {
        get: function () {
          return this.value
        },
        set: function (val) {
          this.$emit('input', val) // 通过$emit触发父组件
        }
      },
    },
    watch: {
    },
    data () {
      return {
        temp_clearable: this.clearable || false,
        noDesign: this.disabled || false,
        dataListLoading: false,
        dataList: [
          { title: '正常', val: 1 },
          { title: '禁用', val: 0 }
        ],
      }
    }, 
    methods: {
      init () {
      },
      getCity(val) {
        // this.$emit('get-city-val', val) // 通过$emit触发父组件
      }
    }
  }
</script>

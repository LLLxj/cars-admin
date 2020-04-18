<template>
  <el-select v-loading="dataListLoading" v-model="temp_value" filterable :clearable="clearable" :disabled="disabled" placeholder="请选择市区" @change="getCountry">
    <el-option
      v-for="item in dataList"
      :key="item.areaId"
      :label="item.areaName"
      :value="item.areaId">
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
      clearable: {
        type: [Boolean],
        default: true
      },
      disabled: {
        type: [Boolean],
      },
      showAll:{
        type: [Boolean],
        default: false
      }
    },
    mounted () {
      this.getDataList()
    },
    computed: {
      temp_value: {
        get: function () {
          return this.value // 将props中的value赋值给currentValue
        },
        set: function (val) {
          this.$emit('get-country-val', val) // 通过$emit触发父组件
        }
      }
    },
    data () {
      return {
        dataListLoading: false,
        dataList: null,
      }
    },
    methods: {
      init () {
        this.getDataList()
      },
      update(data) {
        this.getDataList(data)
      },
      // 获取数据列表
      getDataList (data) {
        this.dataListLoading = true
        Areas.couList(data).then(res => {
          if(res.data && res.data.code === 0){
            this.dataList = res.data.data
          }else{
            this.dataList = []
          }
            
          this.dataListLoading = false
        })
      },
      getCountry(val) {
        // this.$emit('get-country-val', val) // 通过$emit触发父组件
      }
    }
  }
</script>

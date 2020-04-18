<template>
  <el-select v-loading="dataListLoading" v-model="temp_value" filterable :clearable="temp_clearable" placeholder="请选择市区" @change="getCity">
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
        type: [Boolean]
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
          return this.value
        },
        set: function (val) {
          this.$emit('get-city-val', val) // 通过$emit触发父组件
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
        dataList: null,
      }
    },
    methods: {
      init () {
        this.getDataList()
        
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        Areas.cityList(19).then(res => {
          if(res.data && res.data.code === 0){
            this.dataList = res.data.data
          }else{
            this.dataList = []
          }
            
          this.dataListLoading = false
        })
      },
      getCity(val) {
        // this.$emit('get-city-val', val) // 通过$emit触发父组件
      }
    }
  }
</script>

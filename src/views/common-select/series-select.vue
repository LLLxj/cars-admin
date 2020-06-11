<template>
  <el-select v-loading="dataListLoading" v-model="temp_value" filterable :clearable="temp_clearable" placeholder="请选择系列" @change="getCity">
    <el-option
      v-for="item in dataList"
      :key="item.couBrandId"
      :label="item.couBrandName"
      :value="item.couBrandId">
    </el-option>
  </el-select>
</template>

<script>
  import Series from '@/api/brand/series'
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
          this.$emit('input', val)
          // this.$emit('get-brand-val', val) // 通过$emit触发父组件
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
        Series.listAll().then(res => {
            console.log(res.data.data)
            this.dataListLoading = false
          if(res.data && res.data.code === 0){
            this.dataList = res.data.data
            this.dataListLoading = false
          }else{
            this.dataList = []
          } 
        })
      },
      getCity(val) {
        // this.$emit('get-city-val', val) // 通过$emit触发父组件
      }
    }
  }
</script>

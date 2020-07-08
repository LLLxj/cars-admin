<template>
  <el-select v-loading="dataListLoading" value-key="couWaresId" v-model="temp_value" filterable :clearable="temp_clearable" :disabled="disabled" placeholder="请选择商品" @change="sentProInfo">
    <el-option
      v-for="item in dataList"
      :key="item.couWaresId"
      :label="item.couWaresName"
      :value="item">
    </el-option>
  </el-select>
</template>

<script>
  import Products from '@/api/customer/product'
  import Bus from '@/utils/bus'
  export default {
    props: {
      value: {
        // 接受外部v-model传入的值
        type: [Number, String, Object]
      },
      clearable: {
        type: [Boolean],
        default: true
      },
      disabled: {
        type: [Boolean]
      },
      couSeriesId: {
        type: [Number, String]
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
          this.$emit('input', val)
          // this.$emit('get-brand-val', val) // 通过$emit触发父组件
        }
      },
    },
    watch: {
      couSeriesId(val) {
        if (val) {
          this.getDataList()
        }
      }
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
        // this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        Products.getProductList(this.couSeriesId).then(res => {
          this.dataListLoading = false
          if(res.data && res.data.code === 0){
            this.dataList = res.data.data
            this.dataListLoading = false
          }else{
            this.dataList = []
          } 
        })
      },
      sentProInfo(val) {
        this.$emit('sent-pro-info', val) // 通过$emit触发父组件
      }
    }
  }
</script>

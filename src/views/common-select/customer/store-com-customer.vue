<template>
  <el-select v-loading="dataListLoading" v-model="temp_value" filterable :clearable="temp_clearable" placeholder="请选择客户" @change="getCity">
    <el-option
      v-for="item in dataList"
      :key="item.dealStoreId"
      :label="item.dealUserName"
      :value="item.dealStoreId">
    </el-option>
  </el-select>
</template>

<script>
  import Customer from '@/api/customer/customer'
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
        Customer.comList().then(res => {
          if(res.data && res.data.code === 0){
            this.dataList = res.data.data
          }else{
            this.dataList = []
          }
            
          this.dataListLoading = false
        })
      },
      getCity(val) {
        let obj = {}
        this.dataList.forEach(item => {
          if (item.dealStoreId === val) {
            obj = item
          }
        });
        this.$emit('get-val', obj)
        // this.$emit('get-city-val', val) // 通过$emit触发父组件
      }
    }
  }
</script>

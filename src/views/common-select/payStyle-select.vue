<template>
  <el-select v-loading="dataListLoading" v-model="currentValue" :clearable="temp_clearable" placeholder="支付方式" @change="selectChange">
    <el-option v-for="item in dataList" :key="item.payTypeId"
      :label="item.payTypeName"
      :value="item.payTypeId">
    </el-option>
  </el-select>
</template>

<script>

  import { getPayType } from '@/api/payment'

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
      this.getDataList()
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
        payTypeName: '',
        temp_clearable: this.clearable || false,
        dataListLoading: false,
        dataList: null,
        temp_value: this.value,
        // dataList: [
        //     {value: 1, label: '百度付款'},
        //     {value: 2, label: '客栈付款'},
        //     {value: 3, label: '支付宝'},
        //     {value: 4, label: 'POS机'},
        //     {value: 5, label: '对公付款'},
        //     {value: 6, label: '现金'}
        // ],
        // value: ''
      }
    },
    methods: {
      init () {
        this.getDataList()
      },
      getDataList () {
        this.dataListLoading = true
        getPayType().then(res => {
          if(res.data && res.data.code === 0){
            this.dataList = res.data.stuRegPayTypeEntities
          }else{
            this.dataList = []
          }
            
          this.dataListLoading = false
        })
      },
      selectChange (val) {
        // console.log(val)
        this.dataList.forEach(item => {
          if(item.payTypeId == val){
            this.payTypeName = item.payTypeName
          }
        });
        this.$emit('changePayment',this.payTypeName)
      }  
    }

  }
</script>

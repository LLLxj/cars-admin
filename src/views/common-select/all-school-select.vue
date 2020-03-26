<template>
  <el-select v-loading="dataListLoading" v-model="currentValue" :clearable="temp_clearable" placeholder="选择校区" @change="selectChange">
    <el-option v-for="item in dataList" :key="item.schoolId"
      :label="item.schoolName"
      :value="item.schoolId">
    </el-option>
  </el-select>
</template>

<script>

  import { allSchoolList } from '@/api/sys'

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
        schoolName: '',
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
        allSchoolList().then(res => {
          if(res.data && res.data.code === 0){
            // console.log(res)
            this.dataList = res.data.data.list
          }else{
            this.dataList = []
          }
            
          this.dataListLoading = false
        })
      },
      selectChange (val) {
        // console.log(val)
        this.dataList.forEach(item => {
          if(item.schoolId == val){
            this.schoolName = item.schoolName
          }
        });
        this.$emit('changeAllSchool',this.schoolName)
      }  
    }

  }
</script>

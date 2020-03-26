<template>
  <el-select v-loading="dataListLoading" v-model="currentValue" :clearable="temp_clearable" placeholder="请选择班型" @change="selectChange">
    <el-option v-for="item in dataList" :key="item.classTypeId"
      :label="item.classTypeName"
      :value="item.classTypeId">
    </el-option>
  </el-select>
</template>

<script>

  import ClassType from '@/api/classType'

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
        classTypeName: '',
        classTypePrice: '',
        temp_clearable: this.clearable || false,
        dataListLoading: false,
        dataList: null,
        temp_value: this.value,
        pageIndex: 1,
        pageSize: 10,
      }
    },
    methods: {
      selectChange (val) {
        this.dataList.forEach(item => {
          if(item.classTypeId == val){
            this.classTypeName = item.classTypeName
            this.classTypePrice = item.classTypePrice
          }
        });
        // console.log(val)
        this.$emit('changeAllClassType',this.classTypeName,this.classTypePrice)
      },
      getDataList () {
        this.dataListLoading = true
        ClassType.allList().then(res => {
          if(res.data && res.data.code === 0){
            this.dataList = res.data.data
          }else{
            this.dataList = []
            this.totalPage = 0
          }
        })
        this.dataListLoading = false
      }  
    }

  }
</script>

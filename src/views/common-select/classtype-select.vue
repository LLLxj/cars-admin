<template>
  <el-select v-loading="dataListLoading" v-model="currentValue" :clearable="temp_clearable" placeholder="请选择班型" style="width:180px;padding:0 15px" @change="selectChange">
    <el-option v-for="item in dataList" :key="item.classTypeId"
      :label="item.classTypeName"
      :value="item.classTypeId">
    </el-option>
  </el-select>
</template>

<script>

  import { resourceList } from '@/api/sys'
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
        // console.log(val)
        this.$emit('changeClassType',val)
      },
      getDataList () {
        this.dataListLoading = true
        ClassType.list(this.pageIndex,this.pageSize).then(res => {
          if(res.data && res.data.code === 0){
            this.dataList = res.data.data.list
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

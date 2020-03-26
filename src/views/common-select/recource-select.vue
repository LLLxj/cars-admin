<template>
  <el-select v-loading="dataListLoading" v-model="currentValue" :clearable="temp_clearable" :disabled="resourceEdit" placeholder="请选择来源" @change="selectChange">
    <el-option
      v-for="item in dataList"
      :key="item.channeId"
      :label="item.channeName"
      :value="item.channeId">
    </el-option>
  </el-select>
</template>

<script>

  import { resourceList } from '@/api/sys'

  export default {
    props: {
      value: {
        type: [Number, String]
      },// 接受外部v-model传入的值
      clearable: {
        type: [Boolean]
      },// 接受外部v-model传入的值
      disabled: {
        type: [Boolean]
      }
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
      },
      resourceEdit: {
        get: function () {
          return this.disabled
        },
        set: function (val) {
          // console.log(val)
          this.$emit('input', val) // 通过$emit触发父组件
        }
      }
    },
    data () {
      return {
        resourceName: '',
        temp_clearable: this.clearable || false,
        dataListLoading: false,
        dataList: null,
        temp_value: this.value,
        edit: this.disabled || false,
      }
    },
    // watch: {
    //   temp_value (val, oldVal) {
    //     // if (val !== oldVal) {
    //     this.$emit('input', this.temp_value)
    //     // }
    //   }
    // },
    methods: {
      init () {
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        // console.log('this.value:' + this.value + 'temp_value:' + this.temp_value)
        this.dataListLoading = true
        resourceList().then(res => {
          if(res.data && res.data.code === 0){
            this.dataList = res.data.data
          }else{
            this.dataList = []
          }
            
          this.dataListLoading = false
        })
      },
      // 选中值发生变化时触发
      selectChange (val) {
        // console.log(val)
        this.dataList.forEach(item => {
          if(item.channeId == val){
            this.channeName = item.channeName
          }
        });
        this.$emit('changeResource',val,this.channeName)
      }
    }
  }
</script>

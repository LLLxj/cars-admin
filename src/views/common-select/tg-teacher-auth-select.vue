<template>
  <el-select v-loading="dataListLoading" v-model="currentValue" filterable :clearable="temp_clearable" placeholder="请选择电邀老师">
    <el-option
      v-for="item in dataList"
      :key="item.userId"
      :label="item.username"
      :value="item.userId">
    </el-option>
  </el-select>
</template>

<script>
  import { tgTeacherAuthList } from '@/api/sys'
  export default {
    props: {
      value: {
        // 接受外部v-model传入的值
        type: [Number, String]
      },
      clearable: {
        type: [Boolean]
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
      // this.currentValue = this.currentValue || (this.showAll ? '' : getUserSchoolId())
      this.getDataList()
    },
    computed: {
      currentValue: {
        get: function () {
          return this.value
        },
        set: function (val) {
          this.$emit('input', val) // 通过$emit触发父组件
        }
      },
      schoolEdit: {
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
        temp_clearable: this.clearable || false,
        noDesign: this.disabled || false,
        dataListLoading: false,
        dataList: null,
        temp_value: this.value
      }
    },
    methods: {
      init () {
        this.getDataList()
        // this.schoolEdit()
        
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        tgTeacherAuthList(1,100).then(res => {
          if(res.data && res.data.code === 0){
            // console.log(res)
            this.dataList = res.data.data.list
          }else{
            this.dataList = []
          }
            
          this.dataListLoading = false
        })
      },
      // initDataList (_data) {
      //   var first = []
      //   if(this.showAll){
      //     first[0]={'schoolId':'','schoolName':'全部'}
      //   }
      //   if(!_data){
      //     _data=[]
      //   }
      //   this.dataList= first.concat(_data)
      // }
    }
  }
</script>

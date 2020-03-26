<template>
  <el-select v-loading="dataListLoading" v-model="currentValue" :clearable="temp_clearable" :disabled="schoolEdit" placeholder="请选择校区">
    <el-option
      v-for="item in dataList"
      :key="item.schoolId"
      :label="item.schoolName"
      :value="item.schoolId">
    </el-option>
  </el-select>
</template>

<script>
  import { getUserSchoolId } from '@/utils/userInfoUtil'
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
      this.currentValue = this.currentValue || (this.showAll ? '' : getUserSchoolId())
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
        // console.log('this.value:' + this.value + 'temp_value:' + this.temp_value)
        // console.log("${this.$cookie.get('user-school-id')}:{}",this.$cookie.get('user-school-id'))
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/cos/school/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': 1,
            'limit': 100,
            'schoolName': ''
            // 'schoolName': this.dataForm.schoolName
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            // this.dataList = data.data.list
            this.initDataList(data.data.list)
            // this.totalPage = data.data.totalCount
          } else {
            // this.dataList = []
            this.initDataList([])
            // this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      initDataList (_data) {
        var first = []
        if(this.showAll){
          first[0]={'schoolId':'','schoolName':'全部'}
        }
        if(!_data){
          _data=[]
        }
        this.dataList= first.concat(_data)
      },
    }
  }
</script>

<template>
  <el-select v-loading="dataListLoading" v-model="currentValue" :disabled="editable" :clearable="temp_clearable" placeholder="请选择学历"  @change="selectChange">
    <el-option v-for="item in dataList" :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>

  import ClassType from '@/api/classType'
  import { dictList } from '@/api/dict'

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
      },
      editable: {
        get: function () {
          return this.disabled // 将props中的value赋值给currentValue
        },
        set: function (val) {
          this.$emit('input', val) // 通过$emit触发父组件
        }
      },

    },
    data () {
      return {
        code: 'EDU_TYPE',
        eduName: '',
        temp_clearable: this.clearable || false,
        // edit: this.disabled,
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
          if(item.value == val){
            this.eduName = item.label
          }
        });
        this.$emit('changeEduName',this.eduName)
      },
      getDataList () {
        this.dataListLoading = true
        dictList(1,100,this.code).then(res => {
            if (res.data && res.data.code === 0) {
              this.dataList = res.data.data.list
            } else {
              this.dataList = []
            }
          })
        this.dataListLoading = false
      }  
    }

  }
</script>

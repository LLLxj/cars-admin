<template>
  <el-select v-loading="dataListLoading" v-model="value" @change="selectChange" :clearable="temp_clearable" placeholder="请选择校区">
    <el-option
      v-for="item in dataList"
      :key="item.schoolId"
      :label="item.schoolName"
      :value="item.schoolId">
    </el-option>
  </el-select>
</template>

<script>

  import { schoolList } from '@/api/schoolFiles'

  export default {
    props: ['value', 'clearable'],
    data () {
      return {
        temp_clearable: this.clearable || false,
        dataListLoading: false,
        dataList: null,
        page:1,
        limit:10,
        schoolName: undefined,
        data:[],
      }
    },
    watch: {
      tempValue (val) {
        this.$emit('update:value', val)
      }
    },
    computed: {
      tempValue(){
        return this.value
      }
    },
    activated () {
      // debugger
      this.getDataList()
    },
    methods: {
      init () {
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        schoolList(this.page,this.limit,this.schoolName).then(res => {
            // 下拉有全部选项
            // if(res.data && res.data.code === 0){
            //     const data = res.data.data.list
            //     this.data[0] = {"schoolId":0,"schoolName":"全部"} 
            //     for(var i in data){
            //         this.data.push(data[i])
            //     }
            // }else{
            //     this.data = []
            // }
            if(res.data && res.data.code === 0){
                this.dataList = res.data.data.list
            }else{
                this.dataList = []
            }
            this.dataListLoading = false
        }).catch(err => {
            console.log(err)
        })
      },
      // 选中值发生变化时触发
      selectChange (item) {
        // console.log(ite)
        // this.$tempValue(item)
      }
    }
  }
</script>

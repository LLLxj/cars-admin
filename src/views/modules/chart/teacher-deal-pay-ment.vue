<template>
  <div id="J_payment_echarts_teacher" class="chart-box"></div>
</template>

<script>
  import { paymentDay, paymentWeek, paymentMonth } from '@/api/teacherLog'
  export default {
    props: {
      value: {   // 1.日报 2.周报 3.月报 // 接受外部v-model传入的值
        type: [Number, String],
        default: 1
      },
      tname: {   // 1.日报 2.周报 3.月报 // 接受外部v-model传入的值
        type: [String],
        default: '回款额'
      }
    },
    data () {
      return {
        echartsLine: null,
        // 成交额
        dayData: null,
        // 周
        weekData: null,
        // 月
        monthData: null,
        // 加载数据量
        loadNum: 15,
        valueName: '日',
        // 标题
        title: this.tname,
        // 副标题
        subtext: '最近' + this.loadNum + this.valueName + '数据',
        showData: null,
        loadApi: null
      }
    },
    watch: {
      value (newV, oldV) {
        this.initData()
      }
    },
    mounted () {
      // 初始化
      this.init()
    },
    methods: {
      // 初始化
      init () {
        // 初始化echarts  样式:walden
        this.echartsLine = echarts.init(document.getElementById('J_payment_echarts_teacher'), 'walden')
        // 加载数据
        this.initData()
      },
      // 初始化数据
      initData () {
        // loading状态
        this.echartsLine.showLoading()
        this.initParams()
        if (this.showData === null) {
          this.loadDataFun()
        } else {
          this.show(this.showData)
        }
      },
      // 初始化参数
      initParams () {
        switch (parseInt(this.value)) {
          case 1:
            this.loadApi = paymentDay
            this.showData = this.dayData
            this.valueName = '日'
            break
          case 2:
            this.loadApi = paymentWeek
            this.showData = this.weekData
            this.valueName = '周'
            break
          case 3:
            this.loadApi = paymentMonth
            this.showData = this.monthData
            this.valueName = '月'
            break
          default:
            this.loadApi = paymentDay
            this.showData = this.monthData
            this.valueName = '日'
            break
        }
        // 副标题
        this.subtext = '最近' + this.loadNum + this.valueName + '数据'
      },
      // 请求服务端获取数据
      loadDataFun () {
        const _this = this
        _this.showData = {}
        // 从服务端请求数据
        this.loadApi(15).then(res => {
          if (res.data && res.data.code === 0) {
            // 线条名称数组
            _this.showData.legendData = res.data.data.lineName || []
            // x轴日期数组
            _this.showData.xAxisData = res.data.data.x || []
            _this.showData.series = []
            // 转换Y轴数据格式
            if (res.data.data.x) {
              for (let i = 0; i < res.data.data.ylist.length; i++) {
                let yData = res.data.data.ylist[i]
                // let yItem = {name: yData.name, type: 'line', stack: '总量', data: yData.ys}
                let yItem = this.formatEchartsSeries(yData)
                _this.showData.series.push(yItem)
              }
              _this.show(this.showData)
            }
            this.initLoadData()
          }
        }).catch(e => {
          console.log(e)
          _this.echartsLine.hideLoading()
        })
      },
      // 展示
      show (data) {
        this.echartsLine.setOption({
          title: {
            text: this.title || '报表',
            subtext: this.subtext,
            show: true,
            feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          calculable: true,
          tooltip: { 'trigger': 'axis' },
          'legend': {
            'data': data.legendData
          },
          grid: {
            'left': '3%',
            'right': '7%',
            'bottom': '3%',
            'containLabel': true
          },
          toolbox: {
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              dataView: {readOnly: false},
              magicType: {type: ['line', 'bar']},
              restore: {},
              saveAsImage: {}
            }
          },
          'xAxis': {
            'type': 'category',
            'boundaryGap': false,
            'data': data.xAxisData
          },
          'yAxis': {
            'type': 'value'
          },
          'series': data.series
        })
        this.echartsLine.hideLoading()
      },
      // 缓存数据
      initLoadData () {
        switch (parseInt(this.value)) {
          case 1:
            this.dayData = this.showData
            break
          case 2:
            this.weekData = this.showData
            break
          case 3:
            this.monthData = this.showData
            break
          default:
            break
        }
      },
      // echarts数据和样式
      formatEchartsSeries (yData) {
        return {
          name: yData.name,
          type: 'line',
          stack: '总量',
          data: yData.ys,
          markPoint: {data: [{type: 'max', name: '最大值'}, {type: 'min', name: '最小值'}]},
          markLine: {
            data: [
              {type: 'average', name: '最大值'},
              [
                {symbol: 'none', x: '90%', yAxis: 'max'},
                {symbol: 'circle', label: {normal: {position: 'start', formatter: '最大值'}}, type: 'max', name: '最高点'}
              ]
            ]
          }
        }
      }
    }
  }
</script>

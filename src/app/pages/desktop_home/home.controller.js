/**
 * Created by Administrator on 2016/10/10.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .controller('DesktopHomeController', DesktopHomeController);

    /** @ngInject */
    function DesktopHomeController() {
        var vm = this;
        vm.option = {
          title: {
            text: 'ECharts 入门示例'
          },
          tooltip: {},
          legend: {
            data:['销量']
          },
          xAxis: {
            data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
          },
          yAxis: {},
          series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }]
        };
        vm.option2 = {
        tooltip: {
          trigger: 'axis'
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {}
          }
        },
        xAxis:  {
          type: 'category',
          name: "日期",
          boundaryGap: true,
          axisLine: {
            lineStyle: {
              color: '#666'
            }
          },
          data: ['10-14','10-15','10-16','10-17','10-18','10-19','今日']
        },
        yAxis: {
          type: 'value',
          name:"订单金额(￥)",
          axisLabel : {
            formatter: '{value}'
          },
          splitLine: {
            lineStyle: {
              color: '#ccc',
              type: "dashed"
            }
          },
          axisLine: {
            lineStyle: {
              color: '#666'
            }
          }
        },
        series: [
          {
            name: '当日成交',
            type: 'line',
            data: [10100, 12156, 7948, 14100, 11170, 12900, 12150],
            itemStyle : {
              normal : {
                color:'#fe771d',
                borderWidth: 8,
                borderColor: "#ffaf7a",
                borderType: "solid"
              },
              emphasis: {
                color:'#fe771d',
                borderColor: "#fe771d"
              }
            },
            lineStyle:{
              normal : {
                color:'#fe771d',
                borderWidth: 3
              }
            },
            label : {
              normal: {
                show : true,
                formatter : '{c}',
                position : 'bottom',
                textStyle : {
                  fontWeight : '100',
                  fontSize : '14',
                  color:'#fe771d'
                }
              }
            }
          }
        ]
      }
    }
})();

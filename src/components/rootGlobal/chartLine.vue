<template>
<!-- 不进行引用，直接在本地文件中进行相应的自己创建当应的文件 -->
<!-- 折线图的图形 dom结构内容 -->
	<section class="chart-container">
		<el-dialog title="折线图" :width="dialogWidth" :visible.sync="dialogVisible" @open="show()" size="large">
            <div class="chartLine"></div>
		</el-dialog>
	</section>
</template>

<script>
/* 逻辑交互js内容 */
import echarts from 'echarts';
import Event from '../../public_js/event.js';
export default {
	data() {
		return {
			dialogVisible: false, //控制弹窗的显示隐藏
            chartLine: null,
            chartData: null,
            dialogWidth: '',
		}
    },
    methods: {
        chartLineShow(arrData) {
            console.log(arrData);
            var _this = this;
            var series = [];
            for(var i=0; i<arrData.legend.length; i++) {
                series.push({
                    name: arrData.legend[i],
                    type: 'line',
                    // stack: '总量', 这个设置总量的累加效果
                    smooth: true,  //这句就是让曲线变平滑的 
                    data: (arrData.series[i])
                });
            }
            _this.chartLine.setOption({
                title: {
                    text: arrData.name
                },
                tooltip: {
                    trigger: 'axis',
                    formatter:function(params) {    
                        var relVal = params[0].name;    
                        for(var i = 0, l = params.length; i < l; i++) {    
                            relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value+arrData.unit;    
                        }    
                        return relVal;    
                    }   
                },
                legend: {
                    data: arrData.legend
                },
                grid: { //设置canvas的位置
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    top: 40,
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: arrData.xAxis,
                    splitArea : {
                        show: true,
                        areaStyle:{
                            color:['rgba(144,238,144,0.3)','rgba(135,200,250,0.3)']
                        }
                    },
                },
                yAxis: {
                    type: 'value',
                    axisLabel : {
                        show: true,
                        interval: 'auto',    // {number}
                        rotate: -20,
                        margin: 10,
                        formatter: '{value}'+arrData.unit,
                        textStyle: {
                            color: '#1e90ff',
                            fontFamily: 'sans-serif',
                            fontSize: 12,
                            fontStyle: 'italic',
                            fontWeight: 'bold'
                        }
                    },
                },
                series: series
            });
        },
        show() {
            var _this = this;
            _this.$nextTick(function() {
                // document.getElementsByClassName('chartLine')[0].innerHTML = '';
                _this.chartLine = echarts.init(document.getElementsByClassName('chartLine')[0]);
                _this.chartLineShow(_this.chartData);
            }); 
        },
    },
	mounted() {
        var _this = this;
        //基于准备好的dom，初始化echarts实例
        _this.$nextTick(function(){
            Event.$on('show-chart-line', function(obj){
                _this.dialogVisible = true;
                _this.chartData = obj.data;
                _this.dialogWidth = lookWidth*0.8+'px'; //设置进行dialog的宽度进行设置为屏幕的80%
                console.log(_this.chartData)
            });
        })
	},
};
</script>

<style scoped>
/* 这个样式规则限制使得它们应用于<style scoped>元素的父<div>元素及其内部的所有元素上。我们称之为“范围” */
.chart-container .chartLine{
    width: 100%; height: 600px;
}
.chart-container .chartLine .chartLineDiv{
    width: 100%; height: 600px !important;    
}
</style>

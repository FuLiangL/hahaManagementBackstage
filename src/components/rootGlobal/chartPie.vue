<template>
<!-- 在别的地方不进行引用使用，只是作为模板进行展示，单独的功能的模块展示 -->
<!-- 折线图的图形 dom结构内容 -->
	<section class="chart-container">
		<el-dialog title="饼状图" :width="dialogWidth" :visible.sync="dialogVisible" @open="show()" size="large">
            <div class="chartPie"></div>
            <p style="color: red; font-size: 20px; font-family: '微软雅黑';">总量数值为：{{total_num}}</p>
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
            chartPie: null,
            chartData: null,
            dialogWidth: '',
            total_num: '11111',
		}
    },
    methods: {
        chartPieShow(arrData) {
            var _this = this;
            var series = [];
            _this.chartPie.setOption({
                title: {
                    text: arrData.title,
                    subtext: arrData.sub_title,
                    x: 'left',
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)",
                },
                legend: {
                    orient: 'vertical',
                    left: 'right',
                    data: arrData.name,
                },
                series: [{
                        name: arrData.content,
                        type: 'pie',
                        radius: '70%',
                        center: ['50%', '60%'],
                        data: arrData.data,
                        itemStyle: {
                            normal:{
                                label:{
                                    show: true,
                                    formatter: '{b} : {c} \n ({d}%)',
                                },
                                labelLine:{
                                    show: true,
                                }
                            },
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            },
                        },
                    }]
            });
        },
        show() {
            var _this = this;
            _this.$nextTick(function() {
                _this.chartPie = echarts.init(document.getElementsByClassName('chartPie')[0]);
                _this.chartPieShow(_this.chartData);
            }); 
        },
    },
	mounted() {
        var _this = this;
        //基于准备好的dom，初始化echarts实例
        _this.$nextTick(function(){
            Event.$on('show-chart-pie', function(obj){
                _this.dialogVisible = true;
                _this.chartData = obj.data;
                _this.total_num = obj.data.total;
                _this.dialogWidth = lookWidth*0.8+'px'; //设置进行dialog的宽度进行设置为屏幕的80%
            });
        })
	},
};
</script>

<style scoped>
/* 这个样式规则限制使得它们应用于<style scoped>元素的父<div>元素及其内部的所有元素上。我们称之为“范围” */
.chart-container .chartPie{
    width: 100%; height: 600px;
}
.chart-container .chartPie .chartPieDiv{
    width: 100%; height: 600px !important;    
}
</style>

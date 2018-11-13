<template>
    <!-- 实时在线 -->
    <section>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" style="overflow: hidden;">
                <el-form-item>
                    <div class="block">
                        <span class="demonstration">默认日期</span>
                        <el-date-picker
                        v-model="formOne.params.oneDate"
                        type="date"
                        placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item>
                    <div class="block">
                        <span class="demonstration">对比日期</span>
                        <el-date-picker
                        v-model="formOne.params.twoDate"
                        type="date"
                        placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item class="search-span" style="float:right;">
                    <el-button 
                    type="primary" 
                    @click="getData">进行对比</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <template>
            <el-col 
            :style="{height:searchHeight+'px'}"
            class="chartLineOne"></el-col>
        </template>
    </section>
</template>

<script>
import echarts from 'echarts';
import store from "../../../vuex/store";
import axios from 'axios';
export default {
    data() {
        return {
            searchHeight: null,
            formOne: {
                params: {
                    oneDate: new Date()-1*24*60*60*1000,
                    twoDate: new Date()-2*24*60*60*1000,
                },
                chartOne: {
                    chartLine: null,
                    chartData: null,
                    dialogWidth: '',
                    dataX: [],
                    dataYOne: [],
                    dataYTwo: [],
                },
            },
        };
    },
    methods: {
        /*
            1、getData：获取到全部的数据
            2、showOne：展示对应的设置echart内容
        */ 
        getData() {
            var _this = this;
            let url = baseConfig.server+baseConfig.requestUrl+"/Base/getOnlineDataNew";
            let params = {
                date_list: baseConfig.changeDateTime(_this.formOne.params.oneDate, 0)+','+baseConfig.changeDateTime(_this.formOne.params.twoDate, 0),
            };
            axios.get(url, { params: params })
            .then((res) => {
                if(res.data.ret) {
                    _this.formOne.chartOne.dataYOne = [];
                    _this.formOne.chartOne.dataYTwo = [];
                    res.data.data.forEach((arr, indexI) => {
                        arr.forEach((item, indexII) => {
                            // 第一遍的时候（前面默认）
                            if(item.time.indexOf(baseConfig.changeDateTime(_this.formOne.params.oneDate, 0))!=-1) {
                                _this.formOne.chartOne.dataX.forEach((itemX, indexIII) => {
                                    if(itemX==item.time.substring(11, 16)) {
                                        _this.formOne.chartOne.dataYOne[indexIII] = item.online_num;
                                    }
                                })
                            } 
                            // 第二遍的时候（后面对比）
                            else if(item.time.indexOf(baseConfig.changeDateTime(_this.formOne.params.twoDate, 0))!=-1) {
                                _this.formOne.chartOne.dataX.forEach((itemX, indexIII) => {
                                    if(itemX==item.time.substring(11, 16)) {
                                        _this.formOne.chartOne.dataYTwo[indexIII] = item.online_num;
                                    }
                                })
                            }
                        }); 
                    });
                    _this.showOne();
                } else {
                    baseConfig.errorTipMsg(_this, res.data.msg);
                }
            })
            .catch((err) => {
                console.log(err);
            })
        },
        showOne() {
            var _this = this;
            _this.$nextTick(function() {
                _this.formOne.chartOne.chartLine = echarts.init(document.querySelector('.chartLineOne'));
				_this.formOne.chartOne.chartLine.setOption({
					title:{},
					grid:{
						bottom: 70  
					},
					toolbox:{
						show:true,  
						right:160,  
						feature:{  
							magicType: {  
									type: ['line', 'bar']  
							},  
							saveAsImage:{},  
							dataView:{},  
							restore: {},  
						}  
					},
					tooltip:{
						trigger: 'axis'  
					},
					dataZoom: [
						{  
							type:'slider',  
							show: true,  
							realtime: true,  
							start: 0,  
							end: 100  
						},  
						{  
							type: 'inside',  
							show: true,  
							realtime: true,  
							start: 0,  
							end: 100  
						}  
					],
					legend:{
						data:[
                            baseConfig.changeDateTime(_this.formOne.params.oneDate, 0),
                            baseConfig.changeDateTime(_this.formOne.params.twoDate, 0)
                        ],  
						itemGap:30,  
						itemWidth:70,  
						itemHeight:12,  
					}, 
					xAxis:{
						data: _this.formOne.chartOne.dataX,  
					},
					yAxis:[
						{
							name: '在线人数',  
							nameTextStyle:{  
								color:'#666666',  
								fontWeight:'bolder',  
								fontSize:14  
							},  
							axisLabel:{  
								color:'#333333',  
								fontSize:14  
							}  
						},
					],
					series:[
						{  
							name: baseConfig.changeDateTime(_this.formOne.params.oneDate, 0),  
							type: 'line',  
							data: _this.formOne.chartOne.dataYOne,  
							yAxisIndex: 0,  
							smooth: true,  //这句就是让曲线变平滑的 
							symbol:'circle',  
							symbolSize:9,  
							//拐点标志样式  
							itemStyle: {  
								normal: {  
									color:'#FF5100',    
									lineStyle:{color:'#FF5100',width:'3'},  
									areaStyle:{type:'default'}  
								}  
							},  
							//渐变橙白  
							areaStyle:{  
								normal: {   
									color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{   
										offset: 0,   
										color: 'rgba(255,213,193,0.3)'   
									}, {   
										offset: 0.8,   
										color: 'rgba(255,255,255,0.2)'   
									}])   
								}  
							}  
                        },
                        {  
							name: baseConfig.changeDateTime(_this.formOne.params.twoDate, 0),  
							type: 'line',  
							data: _this.formOne.chartOne.dataYTwo,  
							yAxisIndex: 0,  
							smooth: true,  //这句就是让曲线变平滑的 
							symbol:'circle',  
							symbolSize:9,  
							//拐点标志样式  
							itemStyle: {  
								normal: {  
									color:'#6ad172',    
									lineStyle:{color:'#6ad172',width:'3'},  
									areaStyle:{type:'default'}  
								}  
							},  
							//渐变橙白  
							areaStyle:{  
								normal: {   
									color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{   
										offset: 0,   
										color: 'rgba(255,213,193,0.3)'   
									}, {   
										offset: 0.8,   
										color: 'rgba(255,255,255,0.2)'   
									}])   
								}  
							}  
						},
					]
				});
            });
        },
    },
    mounted() {
        var _this = this;
		_this.$nextTick(function() {
            _this.searchHeight = baseConfig.lineNumber(searchHeight);
            _this.getData();
            // 得到从00:00->23:59的字段
            var arrX = [];
            var arrY = [];
            for(var i=0; i<24; i++) {
                for(var j=0; j<60; j++) {
                    arrX.push((i<10 ? '0'+i : i)+':'+(j<10 ? '0'+j : j));
                    arrY.push(0);
                }
            }
            _this.formOne.chartOne.dataX = arrX;
            _this.formOne.chartOne.dataYOne = arrY;
            _this.formOne.chartOne.dataYTwo = arrY;
		})
    }
};
</script>

<style lang="css" scoped>
.chartLineOne{
    width: 100%;
}
</style>

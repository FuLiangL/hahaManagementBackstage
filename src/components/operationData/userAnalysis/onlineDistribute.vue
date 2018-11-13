<template>
	<!-- 在线时长分布 -->
	<!-- dom结构内容 -->
	<section>
		<!-- 工具条/头部的搜索条件搜索 -->
        <span class="registerTime"></span>
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" style="overflow: hidden;" :model="formOne">
				<el-form-item>
					<div class="block">
						<span class="registerTime">日期</span>
						<el-date-picker v-model="formOne.choiceDate" type="daterange" range-separator=" 至 " placeholder="选择日期范围"></el-date-picker>
					</div>
				</el-form-item>
                <el-form-item>
                    <span>渠道</span>
                    <el-select v-model="channelId" multiple filterable collapse-tags style="margin-left: 20px;" placeholder="请选择">
                        <el-option v-for="(item, key) of channelData" :key="item" :label="item" :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="margin-left: 100px;">
					<el-button type="primary" @click="chartLineShow">折线图</el-button>
					<el-button type="primary" @click="getTableData">查询</el-button>
				</el-form-item>
                <el-form-item style="margin-left: 100px;">
                    <div class="infomation"  @click="infoDialogVisible=true;">
                        <i class="el-icon-question" style="color: #999;"></i>
                    </div>
				</el-form-item>
			</el-form>
		</el-col>
        <div style="font-size: 30px;">接口待定</div>
		<!--用户的数据展示列表-->
		<template>
			<el-table ref="tableHeight" :data="tabData" border fit highlight-current-row v-loading="listLoading" style="width: 100%;" :height="tableHeight">
				<el-table-column prop="every_day" label="日期" width="90" sortable ></el-table-column>
				<el-table-column prop="second_1_3" label="1-3秒" min-width="60"></el-table-column>
				<el-table-column prop="second_4_10" label="4-10秒" min-width="60"></el-table-column>
				<el-table-column prop="second_11_30" label="11-30秒" min-width="60"></el-table-column>
				<el-table-column prop="second_31_59" label="31-59秒" min-width="60"></el-table-column>
				<el-table-column prop="min_1_3" label="1-3分钟" min-width="60"></el-table-column>
				<el-table-column prop="min_3_10" label="3-10分钟" min-width="60"></el-table-column>
				<el-table-column prop="min_10_30" label="10-30分钟" min-width="60"></el-table-column>
				<el-table-column prop="min_30_60" label="30-60分钟" min-width="60"></el-table-column>
				<el-table-column prop="hour_1_2" label="1-2小时" min-width="60"></el-table-column>
				<el-table-column prop="hour_2_5" label="2-5小时" min-width="60"></el-table-column>
				<el-table-column prop="hour_5_10" label="5-10小时" min-width="60"></el-table-column>
				<el-table-column prop="hour_10" label="10小时以上" min-width="60"></el-table-column>
			</el-table>
			<!-- 折线图 -->
			<el-dialog title="折线图" :width="dialogWidth"  :visible.sync="dialogVisible" @open="show">
                <div class="chartLine"  style="width: 100%;height: 600px;"></div>
            </el-dialog>
            <!-- 问题信息 -->
            <el-dialog title="字段说明" :width="dialogWidth"  :visible.sync="infoDialogVisible" >
                <p>日在线时长分布：打开应用，且使用时间大于0秒即开始计算使用时长；应用被主动关闭、或进入后台超过30秒认为使用结束。(单个用户多次使用的，时间累计，用户数去重)。</p>
                <p>单次在线时长分布：打开应用，且使用时间大于0秒即开始计算使用时长；应用被主动关闭、或进入后台超过30秒认为使用结束。(单个用户多次使用的，按时长分别统计，用户数不去重)。</p>
            </el-dialog>
		</template>
	</section>
</template>

<script>
/* 逻辑交互js内容 */
import Event from './../../../public_js/event.js';
import { allget } from '../../../api/api';
import store from '../../../vuex/store';
import axios from 'axios';
import echarts from 'echarts';
export default {
	data() {
		return {
			tableHeight: null, // table展示的页面的高度多少
			// 搜索条件的组装字段
			formOne: {
				choiceDate: [new Date()-7*24*60*60*1000, new Date()], // 对应选择的日期,给默认时间180之前到现在
			},
			listLoading: false, //动画加载时显示的动画
			tabData: [], 
			formLabelWidth: '120px', // 设置dialog弹框的宽度
            dialogVisible: false,
            infoDialogVisible: false,
            dialogWidth: null,
            channelData: {},
            channelId: null,
            chartLine: null,
            chartLineData: {
                title: {
                        text: '付费用户数据'
                    },
                tooltip : {
                    trigger: 'axis'
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                legend: {
                    data:['付费ARPPU值','活跃ARPU值','日付费率','累计付费率']
                },
                xAxis: [
                    {
                        type: 'category',
                        data: []
                    }
                ],
                yAxis: [
                    {
                        type : 'value',
                        name : 'ARPU',
                        axisLabel : {
                            formatter: '{value} '
                        }
                    },
                    {
                        type : 'value',
                        name : '付费率',
                        axisLabel : {
                            formatter: '{value} %'
                        }
                    },
                ],
                series: [
                    {
                        name:'付费ARPPU值',
                        type:'bar',
                        data:[]
                    },
                    {
                        name:'活跃ARPU值',
                        type:'bar',
                        data:[]
                    },
                    {
                        name:'日付费率',
                        type:'line',
                        yAxisIndex: 1,
                        data:[]
                    },
                    {
                        name:'累计付费率',
                        type:'line',
                        yAxisIndex: 1,
                        data:[]
                    }
                ]
            }
		};
	},
	methods: {
		// 搜索条件
		searchCondition() {
			var _this = this;
			var obj = {};
            obj.date_s = baseConfig.changeDateTime(_this.formOne.choiceDate[0], 0);
            obj.date_e = baseConfig.changeDateTime(_this.formOne.choiceDate[1], 0);
            obj.channel = this.channelId.join(',')
            // obj.date_s = "2018-03-19";
            // obj.date_e = "2018-03-19";
			return obj;
		},
		// 获取数据列表
		getTableData() {
			var _this = this ;
			_this.listLoading = true;
			var url = '/Base/onlineDistribute';
			var params = _this.searchCondition();
			// 如果得到的搜索为null，表示存在搜索条件为空，不进行数据请求
			if(params==null) {
				// 不进行数据请求,直接关闭掉加载的图层
				_this.listLoading = false;
			} else {
				// 进行get请求，(请求参数params, 请求地址url)
			// 	allget(params, url).then(res => {
			// 		// 数据请求成功
            //         _this.listLoading = false;
			// 		if(res.data.ret) {
            //             _this.tabData = res.data.data;
            //             // 根据获取数据，动态赋值折线图所需的数据
            //             // 赋值前先清空
            //             _this.chartLineData.xAxis[0].data = [];
            //             _this.chartLineData.series[0].data = [];
            //             _this.chartLineData.series[1].data = [];
            //             _this.chartLineData.series[2].data = [];
            //             _this.chartLineData.series[3].data = [];
            //             for(var i = res.data.data.length-1; i >= 0; i--){
            //                 _this.chartLineData.xAxis[0].data.push(_this.tabData[i].time); // 横坐标
            //                 _this.chartLineData.series[0].data.push(_this.tabData[i].consume_ARPPU); // 付费ARPPU值赋值
            //                 _this.chartLineData.series[1].data.push(_this.tabData[i].active_ARPPU); // 活跃ARPU值
            //                 _this.chartLineData.series[2].data.push(_this.tabData[i].consume_rate); // 日付费率
            //                 _this.chartLineData.series[3].data.push(_this.tabData[i].cumulative_consume_rate); // 累计付费率
            //             }
			// 		} else {
			// 			// 返回ret==0，非正常数据
			// 			baseConfig.errorTipMsg(_this, res.data.msg);
			// 		}
			// 	}).catch(function(error){
			// 		console.log(error);
			// 	})
			}
        },
        show() {
            this.$nextTick(function() {
                this.chartLine = echarts.init(document.querySelector('.chartLine'));
                document.querySelector('.chartLine').style.border = "1px solid #4488BB";
                this.chartLine.setOption(this.chartLineData);
            })
        },
        chartLineShow() {
            this.dialogVisible = true;
        }
	},
	mounted() {
		var _this = this;
		this.$nextTick(function() {
			_this.tableHeight = baseConfig.lineNumber(searchPageHeight);
			_this.getTableData();
        })
        _this.dialogWidth = lookWidth*0.8+'px'; //设置进行dialog的宽度进行设置为屏幕的80%
        var id = store.state.user.channelid.split(",");
        for(var i = 0; i<id.length; i++){
            this.channelData[id[i]] = store.state.user.channelname.split(",")[i];
        }
	}
};
</script>

<style lang="css" scoped>
   .infomation{
       width: 100%;
       height: 100%;
   }
</style>

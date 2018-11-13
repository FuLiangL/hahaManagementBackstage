<template>
	<!-- 财务日报 -->
	<section>
		<el-col :span="24" class="toolbar" style="padding-bottom:0px;">
			<el-form :inline="true" style="overflow: hidden;" :model="formOne">
				<el-form-item>
					<div class="block">
						<span class="registerTime">日期</span>
						<el-date-picker v-model="formOne.choiceDate" type="daterange" range-separator=" 至 " placeholder="选择日期范围"></el-date-picker>
					</div>
				</el-form-item>
                <el-form-item>
					<span>展示类型</span>
					<el-select style="width: 150px;" v-model="searchType">
						<el-option label="按日查询" value="1"></el-option>
						<el-option label="按月查询" value="2"></el-option>
					</el-select>
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
			</el-form>
		</el-col>
		<!--用户的数据展示列表-->
		<template>
			<el-table ref="tableHeight" :data="onePageTabData" border fit highlight-current-row v-loading="listLoading" style="width: 100%;" :height="tableHeight">
				<el-table-column prop="day" label="日期/月份" width="90" sortable ></el-table-column>
				<el-table-column prop="total" label="充值总额" min-width="60"></el-table-column>
				<el-table-column prop="chat_gold" label="聊币充值金额" min-width="60"></el-table-column>
				<el-table-column prop="vip" label="VIP充值金额" min-width="60"></el-table-column>
				<el-table-column prop="family" label="创建家族费用" min-width="60"></el-table-column>
				<el-table-column prop="enchashment" label="提现金额" min-width="60"></el-table-column>
			</el-table>
			<!-- 折线图 -->
			<el-dialog title="折线图" :width="dialogWidth"  :visible.sync="dialogVisible" @open="show">
                <div class="chartLine"  style="width: 100%;height: 600px;"></div>
            </el-dialog>
            <!--翻页-->
			<el-col :span="24" class="toolbar">
				<el-pagination layout="total,prev,pager,next,jumper" @current-change="handleCurrentChange" :page-size="20" :total="totalpage" style="float:right;"></el-pagination>
			</el-col>
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
				choiceDate: [new Date()-15*24*60*60*1000, new Date()], // 对应选择的日期,给默认时间180之前到现在
            },
            searchType: "1",
			listLoading: false, //动画加载时显示的动画
			tabData: [], //测试模拟数据（可删除）
			formLabelWidth: '120px', // 设置dialog弹框的宽度
            dialogVisible: false,
            dialogWidth: null,
            page: 1,
            totalpage: null,
            star: '0',
            end: '20',
            channelData: {},
            channelId: null,
            chartLine: null,
            chartLineData: {
                title: {
                        text: '财务日报'
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
                    data:['充值']
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
                        name : '充值',
                        axisLabel : {
                            formatter: '{value} 元'
                        }
                    }
                ],
                series: [
                    {
                        name:'充值总额',
						smooth: true,
                        type:'line',
                        data:[]
                    }
                ]
            },
		};
    },
    computed: {
        onePageTabData() {
			var _this = this;
			return _this.tabData.slice(_this.star, _this.end);
		},
    },
	methods: {
        handleCurrentChange(val) {
			var _this = this;
			_this.page = val;
			_this.star = (_this.page-1)*20;
			_this.end = _this.star+20;
		},
		// 搜索条件
		searchCondition() {
			var _this = this;
			var obj = {};
            obj.date_s = baseConfig.changeDateTime(_this.formOne.choiceDate[0], 0);
            obj.date_e = baseConfig.changeDateTime(_this.formOne.choiceDate[1], 0);
            obj.channel = this.channelId.join(',');
            obj.date_type = this.searchType;
			return obj;
		},
		// 获取数据列表
		getTableData() {
			var _this = this ;
			_this.listLoading = true;
			var url = '/NewMoney/getFinancialDaily';
			var params = _this.searchCondition();
			// 如果得到的搜索为null，表示存在搜索条件为空，不进行数据请求
			if(params==null) {
				// 不进行数据请求,直接关闭掉加载的图层
				_this.listLoading = false;
			} else {
				// 进行get请求，(请求参数params, 请求地址url)
				allget(params, url).then(res => {
					// 数据请求成功
                    _this.listLoading = false;
					if(res.data.ret) {
                        res.data.total.day = "总计";
                        res.data.data.unshift(res.data.total);
                        // 清除小数点
                        for(var i = 0; i < res.data.data.length; i++) {
                            res.data.data[i].total = (+res.data.data[i].total).toFixed(0);
                            res.data.data[i].chat_gold = (+res.data.data[i].chat_gold).toFixed(0);
                            res.data.data[i].vip = (+res.data.data[i].vip).toFixed(0);
                            res.data.data[i].family = (+res.data.data[i].family).toFixed(0);
                            res.data.data[i].enchashment = (+res.data.data[i].enchashment).toFixed(0);
                        }
                         _this.tabData = res.data.data;
                        _this.totalpage = res.data.data.length;
                        // 根据获取数据，动态赋值折线图所需的数据
                        // 赋值前先清空
                        _this.chartLineData.xAxis[0].data = [];
                        _this.chartLineData.series[0].data = [];
                        for(var i = res.data.data.length-1; i > 0; i--){
                            _this.chartLineData.xAxis[0].data.push(_this.tabData[i].day.slice(5,10)); // 横坐标
                            _this.chartLineData.series[0].data.push(_this.tabData[i].total); // 充值总额
                        }
					} else {
						// 返回ret==0，非正常数据
						baseConfig.errorTipMsg(_this, res.data.msg);
					}
				}).catch(function(error){
					console.log(error);
				})
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

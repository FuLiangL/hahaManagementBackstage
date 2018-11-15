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
                    <span>uid/昵称：</span>
                    <el-input style="width:120px;" placeholder="请输入uid" v-model="uid" clearable>
                    </el-input>
               </el-form-item>
                <el-form-item>
                    <span>渠道</span>
                    <el-select v-model="channelId" style="margin-left: 20px;" placeholder="全部">
                    	<el-option v-for="item in channelData" :key="item.id" :label="item.annotation" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <span>状态</span>
                    <el-select v-model="statusId" style="margin-left: 20px;" placeholder="全部">
                    	<el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <span>充值类型</span>
                    <el-select v-model="rechargeId" style="margin-left: 20px;" placeholder="全部">
                    	<el-option v-for="item in recharge" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
			<el-table 
			ref="tableHeight" 
			:data="tabData" 
			border fit highlight-current-row 
			v-loading="listLoading" 
			style="width: 100%;" 
			:height="tableHeight">
				<el-table-column prop="create_time" label="时间" min-width="90"></el-table-column>
				<el-table-column prop="uid" label="用户id" min-width="60"></el-table-column>
				<el-table-column prop="nickname" label="用户昵称" min-width="60"></el-table-column>
				<el-table-column 
				prop="total_fee" 
				label="金额（元）" 
				:formatter="judgeTotalFee" 
				min-width="60"></el-table-column>
				<el-table-column prop="channel" label="渠道" min-width="60"></el-table-column>
				<el-table-column prop="version_name" label="版本" min-width="60"></el-table-column>
				<el-table-column prop="pay_times" label="充值次数" min-width="60"></el-table-column>
				<el-table-column 
				prop="pay_num" 
				label="累计金额（元）" 
				:formatter="judgePayNum" 
				min-width="60"></el-table-column>
				<el-table-column 
				prop="order_pay_type" 
				label="充值方式" 
				:formatter="judgeOrderPayType"
				min-width="90"></el-table-column>
				<el-table-column prop="age" label="年龄" min-width="40"></el-table-column>
				<el-table-column 
				prop="sex" 
				label="性别" 
				:formatter="judgeSex"
				min-width="40"></el-table-column>
				<el-table-column prop="addtime" label="注册时间" min-width="90"></el-table-column>
				<el-table-column prop="order_pay_id" label="订单号" min-width="90"></el-table-column>
				<el-table-column 
				prop="status" 
				label="状态" 
				:formatter="judgeStatus"
				:filters="[{text:'待支付',value:'1'},{text:'支付异常',value:'2'},{text:'支付成功',value:'3'}]"
				:filter-method="filterStatus"
				min-width="60"></el-table-column>
				<el-table-column 
				prop="recharge_type" 
				label="充值类型" 
				:filters="[{text:'豆币',value:'0'},{text:'会员',value:'1'},{text:'家族创建',value:'2'},{text:'代理',value:'4'},{text:'活动',value:'5'}]"
				:filter-method="filterRechargeType"
				:formatter="judgeRechargeType"
				min-width="60"></el-table-column>
			</el-table>
			<el-dialog 
			title="折线图" 
			:width="dialogWidth"  
			:visible.sync="dialogVisible" 
			@open="show">
                <div class="chartLine" style="width:100%;height:600px;"></div>
            </el-dialog>
            <el-col :span="24" class="toolbar">
				<el-pagination 
				layout="total,prev,pager,next,jumper" 
				:total="totalpage" 
				:page-size="20" 
				@current-change="handleCurrentChange" 
				style="float: right;"></el-pagination>
            </el-col>
		</template>
	</section>
</template>

<script>
import Event from './../../../public_js/event.js';
import { allget } from '../../../api/api';
import store from '../../../vuex/store';
import axios from 'axios';
import echarts from 'echarts';
export default {
	data() {
		return {
			tableHeight: null,
			formOne: {
				choiceDate: [new Date()-15*24*60*60*1000, new Date()],
            },
            searchType: "1",
			listLoading: false,
			tabData: [],
			formLabelWidth: '120px',
            dialogVisible: false,
            dialogWidth: null,
            page: 0,
            totalpage: 1000,
            star: '0',
            end: '20',
            channelData: [],
            recharge:[
				{ value: '0', label: '豆币充值', }, 
				{ value: '1', label: '会员充值', }, 
				{ value: '2', label: '家族充值', },
			],
            status:[
				{ value: '1', label: '待支付', }, 
				{ value: '2', label: '支付异常', }, 
				{ value: '3', label: '支付成功', },
			], 
            uid: null,
            channelId: null,
            statusId: '',
            rechargeId: null,
            chartLine: null,
            chartLineData: {
                title: {
					text: '财务日报',
				},
                tooltip : {
                    trigger: 'axis',
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : { show: true },
                        dataView : { show: true, readOnly: false },
                        magicType: {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                legend: {
                    data:['充值'],
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
	methods: {
		judgeSex(row, column) {
			// 1(男)2(女)
			return row.sex==1?"男":row.sex==2?"女":"--";
		},
		judgeTotalFee(row, column) {
			//进行金额的单位转换，返回为分转换为元
			return (row.total_fee/100).toFixed(2);
		},
		judgePayNum(row, column) {
			// 进行金额的单位转换，返回为分转换为元
			return (row.pay_num/100).toFixed(2);
		},
		judgeStatus(row, column) {
			// 1(待支付)2(支付异常)3(支付成功)
			return row.status==1?"待支付":row.status==2?"支付异常":row.status==3?"支付成功":"--";
		},
		judgeOrderPayType(row, column) {
			// 0(豆币充值)1(会员充值)2(家族充值)6(真正支付宝支付)7(真正微信支付)9(公众号充值)
			let aa = row.order_pay_type; 
			return aa==0?"豆币充值":aa==1?"会员充值":aa==2?"家族充值":aa==6?"真正支付宝支付":aa==7?"真正微信支付":aa==9?"公众号充值":"--";
		},
		judgeRechargeType(row, column) {
			// 0(豆币)1(会员)2(家族创建)3(车载充值豆币)4(代理)5(活动)
			let aa = row.recharge_type;
			return aa==0?"豆币":aa==1?"会员":aa==2?"家族创建":aa==3?"车载充值豆币":aa==4?"代理":aa==5?"活动":"--";
		},
		filterRechargeType(value, row) {
			return row.recharge_type === value;
		},
		filterStatus(value, row) {
			return row.status === value;
		},
        handleCurrentChange(val) {
			var _this = this;
			_this.page = val-1;
			_this.star = (_this.page)*20;
			_this.end = _this.star+20;
			_this.getTableData();
		},
		searchCondition() {
			var _this = this;
			var obj = {};
            obj.date_s = baseConfig.changeDateTime(_this.formOne.choiceDate[0], 0);
            obj.date_e = baseConfig.changeDateTime(_this.formOne.choiceDate[1], 0);
            obj.page=this.page;
            obj.channel=this.channelId;
            obj.status=this.statusId;
            obj.find=this.uid;
            obj.recharge_type=this.rechargeId;
			return obj;
		},
		getTableData() {
			var _this = this ;
			_this.listLoading = true;
			var url = '/NewMoney/getMoneyIn';
			var params = _this.searchCondition();
			if(params==null) {
				_this.listLoading = false;
			} else {
				allget(params, url).then(res => {
					_this.listLoading = false;
					if(res.data.ret) {	
						_this.tabData = res.data.data;
						// 根据获取数据，动态赋值折线图所需的数据
						// 赋值前先清空
						_this.chartLineData.xAxis[0].data = [];
						_this.chartLineData.series[0].data = [];
						for(var i = res.data.data.length-1; i > 0; i--){
							_this.chartLineData.xAxis[0].data.push(_this.tabData[i].addtime.slice(5,10)); // 横坐标
							_this.chartLineData.series[0].data.push(_this.tabData[i].pay_num); // 充值总额
						}
					} else {
						baseConfig.warningTipMsg(_this, res.data.msg);
					}
				})
				.catch((err) => {
					console.log(err);
				});
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
		},
		getChannelData() {
			var url = '/GlobalSet/getChannel';
			var params = {};
				allget(params, url).then(res => {
					if(res.data.ret) {	
						this.channelData=res.data.data;
					} else {
						baseConfig.warningTipMsg(_this, res.data.msg);
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},
	},
	mounted() {
		var _this = this;
		this.$nextTick(function() {
			_this.tableHeight = baseConfig.lineNumber(searchPageHeight);
			_this.getChannelData();
			_this.getTableData();
        })
        _this.dialogWidth = lookWidth*0.8+'px';
	}
};
</script>

<style lang="css" scoped>
   .infomation{
       width: 100%;
       height: 100%;
   }
</style>

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
                <el-form-item style="margin-left: 100px;">
					<el-button type="primary" @click="chartLineShow">折线图</el-button>
					<el-button type="primary" @click="getTableData">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--用户的数据展示列表-->
		<template>
			<el-table ref="tableHeight" :data="tabData" border fit highlight-current-row v-loading="listLoading" style="width: 100%;" :height="tableHeight">
				<el-table-column prop="req_time" label="请求时间" min-width="90"></el-table-column>
				<el-table-column prop="uid" label="用户id" min-width="60"></el-table-column>
				<el-table-column prop="nickname" label="用户昵称" min-width="60"></el-table-column>
				<el-table-column 
				prop="num" 
				label="金额" 
				:formatter="judgeNum"
				min-width="60"></el-table-column>
				<el-table-column prop="pay_type" label="提现方式" min-width="60"></el-table-column>
				<el-table-column prop="pay_account" label="提现账号" min-width="60"></el-table-column>
				<el-table-column prop="name" label="提现账号的名字" min-width="80"></el-table-column>
				<el-table-column prop="order_id" label="订单id" min-width="90"></el-table-column>
				<el-table-column prop="operation_time" label="操作时间" min-width="90"></el-table-column>
				<el-table-column prop="operation_name" label="操作人" min-width="60"></el-table-column>
				<el-table-column prop="status" label="提现状态" min-width="60"></el-table-column>
				<el-table-column prop="refuse_reason" label="失败理由" min-width="60"></el-table-column>
			</el-table>
			<!-- 折线图 -->
			<el-dialog title="折线图" :width="dialogWidth"  :visible.sync="dialogVisible" @open="show">
                <div class="chartLine"  style="width: 100%;height: 600px;"></div>
            </el-dialog>
            <!--翻页-->
			<el-col :span="24" class="toolbar">
				<el-pagination 
				background 
				layout="total,prev,pager,next,jumper" 
				:total="1000" 
				:page-size="20" 
				@current-change="handleCurrentChange" 
				style="float: right;"></el-pagination>
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
			uid:null,
			tableHeight: null, 
			formOne: {
				choiceDate: [new Date()-15*24*60*60*1000, new Date()], 
            },
			listLoading: false, 
			tabData: [], //测试模拟数据（可删除）
			formLabelWidth: '120px',
            dialogVisible: false,
            dialogWidth: null,
            page: 0,
            totalpage: null,
            star: '0',
            end: '20',
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
	methods: {
		judgeNum(row, column) {
			return row.num/100;
		},
        handleCurrentChange(val) {
			var _this = this;
			_this.page = val-1;
			_this.star = (_this.page-1)*20;
			_this.end = _this.star+20;
			_this.getTableData()
		},
		searchCondition() {
			var _this = this;
			var obj = {};
            obj.date_s = baseConfig.changeDateTime(_this.formOne.choiceDate[0], 0);
            obj.date_e = baseConfig.changeDateTime(_this.formOne.choiceDate[1], 0);
			obj.page=_this.page;
			obj.find=_this.uid;
			return obj;
		},
		// 获取数据列表
		getTableData() {
			var _this = this ;
			_this.listLoading = true;
			var url = '/NewMoney/getMoneyOut';
			var params = _this.searchCondition();
			if(params==null) {
				_this.listLoading = false;
			} else {
				allget(params, url).then(res => {
                    _this.listLoading = false;
                    console.log(res)
					if(res.data.ret) {
                        _this.tabData = res.data.data;
                        for(var i=0;i<_this.tabData.length;i++){
							if(_this.tabData[i].pay_type==2){
								_this.tabData[i].pay_type="支付宝"
							}
							if(_this.tabData[i].pay_type==3){
								_this.tabData[i].pay_type="微信"
							}
							if(_this.tabData[i].status==0){
								_this.tabData[i].status="等待提现"
							}
							if(_this.tabData[i].status==1){
								_this.tabData[i].status="提现中"
							}
							if(_this.tabData[i].status==2){
								_this.tabData[i].status="提现失败"
							}
							if(_this.tabData[i].status==3){
								_this.tabData[i].status="提现成功"
							}
						}	
//                      // 根据获取数据，动态赋值折线图所需的数据
//                      // 赋值前先清空
                        _this.chartLineData.xAxis[0].data = [];
                        _this.chartLineData.series[0].data = [];
                        for(var i = res.data.data.length-1; i > 0; i--){
                            _this.chartLineData.xAxis[0].data.push(_this.tabData[i].req_time.slice(5,10)); // 横坐标
                            _this.chartLineData.series[0].data.push(_this.tabData[i].num); // 充值总额
                        }
					} 
                  	else {
						baseConfig.warningTipMsg(_this, res.data.msg);
					}
				})
				.catch((err) => {
					console.log(err);
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
//      var id = store.state.user.channelid.split(",");
//      for(var i = 0; i<id.length; i++){
//          this.channelData[id[i]] = store.state.user.channelname.split(",")[i];
//      }
	}
};
</script>

<style lang="css" scoped>
   .infomation{
       width: 100%;
       height: 100%;
   }
</style>

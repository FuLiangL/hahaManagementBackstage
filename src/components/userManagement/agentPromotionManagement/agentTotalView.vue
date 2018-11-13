<template>
    <!-- 推广数据总览 -->
    <!-- dom结构内容 -->
	<section>
        <!-- 工具条/头部的搜索条件搜索 -->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" style="overflow: hidden;">
				<el-form-item>
					<div class="block">
						<span class="registerTime">日期</span>
						<el-date-picker v-model="formOne.startDate" type="daterange" range-separator=" 至 " start-placeholder="开始日期" end-placeholder="结束日期">
						</el-date-picker>
					</div>
				</el-form-item>
                <el-form-item class="search-span" style="float:right;">
					<el-button id="searchBtn" type="primary" @click="getData(0)">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!-- 用户的数据展示列表 -->
		<template>
			<el-table :data="listData" border fit highlight-current-row style="width: 100%;" v-loading="listLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :height="tableHeight">
				<el-table-column prop="date" label="日期"></el-table-column>
				<el-table-column prop="normal_agent"  label="普通代理数量"></el-table-column>
				<el-table-column prop="agent_join_num" label="付费代理数量"></el-table-column>
				<el-table-column prop="spread_num" label="推广用户数"></el-table-column>
				<el-table-column prop="agent_join_money" label="代理加盟费"></el-table-column>
				<el-table-column prop="spread_money" label="推广用户充值"></el-table-column>
				<el-table-column prop="total_spread_money" label="合计充值"></el-table-column>
				<el-table-column prop="spread_cost" label="推广用户消费聊币数"></el-table-column>
				<el-table-column prop="cost_pay_back" label="消费返现聊票" sortable></el-table-column>
				<el-table-column prop="agent_pay_back" label="代理费返现聊票"></el-table-column>
				<el-table-column prop="total_pay_back" label="推广返现聊票"></el-table-column>
				<el-table-column prop="all_total_pay_back" label="合计返现聊票"></el-table-column>
			</el-table>
			<!-- 工具条 -->
			<el-col :span="24" class="toolbar">
				<el-pagination layout="total,prev, pager, next,jumper" @current-change="handleCurrentChange" :page-size="20" :total=1000 :current-page="page+1" style="float:right; ">
				</el-pagination>
			</el-col>
		</template>
    </section>
</template>

<script>
	import { allget } from '../../../api/api';
	import axios from 'axios';
    export default {
        data() {
            return {
				tableHeight: null, // table展示的页面的高度多少，第二页中对应高度
                formOne: {
                    startDate: [new Date()-1*24*60*60*1000, new Date()], // 对应选择的日期,给默认时间180之前到现在
				},
				page: 0,
				listData: [],
				totalpage:null,
				formLabelWidth: '120px',
				listLoading: false,
            }
        },
		methods: {
			//页面的页数
			handleCurrentChange(val) {
				this.page = val-1;
				this.getData();
			},
			// 获取数据
			getData(type) {
				var _this = this;
				_this.listLoading = true;
				if(type==0){
					_this.page = 0;
				}
				let url = '/Agent/getAgentTotalView';
				let param ={
					page: this.page,
					date_s: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
					date_e: baseConfig.changeDateTime(this.formOne.startDate[1], 0),
				}
				allget(param, url).then(res => {
					_this.listLoading = false;
					if(res.data.ret){
						this.listData = res.data.data;
					}else{
						baseConfig.warningTipMsg(_this, res.data.msg);
					}
				}).catch(err => {
					console.log(err)
				})
			},
		},
		mounted() {
			var _this = this;
			_this.tableHeight = baseConfig.lineNumber(searchPageHeight);
			_this.getData();
		},
    }

</script>

<style lang="css" scoped>
    .search-span{
        float: right;
    }
    #searchBtn{
        margin-right: 50px;
    }
</style>

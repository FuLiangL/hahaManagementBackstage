<template>
    <!-- 每日新增录音统计 -->
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
					<el-button id="searchBtn" type="primary" @click="getData()">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!-- 用户的数据展示列表 -->
		<template>
			<el-table :data="listData" border fit highlight-current-row v-loading="listLoading" style="width: 100%;" :height="tableHeight">
				<el-table-column prop="date" label="时间"></el-table-column>
				<el-table-column prop="click_people"  label="录播人数"></el-table-column>
				<el-table-column prop="new_people" label="成功发布录音人数" ></el-table-column>
				<el-table-column prop="new_num" label="新增录音数"></el-table-column>
				<el-table-column prop="new_money_num" label="新增付费录音数"></el-table-column>
				<el-table-column prop="new_free_num"  label="新增免费录音数"></el-table-column>
				<el-table-column prop="total_free_num" label="平台免费录音总数"></el-table-column>
				<el-table-column prop="total_money_num" label="平台付费录音总数"></el-table-column>
				<el-table-column prop="total_listen_money" label="听录音花费聊币"></el-table-column>
				<el-table-column prop="total_award_money" label="打赏录音聊币数"></el-table-column>
				
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
                    startDate: [new Date()-14*24*60*60*1000, new Date()], // 对应选择的日期,给默认时间180之前到现在
				},
				value6: '',
				value10: 'text',
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
				//服务器的第一页是0 所以 这里要 -1
				this.page = val-1;
				this.getData();
			},
			// 获取数据
			getData() {
				var _this = this;
				this.listLoading = true;
				let url = '/Voice/getVoiceDayData';
				let param ={
					date_s: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
					date_e: baseConfig.changeDateTime(this.formOne.startDate[1], 0),
				}
				allget(param, url).then(res => {
					_this.listLoading = false;
					if(res.data.ret){
						this.listData = res.data.data;
					}else{
						baseConfig.errorTipMsg(this, res.data.msg);
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
		}
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

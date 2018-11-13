<template>
    <!-- 主播每日数据汇总 -->
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
			<el-table :data="listData" border fit highlight-current-row v-loading="listLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"  style="width: 100%;"  :height="tableHeight">
				<el-table-column prop="date" label="日期"></el-table-column>
				<el-table-column prop="new_anchor"  label="新增主播数"></el-table-column>
				<el-table-column prop="total_anchor" label="累积主播数"></el-table-column>
				<el-table-column prop="active_anchor" label="积极主播数" ></el-table-column>
				<el-table-column prop="day_chat_ticket" label="主播累积聊票"></el-table-column>
				<el-table-column prop="day_money" label="主播累积收入(元)" sortable></el-table-column>
				<el-table-column prop="call_chat_ticket" label="付费通话聊票"></el-table-column>
				<el-table-column prop="gift_chat_ticket" label="礼物聊票"></el-table-column>
				<el-table-column prop="eavesdrop_chat_ticket" label="被偷听聊票"></el-table-column>
			</el-table>
			<!-- 工具条 -->
				<!-- <el-col :span="24" class="toolbar">
					<el-pagination layout="total,prev, pager, next,jumper" @current-change="handleCurrentChange" :page-size="20" :total=1000  style="float:right; ">
					</el-pagination>
				</el-col> -->
		</template>
    </section>
</template>

<script>
	import { allget } from '../../../api/api';
    export default {
        data() {
            return {
				tableHeight: null, // table展示的页面的高度多少，第二页中对应高度
                formOne: {
                    startDate: [new Date()-7*24*60*60*1000, new Date()], // 对应选择的日期,给默认时间180之前到现在
				},
				listData: [],
				formLabelWidth: '120px',
				listLoading: false,
				page: 0,
            }
        },
		methods: {
			handleCurrentChange(val) {
				this.page = val - 1;
				this.getData();
			},
			// 获取数据
			getData() {
				var _this = this;
				_this.listLoading = true;
				let url = '/Anchor/getAnchorDayTotalData';
				let param ={
					date_s: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
					date_e: baseConfig.changeDateTime(this.formOne.startDate[1], 0),
					page: this.page,
				}
				allget(param, url).then(res => {
					_this.listLoading = false;
					if(res.data.ret){
						this.listData = res.data.data;
					}else{
						baseConfig.warningTipMsg(_this,res.data.msg);
					}
				}).catch(err => {
					console.log(err)
				})
			},
		},
		mounted() {
			var _this = this;
			_this.tableHeight = baseConfig.lineNumber(searchHeight);
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

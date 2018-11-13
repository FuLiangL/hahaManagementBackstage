<template>
    <!-- 主播每日行为数据统计 -->
    <!-- dom结构内容 -->
	<section>
        <!-- 工具条/头部的搜索条件搜索 -->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" style="overflow: hidden;">
				<el-form-item>
					<div class="block">
						<span class="registerTime">日期</span>
						<el-date-picker v-model="formOne.startDate" type="date">
						</el-date-picker>
					</div>
				</el-form-item>
                <el-form-item>
					<span>uid</span>
					<el-input style="width:200px;" placeholder="请输入uid" v-model="uid" clearable>
                    </el-input>
				</el-form-item>
                <el-form-item>
					<span>操作人</span>
					<el-input style="width:200px;" placeholder="请输入操作人" v-model="operate_user" clearable>
                    </el-input>
				</el-form-item>
                <el-form-item class="search-span" style="float:right;">
					<el-button id="searchBtn" type="primary" @click="getData()">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!-- 用户的数据展示列表 -->
		<template>
			<el-table :data="listData" border fit highlight-current-row style="width: 100%;" v-loading="listLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :height="tableHeight">
				<el-table-column prop="date" label="日期"></el-table-column>
				<el-table-column prop="uid"  label="用户UID"></el-table-column>
				<el-table-column prop="nickname" label="昵称"></el-table-column>
				<el-table-column prop="lasttime" label="最后登录时间" ></el-table-column>
				<el-table-column prop="online_time" label="在线时长"></el-table-column>
				<el-table-column prop="accumulate_time" label="总通话时长" sortable></el-table-column>
				<el-table-column prop="rand_accumulate_time" label="随机通话时长"></el-table-column>
				<el-table-column prop="rand_call_num" label="随机通话次数"></el-table-column>
				<el-table-column prop="new_friend_num" label="新增好友数"></el-table-column>
				<el-table-column prop="total_chat_ticket" label="总聊票"></el-table-column>
				<el-table-column prop="total_call_chat_ticket" label="付费通话聊票"></el-table-column>
				<el-table-column prop="total_gift_chat_ticket" label="礼物聊票"></el-table-column>
				<el-table-column prop="total_eavesdrop_chat_ticket" label="被偷听聊票"></el-table-column>
				<el-table-column prop="operate_user" label="操作人"></el-table-column>
			</el-table>
			<!-- 工具条 -->
			<el-col :span="24" class="toolbar">
				<el-pagination layout="total,prev, pager, next,jumper" @current-change="handleCurrentChange" :page-size="20" :total=1000  style="float:right; ">
				</el-pagination>
			</el-col>
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
                    startDate: [new Date()], // 对应选择的日期,给默认时间180之前到现在
				},
				listData: [],
				formLabelWidth: '120px',
                listLoading: false,
                uid: null,
				operate_user: null,
				page: 0,
            }
        },
		methods: {
			//页面的页数
			handleCurrentChange(val) {
				this.page = val - 1;
				this.getData();
			},
			// 获取数据
			getData() {
				var _this = this;
				_this.listLoading = true;
				let url = '/Anchor/getDayAnchorActionData';
				let param ={
					date: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
                    uid: this.uid,
					operate_user: this.operate_user,
					page: this.page,
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

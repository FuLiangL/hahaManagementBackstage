<template>
	<!-- 注册答题明细 -->
	<!-- dom结构内容 -->
	<section>
		<!-- 工具条/头部的搜索条件搜索 -->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" style="overflow: hidden;" :model="formOne">
				<el-form-item>
					<div class="block">
						<span class="registerTime">日期</span>
						<el-date-picker v-model="formOne.choiceDate" type="daterange" range-separator=" 至 " placeholder="选择日期范围"></el-date-picker>
					</div>
				</el-form-item>
				<el-form-item>
                    <span>UID：</span>
					<el-input placeholder="UID" style="width: 120px;" clearable v-model="formOne.uid" auto-complete="off"></el-input>
				</el-form-item>
                <el-form-item style="float:right;">
					<el-button type="primary" @click="getTableData">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--用户的数据展示列表-->
		<template>
			<el-table ref="tableHeight" :data="tabData" border fit highlight-current-row v-loading="listLoading" style="width: 100%;" :height="tableHeight">
				<el-table-column prop="nickname" label="昵称" ></el-table-column>
				<el-table-column prop="uid" label="uid" ></el-table-column>
				<el-table-column prop="age" label="年龄" ></el-table-column>
				<el-table-column prop="hometown_pro" label="省份" ></el-table-column>
				<el-table-column prop="hometown_city" label="城市" ></el-table-column>
				<el-table-column prop="character" label="性格" ></el-table-column>
				<el-table-column prop="favourite_singer" label="喜欢的歌手" ></el-table-column>
				<el-table-column prop="favourite_movie" label="喜欢的电影" ></el-table-column>
				<el-table-column prop="favourite_books" label="喜欢的图书" ></el-table-column>
				<el-table-column prop="city_have_been" label="喜欢的城市" ></el-table-column>
				<el-table-column prop="favourite_animal" label="喜欢的宠物" ></el-table-column>
				<el-table-column prop="favourite_foods" label="喜欢的食物" ></el-table-column>
				<el-table-column prop="favourite_sports" label="喜欢的运动" ></el-table-column>
			</el-table>
			<!--工具条-->
			<el-col :span="24" class="toolbar">
				<el-pagination layout="total,prev,pager,next,jumper" @current-change="handleCurrentChange" :page-size="20" :total="totalpage" style="float:right;"></el-pagination>
			</el-col>
		</template>
	</section>
</template>

<script>
/* 逻辑交互js内容 */
import Event from './../../../public_js/event.js';
import { allget } from './../../../api/api';
import store from './../../../vuex/store';
import axios from 'axios';
export default {
	data() {
		return {
			tableHeight: null, // table展示的页面的高度多少
			// 搜索条件的组装字段
			formOne: {
				choiceDate: [new Date()-30*24*60*60*1000, new Date()], // 对应选择的日期,给默认时间180之前到现在
				uid: '',
			},
			listLoading: false, 
			tabData: [], 
			totalpage: 1000,  
			page: 0, 
			formLabelWidth: '130px', 
			constrast_uid: "", // 对比uid 每次请求完数据后,将uid存起来，用和下次请求数据做对比
		};
	},
	methods: {
		// 下方页数进行翻页的页码时
		handleCurrentChange(val) {
            this.page = val - 1;
            this.getTableData();
		},
		// 搜索条件
		searchCondition() {
			var _this = this;
			var obj = {};
			obj.uid = _this.formOne.uid;
			obj.date_s = baseConfig.changeDateTime(_this.formOne.choiceDate[0], 0);
			obj.date_e = baseConfig.changeDateTime(_this.formOne.choiceDate[1], 0);
			return obj; // return出组装好的搜索条件
		},
		
		// 获取数据列表
		getTableData() {
			var _this = this ;
			_this.listLoading = true;
			var url = '/NewUser/getUserAnswerRecord';
			var params = _this.searchCondition();
            if(params.uid == "" || params.uid == undefined){
                _this.listLoading = false;
                baseConfig.normalTipMsg(_this, "请填写uid！");
                return;
			}
			// 如果得到的搜索为null，表示存在搜索条件为空，不进行数据请求
			if(params==null) {
				// 不进行数据请求,直接关闭掉加载的图层
				_this.listLoading = false;
			} else {
				axios.get(baseConfig.server+baseConfig.requestUrl+url, { params: params })		
				.then(res => {
					// 数据请求成功
					_this.listLoading = false;
					if(res.data.ret) {
						// 判断数据是否为空 当其为数组时没有数据
						if(Array.isArray(res.data.data) == false){
							// 每次请求数据时若uid和上次相同时删除上一次数据添加上这次，若不同则直接push
							if(params.uid == _this.constrast_uid){
								var lastData = _this.tabData.slice(_this.tabData.length-1);
								_this.tabData.splice(_this.tabData.length-1,1);
								_this.tabData = _this.tabData.concat(lastData);
							}else{
								_this.tabData.push(res.data.data);
							}
						}else{
							baseConfig.normalTipMsg(_this,"该用户无相关数据!");
						}
						_this.constrast_uid = params.uid;
					} else {
						// 返回ret==0，非正常数据
						baseConfig.errorTipMsg(_this, res.data.msg);
					}
				}).catch(function(error){
					console.log(error);
				})
			}
		},
	},
	mounted() {
		var _this = this;
		this.$nextTick(function() {
			_this.tableHeight = baseConfig.lineNumber(searchPageHeight);
            _this.getTableData();
		})
	}
};
</script>

<style lang="css" scoped>
</style>

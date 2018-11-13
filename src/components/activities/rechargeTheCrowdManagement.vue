<template>
	<!-- 充值众筹管理->table为指的是数据table展示页面 -->
	<!-- dom结构内容 -->
	<section>
		<!-- 工具条/头部的搜索条件搜索 -->
		<el-tabs v-model="tabActiveName" type="border-card" @tab-click="handleClick">
			<!-- Banner条记录查询 -->
			<el-tab-pane label="普通会员数据" name="first" :style="{ height: tabSearchHeight+'px' }">
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" style="overflow: hidden;" :model="formOne">
						<el-form-item>
							<div class="block">
								<span class="registerTime">日期</span>
								<el-date-picker v-model="formOne.choiceDate" type="daterange" range-separator=" 至 " placeholder="选择日期范围"></el-date-picker>
							</div>
						</el-form-item>
						<el-form-item>
							<el-input placeholder="请输入uid查询" v-model="formOne.uid"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="getTableOne">查询</el-button>
						</el-form-item>
					</el-form>
				</el-col>
				<!--数据展示列表-->
				<template>
					<el-table ref="tableHeight" :data="formOne.tabData" border fit highlight-current-row v-loading="listLoading" style="width: 100%;" :height="tableHeight">
						<el-table-column prop="id" label="ID" width="200"></el-table-column>
						<el-table-column prop="uid" label="uid" width="200"></el-table-column>
						<el-table-column label="会员等级" width="200">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<p v-if="scope.row.vip_level==1">白银会员</p>
									<p v-else-if="scope.row.vip_level==2">黄金会员</p>
									<p v-else-if="scope.row.vip_level==3">铂金会员</p>
									<p v-else-if="scope.row.vip_level==4">钻石会员</p>
									<p v-else-if="scope.row.vip_level==5">至尊会员</p>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="create_time" label="创建时间" width="80"></el-table-column>
                        <el-table-column label="众筹状态" width="200">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<p v-if="scope.row.status==0">众筹中</p>
									<p v-else-if="scope.row.status==1">众筹结束</p>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="reward_uid_list" label="中奖用户" min-width="300"></el-table-column>
					</el-table>
					<!--工具条-->
					<el-col :span="24" class="toolbar">
						<el-pagination layout="total,prev,pager,next,jumper" @current-change="oneHandleCurrentChange" :page-size="10" :total="formOne.totalPage" style="float:right;"></el-pagination>
					</el-col>
				</template>
			</el-tab-pane>
			<!-- Banner条记录管理 -->
			<el-tab-pane label="至尊会员数据" name="second" :style="{ height: tabSearchHeight+'px' }">
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" style="overflow: hidden;" :model="formTwo">
						<el-form-item>
							<div class="block">
								<span class="registerTime">日期</span>
								<el-date-picker v-model="formTwo.choiceDate" type="daterange" range-separator=" 至 " placeholder="选择日期范围"></el-date-picker>
							</div>
						</el-form-item>
						<el-form-item>
							<el-input placeholder="请输入uid查询" v-model="formTwo.uid"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="getTableTwo">查询</el-button>
						</el-form-item>
					</el-form>
				</el-col>
				<!--数据展示列表-->
				<template>
					<el-table ref="tableHeight" :data="formTwo.tabData" border fit highlight-current-row v-loading="listLoading" style="width: 100%;" :height="tableHeight">
						<el-table-column prop="id" label="ID" width="200"></el-table-column>
						<el-table-column prop="uid" label="uid" width="200"></el-table-column>
						<el-table-column label="会员等级" width="200">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<p>至尊会员</p>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="create_time" label="创建时间" width="80"></el-table-column>
                        <el-table-column label="众筹状态" width="200">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<p v-if="scope.row.status==0">众筹中</p>
									<p v-else-if="scope.row.status==1">众筹结束</p>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="reward_uid_list" label="中奖用户" min-width="300"></el-table-column>
					</el-table>
					<!--工具条-->
					<el-col :span="24" class="toolbar">
						<el-pagination layout="total,prev,pager,next,jumper" @current-change="twoHandleCurrentChange" :page-size="10" :total="formTwo.totalPage" style="float:right;"></el-pagination>
					</el-col>
				</template>
			</el-tab-pane>
		</el-tabs>
	</section>
</template>

<script>
/* 逻辑交互js内容 */
import Event from './../../public_js/event.js';
import { allget } from '../../api/api';
import store from '../../vuex/store';
import axios from 'axios';
export default {
	data() {
		return {
			tableHeight: null, // plane整个的高度
			tabSearchHeight: null, // table的整个高度
			// 各个tab页面的相应字段
			formOne: {
				choiceDate: [new Date()-180*24*60*60*1000, new Date()], // 对应选择的日期,给默认时间180之前到现在
				uid: '',
				tabData: [], //列表的所有数据，移除删除的功能用全部的数据进行移除
				totalPage: 1000, //下方工具条的总页数 
				page: 0, //现在数据展示的页数，当返回的是全部的数据时，设置默认的页面为1
			},
			formTwo: {
                choiceDate: [new Date()-180*24*60*60*1000, new Date()], // 对应选择的日期,给默认时间180之前到现在
                uid: '',
				tabData: [], //列表的所有数据，移除删除的功能用全部的数据进行移除
				totalPage: 1000, //下方工具条的总页数 
				page: 0, //现在数据展示的页数，当返回的是全部的数据时，设置默认的页面为1
			},
			listLoading: false, //动画加载时显示的动画
			tabActiveName: 'first', // 设置为tab切换栏的选中不同的状态(first、second)
			formLabelWidth: '130px', // 设置dialog弹框的宽度
		};
	},
	methods: {
		// 下方页数进行翻页的页码时，返回的是全部的数据，配合onePageData展示需要展示当前页面的数据
		oneHandleCurrentChange(val) {
			var _this = this;
            _this.formOne.page = val-1;
            _this.getTableOne();
		},
		twoHandleCurrentChange(val) {
			var _this = this;
            _this.formTwo.page = val-1;
            _this.getTableTwo();
		},
		searchConditionOne() {
			var _this = this;
			var obj = {};
			obj.date_s = baseConfig.changeDateTime(_this.formOne.choiceDate[0], 0);
			obj.date_e = baseConfig.changeDateTime(_this.formOne.choiceDate[1], 0);
            obj.uid = _this.formOne.uid;
            obj.page = _this.formOne.page;
			return obj; // return出组装好的搜索条件
        },
        searchConditionTwo() {
			var _this = this;
			var obj = {};
			obj.date_s = baseConfig.changeDateTime(_this.formTwo.choiceDate[0], 0);
			obj.date_e = baseConfig.changeDateTime(_this.formTwo.choiceDate[1], 0);
            obj.uid = _this.formTwo.uid;
            obj.page = _this.formTwo.page;
			return obj; // return出组装好的搜索条件
        },
		// 获取banner查询的数据
		getTableOne() {
			var _this = this ;
			_this.listLoading = true;
			var url = '/Activity/getCrowdFundingVipNormalData';
			var params = _this.searchConditionOne();
            allget(params, url).then(res => {
                _this.listLoading = false;
                if(res.data.ret) {
                    _this.formOne.tabData = res.data.data;
                } else {
                    baseConfig.errorTipMsg(_this, res.data.msg);
                }
            }).catch(function(error){
                baseConfig.errorTipMsg(_this, error);
            })
		},
		// 获取banner管理的数据
		getTableTwo() {
			var _this = this ;
			_this.listLoading = true;
            var url = '/Activity/getCrowdFundingVipSuperData';
            var params = _this.searchConditionTwo();
			allget(params, url).then(res => { 
				_this.listLoading = false;
				if(res.data.ret) {
					_this.formTwo.tabData = res.data.data;
				} else {
					baseConfig.errorTipMsg(_this, res.data.msg);
				}
			}).catch(function(error){
				baseConfig.errorTipMsg(_this, error);
			})
		},
		// 顶部plane进行页面的切换
		handleClick(tab, event) {
			var _this = this;
		},
	},
	mounted() {
		var _this = this;
		_this.$nextTick(function() {
			_this.tableHeight = baseConfig.lineNumber(tabSearchPageHeight);
			_this.tabSearchHeight = baseConfig.lineNumber(tabSearchHeight);			
			_this.getTableOne();
			_this.getTableTwo();
		})
	}
};
</script>

<style lang="css" scoped>
/* 引入的图片展示样式 */
.fileinput{
	float: left;
	margin-top: 8px;
}
/* 页面样式css内容 */
.excelBox{
	width: 500px; height: 270px; margin-left: -150px; background: #f1f7ff;
	position: absolute; left: 50%; top: 15%; z-index: 1000;
}
p{ margin: 0; }
.excelBox>p{
	width: 100%; height: 50px; line-height: 50px; font-weight: bold;
	background: #e3efff; text-align: center;
}
.excelBox .excelInput{
	width: 100%; height: 60px;
}
.excelBox .select{
	width: 100%; height: 80px;
}
.excelBox .excelInput p,
.excelBox .select p{
	width: 100%; height: 36px; text-indent: 20px; line-height: 36px;
}
.excelBox .excelInput input{
    width: 300px; display: block; margin: 0 auto;
}
.excelBox .select>div{
	width: 300px; display: block; margin: 0 auto;
}
.btns{
    width: 100%; height: 50px;
}
.btns button{
    width: 80px; height: 40px; text-align: center; line-height: 40px;
    border: none; border-radius: 5px;
    background-color: #78B2FF; margin-top: 20px; color: #fff;
}
.btns button:nth-of-type(1){
    margin-left: 150px; cursor: pointer;
}
.btns button:nth-of-type(2){
    margin-left: 50px; cursor: pointer;
}
.demo-ruleForm{
	width: 500px;
}
.el-tab-pane{
	height: 800px;
}
</style>

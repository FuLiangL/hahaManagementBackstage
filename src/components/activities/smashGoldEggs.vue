<template>
	<!-- 砸金蛋 -->
	<section>
		<el-tabs 
		v-model="tabActiveName" 
		type="border-card" 
		@tab-click="handleClick">
			<el-tab-pane 
			label="作弊后台" 
			name="two" 
			:style="{height:tabHeight+'px'}">
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" style="overflow:hidden;">
						<el-form-item>
							<el-button 
							type="primary" 
							@click="addDialog.dialogShow=true;">添加</el-button>
						</el-form-item>
					</el-form>
				</el-col>
				<template>
					<el-table 
					ref="tabSearchPageHeight" 
					:data="twoPageData" 
					border fit highlight-current-row 
					style="width:100%;" 
					:height="tabSearchPageHeight">
						<el-table-column prop="uid" label="用户UID"></el-table-column>
						<el-table-column prop="num" label="作弊豆币数"></el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button 
								type="warning" 
								@click.native.prevent="deleteSure(scope.row)" 
								size="small">删除</el-button>								
							</template>
						</el-table-column>
					</el-table>
					<el-col :span="24" class="toolbar">
						<el-pagination  
						layout="total,prev,pager,next,jumper" 
						@current-change="twoHandleCurrentChange" 
						:page-size="20" 
						:total="formTwo.totalPage" 
						style="float:right;"></el-pagination>
					</el-col>
				</template>
			</el-tab-pane>
			<el-tab-pane 
			label="作弊操作日志" 
			name="three" 
			:style="{height:tabHeight+'px'}">
				<template>
					<el-table 
					ref="tabPageHeight" 
					:data="formThree.tabData" 
					border fit highlight-current-row 
					style="width:100%;" 
					:height="tabPageHeight">
						<el-table-column type="index" width="100"></el-table-column>
						<el-table-column prop="content" label="内容"></el-table-column>
					</el-table>
					<el-col :span="24" class="toolbar">
						<el-pagination 
						layout="total,prev,pager,next,jumper" 
						@current-change="threeHandleCurrentChange" 
						:page-size="20" 
						:total="formThree.totalPage" 
						style="float:right;"></el-pagination>
					</el-col>
				</template>
			</el-tab-pane>
			
			<el-tab-pane 
			label="开宝箱数据" 
			name="four" 
			:style="{height:tabHeight+'px'}">
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" style="overflow:hidden;" :model="formFour">
						<el-form-item>
							<div class="block">
								<span class="registerTime">日期</span>
								<el-date-picker v-model="formFour.choiceDate" type="daterange" range-separator=" 至 " placeholder="选择日期范围"></el-date-picker>
							</div>
						</el-form-item>
						<el-form-item label="UID">
							<el-input v-model="formFour.uid" auto-complete="off"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="getFourData">查询</el-button>
						</el-form-item>
					</el-form>
				</el-col>
				<template>
					<el-table 
					ref="tabSearchPageHeight" 
					:data="formFour.tabData" 
					border fit highlight-current-row 
					style="width:100%;" 
					:row-class-name="tableRowClassName" 
					:height="tabSearchPageHeight">
						<el-table-column prop="uid" label="用户UID"></el-table-column>
						<el-table-column prop="nickname" label="昵称"></el-table-column>
						<el-table-column prop="one" label="铜宝箱开启次数"></el-table-column>
						<el-table-column prop="ten" label="银宝箱开启次数"></el-table-column>
						<el-table-column prop="hundred" label="金宝箱开启次数"></el-table-column>
						<el-table-column prop="reward" label="奖励金币"></el-table-column>
						<el-table-column prop="cost" label="消耗金币"></el-table-column>
						<el-table-column prop="gain" label="盈余"></el-table-column>
					</el-table>
					<el-col
					:span="24"
					class="toolbar">
						<el-pagination
						layout="total, prev, pager, next, jumper"
						@current-change="fourHandleCurrentChange"
						:page-size="21"
						:total="formFour.totalPage"
						style="float:right;">
						</el-pagination>
					</el-col>
				</template>
			</el-tab-pane>
			
			
			<el-dialog
			title="作弊添加"
			:visible.sync="addDialog.dialogShow">
				<el-form :model="addDialog">
					<el-form-item label="用户UID" :label-width="formLabelWidth">
						<el-input v-model="addDialog.uid"></el-input>
					</el-form-item>
					<el-form-item label="作弊的豆币数" :label-width="formLabelWidth">
						<el-input v-model="addDialog.cheat"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button 
					@click.native.prevent="twoAddBtn(0)">取 消</el-button>
					<el-button 
					type="primary" 
					@click.native.prevent="twoAddBtn(1)">确 定</el-button>
				</div>
			</el-dialog>
			<el-dialog
			title="作弊删除"
			:visible.sync="deleteDialog.dialogShow">
				<el-form :model="deleteDialog">
					<p style="width:100%;text-align:center;font-size:16px;color:red;">请确定删除掉该次作弊~</p>
					<p style="width:100%;text-align:center;font-size:20px;color:#000000;">删除掉{{deleteDialog.uid}}的作弊记录{{deleteDialog.num}}</p>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button 
					@click.native.prevent="twoDeleteBtn(0)">取 消</el-button>
					<el-button 
					type="primary" 
					@click.native.prevent="twoDeleteBtn(1)">确 定</el-button>
				</div>
			</el-dialog>
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
			tabHeight: null,
			tabPageHeight: null,
			tabSearchPageHeight: null,
			operate_user: '',
			formTwo: {
				tabData: [], 
				totalPage: null, 
				page: 1, 
				star: '0',
				end: '20',
			},
			formThree: {
				tabData: [],
				totalPage: 1000,
				page: 0, 
			},
			formFour: {
				choiceDate: [new Date()-7*24*60*60*1000, new Date()],
				uid: '',
				tabData: [],
				totalPage: 1000,
				page: 0,
			},
			addDialog: {
				dialogShow: false,
				uid: '',
				cheat: '',
			},
			deleteDialog: {
				dialogShow: false,
				uid: '',
				num: '',
			},
			tabActiveName: 'four', //(one、two、three)
			formLabelWidth: '130px', 
		};
	},
	computed:{
		twoPageData() {
			var _this = this;
			return _this.formTwo.tabData.slice(_this.formTwo.star, _this.formTwo.end);
		},
	},
	methods: {
		searchConditionFind() {
			var _this = this;
			var obj = {};
			if(_this.formFour.choiceDate == null){
				obj.date_s='';
				obj.date_e='';
			}else{
				obj.date_s = baseConfig.changeDateTime(_this.formFour.choiceDate[0], 0);
				obj.date_e = baseConfig.changeDateTime(_this.formFour.choiceDate[1], 0);
			}
			obj.uid = _this.formFour.uid;
			obj.page = _this.formFour.page;
			return obj; 
	    },
		twoHandleCurrentChange(val) {
			var _this = this;
			_this.formTwo.page = val-1;
			_this.formTwo.star = _this.formTwo.page*20;
			_this.formTwo.end = _this.formTwo.star+20;
		},
		threeHandleCurrentChange(val) {
			var _this = this;
			_this.formThree.page = val-1;
			_this.getThreeData();
		},
		fourHandleCurrentChange(val) {
			var _this = this;
			_this.formFour.page = val-1;
			_this.getFourData();
		},
		getTwoData() {
			var _this = this ;
			var url = baseConfig.server+baseConfig.requestUrl+'/NewActivity/getGoldEggCheat';
			var params = {};
			axios.get(url, {params: params})
			.then((res) => {
				if(res.data.ret) {
					var arr = [];
					for(var key in res.data.data) {
						var obj = {};
						obj.uid = key;
						obj.num = res.data.data[key];
						arr.unshift(obj);
					}
					_this.formTwo.tabData = arr;
					_this.formTwo.totalPage = arr.length;
				} else {
					obj.date_e
				}
			})
			.catch((err) => {
				console.log(err);
			})
		},
		getThreeData() {
			var _this = this ;
			var url = baseConfig.server+baseConfig.requestUrl+'/NewActivity/getGoldEggCheatLog';
			var params = {
				page: _this.formThree.page,
			};
			axios.get(url, {params: params})
			.then((res) => {
				if(res.data.ret) {
					var arr = [];
					for(var i=0; i<res.data.data.length; i++) {
						var obj = {};
						obj.content = res.data.data[i];
						arr.push(obj);
					}
					_this.formThree.tabData = arr;
				} else {
					baseConfig.errorTipMsg(_this, res.data.msg);
				}
			})
			.catch((err) => {
				console.log(err);
			})
		},
		getFourData() {			
			var _this = this ;
			var url = baseConfig.server+baseConfig.requestUrl+'/NewActivity/getGoldEggData';
			var params = _this.searchConditionFind();
			axios.get(url, {params: params})
			.then((res) => {
				if(res.data.ret) {
					console.log(res.data);
					var obj = res.data.total;
					obj.uid = '总计';
					obj.nickname = '---';
					res.data.data.unshift(obj);
					_this.formFour.tabData = res.data.data;
				} else {
					baseConfig.errorTipMsg(_this, res.data.msg);
				}
			})
			.catch((err) => {
				console.log(err);
			})
		},
		twoAddBtn(type) {
			var _this = this ;
			var url = baseConfig.server+baseConfig.requestUrl+'/NewActivity/addGoldEggCheat';
			var params = {
				uid: _this.addDialog.uid,
				cheat: _this.addDialog.cheat,
				operate_user: _this.operate_user,
			};
			if(type==0) {
				_this.addDialog.uid = '';
				_this.addDialog.cheat = '';
			} else if(type==1) {
				axios.get(url, {params: params})
				.then((res) => {
					if(res.data.ret) {
						baseConfig.successTipMsg(_this, '添加成功~');
						_this.getTwoData();
						_this.getThreeData();
					} else {
						baseConfig.errorTipMsg(_this, res.data.msg);
					}
				})
				.catch((err) => {
					console.log(err);
				})
			}
			_this.addDialog.dialogShow = false;
		},
		deleteSure(obj) {
			var _this = this;
			_this.deleteDialog.dialogShow = true;
			_this.deleteDialog.uid = obj.uid;
			_this.deleteDialog.num = obj.num;
		},
		twoDeleteBtn(type) {
			var _this = this ;
			var url = baseConfig.server+baseConfig.requestUrl+'/NewActivity/delGoldEggCheat';
			var params = {
				uid: _this.deleteDialog.uid,
				operate_user: _this.operate_user,
			};
			if(type==0) {
				_this.deleteDialog.uid = '';
				_this.deleteDialog.num = '';
			} else if(type==1) {
				axios.get(url, {params: params})
				.then((res) => {
					if(res.data.ret) {
						baseConfig.successTipMsg(_this, '删除成功~');
						_this.getTwoData();
						_this.getThreeData();
					} else {
						baseConfig.errorTipMsg(_this, res.data.msg);
					}
				})
				.catch((err) => {
					console.log(err);
				})
			}
			_this.deleteDialog.dialogShow = false;
		},
		handleClick(tab, event) {
			var _this = this;
			console.log(tab.label);
		},
		tableRowClassName({row, rowIndex}) {
			if(rowIndex===0) {
				return 'warning-row';
			} 
			return '';
		},
	},
	mounted() {
		var _this = this;
		this.$nextTick(function() {
			_this.tabHeight = baseConfig.lineNumber(tabHeight);
			_this.tabPageHeight = baseConfig.lineNumber(tabPageHeight);
			_this.tabSearchPageHeight = baseConfig.lineNumber(tabSearchPageHeight);
			_this.operate_user = store.state.user.name;
			_this.getTwoData();
			_this.getThreeData();
			_this.getFourData();
		})
	}
};
</script>

<style>
.el-table .warning-row {
	background: oldlace;
}
</style>

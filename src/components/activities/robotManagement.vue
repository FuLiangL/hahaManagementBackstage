<template>
	<!-- 机器人管理 -->
	<section>
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" style="overflow: hidden;" :model="formOne">
					<el-form-item label="房间ID">
						<el-input v-model="formOne.room_id"></el-input>
					</el-form-item>
					<el-form-item label="类型">
						<el-select v-model="formOne.type">
							<el-option label="全部" value="0"></el-option>
							<el-option label="个人房间" value="1"></el-option>
							<el-option label="家族房间" value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="getData">查询</el-button>
					</el-form-item>
				</el-form>
			</el-col>
			<!--数据展示列表-->
			<template>
				<el-table 
				ref="tableHeight" 
				:data="formOne.tabData" 
				border fit highlight-current-row 
				style="width:100%;" 
				:height="searchPageHeight">
					<el-table-column prop="room_id" label="房间ID" min-width="100"></el-table-column>
					<el-table-column prop="room_name" label="房间名称" min-width="100"></el-table-column>
					<el-table-column label="房间缩略图" min-width="100">
						<template slot-scope="scope">
							<div slot="reference" class="name-wrapper">
								<img :src="scope.row.room_pic" style="width: 100px; height: auto;">
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="total_honour" label="总荣耀值" min-width="100"></el-table-column>
					<el-table-column prop="week_honour" label="周荣耀值" min-width="100"></el-table-column>
					<el-table-column prop="total_num" label="目前房间总人数" min-width="100"></el-table-column>
					<el-table-column prop="robot_num" label="机器人的数量" min-width="100"></el-table-column>
					<el-table-column label="机器人调整" min-width="100">
						<template slot-scope="scope">
							<el-button 
							type="primary" 
							@click.native.prevent="numDialog.dialogShow=true;numDialog.yun_xin_room_id=scope.row.yun_xin_room_id;" 
							size="small">编辑</el-button>								
						</template>
					</el-table-column>
				</el-table>
				<el-dialog 
				title="机器人数量修改"
				:visible.sync="numDialog.dialogShow">
					<el-form :model="numDialog">
						<el-form-item label="请输入机器人数量" :label-width="formLabelWidth">
							<el-input v-model="numDialog.num"></el-input>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button 
						@click.native.prevent="changeNum(0)">取 消</el-button>
						<el-button 
						type="primary" 
						@click.native.prevent="changeNum(1)">确 定</el-button>
					</div>
				</el-dialog>
				<!--工具条-->
				<el-col :span="24" class="toolbar">
					<el-pagination 
					layout="total,prev,pager,next,jumper" 	
					@current-change="oneHandleCurrentChange" 
					:page-size="20" 
					:total="formOne.totalPage" 
					style="float:right;"></el-pagination>
				</el-col>
			</template>
	</section>
</template>

<script>
import Event from './../../public_js/event.js';
import { allget } from '../../api/api';
import store from '../../vuex/store';
import axios from 'axios';
export default {
	data() {
		return {
			searchPageHeight: null,
			formOne: {
				room_id: '',
				type: '0',//0->个人,1->个人,2->家族
				tabData: [],
				totalPage: 1000, 
				page: 0,
			},
			numDialog: {
				dialogShow: false,
				num: '',
				yun_xin_room_id: '',
			},
			formLabelWidth: '130px',
		};
	},
	methods: {
		// 下方页数进行翻页的页码时，返回的是全部的数据，配合onePageData展示需要展示当前页面的数据
		oneHandleCurrentChange(val) {
			// val指的是当前点击是第一页
			var _this = this;
			_this.formOne.page = val-1;
			_this.getData();
		},
		// 获取家族数据统计的数据
		getData() {
			var _this = this ;
			var url = '/NewFamily/getRoomRobotList';
			var params = {
				room_id: _this.formOne.room_id,
				page: _this.formOne.page,
				type: _this.formOne.type,
			};
			axios.get(baseConfig.server+baseConfig.requestUrl+url, { params: params })
			.then((res) => {
				if(res.data.ret) {
					_this.formOne.tabData = res.data.data;
				} else {
					baseConfig.errorTipMsg(_this, res.data.msg);
				}
			}).catch((error) => {
				console.log(error);
			});
		},
		// 添加机器人的数量
		changeNum(type) {
			var _this = this;
			if(type==0) {
				_this.numDialog.dialogShow = false;
				_this.numDialog.num = '';
			} 
			else if(type==1) {
				var url = 'NewFamily/changeRoomRobotNum';
				var params = {
					yun_xin_room_id: _this.numDialog.yun_xin_room_id,
					num: _this.numDialog.num,
				};
				axios.get(baseConfig.server+baseConfig.requestUrl+url, { params: params })
				.then((res) => {
					if(res.data.ret) {
						_this.getData();
						baseConfig.successTipMsg(_this, res.data.msg);
						_this.numDialog.num = '';
					} else {
						baseConfig.normalTipMsg(_this, res.data.msg);
					}
					_this.numDialog.dialogShow = false;
				})
				.catch((err) => {
					console.log(err);
				});
			}
		},
	},
	mounted() {
		var _this = this;
		this.$nextTick(function() {
			_this.searchPageHeight = baseConfig.lineNumber(searchPageHeight);
			_this.getData();
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

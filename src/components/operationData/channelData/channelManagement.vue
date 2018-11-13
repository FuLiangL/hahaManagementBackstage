<template>
	<!-- 渠道管理 -->
	<!-- dom结构内容 -->
	<section>
		<!-- 工具条/头部的搜索条件搜索 -->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" style="overflow: hidden;">
                <el-form-item>
					<el-button type="primary" @click="dialogAddFormVisible=true;">新增</el-button>
					<el-button type="primary" @click="refreshPage($event)">刷新</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--用户的数据展示列表-->
		<template>
			<el-table ref="tableHeight" :data="onePageTabData" border fit highlight-current-row v-loading="listLoading" style="width: 100%;" :height="tableHeight">
				<el-table-column prop="id" label="渠道号" width="100" sortable ></el-table-column>
				<el-table-column prop="annotation" label="渠道名称" width="500"></el-table-column>
				<el-table-column label="操作" min-width="200">
					<template slot-scope="scope">
						<el-button type="primary" @click.native.prevent="changeOneUserData(scope.$index, tabData)" size="small">编辑</el-button>
						<el-button type="primary" @click.native.prevent="deleteOneUserData(scope.$index, tabData)" size="small">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!--工具条-->
			<el-col :span="24" class="toolbar">
				<el-pagination layout="total,prev,pager,next,jumper" @current-change="handleCurrentChange" :page-size="20" :total="totalpage" style="float:right;"></el-pagination>
			</el-col>
			<!-- 编辑修改--对应的dialog -->
			<el-dialog title="编辑修改渠道号名称" :visible.sync="dialogFormVisible">
				<el-form :model="formTwo">
					<el-form-item label="请输入名称" :label-width="formLabelWidth">
						<el-input v-model="formTwo.annotation" auto-complete="off"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="editorSure(0)">取 消</el-button>
					<el-button type="primary" @click="editorSure(1)">确 定</el-button>
				</div>
			</el-dialog>
			<!-- 新增修改--对应的dialog -->
			<el-dialog title="新增渠道号" :visible.sync="dialogAddFormVisible">
				<el-form :model="formThree">
					<el-form-item label="请输入渠道号" :label-width="formLabelWidth">
						<el-input v-model="formThree.id" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="请输入渠道名称" :label-width="formLabelWidth">
						<el-input v-model="formThree.annotation" auto-complete="off"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="addSure(0)">取 消</el-button>
					<el-button type="primary" @click="addSure(1)">确 定</el-button>
				</div>
			</el-dialog>
		</template>
	</section>
</template>

<script>
/* 逻辑交互js内容 */
import Event from './../../../public_js/event.js';
import { allget } from '../../../api/api';
import store from '../../../vuex/store';
import axios from 'axios';
export default {
	data() {
		return {
			tableHeight: null, // table展示的页面的高度多少
			formTwo: {
				id: '', // 编辑修改的id值
				annotation: '', // input的指定的value值
				rows: null, // 对应table中的整个数据数组
				index: null, // 对应table的数据中的下标
			},
			formThree: { // 新增
				id: '', // 渠道号
				annotation: '', // 渠道号名称
			},
			excelBoxActivity: false, // 控制提交Excel的提交框的显示隐藏
			listLoading: false, //动画加载时显示的动画
			tabData: [], //列表的所有数据，移除删除的功能用全部的数据进行移除
			totalpage: null, //下方工具条的总页数 
			page: 1, //现在数据展示的页数，当返回的是全部的数据时，设置默认的页面为1
			star: '0', //每一页的开始数据
			end: '20', //每一页的结束数据
			dialogFormVisible: false, // 控制dialog弹框编辑修改的显示和隐藏
			dialogAddFormVisible: false, // 控制dialog弹框新增的显示和隐藏
			formLabelWidth: '120px', // 设置dialog弹框的宽度
		};
	},
	computed:{
		// 对某一页码展示某一页的数据，对返回的所有的数据进行切割处理，对当前的页码显示20条当前页码的数据
		onePageTabData() {
			var _this = this;
			return _this.tabData.slice(_this.star, _this.end);
		},
	},
	methods: {
		// 下方页数进行翻页的页码时，返回的是全部的数据，配合onePageTabData展示需要展示当前页面的数据
		handleCurrentChange(val) {
			// val指的是当前点击是第一页
			var _this = this;
			_this.page = val;
			_this.star = (_this.page-1)*20;
			_this.end = _this.star+20;
		},
		// 获取数据列表
		getTableData() {
			var _this = this ;
			_this.listLoading = true;
			var url = '/Channel/getChannel';
			// 进行get请求，(请求参数params, 请求地址url)
			allget('', url).then(res => {
				// 数据请求成功
				_this.listLoading = false;
				if(res.data.ret) {
					// 正常数据
					_this.totalpage = res.data.data.length;
					_this.tabData = res.data.data;
				} else {
					// 返回ret==0，非正常数据
					baseConfig.errorTipMsg(_this, res.data.msg);
				}

			}).catch(function(error){
				console.log(error);
			})
		},
		// 编辑修改某一条渠道号名称
		changeOneUserData(index, rows){
			var _this = this;
			index = index + (_this.page-1)*20; // 页数的相应操作，拿取之后翻页的页码的index值
			_this.formTwo.index = index;
			_this.formTwo.id = rows[index].id;
			_this.formTwo.annotation = rows[index].annotation;
			_this.dialogFormVisible = true; // 点击了编辑修改显示dialog框
		},
		// 确定编辑修改渠道号名称(val对应的值：0->取消，1->确认)
		editorSure(val) {
			var _this = this;
			if(val==0) {
				// 点击了取消按钮
				_this.dialogFormVisible = false; // 点击了取消、确定按钮都要进行隐藏dialog框
				console.log('点击了取消按钮');
			} else if(val==1) {
				// 点击了确认按钮
				console.log('点击了确认按钮');
				_this.listLoading = true;
				// 进行添加的操作
				var url = '/Channel/modifyChannel';
				var params = {
					annotation: _this.formTwo.annotation,
					id: _this.formTwo.id,
				};
				var paramsTable = {
					id: _this.formTwo.id,
					annotation: _this.formTwo.annotation,
				};
				// 判断必须是要有输入名称和渠道号
				if(params.annotation!='' && params.id!=''){
					_this.dialogFormVisible = false; // 点击了取消、确定按钮都要进行隐藏dialog框
					allget(params, url).then(res => {
						console.log(res);
						if(res.data.ret) {
							// 数据请求成功
							_this.listLoading = false;
							baseConfig.successTipMsg(_this, '编辑修改成功！');
							_this.getTableData();
						} else {
							baseConfig.errorTipMsg(_this, res.data.msg);
						}
					}).catch(function(error){
						console.log(error);
					})
				} else {
					_this.listLoading = false; 
					baseConfig.warningTipMsg(_this, '修改的渠道号名称不能为空！');
				}
			} 
		},
		// 新增一条随机标签
		addSure(val) {
			var _this = this;
			if(val==0) {
				// 点击了取消按钮
				_this.dialogFormVisible = false; // 点击了取消、确定按钮都要进行隐藏dialog框
				console.log('点击了取消按钮');
			} else if(val==1) {
				// 点击了确认按钮
				console.log('点击了确认按钮');
				_this.listLoading = true;
				// 进行添加的操作
				var url = '/Channel/addChannel';
				var params = {
					id: _this.formThree.id,
					annotation: _this.formThree.annotation,
				};
				// 判断必须是要有渠道号、渠道名称
				if(params.annotation!=''&&params.id!=''){
					_this.dialogAddFormVisible = false; // 点击了取消、确定按钮都要进行隐藏dialog框
					allget(params, url).then(res => {
						console.log(res);
						if(res.data.ret) {
							// 数据请求成功
							_this.listLoading = false;
							baseConfig.successTipMsg(_this, '新增成功！');
							_this.getTableData();
						} else {
							baseConfig.errorTipMsg(_this, res.data.msg);
						}
					}).catch(function(error){
						console.log(error);
					})
				} else {
					_this.listLoading = false; 
					baseConfig.warningTipMsg(_this, '新增的渠道号、渠道名称不能为空！');
				}
			} 
		},
		// 删除某一条随机标签
		deleteOneUserData(index, rows) {
			var _this = this;
			index = index + (_this.page-1)*20; // 页数的相应操作，拿取之后翻页的页码的index值
			var id = rows[index].id; // 移除前拿出对应内容的中value值	
			console.log(id);
			// 下面的操作主要是为了进行将删除的内容调用删除接口进行删除
			_this.listLoading = true;
			var url = '/Channel/deleteChannel';
			var params = {
				id: id,
			};
			// 进行get请求删除掉这条用户注册语
			allget(params, url).then(res => {
				// 数据请求成功
				_this.listLoading = false;
				if(res.data.ret) {
					baseConfig.successTipMsg(_this, '删除成功'); // 删除成功的提示框提示
					_this.getTableData();
				} else {
					// 返回ret==0，非正常数据
					baseConfig.errorTipMsg(_this, res.data.msg);
				}

			}).catch(function(error) {
				console.log(error);
			})
		},
		// 进行页面刷新功能
		refreshPage() {
			var _this = this;
			// 拿取相应的地址栏后面的路由
			var strPath = location.href;
            if(strPath.indexOf('http://')==0) {
                strPath = strPath.substring(strPath.indexOf('http://')+7, strPath.length);
            }
            var index = strPath.indexOf('/');
            strPath = strPath.substring(index, strPath.length);
            // 跳转到空页面，进行传参进行跳转到空组建里面，将需要返回的路由页面链接进行传值
            _this.$router.replace({
                path: '/empty', 
                query: {from: strPath},
            });
		},
	},
	mounted() {
		var _this = this;
		this.$nextTick(function() {
			_this.tableHeight = baseConfig.lineNumber(searchPageHeight); // 固定table的自适应的高度
			_this.getTableData(); // 一开始加载table表的数据
		})
	}
};
</script>

<style lang="css" scoped>
/* 页面样式css内容 */
.excelBox{
	width: 500px; height: 190px; margin-left: -150px; background: #f1f7ff;
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
</style>

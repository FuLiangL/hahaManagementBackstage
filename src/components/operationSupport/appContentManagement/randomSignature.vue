<template>
	<!-- 随机签名 -->
	<!-- dom结构内容 -->
	<section>
		<!-- 提交Excel的弹框 -->
		<div class="excelBox" v-show="excelBoxActivity">
			<p>请上传Excel文件，只限上传为Excel文件</p>
			<div class="excelInput">
				<p>请选择Excel文件:</p>
				<input @change="uploading($event)" type="file" accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
			</div>
			<div class="btns">
				<!-- 按钮操作部分 -->
	            <button  @click="excelBoxActivity=false;">取消</button>
		        <button  @click="submit()">提交</button>
			</div>
		</div>
		<!-- 工具条/头部的搜索条件搜索 -->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" style="overflow: hidden;">
                <el-form-item>
					<el-button type="primary" @click="excelBoxActivity=true;">上传</el-button>
					<el-button type="primary" @click="refreshPage($event)">刷新</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--用户的数据展示列表-->
		<template>
			<el-table ref="tableHeight" :data="onePageTabData" border fit highlight-current-row v-loading="listLoading" style="width: 100%;" :height="tableHeight">
				<el-table-column prop="id" label="ID" width="100" sortable ></el-table-column>
				<el-table-column prop="signature" label="随机签名" width="700"></el-table-column>
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
			<!-- 新增--对应的dialog -->
			<el-dialog title="编辑修改随机签名" :visible.sync="dialogFormVisible">
				<el-form :model="formTwo">
					<el-form-item label="请输入签名" :label-width="formLabelWidth">
						<el-input v-model="formTwo.name" auto-complete="off"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="editorSure(0)">取 消</el-button>
					<el-button type="primary" @click="editorSure(1)">确 定</el-button>
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
				name: '', // input的指定的value值
				rows: null, // 对应table中的整个数据数组
				index: null, // 对应table的数据中的下标
			},
			formThree: {
				file: '', // 提交Excel的表格的文件
			},
			excelBoxActivity: false, // 控制提交Excel的提交框的显示隐藏
			listLoading: false, //动画加载时显示的动画
			tabData: [], //列表的所有数据，移除删除的功能用全部的数据进行移除
			totalpage: null, //下方工具条的总页数 
			page: 1, //现在数据展示的页数，当返回的是全部的数据时，设置默认的页面为1
			star: '0', //每一页的开始数据
			end: '20', //每一页的结束数据
			dialogFormVisible: false, // 控制dialog弹框的显示和隐藏
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
			var url = '/GlobalSet/getRandomSignature';
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
		// 编辑修改某一条随机签名
		changeOneUserData(index, rows){
			var _this = this;
			index = index + (_this.page-1)*20; // 页数的相应操作，拿取之后翻页的页码的index值
			var id = rows[index].id; // 移除前拿出对应内容的中value值	
			_this.formTwo.index = index;
			_this.formTwo.id = id;
			_this.formTwo.name = rows[index].signature;
			_this.dialogFormVisible = true; // 点击了编辑修改显示dialog框
		},
		// 确定编辑修改随机签名(val对应的值：0->取消，1->确认)
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
				var url = '/GlobalSet/editRandomSignature';
				var params = {
					signature: _this.formTwo.name,
					id: _this.formTwo.id,
				};
				// 判断必须是要有输入内容和设置性别才能进行新增条件查询
				if(params.signature!=''){
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
					baseConfig.warningTipMsg(_this, '修改的随机签名内容不能为空');
				}
			} 
		},
		// 删除某一条随机签名
		deleteOneUserData(index, rows) {
			var _this = this;
			index = index + (_this.page-1)*20; // 页数的相应操作，拿取之后翻页的页码的index值
			var id = rows[index].id; // 移除前拿出对应内容的中value值	
			console.log(id);
			// 下面的操作主要是为了进行将删除的内容调用删除接口进行删除
			_this.listLoading = true;
			var url = '/GlobalSet/delRandomSignature';
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
		// 获取文件保存的操作
		uploading(event) {
			var _this = this;
      	    var windowURL = window.URL || window.webkitURL;
            _this.formThree.file = event.target.files[0];
      	},
		// 提交整个Excel表的操作 
      	submit() {
            var _this = this;
		  	let formData = new FormData();
          	formData.append('file', _this.formThree.file); // 设置为数据库查找的对应字段
          	let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'  //之前说的以表单传数据的格式来传递fromdata
                }
            };
            axios.post(baseConfig.server+baseConfig.requestUrl+'/GlobalSet/addRandomSignature', formData, config)
            .then( (res) => {
				if(res.data.ret) {
					baseConfig.successTipMsg(_this, '增加成功'); // 添加成功的提示框提示
					_this.getTableData();
					// 提示让用户可以进行查询刷新数据更新
					_this.excelBoxActivity = false; // 添加成功让Excel弹窗进行隐藏
				} else {
					// 返回ret==0，非正常数据
					baseConfig.errorTipMsg(_this, res.data.msg);
				}
            }).catch((error) =>{
                console.log(error);
            });
	  	},
		// 进行页面刷新功能
		refreshPage() {
			var _this = this;
			var strPath = location.href;
            if(strPath.indexOf('http://')==0) {
                strPath = strPath.substring(strPath.indexOf('http://')+7, strPath.length);
            }
            var index = strPath.indexOf('/');
            strPath = strPath.substring(index,strPath.length);
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

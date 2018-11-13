<template>
	<!-- 文章管理 -->
	<section>
		<el-tabs 
		v-model="activeName" 
		type="border-card" 
		@tab-click="handleClick">
			<el-tab-pane 
			label="文章管理" 
			name="one" 
			:style="{height: tabSearchHeight+'px'}">
				<template>
					<el-table 
					ref="tableHeightAddTab" 
					:data="onePageTabData" 
					border fit highlight-current-row 
					v-loading="listLoading" 
					style="width: 100%;" :height="tableHeight">
						<el-table-column prop="add_time" label="添加时间" width="200"></el-table-column>
						<el-table-column prop="id" label="文章ID" width="100"></el-table-column>
						<el-table-column prop="title" label="标题" width="150"></el-table-column>
						<el-table-column label="封面图" width="150">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<img 
									:src="scope.row.image_url" 
									style="width: 100px; height: 100px;">
								</div>
							</template>
						</el-table-column>
						<el-table-column label="链接" width="300">
							<template slot-scope="scope">
								<el-popover
								placement="top-start"
								trigger="hover"
								content="可点击打开新的窗口查看页面~">
									<a
									slot="reference" 
									v-if="serverStatus==false" 
									style="color: red;" 
									:href="'http://test-manage.dianliaoapp.com/client/dev/explain/article.php?id='+scope.row.id" 
									target="_blank">{{scope.row.title}}</a>
									<a 
									slot="reference" 
									v-else 
									style="color: red;" 
									:href="'http://manage.dianliaoapp.com/client/dev/explain/article.php?id='+scope.row.id" 
									target="_blank">{{scope.row.title}}</a>
								</el-popover>
							</template>
						</el-table-column>
						<el-table-column label="操作" min-width="100">
							<template slot-scope="scope">
								<el-button 
								type="primary" 
								@click.native.prevent="changeData(scope.row)" 
								size="small">编辑</el-button>								
								<el-button 
								type="primary" 
								@click.native.prevent="deleteData(scope.row)" 
								size="small">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
					<el-col 
					:span="24" 
					class="toolbar">
						<el-pagination 
						layout="total,prev,pager,next,jumper" 
						@current-change="handleCurrentChange" 
						:page-size="20" 
						:total="formOne.totalPage" 
						style="float: right;"></el-pagination>
					</el-col>
				</template>
			</el-tab-pane>
			<el-tab-pane 
			label="编辑修改" 
			name="two" :style="{height:tabHeight+'px'}">
				<el-form 
				:label-position="labelPosition" 
				class="demo-ruleForm" 
				label-width="120px" 
				:model="formTwo" style="padding-left:30px;">
					<el-form-item label="文章主题" style="padding-top:30px;">
						<el-input v-model="formTwo.title"></el-input>
					</el-form-item>
					<el-form-item label="封面图">
				        <!--图片文件上传、图片的展示-->
						<input id="fileinput" @change="uploadingTwo($event)" type="file">
						 <img :src="formTwo.pic"/>
					</el-form-item>
					<el-form-item label="内容">
						<div class="edit_container">
							<quill-editor 
							class="editer" 
							v-model="formTwo.content" 
							ref="myQuillEditor" 
							:options="editorOption" 
							@change="twoEditorChange($event)"></quill-editor>
						</div>
					</el-form-item>
				</el-form>
				<el-button 
				type="primary" 
				style="margin-left: 50px; margin-top: 30px;" 
				@click="btnSureTwo">确定发送</el-button>
			</el-tab-pane>
			<el-tab-pane 
			label="新增文章" 
			name="three" 
			:style="{height:tabHeight+'px'}">
				<el-form 
				:label-position="labelPosition" 
				class="demo-ruleForm" 
				label-width="120px" 
				:model="formThree" style="padding-left: 30px;">
					<el-form-item label="文章主题" style="padding-top: 30px;">
						<el-input v-model="formThree.title"></el-input>
					</el-form-item>
					<el-form-item label="封面图">
				        <!--图片文件上传、图片的展示-->
						<input id="fileinput" @change="uploadingThree($event)" type="file">
						 <img :src="formThree.pic"/>
					</el-form-item>
					<el-form-item label="内容">
						<div class="edit_container">
							<quill-editor 
							class="editer" 
							v-model="formThree.content" 
							ref="myQuillEditor" 
							:options="editorOption" 
							@change="threeEditorChange($event)"></quill-editor>
						</div>
					</el-form-item>
				</el-form>
				<el-button 
				type="primary" 
				style="margin-left:50px; margin-top:30px;" 
				@click="sendToTask()">确定发送</el-button>
			</el-tab-pane>
		</el-tabs>
	</section>
</template>

<script>
/* 逻辑交互js内容 */
import Event from './../../../public_js/event.js';
import store from '../../../vuex/store';
import axios from 'axios';
export default {
	data() {
		return {
			serverStatus: false,
			tabHeight: null,
			tableHeight: null,
			tabSearchHeight: null,
			labelPosition: 'left',
			formOne: {
				tabData: [],
				totalPage: null,
				page: 1,
				star: '0',
				end: '20',
			},
			formTwo: {
				id: '',
				pic: '',
				file: '',
				title: '',
				content: '',
			},
			formThree: {
				pic: '',
				file: '',
				title: '',
				content: '',
			},
			listLoading: false,
			activeName: 'one', 
			editorOption: {},
		};
	},
	computed:{
		onePageTabData() {
			var _this = this;
			return _this.formOne.tabData.slice(_this.formOne.star, _this.formOne.end);
		},
	},
	methods: {
		/*
			第一屏文章管理的方法
			1、handleCurrentChange：下方工具条进行page的处理，展示多少条数据
			2、getTableData：获取到全部文章列表数据
			3、changeData：修改的触发的方法
			4、deleteData：删除的操作
		*/ 
		handleCurrentChange(val) {
			var _this = this;
			_this.formOne.page = val;
			_this.formOne.star = (_this.formOne.page-1)*20;
			_this.formOne.end = _this.formOne.star+20;
		},
		getTableData() {
			var _this = this ;
			var url = baseConfig.server+baseConfig.requestUrl+'/Anchor/getArticle';
			var params = {};
			axios.get(url, { params: params })
			.then((res) => {
				if(res.data.ret) {
					_this.formOne.totalPage = res.data.data.length;
					_this.formOne.tabData = res.data.data;
				}
				else {
					baseConfig.errorTipMsg(_this, res.data.msg);
				}
			})
			.catch((err) => {
				console.log(err);
			})
		},
		changeData(row) {
			var _this = this;
			_this.formTwo.id = row.id;
			_this.formTwo.pic = row.image_url;
			_this.formTwo.title = row.title;
			_this.formTwo.content = row.content;
			_this.activeName = 'two';
		},
		deleteData(row) {
			var _this = this;
			var id = row.id;
			var url = baseConfig.server+baseConfig.requestUrl+'Anchor/delArticle';
			var params = {
				id: id,
			};
			axios.get(url, { params: params })
			.then((res) => {
				if(res.data.ret) {
					baseConfig.successTipMsg(_this, '删除成功~');
					setTimeout(function() {
						_this.getTableData();
					}, 1000);
				} 
				else {
					baseConfig.errorTipMsg(_this, res.data.msg);
				}
			})
			.catch((err) => {
				console.log(err);
			})
			allget(params, url).then(res => { 
				if(res.data.ret) {
					baseConfig.successTipMsg(_this, '删除成功');
					_this.getTableData();
				} else {
					baseConfig.errorTipMsg(_this, res.data.msg);
				}
			}).catch(function(error){
				console.log(error);
			})
		},
		/*
			第二屏的编辑修改的方法
			1、uploadingTwo：图片上传的工具
			2、TwoEditorReady：对应文章编辑的方法
			3、btnSureTwo：编辑修改确定发送
		*/ 
		uploadingTwo(event) {
			var _this = this;
			var windowURL = window.URL||window.webkitURL;
			_this.formTwo.file = event.target.files[0];
			_this.formTwo.pic = windowURL.createObjectURL(event.target.files[0]);
		},
		twoEditorChange({editor, html, text}) {
			var _this = this;
			console.log(_this.formTwo.content);
		},
		btnSureTwo() {
			console.log('确定进行发送~');
		},
		/*
			第三屏的文章新添的方法
			1、uploadingThree：图片上传的工具
			2、ThreeEditorReady：对应文章新添的方法
			3、btnSureThree：编辑新添确定发送
		*/ 
		uploadingThree(event) {
			var _this = this;
			var windowURL = window.URL||window.webkitURL;
			_this.formThree.file = event.target.files[0];
			_this.formThree.pic = windowURL.createObjectURL(event.target.files[0]);
		},
		threeEditorChange({editor, html, text}) {
			var _this = this;
			console.log(_this.formThree.content);
		},
		btnSureThree() {
			console.log('确定进行发送~');
		},
		/*
			在切换plane的时候处理
			编辑修改页面只能在首屏里面点击编辑进入，其它情况给上提示
		*/ 
		handleClick(tab, event) {
			var _this = this;
			if(tab.label=='编辑修改'&&_this.formTwo.id=='') {
				baseConfig.warningTipMsg(_this, '这里是编辑修改，请在文章管理选择文章编辑，正在跳转到文章管理~');
				setTimeout(function() {
					_this.activeName = 'one';
				}, 1000);
			}
			console.log(tab.label);
		},
	},
	mounted() {
		var _this = this;
		this.$nextTick(function() {
			_this.tabHeight = baseConfig.lineNumber(tabHeight);
			_this.tableHeight = baseConfig.lineNumber(tabPageHeight);
			_this.tabSearchHeight = baseConfig.lineNumber(tabSearchHeight);
			_this.getTableData();
			if(baseConfig.serverStatus==true) { _this.serverStatus = true; }
		})
	}
};
</script>

<style lang="css" scoped>
.el-tab-pane{
	width: 90%;
	padding-left: 5%;
	height: 800px;
	/* background: red; */
}
.quill-editor {
	width: 100%;
	height: 350px;
	/* background: green; */
}

</style>

<template>
	<!-- 跑马灯管理 -->
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
					<span>类型</span>
					<el-select v-model="formOne.type">
						<el-option label="运营公告" value="0"></el-option>
						<el-option label="表白" value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<span>状态</span>
					<el-select v-model="formOne.status">
						<el-option label="全部" value="0"></el-option>
						<el-option label="进行中" value="1"></el-option>
						<el-option label="已结束" value="2"></el-option>
					</el-select>
				</el-form-item>
                <el-form-item>
					<el-button type="primary" @click="dialogFormVisible=true;">新增公告</el-button>
					<el-button type="primary" @click="getTableData">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--用户的数据展示列表-->
		<template>
			<el-table ref="tableHeight" :data="tabData" border fit highlight-current-row v-loading="listLoading" style="width: 100%;" :height="tableHeight">
				<el-table-column prop="operate_time" label="操作时间" width="80" sortable ></el-table-column>
				<el-table-column prop="start_time" label="起始时间" width="80" sortable ></el-table-column>
				<el-table-column prop="end_time" label="结束时间" width="80" sortable ></el-table-column>
				<el-table-column prop="content" label="内容" min-width="300" sortable ></el-table-column>
				<el-table-column label="链接类型" width="150" sortable >
					<template slot-scope="scope">
						<div slot="reference" class="name-wrapper">
							<p v-if="scope.row.link_type==0">无跳转</p>
							<p v-else-if="scope.row.link_type==1">应用</p>
							<p v-else-if="scope.row.link_type==2">H5页面</p>
							<p v-else-if="scope.row.link_type==3">跳转外部浏览器打开</p>
							<p v-else-if="scope.row.link_type==4">跳转打电话界面</p>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="ios_link" label="IOS中的链接" width="200" sortable ></el-table-column>				
				<el-table-column prop="android_link" label="安卓中的链接" width="200" sortable ></el-table-column>				
				<el-table-column label="操作" width="100">
					<template slot-scope="scope">
						<el-button v-if="scope.row.status=='1'" plain size="small" @click.native.prevent="tipEnd()">已结束</el-button>
						<el-button v-else-if="scope.row.status=='0'" type="primary" @click.native.prevent="endSure(scope.$index, tabData)" size="small">结束</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!--工具条-->
			<el-col :span="24" class="toolbar">
				<el-pagination layout="total,prev,pager,next,jumper" @current-change="handleCurrentChange" :page-size="20" :total="totalpage" :current-page="page+1" style="float:right;"></el-pagination>
			</el-col>
		</template>
		<!-- 新增--对应的dialog -->
		<el-dialog title="新增公告" :visible.sync="dialogFormVisible">
			<el-form :model="formTwo">
				<el-form-item label="编辑公告概要" :label-width="formLabelWidth">
					<el-input type="textarea" :rows="2" :maxlength="50" v-model="formTwo.content" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="添加超链接" :label-width="formLabelWidth">
					<p style="font-weight: bold;">在发送文字正文中相应位置插入{messageDisplay}超链接才生效</p>
				</el-form-item>
				<el-form-item label="链接类型" :label-width="formLabelWidth">
					<el-select v-model="formTwo.link_type">
						<el-option label="无跳转" value="0"></el-option>
						<el-option label="应用" value="1"></el-option>
						<el-option label="H5页面" value="2"></el-option>
						<el-option label="跳转外部浏览器打开" value="3"></el-option>
						<el-option label="跳转打电话界面" value="4"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="IOS中的链接地址" :label-width="formLabelWidth">
					<el-input v-model="formTwo.ios_link" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="安卓中的链接地址" :label-width="formLabelWidth">
					<el-input v-model="formTwo.android_link" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="链接提示文字" :label-width="formLabelWidth">
					<el-input v-model="formTwo.display" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="轮播时间段" :label-width="formLabelWidth">
					<div class="block">
						<el-date-picker v-model="formTwo.choiceDate" type="datetimerange" range-separator=" 至 " start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
					</div>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addSure(0)">取 消</el-button>
				<el-button type="primary" @click="addSure(1)">确 定</el-button>
			</div>
		</el-dialog>
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
			operate_user: '', // 当前进入的用户
			// 搜索条件的组装字段
			formOne: {
				choiceDate: [new Date()-180*24*60*60*1000, new Date()], // 对应选择的日期,给默认时间180之前到现在
				type: '0', 
				status: '0',
			},
			formTwo: {
				choiceDate: [new Date(), new Date()],
				content: '',
				link_type: '0',
				ios_link: '',
				android_link: '',
				display: '',
			},
			listLoading: false, //动画加载时显示的动画
			tabData: [], //列表的所有数据，移除删除的功能用全部的数据进行移除
			totalpage: null, //下方工具条的总页数 
			page: 0, //现在数据展示的页数
			dialogFormVisible: false, // 控制dialog弹框的显示和隐藏
			formLabelWidth: '130px', // 设置dialog弹框的宽度
		};
	},
	methods: {
		// 下方页数进行翻页的页码时
		handleCurrentChange(val) {
			var _this = this;
			// val指的是当前点击是第一页
			_this.page = val-1;
			_this.getTableData();
		},
		// 搜索条件
		searchCondition() {
			var _this = this;
			var obj = {};
			obj.type = _this.formOne.type; // 给对象添加键值对
			obj.status = _this.formOne.status; // 给对象添加键值对
			obj.date_s = baseConfig.changeDateTime(_this.formOne.choiceDate[0], 0);
			obj.date_e = baseConfig.changeDateTime(_this.formOne.choiceDate[1], 0);
			// 对需要判断搜索值是否为空进行判断提示
			for(var key in obj) {
				if(obj[key]=='') {
					baseConfig.warningTipMsg(_this, '搜索条件值不能为空！');
					return null;
				}
			}
			obj.page = _this.page; // 在page==0，会进入搜索条件值为空的判断
			return obj; // return出组装好的搜索条件
		},
		// 确定了新增传递过来对应的内容值(val对应的值：0->取消，1->确认)
		addSure(val) {
			var _this = this;
			if(val==0) {
				// 点击了取消按钮
				_this.dialogFormVisible = false; // 点击了取消、确定按钮都要进行隐藏dialog框
				// console.log('点击了取消按钮');
			} else if(val==1) {
				// 点击了确认按钮
				// console.log('点击了确认按钮');
				_this.listLoading = true;
				// 进行添加的操作
				let formData = new FormData();
				formData.append('content', encodeURI(_this.formTwo.content));
				formData.append('link_type', _this.formTwo.link_type);
				formData.append('ios_link', _this.formTwo.ios_link);
				formData.append('android_link', _this.formTwo.android_link);
				formData.append('display', _this.formTwo.display);
				formData.append('start_time', baseConfig.changeDateTime(_this.formTwo.choiceDate[0], 1));
				formData.append('end_time', baseConfig.changeDateTime(_this.formTwo.choiceDate[1], 1));
				formData.append('operate_user', _this.operate_user);
				let config = {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				};
				if(formData.get('content')!=''&&formData.get('start_time')!=''&&formData.get('end_time')!='') {
					axios.post(baseConfig.server+baseConfig.requestUrl+'/Marquee/sendOperationMarquee', formData, config)
					.then((res) => {
						_this.listLoading = false;	
						_this.dialogFormVisible = false;								
						if(res.data.ret) {	
							baseConfig.successTipMsg(_this, '新增成功！');
							_this.getTableData();
						} else {
							baseConfig.errorTipMsg(_this, res.data.msg);						
						}
					}).catch((error) => {
						console.log(error);
					});
				} else {
					_this.listLoading = false; 
					baseConfig.warningTipMsg(_this, '新增的公告内容、轮播时间不能为空！');
				}
			} 
		},
		// 获取数据列表
		getTableData() {
			var _this = this ;
			_this.listLoading = true;
			var url = '/Marquee/getOperationMarquee';
			var params = _this.searchCondition();
			// 如果得到的搜索为null，表示存在搜索条件为空，不进行数据请求
			if(params==null) {
				// 不进行数据请求,直接关闭掉加载的图层
				_this.listLoading = false;
			} else {
				// 进行get请求，(请求参数params, 请求地址url)
				allget(params, url).then(res => {
					// 数据请求成功
					_this.listLoading = false;
					if(res.data.ret) {
						// 正常数据
						var thisDate = baseConfig.changeDateTime(new Date(), 1);
						for(var i=0; i<res.data.data.length; i++) { // 对数据进行处理
							res.data.data[i].content = decodeURI(res.data.data[i].content);
							// 进行状态值的判断
							if(res.data.data[i].status==0&&res.data.data[i].end_time<thisDate) {
								res.data.data[i].status = 1;
							} else {
								// 不进行数据的处理
							}
							// 将多有的标签的进行替换
							res.data.data[i].content = res.data.data[i].content.replace(/<font  color="#809ebd">/g, '');
							res.data.data[i].content = res.data.data[i].content.replace(/<font color="#809ebd">/g, '');
							res.data.data[i].content = res.data.data[i].content.replace(/<\/font>/g, '');
							res.data.data[i].content = res.data.data[i].content.replace(/<font  color="#ffffff">/g, '');
						}
						_this.totalpage = res.data.data.length;
						_this.tabData = res.data.data;
					} else {
						// 返回ret==0，非正常数据
						baseConfig.errorTipMsg(_this, res.data.msg);
					}
				}).catch(function(error){
					console.log(error);
				})
			}
		},
		// 只是提示已经结束了
		tipEnd() {
			var _this = this;
			baseConfig.warningTipMsg(_this, '早就已经结束了！');						
		},
		// 确定结束的方法
		endSure(index, rows) {
			var _this = this;
			var id = rows[index].id;
			var url = '/Marquee/killOperationMarquee';
			var params = {
				id: id,
			};
			allget(params, url).then(res => { // 进行get请求，(请求参数params, 请求地址url)
				// 数据请求成功
				if(res.data.ret) {
					baseConfig.successTipMsg(_this, '结束成功！');
					_this.getTableData();
				} else {
					baseConfig.errorTipMsg(_this, res.data.msg); // 返回ret==0，非正常数据
				}
			}).catch(function(error){
				baseConfig.errorTipMsg(_this, error);
			})
		},
	},
	mounted() {
		var _this = this;
		this.$nextTick(function() {
			_this.tableHeight = baseConfig.lineNumber(searchPageHeight);
			_this.getTableData();
			_this.operate_user = store.state.user.name; // 操作用户的昵称
		})
	}
};
</script>

<style lang="css" scoped>
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
</style>

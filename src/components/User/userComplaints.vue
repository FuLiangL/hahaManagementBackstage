<template>
<!-- dom结构内容 -->
	<section>
		<!--查询条件-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" style="overflow: hidden;" :model="filters">
				<el-form-item>
					<div class="block">
						<span class="registerTime">日期</span>
						<el-date-picker v-model="time_register" type="daterange" range-separator=" 至 " placeholder="选择日期范围"></el-date-picker>
                    </div>
				</el-form-item>
				<el-form-item>
					<span>投诉类型</span>
					<el-select style="width: 120px;" v-model="complaintype" filterable placeholder="请选择">
						<el-option label="全部" value=""></el-option>
						<el-option label="已忽略" value="1"></el-option>
						<el-option label="已警告" value="2"></el-option>
						<el-option label="已封号" value="3"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<span>投诉原因</span>
					<el-select style="width: 120px;" v-model="complaincause" filterable placeholder="请选择">
						<el-option label="全部" value="全部"></el-option>
						<el-option label="色情" value="色情"></el-option>
						<el-option label="欺诈" value="欺诈"></el-option>
						<el-option label="骚扰" value="骚扰"></el-option>
						<el-option label="垃圾广告" value="垃圾广告"></el-option>
						<el-option label="其他" value="其他"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-input style="width: 120px;" placeholder="请输入UID" icon="search" v-model="uid"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUser">查询</el-button>
					<el-button type="primary" v-on:click="handleDownload">导出</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--tablel列表-->
		<template>
			<el-table :data="pageTw" border fit highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;" :height="tableHeight" >
				<el-table-column type="index" width="70" ></el-table-column>
				<el-table-column prop="time" label="注册时间" width="110" sortable ></el-table-column>
				<!-- 可以进行点击的出现用户详情 -->
				<el-table-column label="UID" width="80" sortable>
					<template slot-scope="scope">
						<el-button type="primary" size="small" @click="showUserActivity(scope.$index, scope.row.uid)">{{scope.row.uid}}</el-button>
					</template>
				</el-table-column>
				<el-table-column label="被投诉人id" width="80" sortable>
					<template slot-scope="scope">
						<el-button type="primary" size="small" @click="showUserActivity(scope.$index, scope.row.complain_uid)">{{scope.row.complain_uid}}</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="num" label="投诉次数" width="80" sortable></el-table-column>
				<el-table-column prop="channel" label="被投诉人的渠道号" width="100" sortable></el-table-column>
				<el-table-column prop="content" label="投诉内容" min-width="120" sortable></el-table-column>
				<el-table-column prop="explains" label="投诉说明" min-width="120" sortable></el-table-column>
                <el-table-column label="投诉证据" min-width="120" sortable >
					<template slot-scope="scope">
						<el-popover trigger="hover" placement="left">
							<img v-for="(imgsrc, index) in scope.row.evidences" :key="index" :src="imgsrc" alt="" style="width:300px;height:300px;" />
							<div slot="reference" class="name-wrapper">
								<img v-for="(imgsrc, index) in scope.row.evidences" :key="index" :src="imgsrc" alt="" style="width:100px;height:100px;" />
							</div>
						</el-popover>
					</template>
				</el-table-column>
                <el-table-column prop="is_show" label="显示or不显示" min-width="70" sortable></el-table-column>
                <el-table-column prop="warn_num" label="被警告次数" min-width="120" sortable></el-table-column>
                <el-table-column label="操作" min-width="200" >
					<template slot-scope="scope">	
						<el-row :gutter="20">
							<div v-if="scope.row.status==0">
								<el-col :span="6"><el-button type="info" style="marginBottom:10px;" @click="userOperation(1,scope.row.uid)">忽略</el-button></el-col>
								<el-col :span="6"><el-button type="danger" style="marginBottom:10px;" @click="userOperation(2,scope.row.uid)">警告</el-button></el-col>
								<el-col :span="6"><el-button type="danger" style="marginBottom:10px;" @click="userOperation(3,scope.row.uid)">封号</el-button></el-col>
							</div>
							<div v-else-if="scope.row.status==1">
								<el-col :span="8"><el-button type="success" style="marginBottom:10px;">已忽略</el-button></el-col>
							</div>
							<div v-else-if="scope.row.status==2">
								<el-col :span="8"><el-button type="success" style="marginBottom:10px;">已警告</el-button></el-col>
							</div>
							<div v-else-if="scope.row.status==3">
								<el-col :span="8"><el-button type="success" style="marginBottom:10px;">已封号</el-button></el-col>
							</div>
						</el-row>
					</template>
				</el-table-column>
			</el-table>
			<!--工具条-->
			<el-col :span="24" class="toolbar">
				<el-pagination layout="total,prev, pager, next,jumper" @current-change="handleCurrentChange" :page-size="20" :total="totalpage" style="float:right;"></el-pagination>
			</el-col>
		</template>
	</section>
</template>

<script>
/* 逻辑交互js内容 */
import Event from './../../public_js/event.js';
import { allget } from '../../api/api';
import store from '../../vuex/store';
export default {
	data() {
		return {
			tableHeight: null, // table展示的页面的高度多少
			filters: {
				name: ''
			},
			users:[],
			userinfo:[],
			chartLine: null,
			totalpage:null,
			page: 0,
			listLoading: false,
			time_register:[new Date()-180*24*60*60*1000,new Date()],
			time_land:[new Date()-180*24*60*60*1000,new Date()],
			complaintype:"",
			complaincause:"",
			uid:null,
			bigpic:"",
			ishow:true,
			dialogVisible: false,
			isgetuser:false,
			visible2: false,
			star:"0",
			end:'20',
			sels: [],//列表选中列
		}
	},
	computed:{
		pageTw(){
			return this.users.slice(this.star,this.end)
		}
	},
	methods: {
		//用户操作type(1.忽略2.警告3.封号)
		userOperation(type, uid){
			
		},
		//页面的页数
		handleCurrentChange(val) {
			console.log(val);
			this.page = val;
			this.star = this.page*20-20;
			this.end = this.star+20;
		},
		// 时间格式化
		YMDdata(data){
			let date = new Date(data);
			let yy = date.getFullYear();
			let mm = (date.getMonth() + 1).toString();
			let dd = (date.getDate()).toString();
			// let time = date.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
			mm<10?mm="0"+mm:mm;
			dd<10?dd="0"+dd:dd;
			return yy+'-'+mm+'-'+dd
		},
		//获取用户列表
		getUser() {
			let _this = this ;
			_this.listLoading = true;
			let url = '/User/getComplain';
			let data ={
				date_s:this.YMDdata(this.time_register[0]),
				date_e:this.YMDdata(this.time_register[1]),
			}
			//判断是否输入uid查找
			this.uid==null||this.uid=="" ? delete data.find : (delete data.date_s, delete data.date_e, data.find=this.uid);
			//判断是否输入complaintype查找
			this.complaintype==null||this.complaintype=="" ? delete data.status : data.status=this.complaintype;
			//判断是否输入complaincause查找
			this.complaincause==null||this.complaincause=="" ? delete data.content : data.content=this.complaincause;
			//console.log(data);
			//进行get请求，输入请求参数(data)、请求地址(url)
			allget(data, url).then(data => {
				_this.listLoading = false; // 请求回来了数据进行设置为加载的小圈圈false
				// console.log('获取用户信息');
				_this.totalpage = data.data.data.length;
				//图像地址的获取方式
				var arrData = data.data.data;
				for(var i=0; i<arrData.length; i++){
					try{
						var arrImgs = JSON.parse(arrData[i].evidences);
						arrData[i].evidences = arrImgs;
					}catch(e){
						//console.log(e);
					}
				}
				_this.users = arrData;
				
			}).catch(function(err){
				console.log(err);
			});
		},
		// 第二种导出方式
		handleDownload() {
			require.ensure([], () => {
			const { export_json_to_excel } = require('../vendor/Export2Excel');
			const tHeader = ['注册时间','投诉人id','被投诉人id','投诉次数','被投诉人的渠道号','投诉内容','被警告次数','投诉说明'];
			const filterVal = ['time','uid','complain_uid','num','channel','content','warn_num','explains'];
			const data = this.formatJson(filterVal, this.users);
			export_json_to_excel(tHeader, data, '用户投诉处理详情');
			})
		},
		// 导出的一部分东西
		formatJson(filterVal, jsonData) {
			return jsonData.map(v => filterVal.map(j => {
			if (j === 'timestamp') {
				return parseTime(v[j])
			} else {
				return v[j]
			}
			}))
		},
		// 时间
		time:function(row, column){
			let dd = parseInt(row.ACCU / 60 / 60 / 24);
			let hh = parseInt(row.ACCU / 60 / 60 % 24);
			let mi = parseInt(row.ACCU / 60 % 60);
			let ss = parseInt(row.ACCU % 60);
			return dd + '天' + hh + '时' + mi + '分' + ss + '秒';
		},
		selsChange: function (sels) {
			this.sels = sels;
		},
		// 点击用户的uid弹窗展示
		showUserActivity(index, content) {
			// index为当前table中的这个tr在table中index
			// content将相应整个内容，全部传了过来
			var _this = this;
			// 利用空实例进行触发展示,将uid->value作为对象的键值对传递
			// console.log('进行了触发');
			Event.$emit('show-one-user', {
				uid : content,
			});
		},
	},
	mounted() {
		var _this = this;
		_this.$nextTick(function(){
			_this.getUser();
			// 进行高度自适应
			_this.tableHeight = baseConfig.lineNumber(searchPageHeight);
		})
	}
};
</script>

<style >
/* 页面样式css内容 */
.bg-purple {
    background: #c0d9f5;
}
.grid-content {
    border-radius: 4px;
    height: 36px;
	margin-bottom: 5px;
	line-height: 36px;
	text-align: center;
}
.photo_close {
	display: block;
	position: relative;
	width: 20px;
	height: 20px;
	border-radius: 50% !important;
	background-color: #ff5353;
	text-align: center;
	line-height: 20px;
	color: #fff;
    right: -190px;
    top: 7px;
	cursor: pointer;
	z-index: 5;
} 	
</style>

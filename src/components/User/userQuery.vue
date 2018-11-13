<template>
<!-- dom结构内容 -->
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" style="overflow: hidden;" :model="filters">
				<el-form-item>
					<div class="block">
                      	<span class="registerTime">注册时间</span>
                      	<el-date-picker v-model="time_register" type="daterange" range-separator=" 至 " placeholder="选择日期范围"></el-date-picker>
                    </div>
				</el-form-item>
				<el-form-item>
					<div class="block">
                      	<span class="landTime">登录时间</span>
                      	<el-date-picker v-model="time_land" type="daterange" range-separator=" 至 " placeholder="选择日期范围"></el-date-picker>
                    </div>
				</el-form-item>
				<el-form-item>	
					<el-select style="width: 120px;" v-model="value" filterable placeholder="渠道号">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-input style="width: 120px;" placeholder="请输入UID" icon="search" v-model="uid"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="page=0,getUser()">查询</el-button>
					<el-button type="primary" v-on:click="handleDownload">导出</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--用户详情的弹出框  -->
		<el-dialog title="用户详情" :visible.sync="dialogVisible" size="large">
			<el-row  v-loading="isgetuser" element-loading-text="拼命加载中" :gutter="20">
				<el-col :span="12">头像<div class="bg-purple" ></div>
					<div style="width:220px;height:220px;margin:auto">
						<span class="photo_close" @click="deleteAll(2,userinfo.uid)">x</span>					
						<img style="width:200px;height:200px;" :src="userinfo.icon" alt="" >
					</div> 
				</el-col>
				<el-col :span="6"><div class="grid-content bg-purple">用户uid：{{userinfo.uid}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">昵称：{{userinfo.nickname}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">手机号码：{{userinfo.phone}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">微信号：{{userinfo.unionid}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">用户地址：{{userinfo.address}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">性别：{{userinfo.sex}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">生日：{{userinfo.birthday}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">实名认证状态：{{userinfo.realname_aut_status}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">评价分数：{{userinfo.evaluate_score}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">魅力值：{{userinfo.charm_score}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">聊票：{{userinfo.volumes}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">聊币：{{userinfo.chat_gold}}</div></el-col>
				<el-col :span="12" style="height:50px">
					<div class="grid-content " style="height:50px;float:left">
						<audio :src="userinfo.voice_signature" controls="controls" preload="none"></audio>
					</div>
					<el-button type="primary" size="mini" icon="close" v-if="userinfo.voice_signature!=null" @click="deleteAll(3,userinfo.uid)"></el-button>
				</el-col>	
				<el-col :span="6"><div class="grid-content bg-purple">累计充值金额：{{userinfo.money}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">渠道：{{userinfo.channel}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">通话定价：{{userinfo.price}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">个性签名：{{userinfo.signature}}</div></el-col>
				<el-col :span="12" style="height:350px">相册：
					<div class="grid-content" style="overflow:auto;height:350px">
						<el-col :span="6" v-for="(o, index) in allimg" :key="o" style="float:left;margin: 2px 0;">
							<el-card :body-style="{ padding: '0px' }">
							<img :src="o" class="image" style="width:110px;height:110px;">
							<div style="padding: 0px;">															
								<el-button type="text" class="button" @click="deleteAll(1,userinfo.uid,index)">删除</el-button>
							</div>
							</el-card>	
						</el-col>
					</div>
				</el-col>
				<el-col :span="6"><div class="grid-content bg-purple">注册时间：{{userinfo.addtime}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">最后登录时间：{{userinfo.lasttime}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">职业：{{userinfo.occupation}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">收到的礼物数：{{userinfo.gift}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">累积通话时长：{{userinfo.accumulate_time}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">随机通话时间：{{userinfo.totalrandtime}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">随机通话次数：{{userinfo.totalrandcall}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">网红通话次数：{{userinfo.totalredcall}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">网红通话时间：{{userinfo.totalredtime}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">好友数：{{userinfo.friend}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">好友通话次数：{{userinfo.totalfriendcall}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">好友通话时间：{{userinfo.totalfriendtime}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">偷听次数：{{userinfo.totallistencall}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">偷听时间：{{userinfo.totallistentime}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">用户版本：{{userinfo.version_name}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">账号状态：{{userinfo.status}}</div></el-col>
			</el-row>
		</el-dialog>
		<!--用户的数据展示列表-->
		<template>
			<el-table :data="users" border fit highlight-current-row v-loading="listLoading"  style="width: 100%;" :height="tableHeight" >
				<el-table-column type="index" width="70" ></el-table-column>
				<el-table-column prop="addtime" label="注册时间" width="110" sortable ></el-table-column>
				<el-table-column prop="channel" label="渠道" width="100" sortable></el-table-column>
				<!-- 可以进行点击的出现用户详情 -->
				<el-table-column label="UID" width="80" sortable>
					<template slot-scope="scope">
						<el-button type="primary" size="small" @click="showUserActivity(scope.$index, scope.row.uid)">{{scope.row.uid}}</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="nickname" label="昵称" width="100" sortable></el-table-column>
				<el-table-column prop="phone" label="手机号码" min-width="120" sortable></el-table-column>
                <el-table-column  label="用户头像" min-width="120" sortable >
					<template slot-scope="scope">
						<el-popover trigger="hover" placement="left">
							<img :src="scope.row.icon" alt="" style="width:300px;height:300px;">
							<div slot="reference" class="name-wrapper">
								<img :src="scope.row.icon" alt="" style="width:100px;height:100px;">
							</div>
						</el-popover>
					</template>
				</el-table-column>
                <el-table-column prop="sex" :formatter="sex" label="性别" min-width="50" sortable></el-table-column>
                <el-table-column prop="address" label="城市" min-width="70" sortable></el-table-column>
                <el-table-column prop="lasttime" label="最近登录时间" min-width="120" sortable></el-table-column>
                <el-table-column prop="status" label="状态" :formatter="status" min-width="70" sortable></el-table-column>
                <el-table-column label="操作" min-width="270" >
					<template slot-scope="scope">	
						<el-row :gutter="20">
							<el-col :span="6"><el-button type="info" style="marginBottom:10px;" @click="getuserinfo(scope.row.uid)" >用户详情</el-button></el-col>
							<div v-if="scope.row.status==0">
								<el-col :span="4"><el-button type="danger" style="marginBottom:10px;" @click="userOperation(1,scope.row.uid)">封号</el-button></el-col>
							</div>
							<div v-else-if="scope.row.status==1">
								<el-col :span="4"><el-button type="danger" style="marginBottom:10px;" @click="userOperation(2,scope.row.uid)">解封</el-button></el-col>
							</div>
							<el-col :span="5"><el-button type="danger" style="marginBottom:10px;" @click="userOperation(3,scope.row.uid)">踢下线</el-button></el-col>
							<div v-if="scope.row.is_up_list==0">
								<el-col :span="4"><el-button type="warning" style="marginBottom:10px;" @click="userOperation(4,scope.row.uid)">上榜</el-button></el-col>
							</div>
							<div v-else-if="scope.row.is_up_list==1">
								<el-col :span="4"><el-button type="danger" style="marginBottom:10px;" @click="userOperation(5,scope.row.uid)">下榜</el-button></el-col>
							</div>
						</el-row>
					</template>
				</el-table-column>
			</el-table>
			<!--工具条-->
			<el-col :span="24" class="toolbar">
				<el-pagination layout="total,prev, pager, next,jumper" @current-change="handleCurrentChange" :page-size="20" :total="totalpage" :current-page="page+1" style="float:right; ">
				</el-pagination>
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
			options:[],
			value:"",
			uid:null,
			bigpic:"",
			ishow:true,
			dialogVisible: false,
			isgetuser:false,
			visible2: false,
		}
	},
	computed:{
		allimg(){
			return this.userinfo.photo_wall
		}
	},
	methods: {
		// 删除整合(type ==1 删除图片 type==2删除音频个性签名)
		deleteAll(type,uid,num){
			let _this =this,url,data;
			if (type==1) {
				url = '/User/delUserPhotoWall';// 删除图片
				data ={uid:uid,num:num};
			} else if(type==2){
				url = '/User/delUserIcon';// 删除用户头像
				data ={uid:uid};	
			} else if(type==3){
				url = '/User/delUserVoiceSignature';// 删除用户音频
				data ={uid:uid,voice_signature:''};	
			}
			//console.log(url);
			// console.log(type)
			this.isgetuser=true;
			this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				console.log(uid,num);
				allget(data, url).then(data => {
					if (data.data.ret) {
						this.userinfo = data.data.data[0];
						this.dialogVisible = true;

						this.$message({
							type: 'success',
							message: '删除成功!'
						});
						_this.getuserinfo(uid)
						this.isgetuser=false;
					} else {
						this.$notify.error({
								title: '错误',
								message: res.data.msg,
								duration: 1000,
								offset: 100
							}); 
						this.isgetuser=false;
					}
				}).catch(function(err){
					console.log(err);
					_this.isgetuser=false;
					_this.$notify.error({
						title: '错误',
						message: '遇到了未知的问题请联系管理员解决',
						duration: 0
					});
				});
			}).catch(() => {
				
				this.$message({
					type: 'info',
					message: '已取消删除'
				});          
			});
			this.isgetuser=false;
		},
		//用户操作
		userOperation(type,uid){
			// console.log(type);
			let _this =this,url,data;
			if (type==1) {
				url = '/User/kickUser';// 封号
				data ={uid:uid,operate_user:store.getters.name};
			} else if(type==2){
				url = '/User/freeUser';// 解封
				data ={uid:uid};	
			} else if(type==3){
				url = '/User/delUserVoiceSignature';// 踢下线
				data ={uid:uid,operate_user:store.getters.name};	
			} else if(type==4) {
				url = '/User/delUserIcon';// 上榜
				data ={uid:uid};	
			} else if(type==5){
				url = '/User/delUserIcon';// 下榜
				data ={uid:uid};
			}
			this.$prompt('请输入原因', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputPattern: /[^x00-xff]/ ,
				inputErrorMessage: '不能为空,或外文'
			}).then(({ value }) => {
				data.reason=value
				console.log(url,data,index);
				// 测试使用
				// type==1?_this.users[index].status="1":type==2?_this.users[index].status="0":_this.users[index].status="3"
				// allget(data, url).then(data => {
				// 	if (data.data.ret) {
				// 		this.userinfo = data.data.data[0];
				// 		this.dialogVisible = true;
				// 		this.$message({
				// 			type: 'success',
				// 			message: '删除成功!'
				// 		});
				// 		_this.getuserinfo(uid)
				// 		this.isgetuser=false;
				// 	} else {
				// 		this.$notify.error({
				//                 title: '错误',
				//                 message: res.data.msg,
				//                 duration: 1000,
				//                 offset: 100
				// 			}); 
				// 		this.isgetuser=false;
				// 	}
				// }).catch(function(err){
				// 	console.log(err);
				// 	_this.isgetuser=false;
				// 	_this.$notify.error({
				// 		title: '错误',
				// 		message: '遇到了未知的问题请联系管理员解决',
				// 		duration: 0
				// 	});
				// });
				this.$message({
					type: 'success',
					message: '你的邮箱是: ' + value
				});
			}).catch((e) => {
				console.log(e);
				this.$message({
					type: 'info',
					message: '取消输入'
				});       
			});
		},
		//性别显示转换
		formatSex(row, column) {
			return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
		},
		//页面的页数
		handleCurrentChange(val) {
			//服务器的第一页是0 所以 这里要 -1
			this.page = val-1;
			this.getUser();
			// console.log(val,this.page);
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
			this.listLoading = true;
			let url = '/User/getUser';
			let data ={
				page:this.page,
				date_s:this.YMDdata(this.time_register[0]),
				date_e:this.YMDdata(this.time_register[1]),
			}
			this.uid==null||this.uid==""?delete data.find:(delete data.date_s, delete data.date_e, data.find=this.uid);
			this.value==null||this.value==""?delete data.channel:data.channel=this.value;
			allget(data, url).then(data => {
				// console.log(data);
				// console.log('获取用户信息');
				_this.totalpage = 1000;
				_this.users = data.data.data;
				
			}).catch(function(err){
				console.log(err);
			});
			// console.log(data);
			this.listLoading = false;
		},
		//获取单个用户的信息 
		getuserinfo(uid){
			let _this =this;
			// console.log(uid);
			this.isgetuser=true;
			let url = '/User/getUserInfo';// /User/getUserInfo
			let data ={
				uid:uid
			}
			allget(data, url).then(data => {
				if (data.data.ret) {
					this.userinfo = data.data.data[0];
					this.dialogVisible = true;
					this.isgetuser=false;
				} else {
					this.$notify.error({
							title: '错误',
							message: res.data.msg,
							duration: 1000,
							offset: 100
						}); 
					this.isgetuser=false;
				}
			}).catch(function(err){
				console.log(err);
				_this.isgetuser=false;
				_this.$notify.error({
					title: '错误',
					message: '遇到了未知的问题请联系管理员解决',
					duration: 0
				});
			});
			
		},
		// 渠道数组
		arrychannel(){
			let _this = this;
			let channelid = store.getters.channelid.split(',');
			let channelname = store.getters.channelname.split(',');
			/*
				设置可以输入搜索
				_this.options.push({
					value: "",
					label: '可以输入搜索'
				})
			*/ 
			channelid.forEach(function(val,index){
				_this.options.push({
					value:channelid[index],
					label:channelname[index]
				})
			})
		},
		// 第二种导出方式
		handleDownload() {
			require.ensure([], () => {
			const { export_json_to_excel } = require('../vendor/Export2Excel');
			const tHeader = ['注册时间','渠道','UID','昵称','手机号码','性别','城市','最近登录时间','状态'];
			const filterVal = ['addtime','channel','uid','nickname','phone','sex','address','lasttime','status'];
			const data = this.formatJson(filterVal, this.users);
			export_json_to_excel(tHeader, data, '用户查询资料');
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
		time(row, column){
			let dd = parseInt(row.ACCU / 60 / 60 / 24);
			let hh = parseInt(row.ACCU / 60 / 60 % 24);
			let mi = parseInt(row.ACCU / 60 % 60);
			let ss = parseInt(row.ACCU % 60);
			return dd + '天' + hh + '时' + mi + '分' + ss + '秒';
		},
		// 性别转换
		sex(row){
			return row.sex==1 ? '男' : '女';
		},
		//状态的转换
		status(row){
			return row.status==0 ? '正常' : row.status==1 ? '已提下线' : '封号中';
		},
		// 过滤器
		rate(row, column){
			let rate = '1'+':'+row.man_woman_rate;
			return rate;
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
			_this.arrychannel();
			// 进行高度自适应
			_this.tableHeight = baseConfig.lineNumber(searchPageHeight);
		})
	}
};
</script>

<style>
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

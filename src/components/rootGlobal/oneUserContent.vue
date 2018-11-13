<template>
<!-- dom结构内容 -->
	<section>
		<!--用户详情的弹出框  -->
		<el-dialog title="用户详情" :visible.sync="dialogVisible" size="large">
			<el-row  v-loading="isgetuser" element-loading-text="拼命加载中" :gutter="20">
				<el-col :span="24" v-if="userinfo.photo_wall" style="height: auto; background: red;">
					相册：
					<div class="grid-content" style="overflow: auto;height: auto;">
						<el-col :span="4" v-for="(o, index) in allimg" :key="o" style="float: left; margin:2px 0;">
							<el-card :body-style="{ padding: '0px' }">
							<img :src="o" class="image" style="width: 110px; height: 110px;">
							<div style="padding: 0px;">							
								<el-button type="text" class="button" @click="deleteAll(1,userinfo.uid,index)">删除</el-button>
							</div>
							</el-card>
						</el-col>
					</div>
				</el-col>
				<el-col :span="24" style="height: auto; background: pink;">
					录音签名、录音库：
					<div class="grid-content" style="overflow: auto;height: auto;">
						<!-- 录音签名 -->
						<el-col :span="12" style="float: left; margin:2px 0;">
							<el-card :body-style="{ padding: '0px' }">
							<div class="grid-content" style="height: 50px; float: left;">
								<audio :src="userinfo.voice_signature" controls="controls" preload="none"></audio>
							</div>
							<el-button type="primary" size="mini" icon="close" @click="deleteAll(3,userinfo.uid, index)">删除签名录音</el-button>
							</el-card>
						</el-col>
						<!-- 录音库里面的内容 -->
						<el-col :span="6" v-for="(item, index) in allVoiceData" :key="index" style="float: left; margin:2px 0;">
							<el-card :body-style="{ padding: '0px' }">
							<div class="grid-content" style="height: 50px; float: left;">
								<audio :src="item.voice_url" controls="controls" preload="none"></audio>
							</div>
							<el-button type="primary" size="mini" icon="close" @click="deleteAll(3,userinfo.uid, index)">删除录音</el-button>
							</el-card>
						</el-col>
					</div>
				</el-col>
				<el-col :span="12" style="height: auto; background: blue;">
					头像
					<div class="bg-purple" ></div>
					<div style="width: 220px; height: 220px; margin: auto;">
						<span class="photo_close" @click="deleteAll(2,userinfo.uid)">x</span>					
						<img style="width: 200px; height: 200px;" :src="userinfo.icon" alt="" >
					</div> 
				</el-col>
				<el-col :span="6"><div class="grid-content bg-purple">uid：{{userinfo.uid}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">昵称：{{userinfo.nickname}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">微信账号：{{userinfo.unionid}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">手机号码：{{userinfo.phone}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">生日：{{userinfo.birthday}}</div></el-col>
				<el-col :span="6">
					<div class="grid-content bg-purple" v-if="userinfo.sex==1">性别：男</div>
					<div class="grid-content bg-purple" v-else-if="userinfo.sex==2">性别：女</div>
				</el-col>
				<el-col :span="6"><div class="grid-content bg-purple">城市：{{userinfo.city}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">渠道：{{userinfo.annotation}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">vip等级：{{userinfo.vip_level}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">注册时间：{{userinfo.addtime}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">最后登录时间：{{userinfo.lasttime}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">IP地址：{{userinfo.ip}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">累积通话时长：{{userinfo.accumulate_time}}</div></el-col>
				<el-col :span="6">
					<div class="grid-content bg-purple">账号状态：{{userinfo.status}}</div>
				</el-col>
				<el-col :span="6">
					<div class="grid-content bg-purple">在线状态：{{userinfo.is_online}}</div>
				</el-col>
				<el-col :span="6"><div class="grid-content bg-purple">备注：{{userinfo.remarks}}</div></el-col>				
				<el-col :span="6">
					<div class="grid-content bg-purple">认证状态：{{userinfo.realname_aut_status}}</div>
				</el-col>
				<el-col :span="6"><div class="grid-content bg-purple">好评分：{{userinfo.evaluate_score}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">魅力值：{{userinfo.charm_score}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">签名：{{userinfo.signature}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">标签：{{userinfo.labels}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">职业：{{userinfo.occupation}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">版本号：{{userinfo.version_name}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">聊币：{{userinfo.chat_gold}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">聊票：{{userinfo.chat_ticket}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">累积充值：{{userinfo.pay_num}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">通话价格：{{userinfo.price}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">累积消耗聊币：{{userinfo.out_chat_gold}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">累积消耗聊票：{{userinfo.out_chat_ticket}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">认证姓名：{{userinfo.name}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">身份证号码：{{userinfo.identity_card}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">支付宝账号：{{userinfo.pay_account}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">家族名称：{{userinfo.family_name}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">关注数：{{userinfo.follow}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">粉丝数：{{userinfo.fans}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">好友数：{{userinfo.friend}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">礼物数：{{userinfo.gift_num}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">累积提现：{{userinfo.cash}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">随机次数：{{userinfo.totalrandcall}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">随机时长：{{userinfo.totalrandtime}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">好友次数：{{userinfo.totalfriendcall}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">好友时长：{{userinfo.totalfriendtime}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">网红次数：{{userinfo.totalredcall}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">网红时长：{{userinfo.totalredtime}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">偷听次数：{{userinfo.totallistencall}}</div></el-col>
				<el-col :span="6"><div class="grid-content bg-purple">偷听时长：{{userinfo.totallistentime}}</div></el-col>
			</el-row>
		</el-dialog>
	</section>
</template>

<script>
/* 逻辑交互js内容 */
import Event from '../../public_js/event.js';
import { allget } from '../../api/api';
import store from '../../vuex/store';
export default {
	data() {
		return {
			userinfo: [], //用户信息的数据
			dialogVisible: false, //控制弹窗的显示隐藏
			isgetuser: false, //是否获得用户信息的数据
		}
    },
	computed:{
		allimg() {
			var _this = this;
			return _this.userinfo.photo_wall;
		},	
		allVoiceData() {
			var _this = this;
			return _this.userinfo.voice_data;
		},
	},
	methods: {
		// 获取单个用户的信息 
		getuserinfo(uid){
			let _this =this;
			_this.listLoading = true;
			_this.isgetuser = true;
			let url = '/NewUser/getUserInfo';// /User/getUserInfo
			let data ={ uid: uid, };
			allget(data, url).then(data => {
				// console.log(data.data);
				// console.log(data.data.data[0].photo_wall)
				if (data.data.ret) {
					_this.userinfo = data.data.data[0];
					_this.dialogVisible = true;
					_this.isgetuser = false;
				} else {
					baseConfig.normalTipMsg(_this, data.data.msg);
					_this.isgetuser=false;
				}
			}).catch(function(err){
				console.log(err);
			});
			
		},
    },
	mounted() {
        var _this = this;
        // 在个人信息展示组件，mounted的方法中监听是否点击弹窗用户详情的信息
        Event.$on('show-one-user', function(obj){
            // console.log('监听到了'+obj.uid);   
            // 监听展示事件，进行状态设置为true，然后拉取出用户的个人数据
			// _this.dialogVisible = true;
            _this.getuserinfo(obj.uid);
        });
	},
};
</script>

<style>
/* 页面样式css内容 */
	
</style>

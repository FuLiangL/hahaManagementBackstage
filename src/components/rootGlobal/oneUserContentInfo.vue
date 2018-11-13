<template>
    <section>
        <el-dialog class="content" center  :visible.sync="dialogVisible" size="large" width="70%">
            <el-row v-loading="isgetuser" element-loading-text="拼命加载中" style="over-flow:hidden;">
                <el-col :span="10" style="height: 100%;">
                    <div class="grid-content grid-content-first bg-purple">
                        <div>
                            <h4>头像</h4>
                            <div class="uer_avator">
                                <el-popover trigger="click" placement="left">
                                    <img :src="userinfo.icon" alt="" style="width:350px;height:350px;">
                                    <div slot="reference" class="name-wrapper">
                                        <img :src="userinfo.icon" alt="" style="width:240px;height:240px;">
                                    </div>
                                </el-popover>
                                <div style="padding: 0px;display: inline-block;">
                                    <el-button type="text" class="button" @click="deleteUsericon()" size="mini">删除</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="14">
                    <div class="grid-content grid-content-first bg-purple-light" style="margin-left: 10px;">
                        <div>
                            <h4>基本资料</h4>
                            <div class="user-info-detail">
                                <el-col :span="12" class="grid-info"><div>uid：<span>{{userinfo.uid}}</span></div></el-col>
                                <el-col :span="12" class="grid-info">
                                    <div>
                                        <!-- <span>{{userinfo.nickname}}</span> -->
                                        <div style="display:inline-block;">昵称：</div>
                                        <el-input v-model="userinfo.nickname" @focus="judgeChange(0)" @blur="judgeChangeNickname" style="width:200px;"></el-input>
                                        <p style="margin: 0;font-size:12px;height:20px;color:red;"># 输入完成后，点击输入框外即可完成修改！</p>
                                    </div>
                                </el-col>
                                <el-col :span="12" class="grid-info" v-if="userinfo.unionid"><div>微信账号：<span>{{userinfo.unionid}}</span></div></el-col>
                                <el-col :span="12" class="grid-info" v-if="userinfo.phone"><div>手机号码：<span>{{userinfo.phone}}</span></div></el-col>
                                <el-col :span="12" class="grid-info" v-if="userinfo.birthday"><div>生日：<span>{{userinfo.birthday}}</span></div></el-col>
                                <el-col :span="12" class="grid-info">
                                    <div v-if="userinfo.sex==1">性别：<span>男</span></div>
                                    <div v-if="userinfo.sex==2">性别：<span>女</span></div>
                                </el-col>
                                <el-col :span="12" class="grid-info" v-if="userinfo.city"><div>城市：<span>{{userinfo.city}}</span></div></el-col>
                                <el-col :span="12" class="grid-info"><div>等级：<span>{{userinfo.level}}</span></div></el-col>
                                <el-col :span="12" class="grid-info"><div>渠道：<span>{{userinfo.annotation}}</span></div></el-col>
                                <el-col :span="12" class="grid-info"><div>vip等级：<span>{{userinfo.vip_level}}</span></div></el-col>
                                <el-col :span="12" class="grid-info"><div>注册时间：<span>{{userinfo.addtime}}</span></div></el-col>
                                <el-col :span="12" class="grid-info"><div>最后登录时间：<span>{{userinfo.lasttime}}</span></div></el-col>
                                <el-col :span="12" class="grid-info"><div>最后登录IP地址：<span>{{userinfo.ip}}</span></div></el-col>
                                <el-col :span="12" class="grid-info">
                                    <div v-if="userinfo.status==-1">账号状态：<span>封号</span></div>
                                    <div v-else-if="userinfo.status==0">账号状态：<span>正常</span></div>
                                    <div v-else-if="userinfo.status==-2">账号状态：<span>踢下线</span></div>
                                </el-col>
                                <el-col :span="12" class="grid-info">
                                    <div v-if="userinfo.is_online==1">在线状态：<span>在线</span></div>
                                    <div v-else-if="userinfo.is_online==0">在线状态：<span>离线</span></div>
                                </el-col>
                                <el-col :span="24" class="grid-info" v-if="userinfo.remarks"><div>备注：<span>{{userinfo.remarks}}</span></div></el-col>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-row v-loading="isgetuser" element-loading-text="拼命加载中" style="over-flow:hidden;">
                <el-col :span="10" style="height: 100%;">
                    <div class="grid-content bg-purple grid-content-second">
                        <div>
                            <h4>相册</h4>
                            <div class="uer_container">
                                <div class="user-photo"  v-for="(o, index) in userinfo.photo_wall" :key="o" style="">
                                    <el-popover trigger="click" placement="left">
                                        <img :src="o" alt="" style="width:300px;height:300px;">
                                        <div slot="reference" class="name-wrapper">
                                            <img :src="o" alt="" style="width:100px;height:100px;">
                                        </div>
                                    </el-popover>
                                    <div style="padding: 0px;display: inline-block;">
                                        <el-button type="text" class="button" @click="deletePhoto(userinfo.uid,index)" size="mini">删除</el-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="14">
                    <div class="grid-content bg-purple-light grid-content-second" style="margin-left: 10px;">
                        <div>
                            <h4>详细资料</h4>
                            <div class="user-info-detail">
                                <el-col :span="12" class="grid-info">
                                    <div v-if="userinfo.realname_aut_status==0">认证状态：<span>未认证</span></div>
                                    <div v-else-if="userinfo.realname_aut_status==1">认证状态：<span>认证中</span></div>
                                    <div v-else-if="userinfo.realname_aut_status==2">认证状态：<span>认证成功</span></div>
                                    <div v-else-if="userinfo.realname_aut_status==3">认证状态：<span>未认失败</span></div>
                                </el-col>
                                <el-col :span="12" class="grid-info" v-if="userinfo.name"><div>认证姓名：<span>{{userinfo.name}}</span></div></el-col>
                                <el-col :span="12" class="grid-info" v-if="userinfo.identity_card"><div>身份证号码：<span class="size">{{userinfo.identity_card}}</span></div></el-col>
                                <el-col :span="12" class="grid-info" v-if="userinfo.pay_account"><div>支付宝账号：<span>{{userinfo.pay_account}}</span></div></el-col>
                                <el-col :span="12" class="grid-info" v-if="userinfo.family_name"><div>家族名称：<span>{{userinfo.family_name}}</span></div></el-col>
                                <el-col :span="12" class="grid-info"><div>好评分：<span>{{userinfo.evaluate_score}}</span></div></el-col>
                                <el-col :span="12" class="grid-info"><div>魅力值等级：<span>{{userinfo.charm_level}}</span></div></el-col>
                                <el-col :span="12" class="grid-info"><div>财富值等级：<span>{{userinfo.money_level}}</span></div></el-col>
                                <el-col :span="12" class="grid-info"><div>魅力值:<span>{{userinfo.charm_score}}</span></div></el-col>
                                <el-col :span="12" class="grid-info"><div>粉丝数：<span>{{userinfo.fans}}</span></div></el-col>
                                <el-col :span="12" class="grid-info"><div>关注数：<span>{{userinfo.follow}}</span></div></el-col>
                                <el-col :span="12" class="grid-info"><div>好友数：<span>{{userinfo.friend}}</span></div></el-col>
                                <el-col :span="12" class="grid-info"><div>收到礼物数：<span>{{userinfo.gift_num}}</span></div></el-col>
                                <el-col :span="12" class="grid-info" v-if="userinfo.occupation"><div>职业：<span>{{userinfo.occupation}}</span></div></el-col>
                                <el-col :span="12" class="grid-info"><div>当前版本：<span>{{userinfo.version_name}}</span></div></el-col>
                                <el-col :span="24" class="grid-info">
                                    <div>
                                        <!-- <span class="txt-size">{{userinfo.signature}}</span> -->
                                        <div style="display:inline-block;">个性签名:</div>
                                        <el-input v-model="userinfo.signature" @focus="judgeChange(1)" @blur="judgeChangeSignature" style="width:450px;"></el-input>
                                        <p style="margin: 0;font-size:12px;height:20px;color:red;"># 输入完成后，点击输入框外即可完成修改！</p>
                                    </div>
                                </el-col>
                                <el-col :span="24" class="grid-info"><div>标签：<span class="txt-size">{{userinfo.labels}}</span></div></el-col>
                                <el-col :span="24" class="grid-info">
                                    <div v-if="userinfo.voice_signature">录音签名：
                                        <audio :src="userinfo.voice_signature" controls="controls" preload="none"></audio>
                                        <el-button type="primary" size="mini" icon="close" @click="deleteAudio()">删除签名录音</el-button>
                                    </div>
                                    <div v-else>暂无录音签名</div>
                                </el-col>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-row v-loading="isgetuser" element-loading-text="拼命加载中" >
                <!-- <el-col :span="10" v-if="allVoiceData==[]"> -->
                <el-col :span="10">
                    <div class="grid-content bg-purple">
                        <div>
                            <h4>录音库</h4>
                            <div class="uer_container">
                                <div class="user-voice" v-for="(item, index) in userinfo.voice_data" :key="index" style="">
                                    <audio :src="item.voice_url" controls="controls" preload="none"></audio>
                                    <div style="padding: 0px;display: inline-block;">
                                        <el-button type="text" class="button" @click="deleteAll(1,userinfo.uid,index)" size="mini">删除</el-button>
                                    </div>
                                </div>
                                <div v-if="!userinfo.voice_data">
                                    这个用户<br>
                                    暂时还没有录音！
                                </div>
                            </div>
                        </div>
                    </div>  
                </el-col>
                <el-col :span="14">
                    <div class="grid-content bg-purple-light" style="margin-left: 10px;">
                        <div>
                            <h4>充值与通话</h4>
                            <div class="user-info-detail">
                                <el-col :span="12" class="grid-info"><div>聊币：<span>{{userinfo.chat_gold}}</span></div></el-col>
                                <el-col :span="12" class="grid-info"><div>聊票：<span>{{userinfo.chat_ticket}}</span></div></el-col>
                                <el-col :span="12" class="grid-info"><div>累计充值(元)：<span>{{userinfo.pay_num/100}}</span></div></el-col>
                                <el-col :span="12" class="grid-info"><div>通话价格：<span>{{userinfo.price}}</span></div></el-col>
                                <el-col :span="12" class="grid-info"><div>累计提现金额(元)：<span>{{userinfo.cash/100}}</span></div></el-col>
                                <el-col :span="12" class="grid-info"><div>累计消耗聊币:<span>{{userinfo.out_chat_gold}}</span></div></el-col>
                                <el-col :span="12" class="grid-info"><div>累积通话时长：<span>{{userinfo.accumulate_time}}</span></div></el-col>
                                <el-col :span="12" class="grid-info"><div>累计消耗聊票：<span>{{userinfo.out_chat_ticket}}</span></div></el-col>
                                <el-col :span="12" class="grid-info"><div>随机通话时长：<span>{{userinfo.totalrandtime}}</span></div></el-col>
                                <el-col :span="12" class="grid-info"><div>随机通话次数：<span>{{userinfo.totalrandcall}}</span></div></el-col>
                                <el-col :span="12" class="grid-info"><div>网红通话时长：<span>{{userinfo.totalredtime}}</span></div></el-col>
                                <el-col :span="12" class="grid-info"><div>网红通话次数：<span>{{userinfo.totalredcall}}</span></div></el-col>
                                <el-col :span="12" class="grid-info"><div>好友通话时长:<span>{{userinfo.totalfriendtime}}</span></div></el-col>
                                <el-col :span="12" class="grid-info"><div>好友通话次数：<span>{{userinfo.totalfriendcall}}</span></div></el-col>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
            
        </el-dialog>
        <el-dialog  title="提示"  :visible.sync="titleialogVisible"  width="30%">
            <span>确定要修改昵称吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="titleialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="nickNameChange()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog  title="提示"  :visible.sync="signDialogVisible"  width="30%">
            <span>确定要修改签名吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="signDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="signatureChange()">确 定</el-button>
            </span>
        </el-dialog>
    </section>
</template>
<script>
import Event from "../../public_js/event.js";
import { allget } from "../../api/api";
import store from '../../vuex/store';
export default {
    data() {
        return {
            dialogVisible: false,
            userinfo: [],
            isgetuser: false,
            changeBeforeValue: {
                nickname: "",
                signature: "",
            },
            titleialogVisible: false,
            signDialogVisible: false,
        };
    },
    methods: {
        getUserInfo(uid) {
            var _this = this;
            var url = "/NewUser/getUserInfo";
            var data = {
                uid: uid
            };
            _this.isgetuser = true;
            allget(data, url)
                .then(res => {
                    _this.isgetuser = false;
                    if(res.data.ret){
                        _this.userinfo = res.data.data[0];
                    }else{
                        baseConfig.errorTipMsg(_this, data.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 删除照片墙照片
        deletePhoto(uid, index){
            var _this = this;
            var url = '/User/delUserPhotoWall';
            var param = {
                uid: uid,
                num: index, 
            }
            allget(param, url).then(res => {
                if(res.data.ret){
                    baseConfig.normalTipMsg(_this, res.data.msg);
                    _this.getUserInfo(_this.userinfo.uid);
                }else{
                    baseConfig.errorTipMsg(_this, res.data.msg);
                }
            }).catch(err=>{
                console.log(err);
            })
        },
        // 删除头像
        deleteUsericon(){
            var _this = this;
            var url = "/User/delUserIcon";
            var param = {
                uid: _this.userinfo.uid
            }
            allget(param, url).then(res => {
                if(res.data.ret){
                    baseConfig.normalTipMsg(_this, res.data.msg);
                    _this.getUserInfo(_this.userinfo.uid)
                }else{
                    baseConfig.errorTipMsg(_this, res.data.msg);
                }
            }).catch(err=>{
                console.log(err);
            })
        },
        // 删除签名录音
        deleteAudio() {
            var _this = this;
            var url = '/User/delUserVoiceSignature';
            var param = {
                uid: _this.userinfo.uid,
            }
            allget(param, url).then(res => {
                if(res.data.ret){
                    baseConfig.normalTipMsg(_this, res.data.msg);
                    _this.getUserInfo(_this.userinfo.uid);
                }else{
                    baseConfig.errorTipMsg(_this, res.data.msg);
                }
            })
        },
        // 判断更改
        judgeChange(type) {
            if(type == 0){
                this.changeBeforeValue.nickname = this.userinfo.nickname;
            }else if(type == 1){
                this.changeBeforeValue.signature = this.userinfo.signature;
            }
        },
        // 判断昵称有没有变化
        judgeChangeNickname(){
            if(this.changeBeforeValue.nickname == this.userinfo.nickname){
                return;
            }else{
                this.titleialogVisible = true;
            }
        },
        // 判断签名有没有变化
        judgeChangeSignature() {
            if(this.changeBeforeValue.signature == this.userinfo.signature){
                return;
            }else{
                this.signDialogVisible = true;
            }
        },
        // 修改昵称
        nickNameChange() {
            var _this = this;
            var url = '/User/delUserNickname';
            var param = {
                uid: this.userinfo.uid,
                nickname: this.userinfo.nickname,
            }
            
            allget(param, url).then(res => {
                if(res.data.ret){
                    baseConfig.successTipMsg(_this, res.data.msg);
                    _this.titleialogVisible = false;
                    _this.getUserInfo(_this.userinfo.uid);
                }else{
                    baseConfig.errorTipMsg(_this, res.data.msg);
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 修改签名
        signatureChange() {
            var _this = this;
            var url = '/User/delUserSignature';
            var param = {
                uid: this.userinfo.uid,
                signature: this.userinfo.signature,
            }
            
            allget(param, url).then(res => {
                if(res.data.ret){
                    baseConfig.successTipMsg(_this, res.data.msg);
                    _this.signDialogVisible = false;
                    _this.getUserInfo(_this.userinfo.uid);
                }else{
                    baseConfig.errorTipMsg(_this, res.data.msg);
                }
            }).catch(err => {
                console.log(err)
            })
        }
    },
    mounted() {
        var _this = this;
        Event.$on("show-one-user", function(obj) {
            _this.dialogVisible = true;
            _this.getUserInfo(obj.uid);
        });
    }
};
</script>
<style scoped>
el-dialog {
    background-color: red;
}
.content {
    background-color: rgba(0, 134, 139, 0.5);
}

.grid-content {
    text-align: center;
    background: #ffffff;
    border-radius: 10px;
    padding-bottom: 20px;
    /* border: 1px solid red; */
}
.grid-content-first{
    height: 380px;
    /* border: 1px solid blue; */
}
.grid-content-second{
    height: 480px;
    margin-top: 20px;
    /* border: 1px solid orchid; */
}
.uer_container {
    width: 100%;
    height: 100%;
    /* border: 1px solid blue; */
    overflow: hidden;
}

h4{
    margin: 10px 0;
    padding: 20px;
    font-size: 20px;
}
/* 相册 */
.user-photo {
    float: left;
    display: inline-block;
    margin: 2px 2px;
    background-color: #f0f8ff;
}
/* 详细资料 */
.user-info-detail{
    width: 100%;
    height: 100%;
    margin-left: 10px;
    overflow: hidden;
    padding: 0 10px;
    /* border: 1px solid red; */
}
.grid-info{
    padding: 5px 0;
    font-size: 16px;
    font-weight: 300;
    border-radius: 4px;
    text-align: left;
    /* color: #1C1C1C; */
    color: #696969;
    /* background-color: #87CEEB; */
}
.grid-info span{
    font-weight: 100;
    /* color: #4F4F4F; */
    color: #B5B5B5;
}
/* 文字大小 */
.txt-size{
    font-size: 12px;
}
</style>

<style>
    .el-dialog__header {
        background-color: #f3f9fb;
        background-color: #A4D3EE;
        /* background-color: #D1EEEE; */
        /* background-color: #00CDCD; */
        /* background-color: #E8E8E8; */
        background-color: #E0FFFF;
        
    }
    .el-dialog--center .el-dialog__body {
        background-color: #f3f9fb;
        background-color: #A4D3EE;
        /* background-color: #D1EEEE; */
        /* background-color: #00CDCD; */
        /* background-color: #E8E8E8; */
        background-color: #E0FFFF;
        
    }
    .el-dialog__footer{
        background-color: #A4D3EE;
        background-color: #E0FFFF;
    }
</style>
<template>
    <!-- 用户货币明细查询 -->
    <!-- dom结构内容 -->
    <section>
        <!-- 工具条/头部的搜索条件搜索 -->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" style="overflow: hidden;">
                <el-form-item>
                    <div class="block">
                        <span class="registerTime">日期</span>
                        <el-date-picker v-model="formOne.startDate" style="width:250px;" type="daterange" range-separator=" 至 " start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item>
                    <span>货币类型：</span>
                    <el-select  style="width: 100px;" v-model="money_type">
                        <el-option label="聊币" value="1"></el-option>
                        <el-option label="聊票" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <span>UID：</span>
                    <el-input style="width:100px;" clearable placeholder="请输入uid" v-model="uid">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <span>消耗/获得：</span>
                    <el-select style="width: 100px;" v-model="type">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="获得" value="2"></el-option>
                        <el-option label="消耗" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <span>交易类型：</span>
                    <el-select  style="width:120px;" v-model="trade_type">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="偷听消费" value="1"></el-option>
                        <el-option label="礼物消费" value="2"></el-option>
                        <el-option label="通话消费" value="3"></el-option>
                        <el-option label="兑换获得" value="4"></el-option>
                        <el-option label="充值" value="5"></el-option>
                        <el-option label="通话获得" value="6"></el-option>
                        <el-option label="礼物获得" value="7"></el-option>
                        <el-option label="兑换" value="8"></el-option>
                        <el-option label="提现" value="9"></el-option>
                        <el-option label="其他" value="10"></el-option>
                        <el-option label="后台赠送" value="11"></el-option>
                        <el-option label="系统赠送" value="12"></el-option>
                        <el-option label="活动获得" value="13"></el-option>
                        <el-option label="被偷听获得" value="14"></el-option>
                        <el-option label="充值促销" value="15"></el-option>
                        <el-option label="解锁用户信息消费" value="16"></el-option>
                        <el-option label="被解锁用户信息获得" value="17"></el-option>
                        <el-option label="私密通话消费" value="18"></el-option>
                        <el-option label="发求聊单消费" value="19"></el-option>
                        <el-option label="兑换万能钥匙消费" value="21"></el-option>
                        <el-option label="切换关门通话消费" value="22"></el-option>
                        <el-option label="切换关门通话获得" value="23"></el-option>
                        <el-option label="录音消费" value="24"></el-option>
                        <el-option label="打赏录音消费" value="25"></el-option>
                        <el-option label="打赏录音获得" value="26"></el-option>
                        <el-option label="偷听录音消费" value="27"></el-option>
                        <el-option label="偷听录音获得" value="28"></el-option>
                        <el-option label="微信分享获得" value="29"></el-option>
                        <el-option label="随机通话加速消费" value="30"></el-option>
                        <el-option label="代理获得" value="31"></el-option>
                        <el-option label="发消息消费(聊票)消费" value="32"></el-option>
                        <el-option label="VIP赠送开门卡" value="33"></el-option>
                        <el-option label="VIP发布表白消费" value="34"></el-option>
                        <el-option label="发消息消费(聊票)获得" value="35"></el-option>
                        <el-option label="代理活动获得聊票" value="36"></el-option>
                        <el-option label="一对一转盘消费" value="37"></el-option>
                        <el-option label="家族内礼物消费" value="38"></el-option>
                        <el-option label="家族内礼物获得" value="39"></el-option>
                        <el-option label="随机通话加速消费" value="40"></el-option>
                        <el-option label="家族内发礼物红包消费" value="41"></el-option>
                        <el-option label="家族内抢礼物红包消费" value="42"></el-option>
                        <el-option label="家族内礼物红包返还" value="43"></el-option>
                        <el-option label="开通或者续费VIP会员消费" value="44"></el-option>
                        <el-option label="创建家族消费" value="45"></el-option>
                        <el-option label="活动消费" value="46"></el-option>
                        <el-option label="一对一转盘获得" value="47"></el-option>
                        <el-option label="直播间内礼物消费" value="48"></el-option>
                        <el-option label="直播间内礼物获得" value="49"></el-option>
                        <el-option label="直播间内发礼物红包消费" value="50"></el-option>
                        <el-option label="直播间内抢礼物红包获得" value="51"></el-option>
                        <el-option label="直播间内礼物红包返还" value="52"></el-option>
                        <el-option label="平台奖励获得" value="53"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <span>触发人：</span>
                    <el-input style="width:120px;" clearable placeholder="请输入触发人" v-model="trigger_uid">
                    </el-input>
                </el-form-item>
                <el-form-item class="search-span" style="float:right;">
                    <el-button id="searchBtn" type="primary" @click="getData(0)">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!-- 用户的数据展示列表 -->
        <template>
            <el-table :data="listData" v-loading="listLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" border fit highlight-current-row style="width: 100%;" :height="tableHeight">
                <el-table-column prop="time" label="日期"></el-table-column>
                <el-table-column prop="uid" label="用户id"></el-table-column>
                <el-table-column prop="money_type" :formatter="judgeMoney" label="货币类型"></el-table-column>
                <el-table-column prop="change_num" label="数额"></el-table-column>
                <el-table-column prop="trigger_uid" label="触发人"></el-table-column>
                <el-table-column prop="trade_type" :formatter="judgeTrade" label="交易类型"></el-table-column>
                <el-table-column prop="history" label="交易前数额"></el-table-column>
                <el-table-column prop="now" label="交易后数额"></el-table-column>
            </el-table>
            <!-- 工具条 -->
            <el-col :span="24" class="toolbar">
                <el-pagination layout="total,prev, pager, next,jumper" :page-size="20" @current-change="handleCurrentChange" :current-page="page+1" :total=totalpage style="float:right; ">
                </el-pagination>
            </el-col>
        </template>
    </section>
</template>

<script>
import { allget } from "../../../api/api";
import store from '../../../vuex/store';
export default {
    data() {
        return {
            tableHeight: null, 
            formOne: {
                startDate: [new Date() - 7 * 24 * 60 * 60 * 1000, new Date()] // 对应选择的日期,给默认时间180之前到现在
            },
            listData: [],
            money_type: "",   //货币类型
            trade_type: "",    //交易类型
            uid: "",           //uid
            type: "",          //消耗获得
            trigger_uid: "",   //触发人
            formLabelWidth: "120px",
            listLoading: false,
            page: 0,
            totalpage: 1000,
        };
    },
    methods: {
        //页面的页数
        handleCurrentChange(val) {
            //服务器的第一页是0 所以 这里要 -1
            this.page = val - 1;
            this.getData();
        },
        judgeMoney(row){
            if(row.money_type==1){
                return "聊币";
            }else if(row.money_type==2){
                return "聊票";
            }
        },
        judgeTrade(row){
            if(row.trade_type==0){
                return "未知";
            }else if(row.trade_type==""){
                return "未知";
            }else if(row.trade_type==1){
                return "偷听消费";
            }else if(row.trade_type==2){
                return "礼物消费";
            }else if(row.trade_type==3){
                return "通话消费 ";
            }else if(row.trade_type==4){
                return "兑换获得";
            }else if(row.trade_type==5){
                return "充值";
            }else if(row.trade_type==6){
                return "通话获得";
            }else if(row.trade_type==7){
                return "礼物获得";
            }else if(row.trade_type==8){
                return "兑换";
            }else if(row.trade_type==9){
                return "提现";
            }else if(row.trade_type==10){
                return "其他";
            }else if(row.trade_type==11){
                return "后台赠送";
            }else if(row.trade_type==12){
                return "系统增送";
            }else if(row.trade_type==13){
                return "活动获得";
            }else if(row.trade_type==14){
                return "被偷听获得";
            }else if(row.trade_type==15){
                return "充值促销";
            }else if(row.trade_type==16){
                return "解锁用户信息消费";
            }else if(row.trade_type==17){
                return "被解锁用户信息获得";
            }else if(row.trade_type==18){
                return "私密通话消费";
            }else if(row.trade_type==19){
                return "发求聊单消费";
            }else if(row.trade_type==21){
                return "兑换万能钥匙";
            }else if(row.trade_type==22){
                return "切换关门通话消费";
            }else if(row.trade_type==23){
                return "切换关门通话获得";
            }else if(row.trade_type==24){
                return "录音消费";
            }else if(row.trade_type==25){
                return "打赏录音消费";
            }else if(row.trade_type==26){
                return "打赏录音获得";
            }else if(row.trade_type==27){
                return "偷听录音消费";
            }else if(row.trade_type==28){
                return "偷听录音获得";
            }else if(row.trade_type==29){
                return "后台统计交易类型，微信分享获得";
            }else if(row.trade_type==30){
                return "随机通话加速消费";
            }else if(row.trade_type==31){
                return "代理获得";
            }else if(row.trade_type==32){
                return "发消息消费(聊票)消费";
            }else if(row.trade_type==33){
                return "VIP赠送开门卡";
            }else if(row.trade_type==34){
                return "VIP发布表白消费";
            }else if(row.trade_type==35){
                return "发消息消费(聊票)获得";
            }else if(row.trade_type==36){
                return "代理活动获得聊票";
            }else if(row.trade_type==37){
                return "一对一转盘消费";
            }else if(row.trade_type==38){
                return "家族内礼物消费";
            }else if(row.trade_type==39){
                return "家族内礼物获得";
            }else if(row.trade_type==40){
                return "随机通话加速消费";
            }else if(row.trade_type==41){
                return "家族内发礼物红包消费";
            }else if(row.trade_type==42){
                return "家族内抢礼物红包获得";
            }else if(row.trade_type==43){
                return "家族内礼物红包返还";
            }else if(row.trade_type==44){
                return "开通或者续费VIP会员消费";
            }else if(row.trade_type==45){
                return "创建家族消费";
            }else if(row.trade_type==46){
                return "活动消费";
            }else if(row.trade_type==47){
                return "一对一转盘获得";
            }else if(row.trade_type==48){
                return "直播间内礼物消费";
            }else if(row.trade_type==49){
                return "直播间内礼物获得";
            }else if(row.trade_type==50){
                return "直播间内发礼物红包消费";
            }else if(row.trade_type==51){
                return "直播间内抢礼物红包获得";
            }else if(row.trade_type==52){
                return "直播间内礼物红包返还";
            }else if(row.trade_type==53){
                return "平台奖励获得";
            }
        },
        // 获取数据
        getData(type) {
            var _this = this;
            _this.listLoading = true;
            if (type == 0) {
                _this.page = 0;
            }
            let url = "/NewMoney/getUserConsumer";
            let param = {
                date_s: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
                date_e: baseConfig.changeDateTime(this.formOne.startDate[1], 0),
                find: this.uid,
                money_type: this.money_type,
                type: this.type,
                trade_type: this.trade_type,
                trigger_uid: this.trigger_uid,
                page: this.page,
            };
            allget(param, url)
                .then(res => {
                    _this.listLoading = false;
                    if (res.data.ret) {
                        _this.listData = res.data.data;
                    } else {
                        baseConfig.successTipMsg(_this, res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
    },
    mounted() {
        var _this = this;
        _this.tableHeight = baseConfig.lineNumber(searchPageHeight);
        _this.getData();
    }
};
</script>

<style lang="css" scoped>
.search-span {
    float: right;
}
#searchBtn {
    margin-right: 50px;
}
</style>

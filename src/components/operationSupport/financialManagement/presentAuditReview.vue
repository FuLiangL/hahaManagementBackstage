<template>
    <!-- 提现审核页面(二级) -->
    <section>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" style="overflow: hidden;" :model="formOne">
                <el-form-item>
                    <div class="block">
                        <span class="dataTime">日期</span>
                        <el-date-picker v-model="formOne.choiceDate" type="daterange" range-separator=" 至 " placeholder="选择日期范围"></el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item>
                    <div class="block">
                        <el-input placeholder="查询条件" v-model="formOne.find"></el-input>                        
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getTableData">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <template>
            <el-table :data="onePageData" border fit highlight-current-row v-loading="listLoading" style="width: 100%;" :height="tableHeight">
                <el-table-column prop="req_time" label="请求时间" width="200" sortable></el-table-column>
                <el-table-column prop="uid" label="用户uid" width="100" sortable></el-table-column>
                <el-table-column prop="nickname" label="用户昵称" width="100" sortable></el-table-column>
                <el-table-column label="金额(元)" width="100" sortable>
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <p>{{(scope.row.num-0)/100}}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="提现方式" width="100" sortable>
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <p v-if="scope.row.pay_type==2">支付宝</p>
                            <p v-else-if="scope.row.type==3">微信</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="pay_account" label="提现账号" width="100" sortable></el-table-column>
                <el-table-column prop="name" label="提现账号的名字" width="200" sortable></el-table-column>
                <el-table-column prop="order_id" label="订单id" width="300" sortable></el-table-column>
                <el-table-column label="操作" min-width="100" sortable>
                    <template slot-scope="scope">
                        <el-button type="primary" @click.native.prevent="Auditing(scope.$index, formOne.tabData)" size="small">审核</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-col :span="24" class="toolbar">
                <el-pagination layout="total,prev,pager,next,jumper" @current-change="oneHandleCurrentChange" :page-size="20" :total="formOne.totalPage" style="float: right;"></el-pagination>
            </el-col>
        </template>
        <el-dialog title="审核详情" :visible.sync="addDialog.dialogShow">
				<el-form :model="addDialog">
					<el-form-item label="本次提现" :label-width="formLabelWidth">
						<el-input disabled v-model="addDialog.num" auto-complete="off"></el-input>
					</el-form-item>
                    <el-form-item label="账号" :label-width="formLabelWidth">
						<el-input disabled v-model="addDialog.uid" auto-complete="off"></el-input>
					</el-form-item>
                    <el-form-item label="昵称" :label-width="formLabelWidth">
						<el-input disabled v-model="addDialog.nickname" auto-complete="off"></el-input>
					</el-form-item>
                    <el-form-item label="是否认证" :label-width="formLabelWidth">
                        <el-select disabled v-model="addDialog.status">
							<el-option label="未认证" value="0"></el-option>
							<el-option label="认证中" value="1"></el-option>
							<el-option label="审核通过" value="2"></el-option>
							<el-option label="审核未通过" value="3"></el-option>
							<el-option label="参数错误请不要打款" value="4"></el-option>
						</el-select>
					</el-form-item>
                    <el-form-item label="性别" :label-width="formLabelWidth">
                        <el-select disabled v-model="addDialog.sex">
							<el-option label="男" value="1"></el-option>
							<el-option label="女" value="2"></el-option>
							<el-option label="性别不明" value="3"></el-option>
						</el-select>
					</el-form-item>
                    <el-form-item label="注册渠道" :label-width="formLabelWidth">
						<el-input disabled v-model="addDialog.channel" auto-complete="off"></el-input>
					</el-form-item>
                    <el-form-item label="注册时间" :label-width="formLabelWidth">
						<el-input disabled v-model="addDialog.addtime" auto-complete="off"></el-input>
					</el-form-item>
                    <el-form-item label="累计通话时长" :label-width="formLabelWidth">
						<el-input disabled v-model="addDialog.accumulate_time" auto-complete="off"></el-input>
					</el-form-item>
                    <el-form-item label="累计通话收益" :label-width="formLabelWidth">
						<el-input disabled v-model="addDialog.call_ticket" auto-complete="off"></el-input>
					</el-form-item>
                    <el-form-item label="累计礼物收益" :label-width="formLabelWidth">
						<el-input disabled v-model="addDialog.gift_ticket" auto-complete="off"></el-input>
					</el-form-item>
                    <el-form-item label="累计其它收益" :label-width="formLabelWidth">
						<el-input disabled v-model="addDialog.other_ticket" auto-complete="off"></el-input>
					</el-form-item>
                    <el-form-item label="随机通话次数" :label-width="formLabelWidth">
						<el-input disabled v-model="addDialog.rand_num" auto-complete="off"></el-input>
					</el-form-item>
                    <el-form-item label="好友通话次数" :label-width="formLabelWidth">
						<el-input disabled v-model="addDialog.friend_num" auto-complete="off"></el-input>
					</el-form-item>
                    <el-form-item label="累计充值金额" :label-width="formLabelWidth">
						<el-input disabled v-model="addDialog.total_pay_money" auto-complete="off"></el-input>
					</el-form-item>
                    <el-form-item label="历史提现次数" :label-width="formLabelWidth">
						<el-input disabled v-model="addDialog.history_cash_times" auto-complete="off"></el-input>
					</el-form-item>
                    <el-form-item label="历史提现金额" :label-width="formLabelWidth">
						<el-input disabled v-model="addDialog.history_cash_money" auto-complete="off"></el-input>
					</el-form-item>
                    <el-form-item label="拒绝原因" :label-width="formLabelWidth">
						<el-input v-model="addDialog.reason" auto-complete="off"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native.prevent="sendSure(0)">拒 绝</el-button>
					<el-button type="primary" @click.native.prevent="sendSure(1)">通 过</el-button>
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
            tableHeight: null,
            formOne: {
                choiceDate: [new Date()-3*24*60*60*1000,new Date()],                
                find: '',
                tabData: [],
                totalPage: null,
                page: 0,
                star: '0',
                end: '20',
            },
            addDialog: {
                dialogShow: false,
                num: '',
                uid: '',
                nickname: '',
                status: '',
                sex: '',
                channel: '',
                addtime: '',
                accumulate_time: '',
                call_ticket: '',
                gift_ticket: '',
                other_ticket: '',
                rand_num: '',
                friend_num: '',
                total_pay_money: '',
                history_cash_times: '',
                history_cash_money: '',
                id: '',
                order_id: '',
                operation_name: '',
                reason: '',
            },
            listLoading: false,
            formLabelWidth: '120px',
        }
    }, 
    computed: {
        onePageData() {
            var _this = this;
            return _this.formOne.tabData.slice(_this.formOne.star, _this.formOne.end);
        }
    },
    methods:{
        oneHandleCurrentChange(val) {
            var _this = this;
            _this.formOne.page = val;
            _this.formOne.star = (_this.formOne.page-0)*20;
            _this.formOne.end = _this.formOne.star-0+20;
        },
        searchConditionOne() {
            var _this = this;
            var obj = {};
            obj.date_s = baseConfig.changeDateTime(_this.formOne.choiceDate[0], 0);
            obj.date_e = baseConfig.changeDateTime(_this.formOne.choiceDate[1], 0);
            obj.find = _this.formOne.find;
            return obj;
        },
        getTableData() {
            var _this = this;
            _this.listLoading = true;
            var url = '/NewMoney/getMoneyOutCheckFirst';
            var params = _this.searchConditionOne();
            allget(params, url)
            .then(res => {
                _this.listLoading = false;
                if(res.data.ret) {
                    _this.formOne.totalPage = res.data.data.length;
                    _this.formOne.tabData = res.data.data;
                } else {
                    baseConfig.errorTipMsg(_this, res.data.msg);
                }
            })
            .catch(function(error) {
                baseConfig.errorTipMsg(_this, error);
            })
        },
        Auditing(index, rows) { // 审核详情按钮
            var _this = this;
            index = index + (_this.formOne.page)*20; 
            var id = rows[index].id; 	
            var url = "/Money/getMoneyOutInfo";
            var params = {
                id: id,
                type: 1, // 传1就行
            };
            _this.addDialog.dialogShow = true;
            _this.addDialog.id = id;
            _this.addDialog.order_id = rows[index].order_id;
            _this.listLoading = true;            
            allget(params, url)
            .then(res => {
                _this.listLoading = false;                
                if(res.data.ret) {
                    _this.addDialog.num = ((res.data.num-0)/100)+'元';
                    _this.addDialog.uid = res.data.uid;
                    _this.addDialog.nickname = res.data.nickname;
                    if(res.data.aut_status==0 || res.data.aut_status==1 || res.data.aut_status==2 || res.data.aut_status==3) {
                        _this.addDialog.status = res.data.aut_status;                        
                    } else {
                        _this.addDialog.status = 4;
                    }
                    if(res.data.sex==1 || res.data.sex==2) {
                        _this.addDialog.sex = res.data.sex;
                    } else {
                        _this.addDialog.sex = 3;
                    }
                    _this.addDialog.channel = res.data.channel;
                    _this.addDialog.addtime = res.data.addtime;
                    _this.addDialog.accumulate_time = baseConfig.changeTime(res.data.accumulate_time);
                    _this.addDialog.call_ticket = res.data.call_ticket+'聊票';
                    _this.addDialog.gift_ticket = res.data.gift_ticket+'聊票';
                    _this.addDialog.other_ticket = res.data.other_ticket+'聊票';
                    _this.addDialog.rand_num = res.data.rand_num;
                    _this.addDialog.friend_num = res.data.friend_num;
                    _this.addDialog.total_pay_money = ((res.data.total_pay_money-0)/100)+'元';
                    _this.addDialog.history_cash_times = res.data.history_cash_times;
                    _this.addDialog.history_cash_money = ((res.data.history_cash_money-0)/100)+'元';
                    _this.addDialog.reason = '';
                } else {
                    baseConfig.errorTipMsg(_this, res.data.msg);
                }
            })
            .catch((error) => {
                console.log(error);
            })
        },
        sendSure(type) {
            var _this = this;
            if(type==0) { //拒绝
                _this.listLoading = true;
                let formData = new FormData();
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'  //之前说的以表单传数据的格式来传递fromdata
                    }
                };
                formData.append('id', _this.addDialog.id);
                formData.append('order_id', _this.addDialog.order_id);
                formData.append('uid', _this.addDialog.uid);
                formData.append('operation_name', _this.addDialog.operation_name);
                formData.append('reason', _this.addDialog.reason);
                axios.post(baseConfig.server+baseConfig.requestUrl+'/Money/getMoneyOutFail', formData, config)
                .then((res) => {
                    if(res.data.ret) {
                        baseConfig.successTipMsg(_this, '已成功拒绝！');
                        _this.getTableData();
                        _this.addDialog.dialogShow = false;
                        _this.listLoading = false;                        
                    } else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
            } else if(type==1) { // 通过
                _this.listLoading = true;
                let formData = new FormData();
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'  //之前说的以表单传数据的格式来传递fromdata
                    }
                };
                formData.append('order_id', _this.addDialog.order_id);
                formData.append('operation_name', _this.addDialog.operation_name);
                axios.post(baseConfig.server+baseConfig.requestUrl+'/Money/getMoneyOutPassFirst', formData, config)
                .then((res) => {
                    if(res.data.ret) {
                        baseConfig.successTipMsg(_this, '已成功通过！');
                        _this.getTableData();
                        _this.addDialog.dialogShow = false;
                        _this.listLoading = false;  
                    } else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
            }
        },
    },
    mounted() {
        var _this = this;
        _this.$nextTick(function() {
            _this.tableHeight = baseConfig.lineNumber(searchPageHeight);
            _this.addDialog.operation_name = store.state.user.name;
            _this.getTableData();
        })
    }
}
</script>

<template>
    <!-- 用户认证审核(可操作) -->
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
                    <span>UID：</span>
                    <el-input style="width:100px;" @clear="clearInput" placeholder="请输入UID" v-model="find" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <span>身份证号码：</span>
                    <el-input style="width:145px;" @clear="clearInput" placeholder="请输入身份证号码" v-model="identity_card" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <span>审核状态：</span>
                    <el-select style="width: 100px;" v-model="status">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="待审核" value="1"></el-option>
                        <el-option label="已通过" value="2"></el-option>
                        <el-option label="已拒绝" value="3"></el-option>
                        <el-option label="已清除" value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <span>支付宝账号：</span>
                    <el-input style="width:140px;" @clear="clearInput" placeholder="请输入支付宝账号" v-model="pay_account" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item class="search-span" style="float:right;">
                    <el-button id="searchBtn" type="primary" @click="getData()">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!-- 用户的数据展示列表 -->
        <template>
            <el-table :data="onePageTabData" border fit highlight-current-row style="width: 100%;" v-loading="listLoading" :height="tableHeight">
                <el-table-column prop="req_time" label="申请时间"></el-table-column>
                <el-table-column prop="uid" label="UID"></el-table-column>
                <el-table-column prop="nickname" label="昵称"></el-table-column>
                <el-table-column prop="sex" :formatter="judegSex" label="性别"></el-table-column>
                <el-table-column prop="aut_icon" label="手持证件照">
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="left">
                            <img :src="scope.row.aut_icon" alt="" style="width:300px;height:400px;">
                            <div slot="reference" class="name-wrapper">
                                <img :src="scope.row.aut_icon" alt="" style="width:100px;height:100px;">
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="identity_card_icon" label="身份证照片">
                    <template slot-scope="scope">
                        <el-popover trigger="hover" v-if="scope.row.identity_card_icon" placement="right">
                            <img :src="scope.row.identity_card_icon" alt="" style="width:300px;height:400px;">
                            <div slot="reference" class="name-wrapper">
                                <img :src="scope.row.identity_card_icon" alt="" style="width:100px;height:100px;">
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="真实姓名"></el-table-column>
                <el-table-column prop="identity_card" label="身份证号码"></el-table-column>
                <el-table-column prop="pay_account" label="支付宝账号"></el-table-column>
                <el-table-column prop="status" label="审核状态">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status==1">待审核</div>
                        <div v-else-if="scope.row.status==2">已通过</div>
                        <div v-else-if="scope.row.status==3">已拒绝</div>
                        <div v-else-if="scope.row.status==3">已清除</div>
                    </template>
                </el-table-column>
                <el-table-column prop="fail_reason" label="拒绝原因"></el-table-column>
                <el-table-column prop="auth_time" label="审核时间"></el-table-column>
                <el-table-column prop="auth_user" label="审核人"></el-table-column>
                <el-table-column label="操作" min-width="150">
                    <template slot-scope="scope">
                        <el-row v-if="scope.row.status==1">
                            <el-col :span="8">
                                <el-button size="mini" type="success" @click="pass(scope.$index, scope.row)">通过</el-button>
                            </el-col>
                            <el-col :span="8">
                                <el-button size="mini" type="danger" @click="refuseBtn(scope.$index, scope.row)">拒绝</el-button>
                            </el-col>
                            <el-col :span="8">
                                <el-button style="margin-right: 20px;" size="mini" type="info" @click="revamp(scope.$index, scope.row)">修改信息</el-button>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" v-else-if="scope.row.status==2">
                            <el-col :span="12">
                                <el-button size="mini" type="success" @click="clearDate(scope.$index, scope.row)">清除认证</el-button>
                            </el-col>
                            <el-col :span="12">
                                <el-button size="mini" type="info" @click="revamp(scope.$index, scope.row)">修改信息</el-button>
                            </el-col>
                        </el-row>
                        <el-row v-else-if="scope.row.status==3">
                            <el-button size="mini" type="info" @click="revamp(scope.$index, scope.row)">修改信息</el-button>
                        </el-row>
                        <el-row v-else-if="scope.row.status==4">
                            <el-button size="mini" type="info" @click="revamp(scope.$index, scope.row)">修改信息</el-button>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
            <el-col :span="24" class="toolbar">
				<el-pagination layout="total,prev,pager,next,jumper" @current-change="handleCurrentChange" :page-size="20" :total="totalpage" style="float:right;"></el-pagination>
			</el-col>
            <!-- 确定通过弹窗 -->
            <el-dialog title="提示" :visible.sync="passDialogVisible" width="30%">
                <span>确定要通过吗？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="passDialogVisible=false">取 消</el-button>
                    <el-button type="primary" @click="passDialogVisible=false,surePass()">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 拒绝弹窗 -->
            <el-dialog title="拒绝" :visible.sync="refuse.DialogVisible">
                <el-form :model="refuse">
                    <el-form-item label="拒绝原因" :label-width="formLabelWidth">
                        <el-input v-model="refuse.reason" placeholder="请输入拒绝原因" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="refuse.DialogVisible=false,refuse.reason=''">取 消</el-button>
                    <el-button type="primary" @click="sureRefuse()">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog 
            title="信息修改" 
            :visible.sync="info.dialogVisible">
                <el-form :model="info">
                    <el-form-item label="UID" :label-width="formLabelWidth">
                        <el-input style="width:200px;" v-model="info.uid"></el-input>
                    </el-form-item>
                    <el-form-item label="昵称" :label-width="formLabelWidth">
                        <el-input style="width:200px;" v-model="info.nickname"></el-input>
                    </el-form-item>
                    <el-form-item label="认证照片" :label-width="formLabelWidth">
                        <template slot-scope="scope">
                            <el-popover trigger="hover" placement="left">
                                <img 
                                :src="info.aut_icon" 
                                style="width:300px;height:300px;">
                                <div slot="reference" class="name-wrapper">
                                    <img 
                                    :src="info.aut_icon" 
                                    style="width:100px;height:100px;">
                                </div>
                            </el-popover>
                        </template>
                    </el-form-item>
                    <el-form-item label="请求时间" :label-width="formLabelWidth">
                        <el-input style="width: 200px;" v-model="info.req_time"></el-input>
                    </el-form-item>
                    <el-form-item label="身份认证照片" :label-width="formLabelWidth">
                        <template slot-scope="scope">
                            <el-popover trigger="hover" placement="left">
                                <img 
                                :src="info.identity_card_icon" 
                                style="width:300px;height:300px;">
                                <div slot="reference" class="name-wrapper">
                                    <img 
                                    :src="info.identity_card_icon" 
                                    style="width:100px;height:100px;">
                                </div>
                            </el-popover>
                        </template>
                    </el-form-item>
                    <el-form-item label="认证状态" :label-width="formLabelWidth">
                        <el-select style="width: 100px;" v-model="info.status">
                            <el-option label="未认证" value="0"></el-option>
                            <el-option label="认证中" value="1"></el-option>
                            <el-option label="认证成功" value="2"></el-option>
                            <el-option label="认证失败" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="身份证号码" :label-width="formLabelWidth">
                        <el-input style="width:200px;" v-model="info.identity_card"></el-input>
                    </el-form-item>
                    <el-form-item label="真实姓名" :label-width="formLabelWidth">
                        <el-input style="width:200px;" v-model="info.name"></el-input>
                    </el-form-item>
                    <el-form-item label="支付宝" :label-width="formLabelWidth">
                        <el-input style="width:200px;" v-model="info.pay_account"></el-input>
                    </el-form-item>
                    <el-form-item label="本月剩余提现次数" :label-width="formLabelWidth">
                        <el-input style="width:200px;" v-model="info.pay_account"></el-input>
                    </el-form-item>
                    <el-form-item label="认证方式" :label-width="formLabelWidth">
                        <el-select style="width: 100px;" v-model="info.type">
                            <el-option label="真人认证" value="0"></el-option>
                            <el-option label="实名认证" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="失败原因" :label-width="formLabelWidth">
                        <el-input style="width:200px;" v-model="info.fail_reason"></el-input>
                    </el-form-item>
                    <el-form-item label="认证时间" :label-width="formLabelWidth">
                        <el-input style="width:200px;" v-model="info.auth_time"></el-input>
                    </el-form-item>
                    <el-form-item label="操作人姓名" :label-width="formLabelWidth">
                        <el-input style="width:200px;" v-model="info.auth_user"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="info.dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="sureRevamp()">确定修改</el-button>
                </div>
            </el-dialog>
            <!-- 清除认证弹窗 -->
            <el-dialog title="提示" :visible.sync="clear.dialogVisible" width="30%">
                <span>确定清除认证</span>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="clear.dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="sureClear()">确 定</el-button>
                </span>
            </el-dialog>
        </template>
    </section>
</template>

<script>
import { allget } from "../../../api/api";
import store from "../../../vuex/store";
import axios from "axios";
export default {
    data() {
        return {
            tableHeight: null, // table展示的页面的高度多少，第二页中对应高度
            formOne: {
                startDate: [new Date() - 7 * 24 * 60 * 60 * 1000, new Date()] // 对应选择的日期,给默认时间180之前到现在
            },
            listData: [],
            totalpage: null,
            formLabelWidth: "120px",
            listLoading: false,
            pay_account: null,
            identity_card: null,
            status: null,
            find: null,
            operate_user: null,
            passDialogVisible: false,
            passUid: null, //pass UID
            refuse: {
                DialogVisible: false,
                reason: null,
                uid: null
            },
            info: {
                // 在这里修改将对应的内容进行全部的展示
                dialogVisible: false,
                uid:'',            
                nickname: '',
                aut_icon: '',
                req_time: '',
                identity_card_icon: '',
                status: '',
                identity_card: '',
                name: '',
                pay_account: '',
                surplus_num: '',
                type: '',
                fail_reason: '',
                auth_time: '',
                auth_user: '',
            },
            clear: {
                dialogVisible: false,
                uid: null,
            },
            page: 1,
            totalpage: null,
            star: '0',
            end: '20',
        };
    },
    computed: {
        onePageTabData() {
			var _this = this;
			return _this.listData.slice(_this.star, _this.end);
		},
    },
    methods: {
        handleCurrentChange(val) {
			var _this = this;
			_this.page = val;
			_this.star = (_this.page-1)*20;
			_this.end = _this.star+20;
		},
        // 获取数据
        getData() {
            var _this = this;
            _this.listLoading = true;
            let url = baseConfig.server+baseConfig.requestUrl+"/NewUser/getRealName";
            let params = {
                date_s: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
                date_e: baseConfig.changeDateTime(this.formOne.startDate[1], 0),
                find: this.find,
                pay_account: this.pay_account,
                identity_card: this.identity_card,
                status: this.status
            };
            axios.get(url, {params: params})
            .then((res) => {
                _this.listLoading = false; 
                _this.listData = res.data.data;
                _this.totalpage = res.data.data.length;
            })
            .catch((err) => {
                console.log(err);
            });
        },
        // 性别
        judegSex(row, column) {
            return row.sex == 1 ? "男" : "女";
        },
        clearInput() {
            this.getData();
        },
        // 通过
        pass(index, row) {
            this.passDialogVisible = true;
            this.passUid = row.uid;
        },
        surePass() {
            var _this = this;
            let url = baseConfig.server+baseConfig.requestUrl+"/NewUser/passRealName";
            let params = {
                uid: this.passUid,
                auth_user: this.operate_user
            };
            axios.get(url, {params: params})
            .then((res) => {
                if (res.data.ret) {
                    baseConfig.successTipMsg(_this, res.data.msg);
                    _this.getData();
                } else {
                    baseConfig.errorTipMsg(_this, res.data.msg);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        },
        // 拒绝
        refuseBtn(index, row) {
            this.refuse.DialogVisible = true;
            this.refuse.uid = row.uid;
        },
        sureRefuse() {
            var _this = this;
            let url = baseConfig.server+baseConfig.requestUrl+"/NewUser/failRealName";
            let params = {
                uid: this.refuse.uid,
                auth_user: this.operate_user,
                fail_reason: this.refuse.reason
            };
            if (params.fail_reason==null || params.fail_reason=="") {
                baseConfig.warningTipMsg(_this, '请填写拒绝的原因~');
                return;
            }
            axios.get(url, {params: params})
            .then((res) => {
                if (res.data.ret) {
                    _this.refuse.DialogVisible = false;
                    baseConfig.successTipMsg(_this, res.data.msg);
                    _this.refuse.reason = "";
                    _this.getData();
                } else {
                    baseConfig.errorTipMsg(_this, res.data.msg);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        },
        // 修改信息
        revamp(index, row) {
            var _this = this;
            _this.info.dialogVisible = true;
            _this.info.uid = row.uid;
            _this.info.nickname = row.nickname;
            _this.info.aut_icon = row.aut_icon;
            _this.info.req_time = row.req_time;
            _this.info.identity_card_icon = row.identity_card_icon;
            _this.info.status = row.status;
            _this.info.identity_card = row.identity_card;
            _this.info.name = row.name;
            _this.info.pay_account = row.pay_account;
            _this.info.surplus_num = row.surplus_num;
            _this.info.type = row.type;
            _this.info.fail_reason = row.fail_reason;
            _this.info.auth_time = row.auth_time;
            _this.info.auth_user = row.auth_user;
            console.log(_this.info.aut_icon);
            console.log(_this.info.identity_card_icon);
        },
        sureRevamp() {
            var _this = this;
            let url = baseConfig.server+baseConfig.requestUrl+"/NewUser/editRealName";
            let params = {
                uid: _this.info.uid,
                aut_icon: _this.info.aut_icon,
                req_time: _this.info.req_time,
                status: _this.info.status,
                identity_card: _this.info.identity_card,
                name: _this.info.name,
                pay_account: _this.info.pay_account,
                surplus_num: _this.info.surplus_num,
                type: _this.info.type,
                fail_reason: _this.info.fail_reason,
                auth_time: _this.info.auth_time,
                auth_user: _this.info.auth_user,
            };
            axios.get(url, {params:params})
            .then((res) => {
                if (res.data.ret) {
                    baseConfig.successTipMsg(_this, res.data.msg);
                    _this.info.dialogVisible = false;
                    _this.getData();
                } else {
                    baseConfig.errorTipMsg(_this, res.data.msg);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        },
        // 清除认证
        clearDate(index, row) {
            this.clear.dialogVisible = true;
            this.clear.uid = row.uid;
        },
        sureClear() {
            var _this = this;
            let url = baseConfig.server+baseConfig.requestUrl+"/NewUser/clearRealName";
            let params = {
                uid: this.clear.uid,
                auth_user: this.operate_user,
            };
            axios.get(url, {params: params})
            .then((res) => {
                if (res.data.ret) {
                    baseConfig.successTipMsg(_this, res.data.msg);
                    _this.clear.dialogVisible = false;
                    _this.getData();
                } else {
                    baseConfig.errorTipMsg(_this, res.data.msg);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        }
    },
    mounted() {
        var _this = this;
        _this.tableHeight = baseConfig.lineNumber(searchPageHeight);
        _this.getData();
        _this.operate_user = store.state.user.name;
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

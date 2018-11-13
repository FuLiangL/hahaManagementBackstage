<template>
    <!-- 用户信息查询 -->
    <!-- dom结构内容 -->
    <section>
        <!-- 工具条/头部的搜索条件搜索 -->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" style="overflow: hidden;">
                <el-row>
                    <el-form-item>
                        <div class="block">
                            <span class="registerTime">注册日期</span>
                            <el-date-picker style="width: 300px;" v-model="formOne.startDate" type="daterange" range-separator=" 至 " start-placeholder="开始日期" end-placeholder="结束日期">
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <div class="block">
                            <span class="registerTime">登陆日期</span>
                            <el-date-picker style="width: 300px;" v-model="formTwo.startDate" type="daterange" range-separator=" 至 " start-placeholder="开始日期" end-placeholder="结束日期">
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <span>渠道</span>
                        <el-select v-model="channelId" multiple filterable collapse-tags style="margin-left: 20px; width: 180px;" placeholder="请选择">
                            <el-option v-for="(item, key) of channelData" :key="item" :label="item" :value="key">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <span>UID</span>
                        <el-input style="width: 150px;" v-model="uid" placeholder="请输入UID" clearable></el-input>
                    </el-form-item>
                    <el-form-item class="search-span" style="float:right;">
                        <el-button id="searchBtn" type="primary" @click="getData(0)">查询</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </el-col>
        <!-- 用户的数据展示列表 -->
        <template>
            <el-table :data="listData" v-loading="listLoading" border fit highlight-current-row style="width: 100%;" :height="tableHeight">
                <el-table-column prop="addtime" label="注册时间"></el-table-column>
                <el-table-column prop="annotation" label="渠道"></el-table-column>
                <el-table-column prop="uid" label="UID"></el-table-column>
                <el-table-column prop="nickname" label="昵称"></el-table-column>
                <el-table-column prop="icon" label="用户头像">
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="left">
                            <img :src="scope.row.icon" alt="" style="width:300px;height:300px;">
                            <div slot="reference" class="name-wrapper">
                                <img :src="scope.row.icon" alt="" style="width:100px;height:100px;">
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="level" label="等级"></el-table-column>
                <el-table-column prop="sex" :formatter="judgeSex" label="性别"></el-table-column>
                <el-table-column prop="address" label="城市"></el-table-column>
                <el-table-column prop="lasttime" label="最近登录时间"></el-table-column>
                <el-table-column prop="status" :formatter="judgeStatus" label="状态"></el-table-column>
                <el-table-column prop="is_online" :formatter="judgeOnline" label="是否在线"></el-table-column>
                <el-table-column label="操作" width="350">
                    <template slot-scope="scope">
                        <el-row>
                            <el-col :span="4">
                                <el-button size="mini" type="primary" @click="userDetail(scope.$index, scope.row)">用户详情</el-button>
                            </el-col>
                            <el-col :span="4" v-if="scope.row.status == 0">
                                <el-button size="mini" type="danger" @click="title(scope.$index, scope.row)">封号</el-button>
                            </el-col>
                            <el-col :span="4" v-if="scope.row.status == 0">
                                <el-button size="mini" type="primary" @click="plDown(scope.$index, scope.row)">踢下线</el-button>
                            </el-col>
                            <el-col :span="4" v-else-if="scope.row.status == 1">
                                <el-button size="mini" type="warning" @click="Unlock(scope.$index, scope.row)">解封</el-button>
                            </el-col>
                            <el-col :span="4" v-if="scope.row.is_up_list == 0">
                                <el-button size="mini" type="primary" @click="upList(scope.$index, scope.row)">上榜</el-button>
                            </el-col>
                            <el-col :span="4" v-else-if="scope.row.is_up_list == 1">
                                <el-button size="mini" type="primary" @click="downList(scope.$index, scope.row)">下榜</el-button>
                            </el-col>
                            <el-col :span="4">
                                <el-button size="mini" type="info" @click="prop(scope.$index, scope.row)">道具</el-button>
                            </el-col>
                            <el-col :span="4">
                                <el-button size="mini" type="primary" @click="resetPass(scope.$index, scope.row)">重置密码</el-button>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog title="封禁账号" :visible.sync="titleInfo.dialogFormVisible">
                <el-form :model="titleInfo">
                    <el-form-item label="封号时长" :label-width="formLabelWidth">
                        <el-select v-model="titleInfo.day" placeholder="请选择封号时长">
                            <el-option label="1天" value="1"></el-option>
                            <el-option label="3天" value="3"></el-option>
                            <el-option label="5天" value="5"></el-option>
                            <el-option label="7天" value="7"></el-option>
                            <el-option label="15天" value="15"></el-option>
                            <el-option label="30天" value="30"></el-option>
                            <el-option label="永远封号" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="封号原因" :label-width="formLabelWidth">
                        <el-input v-model="titleInfo.reason" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="titleInfo.dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="sureTitle">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="解封账号" :visible.sync="UnlockInfo.dialogFormVisible">
                <el-form :model="UnlockInfo">

                    <el-form-item label="解封原因" :label-width="formLabelWidth">
                        <el-input v-model="UnlockInfo.reason" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="UnlockInfo.dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="srueUnlock">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="踢下线" :visible.sync="plDownInfo.dialogFormVisible">
                <el-form :model="plDownInfo">

                    <el-form-item label="踢掉原因" :label-width="formLabelWidth">
                        <el-input v-model="plDownInfo.reason" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="plDownInfo.dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="sureplDown">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 道具列表 -->
            <el-dialog title="道具列表" :visible.sync="propInfo.dialogFormVisible">
                <el-table :data="propInfo.data" style="width: 100%">
                    <el-table-column prop="prop_id" label="道具id" width="180"></el-table-column>
                    <el-table-column prop="name" label="道具名称" width="180"></el-table-column>
                    <el-table-column prop="status" :formatter="judgeGiftStatus" label="状态"></el-table-column>
                </el-table>
            </el-dialog>
            <!-- 重置密码二次确认 -->
            <el-dialog title="重置密码" :visible.sync="resetPassword.dialogFormVisible" center width="30%">
                <span>你确定要重置密码？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="resetPassword.dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="sureReset">确 定</el-button>
                </span>
            </el-dialog>

            <el-col :span="24" class="toolbar">
                <el-pagination layout="total,prev, pager, next,jumper" :page-size="20" @current-change="handleCurrentChange" :current-page="page+1" :total=totalpage style="float:right; ">
                </el-pagination>
            </el-col>
            <!-- 个人信息展示组件 -->
            <!-- <oneUserContent></oneUserContent> -->
        </template>
    </section>
</template>

<script>
import Event from "./../../../public_js/event";
import { allget } from "../../../api/api";
import store from "../../../vuex/store";
export default {
    data() {
        return {
            tableHeight: null,
            formOne: {
                startDate: [new Date() - 7 * 24 * 60 * 60 * 1000, new Date()]
            },
            formTwo: {
                startDate: [new Date() - 7 * 24 * 60 * 60 * 1000, new Date()]
            },
            recordStatus: "",
            listData: [],
            formLabelWidth: "120px",
            listLoading: false,
            uid: "",
            operate_user: null,
            page: 0, // 分页
            totalpage: 1000,
            channelData: {}, // 渠道数据
            channelId: null,
            titleInfo: {
                dialogFormVisible: false,
                uid: "",
                reason: "",
                day: ""
            },
            UnlockInfo: {
                dialogFormVisible: false,
                uid: "",
                reason: ""
            },
            plDownInfo: {
                dialogFormVisible: false,
                uid: "",
                reason: ""
            },
            propInfo: {
                dialogFormVisible: false,
                data: [],
                prop_id: "",
                name: "",
                status: ""
            },
            resetPassword: {
                dialogFormVisible: false,
                uid: "",
            }
        };
    },
    methods: {
        judgeSex(row) {
            if (row.sex == 1) {
                return "男";
            } else {
                return "女";
            }
        },
        judgeStatus(row) {
            if (row.status == 1) {
                return "封号";
            } else if (row.status == 0) {
                return "正常";
            }
        },
        judgeOnline(row) {
            if (row.is_online == 1) {
                return "在线";
            } else if (row.is_online == 0) {
                return "离线";
            }
        },
        judgeGiftStatus(row) {
            if (row.status == 0) {
                return "可以使用";
            } else if (row.status == 1) {
                return "即将可用";
            } else if (row.status == 2) {
                return "已失效";
            }
        },
        handleCurrentChange(val) {
            this.page = val - 1;
            this.getData();
        },
        // 获取数据
        getData(type) {
            var _this = this;
            _this.listLoading = true;
            let url = "/NewUser/getUser";
            if (type == 0) {
                _this.page = 0;
            }
            var channel = _this.channelId.join(",");
            let param = {
                date_s: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
                date_e: baseConfig.changeDateTime(this.formOne.startDate[1], 0),
                date_ls: baseConfig.changeDateTime(
                    this.formTwo.startDate[0],
                    0
                ),
                date_le: baseConfig.changeDateTime(
                    this.formTwo.startDate[1],
                    0
                ),
                find: _this.uid,
                page: _this.page,
                channel: channel
            };
            // 如果输入uid  取消其他搜索参数
            if (param.find != "" && param.find != null) {
                delete param.date_s;
                delete param.date_e;
                delete param.date_ls;
                delete param.date_le;
                delete param.page;
            }
            allget(param, url)
                .then(res => {
                    _this.listLoading = false;
                    if (res.data.ret) {
                        this.listData = res.data.data;
                    } else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                })
                .catch(err => {
                    console.error(err);
                });
        },
        // 用户详情
        userDetail(index, rows) {
            var _this = this;
            Event.$emit("show-one-user", {
                uid: rows.uid
            });
        },
        // 封号
        title(index, rows) {
            this.titleInfo.uid = rows.uid;
            this.titleInfo.dialogFormVisible = true;
            // var url = '/'
        },
        sureTitle() {
            var _this = this;
            var url = "/User/kickUser";
            var param = {
                uid: this.titleInfo.uid,
                day: this.titleInfo.day,
                reason: this.titleInfo.reason,
                operate_user: this.operate_user
            };
            if (param.reason == "" || param.reason == null) {
                baseConfig.warningTipMsg(this, "封人家总得有个原因吧！");
                return;
            }
            allget(param, url)
                .then(res => {
                    if (res.data.ret) {
                        baseConfig.successTipMsg(this, res.data.msg);
                        _this.getData();
                        this.titleInfo.uid = "";
                        this.titleInfo.day = "1";
                        this.titleInfo.reason = "";
                        this.titleInfo.dialogFormVisible = false;
                    } else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                })
                .catch(err => {
                    console.error(err);
                });
        },
        // 解封
        Unlock(index, row) {
            this.UnlockInfo.dialogFormVisible = true;
            this.UnlockInfo.uid = row.uid;
        },
        srueUnlock() {
            var _this = this;
            var url = "/User/freeUser";
            var param = {
                uid: this.UnlockInfo.uid,
                reason: this.UnlockInfo.reason,
                operate_user: this.operate_user
            };
            if (param.reason == "" || param.reason == null) {
                baseConfig.warningTipMsg(_this, "请输入解封原因！");
                return;
            }
            allget(param, url)
                .then(res => {
                    if (res.data.ret) {
                        baseConfig.successTipMsg(this, res.data.msg);
                        _this.getData();
                        this.UnlockInfo.uid = "";
                        this.UnlockInfo.reason = "";
                        this.UnlockInfo.dialogFormVisible = false;
                    } else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                })
                .catch(err => {
                    console.error(err);
                });
        },
        // 踢下线
        plDown(index, row) {
            this.plDownInfo.uid = row.uid;
            this.plDownInfo.dialogFormVisible = true;
        },
        sureplDown() {
            var _this = this;
            var url = "/User/kickUserDown";
            var param = {
                uid: this.plDownInfo.uid,
                reason: this.plDownInfo.reason,
                operate_user: this.operate_user
            };
            if (param.reason == "" || param.reason == null) {
                baseConfig.warningTipMsg(_this, "请输入踢掉原因");
            }
            allget(param, url)
                .then(res => {
                    if (res.data.ret) {
                        baseConfig.successTipMsg(this, res.data.msg);
                        _this.getData();
                        this.plDownInfo.uid = "";
                        this.plDownInfo.reason = "";
                        this.plDownInfo.dialogFormVisible = false;
                    } else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                })
                .catch(err => {
                    console.error(err);
                });
        },
        // 上榜
        upList(index, row) {
            var _this = this;
            var url = "/Test/upMoneyOrCharm";
            var param = {
                uid: row.uid
            };
            allget(param, url)
                .then(res => {
                    if (res.data.ret) {
                        baseConfig.successTipMsg(_this, res.data.msg);
                        _this.getData();
                    } else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                })
                .catch(err => {
                    console.error(err);
                });
        },
        // 下榜
        downList(index, row) {
            var _this = this;
            var url = "/Test/downMoneyOrCharm";
            var param = {
                uid: row.uid
            };
            allget(param, url)
                .then(res => {
                    if (res.data.ret) {
                        baseConfig.successTipMsg(_this, res.data.msg);
                        _this.getData();
                    } else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                })
                .catch(err => {
                    console.error(err);
                });
        },
        // 道具
        prop(index, row) {
            var _this = this;
            this.propInfo.dialogFormVisible = true;
            var url = "/NewUser/getUserPropList";
            var param = {
                uid: row.uid
            };
            allget(param, url)
                .then(res => {
                    if (res.data.ret) {
                        _this.propInfo.data = res.data.data;
                    } else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                })
                .catch(err => {
                    console.error(err);
                });
        },
        // 重置密码
        resetPass(index, row){
            var _this = this;
            _this.resetPassword.dialogFormVisible = true;
            _this.resetPassword.uid = row.uid;
        },
        sureReset(){
            var _this = this;
            var url = '/NewUser/resetPassword';
            var param = {
                uid: _this.resetPassword.uid,
            }
            allget(param, url)
                .then(res => {
                    if (res.data.ret) {
                        _this.resetPassword.dialogFormVisible = false;
                        baseConfig.successTipMsg(_this, res.data.msg);
                    } else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                })
                .catch(err => {
                    console.error(err);
                });
        }
    },
    mounted() {
        var _this = this;
        _this.tableHeight = baseConfig.lineNumber(searchPageHeight);
        _this.getData();
        _this.operate_user = store.state.user.name;
        var id = store.state.user.channelid.split(",");
        var name = store.state.user.channelname.split(",");
        for (var i = 0; i < id.length; i++) {
            this.channelData[id[i]] = name[i];
        }
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

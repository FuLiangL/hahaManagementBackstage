<template>
    <!-- 账号修改，注册 -->
    <!-- dom结构内容 -->
    <section>
        <!-- 工具条/头部的搜索条件搜索 -->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" style="overflow: hidden;">
                <el-form-item>
                    <div class="block">
                        <span class="registerTime">日期</span>
                        <el-date-picker v-model="formOne.startDate" type="daterange" range-separator=" 至 " start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="操作类型" :label-width="formLabelWidth">
                    <el-select v-model="searchType" placeholder="请选择操作类型" style="width:150px;">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="注销" value="1"></el-option>
                        <el-option label="修改" value="2"></el-option>
                        <el-option label="注册" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="search-span">
                    <el-button id="searchBtn" type="primary" @click="getData(1)">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button id="handBinding" type="primary" @click="form.dialogFormVisible = true ">修改账号</el-button>
                    <el-button id="handBinding" type="primary" @click="logout.dialogVisible = true ">注销账号</el-button>
                    <el-button id="handBinding" type="primary" @click="register.dialogVisible = true ">注册账号</el-button>
                </el-form-item>

            </el-form>
        </el-col>
        <!-- 用户的数据展示列表 -->
        <template>
            <el-table :data="listData" border fit highlight-current-row style="width: 100%;" v-loading="listLoading" :height="tableHeight">
                <el-table-column prop="operate_time" label="操作时间"></el-table-column>
                <el-table-column prop="type" :formatter="agentCode" label="操作类型"></el-table-column>
                <el-table-column prop="uid" label="UID"></el-table-column>
                <el-table-column prop="phone" label="账号"></el-table-column>
                <el-table-column prop="sex" :formatter="agentSex" label="性别"></el-table-column>
                <el-table-column prop="code" label="验证码"></el-table-column>
                <el-table-column prop="before_phone" label="原账号"></el-table-column>
                <el-table-column prop="operate_user" label="操作人"></el-table-column>

            </el-table>
        </template>
        <el-dialog title="修改账户" :visible.sync="form.dialogFormVisible">
            <el-form :model="form">
                <p class="bindingTitle" style="color: red;">用户须知：<br>1、操作前先查询要更换的手机号码是否已注册，如已注册，请先解绑！<br> 2、操作时请务必确定用户处于离线状态！
                </p>
                <el-form-item label="UID：" :label-width="formLabelWidth">
                    <el-input v-model="form.uid" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机号码：" :label-width="formLabelWidth">
                    <el-input v-model="form.phone" placeholder="要绑定的新手机号码" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="form.dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="changeAccount()">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="注销账户" :visible.sync="logout.dialogVisible">
            <el-form :model="logout">
                <p class="bindingTitle" style="color: red;">用户须知：<br>1、注销账号后，用户数据将全部删除，请先确定账号归属以及告知用户注销风险！<br> 2、操作时请务必确定用户处于离线状态！
                </p>
                <el-form-item label="UID：" :label-width="formLabelWidth">
                    <el-input v-model="logout.uid" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="logout.dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="logout.dialogVisible = false,logoutAccount()">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="注册账户" :visible.sync="register.dialogVisible">
            <el-form :model="register">
                <p class="bindingTitle" style="color: red;">用户须知：<br>1、操作前先查询要手机号码/UID是否已注册！<br> 2、虚拟/不存在的手机号码请选择固定验证码！
                </p>
                <el-form-item label="UID：" :label-width="formLabelWidth">
                    <el-input v-model="register.uid" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="账号性别" :label-width="formLabelWidth">
                    <el-select v-model="register.sex" placeholder="请选择性别">
                        <el-option label="男" value="1"></el-option>
                        <el-option label="女" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机号码：" :label-width="formLabelWidth">
                    <el-input v-model="register.phone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="验证码类型" :label-width="formLabelWidth">
                    <el-select v-model="register.is_code" placeholder="请选择验证码类型">
                        <el-option label="无需验证码" value="0"></el-option>
                        <el-option label="需要验证码" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="register.is_code==1" label="验证码：" :label-width="formLabelWidth">
                    <el-input v-model="register.code" placeholder="请输入4为数字" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="register.dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="registerAccount()">确 定</el-button>
            </div>
        </el-dialog>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="total,prev, pager, next,jumper" @current-change="handleCurrentChange" :page-size="20" :total=1000 :current-page="page+1" style="float:right; ">
            </el-pagination>
        </el-col>
    </section>
</template>

<script>
import { allget } from "../../../api/api";
import axios from "axios";
import store from "../../../vuex/store.js";
export default {
    data() {
        return {
            tableHeight: null, // table展示的页面的高度多少，第二页中对应高度
            formOne: {
                startDate: [new Date() - 1 * 24 * 60 * 60 * 1000, new Date()] // 对应选择的日期,给默认时间180之前到现在
            },
            page: 0,
            listData: [],
            formLabelWidth: "120px",
            listLoading: false,
            form: {
                dialogFormVisible: false,
                uid: null,
                phone: null
            },
            logout: {
                dialogVisible: false,
                uid: null,
                phone: null
            },
            operate_user: null,
            register: {
                dialogVisible: false,
                uid: null,
                sex: null,
                phone: null,
                is_code: null,
                code: null
            },
            page: 0,
            totalpage: null,
            searchType: null,
        };
    },
    methods: {
        //页面的页数
        handleCurrentChange(val) {
            //服务器的第一页是0 所以 这里要 -1
            this.page = val - 1;
            this.getData();
        },
        // 获取数据
        getData(type) {
            var _this = this;
            _this.listLoading = true;
            let url = "/NewUser/getAccountChangeRecord";
            if (this.formOne.startDate == null) {
                baseConfig.warningTipMsg(this, "请输入日期");
                return;
            }
            if (type) {
                this.page = 0;
            }
            let param = {
                date_s: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
                date_e: baseConfig.changeDateTime(this.formOne.startDate[1], 0),
                page: this.page,
                type: this.searchType
            };
            allget(param, url)
                .then(res => {
                    _this.listLoading = false;
                    if(res.data.ret){
                        _this.listData = res.data.data;
                    }else{
                        baseConfig.warningTipMsg(_this, res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        agentCode(row, column) {
            if (row.type == 1) {
                return "注销";
            } else if (row.type == 2) {
                return "修改";
            } else if (row.type == 3) {
                return "注册";
            }
        },
        agentSex(row, colum) {
            if (row.sex == 1) {
                return "男";
            } else if (row.sex == 2) {
                return "女";
            } else {
                return "";
            }
        },

        // 修改账号
        changeAccount() {
            var _this = this;
            let url = "/NewUser/uidChangePhone";
            let param = {
                uid: this.form.uid,
                phone: this.form.phone,
                operate_user: this.operate_user
            };
            if(!(/0?(13|14|15|17|18|19)[0-9]{9}/.test(param.phone))){ 
                baseConfig.warningTipMsg(this, '手机号码有误，请重填');
                return false; 
            } 
            allget(param, url)
                .then(res => {
                    if (res.data.ret) {
                            form.dialogFormVisible = false;
                        baseConfig.successTipMsg(this, res.data.msg);
                        this.form.uid = "";
                        this.form.phone = "";
                        _this.getData();
                    } else {
                        baseConfig.warningTipMsg(this, res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 注销账号
        logoutAccount() {
            var _this = this;
            let url = "/NewUser/uidChangePhone";
            let param = {
                uid: this.logout.uid,
                phone: this.logout.uid,
                operate_user: this.operate_user
            };
            allget(param, url)
                .then(res => {
                    if (res.data.ret) {
                        baseConfig.successTipMsg(this, res.data.msg);
                        this.logout.uid = "";
                        _this.getData();
                    } else {
                        baseConfig.warningTipMsg(this, res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 注册账号
        registerAccount() {
            var _this = this;
            let url = "/NewUser/registerGoodNumber";
            let param = {
                uid: this.register.uid,
                phone: this.register.phone,
                sex: this.register.sex,
                is_code: this.register.is_code,
                code: this.register.code,
                operate_user: this.operate_user
            };
            console.log(param);
            if (param.uid == null || param.uid == "") {
                baseConfig.warningTipMsg(this, "请输入uid！");
                return;
            }
            if (param.sex == null || param.sex == "") {
                baseConfig.warningTipMsg(this, "请选择性别！");
                return;
            }
            if (param.phone == null || param.phone == "") {
                baseConfig.warningTipMsg(this, "请输入手机号码！");
                return;
            }
            if(!(/0?(13|14|15|17|18|19)[0-9]{9}/.test(param.phone))){ 
                baseConfig.warningTipMsg(this, '手机号码有误，请重填');
                return; 
            }
            if (param.is_code == null || param.is_code == "") {
                baseConfig.warningTipMsg(this, "请选择验证码类型！");
                return;
            }
            if (param.is_code == 1) {
                console.log(/^([0-9]{4})$/.test(param.code));
                if (!/^([0-9]{4})$/.test(param.code)) {
                    baseConfig.warningTipMsg(this, "请输入4为有效数字!");
                }
            } else {
                delete param.code;
            }
            allget(param, url)
                .then(res => {
                    if (res.data.ret) {
                        baseConfig.successTipMsg(this, res.data.msg);
                        this.register.uid = "";
                        this.register.phone = "";
                        this.register.sex = "";
                        this.register.is_code = "";
                        this.register.code = "";
                        _this.getData();
                        _this.register.dialogVisible = false;
                    } else {
                        baseConfig.warningTipMsg(this, res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    },
    mounted() {
        var _this = this;
        this.getData();
        _this.tableHeight = baseConfig.lineNumber(searchPageHeight);
        this.operate_user = store.state.user.name;
    }
};
</script>

<style lang="css" scoped>
#searchBtn {
    margin-right: 50px;
}
.bindingTitle {
    margin-left: 130px;
}
</style>

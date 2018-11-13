<template>
    <!-- 设备封禁记录 -->
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
                <el-form-item class="search-span" style="float:right;">
                    <el-button id="searchBtn" type="primary" @click="banImEiIpByHand()">添加封禁</el-button>
                    <el-button id="searchBtn" type="primary" @click="getData()">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!-- 用户的数据展示列表 -->
        <template>
            <el-table :data="onePageTabData" v-loading="listLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" border fit highlight-current-row style="width: 100%;" :height="tableHeight">
                <el-table-column prop="kick_time" label="封禁时间"></el-table-column>
                <el-table-column prop="im_ei" label="IP/设备号"></el-table-column>
                <el-table-column prop="free_time" label="解封时间"></el-table-column>
                <el-table-column prop="free_reason" label="解封理由"></el-table-column>
                <el-table-column prop="operate_user" label="操作人"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <p v-if="scope.row.status==0">已解封</p>
                        <el-button v-else-if="scope.row.status==1" size="mini" type="primary" @click="freeImEi(scope.$index, scope.row)">解封</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-col :span="24" class="toolbar">
                <el-pagination layout="total,prev,pager,next,jumper" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="totalpage" style="float:right;"></el-pagination>
            </el-col>
        </template>
        <el-dialog title="封禁设备" :visible.sync="banInfo.dialogVisible">
            <el-form :model="banInfo">
                <el-form-item label="IP/设备号：" :label-width="formLabelWidth">
                    <el-input v-model="banInfo.im_ei_list" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="封号原因：" :label-width="formLabelWidth">
                    <el-input v-model="banInfo.reason" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="banInfo.dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureban">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="解封设备" :visible.sync="freeInfo.dialogVisible">
            <el-form :model="freeInfo">
                <el-form-item label="解封原因：" :label-width="formLabelWidth">
                    <el-input v-model="freeInfo.reason" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="freeInfo.dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureFree">确 定</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
import { allget } from "../../../api/api";
import axios from "axios";
import store from "../../../vuex/store";
export default {
    data() {
        return {
            tableHeight: null, // table展示的页面的高度多少，第二页中对应高度
            formOne: {
                startDate: [new Date() - 7 * 24 * 60 * 60 * 1000, new Date()] // 对应选择的日期,给默认时间180之前到现在
            },
            listData: [],
            formLabelWidth: "120px",
            listLoading: false,
            operate_user: null,
            page: 1,
            totalpage: null,
            star: "0",
            end: "20",
            banInfo: {
                dialogVisible: false,
                im_ei_list: "",
                reason: ""
            },
            freeInfo: {
                dialogVisible: false,
                reason: "",
                id: "",
            }
        };
    },
    computed: {
        onePageTabData() {
            var _this = this;
            return _this.listData.slice(_this.star, _this.end);
        }
    },
    methods: {
        handleCurrentChange(val) {
            var _this = this;
            _this.page = val;
            _this.star = (_this.page - 1) * 20;
            _this.end = _this.star + 20;
        },
        // 获取数据
        getData() {
            var _this = this;
            _this.listLoading = true;
            let url = "/NewUser/getFuckImEiIpRecord";
            let param = {
                date_s: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
                date_e: baseConfig.changeDateTime(this.formOne.startDate[1], 0)
            };
            allget(param, url)
                .then(res => {
                    _this.listLoading = false;
                    if (res.data.ret) {
                        this.listData = res.data.data;
                        _this.totalpage = res.data.data.length;
                        _this.page = 1;
                    } else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                })
                .catch(err => {
                    baseConfig.errorTipMsg(_this, err.data.msg);
                });
        },
        // 封号
        banImEiIpByHand() {
            var _this = this;
            _this.banInfo.dialogVisible = true;
        },
        sureban() {
            var _this = this;
            var url = "/NewUser/fuckImEiIpByHand";
            var param = {
                im_ei_list: _this.banInfo.im_ei_list,
                reason: _this.banInfo.reason,
                operate_user: _this.operate_user
            };
            allget(param, url)
                .then(res => {
                    if (res.data.ret) {
                        // 完成以后清空数据
                        _this.banInfo.im_ei_list = "";
                        _this.banInfo.reason = "";
                        baseConfig.successTipMsg(_this, res.data.msg);
                        _this.banInfo.dialogVisible = false;
                        _this.getData();
                    } else {
                        baseConfig.warningTipMsg(_this, res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        //解封
        freeImEi(index, row) {
            this.freeInfo.dialogVisible = true;
            this.freeInfo.id = row.id;
        },
        sureFree() {
            var _this = this;
            var url = "/NewUser/freeImEiIpByHand";
            var param = {
                id: _this.freeInfo.id,
                reason: _this.freeInfo.reason,
                operate_user: _this.operate_user,
            }
            allget(param, url)
                .then(res => {
                    if(res.data.ret){
                        baseConfig.successTipMsg(_this, res.data.msg);
                        _this.freeInfo.dialogVisible = false;
                        _this.freeInfo.reason = "";
                        _this.getData();
                    } else {
                        baseConfig.warningTipMsg(_this, res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
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

<template>
    <!-- 代理推广查询 -->
    <!-- dom结构内容 -->
    <section>
        <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane label="普通代理数据列表" name="first">
                <!-- 普通代理数据列表 -->
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true" style="overflow: hidden;">
                        <el-form-item>
                            <div class="block">
                                <span class="registerTime">日期</span>
                                <el-date-picker v-model="formOne.startDate1" type="daterange" range-separator=" 至 " start-placeholder="开始日期" end-placeholder="结束日期">
                                </el-date-picker>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <span>uid</span>
                            <el-input style="width:100px;" placeholder="请输入内容" v-model="uid" clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item style="float:right;margin-right: 100px;">
                            <el-button type="primary" @click="getTbData(0)">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <!--用户的数据展示列表-->
                <template>
                    <el-table ref="tableHeight" :data="listData" border fit highlight-current-row v-loading="listLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"  style="width: 100%;" :height="tableHeight">
                        <el-table-column prop="date" label="日期"></el-table-column>
                        <el-table-column prop="uid" label="UID"></el-table-column>
                        <el-table-column prop="username" label="账号"></el-table-column>
                        <el-table-column prop="nickname" label="昵称"></el-table-column>
                        <el-table-column prop="wx_invite_uid" label="上级用户UID"></el-table-column>
                        <el-table-column prop="spread_num" label="推广用户数量">
                            <template slot-scope="scope">
                                <div slot="reference" class="name-wrapper">
                                    <span>{{scope.row.spread_num}}</span>
                                    <el-button v-if="scope.row.spread_num" type="primary" @click="dialogTableVisible = true, getDetailData(5, scope.row.uid, scope.row.date)" size="mini" style="margin-left: 10px;">明细</el-button>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="total_spread_num" label="累计推广用户数量"></el-table-column>
                        <el-table-column prop="turn_agent_num" label="已转为付费代理数量">
                            <template slot-scope="scope">
                                <div slot="reference" class="name-wrapper">
                                    <span>{{scope.row.turn_agent_num}}</span>
                                    <el-button v-if="scope.row.turn_agent_num" type="primary" @click="dialogTableVisible = true, getDetailData(4, scope.row.uid, scope.row.date)" size="mini" style="margin-left: 10px;">明细</el-button>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="total_turn_agent_num" label="累计已转为付费代理数量"></el-table-column>
                        <el-table-column prop="spread_ticket" label="获得推广聊票数"></el-table-column>
                        <el-table-column prop="total_spread_ticket" label="累计获得推广聊票数"></el-table-column>
                    </el-table>
                    <!-- Table -->
                    <el-dialog title="明细列表" :visible.sync="dialogTableVisible" center>
                        <el-table :data="detialData">
                            <el-table-column property="addtime" label="注册时间"></el-table-column>
                            <el-table-column property="uid" label="UID"></el-table-column>
                            <el-table-column property="phone" label="账号"></el-table-column>
                            <el-table-column property="nickname" label="昵称"></el-table-column>
                            <el-table-column property="add_time" label="成为付费代理时间"></el-table-column>
                        </el-table>
                    </el-dialog>
                    <!-- 工具条 -->
                    <el-col :span="24" class="toolbar">
                        <el-pagination layout="total,prev, pager, next,jumper" @current-change="handleCurrentChange" :page-size="20" :total=1000 :current-page="page+1" style="float:right; ">
                        </el-pagination>
                    </el-col>
                </template>
            </el-tab-pane>
            <el-tab-pane label="付费代理数据列表" name="second">
                <!-- 付费代理数据列表 -->
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true" style="overflow: hidden;">
                        <el-form-item>
                            <div class="block">
                                <span class="registerTime">日期</span>
                                <el-date-picker v-model="formOne.startDate" type="daterange" range-separator=" 至 " start-placeholder="开始日期" end-placeholder="结束日期">
                                </el-date-picker>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <span>uid</span>
                            <el-input style="width:100px;" placeholder="请输入内容" v-model="uid1" clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item style="float:right;margin-right: 100px;">
                            <el-button type="primary" @click="getTbData1(0)">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <!--用户的数据展示列表-->
                <template>
                    <el-table ref="tableHeight" :data="listData1" border fit highlight-current-row v-loading="listLoading1" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"  style="width: 100%;" :height="tableHeight">
                        <el-table-column prop="date" label="日期"></el-table-column>
                        <el-table-column prop="uid" label="UID"></el-table-column>
                        <el-table-column prop="username" label="账号"></el-table-column>
                        <el-table-column prop="nickname" label="昵称"></el-table-column>
                        <el-table-column prop="wx_invite_uid" label="上级用户UID"></el-table-column>
                        <el-table-column prop="total_spread_num" label="累计推广用户数量"></el-table-column>
                        <el-table-column prop="one_num" label="一级用户数量">
                            <template slot-scope="scope">
                                <div slot="reference" class="name-wrapper">
                                    <span>{{scope.row.one_num}}</span>
                                    <el-button v-if="scope.row.one_num" type="primary" @click="dialogTableVisible1 = true, getDetailData(1, scope.row.uid, scope.row.date)" size="mini" style="margin-left: 10px;">明细</el-button>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="total_one_num" label="累计一级用户数量"></el-table-column>
                        <el-table-column prop="two_num" label="二级用户数量">
                            <template slot-scope="scope">
                                <div slot="reference" class="name-wrapper">
                                    <span>{{scope.row.two_num}}</span>
                                    <el-button v-if="scope.row.two_num" type="primary" @click="dialogTableVisible1 = true, getDetailData(2, scope.row.uid, scope.row.date)" size="mini" style="margin-left: 10px;">明细</el-button>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="total_two_num" label="累计二级用户数量"></el-table-column>
                        <el-table-column prop="three_num" label="三级用户数量">
                            <template slot-scope="scope">
                                <div slot="reference" class="name-wrapper">
                                    <span>{{scope.row.three_num}}</span>
                                    <el-button v-if="scope.row.three_num" type="primary" @click="dialogTableVisible1 = true, getDetailData(3, scope.row.uid, scope.row.date)" size="mini" style="margin-left: 10px;">明细</el-button>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="total_three_num" label="累计三级用户数量"></el-table-column>
                        <el-table-column prop="turn_agent_num" label="已转为付费代理数量">
                            <template slot-scope="scope">
                                <div slot="reference" class="name-wrapper">
                                    <span>{{scope.row.turn_agent_num}}</span>
                                    <el-button v-if="scope.row.turn_agent_num" type="primary" @click="dialogTableVisible1 = true, getDetailData(4, scope.row.uid, scope.row.date)" size="mini" style="margin-left: 10px;">明细</el-button>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="total_turn_agent_num" label="累计已转为付费代理数量"></el-table-column>
                        <el-table-column prop="agent_back" label="获得代理费返利聊票数"></el-table-column>
                        <el-table-column prop="total_agent_back" label="累计获得代理费返利聊票数"></el-table-column>
                        <el-table-column prop="agent_back" label="获得消费返利聊票数"></el-table-column>
                        <el-table-column prop="total_cost_back" label="累计获得消费返利聊票数"></el-table-column>
                        <el-table-column prop="all_back" label="当日合计获得聊票数"></el-table-column>
                        <el-table-column prop="all_total_back" label="累计获得聊票数"></el-table-column>
                    </el-table>
                    <!-- Table -->
                    <el-dialog title="明细列表" :visible.sync="dialogTableVisible1" center>
                        <el-table :data="detialData">
                            <el-table-column property="addtime" label="注册时间"></el-table-column>
                            <el-table-column property="uid" label="UID"></el-table-column>
                            <el-table-column property="phone" label="账号"></el-table-column>
                            <el-table-column property="nickname" label="昵称"></el-table-column>
                            <el-table-column property="add_time" label="成为付费代理时间"></el-table-column>
                        </el-table>
                    </el-dialog>
                    <!-- 工具条 -->
                    <el-col :span="24" class="toolbar">
                        <el-pagination layout="total,prev, pager, next,jumper" @current-change="handleCurrentChange1" :page-size="20" :total=1000 :current-page="page1+1" style="float:right; ">
                        </el-pagination>
                    </el-col>
                </template>
            </el-tab-pane>
            
        </el-tabs>
    </section>
</template>
<script>
import { allget } from "../../../api/api";
import store from "../../../vuex/store.js";
import axios from "axios";
export default {
    data() {
        return {
            sex: "",
            listData: [],
            listData1: [],
            listLoading: false,
            listLoading1: false,
            tableHeight: null,
            activeName: "first",
            formOne: {
                startDate: [new Date() - 2 * 24 * 60 * 60 * 1000, new Date()], // 对应选择的日期,给默认时间180之前到现在
                startDate1: [new Date() - 2 * 24 * 60 * 60 * 1000, new Date()] // 对应选择的日期,给默认时间180之前到现在
            },
            totalpage: null,
            totalpage1: null,
            page: 0,
            page1: 0,
            tableHeight: null, // table展示的页面的高度多少，第二页中对应高度
            uid: null,
            uid1: null,
            dialogTableVisible: false,
            dialogTableVisible1: false,
            detialData: [],
        };
    },
    methods: {
        //页面的页数
        handleCurrentChange(val) {
            //服务器的第一页是0 所以 这里要 -1
            this.page = val - 1;
            this.getTbData();
        },
        //页面的页数
        handleCurrentChange1(val) {
            //服务器的第一页是0 所以 这里要 -1
            this.page1 = val - 1;
            this.getTbData1();
        },
        getTbData(type) {
            var _this = this;
            _this.listLoading = true;
            let url = "/Agent/getAgentDataList";
            if(type==0){
                this.page = 0;
            }
            let param = {
                date_s: baseConfig.changeDateTime(this.formOne.startDate1[0],0),
                date_e: baseConfig.changeDateTime(this.formOne.startDate1[1],0),
                type: 0, //普通代理数据列表
                page: this.page,
                uid: this.uid,
            };
            allget(param, url)
                .then(res => {
                    _this.listLoading = false;
                    if (res.data.ret) {
                        this.listData = res.data.data;
                    } else {
                        baseConfig.errorTipMsg(this, res.data.msg);
                    }
                })
                .catch(err => {
                    baseConfig.errorTipMsg(this, res.data.msg);
                });
        },
        getTbData1(type) {
            var _this = this;
            _this.listLoading1 = true;
            if(type==0){
                this.page = 0;
            }
            let url = "/Agent/getAgentDataList";
            let param = {
                date_s: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
                date_e: baseConfig.changeDateTime(this.formOne.startDate[1], 0),
                type: 1, // 付费代理数据列表
                page: this.page1,
                uid: this.uid1,
            };
            this.uid1 == null || this.uid1 == ""
                ? delete param.uid1
                : (param.uid1 = this.uid1);
            allget(param, url)
                .then(res => {
                    _this.listLoading1 = false;
                    if (res.data.ret) {
                        this.listData1 = res.data.data;
                    } else {
                        baseConfig.errorTipMsg(this, res.data.msg);
                    }
                })
                .catch(err => {
                    baseConfig.errorTipMsg(this, res.data.msg);
                });
        },
        // 获取明细列表  type为代理用户类型 ( 1一级 2二级 3三级 4已转付费代理 5推广用户)
        getDetailData(type, uid, date) {
            var _this = this;
            let url = '/Agent/getAgentManList';
            let param = {
                type: type,
                uid: uid,
                date: date,
            }
            allget(param, url)
                .then(res => {
                    if(res.data.ret){
                        _this.detialData = res.data.data;
                    }else{
                        baseConfig.errorTipMsg(this, res.data.msg);
                    }
                })
        }
    },
    mounted() {
        this.tableHeight = tabSearchPageHeight;
        this.getTbData();
        this.getTbData1();
    }
};
</script>
<style lang="css" scoped>

</style>


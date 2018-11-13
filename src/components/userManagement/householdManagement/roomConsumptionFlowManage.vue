<template>
    <!-- 房间消费流水 -->
    <!-- dom结构内容 -->
    <section>
        <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane label="日统计数据" name="first">
                <!-- 日统计数据 -->
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
                            <span>房间UID</span>
                            <el-input style="width:100px;" placeholder="请输入内容" v-model="room_id" clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <span>族长UID</span>
                            <el-input style="width:100px;" placeholder="请输入内容" v-model="owner_uid" clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item style="float:right;margin-right: 100px;">
                            <el-button type="primary" @click="getTbData(0)">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <!--用户的数据展示列表-->
                <template>
                    <el-table ref="tableHeight" :data="listData" border fit highlight-current-row v-loading="listLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" style="width: 100%;" :height="tableHeight">
                        <el-table-column prop="date" label="开启时间"></el-table-column>
                        <el-table-column prop="room_id" label="房间ID"></el-table-column>
                        <el-table-column prop="room_name" label="房间名称"></el-table-column>
                        <el-table-column prop="family_name" label="所属家族"></el-table-column>
                        <el-table-column prop="owner_uid" label="族长UID"></el-table-column>
                        <el-table-column prop="nickname" label="族长昵称"></el-table-column>
                        <el-table-column prop="use_time" label="结束时间"></el-table-column>
                        <el-table-column prop="money" label="单次流水（聊币）"></el-table-column>
                        <el-table-column prop="total_money" label="累计流水（聊币）"></el-table-column>
                    </el-table>
                    <!-- 工具条 -->
                    <el-col :span="24" class="toolbar">
                        <el-pagination layout="total,prev, pager, next,jumper" @current-change="handleCurrentChange" :page-size="20" :total=1000 :current-page="page+1" style="float:right; ">
                        </el-pagination>
                    </el-col>
                </template>
            </el-tab-pane>
            <el-tab-pane label="月统计数据" name="second">
                <!-- 月统计数据 -->
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
                            <span>房间UID</span>
                            <el-input style="width:100px;" placeholder="请输入内容" v-model="room_id1" clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <span>族长UID</span>
                            <el-input style="width:100px;" placeholder="请输入内容" v-model="owner_uid1" clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item style="float:right;margin-right: 100px;">
                            <el-button type="primary" @click="getTbData1(0)">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <!--用户的数据展示列表-->
                <template>
                    <el-table ref="tableHeight" :data="listData1" border fit highlight-current-row v-loading="listLoading1" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" style="width: 100%;" :height="tableHeight">
                        <el-table-column prop="date" label="月份"></el-table-column>
                        <el-table-column prop="room_id" label="房间ID"></el-table-column>
                        <el-table-column prop="room_name" label="房间名称"></el-table-column>
                        <el-table-column prop="family_name" label="所属家族"></el-table-column>
                        <el-table-column prop="owner_uid" label="族长UID"></el-table-column>
                        <el-table-column prop="nickname" label="族长昵称"></el-table-column>
                        <el-table-column prop="money" label="当月流水（聊币）"></el-table-column>
                        <el-table-column prop="total_money" label="累计流水（聊币）"></el-table-column>
                    </el-table>
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
                startDate: [new Date() - 13 * 24 * 60 * 60 * 1000, new Date()], // 对应选择的日期,给默认时间180之前到现在
                startDate1: [new Date() - 13 * 24 * 60 * 60 * 1000, new Date()] // 对应选择的日期,给默认时间180之前到现在
            },
            totalpage: null,
            totalpage1: null,
            page: 0,
            page1: 0,
            tableHeight: null, // table展示的页面的高度多少，第二页中对应高度
            room_id: null,
            owner_uid: null,
            room_id1: null,
            owner_uid1: null,
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
            let url = "/NewFamily/getLiveBroadCastMoneyRecord";
            if(type==0){
                this.page = 0;
            }
            let param = {
                date_s: baseConfig.changeDateTime(this.formOne.startDate1[0],0),
                date_e: baseConfig.changeDateTime(this.formOne.startDate1[1],0),
                type: 0, //日数据
                page: this.page,
                room_id: this.room_id,
                owner_uid: this.owner_uid,
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
                    console.log(err);
                });
        },
        getTbData1(type) {
            var _this = this;
            _this.listLoading1 = true;
            if(type==0){
                this.page = 0;
            }
            let url = "/NewFamily/getLiveBroadCastMoneyRecord";
            let param = {
                date_s: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
                date_e: baseConfig.changeDateTime(this.formOne.startDate[1], 0),
                type: 1, // 月数据
                page: this.page1,
                room_id: this.room_id1,
                owner_uid: this.owner_uid1,
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
                    console.log(err);
                });
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


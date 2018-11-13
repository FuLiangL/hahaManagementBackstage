<template>
    <!-- 代理排行榜 -->
    <!-- dom结构内容 -->
    <section>
        <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane label="付费代理排行" name="first">
                <!-- 付费代理排行 -->
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
						<el-table-column type="index" label="排名" center></el-table-column>
						<el-table-column prop="uid" label="UID"></el-table-column>
						<el-table-column prop="phone"  label="账号"></el-table-column>
						<el-table-column prop="nickname" label="昵称"></el-table-column>
						<el-table-column prop="total_spread_num" label="累计推广用户数"></el-table-column>
						<el-table-column prop="one_num" label="一级用户数"></el-table-column>
						<el-table-column prop="two_num" label="二级用户数"></el-table-column>
						<el-table-column prop="three_num" label="三级用户数"></el-table-column>
						<el-table-column prop="turn_agent_num" label="已转付费代理数"></el-table-column>
						<el-table-column prop="total_agent_money" label="累计获得聊票数"></el-table-column>
					</el-table>
                    <!-- 工具条 -->
                    <el-col :span="24" class="toolbar">
                        <el-pagination layout="total,prev, pager, next,jumper" @current-change="handleCurrentChange" :page-size="20" :total=1000 :current-page="page+1" style="float:right; ">
                        </el-pagination>
                    </el-col>
				</template>
            </el-tab-pane>
            <el-tab-pane label="普通代理排行" name="second">
                <!-- 普通代理排行 -->
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
						<el-table-column type="index" label="排名"></el-table-column>
						<el-table-column prop="uid" label="UID"></el-table-column>
						<el-table-column prop="username"  label="账号"></el-table-column>
						<el-table-column prop="nickname" label="昵称"></el-table-column>
						<el-table-column prop="spread_num" label="推广用户数"></el-table-column>
						<el-table-column prop="turn_agent_num" label="已转付费代理数"></el-table-column>
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
import {allget} from '../../../api/api';
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
				startDate1: [new Date() - 2 * 24 * 60 * 60 * 1000, new Date()], // 对应选择的日期,给默认时间180之前到现在
            },
            totalpage:null,
            totalpage1:null,
            page: 0,
            page1: 0,
            tableHeight: null, // table展示的页面的高度多少，第二页中对应高度
            uid: null,
            uid1: null,
        };
    },
    methods: {
        //页面的页数
        handleCurrentChange(val) {
            //服务器的第一页是0 所以 这里要 -1
            this.page = val-1;
            this.getTbData();
        },
         //页面的页数
        handleCurrentChange1(val) {
            //服务器的第一页是0 所以 这里要 -1
            this.page1 = val-1;
            this.getTbData1();
        },
        getTbData(arg) {
            if(arg==0){
                this.page = 0;
            }
            var _this = this;
            _this.listLoading = true;
            let url = '/Agent/getAgentRankList';
            let param = {
                date_s: baseConfig.changeDateTime(this.formOne.startDate1[0], 0),
                date_e: baseConfig.changeDateTime(this.formOne.startDate1[1], 0),
                uid: this.uid,
                page: this.page,
                type: 1,// 付费代理排行
            }
            allget(param, url).then(res => {
                _this.listLoading = false;
                if(res.data.ret){
                    this.listData = res.data.data;
                }else{
                    baseConfig.warningTipMsg(this, res.data.msg);
                }
            }).catch(err => {
                console.log(err)
            })
        },
        getTbData1(arg){
            if(arg==0){
                this.page1 = 0;
            }
            var _this = this;
            _this.listLoading1 = true;
            let url = '/Agent/getAgentRankList';
            let param = {
                date_s: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
                date_e: baseConfig.changeDateTime(this.formOne.startDate[1], 0),
                uid: this.uid1,
                page: this.page1,
                type: 0,// 普通代理排行
            }
            this.uid1==null||this.uid1==""?delete param.uid1:param.uid1=this.uid1;
            allget(param, url).then(res => {
                _this.listLoading1 = false;
                if(res.data.ret){
                    this.listData1 = res.data.data;
                }else{
                    baseConfig.errorTipMsg(this, res.data.msg);
                }
            }).catch(err => {
                console.log(err)
            })
        },
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


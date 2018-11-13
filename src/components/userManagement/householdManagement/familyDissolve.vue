<template>
    <!-- 解散家族 -->
    <!-- dom结构内容 -->
    <section>
        <!-- 工具条/头部的搜索条件搜索 -->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" style="overflow: hidden;">
                <!-- <el-form-item>
                    <div class="block">
                        <span class="registerTime">日期</span>
                        <el-date-picker v-model="formOne.startDate" type="daterange" range-separator=" 至 " start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </el-form-item> -->
                <!-- <el-form-item class="search-span" style="float:right;">
                    <el-button id="searchBtn" type="primary" @click="getData(0)">查询</el-button>
                </el-form-item> -->
                <el-form-item>
                    <el-button class="dissolve" type="primary" @click="dialogFormVisible=true">解散家族</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!-- 用户的数据展示列表 -->
        <template>
            <el-table :data="listData" border fit highlight-current-row style="width: 100%;" :height="tableHeight">
                <el-table-column prop="dismiss_time" label="解散时间"></el-table-column>
                <el-table-column prop="family_id" label="家族ID"></el-table-column>
                <el-table-column prop="family_name" label="家族名称"></el-table-column>
                <el-table-column prop="owner_uid" label="创建者UID"></el-table-column>
                <!-- <el-table-column prop="agent_join_money" label="创建者昵称"></el-table-column> -->
                <el-table-column prop="level" label="家族等级"></el-table-column>
                <el-table-column prop="reason" label="解散理由"></el-table-column>
                <el-table-column prop="operate_user" label="操作人"></el-table-column>
            </el-table>
            <el-dialog title="解散家族" :visible.sync="dialogFormVisible">
                <el-form :model="form">
                    <el-form-item label="家族ID" :label-width="formLabelWidth">
                        <el-input v-model="form.family_id" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="解散理由" :label-width="formLabelWidth">
                        <el-input v-model="form.reason" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dissolve()">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 工具条 -->
            <el-col :span="24" class="toolbar">
                <el-pagination layout="total,prev, pager, next,jumper" @current-change="handleCurrentChange" :page-size="20" :total=1000 :current-page="page+1" style="float:right; ">
                </el-pagination>
            </el-col>
        </template>
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
            // formOne: {
            //     startDate: [new Date() - 1 * 24 * 60 * 60 * 1000, new Date()] // 对应选择的日期,给默认时间180之前到现在
            // },
            page: 0,
            listData: [],
            totalpage: null,
            formLabelWidth: "120px",
            listLoading: false,
            operate_user: null,
            form: {
                family_id: null,
                reason: null
            },
            dialogFormVisible: false,
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
            if (type == 0) {
                _this.page = 0;
            }
            let url = "/NewFamily/getDismissFamilyRecord";
            let param = {
                page: this.page,
                // date_s: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
                // date_e: baseConfig.changeDateTime(this.formOne.startDate[1], 0)
            };
            allget(param, url)
                .then(res => {
                    this.listData = res.data.data;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 解散家族
        dissolve() {
            var _this = this;
            let url = "/NewFamily/dismissFamily";
            let param = {
                family_id: this.form.family_id,
                reason: this.form.reason,
                operate_user: this.operate_user
            };
            allget(param, url)
                .then(res => {
                    if(res.data.ret){
                        _this.dialogFormVisible = false;
                        baseConfig.successTipMsg(_this, res.data.msg);
                    }else{
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    },
    mounted() {
        var _this = this;
        _this.tableHeight = baseConfig.lineNumber(searchPageHeight);
        _this.getData();
        this.operate_user = store.state.user.name;
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
.dissolve {
    margin-left: 20px;
}
</style>

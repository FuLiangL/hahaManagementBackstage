<template>
    <!-- 女性魅力值 -->
    <!-- dom结构内容 -->
    <section>
        <!-- 工具条/头部的搜索条件搜索 -->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" style="overflow: hidden;">
                <el-form-item>
                    <div class="block">
                        <span class="registerTime">日期</span>
                        <el-date-picker v-model="formOne.startDate" type="date">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item>
                    <span>uid</span>
                    <el-input style="width:200px;" placeholder="请输入uid" v-model="uid" clearable>
                    </el-input>
                </el-form-item>

                <el-form-item class="search-span" style="float:right;">
                    <el-button id="searchBtn" type="primary" @click="getData(0)">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!-- 用户的数据展示列表 -->
        <template>
            <el-table :data="listData" v-loading="listLoading" border fit highlight-current-row style="width: 100%;" :height="tableHeight">
                <el-table-column prop="addtime" label="注册时间"></el-table-column>
                <el-table-column prop="uid" label="ID"></el-table-column>
                <el-table-column prop="anchor_level" :formatter="judgeAnchor" label="是否是主播"></el-table-column>
                <el-table-column prop="day_charm" label="当日魅力值"></el-table-column>
                <el-table-column prop="week_charm" label="前7天魅力值"></el-table-column>
                <el-table-column prop="month_charm" label="前30天魅力值" sortable></el-table-column>
                <el-table-column prop="charm_score" label="总魅力值"></el-table-column>
            </el-table>
            <!-- 工具条 -->
            <el-col :span="24" class="toolbar">
                <el-pagination layout="total,prev, pager, next,jumper" :page-size="20"  @current-change="handleCurrentChange" :current-page="page+1" :total=totalpage style="float:right; ">
                </el-pagination>
            </el-col>
        </template>
    </section>
</template>

<script>
import { allget } from "../../../api/api";
export default {
    data() {
        return {
            tableHeight: null, // table展示的页面的高度多少，第二页中对应高度
            formOne: {
                startDate: [new Date()] // 对应选择的日期,给默认时间180之前到现在
            },
            listData: [],
            formLabelWidth: "120px",
            listLoading: false,
            uid: null,
            page: 0,
            totalpage: 1000,
        };
    },
    methods: {
        //页面的页数
        handleCurrentChange(val) {
            //服务器的第一页是0 所以 这里要 -1
            this.page = val-1;
            this.getData();
        },
        // 获取数据
        getData(type) {
            var _this = this;
            _this.listLoading = true;
            if(type==0){
                _this.page = 0;
            }
            let url = "/User/getFemaleCharmList";
            let param = {
                page: this.page,
                date: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
                uid: this.uid
            };
            allget(param, url)
                .then(res => {
                    _this.listLoading = false;
                    if(res.data.ret){
                        _this.listData = res.data.data;
                    }else{
                        baseConfig.successTipMsg(_this, res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 是否是主播
        judgeAnchor(row) {
            return row.anchor_level == 0 ? "否" : "是";
        }
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

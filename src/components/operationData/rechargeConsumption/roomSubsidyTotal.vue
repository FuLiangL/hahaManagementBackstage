<template>
    <!-- 房间补贴统计 -->
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
                <el-form-item>
                    <span>展示类型</span>
                    <el-select style="width: 120px;" v-model="type">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="按月" value="1"></el-option>
                        <el-option label="按日" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <span>房间类型</span>
                    <el-select style="width: 120px;" v-model="room_type">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="家族房间" value="0"></el-option>
                        <el-option label="个人房间" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <span>房间ID</span>
                    <el-input style="width:120px;" clearable placeholder="房间ID" v-model="room_id">
                    </el-input>
                </el-form-item>
                <el-form-item class="search-span" style="float:right;">
                    <el-button id="searchBtn" type="primary" @click="getData(0)">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!-- 用户的数据展示列表 -->
        <template>
            <el-table :data="listData" v-loading="listLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" border fit highlight-current-row style="width: 100%;" :height="tableHeight">
                <el-table-column prop="date" label="日期/月份"></el-table-column>
                <el-table-column prop="total_ticket" label="全部流水"></el-table-column>
                <!-- <el-table-column prop="room_name" label="礼物流水"></el-table-column> -->
                <!-- <el-table-column prop="room_type"  label="其他流水"></el-table-column> -->
                <el-table-column prop="chat_ticket" label="补贴"></el-table-column>
            </el-table>
            <!-- 工具条 -->
            <el-col :span="24" class="toolbar">
                <el-pagination layout="total,prev, pager, next,jumper" :page-size="20" @current-change="handleCurrentChange" :current-page="page+1" :total=totalpage style="float:right; ">
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
                startDate: [new Date() - 7 * 24 * 60 * 60 * 1000, new Date()]
            },
            listData: [],
            formLabelWidth: "120px",
            listLoading: false,
            page: 0,
            totalpage: 1000,
            room_id: "",
            room_type: "",
            type: "",
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
            if (type == 0) {
                _this.page = 0;
            }
            let url = "/NewFamily/getRoomSubsidyTotalData";
            let param = {
                date_s: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
                date_e: baseConfig.changeDateTime(this.formOne.startDate[1], 0),
                room_type: this.room_type,
                room_id: this.room_id,
                page: this.page,
                type: this.type,
            };
            param.room_type == "" ? delete param.room_type : param.room_type = param.room_type;
            param.room_id == "" ? delete param.room_id : param.room_id = param.room_id;
            param.type == "" ? delete param.type : param.type = param.type;
            allget(param, url)
                .then(res => {
                    _this.listLoading = false;
                    if (res.data.ret) {
                        _this.listData = res.data.data;
                    } else {
                        baseConfig.successTipMsg(_this, res.data.msg);
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

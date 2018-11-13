<template>
    <!-- 流水补贴 -->
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
                    <span>房间类型</span>
                    <el-select style="width: 120px;" v-model="room_type">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="家族房间" value="0"></el-option>
                        <el-option label="个人房间" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <span>UID</span>
                    <el-input style="width:150px;" clearable placeholder="请输入uid" v-model="uid">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <span>房间ID</span>
                    <el-input style="width:150px;" clearable placeholder="房间ID" v-model="room_id">
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
                <el-table-column prop="create_time" label="发放时间"></el-table-column>
                <el-table-column prop="room_id" label="房间ID"></el-table-column>
                <el-table-column prop="room_name" label="房间名称"></el-table-column>
                <el-table-column prop="room_type" :formatter="judgeRoom" label="房间类型"></el-table-column>
                <el-table-column prop="owner_uid" label="发放对象UID"></el-table-column>
                <el-table-column prop="nickname" label="发放对象昵称"></el-table-column>
                <el-table-column prop="chat_ticket" label="发放补贴金额(聊票)"></el-table-column>
                <el-table-column prop="days" label="统计周期"></el-table-column>
                <el-table-column prop="rate" label="补贴比例">
                    <template slot-scope="scope">
                        <p>{{scope.row.rate}}%</p>
                    </template>
                </el-table-column>
                <el-table-column prop="chat_ticket" label="统计金额(聊票)">
                    <template slot-scope="scope">
                        <p>{{(scope.row.chat_ticket/(scope.row.rate*0.01)).toFixed(0)}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="is_give" label="审核状态">
                    <template slot-scope="scope">
                        <p v-if="scope.row.is_give == 0">待审核</p>
                        <p v-else-if="scope.row.is_give == 1" style="color: skyblue;">已通过</p>
                        <p v-else-if="scope.row.is_give == 2" style="color: #F56C6C;">已拒绝</p>
                    </template>
                </el-table-column>
                <el-table-column prop="operate_user" label="审核人"></el-table-column>
                <el-table-column prop="refuse_reason" label="拒绝原因"></el-table-column>
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
            uid: "",
            room_id: "",
            room_type: "",
        };
    },
    methods: {
        //页面的页数
        handleCurrentChange(val) {
            //服务器的第一页是0 所以 这里要 -1
            this.page = val - 1;
            this.getData();
        },
        judgeRoom(row) {
            if(row.room_type == 0){
                return "家族房间";
            }else if(row.room_type == 1){
                return "个人房间";
            }
        },
        // 获取数据
        getData(type) {
            var _this = this;
            _this.listLoading = true;
            if (type == 0) {
                _this.page = 0;
            }
            let url = "/NewFamily/getRoomSubsidyRecord";
            let param = {
                date_s: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
                date_e: baseConfig.changeDateTime(this.formOne.startDate[1], 0),
                room_type: this.room_type,
                owner_uid: this.uid,
                family_id: this.room_id,
                page: this.page
            };
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

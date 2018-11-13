<template>
    <!-- 房间封禁记录 -->
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
                    <span>房间UID</span>
                    <el-input style="width:120px;" placeholder="请输入内容" v-model="room_id" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <span>族长UID</span>
                    <el-input style="width:120px;" placeholder="请输入内容" v-model="owner_uid" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item style="float:right;margin-right: 100px;">
                    <el-button type="primary" @click="getTbData">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!-- 用户的数据展示列表 -->
        <template>
            <el-table ref="tableHeight" :data="listData" border fit highlight-current-row v-loading="listLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" style="width: 100%;" :height="tableHeight">
                <el-table-column prop="operate_time" label="操作时间"></el-table-column>
                <el-table-column prop="room_id" label="房间ID"></el-table-column>
                <el-table-column prop="room_name" label="房间名称"></el-table-column>
                <el-table-column prop="family_name" label="所属家族"></el-table-column>
                <el-table-column prop="owner_uid" label="族长UID"></el-table-column>
                <el-table-column prop="nickname" label="族长昵称"></el-table-column>
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">
                        <p v-if="scope.row.status==0">关闭</p>
                        <p v-else-if="scope.row.status==1">封禁</p>
                        <p v-else-if="scope.row.status==2">打开</p>
                    </template>
                </el-table-column>
                <el-table-column prop="reason" label="原因"></el-table-column>
                <el-table-column prop="operate_user" label="操作人"></el-table-column>
            </el-table>
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
            owner_uid: "",
        };
    },
    methods: {
        //页面的页数
        handleCurrentChange(val) {
            //服务器的第一页是0 所以 这里要 -1
            this.page = val - 1;
            this.getTbData();
        },
        judgeRoom(row) {
            if(row.room_type == 0){
                return "家族房间";
            }else if(row.room_type == 1){
                return "个人房间";
            }
        },
        // 获取数据
        getTbData() {
            var _this = this;
            _this.listLoading = true;
            let url = "/NewFamily/getLiveBroadCastKickRecord";
            let param = {
                date_s: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
                date_e: baseConfig.changeDateTime(this.formOne.startDate[1], 0),
                room_id: this.room_id,
                owner_uid: this.owner_uid,
                page: this.page
            };
            this.uid == null || this.uid == ""
                ? delete param.uid
                : (param.uid = this.uid);
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
    },
    mounted() {
        var _this = this;
        _this.tableHeight = baseConfig.lineNumber(searchPageHeight);
        _this.getTbData();
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

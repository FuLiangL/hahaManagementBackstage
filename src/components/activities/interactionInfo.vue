<template>
    <!-- 黑色情人节互动信息 -->
    <!-- dom结构内容 -->
    <section>
        <!-- 用户的数据展示列表 -->
        <template>
            <el-table :data="listData" border fit highlight-current-row style="width: 100%;" :height="tableHeight">
                <el-table-column prop="heart_time" label="时间"></el-table-column>
                <el-table-column prop="cp_uid" label="被心动嘉宾ID"></el-table-column>
                <el-table-column prop="cp_nickname" label="被心动嘉宾昵称"></el-table-column>
                <el-table-column prop="uid" label="心动人ID"></el-table-column>
                <el-table-column prop="nickname" label="心动人昵称"></el-table-column>
                <el-table-column prop="chat_gold" label="花费聊币"></el-table-column>
            </el-table>
        </template>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="total,prev,pager,next,jumper" @current-change="handleCurrentChange" :page-size="20" :total="totalpage" style="float:right;"></el-pagination>
        </el-col>
    </section>
</template>

<script>
import { allget } from "../../api/api";
import axios from "axios";
export default {
    data() {
        return {
            tableHeight: null, // table展示的页面的高度多少，第二页中对应高度
            formOne: {
                startDate: [new Date() - 100 * 24 * 60 * 60 * 1000, new Date()] // 对应选择的日期,给默认时间180之前到现在
            },
            listData: [],
            formLabelWidth: "120px",
            listLoading: false,
			page: 0,
            totalpage:1000,
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
        getData() {
            var _this = this;
            let url = "/NewActivity/getBothBlackLoverDataInfo";
            let param = {
                page: this.page
            };
            allget(param, url)
                .then(res => {
                    if(res.data.ret){
                        this.listData = res.data.data;
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
    },
    mounted() {
        this.tableHeight = pageHeight;
        this.getData();
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

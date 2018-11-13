<template>
    <!-- 情人节数据统计活动后台 -->
    <!-- dom结构内容 -->
    <section>
        <!-- 用户的数据展示列表 -->
        <template>
            <el-table :data="listData" border fit highlight-current-row style="width: 100%;" :height="tableHeight">
                <el-table-column prop="date" label="时间"></el-table-column>
                <el-table-column prop="num" label="今日报名人数"></el-table-column>
                <el-table-column prop="heart_num" label="今日心动人数"></el-table-column>
                <el-table-column prop="chat_gold" label="今日累计消费聊币"></el-table-column>
                <el-table-column prop="gift_two_num" label="么么哒送出个数"></el-table-column>
                <el-table-column prop="gift_one_num" label="金玫瑰送出个数"></el-table-column>
            </el-table>
        </template>
    </section>
</template>

<script>
import { allget } from "../../api/api.js";
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
        };
    },
    methods: {
        // 获取数据
        getData() {
            var _this = this;
            let url = "/NewActivity/getBlackLoverDataInfo";
            let param = {
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
        this.tableHeight = searchPageHeight;
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

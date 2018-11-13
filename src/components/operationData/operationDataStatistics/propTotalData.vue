<template>
    <!-- 道具统计 -->
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
                    <span>渠道</span>
                    <el-select v-model="channelId" multiple filterable collapse-tags style="margin-left: 20px;" placeholder="请选择">
                        <el-option v-for="(item, key) of channelData" :key="item" :label="item" :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <span>展示类型</span>
                    <el-select v-model="type">
                        <el-option label="按日展示" value="0"></el-option>
                        <el-option label="按月展示" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="search-span" style="float:right;">
                    <el-button id="searchBtn" type="primary" @click="getData()">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!-- 用户的数据展示列表 -->
        <template>
            <el-table :data="onePageTabData" border fit highlight-current-row style="width: 100%;" v-loading="listLoading" :height="tableHeight">
                <el-table-column v-if="judgeTime" prop="date" label="日期"></el-table-column>
                <el-table-column prop="prop_id" label="道具id"></el-table-column>
                <el-table-column prop="name" label="道具名称"></el-table-column>
                <el-table-column prop="get_num" label="获得数量"></el-table-column>
                <el-table-column prop="cost_num" label="消耗数量"></el-table-column>
                <el-table-column prop="remain_num" label="剩余数量"></el-table-column>
            </el-table>
            <!-- 工具条 -->
            <el-col :span="24" class="toolbar">
				<el-pagination layout="total,prev,pager,next,jumper" @current-change="handleCurrentChange" :page-size="20" :total="totalpage" style="float:right;"></el-pagination>
			</el-col>
        </template>
    </section>
</template>

<script>
import { allget } from "../../../api/api";
import store from "../../../vuex/store";
export default {
    data() {
        return {
            tableHeight: null, // table展示的页面的高度多少，第二页中对应高度
            formOne: {
                startDate: [new Date() - 1 * 24 * 60 * 60 * 1000, new Date()] // 对应选择的日期,给默认时间180之前到现在
            },
            listData: [],
            formLabelWidth: "120px",
            listLoading: false,
            channelData: {},
            channelId: null,
            listLoading: false,
            totalpage: null,
            page: 1,
            star: '0',
            end: '20',
            type: "",
            judgeTime: true,
        };
    },
    computed:{
		onePageTabData() {
			var _this = this;
			return _this.listData.slice(_this.star, _this.end);
		},
	},
    methods: {
        handleCurrentChange(val) {
			var _this = this;
			_this.page = val;
			_this.star = (_this.page-1)*20;
			_this.end = _this.star+20;
		},
        // 获取数据
        getData() {
            var _this = this;
            _this.listLoading = true;
            let url = "/NewProp/getPropTotalData";
            let param = {
                date_s: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
                date_e: baseConfig.changeDateTime(this.formOne.startDate[1], 0),
                channel: this.channelId.join(','),
                type: this.type
            };
            param.type == 1 ? _this.judgeTime = false : _this.judgeTime = true; 
            allget(param, url)
                .then(res => {
                    _this.listLoading = false;
                    if (res.data.ret) {
                        // 数据处理
                        for(var i = 0; i < res.data.data.length; i++ ){
                            for(var key in res.data.data[i]){
                                if(res.data.data[i][key] == null){
                                    res.data.data[i][key] = 0;
                                }
                            }
                        }
                        this.listData = res.data.data;
                        this.totalpage = this.listData.length;
                    } else {
                        baseConfig.errorTipMsg(this, res.data.msg);
                    }
                })
                .catch(err => {
                    baseConfig.errorTipMsg(this, err.data.msg);
                });
        },
    },
    mounted() {
        this.tableHeight = searchPageHeight;
        this.getData();
        var id = store.state.user.channelid.split(",");
        var name = store.state.user.channelname.split(","); 
        for(var i = 0; i<id.length; i++){
            this.channelData[id[i]] = name[i];
        }
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

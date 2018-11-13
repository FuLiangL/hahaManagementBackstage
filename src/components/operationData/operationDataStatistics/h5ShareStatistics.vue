<template>
    <!-- 分渠道数据 -->
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
                <el-form-item style="margin-left: 100px;">
                    <span>渠道</span>
                    <el-select v-model="channelId" multiple filterable collapse-tags style="margin-left: 20px;" placeholder="请选择">
                        <el-option v-for="(item, key) of channelData" :key="item" :label="item" :value="key">
                        </el-option>
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
                <el-table-column prop="time" label="日期"></el-table-column>
                <el-table-column prop="share" label="分享总次数"></el-table-column>
                <el-table-column prop="share_click" label="H5页总点击次数"></el-table-column>
                <el-table-column prop="share_click_people" label="H5页面点击人数"></el-table-column>
                <el-table-column prop="share_listen" label="播放次数"></el-table-column>
                <el-table-column prop="share_down" label="下载app按钮点击数"></el-table-column>
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
                startDate: [new Date() - 15 * 24 * 60 * 60 * 1000, new Date()] // 对应选择的日期,给默认时间180之前到现在
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
            let url = "/Voice/getShareHotVoiceLog";
            let param = {
                date_s: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
                date_e: baseConfig.changeDateTime(this.formOne.startDate[1], 0),
                channel: this.channelId.join(','),
            };
            allget(param, url)
                .then(res => {
                    _this.listLoading = false;
                    if (res.data.ret) {
                        // 数据处理
                        // var dataList = [];
                        // for(var i = 0; i < res.data.total_data.length; i++){
                        //     dataList.push(res.data.total_data[i])
                        //     for(var j = 0; j < res.data.channel_data.length; j++){
                        //         if(res.data.total_data[i].time == res.data.channel_data[j].time){
                        //             dataList.push(res.data.channel_data[j]);
                        //         }
                        //     }
                        // }
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
        // 时间转换
        timeTransform(oldValue){
            return baseConfig.changeTime(oldValue);
        }
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

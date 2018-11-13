<template>
    <!-- 录音分享卡片 -->
    <!-- dom结构内容 -->
    <section>
        <!-- 工具条/头部的搜索条件搜索 -->
        <el-tabs type="border-card">
            <el-tab-pane label="分享唱片制作">

            </el-tab-pane>
            <el-tab-pane label="分享唱片查询">
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true" style="overflow: hidden;">
                        <el-form-item>
                            <div class="block">
                                <span class="registerTime">日期</span>
                                <el-date-picker v-model="formOne.startDate" type="daterange" range-separator=" 至 " start-placeholder="开始日期" end-placeholder="结束日期">
                                </el-date-picker>
                            </div>
                        </el-form-item>
                        <el-form-item class="search-span" style="float:right;">
                            <el-button id="searchBtn" type="primary" @click="getData()">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <!-- 用户的数据展示列表 -->
                <template>
                    <el-table :data="onePageTabData" border fit highlight-current-row style="width: 100%;" v-loading="listLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :height="tableHeight">
                        <el-table-column prop="id" label="ID"></el-table-column>
                        <el-table-column prop="time" label="制作时间"></el-table-column>
                        <el-table-column prop="title" label="分享描述"></el-table-column>
                        <el-table-column label="分享图片" min-width="120" sortable>
                            <template slot-scope="scope">
                                <el-popover trigger="hover" placement="left">
                                    <img :src="scope.row.img_url" alt="" style="width:300px;height:300px;">
                                    <div slot="reference" class="name-wrapper">
                                        <img :src="scope.row.img_url" alt="" style="width:100px;height:100px;">
                                    </div>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column label="分享音频">
                            <template slot-scope="scope">
                                <div slot="reference" class="name-wrapper">
                                    <audio controls="controls" :src="scope.row.voice_url"></audio>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="voice_id" label="音频ID"></el-table-column>
                        <el-table-column prop="duration" label="音频时长(秒)"></el-table-column>
                        <el-table-column label="操作" min-width="120" class="operate">
                            <template slot-scope="scope">
                                <el-col :span="24">
                                    <el-button size="warning" type="info">生成分享截图</el-button>
                                </el-col>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 工具条 -->
                     <el-col :span="24" class="toolbar">
                        <el-pagination layout="total,prev,pager,next,jumper" @current-change="handleCurrentChange" :page-size="20" :total="totalpage" style="float:right;"></el-pagination>
                    </el-col>
                </template>
            </el-tab-pane>
        </el-tabs>

    </section>
</template>

<script>
import { allget } from "../../../api/api";
import axios from "axios";
export default {
    data() {
        return {
            tableHeight: null, // table展示的页面的高度多少，第二页中对应高度
            formOne: {
                startDate: [new Date() - 14 * 24 * 60 * 60 * 1000, new Date()] // 对应选择的日期,给默认时间180之前到现在
            },
            page: 1,
            totalpage: null,
            star: '0',
            end: '20',
            listData: [],
            totalpage: null,
            formLabelWidth: "100px",
            listLoading: false
        };
    },
    computed: {
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
        // 获取操作记录列表数据
        getData() {
            let _this = this;
            _this.listLoading = true;
            let url = "/Voice/getVoiceShareCard";
            let param = {
                date_s: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
                date_e: baseConfig.changeDateTime(this.formOne.startDate[1], 0)
            };
            allget(param, url)
                .then(res => {
                    if(res.data.ret){
                        _this.listLoading = false;
                        this.listData = res.data.data;
                        _this.totalpage = res.data.data.length;
                    }else{
                        baseConfig.warningTipMsg(_this, res.data.msg);
                    }                    
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 再次推荐
        dealVoiceOffData() {
            let _this = this;
            const id = row.id;
            const url = "/Voice/dealVoiceOffData";
            const params = {
                id: id
            };
            _this.listLoading = true;
            allget(params, url)
                .then(res => {
                    _this.listLoading = false;
                    if (res.data.ret) {
                        baseConfig.successTipMsg(_this, "已推荐");
                        _this.getData();
                    } else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                })
                .catch(function(error) {
                    baseConfig.errorTipMsg(_this, error);
                });
        },
        // 删除
        deleteVoiceComplain() {
            let _this = this;
            const id = row.id;
            const url = "/Voice/deleteVoiceComplain";
            const params = {
                id: id
            };
            _this.listLoading = true;
            allget(params, url)
                .then(res => {
                    _this.listLoading = false;
                    if (res.data.ret) {
                        baseConfig.successTipMsg(_this, "已删除");
                        _this.getData();
                    } else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                })
                .catch(function(error) {
                    baseConfig.errorTipMsg(_this, error);
                });
        }
    },
    mounted() {
        var _this = this;
        _this.tableHeight = baseConfig.lineNumber(tabSearchPageHeight);
        _this.getData();
    },
    updated() {
        var _this = this;
        //同一时间段，只能播放一条音频
        var audio = document.getElementsByTagName("audio");
        for (var i = 0; i < audio.length; i++) {
            audio[i].addEventListener("play", function() {
                for (var j = 0; j < audio.length; j++) {
                    if (audio[j] != this) {
                        //这里的this指向的是监听音频对象
                        audio[j].pause();
                    }
                }
            });
        }
    }
};
</script>

<style lang="css" scoped>
    .operate{
        text-align: center;
    }
</style>

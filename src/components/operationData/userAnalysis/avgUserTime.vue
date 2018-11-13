<template>
    <!-- 人均使用时长 -->
    <!-- dom结构内容 -->
    <section>
        <!-- 工具条/头部的搜索条件搜索 -->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px; over-flow:hidden;">
            <el-form :inline="true" style="overflow: hidden;" :model="formOne">
                <el-form-item>
                    <div class="block">
                        <span class="registerTime">日期</span>
                        <el-date-picker v-model="formOne.choiceDate" type="daterange" range-separator=" 至 " placeholder="选择日期范围"></el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item style="margin-left: 100px;">
                    <span>渠道</span>
                    <el-select v-model="channelId" multiple filterable collapse-tags style="margin-left: 20px;" placeholder="请选择">
                        <el-option v-for="(item, key) of channelData" :key="item" :label="item" :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="chartLineShow">折线图</el-button>
                    <el-button type="primary" @click="getTableData">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--用户的数据展示列表-->
       
        <template>
            <el-table ref="tableHeight" :data="onePageTabData" border v-loading="listLoading" style="width: 100%;" :height="tableHeight">
                <el-table-column prop="time" label="日期" sortable></el-table-column>
                <el-table-column prop="user_avg" label="人均使用时长(秒)" sortable></el-table-column>
                <el-table-column prop="num_avg" label="次均使用时长(秒)" sortable></el-table-column>
            </el-table>
            <!-- 折线图组建 -->
            <!-- 折线图 -->
            <el-dialog title="折线图" :visible.sync="dialogVisible" @open="show">
                <div class="chartLine" style="width: 100%;height: 600px;"></div>
            </el-dialog>
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-pagination layout="total,prev,pager,next,jumper" @current-change="handleCurrentChange" :page-size="20" :total="totalpage" style="float:right;"></el-pagination>
            </el-col>
        </template>
    </section>
</template>

<script>
/* 逻辑交互js内容 */
import Event from "./../../../public_js/event.js";
import { allget } from "../../../api/api";
import store from "../../../vuex/store";
import axios from "axios";
import echarts from "echarts";
export default {
    data() {
        return {
            tableHeight: null, // table展示的页面的高度多少
            // 搜索条件的组装字段
            formOne: {
                choiceDate: [new Date() - 15 * 24 * 60 * 60 * 1000, new Date()], // 对应选择的日期,给默认时间180之前到现在
                channel: [],
                options: []
            },
            listLoading: true, //动画加载时显示的动画
            tabData: [], //列表的所有数据，移除删除的功能用全部的数据进行移除
            totalpage: null, //下方工具条的总页数
            page: 1, //现在数据展示的页数，当返回的是全部的数据时，设置默认的页面为1
            star: "0", //每一页的开始数据
            end: "20", //每一页的结束数据
            channelId: null,
            channelData: {},
            dialogVisible: false,
            formLabelWidth: "120px", // 设置dialog弹框的宽度
            chartLineData: {
                //用于折线图绘制的数据
                title: {
                    text: "注册与激活"
                },
                tooltip: {
                    trigger: "axis"
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ["line", "bar"] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                legend: {
                    data: ["人均", "次均"]
                },
                xAxis: [
                    {
                        type: "category",
                        boundaryGap: false,
                        data: []
                    }
                ],
                yAxis: [
                    {
                        type: "value",
                        name: "时长（秒）",
                        axisLabel: {
                            formatter: "{value}"
                        }
                    },
                ],
                series: [
                    {
                        name: "人均",
                        type: "line",
                        data: []
                    },
                    {
                        name: "次均",
                        type: "line",
                        data: []
                    },
                ]
            },
        };
    },
    computed: {
        // 对某一页码展示某一页的数据，对返回的所有的数据进行切割处理，对当前的页码显示20条当前页码的数据
        onePageTabData() {
            var _this = this;
            return _this.tabData.slice(_this.star, _this.end);
        }
    },
    methods: {
        // 下方页数进行翻页的页码时，返回的是全部的数据，配合onePageTabData展示需要展示当前页面的数据
        handleCurrentChange(val) {
            // val指的是当前点击是第一页
            var _this = this;
            _this.page = val;
            _this.star = (_this.page - 1) * 20;
            _this.end = _this.star + 20;
        },
        // 搜索条件
        searchCondition() {
            var _this = this;
            var obj = {};
            obj.date_s = baseConfig.changeDateTime(
                _this.formOne.choiceDate[0],
                0
            );
            obj.date_e = baseConfig.changeDateTime(
                _this.formOne.choiceDate[1],
                0
            );
            (obj.channel = this.channelId.join(",")),
                (obj.sex = _this.formOne.sex);
            return obj;
        },
        // 获取数据列表
        getTableData() {
            var _this = this;
            _this.listLoading = true;
            var url = "/Base/getDurationAvg";
            var params = _this.searchCondition();
            // 如果得到的搜索为null，表示存在搜索条件为空，不进行数据请求
            if (params == null) {
                // 不进行数据请求,直接关闭掉加载的图层
                _this.listLoading = false;
            } else {
                // 进行get请求，(请求参数params, 请求地址url)
                allget(params, url)
                    .then(res => {
                        // 数据请求成功
                        _this.listLoading = false;
                        if (res.data.ret) {
                            _this.tabData = res.data.data;
                            _this.totalpage = res.data.data.length;

                            for (var i = res.data.data.length-1; i >= 0; i--) {
                                _this.chartLineData.xAxis[0].data.push(
                                    res.data.data[i].time.slice(5,10)
                                );
                                _this.chartLineData.series[0].data.push(
                                    this.tabData[i].user_avg
                                );
                                _this.chartLineData.series[1].data.push(
                                    this.tabData[i].num_avg
                                );
                            }
                        } else {
                            // 返回ret==0，非正常数据
                            baseConfig.errorTipMsg(_this, res.data.msg);
                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            }
        },
        show() {
            this.$nextTick(function() {
                this.chartLine = echarts.init(
                    document.querySelector(".chartLine")
                );
                document.querySelector(".chartLine").style.border =
                    "1px solid #4488BB";
                this.chartLine.setOption(this.chartLineData);
            });
        },
        // 折线图展示
        chartLineShow() {
            this.dialogVisible = true;
        }
    },
    mounted() {
        var _this = this;
        _this.tableHeight = baseConfig.lineNumber(searchPageHeight);
        _this.getTableData();
        var id = store.state.user.channelid.split(",");
        var name = store.state.user.channelname.split(",");
        for (var i = 0; i < id.length; i++) {
            this.channelData[id[i]] = name[i];
        }
    }
};
</script>

<style lang="css" scoped>
/* 页面样式css内容 */
#total_data {
    width: 50%;
    height: 30px;
    border: 1px solid red;
}
/* .el-row {
    margin-bottom: 20px;
} */
/* .el-col {
    border-radius: 4px;
} */
.bg-purple-dark {
    background: #99a9bf;
}
.bg-purple {
    background: #d3dce6;
}
.bg-purple-light {
    background: #e5e9f2;
}
.grid-content {
    /* border-radius: 4px; */
    border: 1px solid #fff;
    min-height: 36px;
    line-height: 36px;
    text-align: center;
}
.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}
</style>

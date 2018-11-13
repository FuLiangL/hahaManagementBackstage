<template>
    <!-- 房间功能标签使用统计 -->
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
                <el-form-item style="margin-left: 50px;">
                    <span>通话类型</span>
                    <el-select style="width: 120px;" v-model="room_type">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="家族" value="0"></el-option>
                        <el-option label="个人" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="search-span" style="float:right;">
                    <el-button id="searchBtn" type="primary" @click="getData(0)">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!-- 用户的数据展示列表 -->
        <template>
            <el-table :data="onePageTabData" border fit highlight-current-row v-loading="listLoading" style="width: 100%;" :height="tableHeight">
                <template v-for="col in cols">
                    <el-table-column :prop="col.prop" :label="col.label" :key="col.prop"></el-table-column>
                </template>
                
                <!-- <el-table-column prop="date" label="日期"></el-table-column>
                <el-table-column prop="1" label="推荐"></el-table-column>
                <el-table-column prop="2" label="相亲"></el-table-column>
                <el-table-column prop="3" label="娱乐"></el-table-column>
                <el-table-column prop="4" label="电台"></el-table-column>
                <el-table-column prop="5" label="同城"></el-table-column>
                <el-table-column prop="6" label="开黑"></el-table-column>
                <el-table-column prop="7" label="其他"></el-table-column> -->
            </el-table>
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-pagination layout="total,prev,pager,next,jumper" @current-change="handleCurrentChange" :page-size="20" :total="totalpage" style="float:right;"></el-pagination>
            </el-col>
            
        </template>
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
                startDate: [new Date() - 15 * 24 * 60 * 60 * 1000, new Date()] // 对应选择的日期,给默认时间180之前到现在
            },
            listData: [],
            formLabelWidth: "120px",
            listLoading: false,
            page: null,
            room_type: null,
            propList: [],
            totalpage: null,  
			page: 1,  
			star: '0',  
            end: '20',
            cols: [],  
        };
    },
    
	computed:{
		// 对某一页码展示某一页的数据，对返回的所有的数据进行切割处理，对当前的页码显示20条当前页码的数据
		onePageTabData() {
			var _this = this;
			return _this.listData.slice(_this.star, _this.end);
		},
	},
    methods: {
        handleCurrentChange(val) {
			// val指的是当前点击是第一页
			var _this = this;
			_this.page = val;
			_this.star = (_this.page-1)*20;
			_this.end = _this.star+20;
		},
        // 获取数据
        getData(type) {
            var _this = this;
            _this.listLoading = true;
            let param = _this.condition();
            let url = "/NewFamily/getRoomTabDataInfo";
            if (type == 0) {
                _this.page = 0;
            }
            allget(param, url)
                .then(res => {
                    _this.listLoading = false;
                    if (res.data.ret) {
                        /*根据标签接口动态获取标签position*/
                        var cap = [];
                        for (var i = 0; i < _this.propList.length; i++) {
                            cap.push(_this.propList[i].position);
                        }
                        /*将后台拿来的零散数据整合成一个json格式数据*/
                        var newData = [];
                        var ob = {};
                        for (var i = 0; i < res.data.data.length; i++) {
                            if (i == 0) {
                                ob.date = res.data.data[i].date;
                            }
                            var p = res.data.data[i].position;
                            if (ob.date == res.data.data[i].date) {
                                ob[p] = res.data.data[i].num;
                            } else {
                                newData.push(ob);
                                ob = {};
                                ob.date = res.data.data[i].date;
                                ob[p] = res.data.data[i].num;
                            }
                            if (i == res.data.data.length - 1) {
                                newData.push(ob);
                            }
                        }
                        /*根据上一步整合的数据，判断哪些标签没有数值，没有数值的position赋值为0*/
                        for (var i = 0; i < newData.length; i++) {
                            var newCap = [];
                            for (var key in newData[i]) {
                                if (key != "date") {
                                    newCap.push(key);
                                }
                            }
                            //没有的添加相应的pisition并赋值为0
                            for (var k = 0; k < cap.length; k++) {
                                if (newCap.indexOf(cap[k]) == "-1") {
                                    var cap_p = cap[k];
                                    newData[i][cap_p] = "0";
                                }
                            }
                        }
                        // 对newData this.propList处理得到 cols
                        this.cols = [{prop: 'date', label: '日期'}];
                        for(var i = 0; i<_this.propList.length;i++){
                            this.cols.push({
                                prop: _this.propList[i].position,
                                label: _this.propList[i].label_name,
                            })
                        }
                        this.listData = newData;
                        this.totalpage = newData.length;
                    } else {
                        baseConfig.errorTipMsg(this, res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 条件参数
        condition() {
            return {
                date_s: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
                date_e: baseConfig.changeDateTime(this.formOne.startDate[1], 0),
                room_type: this.room_type,
            };
        },
        // 获取标签列表
        getPropData() {
            var url = "/NewFamily/getRoomTabList";
            allget("", url)
                .then(res => {
                    if (res.data.ret) {
                        this.propList = res.data.data;
                        this.getData();
                    } else {
                        baseConfig.errorTipMsg(this, res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    },
    mounted() {
        this.tableHeight = baseConfig.lineNumber(searchPageHeight);

        this.getPropData();
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

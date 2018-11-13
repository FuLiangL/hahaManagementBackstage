<template>
	<!-- 通话数据汇总 -->
	<!-- dom结构内容 -->
	<section>
		<!-- 工具条/头部的搜索条件搜索 -->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" style="overflow: hidden;">
				<el-form-item>
					<div class="block" v-if="searchType==1">
						<span class="registerTime">日期</span>
						<el-date-picker v-model="formOne.startDate" type="daterange" range-separator=" 至 " start-placeholder="开始日期" end-placeholder="结束日期">
						</el-date-picker>
					</div>
					<div class="block" v-else-if="searchType==0">
						<span class="demonstration">月份</span>
						<el-date-picker v-model="formOne.month" type="month" placeholder="选择月">
						</el-date-picker>
					</div>
				</el-form-item>
				<el-form-item style="margin-left: 100px;">
					<span>查询类型</span>
					<el-select style="width: 150px;" v-model="searchType">
						<el-option label="按日查询" value="1"></el-option>
						<el-option label="按月查询" value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class="search-span" style="float:right;">
					<el-button id="searchBtn" type="primary" @click="getData()">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!-- 用户的数据展示列表 -->
		<template>
			<el-table :data="onePageTabData" border fit highlight-current-row v-loading="listLoading" style="width: 100%;" :height="tableHeight">
				<el-table-column prop="time" label="日期"></el-table-column>
				<el-table-column prop="totalrandcall" label="随机通话次数"></el-table-column>
				<el-table-column prop="totalrandtime" label="随机通话时间"></el-table-column>
				<el-table-column prop="totalrandmoney" label="随机通话消费"></el-table-column>
				<el-table-column prop="totalfriendcall" label="好友通话次数"></el-table-column>
				<el-table-column prop="totalfriendtime" label="好友通话时间" sortable></el-table-column>
				<el-table-column prop="totalfriendmoney" label="好友通话消费"></el-table-column>
				<el-table-column prop="totalredcall" label="网红通话次数"></el-table-column>
				<el-table-column prop="totalredtime" label="网红通话时间"></el-table-column>
				<el-table-column prop="totalredmoney" label="网红通话消费"></el-table-column>
				<el-table-column prop="totallistencall" label="偷听次数"></el-table-column>
				<el-table-column prop="totallistentime" label="偷听时间"></el-table-column>
				<el-table-column prop="totallistenmoney" label="偷听消费"></el-table-column>
				<el-table-column prop="totalcall" label="总的次数"></el-table-column>
				<el-table-column prop="totaltime" label="总的时间"></el-table-column>
				<el-table-column prop="totalmoney" label="总的消费"></el-table-column>
			</el-table>
			<el-col :span="24" class="toolbar">
				<el-pagination layout="total,prev,pager,next,jumper" @current-change="handleCurrentChange" :page-size="20" :total="totalpage" style="float:right;"></el-pagination>
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
				startDate: [new Date() - 7 * 24 * 60 * 60 * 1000, new Date()], // 对应选择的日期,给默认时间180之前到现在
				month: ""
            },
            listData: [],
            formLabelWidth: "120px",
            listLoading: false,
			searchType: "1",
			page: 1,
			totalpage: null,
			star: '0',
			end: '20',
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
        // 获取数据
        getData() {
			var _this = this;
			_this.listLoading = true;
            let url = "/Record/getCallData";
            let param = _this.condition();
            allget(param, url)
                .then(res => {
					_this.listLoading = false;
                    if (res.data.ret) {
                        // 对数据进行处理 时间转换为天 时 分
                        for (var i = 0; i < res.data.data.length; i++) {
                            res.data.data[i].totalrandtime = baseConfig.changeTime(
                                res.data.data[i].totalrandtime
                            );
                            res.data.data[i].totalredtime = baseConfig.changeTime(
                                res.data.data[i].totalredtime
                            );
                            res.data.data[i].totalfriendtime = baseConfig.changeTime(
                                res.data.data[i].totalfriendtime
                            );
                            res.data.data[i].totaltime = baseConfig.changeTime(
                                res.data.data[i].totaltime
                            );
                            res.data.data[i].totallistentime = baseConfig.changeTime(
                                res.data.data[i].totallistentime
                            );
                        }
						this.listData = res.data.data;
						this.totalpage = res.data.data.length;
                    } else {
                        baseConfig.errorTipMsg(this, res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                    baseConfig.errorTipMsg(this, "error");
                });
		},
		// 条件参数
		condition() {
			if(this.searchType==1){
				return {
                	date_s: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
                	date_e: baseConfig.changeDateTime(this.formOne.startDate[1], 0),
                	date: this.searchType
            	};
			}else {
				return{
					date_ms: baseConfig.changeDateTime(this.formOne.month, 2),
					date_me: baseConfig.changeDateTime(this.formOne.month, 2),
					date: this.searchType
				}
			}
		},
        // 时间转换
        time(time) {
            var dd = parseInt(time / 60 / 60 / 24);
            var hh = parseInt((time / 60 / 60) % 24);
            var mi = parseInt((time / 60) % 60);
            var ss = parseInt(time % 60);
            return dd + "天" + hh + "时" + mi + "分" + ss + "秒";
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

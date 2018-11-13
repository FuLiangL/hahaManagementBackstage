<template>
	<!-- 抢聊通话汇总 -->
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
				<el-form-item class="search-span" style="float:right;">
					<el-button id="searchBtn" type="primary" @click="getData()">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!-- 用户的数据展示列表 -->
		<template>
			<el-table :data="listData" v-loading="listLoading" border fit highlight-current-row style="width: 100%;" :height="tableHeight">
				<el-table-column prop="date" label="日期"></el-table-column>
				<el-table-column prop="total_num" label="发起次数"></el-table-column>
				<el-table-column prop="total_people" label="发起人数"></el-table-column>
				<el-table-column prop="total_success" label="接通次数"></el-table-column>
				<el-table-column prop="success_rate" label="接通率">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <P>{{(scope.row.success_rate*100).toFixed(2)+"%"}}</P>
                        </div>
                    </template>
                </el-table-column>
				<el-table-column prop="one_num" label="0~1分钟"></el-table-column>
				<el-table-column prop="three_num" label="1~3分钟"></el-table-column>
				<el-table-column prop="five_num" label="3~5分钟"></el-table-column>
				<el-table-column prop="ten_num" label="5~10分钟"></el-table-column>
				<el-table-column prop="thirty_num" label="10~30分钟"></el-table-column>
				<el-table-column prop="sixty_num" label="30~60分钟"></el-table-column>
				<el-table-column prop="sixtymore_num" label="大于60分钟"></el-table-column>
				<el-table-column prop="call_valid_times" label="有效通话次数"></el-table-column>
				<el-table-column prop="call_valid_long" label="有效通话时长">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <P>{{timeTransform(scope.row.call_valid_long)}}</P>
                        </div>
                    </template>
                </el-table-column>
				<el-table-column prop="total_long" label="总通话时长">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <P>{{timeTransform(scope.row.total_long)}}</P>
                        </div>
                    </template>
                </el-table-column>
				<el-table-column prop="total_avg_rate" label="总通话平均时长">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <P>{{timeTransform(scope.row.total_avg_rate)}}</P>
                        </div>
                    </template>
                </el-table-column>
				<el-table-column prop="total_cost" label="总通话消费"></el-table-column>
				<el-table-column prop="gift_money" label="总礼物消费"></el-table-column>
				<el-table-column prop="listen_money" label="偷听消费"></el-table-column>
				
			</el-table>
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
				startDate: [new Date() - 2 * 24 * 60 * 60 * 1000, new Date()], // 对应选择的日期,给默认时间180之前到现在
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
            _this.listLoading = true;
			let param = _this.condition();
            let url = "/Record/getChatOrder";
            allget(param, url)
                .then(res => {
                    _this.listLoading = false;
                    if (res.data.ret) {
                            for(var i = 0;i<res.data.data.length;i++){
                                res.data.data[i].avg = baseConfig.changeTime(res.data.data[i].listen_long/res.data.data[i].listen_success_times);
                            }
                        this.listData = res.data.data;
                    } else {
                        baseConfig.errorTipMsg(this, res.data.msg);
                    }
                })
                .catch(err => {
                    baseConfig.errorTipMsg(this, "error"); 
                });
		},
		// 条件参数
		condition() {
            return {
                date_s: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
                date_e: baseConfig.changeDateTime(this.formOne.startDate[1], 0),
            };
        },
        // 时间转换
        timeTransform(oldValue){
            return baseConfig.changeTime(oldValue);
        }
    },
    mounted() {
        var _this = this;
        _this.tableHeight = baseConfig.lineNumber(searchHeight);
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

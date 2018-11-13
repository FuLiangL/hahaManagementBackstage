<template>
	<!-- 随机通话汇总 -->
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
			<el-table :data="onePageTabData" border v-loading="listLoading" fit highlight-current-row style="width: 100%;" :height="tableHeight">
				<el-table-column prop="time" label="日期"></el-table-column>
				<el-table-column prop="totalrandcallaa" label="AA通话次数"></el-table-column>
				<el-table-column prop="totalnumaa" label="AA通话人数"></el-table-column>
				<el-table-column prop="totalrandtimeaa" label="AA通话时长">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <P>{{timeTransform(scope.row.totalrandtimeaa)}}</P>
                        </div>
                    </template>
                </el-table-column>
				<el-table-column prop="avgtimeaa" label="AA平均通话时长">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <P>{{timeTransform(scope.row.avgtimeaa)}}</P>
                        </div>
                    </template>
                </el-table-column>
				<el-table-column prop="totalrandcallab" label="AB通话次数"></el-table-column>
				<el-table-column prop="totalrandtimeab" label="AB通话时长">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <P>{{timeTransform(scope.row.totalrandtimeab)}}</P>
                        </div>
                    </template>
                </el-table-column>
				<el-table-column prop="totalnumab" label="AB通话人数"></el-table-column>
				<el-table-column prop="avgtimeab" label="AB平均通话时长">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <P>{{timeTransform(scope.row.avgtimeab)}}</P>
                        </div>
                    </template>
                </el-table-column>
				<el-table-column prop="atimes" label="A类发起数"></el-table-column>
				<el-table-column prop="woman_atimes" label="女方A类发起数"></el-table-column>
				<el-table-column prop="man_atimes" label="男方A类发起数"></el-table-column>
				<el-table-column prop="new_atimes" label="新用户A类发起数"></el-table-column>
				<el-table-column prop="old_atimes" label="老用户A类发起数"></el-table-column>
				<el-table-column prop="anums" label="A类发起人数"></el-table-column>
				<el-table-column prop="snums" label="匹配次数（服务端）"></el-table-column>
				<el-table-column prop="rate" label="失败率">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <P>{{(scope.row.rate*100).toFixed(2)+"%"}}</P>
                        </div>
                    </template>
                </el-table-column>
				<el-table-column prop="gift" label="礼物消费"></el-table-column>
				<el-table-column prop="one_num" label="0~1分钟"></el-table-column>
				<el-table-column prop="three_num" label="1~3分钟"></el-table-column>
				<el-table-column prop="five_num" label="3~5分钟"></el-table-column>
				<el-table-column prop="ten_num" label="5~10分钟"></el-table-column>
				<el-table-column prop="thirty_num" label="10~30分钟"></el-table-column>
				<el-table-column prop="sixty_num" label="30~60分钟"></el-table-column>
				<el-table-column prop="sixtymore_num" label="大于60分钟"></el-table-column>
				<el-table-column prop="totalcall" label="总通话次数"></el-table-column>
				<el-table-column prop="totaltime" label="总通话时长">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <P>{{timeTransform(scope.row.totaltime)}}</P>
                        </div>
                    </template>
                </el-table-column>
				<el-table-column prop="listen_valid_times" label="有效通话次数"></el-table-column>
				<el-table-column prop="listen_valid_long" label="有效通话时长">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <P>{{timeTransform(scope.row.listen_valid_long)}}</P>
                        </div>
                    </template>
                </el-table-column>
				<el-table-column prop="avgtime" label="平均通话时长">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <P>{{timeTransform(scope.row.avgtime)}}</P>
                        </div>
                    </template>
                </el-table-column>
			</el-table>
            <el-col :span="24" class="toolbar">
				<el-pagination layout="total,prev,pager,next,jumper" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="totalpage" style="float:right;"></el-pagination>
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
				startDate: [new Date() - 6 * 24 * 60 * 60 * 1000, new Date()], // 对应选择的日期,给默认时间180之前到现在
            },
            listData: [],
            formLabelWidth: "120px",
            listLoading: false,
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
			let param = _this.condition();
            let url = "/Record/getRandCallData";
            allget(param, url)
                .then(res => {
                    _this.listLoading = false;
                    if (res.data.ret) {
                        this.listData = res.data.data;
						_this.page = 1;
						_this.totalpage = res.data.data.length;
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
            };
        },
        // 时间转换
        timeTransform(oldValue){
            return baseConfig.changeTime(oldValue);
        }
    },
    filters: {
        numberTransform(value){
            return (value*100).toFixed(2);
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

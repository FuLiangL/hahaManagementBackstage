<template>
	<!-- 抢聊通话明细 -->
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
					<span>接受者：</span>
					<el-input style="width:150px;" placeholder="请输入接收者uid" v-model="uid_res" clearable>
                    </el-input>
				</el-form-item>
                <el-form-item>
					<span>发起者：</span>
					<el-input style="width:150px;" placeholder="请输入请求者的uid" v-model="uid_req" clearable>
                    </el-input>
				</el-form-item>
				<el-form-item class="search-span" style="float:right;">
					<el-button id="searchBtn" type="primary" @click="getData(0)">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!-- 用户的数据展示列表 -->
		<template>
			<el-table :data="listData" border fit highlight-current-row v-loading="listLoading" style="width: 100%;" :height="tableHeight">
				<el-table-column prop="create_time" label="日期"></el-table-column>
				<el-table-column prop="use_time" label="通话时长">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <P>{{timeTransform(scope.row.use_time)}}</P>
                        </div>
                    </template>
                </el-table-column>
				<el-table-column prop="uid" label="发起者id"></el-table-column>
				<el-table-column prop="competition_uid" label="接受者id"></el-table-column>
				<el-table-column prop="topic" label="话题" width="200"></el-table-column>
				<el-table-column prop="price" label="价格"></el-table-column>
				<el-table-column prop="city" label="城市"></el-table-column>
				<el-table-column prop="cost" label="通话流水"></el-table-column>
				<el-table-column prop="listen" label="偷听流水"></el-table-column>
				<el-table-column prop="gift" label="礼物流水"></el-table-column>
				<el-table-column prop="total" label="总流水"></el-table-column>
			</el-table>
            <!--翻页-->
			<el-col :span="24" class="toolbar">
				<el-pagination layout="total,prev,pager,next,jumper" :current-page="page+1" @current-change="handleCurrentChange" :page-size="20" :total="totalpage" style="float:right;"></el-pagination>
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
				startDate: [new Date() - 2 * 24 * 60 * 60 * 1000, new Date()], // 对应选择的日期,给默认时间180之前到现在
            },
            listData: [],
            formLabelWidth: "120px",
            listLoading: false,
            totalpage: 1000,
            page: 0,
            uid_res: '',
            uid_req: '',
        };
    },
    methods: {
        handleCurrentChange(val) {
			var _this = this;
			_this.page = val-1;
			_this.getData();
		},
        // 获取数据
        getData(type) {
            var _this = this;
            _this.listLoading = true;
			let param = _this.condition();
            let url = "/Record/getChatOrderInfo";
            if(type==0){
                _this.page = 0;
            }
            console.log(param)
            allget(param, url)
                .then(res => {
                    _this.listLoading = false;
                    if (res.data.ret) {
                        this.listData = res.data.data;
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
                uid_res: this.uid_res,
                uid_req: this.uid_req,
                page: this.page,
            };
        },
        // 时间转换
        timeTransform(oldValue){
            return baseConfig.changeTime(oldValue);
        },
        
        
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

<template>
	<!-- 用户投诉管理 -->
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
					<el-select v-model="channelId" multiple filterable collapse-tags style="width: 150px;" placeholder="请选择">
						<el-option v-for="(item, key) of channelData" :key="item" :label="item" :value="key">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<span>投诉类型</span>
					<el-select style="width: 100px;" v-model="content">
						<el-option label="全部" value=""></el-option>
						<el-option label="色情" value="1"></el-option>
						<el-option label="欺诈" value="2"></el-option>
						<el-option label="骚扰" value="3"></el-option>
						<el-option label="垃圾广告" value="4"></el-option>
						<el-option label="其他" value="5"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<span>UID</span>
					<el-input style="width:100px;" placeholder="请输入内容" v-model="find" clearable>
					</el-input>
				</el-form-item>
				<el-form-item>
					<span>处理状态</span>
					<el-select style="width: 100px;" v-model="status">
						<el-option label="全部" value=""></el-option>
						<el-option label="已忽略" value="1"></el-option>
						<el-option label="已警告" value="2"></el-option>
						<el-option label="已封号" value="3"></el-option>
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
				<el-table-column prop="id" label="投诉ID"></el-table-column>
				<el-table-column prop="time" label="投诉时间"></el-table-column>
				<el-table-column prop="uid" label="投诉人"></el-table-column>
				<el-table-column prop="complain_uid" label="被投诉人"></el-table-column>
				<el-table-column prop="long_time" label="封号时长"></el-table-column>
				<el-table-column prop="channel" label="渠道"></el-table-column>
				<el-table-column prop="num" label="投诉次数"></el-table-column>
				<el-table-column prop="warn_num" label="警告次数"></el-table-column>
				<el-table-column prop="content" label="投诉类型"></el-table-column>
				<el-table-column prop="explains" label="详细内容"></el-table-column>
				<el-table-column prop="evidences" label="图片">
					<template slot-scope="scope">
						<el-popover trigger="hover" v-if="changeData(scope.row.evidences)" placement="left">
							<img :src="changeData(scope.row.evidences)" alt="" style="width:300px;height:500px;">
							<div slot="reference" class="name-wrapper">
								<img :src="changeData(scope.row.evidences)" alt="" style="width:100px;height:100px;">
							</div>
						</el-popover>
					</template>
				</el-table-column>
				<el-table-column label="操作" min-width="120">
					<template slot-scope="scope">
						<div v-if="scope.row.status==1">已忽略</div>
						<div v-else-if="scope.row.status==2">已警告</div>
						<div v-else-if="scope.row.status==3">已封号</div>
						<el-row v-else-if="scope.row.status==0">
							<el-col :span="8">
								<el-button size="mini" type="success" @click="ignore(scope.$index, scope.row)">忽视</el-button>
							</el-col>
							<el-col :span="8">
								<el-button size="mini" type="warning" @click="warning(scope.$index, scope.row)">警告</el-button>
							</el-col>
							<el-col :span="8">
								<el-button size="mini" type="info" @click="dialogFormVisible = true, getter(scope.$index, scope.row)">封号</el-button>
							</el-col>
						</el-row>
					</template>
				</el-table-column>
			</el-table>
            <el-col :span="24" class="toolbar">
				<el-pagination layout="total,prev,pager,next,jumper" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="totalpage" style="float:right;"></el-pagination>
			</el-col>
		</template>
		<el-dialog title="封号" :visible.sync="dialogFormVisible">
			<el-form :model="form">
				<el-form-item label="封号时长" :label-width="formLabelWidth">
					<el-select v-model="form.time" placeholder="请选择封号时长">
						<el-option label="1天" value="1"></el-option>
						<el-option label="3天" value="3"></el-option>
						<el-option label="5天" value="5"></el-option>
						<el-option label="7天" value="7"></el-option>
						<el-option label="15天" value="15"></el-option>
						<el-option label="30天" value="30"></el-option>
						<el-option label="永远封号" value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="封号理由" :label-width="formLabelWidth">
					<el-input v-model="form.reason" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="title()">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="提示" :visible.sync="dialogtitle" width="30%">
			<span>请选择封号时长</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="dialogtitle = false">确 定</el-button>
			</span>
		</el-dialog>
	</section>
</template>

<script>
import { allget } from "../../../api/api";
import axios from "axios";
import store from "../../../vuex/store";
export default {
    data() {
        return {
            tableHeight: null, // table展示的页面的高度多少，第二页中对应高度
            formOne: {
                startDate: [new Date() - 1 * 24 * 60 * 60 * 1000, new Date()] // 对应选择的日期,给默认时间180之前到现在
            },
            recordStatus: "",
            listData: [],
            totalpage: null,
            formLabelWidth: "120px",
            listLoading: false,
            channelData: {},
            channelId: null,
            find: null,
            status: null,
            content: null,
            dialogFormVisible: false,
            formLabelWidth: "120px",
            form: {
                time: null,
                reason: null
            },
            totle: {
                complain: "",
                time: "",
                id: "",
                uid: ""
            },
			dialogtitle: false,
			operate_user: null,
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
        // 获取图片
        changeData(val){
            try{
                if(val==""){
                    return "";
                }else{
                    return JSON.parse(val)[0];
                }
            }
            catch(err){
                console.error("后台返回图片格式改了"+err);
            }
        },
        // 获取数据
        getData() {
            var _this = this;
            _this.listLoading = true;
            let url = "/NewUser/getComplain";
            let param = {
                date_s: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
                date_e: baseConfig.changeDateTime(this.formOne.startDate[1], 0),
                content: this.content,
                find: this.find,
                status: this.status,
                channel: this.channelId.join(","),
                operate_user: this.operate_user
            };
            allget(param, url)
                .then(res => {
                    _this.listLoading = false;
                    _this.listData = res.data.data;
                    _this.totalpage = res.data.data.length;
                    _this.page = 1;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 忽略
        ignore(index, row) {
            let url = "/NewUser/ignoreUserComplain";
            let param = {
                id: row.id
            };
            allget(param, url)
                .then(res => {
                    baseConfig.successTipMsg(_this, res.data.msg);
                })
                .catch(err => {
                    baseConfig.errorTipMsg(_this, res.data.msg);
                });
        },
        // 警告
        warning(index, row) {
            let url = "/NewUser/warnComplain";
            let param = {
                id: row.id,
                uid: row.complain_uid
            };
            allget(param, url)
                .then(res => {
                    if (res.data.ret) {
                        baseConfig.successTipMsg(_this, res.data.msg);
                    } else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                })
                .catch(err => {
                    baseConfig.errorTipMsg(_this, err.data.msg);
                });
        },
        // 点击封号的时候 获取相应的数值
        getter(index, row) {
            this.totle.complain = row.uid;
            this.totle.time = row.time;
            this.totle.id = row.id;
            this.totle.uid = row.complain_uid;
        },
        // 封号
        title(index, row) {
            var _this = this;
            let url = "/User/kickUser";
            let param = {
                complain: this.totle.complain,
                operate_user: this.operate_user,
                time: this.totle.time,
                id: this.totle.id,
                reason: this.form.reason,
                uid: this.totle.uid,
                day: this.form.time
            };
            if (param.day == "" || param.day == null) {
                _this.dialogtitle = true;
                return;
            }
            _this.dialogFormVisible = false;
            allget(param, url)
                .then(res => {
                    if (res.data.ret) {
                        baseConfig.successTipMsg(_this, res.data.msg);
                    } else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                })
                .catch(err => {
                    baseConfig.errorTipMsg(_this, err.data.msg);
                });
        }
    },
    mounted() {
        var _this = this;
        _this.tableHeight = baseConfig.lineNumber(searchPageHeight);
        _this.getData();
        var id = store.state.user.channelid.split(",");
        var name = store.state.user.channelname.split(",");
        for (var i = 0; i < id.length; i++) {
            _this.channelData[id[i]] = name[i];
        }
        _this.operate_user = store.state.user.name;
    },
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

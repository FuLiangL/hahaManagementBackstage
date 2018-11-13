<template>
    <!-- 账号封禁记录（可解禁） -->
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
                    <span>UID</span>
                    <el-input style="width:120px;" placeholder="请输入内容" v-model="find" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <span>昵称</span>
                    <el-autocomplete class="inline-input" v-model="nickname" :fetch-suggestions="querySearch" placeholder="请输入内容"></el-autocomplete>
                </el-form-item>
                <el-form-item class="search-span" style="float:right;">
                    <el-button id="searchBtn" type="primary" @click="getData()">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!-- 用户的数据展示列表 -->
        <template>
            <el-table :data="onePageTabData" border fit highlight-current-row style="width: 100%;" v-loading="listLoading" :height="tableHeight">
                <el-table-column prop="time" label="封禁时间"></el-table-column>
                <el-table-column prop="uid" label="UID"></el-table-column>
                <el-table-column prop="nickname" label="昵称"></el-table-column>
                <el-table-column prop="channel" label="渠道"></el-table-column>
                <el-table-column prop="day" label="封号时长"></el-table-column>
                <!-- <el-table-column prop="free_time" label="解封时间"></el-table-column> -->
                <el-table-column prop="reason" label="原因"></el-table-column>
                <el-table-column prop="operate_user" label="操作人"></el-table-column>
                <el-table-column label="操作" min-width="120">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status==0&&scope.row.type==1">已解封</div>
                        <div v-else-if="scope.row.status==1&&scope.row.type==1">已封号
                            <el-button style="margin-left: 5px;" plain size="mini" type="primary" @click="getter(scope.$index, scope.row)">解封</el-button>
                        </div>
                        <div v-else-if="scope.row.type==2">踢下线</div>
                        <div v-else-if="scope.row.type==3">封设备</div>
                    </template>
                </el-table-column>
            </el-table>
            <el-col :span="24" class="toolbar">
				<el-pagination layout="total,prev,pager,next,jumper" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="totalpage" style="float:right;"></el-pagination>
			</el-col>
        </template>
        <el-dialog title="封号" :visible.sync="dialogFormVisible">
            <el-form :model="reasonform">
                <el-form-item label="解封原因" placeholder="请输入解封原因，必填" :label-width="formLabelWidth">
                    <el-input v-model="reasonform.value" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="closeTitle()">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="dialogtitle" width="30%">
            <span>请填写解封原因</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogtitle = false">取 消</el-button>
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
            listData: [],
            formLabelWidth: "120px",
            listLoading: false,
            channelData: {},
            channelId: null,
            find: null,
            restaurants: [],
            nickname: null,
            dialogFormVisible: false,
            dialogtitle: false,
            operate_user: null,
            uid: null,
            reasonform: {
                value:""
            },
            nicknameObj: [],
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
            let url = "/NewUser/kickHistory";
            // 强制设置时间限制
            var timeInterval = this.formOne.startDate[1]-this.formOne.startDate[0];
            var timeFixed = 14*24*60*60*1000;
            if(timeInterval > timeFixed){
                baseConfig.warningTipMsg(_this, "服务器表示压力很大，请把时间设置在15天以内");
                _this.listLoading = false;
                return;
            }
            let param = {
                date_s: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
                date_e: baseConfig.changeDateTime(this.formOne.startDate[1], 0),
                // operate_user: this.operate_user,
                find: this.find,
                channel: this.channelId.join(","),
                nickname: this.nickname,
            };
            if( param.find != "" && param.find != null ){
                delete param.date_s;
                delete param.date_e;
                delete param.operate_user;
                delete param.channel;
                delete param.nickname;
            }
            allget(param, url)
                .then(res => {
                    _this.listLoading = false;
                    if(res.data.ret){
                        this.listData = res.data.data;
                        _this.totalpage = res.data.data.length;
                        _this.page = 1;
                        for(var i = 0;i < res.data.data.length; i++){
                            var timeObj = {}; 
                            timeObj.value = res.data.data[i].nickname;
                            _this.nicknameObj.push(timeObj);
                        }
                    }else{
                        baseConfig.errorTipMsg(_this, err.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 点击解封的时候 获取相应的数值
        getter(index, row) {
            this.dialogFormVisible = true;
            this.uid = row.uid;
        },
        // 解封
        closeTitle() {
            var _this = this;
            let url = "/NewUser/freeUser";
            let param = {
                uid: this.uid,
                operate_user: this.operate_user,
                reason: this.reasonform.value
            };
            if (param.reason == "" || param.reason == null) {
                _this.dialogtitle = true;
                return;
            }
            _this.dialogFormVisible = false;
            allget(param, url)
                .then(res => {
                    if (res.data.ret) {
                        baseConfig.successTipMsg(_this, res.data.msg);
                        _this.getData();
                    } else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                })
                .catch(err => {
                    baseConfig.errorTipMsg(_this, err.data.msg);
                });
        },
        // 模糊搜索功能
        querySearch(queryString, cb) {
            var restaurants = this.restaurants;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        loadAll(){
            return this.nicknameObj;
            
        },
    },
    mounted() {
        this.tableHeight = searchPageHeight;
        var id = store.state.user.channelid.split(",");
        var name = store.state.user.channelname.split(",");
        for (var i = 0; i < id.length; i++) {
            this.channelData[id[i]] = name[i];
        }
        this.operate_user = store.state.user.name;
        this.restaurants = this.loadAll();
        this.getData();
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

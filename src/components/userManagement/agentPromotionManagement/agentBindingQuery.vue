<template>
    <!-- 代理绑定查询 -->
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
                    <span>UID</span>
                    <el-input style="width:150px;" placeholder="请输入内容" v-model="searchUid">
                    </el-input>
                </el-form-item>
                <el-form-item style="margin-left: 200px;">
                    <el-button id="handBinding" type="primary" @click="dialogFormVisible = true ">手动绑定代理关系</el-button>
                </el-form-item>
                <el-form-item class="search-span" style="float:right;">
                    <el-button id="searchBtn" type="primary" @click="getData()">查询</el-button>
                </el-form-item>

            </el-form>
        </el-col>
        <!-- 用户的数据展示列表 -->
        <template>
            <el-table :data="listData" border fit highlight-current-row v-loading="listLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" style="width: 100%;" :height="tableHeight">
                <el-table-column prop="uid" label="UID"></el-table-column>
                <el-table-column prop="nickname" label="昵称"></el-table-column>
                <el-table-column prop="is_agent" :formatter="agentJudeg" label="是否为付费代理"></el-table-column>
                <el-table-column prop="wx_invite_uid" label="上级UID"></el-table-column>
                <el-table-column prop="agent_nickname" label="上级昵称"></el-table-column>
                <el-table-column prop="spread" label="推广用户数量">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <span>{{scope.row.spread}}</span>
                            <el-button v-if="scope.row.spread" type="primary" @click="dialogTableVisible = true, getDetailData(1, scope.row.uid)" size="mini" style="margin-left: 10px;">明细</el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="agent_1" label="一级代理数量">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <span>{{scope.row.agent_1}}</span>
                            <el-button v-if="scope.row.spread" type="primary" @click="dialogTableVisible = true, getDetailData(2, scope.row.uid)" size="mini" style="margin-left: 10px;">明细</el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="agent_2" label="二级代理数量">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <span>{{scope.row.agent_2}}</span>
                            <el-button v-if="scope.row.spread" type="primary" @click="dialogTableVisible = true, getDetailData(3, scope.row.uid)" size="mini" style="margin-left: 10px;">明细</el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" v-if="scope.row.wx_invite_uid!=0" @click="cancel(scope.$index, scope.row)">取消绑定</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <!-- Table -->
        <el-dialog title="明细列表" :visible.sync="dialogTableVisible" center>
            <el-table :data="detialData">
                <el-table-column property="addtime" label="注册时间"></el-table-column>
                <el-table-column property="uid" label="UID"></el-table-column>
                <el-table-column property="username" label="账号"></el-table-column>
                <el-table-column property="nickname" label="昵称"></el-table-column>
                <el-table-column property="is_agent" :formatter="agentJudeg" label="是否为付费代理"></el-table-column>
            </el-table>
        </el-dialog>
        <el-dialog title="代理关系绑定" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="被绑定者UID：" :label-width="formLabelWidth">
                    <el-input v-model="form.uid_str" auto-complete="off"></el-input>
                </el-form-item>
                <p class="bindingTitle">*多个之间用英文逗号分隔</p>
                <el-form-item label="绑定者UID：" :label-width="formLabelWidth">
                    <el-input v-model="form.uid" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false,handBinding()">确 定</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
	import { allget } from '../../../api/api';
	import axios from 'axios';
    import store from "../../../vuex/store";
    export default {
        data() {
            return {
				tableHeight: null, // table展示的页面的高度多少，第二页中对应高度
                formOne: {
                    startDate: [new Date()-1*24*60*60*1000, new Date()], // 对应选择的日期,给默认时间180之前到现在
				},
				page: 0,
				listData: [],
				formLabelWidth: '120px',
                listLoading: false,
                searchUid: null,
                dialogTableVisible: false,
                detialData: null,
                dialogFormVisible: false,
                form: {
                    uid_str: null,
                    uid: null,
                },
                operate_user: null,
                agentType: null,
            }
        },
		methods: {
			// 获取数据
			getData(type) {
                var _this = this;
                _this.listLoading = true;
                let url = '/Agent/getAgentBindQuery';
                // if(this.formOne.startDate==null){
                //     baseConfig.warningTipMsg(this, "请输入日期");
                //     return;
                // }
                this.formOne = {
                    startDate: [new Date()-1*24*60*60*1000, new Date()], // 对应选择的日期,给默认时间180之前到现在
                };
				let param ={
                    date_s: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
					date_e: baseConfig.changeDateTime(this.formOne.startDate[1], 0),
					uid: this.searchUid,
                }
                if(param.uid==null || param.uid==""){
                    baseConfig.errorTipMsg(_this,"请输入查询uid");
                    return;
                }else {
                    this.formOne = {}
                    delete param.date_s;
                    delete param.date_e;
                }
                // 请求测试服
				allget(param, url).then(res => {
                    _this.listLoading = false;
                    if(res.data.ret){
                        this.listData = [];
                        this.listData.push(res.data.data);
                    }else{
                        baseConfig.warningTipMsg(res.data.msg);
                    }
				}).catch(err => {
					console.log(err)
				})
            },
            agentJudeg(row, column) {
                if(row.is_agent==0){
                    return "否";
                }else if(row.is_agent==1){
                    return "是";
                }
            },
            getDetailData(type, uid) {
                var _this = this;
                let url = '/Agent/getAgentBindQueryDetailed';
                let param = {
                    type: type,
                    uid: uid
                }
                this.agentType = type;
                allget(param, url).then(res => {
					this.detialData = res.data.data;
				}).catch(err => {
					console.log(err)
				})
            },
            // 手动绑定代理关系
            handBinding() {
                var _this = this;
                let url = '/Agent/agentBindAction';
                let param = {
                    uid: this.form.uid,
                    uid_str: this.form.uid_str,
                    operate_user: this.operate_user,
                }
                allget(param, url).then(res => {
                    if(res.data.ret){
                        baseConfig.successTipMsg(this, res.data.msg);
                        this.form.uid = "";
                        this.form.uid_str = "";
                    }else{
                        baseConfig.warningTipMsg(this, res.data.msg);
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            // 取消绑定
            cancel(index, row) {
                let url = '/Agent/cancelAgentRelation';
                let param ={
                    agent_uid: row.wx_invite_uid,
                    uid: row.uid,
                    operate_user: this.operate_user,
                }
                allget(param, url).then(res => {
                    if(res.data.ret){
                        this.getDetailData(this.agentType,this.agent_uid);
                        baseConfig.successTipMsg(this, res.data.msg);
                    }else{
                        baseConfig.warningTipMsg(this, res.data.msg);
                    }
                }).catch(err => {
                    console.log(err);
                })
            }
		},
		mounted() {
			var _this = this;
            _this.tableHeight = baseConfig.lineNumber(searchHeight);
            this.operate_user = store.state.user.name;
		},
    }

</script>

<style lang="css" scoped>
.search-span {
    float: right;
}
#searchBtn {
    margin-right: 50px;
}
.bindingTitle {
    margin-left: 130px;
}
</style>

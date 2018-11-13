<template>
	<!-- 公开通话管理 -->
	<!-- dom结构内容 -->
	<section>
		<!-- 工具条/头部的搜索条件搜索 -->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" style="overflow: hidden;">
				<!-- <el-form-item>
					<div class="block">
						<span class="registerTime">日期</span>
						<el-date-picker v-model="formOne.startDate" type="daterange" range-separator=" 至 " start-placeholder="开始日期" end-placeholder="结束日期">
						</el-date-picker>
					</div>
				</el-form-item> -->
                <el-form-item>
					<span>通话类型</span>
					<el-select style="width: 100px;" v-model="callType">
						<el-option label="全部" value=""></el-option>
						<el-option label="AA通话" value="1"></el-option>
						<el-option label="AB通话" value="5"></el-option>
						<el-option label="网红通话" value="3"></el-option>
						<el-option label="好友通话" value="2"></el-option>
					</el-select>
				</el-form-item>
                <el-form-item>
					<span>UID/账号/昵称：</span>
					<el-input style="width:120px;" placeholder="请输入内容" v-model="uid" clearable>
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
				<el-table-column prop="chat_id" label="通话id"></el-table-column>
				<el-table-column prop="start_time" label="开始时间"></el-table-column>
				<el-table-column prop="chat_type" label="通话类型">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <p v-if="scope.row.chat_type==1||scope.row.chat_type==5||scope.row.chat_type==8">随机</p>
                            <p v-else-if="scope.row.chat_type==2">好友</p>
                            <p v-else-if="scope.row.chat_type==3">网红</p>									
                            <p v-else-if="scope.row.chat_type==6">抢聊</p>									
                        </div>
                    </template>
                </el-table-column>
				<el-table-column prop="uid_req" label="发起者UID"></el-table-column>
				<el-table-column prop="req_nickname" label="发起者昵称"></el-table-column>
				<el-table-column prop="uid_res" label="接受者UID"></el-table-column>
				<el-table-column prop="res_nickname" label="接受者昵称"></el-table-column>
				<el-table-column prop="gift" label="礼物流水"></el-table-column>
				<el-table-column prop="listen" label="偷听流水"></el-table-column>
				<el-table-column prop="num" label="偷听次数"></el-table-column>
				<el-table-column prop="priority_base" label="操作">
                    <template slot-scope="scope">
                        <div v-if="scope.row.priority_base>0" style="text-align: center;margin: 0 auto;">
                            <el-button type="primary" round size="mini" @click="sm(scope.$index, scope.row)">转为私密通话</el-button>
                            <el-button type="info" round size="mini">已优先</el-button>
                        </div>
                        <div v-else-if="scope.row.priority_base<=0" style="text-align: center;margin: 0 auto;">
                            <el-button type="primary" round size="mini" @click="sm(scope.$index, scope.row)">转为私密通话</el-button>
                            <el-button type="primary" round size="mini" style="margin-top: 4px;" @click="fir(scope.$index, scope.row)">优先被偷听</el-button>
                        </div>
                    </template>
                </el-table-column>
			</el-table>
            <!--翻页-->
			<el-col :span="24" class="toolbar">
				<el-pagination layout="total,prev,pager,next,jumper" @current-change="handleCurrentChange" :page-size="20" :current-page="page+1" :total="totalpage" style="float:right;"></el-pagination>
			</el-col>
		</template>
	</section>
</template>

<script>
import { allget } from "../../../api/api";
import axios from 'axios';
export default {
    data() {
        return {
            tableHeight: null, 
            listData: [],
            formLabelWidth: "120px",
            listLoading: false,
            callType: null,
            uid: null,
            totalpage: 1000,
            page: 0,
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
            let url = "/Record/getPublicCall";
            this.uid==null||this.uid==""?delete param.uid:param.uid=this.uid;
            this.callType==null||this.callType==""?delete param.callType:param.callType=this.callType;
            if(type==0){
                _this.page = 0;
            }
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
                chat_type: this.callType,
                find: this.uid,
                page: this.page,
            };
        },
        // 时间转换
        timeTransform(oldValue){
            return baseConfig.changeTime(oldValue);
        },
        // 转为私密
        sm(index, row){
            var _this = this;
            var url = "/Record/setSecret";
            var param = {
                chat_id: row.chat_id,
                id: row.id
            }
            allget(param, url).then(res => {
                if(res.data.ret) {
                    baseConfig.successTipMsg(_this, '成功！');
                    _this.getData();
                }else{
                    baseConfig.errorTipMsg(_this, res.data.msg);
                }
            }).catch(err => {
                baseConfig.errorTipMsg(_this, error);
            })
        },
        // 优先偷听
        fir(index, row){
            var _this = this;
            var url = '/Record/firstListen';
            var param = {
                id: row.id,
            }
            allget(param, url).then(res => {
                if(res.data.ret) {
                    baseConfig.successTipMsg(_this, '成功！');
                    _this.getData();
                }else{
                    baseConfig.errorTipMsg(_this, res.data.msg);
                }
            }).catch(err => {
                baseConfig.errorTipMsg(_this, error);
            })
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

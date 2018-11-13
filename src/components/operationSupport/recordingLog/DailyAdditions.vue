<template>
	<!-- 每日新增录音明细 -->
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
					<span>录音状态</span>
					<el-select style="width: 100px;" v-model="recordStatus">
						<el-option label="全部" value=""></el-option>
						<el-option label="未推荐" value="0"></el-option>
						<el-option label="已推荐" value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<span>录音形式</span>
					<el-select style="width: 100px;" v-model="recordStyle">
						<el-option label="全部" value="0"></el-option>
						<el-option label="付费" value="1"></el-option>
						<el-option label="免费" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<span>uid</span>
					<el-input style="width:100px;" placeholder="请输入内容" v-model="uid" clearable>
					</el-input>
				</el-form-item>
				<el-form-item>
					<span>录音id</span>
					<el-input style="width: 100px;" placeholder="请输入内容" v-model="audio_uid" clearable>
					</el-input>
				</el-form-item>
				<el-form-item class="search-span" style="float:right;">
					<el-button id="searchBtn" type="primary" @click="getData(0)">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!-- 用户的数据展示列表 -->
		<template>
			<el-table :data="listData" border fit highlight-current-row style="width: 100%;" v-loading="listLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :height="tableHeight">
				<el-table-column prop="time" label="发布时间"></el-table-column>
				<el-table-column prop="id" label="录音编码"></el-table-column>
				<el-table-column label="录音音频" width="300">
					<template slot-scope="scope">
						<div slot="reference" class="name-wrapper">
							<audio controls="controls" :src="scope.row.voice_url"></audio>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="release_num" label="发布次数"></el-table-column>
				<el-table-column prop="adoption_num" label="被采纳次数"></el-table-column>
				<el-table-column prop="recommend" label="再推荐次数"></el-table-column>
				<el-table-column prop="duration" label="录音时长"></el-table-column>
				<el-table-column prop="uid" label="发布者uid"></el-table-column>
				<el-table-column prop="content" label="录音描述"></el-table-column>
				<el-table-column prop="price" :formatter="price" label="形式" sortable></el-table-column>
				<el-table-column prop="listen" label="播放次数"></el-table-column>
				<el-table-column prop="praise" label="点赞数"></el-table-column>
				<el-table-column prop="relay" label="转播数"></el-table-column>
				<el-table-column prop="award" label="打赏数"></el-table-column>
				<el-table-column prop="share" label="分享数"></el-table-column>
				<el-table-column prop="complain" label="举报数"></el-table-column>
				<el-table-column label="操作" min-width="220">
					<template slot-scope="scope">
						<div v-if="scope.row.is_up_list==1">
							<el-col :span="8">
								<el-button size="mini" type="primary" @click="cacelRecommend(scope.$index, scope.row)">取消人工推荐</el-button>
							</el-col>
							<el-col :span="3">
								<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
							</el-col>
						</div>
						<div v-if="scope.row.is_up_list==2">
							<el-col :span="5">
								<el-button size="mini" type="primary" @click="cacelRecommend(scope.$index, scope.row)">取消系统推荐</el-button>
							</el-col>
							<el-col :span="5">
								<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
							</el-col>
						</div>
						<div v-if="scope.row.is_up_list==0">
							<el-col :span="5">
								<el-button size="mini" type="primary" @click="recommend(scope.$index, scope.row)">推荐</el-button>
							</el-col>
							<el-col :span="5">
								<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
							</el-col>
						</div>
						<div v-if="scope.row.is_review==0">
							<el-col :span="5">
								<el-button size="mini" type="success" @click="Auditing(scope.$index, scope.row)">审核</el-button>
							</el-col>
							<el-col :span="8">
								<el-button style="margin-right:10px;" size="mini" type="info" @click="showInfo(scope.$index, scope.row)">对方信息</el-button>
							</el-col>
						</div>
						<div v-if="scope.row.is_review==1">
							<el-col :span="5">
								<el-button size="mini" plain @click="tipInfo()">已审核</el-button>
							</el-col>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<!-- 工具条 -->
			<el-col :span="24" class="toolbar">
				<el-pagination layout="total,prev, pager, next,jumper" @current-change="handleCurrentChange" :page-size="20" :total=1000 :current-page="page+1" style="float:right; ">
				</el-pagination>
			</el-col>
			<el-dialog title="录音信息" :visible.sync="formInfo.dialogShow">
				<el-form :model="formInfo">
					<el-form-item label="发起通话者Uid" :label-width="formLabelWidth">
						<el-input v-model="formInfo.req_uid" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="接收通话者Uid" :label-width="formLabelWidth">
						<el-input v-model="formInfo.res_uid" auto-complete="off"></el-input>
					</el-form-item>
				</el-form>
			</el-dialog>
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
                startDate: [new Date() - 2 * 24 * 60 * 60 * 1000, new Date()] // 对应选择的日期,给默认时间180之前到现在
                // endDate: [new Date()-180*24*60*60*1000, new Date()], // 对应选择的日期,给默认时间180之前到现在
            },
            formInfo: {
                dialogShow: false,
                req_uid: "",
                res_uid: ""
            },
            recordStatus: "",
            recordStyle: "",
            page: 0,
            listData: [],
            uid: "",
            audio_uid: "",
            totalpage: null,
            formLabelWidth: "120px",
            listLoading: false,
        };
    },
    methods: {
        //页面的页数
        handleCurrentChange(val) {
            //服务器的第一页是0 所以 这里要 -1
            this.page = val - 1;
            this.getData();
        },
        // 获取数据
        getData(type) {
			var _this = this;
			_this.listLoading = true;
            if (type == 0) {
                _this.page = 0;
            }
            let url = "/Voice/getVoiceListInfo";
            let param = {
                page: this.page,
                date_s: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
                date_e: baseConfig.changeDateTime(this.formOne.startDate[1], 0),
                is_up_list: this.recordStatus,
                price: this.recordStyle,
                uid: this.uid,
                id: this.audio_uid
            };
            allget(param, url)
                .then(res => {
					_this.listLoading = false;
					if(res.data.ret){
						this.listData = res.data.data;
					}else{
						baseConfig.warningTipMsg(_this, res.data.msg);
					}
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 提示已审核
        tipInfo() {
            var _this = this;
            baseConfig.warningTipMsg(_this, "已审核了！");
        },
        // 录音形式
        price(row) {
            return row.price > 0 ? "付费" : "免费";
        },
        // 取消推荐
        cacelRecommend(index, row) {
            var _this = this;
            var id = row.id;
            var url = "/Voice/cancelRecommendVoiceToHot";
            var params = {
                id: id
            };
            _this.listLoading = true;
            allget(params, url)
                .then(res => {
                    _this.listLoading = false;
                    if (res.data.ret) {
                        baseConfig.successTipMsg(_this, "取消成功！");
                        _this.getData();
                    } else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                })
                .catch(function(error) {
                    baseConfig.errorTipMsg(_this, err.data.msg);
                });
        },
        // 推荐操作
        recommend(index, row) {
            var _this = this;
            var id = row.id;
            var url = "/Voice/recommendVoiceToHot";
            var params = {
                id: id
            };
            _this.listLoading = true;
            allget(params, url)
                .then(res => {
                    _this.listLoading = false;
                    if (res.data.ret) {
                        baseConfig.successTipMsg(_this, "推荐成功！");
                        _this.getData();
                    } else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                })
                .catch(function(error) {
                    baseConfig.errorTipMsg(_this, error);
                });
        },
        // 删除
        handleDelete(index, row) {
            var _this = this;
            var id = row.id;
            var url = "/Voice/deleteVoice";
            var params = {
                id: id
            };
            _this.listLoading = true;
            allget(params, url)
                .then(res => {
                    _this.listLoading = false;
                    if (res.data.ret) {
                        baseConfig.successTipMsg(_this, "删除成功");
                        _this.getData();
                    } else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                })
                .catch(function(error) {
                    baseConfig.errorTipMsg(_this, error);
                });
        },
        // 显示对方信息
        showInfo(index, row) {
            var _this = this;
            var call_record_id = row.call_record_id;
            var url = "/Voice/getVoiceOther";
            var params = {
                id: call_record_id
            };
            _this.listLoading = true;
            allget(params, url)
                .then(res => {
                    _this.listLoading = false;
                    if (res.data.ret) {
                        _this.formInfo.req_uid = res.data.data.uid_req;
                        _this.formInfo.res_uid = res.data.data.uid_res;
                        _this.formInfo.dialogShow = true;
                    } else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                })
                .catch(function(error) {
                    baseConfig.errorTipMsg(_this, error);
                });
        },
        // 审核操作
        Auditing(index, row) {
            var _this = this;
            var id = row.id;
            var url = "/Voice/reviewVoice";
            var params = {
                id: id
            };
            _this.listLoading = true;
            allget(params, url)
                .then(res => {
                    _this.listLoading = false;
                    if (res.data.ret) {
                        baseConfig.successTipMsg(_this, "审核成功！");
                        _this.getData();
                    } else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                })
                .catch(function(error) {
                    baseConfig.errorTipMsg(_this, error);
                });
        }
    },
    mounted() {
        var _this = this;
        _this.tableHeight = baseConfig.lineNumber(searchPageHeight);
        _this.getData();
    },
    updated() {
        var _this = this;
        //同一时间段，只能播放一条音频
        var audio = document.getElementsByTagName("audio");
        for (var i = 0; i < audio.length; i++) {
            audio[i].addEventListener("play", function() {
                for (var j = 0; j < audio.length; j++) {
                    if (audio[j] != this) {
                        //这里的this指向的是监听音频对象
                        audio[j].pause();
                    }
                }
            });
        }
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

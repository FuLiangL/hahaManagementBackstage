<template>
    <!-- 分享页推荐录音列表 -->
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
                <el-form-item class="search-span">
                    <el-button type="primary" @click="openRecordingRecommend">新增录音推荐</el-button>
                </el-form-item>
                <el-form-item class="search-span" style="float:right;">
					<el-button id="searchBtn" type="primary" @click="getData()">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!-- 用户的数据展示列表 -->
		<template>
			<el-table :data="listData" border fit highlight-current-row v-loading="listLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" style="width: 100%;" :height="tableHeight">
				<el-table-column prop="time" label="添加时间"></el-table-column>
				<el-table-column prop="share_sort"  label="序号"></el-table-column>
				<el-table-column prop="id" label="录音编码" ></el-table-column>
                <el-table-column label="录音内容" width="300">
					<template slot-scope="scope">
						<div slot="reference" class="name-wrapper">
							<audio controls="controls" :src="scope.row.voice_url"></audio>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="uid" label="发布者ID"></el-table-column>
				<el-table-column prop="content"  label="录音描述"></el-table-column>
				<el-table-column prop="share_listen" label="累积播放次数"></el-table-column>
				<el-table-column label="操作" min-width="120">
					<template slot-scope="scope">
                        <el-col :span="12"><el-button size="small" type="danger" @click="cancleRecommend(scope.$index, scope.row)">取消推荐</el-button></el-col>
					</template>
				</el-table-column>
			</el-table>
			<!-- 工具条 -->
			<!-- <el-col :span="24" class="toolbar">
				<el-pagination layout="total,prev, pager, next,jumper" @current-change="handleCurrentChange" :page-size="20" :total=1000 :current-page="page+1" style="float:right; ">
				</el-pagination>
			</el-col> -->
            <el-dialog title="" class="recordPopup" :visible.sync="dialogFormVisible" center style="text-align:center;">
				<el-form :model="formInfo">
					<el-form-item label="录音序号：" :label-width="formLabelWidth">
						<el-input auto-complete="off" id="withdraw_money" v-model="withdrawMoneyValue" style="width:240px;" placeholder="越大越靠前"></el-input>
					</el-form-item>
					<el-form-item label="录音编码：" :label-width="formLabelWidth">
						<el-input auto-complete="off" id="withdraw_day" v-model="withdrawDayValue" style="width:240px;" placeholder="保证准确"></el-input>
					</el-form-item>
                    <el-form-item label="基础人数：" :label-width="formLabelWidth">
						<el-input auto-complete="off" id="numpeople" v-model="numpeopleValue" style="width:240px;" placeholder="假的收听人数"></el-input>
					</el-form-item>
				</el-form>
                <span slot="footer" id="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addShareHotVoice()">确 定</el-button>
                </span>
			</el-dialog>
		</template>
    </section>
</template>

<script>
	import { allget } from '../../../api/api';
	import axios from 'axios';
    export default {
        data() {
            return {
				tableHeight: null, // table展示的页面的高度多少，第二页中对应高度
                formOne: {
                    startDate: [new Date()-14*24*60*60*1000, new Date()], // 对应选择的日期,给默认时间180之前到现在
				},
				page: 0,
				listData: [],
				totalpage:null,
				formLabelWidth: '100px',
                listLoading: false,
                formInfo: {

                },
                dialogFormVisible: false,
				withdrawMoneyValue: "",
				withdrawDayValue: "",
				numpeopleValue: "",
				listLoading: false,
            }
        },
		methods: {
			//页面的页数
			handleCurrentChange(val) {
				//服务器的第一页是0 所以 这里要 -1
				this.page = val-1;
				this.getData();
			},
			// 获取数据
			getData() {
				let _this = this;
				_this.listLoading = true;
				let url = '/Voice/getShareHotVoiceData';
				let param ={
					date_s: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
					date_e: baseConfig.changeDateTime(this.formOne.startDate[1], 0),
				}
				allget(param, url).then(res => {
					_this.listLoading = false;
					if(res.data.ret){
						this.listData = res.data.data;
					}else{
						baseConfig.warningTipMsg(res.data.msg);
					}
				}).catch(err => {
					console.log(err)
				})
            },
			// 添加推荐
			addShareHotVoice() {
				let _this = this;
				let url = '/Voice/addShareHotVoice';
				let param ={
					id: _this.withdrawMoneyValue,
					share_sort: withdrawDayValue,
					cheat_listen: numpeopleValue
				}
				_this.listLoading = true;
				allget(params, url).then(res => {
					_this.listLoading = false;
					if(res.data.ret) {
						baseConfig.successTipMsg(_this, '已推荐成功');						
						_this.getData();
					} else {
						baseConfig.errorTipMsg(_this, res.data.msg);
					}
				}).catch(function(error){
					baseConfig.errorTipMsg(_this, error);
				})
			},
            // 取消推荐
            cancleRecommend() {
                let _this = this;
				const id = row.id;
				const url = '/Voice/cancelShareHotVoiceData';
				const params = {
					id: id,
				};
				_this.listLoading = true;				
				allget(params, url).then(res => {
					_this.listLoading = false;
					if(res.data.ret) {
						baseConfig.successTipMsg(_this, '已取消');						
						_this.getData();
					} else {
						baseConfig.errorTipMsg(_this, res.data.msg);
					}
				}).catch(function(error){
					baseConfig.errorTipMsg(_this, error);
				})
            },
            // 取消弹窗
            cancleDialogFormVisible() {
                this.dialogFormVisible = false;
            },
            // 打开录音推荐
            openRecordingRecommend() {
                this.dialogFormVisible = true;
            }
		},
		mounted() {
			var _this = this;
			_this.tableHeight = baseConfig.lineNumber(searchHeight);
			_this.getData();
		}
    }

</script>

<style lang="css" scoped>
    #searchBtn{
        margin-right: 50px;
    }
	.recordPopup{
		 text-align: center;
		 width: 1000px;
		 margin: 0 auto;
	}
	#dialog-footer{
		text-align: center;
		margin: 0 auto;
	}
	.el-dialog__footer{
		text-align: center;
	}
</style>

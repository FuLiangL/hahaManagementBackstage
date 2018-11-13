<template>
    <!-- IM消息统计 -->
    <!-- dom结构内容 -->
    <section>
        <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane label="打招呼数据汇总" name="first">
                <!-- 打招呼数据汇总 -->
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true" style="overflow: hidden;">
                        <el-form-item>
                            <span>性别</span>
                            <el-select style="width: 200px;" v-model="sex">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="男" value="1"></el-option>
                                <el-option label="女" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <span>UID</span>
                            <el-input style="width:100px;" placeholder="请输入内容" v-model="uid" clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item style="float:right;margin-right: 100px;">
                            <el-button type="primary" @click="getTbData">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <!--用户的数据展示列表-->
				<template>
					<el-table ref="tableHeight" :data="onePageTabData" border fit highlight-current-row v-loading="listLoading" style="width: 100%;" :height="tableHeight">
						<el-table-column prop="uid" label="uid"></el-table-column>
						<el-table-column prop="nickname" label="昵称"></el-table-column>
						<el-table-column prop="sex" :formatter="judgeSex" label="性别"></el-table-column>
						<el-table-column prop="match_people" label="匹配人数"></el-table-column>
						<el-table-column prop="read_people" label="已读人数"></el-table-column>
						<el-table-column prop="new_reply_people" label="对方回复"></el-table-column>
						<el-table-column prop="reply_people" label="自己二次回复"></el-table-column>
						<el-table-column prop="add_pond_time" label="入池时间"></el-table-column>
					</el-table>
                    <el-col :span="24" class="toolbar">
                        <el-pagination layout="total,prev,pager,next,jumper" @current-change="handleCurrentChange" :current-page="page" :page-size="20" :total="totalpage" style="float:right;"></el-pagination>
                    </el-col>
				</template>
            </el-tab-pane>
            <el-tab-pane label="打招呼数据详情" name="second">
                <!-- 打招呼数据详情 -->
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
                            <el-input style="width:100px;" placeholder="请输入内容" v-model="uid1" clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item style="float:right;margin-right: 100px;">
                            <el-button type="primary" @click="getTbData1">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <!--用户的数据展示列表-->
				<template>
					<el-table ref="tableHeight" :data="onePageTabData1" border fit highlight-current-row v-loading="listLoading1" style="width: 100%;" :height="tableHeight">
						<el-table-column prop="date" label="日期"></el-table-column>
						<el-table-column prop="uid" label="uid"></el-table-column>
						<el-table-column prop="match_num" label="匹配人数"></el-table-column>
						<el-table-column prop="read_num" label="已读人数"></el-table-column>
						<el-table-column prop="new_reply_num" label="对方回复"></el-table-column>
						<el-table-column prop="reply_num" label="自己二次回应人数"></el-table-column>
					</el-table>
                    <el-col :span="24" class="toolbar">
                        <el-pagination layout="total,prev,pager,next,jumper" @current-change="handleCurrentChange1" :current-page="page1" :page-size="20" :total="totalpage1" style="float:right;"></el-pagination>
                    </el-col>
				</template>
            </el-tab-pane>
        </el-tabs>
    </section>
</template>
<script>
import {allget} from '../../../api/api';
export default {
    data() {
        return {
            sex: "",
            uid: "",
            uid1: "",
            listData: [],
            listData1: [],
            listLoading: false,
            tableHeight: null,
            activeName: "first",
			page: 1,
			totalpage: null,
			star: '0',
            end: '20',
            page1: 1,
			totalpage1: null,
			star1: '0',
			end1: '20',
            formOne: {
				startDate: [new Date() - 7 * 24 * 60 * 60 * 1000, new Date()], // 对应选择的日期,给默认时间180之前到现在
            },
            listLoading: false,
            listLoading1: false,
        };
    },
	computed: {
		onePageTabData() {
			var _this = this;
			return _this.listData.slice(_this.star, _this.end);
		},
		onePageTabData1() {
			var _this = this;
			return _this.listData1.slice(_this.star1, _this.end1);
		},
	},
    methods: {
		handleCurrentChange(val) {
			var _this = this;
            _this.page = val;
			_this.star = (_this.page-1)*20;
			_this.end = _this.star+20;
        },
		handleCurrentChange1(val) {
			var _this = this;
			_this.page1 = val;
			_this.star1 = (_this.page1-1)*20;
			_this.end1 = _this.star1+20;
		},
        getTbData() {
            var _this = this;
            _this.listLoading = true;
            let url = '/User/sayHelloData';
            let param = {
                sex: this.sex,
                uid: this.uid,
            }
            allget(param, url).then(res => {
                _this.listLoading = false;
                if(res.data.ret){
                    _this.listData = res.data.data;
                    _this.totalpage = res.data.data.length;
                    _this.page = 1;
                }else{
                    baseConfig.errorTipMsg(this, res.data.msg);
                }
            }).catch(err => {
                console.log(err)
            })
        },
        getTbData1(){
            var _this = this;
            _this.listLoading1 = true;
            let url = '/User/sayHelloInfo';
            let param = {
                date_s: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
                date_e: baseConfig.changeDateTime(this.formOne.startDate[1], 0),
                uid: this.uid1,
            }
            this.uid1==null||this.uid1==""?delete param.uid1:param.uid1=this.uid1;
            allget(param, url).then(res => {
                _this.listLoading1 = false;
                if(res.data.ret){
                    this.listData1 = res.data.data;
                    _this.totalpage1 = res.data.data.length;
                    _this.page1 = 1;
                }else{
                    baseConfig.errorTipMsg(this, res.data.msg);
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 判断男女
        judgeSex(row){
            return row.sex==1?"男":"女";
        }
    },
    mounted() {
        this.tableHeight = tabSearchPageHeight;
        this.getTbData();        
        this.getTbData1();        
    }
};
</script>
<style lang="css" scoped>

</style>


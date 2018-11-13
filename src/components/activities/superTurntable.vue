<template>
	<!-- 超级转盘 -->
	<section>
		<el-col :span="24" class="toolbar" style="padding-bottom:0px;">
			<el-form :inline="true" :model="formOne">
				<el-form-item>
					<span>类型</span>
					<el-select style="width: 120px;" v-model="formOne.type">
						<el-option label="全部" value="0"></el-option>
						<el-option label="付费转盘" value="1"></el-option>
						<el-option label="转盘小卡" value="2"></el-option>
						<el-option label="转盘大卡" value="3"></el-option>
					</el-select>
				</el-form-item>
                <el-form-item>
					<el-button 
                    type="primary" 
                    @click="getTableData">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--用户的数据展示列表-->
		<template>
			<el-table 
            ref="tableHeight" 
            :data="onePageTabData" 
            border fit highlight-current-row 
            v-loading="listLoading" 
            style="width: 100%;" :height="tableHeight">
				<el-table-column 
                prop="time" 
                label="时间" 
                sortable></el-table-column>
				<el-table-column prop="num" label="转转盘总次数"></el-table-column>
				<el-table-column prop="cost" label="转盘花费豆币"></el-table-column>
				<el-table-column prop="chat_gold" label="转盘送出豆币"></el-table-column>
				<el-table-column prop="one" label="礼物一转出数"></el-table-column>
				<el-table-column prop="two" label="礼物二转出数"></el-table-column>
				<el-table-column prop="three" label="礼物三转出数"></el-table-column>
				<el-table-column prop="four" label="礼物四转出数"></el-table-column>
				<el-table-column prop="five" label="礼物五转出数"></el-table-column>
				<el-table-column prop="six" label="礼物六转出数"></el-table-column>
				<el-table-column prop="seven" label="礼物七转出数"></el-table-column>
				<el-table-column prop="eight" label="礼物八转出数"></el-table-column>
			</el-table>
			<el-col :span="24" class="toolbar">
				<el-pagination 
                layout="total,prev,pager,next,jumper" 
                @current-change="oneHandleCurrentChange" 
                :page-size="20" :total="formOne.totalPage" 
                style="float:right;"></el-pagination>
			</el-col>
		</template>
	</section>
</template>

<script>
/* 逻辑交互js内容 */
import Event from './../../public_js/event.js';
import { allget } from '../../api/api';
import store from '../../vuex/store';
import axios from 'axios';
export default {
	data() {
		return {
			tableHeight: null,
			formOne: {
                type: "0",
                tabData: [],
                totalPage: null,
                page: 1,
                star: '0',
                end: '20',
			},
			listLoading: false,
		};
    },
    computed: {
        onePageTabData() {
            var _this = this;
            return _this.formOne.tabData.slice(_this.formOne.star, _this.formOne.end);
        },
    },
	methods: {
		// 下方页数进行翻页的页码时
		oneHandleCurrentChange(val) {
			// val指的是当前点击是第一页
			var _this = this;
            val = val-1;
            _this.formOne.page = val;
            _this.formOne.star = (_this.formOne.page)*20;
            _this.formOne.end = _this.formOne.star+20;
		},
		// 获取数据列表
		getTableData() {
			var _this = this ;
			_this.listLoading = true;
            var url = baseConfig.server+baseConfig.requestUrl+'/NewActivity/getSuperGodTurnTableData';
			var params = {
                type: _this.formOne.type,
            };
            axios.get(url, { params: params })
            .then((res) => {
                _this.listLoading = false;
                var arr = [];
                if(res.data.ret) {
                    for(var i=0; i<res.data.data.length; i++) {
                        var obj = {};
                        for(var key in res.data.data[i]) {
                            obj.time = key;
                            obj.one = res.data.data[i][key].one;
                            obj.two = res.data.data[i][key].two;
                            obj.three = res.data.data[i][key].three;
                            obj.four = res.data.data[i][key].four;
                            obj.five = res.data.data[i][key].five;
                            obj.six = res.data.data[i][key].six;
                            obj.seven = res.data.data[i][key].seven;
                            obj.eight = res.data.data[i][key].eight;
                            obj.cost = res.data.data[i][key].cost;
                            obj.chat_gold = res.data.data[i][key].chat_gold;
                            obj.num = res.data.data[i][key].num;
                        }
                        arr.push(obj);
                    }
                    console.log(arr);
                    _this.formOne.totalPage = arr.length;
                    _this.formOne.tabData = arr;
                }
                else {
                    baseConfig.errorTipMsg(_this, res.data.msg);
                }
            })
            .catch((err) => {
                console.log(err);
            });
		},
	},
	mounted() {
		var _this = this;
		this.$nextTick(function() {
			_this.tableHeight = searchPageHeight;
			_this.getTableData();
		});
	}
};
</script>

<style lang="css" scoped>
</style>

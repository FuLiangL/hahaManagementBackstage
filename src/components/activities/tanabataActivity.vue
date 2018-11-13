<template>
	<!-- 七夕活动 -->
	<section>
		<!--用户的数据展示列表-->
		<template>
			<el-table ref="tableHeight" :data="formOne.tabData" border fit highlight-current-row v-loading="listLoading" style="width: 100%;" :height="tableHeight">
				<el-table-column prop="id" label="ID" width="100"></el-table-column>
				<el-table-column prop="uid" label="用户UID" width="200"></el-table-column>
				<el-table-column prop="content" label="内容"></el-table-column>
				<el-table-column prop="praise" label="点赞数" width="120"></el-table-column>
				<el-table-column prop="create_time" label="发布时间" width="200"></el-table-column>
				<el-table-column prop="is_recommend" label="道具发布" width="120">
                    <template slot-scope="scope">
                        <p v-if="scope.row.is_recommend == 1">是</p>
                        <p v-else>否</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
					<template slot-scope="scope">
						<el-button type="danger" size='mini'  @click.native.prevent="deleteData(scope.$index,scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- <el-col :span="24" class="toolbar">
				<el-pagination layout="total,prev,pager,next,jumper" @current-change="oneHandleCurrentChange" :page-size="20" :total="formOne.totalPage" style="float:right;"></el-pagination>
			</el-col> -->
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
            var url = baseConfig.server+baseConfig.requestUrl+'/NewActivity/getSevenEveningMessage';
			var params = {};
            axios.get(url, { params: params })
            .then((res) => {
                _this.listLoading = false;
                var arr = [];
                if(res.data.ret) {
                    _this.formOne.tabData = res.data.data;
                }
                else {
                    baseConfig.errorTipMsg(_this, res.data.msg);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        },
        deleteData(index, rows){
            var _this = this;
            var url = 'NewActivity/delSevenEveningMessage';
			var params = {
				id: rows.id,
            };
            console.log(params)
			axios.get(baseConfig.server+baseConfig.requestUrl+url, { params: params })
			.then((res) => {
				_this.listLoading = false;	
				if(res.data.ret) {
					baseConfig.successTipMsg(_this, res.data.msg);
					_this.getTableData();
				} else {
					baseConfig.errorTipMsg(_this, res.data.msg); // 返回ret==0，非正常数据
				}
			}).catch((error) => {
				console.log(error);
			});
        }
	},
	mounted() {
		var _this = this;
		this.$nextTick(function() {
			_this.tableHeight = leftNavHeight;
			_this.getTableData();
		});
	}
};
</script>

<style lang="css" scoped>
</style>

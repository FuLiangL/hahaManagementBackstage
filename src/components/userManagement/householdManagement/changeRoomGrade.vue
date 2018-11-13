<template>
	<!-- 修改房间等级 -->
	<!-- dom结构内容 -->
	<section>
		<!-- 工具条/头部的搜索条件搜索 -->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" style="overflow: hidden;" :model="formOne">
				<el-form-item>
					<div class="block">
						<span class="registerTime">日期</span>
						<el-date-picker v-model="formOne.choiceDate" type="daterange" range-separator=" 至 " placeholder="选择日期范围"></el-date-picker>
					</div>
				</el-form-item>
                <el-form-item>
                    <span>房间类型</span>
                    <el-select style="width: 120px;" v-model="formOne.room_type">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="家族房间" value="0"></el-option>
                        <el-option label="个人房间" value="1"></el-option>
                    </el-select>
                </el-form-item>
				<el-form-item>
					<el-input placeholder="房间ID" style="width: 120px;" v-model="formOne.room_id" auto-complete="off"></el-input>
				</el-form-item>
                <el-form-item style="float:right;">
					<el-button type="primary" @click="dialogFormVisible=true;">修改房间等级</el-button>
					<el-button type="primary" @click="getTableData">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--用户的数据展示列表-->
		<template>
			<el-table ref="tableHeight" :data="tabData" border fit highlight-current-row v-loading="listLoading" style="width: 100%;" :height="tableHeight">
				<el-table-column prop="room_id" label="房间ID" width="80" ></el-table-column>
				<el-table-column prop="room_name" label="房间名称" width="80" ></el-table-column>
				<el-table-column prop="room_type" label="房间类型" width="250">
                    <template slot-scope="scope">
                        <p v-if="scope.row.room_type == 0">家族房间</p>
                        <p v-else-if="scope.row.room_type == 1">个人房间</p>
                    </template>
                </el-table-column>
				<el-table-column prop="before_level" label="修改前等级" width="80" ></el-table-column>
				<el-table-column prop="after_level" label="修改后等级" min-width="100" ></el-table-column>
				<el-table-column prop="operate_user" label="操作人" min-width="100" ></el-table-column>
				<el-table-column prop="operate_time" label="操作时间" min-width="100"></el-table-column>
			</el-table>
			<!--工具条-->
			<el-col :span="24" class="toolbar">
				<el-pagination layout="total,prev,pager,next,jumper" @current-change="handleCurrentChange" :page-size="20" :total="totalpage" style="float:right;"></el-pagination>
			</el-col>
		</template>
		<!-- 新增--对应的dialog -->
		<el-dialog title="修改房间等级" :visible.sync="dialogFormVisible">
			<el-form :model="formTwo">
				<p style="color: red;margin-left: 120px;">用户须知：</p>
				<p style="color: red;margin-left: 120px;">1、请注意个人和家族房间等级的上下限！</p>
				<el-form-item label="房间ID" :label-width="formLabelWidth">
					<el-input v-model="formTwo.room_id" auto-complete="off"></el-input>
				</el-form-item>
                <el-form-item label="修改为：" :label-width="formLabelWidth">
					<el-input v-model="formTwo.level" placeholder="请输入要修改为的等级" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addSure(0)">取 消</el-button>
				<el-button type="primary" @click="addSure(1)">确 定</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
/* 逻辑交互js内容 */
import Event from './../../../public_js/event.js';
import { allget } from './../../../api/api';
import store from './../../../vuex/store';
import axios from 'axios';
export default {
	data() {
		return {
			tableHeight: null, // table展示的页面的高度多少
			operate_user: '', // 当前进入的用户
			// 搜索条件的组装字段
			formOne: {
				choice: "",
				choiceDate: [new Date()-30*24*60*60*1000, new Date()], // 对应选择的日期,给默认时间180之前到现在
				type: '0', 
				room_id: '',
				room_name: '',
			},
			formTwo: {
				room_id: '',
				level: '',
			},
			listLoading: false, 
			tabData: [], 
			totalpage: 1000,  
			page: 0, 
			dialogFormVisible: false, 
			formLabelWidth: '130px', 
		};
	},
	methods: {
		// 下方页数进行翻页的页码时
		handleCurrentChange(val) {
            this.page = val - 1;
            this.getTableData();
		},
		// 搜索条件
		searchCondition() {
			var _this = this;
			var obj = {};
			obj.room_type = _this.formOne.room_type;
			obj.room_id = _this.formOne.room_id;
			obj.page = _this.page;
			obj.date_s = baseConfig.changeDateTime(_this.formOne.choiceDate[0], 0);
			obj.date_e = baseConfig.changeDateTime(_this.formOne.choiceDate[1], 0);
			return obj; // return出组装好的搜索条件
		},
		// 确定了新增传递过来对应的内容值(val对应的值：0->取消，1->确认)
		addSure(val) {
			var _this = this;
			if(val==0) {
				// 点击了取消按钮
                _this.dialogFormVisible = false; 
                _this.formTwo.room_id = ""; 
                _this.formTwo.level = ""; 
			} else if(val==1) {
				// 点击了确认按钮
				// console.log('点击了确认按钮');
                _this.listLoading = true;
                var url = "/NewFamily/changeRoomLevel";
                var param = {
                    room_id: _this.formTwo.room_id,
                    level: _this.formTwo.level,
                    operate_user: _this.operate_user,
                }
                if(_this.formTwo.room_id == "" || _this.formTwo.level == "") {
                    baseConfig.normalTipMsg(_this, '请输入相应的信息！');
                    return;
                }
                allget(param, url)
                    .then(res => {
                        _this.listLoading = false;
                        if (res.data.ret) {
                            baseConfig.successTipMsg(_this, '修改成功！');
                            _this.dialogFormVisible = false;
                            _this.getTableData();
                        } else {
                            baseConfig.errorTipMsg(_this, res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
			} 
		},
		// 获取数据列表
		getTableData() {
			var _this = this ;
			_this.listLoading = true;
			var url = '/NewFamily/getChangeRoomLevelRecord';
			var params = _this.searchCondition();
			// 如果得到的搜索为null，表示存在搜索条件为空，不进行数据请求
			if(params==null) {
				// 不进行数据请求,直接关闭掉加载的图层
				_this.listLoading = false;
			} else {
				axios.get(baseConfig.server+baseConfig.requestUrl+url, { params: params })		
				.then(res => {
					// 数据请求成功
					_this.listLoading = false;
					if(res.data.ret) {
						// 正常数据
						// _this.totalpage = res.data.data.length;
						_this.tabData = res.data.data;
					} else {
						// 返回ret==0，非正常数据
						baseConfig.errorTipMsg(_this, res.data.msg);
					}
				}).catch(function(error){
					console.log(error);
				})
			}
		},
	},
	mounted() {
		var _this = this;
		this.$nextTick(function() {
			_this.tableHeight = baseConfig.lineNumber(searchPageHeight);
            _this.getTableData();
            this.operate_user = store.state.user.name;
		})
	}
};
</script>

<style lang="css" scoped>
/* 页面样式css内容 */
.excelBox{
	width: 500px; height: 270px; margin-left: -150px; background: #f1f7ff;
	position: absolute; left: 50%; top: 15%; z-index: 1000;
}
p{ margin: 0; }
.excelBox>p{
	width: 100%; height: 50px; line-height: 50px; font-weight: bold;
	background: #e3efff; text-align: center;
}
.excelBox .excelInput{
	width: 100%; height: 60px;
}
.excelBox .select{
	width: 100%; height: 80px;
}
.excelBox .excelInput p,
.excelBox .select p{
	width: 100%; height: 36px; text-indent: 20px; line-height: 36px;
}
.excelBox .excelInput input{
    width: 300px; display: block; margin: 0 auto;
}
.excelBox .select>div{
	width: 300px; display: block; margin: 0 auto;
}
.btns{
    width: 100%; height: 50px;
}
.btns button{
    width: 80px; height: 40px; text-align: center; line-height: 40px;
    border: none; border-radius: 5px;
    background-color: #78B2FF; margin-top: 20px; color: #fff;
}
.btns button:nth-of-type(1){
    margin-left: 150px; cursor: pointer;
}
.btns button:nth-of-type(2){
    margin-left: 50px; cursor: pointer;
}
</style>

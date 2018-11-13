<template>
	<!-- 录音标签管理 -->
	<!-- dom结构内容 -->
	<section>
		<!-- 工具条/头部的搜索条件搜索 -->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" style="overflow: hidden;">
                <el-form-item>
					<el-button type="primary" @click="dialogFormVisible=true;">新增标签</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--用户的数据展示列表-->
		<template>
			<el-table ref="tableHeight" :data="tabData" border fit highlight-current-row v-loading="listLoading" style="width: 100%;" :height="tableHeight">
				<el-table-column prop="tab_name" label="标签名称"  sortable ></el-table-column>
				<el-table-column prop="create_time" label="添加日期" sortable ></el-table-column>
				<el-table-column prop="sort" label="当前排序" sortable ></el-table-column>
				
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="danger" @click.native.prevent="deleteOneUserData(scope.$index, tabData)" size="small">删除</el-button>
						<el-button type="primary" @click.native.prevent="editOneUserData(scope.$index, tabData)" size="small">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!--工具条-->
			<el-col :span="24" class="toolbar">
				<el-pagination layout="total,prev,pager,next,jumper" @current-change="handleCurrentChange" :page-size="20" :total="totalpage" style="float:right;"></el-pagination>
			</el-col>
            <el-dialog title="新增标签" :visible.sync="dialogFormVisible">
                <el-form :model="form">
                    <el-form-item label="标签名称：" :label-width="formLabelWidth">
                        <el-input v-model="form.tab_name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="标签sort：" placeholder="标签名称" :label-width="formLabelWidth">
                        <el-input v-model="form.sort" placeholder="sort"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addHomeTab()">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="编辑标签" :visible.sync="formTwo.dialogFormVisible">
                <el-form :model="formTwo">
                    <el-form-item label="标签名称：" :label-width="formLabelWidth">
                        <el-input v-model="formTwo.tab_name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="标签sort：" placeholder="标签名称" :label-width="formLabelWidth">
                        <el-input v-model="formTwo.sort" placeholder="sort"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="formTwo.dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="sureEditUser()">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog  title="提示" :visible.sync="deleteInfo.dialogVisible"  width="30%">
                <span>确定要删除？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="deleteInfo.dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="sureDelete()">确 定</el-button>
                </span>
            </el-dialog>
		</template>
		
	</section>
</template>

<script>
/* 逻辑交互js内容 */
import Event from './../../../public_js/event.js';
import { allget } from '../../../api/api';
import store from '../../../vuex/store';
import axios from 'axios';
export default {
	data() {
		return {
			tableHeight: null, // table展示的页面的高度多少
			form: {
				tab_name: '',
				sort: '',
            },
            formTwo: {
                dialogFormVisible: false,
                tab_name: "",
                sort: "",
                id: "",
            },
            deleteInfo: {
                dialogVisible: false,
                id: "",
            },
			listLoading: false, //动画加载时显示的动画
			tabData: [], //列表的所有数据，移除删除的功能用全部的数据进行移除
			totalpage: null, //下方工具条的总页数 
			page: 1, //现在数据展示的页数，当返回的是全部的数据时，设置默认的页面为1
			star: '0', //每一页的开始数据
			end: '20', //每一页的结束数据
			dialogFormVisible: false, // 控制dialog弹框的显示和隐藏
			formLabelWidth: '120px', // 设置dialog弹框的宽度
		};
	},
	methods: {
		// 下方页数进行翻页的页码时，返回的是全部的数据，配合onePageTabData展示需要展示当前页面的数据
		handleCurrentChange(val) {
			// val指的是当前点击是第一页
			var _this = this;
			_this.page = val;
			_this.star = (_this.page-1)*20;
			_this.end = _this.star+20;
		},
	
	
		// 获取数据列表
		getTableData() {
			var _this = this ;
			_this.listLoading = true;
			var url = '/Voice/getVoiceTab';
            allget("", url).then(res=>{
                _this.listLoading = false;
                if(res.data.ret){
                    _this.tabData = res.data.data;
                    _this.totalpage = res.data.data.length;
                }else{
                    baseConfig.errorTipMsg(_this, res.data.msg);
                }
            }).catch(err=>{
                console.log(err);
            })
		},
        // 新增标签页
        addHomeTab() {
            var _this = this;
            var url = '/Voice/addVoiceTab';
            var param = {
                tab_name: _this.form.tab_name,
                sort: _this.form.sort,
            }
            allget(param, url).then(res=>{
                if(res.data.ret){
                    baseConfig.normalTipMsg(_this, res.data.msg);
                    _this.dialogFormVisible = false;
                    _this.getTableData();
                }else{
                    baseConfig.errorTipMsg(_this, res.data.msg);
                }
            }).catch(err=>{
                console.log(err);
            })
        },
        // 编辑标签页
        editOneUserData(index, row){
            this.formTwo.tab_name = row[index].tab_name;
            this.formTwo.sort = row[index].sort;
            this.formTwo.id = row[index].id;
            this.formTwo.dialogFormVisible = true;
        },
        sureEditUser(){
            var _this = this;
            var url = "/Voice/editVoiceTab";
            var param = {
                tab_name: this.formTwo.tab_name,
                sort: this.formTwo.sort,
                id: this.formTwo.id,
            }
            allget(param, url).then(res=>{
                if(res.data.ret){
                    _this.formTwo.dialogFormVisible = false;
                    baseConfig.normalTipMsg(_this, res.data.msg);
                    _this.getTableData();
                }else{
                    baseConfig.errorTipMsg(_this, res.data.msg);
                }
            }).catch(err=>{
                console.log(err);
            })
        },
        // 删除
        deleteOneUserData(index, row) {
            this.deleteInfo.id = row[index].id;
            this.deleteInfo.dialogVisible = true;    
        },
        sureDelete(){   
            var _this = this;
            var url = "/Voice/delVoiceTab";
            var param = {
                id: this.deleteInfo.id
            }
            allget(param, url).then(res => {
                if(res.data.ret){
                    _this.deleteInfo.dialogVisible = false;
                    baseConfig.normalTipMsg(_this, res.data.msg);
                    _this.getTableData();
                }else{
                    baseConfig.errorTipMsg(_this, res.data.msg);
                }
            }).catch(err => {
                console.log(err);
            })
        }
	},
	mounted() {
		var _this = this;
		this.$nextTick(function() {
			_this.tableHeight = baseConfig.lineNumber(searchPageHeight);
			_this.getTableData();
		})
	}
};
</script>

<style lang="css" scoped>
</style>

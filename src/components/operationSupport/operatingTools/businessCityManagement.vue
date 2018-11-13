<template>
	<!-- 商城管理 -->
	<section>
		<el-col :span="24" class="toolbar" style="padding-bottom:0px;">
			<el-form :inline="true" style="overflow: hidden;">
				<el-form-item>
					<span>商品类型</span>
					<el-select v-model="formOne.type">
						<el-option label="道具" value="1"></el-option>
						<el-option label="装扮" value="2"></el-option>
						<el-option label="座驾" value="3"></el-option>
					</el-select>
				</el-form-item>
                <el-form-item>
					<el-button type="primary" @click="formOne.add.dialogVisible=true;">新增</el-button>
					<el-button type="primary" @click="getOneData">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--用户的数据展示列表-->
		<template>
			<el-table 
			ref="tableHeight" 
			:data="formOne.tabData" 
			border fit highlight-current-row 
			v-loading="listLoading" 
			style="width:100%;" 
			:height="tableHeight">
				<el-table-column prop="create_time" label="创建时间" width="150" sortable></el-table-column>
				<el-table-column prop="id" label="商城ID" width="50" ></el-table-column>
				<el-table-column prop="prop_id" label="道具ID" width="50"></el-table-column>
				<el-table-column prop="type" label="商品类型" width="50">
					<template slot-scope="scope">
						<p v-if="scope.row.type==1">道具</p>
						<p v-else-if="scope.row.type==2">装扮</p>
						<p v-else-if="scope.row.type==3">座驾</p>
					</template>
				</el-table-column>
				<el-table-column prop="original_price" label="原始价格-豆币" width="100"></el-table-column>
				<el-table-column prop="price" label="价格-豆币" width="100"></el-table-column>
				<el-table-column prop="status" label="商品状态" width="100">
					<template slot-scope="scope">
						<p v-if="scope.row.status==0">正在售卖</p>
						<p v-else-if="scope.row.status==1">停止售卖</p>
						<p v-else-if="scope.row.status==2">已售完</p>
						<p v-else-if="scope.row.status==3">已下架</p>
					</template>
				</el-table-column>
				<el-table-column prop="limit_time" label="限制时长-小时" width="100"></el-table-column>
				<el-table-column prop="is_vip_exclusive" label="会员专属" width="50">
					<template slot-scope="scope">
						<p v-if="scope.row.is_vip_exclusive==0">否</p>
						<p v-else-if="scope.row.is_vip_exclusive==1">是</p>
					</template>
				</el-table-column>
				<el-table-column prop="is_overlay" label="可叠加购买" width="50">
					<template slot-scope="scope">
						<p v-if="scope.row.is_overlay==0">否</p>
						<p v-else-if="scope.row.is_overlay==1">是</p>
					</template>
				</el-table-column>
				<el-table-column prop="is_stock" label="限购" width="50">
					<template slot-scope="scope">
						<p v-if="scope.row.is_stock==0">否</p>
						<p v-else-if="scope.row.is_stock==1">是</p>
					</template>
				</el-table-column>
				<el-table-column prop="stock" label="库存" width="100"></el-table-column>
				<el-table-column prop="remark" label="备注" width="100"></el-table-column>
				<el-table-column prop="name" label="名称" width="100"></el-table-column>
				<el-table-column label="商品图片" width="200">
					<template slot-scope="scope">
						<div slot="reference" class="name-wrapper">
							<img 
							:src="scope.row.product_icon" 
							style="width:100px;height:auto;">
						</div>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="240" fixed="right">
					<template slot-scope="scope">
						<el-button 
						type="primary" 
						@click="editChange(scope.row)" 
						size="small">编辑</el-button>
						<el-button 
						type="danger" 
						@click="deleteChange(scope.row)" 
						size="small">删除</el-button>
						<!-- 上下架怎么判断 -->
						<el-button 
						v-if="scope.row.status==3"
						type="primary" 
						@click="upChange(scope.row)" 
						size="small">上架</el-button>
						<el-button 
						v-else-if="scope.row.status==0"
						plain
						@click="downChange(scope.row)" 
						size="small">下架</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-col :span="24" class="toolbar">
				<el-pagination 
				layout="total,prev,pager,next,jumper" 
				@current-change="handleCurrentChange" 
				:page-size="20" 
				:total="formOne.totalpage" 
				style="float:right;"></el-pagination>
			</el-col>
		</template>
		<!-- 编辑 -->
		<el-dialog title="编 辑" :visible.sync="formOne.edit.dialogVisible" width="80%">
			<el-form :model="formOne.edit">
				<el-form-item label="商城ID" :label-width="formLabelWidth">
					<el-input disabled v-model="formOne.edit.id" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="商品类型" :label-width="formLabelWidth">
					<el-select 
					disabled
					v-model="formOne.edit.type"
					@change="daoJuChange(formOne.edit.type, 1)">
						<el-option label="道具" value="1"></el-option>
						<el-option label="装扮" value="2"></el-option>
						<el-option label="座驾" value="3"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="道具ID" :label-width="formLabelWidth">
					<el-select 
					disabled
					v-model="formOne.edit.prop_id" 
					placeholder="请选择">
						<el-option 
						v-for="(item, key) of formOne.edit.prop_id_arr" 
						:key="key" 
						:label="item.name" 
						:value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="原始价格" :label-width="formLabelWidth">
					<el-input v-model="formOne.edit.original_price" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="出售价格" :label-width="formLabelWidth">
					<el-input v-model="formOne.edit.price" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item disabled label="是否限购" :label-width="formLabelWidth">
					<el-select v-model="formOne.edit.is_stock">
						<el-option label="否" value="0"></el-option>
						<el-option label="是" value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="库存" :label-width="formLabelWidth">
					<el-input v-model="formOne.edit.stock" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item disabled label="是否会员专属" :label-width="formLabelWidth">
					<el-select v-model="formOne.edit.is_vip_exclusive">
						<el-option label="否" value="0"></el-option>
						<el-option label="是" value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item disabled label="是否可叠加购买" :label-width="formLabelWidth">
					<el-select v-model="formOne.edit.is_overlay">
						<el-option label="否" value="0"></el-option>
						<el-option label="是" value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="限时时长-小时" :label-width="formLabelWidth">
					<el-input v-model="formOne.edit.limit_time" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="备注" :label-width="formLabelWidth">
					<el-input v-model="formOne.edit.remark" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="商品图片" :label-width="formLabelWidth">
					<input 
					class="filepic fileinput" 
					@change="uploading($event, 1)" 
					type="file" 
					style="display:block;">
			        <img 
					:src="formOne.edit.product_icon_show" 
					style="width:300px;height:200px;margin-top:20px;" />
				</el-form-item>
				<el-form-item disabled label="商品状态" :label-width="formLabelWidth">
					<el-select v-model="formOne.edit.status">
						<el-option label="正在售卖" value="0"></el-option>
						<el-option label="停止售卖" value="1"></el-option>
						<el-option label="已售完" value="2"></el-option>
						<el-option label="已下架" value="3"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editorSure(0)">取 消</el-button>
				<el-button type="primary" @click="editorSure(1)">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 新增 -->
		<el-dialog title="新 增" :visible.sync="formOne.add.dialogVisible" width="80%">
			<el-form :model="formOne.add">
				<el-form-item disabled label="商品类型" :label-width="formLabelWidth">
					<el-select 
					v-model="formOne.add.type"
					@change="daoJuChange(formOne.add.type, 0)">
						<el-option label="道具" value="1"></el-option>
						<el-option label="装扮" value="2"></el-option>
						<el-option label="座驾" value="3"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="道具ID" :label-width="formLabelWidth">
					<el-select 
					v-model="formOne.add.prop_id" 
					placeholder="请选择">
						<el-option 
						v-for="(item, key) of formOne.add.prop_id_arr" 
						:key="key" 
						:label="item.name" 
						:value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="原始价格" :label-width="formLabelWidth">
					<el-input v-model="formOne.add.original_price" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="出售价格" :label-width="formLabelWidth">
					<el-input v-model="formOne.add.price" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item disabled label="是否限购" :label-width="formLabelWidth">
					<el-select v-model="formOne.add.is_stock">
						<el-option label="否" value="0"></el-option>
						<el-option label="是" value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="库存" :label-width="formLabelWidth">
					<el-input v-model="formOne.add.stock" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item disabled label="是否会员专属" :label-width="formLabelWidth">
					<el-select v-model="formOne.add.is_vip_exclusive">
						<el-option label="否" value="0"></el-option>
						<el-option label="是" value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item disabled label="是否可叠加购买" :label-width="formLabelWidth">
					<el-select v-model="formOne.add.is_overlay">
						<el-option label="否" value="0"></el-option>
						<el-option label="是" value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="限时时长-小时" :label-width="formLabelWidth">
					<el-input v-model="formOne.add.limit_time" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="备注" :label-width="formLabelWidth">
					<el-input v-model="formOne.add.remark" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="商品图片" :label-width="formLabelWidth">
					<input 
					class="filepic fileinput" 
					@change="uploading($event, 0)" 
					type="file" 
					style="display:block;">
			        <img 
					:src="formOne.add.product_icon_show" 
					style="width:300px;height:200px;margin-top:20px;" />
				</el-form-item>
				<el-form-item disabled label="商品状态" :label-width="formLabelWidth">
					<el-select v-model="formOne.add.status">
						<el-option label="正在售卖" value="0"></el-option>
						<el-option label="停止售卖" value="1"></el-option>
						<el-option label="已售完" value="2"></el-option>
						<el-option label="已下架" value="3"></el-option>
					</el-select>
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
import Event from './../../../public_js/event.js';
import { allget } from '../../../api/api';
import store from '../../../vuex/store';
import axios from 'axios';
export default {
	data() {
		return {
			tableHeight: null,
			formOne: {
				tabData: [],
				page: 0,
				totalpage: 1000,
				type: '1',
				add: {
					dialogVisible: false,
					type: '1',
					prop_id: '',
					prop_id_arr: null,
					original_price: '',
					price: '',
					is_stock: '0',
					stock: '',
					is_vip_exclusive: '0',
					is_overlay: '0',
					limit_time: '',
					remark: '',
					product_icon: '',
					product_icon_show: '',
					status: '0',
				},
				edit: {
					dialogVisible: false,
					id: '',
					type: '1',
					prop_id: '',
					prop_id_arr: null,
					original_price: '',
					price: '',
					is_stock: '',
					stock: '',
					is_vip_exclusive: '',
					is_overlay: '',
					limit_time: '',
					remark: '',
					product_icon: '',
					product_icon_show: '',
					status: '',
				},
				change_id: {
					one: null,
					two: null,
					three: null,
				},
			},
			listLoading: false, //动画加载时显示的动画
			find: '', //模糊查询的条件
			formLabelWidth: '120px', // 设置dialog弹框的宽度
		};
	},
	methods: {
		/*
			1、handleCurrentChange：翻页的功能
			2、getOneData：获取列表数据
			3、editChange：编辑赋值功能
			4、deleteChange：删除功能
			5、resetForm：重置整个表单
			6、uploading：得到上传文件type(0->新增，1->编辑)
			7、editorSure：编辑确定
			8、addSure：新添确定
			9、downChange：下架操作
			10、upChange：上架操作
		*/ 
		handleCurrentChange(val) {
			var _this = this;
			_this.page = val-1;
			_this.getOneData();
		},
		getOneData() {
			var _this = this ;
			var url = baseConfig.server+baseConfig.requestUrl+'/NewProp/getProductList';
			var params = {
				type: _this.formOne.type,
				page: _this.formOne.page,
			};
			axios.get(url, { params: params })
			.then((res) => {
				if(res.data.ret) {
					_this.formOne.totalpage = res.data.data.length;
					_this.formOne.tabData = res.data.data;
				} else {
					baseConfig.errorTipMsg(_this, res.data.msg);
				}
			})
			.catch((err) => {
				console.log(err);
			})
		},
		editChange(obj) {
			var _this = this;
			_this.formOne.edit.id = obj.id;
			_this.formOne.edit.type = obj.type;
			_this.daoJuChange(obj.type, 1);
			_this.formOne.edit.prop_id = obj.prop_id;
			_this.formOne.edit.original_price = obj.original_price;
			_this.formOne.edit.price = obj.price;
			_this.formOne.edit.is_stock = obj.is_stock;
			_this.formOne.edit.stock = obj.stock;
			_this.formOne.edit.is_vip_exclusive = obj.is_vip_exclusive;
			_this.formOne.edit.is_overlay = obj.is_overlay;
			_this.formOne.edit.limit_time = obj.limit_time;
			_this.formOne.edit.remark = obj.remark;
			_this.formOne.edit.product_icon_show = obj.product_icon;
			_this.formOne.edit.status = obj.status;
			_this.formOne.edit.product_icon = '';
			_this.formOne.edit.dialogVisible = true;
		},
		deleteChange(obj) {
			var _this = this;
			var url = baseConfig.server+baseConfig.requestUrl+'/NewProp/dealWithProduct';
			var params = {
				type: 0,
				id: obj.id,
			};
			axios.get(url, { params: params })
			.then((res) => {
				if(res.data.ret) {
					baseConfig.successTipMsg(_this, '删除成功~');
					_this.getOneData();
				} else {
					baseConfig.errorTipMsg(_this, res.data.msg);
				}
			})
			.catch((err) => {
				console.log(err);
			})
		},
		resetForm() {
			var _this = this;
			_this.formOne.add = {
				dialogVisible: false,
					type: '1',
					prop_id: '',
					prop_id_arr: null,
					original_price: '',
					price: '',
					is_stock: '0',
					stock: '',
					is_vip_exclusive: '0',
					is_overlay: '0',
					limit_time: '',
					remark: '',
					product_icon: '',
					product_icon_show: '',
					status: '0',
			};
			_this.formOne.edit = {
					dialogVisible: false,
					id: '',
					type: '1',
					prop_id: '',
					prop_id_arr: null,
					original_price: '',
					price: '',
					is_stock: '',
					stock: '',
					is_vip_exclusive: '',
					is_overlay: '',
					limit_time: '',
					remark: '',
					product_icon: '',
					product_icon_show: '',
					status: '',
			};
		},
        uploading(event, type) {
			var _this = this;
			if(type==0) { 
				_this.formOne.add.product_icon = event.target.files[0];
		  	    var windowURL = window.URL || window.webkitURL;
				_this.formOne.add.product_icon_show = windowURL.createObjectURL(event.target.files[0]);
			} else if(type==1) {
				_this.formOne.edit.product_icon = event.target.files[0];
		  	    var windowURL = window.URL || window.webkitURL;
				_this.formOne.edit.product_icon_show = windowURL.createObjectURL(event.target.files[0]);
			}
      	}, 
		editorSure(type) {
			var _this = this;
			if(type==0) {
				_this.resetForm();
			} else if(type==1) {	
				var url = baseConfig.server+baseConfig.requestUrl+'/NewProp/editProductList';				
				let formData = new FormData();
				let config = { headers: { 'Content-Type': 'multipart/form-data' } };
			  	formData.append('id', _this.formOne.edit.id);
			  	formData.append('type', _this.formOne.edit.type);
			  	formData.append('prop_id', _this.formOne.edit.prop_id);
			  	formData.append('original_price', _this.formOne.edit.original_price);
			  	formData.append('price', _this.formOne.edit.price);
			  	formData.append('is_stock', _this.formOne.edit.is_stock);
			  	formData.append('stock', _this.formOne.edit.stock);
			  	formData.append('is_vip_exclusive', _this.formOne.edit.is_vip_exclusive);
			  	formData.append('is_overlay', _this.formOne.edit.is_overlay);
			  	formData.append('limit_time', _this.formOne.edit.limit_time);
			  	formData.append('remark', _this.formOne.edit.remark);
			  	formData.append('product_icon', _this.formOne.edit.product_icon);
			  	formData.append('status', _this.formOne.edit.status);
				axios.post(url, formData, config)
				.then((res) => {
					if(res.data.ret) {	
						baseConfig.successTipMsg(_this, '编辑修改成功！');
						_this.getOneData();
					} else {
						baseConfig.errorTipMsg(_this, res.data.msg);						
					}
					_this.resetForm();
				}).catch((error) => {
					console.log(error);
				});
			}
		},
		addSure(type) {
			var _this = this;
			if(type==0) {
				_this.resetForm();
			} else if(type==1) {
				var url = baseConfig.server+baseConfig.requestUrl+'/NewProp/addProductList';
				let formData = new FormData();
				let config = { headers: { 'Content-Type': 'multipart/form-data' } };	
			  	formData.append('type', _this.formOne.add.type);
			  	formData.append('prop_id', _this.formOne.add.prop_id);
			  	formData.append('original_price', _this.formOne.add.original_price);
			  	formData.append('price', _this.formOne.add.price);
			  	formData.append('is_stock', _this.formOne.add.is_stock);
			  	formData.append('stock', _this.formOne.add.stock);
			  	formData.append('is_vip_exclusive', _this.formOne.add.is_vip_exclusive);
			  	formData.append('is_overlay', _this.formOne.add.is_overlay);
			  	formData.append('limit_time', _this.formOne.add.limit_time);
			  	formData.append('remark', _this.formOne.add.remark);
			  	formData.append('product_icon', _this.formOne.add.product_icon);
			  	formData.append('status', _this.formOne.add.status);
				axios.post(url, formData, config)
				.then((res) => {
					if(res.data.ret) {	
						baseConfig.successTipMsg(_this, '新增成功！');
						_this.getOneData();
					} else {
						baseConfig.errorTipMsg(_this, res.data.msg);						
					}
					_this.resetForm();
				}).catch((error) => {
					console.log(error);
				});
			}
		},
		downChange(obj) {
			var _this = this;
			var url = baseConfig.server+baseConfig.requestUrl+'/NewProp/dealWithProduct';
			var params = {
				id: obj.id,
				type: 2,
			};
			axios.get(url, { params: params })
			.then((res) => {
				if(res.data.ret) {
					baseConfig.successTipMsg(_this, '下架成功~');
					_this.getOneData();
				} else {
					baseConfig.errorTipMsg(_this, res.data.msg);
				}
			})
			.catch((err) => {
				console.log(err);
			})
		},
		upChange(obj) {
			var _this = this;
			var url = baseConfig.server+baseConfig.requestUrl+'/NewProp/dealWithProduct';
			var params = {
				id: obj.id,
				type: 1,
			};
			axios.get(url, { params: params })
			.then((res) => {
				if(res.data.ret) {
					baseConfig.successTipMsg(_this, '上架成功~');
					_this.getOneData();
				} else {
					baseConfig.errorTipMsg(_this, res.data.msg);
				}
			})
			.catch((err) => {
				console.log(err);
			})
		},
		/*
			得到相应的道具ID
			1、daoJuChangetype：发生change的方法（type0->新添1->编辑）
			2、getOneId：当为1的时-道具
			3、getTwoId：当为2的时-装扮
			4、getThreeId：当为3的时-座驾
		*/ 
		daoJuChange(val, type) {
			var _this = this;
			if(type==0) {
				_this.formOne.add.prop_id = '';
				if(val==1) {
					_this.formOne.add.prop_id_arr = _this.formOne.change_id.one;
				}
				else if(val==2) {
					_this.formOne.add.prop_id_arr = _this.formOne.change_id.two;
				}
				else if(val==3) {
					_this.formOne.add.prop_id_arr = _this.formOne.change_id.three;
				}
			}
			else if(type==1) {
				_this.formOne.edit.prop_id = '';
				if(val==1) {
					_this.formOne.edit.prop_id_arr = _this.formOne.change_id.one;
				}
				else if(val==2) {
					_this.formOne.edit.prop_id_arr = _this.formOne.change_id.two;
				}
				else if(val==3) {
					_this.formOne.edit.prop_id_arr = _this.formOne.change_id.three;
				}
			}
		},
		getOneId() {
			var _this = this;
			var url = baseConfig.server+baseConfig.requestUrl+'/NewProp/getPropList';
			var params = {};
			axios.get(url, { params: params })
			.then((res) => {
				var arr = [];
				for(var i=0; i<res.data.data.length; i++) {
					var obj = {};					
					obj.name = res.data.data[i].name;
					obj.id = res.data.data[i].id;
					arr.push(obj);
				}
				_this.formOne.change_id.one = arr;
				_this.formOne.add.prop_id_arr = arr;
				_this.formOne.edit.prop_id_arr = arr;
			})
			.catch((err) => {
				console.log(err);
			})
		},
		getTwoId() {
			var _this = this;
			var url = baseConfig.server+baseConfig.requestUrl+'/NewProp/getPropAttireList';
			var params = {};
			axios.get(url, { params: params })
			.then((res) => {
				if(res.data.ret) {
					var arr = [];
					for(var i=0; i<res.data.data.length; i++) {
						var obj = {};					
						obj.name = res.data.data[i].name;
						obj.id = res.data.data[i].id;
						arr.push(obj);
					}
					_this.formOne.change_id.two = arr;
				}
				else {
					baseConfig.errorTipMsg(_this, res.data.msg);
				}
			})
			.catch((err) => {
				console.log(err);
			})
		},
		getThreeId() {
			var _this = this;
			var url = baseConfig.server+baseConfig.requestUrl+'/NewProp/getPropCarList';
			var params = {};
			axios.get(url, { params: params })
			.then((res) => {
				var arr = [];
				for(var i=0; i<res.data.data.length; i++) {
					var obj = {};					
					obj.name = res.data.data[i].name;
					obj.id = res.data.data[i].id;
					arr.push(obj);
				}
				_this.formOne.change_id.three = arr;
			})
			.catch((err) => {
				console.log(err);
			})
		}
	},
	mounted() {
		var _this = this;
		this.$nextTick(function() {
			_this.tableHeight = baseConfig.lineNumber(searchPageHeight); 
			_this.getOneData(); 
			_this.getOneId();
			_this.getTwoId();
			_this.getThreeId();
		})
	}
};
</script>

<style lang="css" scoped>
/* 页面样式css内容 */
.excelBox{
	width: 500px; height: 190px; margin-left: -150px; background: #f1f7ff;
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

<template>
	<!-- 道具列表 -->
	<!-- dom结构内容 -->
	<section>
		<!--用户的数据展示列表-->
		<template>
			<el-table ref="tableHeight" :data="onePageTabData" border fit highlight-current-row v-loading="listLoading" style="width: 100%;height: 100%;" :height="tableHeight">
				<el-table-column prop="vip_type" label="VIP会员类型" >
                    <template slot-scope="scope">
                        <p v-if="scope.row.vip_type == 3">体验会员</p>
                        <p v-else-if="scope.row.vip_type == 4">钻石会员</p>
                        <p v-else-if="scope.row.vip_type == 5">至尊会员</p>
                        <p v-else-if="scope.row.vip_type == 6">圣尊会员</p>
                    </template>
                </el-table-column>
				<el-table-column prop="time" label="单位" >
                    <template slot-scope="scope">
                        <p>{{scope.row.time + "天"}}</p>
                    </template>
                </el-table-column>
				<el-table-column prop="prop_id" label="道具id" ></el-table-column>
				<el-table-column prop="prop_name" label="道具名称" ></el-table-column>
				<el-table-column prop="num" label="数量" ></el-table-column>
				
				<el-table-column label="操作" width="140" fixed="right">
					<template slot-scope="scope">
						<el-button type="primary" @click="editVipPackageList(scope.$index, tabData)" size="small">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!--工具条-->
			<el-col :span="24" class="toolbar">
				<el-pagination layout="total,prev,pager,next,jumper" @current-change="handleCurrentChange" :page-size="20" :total="totalpage" style="float:right;"></el-pagination>
			</el-col>
            <el-dialog title="道具  编辑" :visible.sync="formTwo.dialogFormVisible">
                <el-form :model="formTwo">
                    <el-form-item label="道具名称：" :label-width="formLabelWidth">
                        <el-input v-model="formTwo.name" auto-complete="off"></el-input>
                    </el-form-item>
                   
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="formTwo.dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="formTwo.dialogFormVisible = false">确 定</el-button>
                </div>
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
			tableHeight: null, 
            formTwo: {
                dialogFormVisible: false,
                id: "",
                name: "",
            },
			listLoading: false,
			tabData: [], 
			totalpage: null, 
			page: 1, 
			star: '0',
			end: '20',
            formLabelWidth: '120px', 
            propList:{},
		};
	},
	computed:{
		onePageTabData() {
			var _this = this;
			return _this.tabData.slice(_this.star, _this.end);
		},
	},
	methods: {
       handleCurrentChange(val) {
			var _this = this;
			_this.page = val;
			_this.star = (_this.page-1)*20;
			_this.end = _this.star+20;
        },
        getTableData() {
			var _this = this ;
			_this.listLoading = true;
			var url = '/NewProp/getVipPackageList';
            allget("", url).then(res=>{
                _this.listLoading = false;
                if(res.data.ret){
                    var newData = [];
                    for(var key in res.data.data){
                        // 当为数组时，说明没有数据 []
                        if(!Array.isArray(res.data.data[key])){
                            for(var skey in res.data.data[key]){
                                for(var tkey in res.data.data[key][skey]){
                                    var newObj = {};
                                    newObj.vip_type = key;
                                    newObj.time = skey;
                                    newObj.prop_id = tkey;
                                    newObj.prop_name = _this.propList[tkey];
                                    newObj.num = res.data.data[key][skey][tkey];
                                    newData.push(newObj);
                                }
                            }
                        }
                    }
                    _this.tabData = newData;
                    _this.totalpage = _this.tabData.length; 
                }else{
                    baseConfig.errorTipMsg(_this, res.data.msg);
                }
            }).catch(err=>{
                console.log(err);
            })
        },
        // 获取道具列表
        getPropData(){
            var _this = this;
            var url = '/NewProp/getPropList';
            allget("", url).then(res => {
                if(res.data.ret){
                    for(var i = 0; i < res.data.data.length; i++){
                        _this.propList[res.data.data[i].id] =  res.data.data[i].name;
                    }
                    _this.getTableData();
                }else{
                    baseConfig.normalTipMsg(_this, "道具列表获取失败！");
                }
            }).catch(error=>{
                console.log(error);
            })
        },
        // 会员礼包编辑
        editVipPackageList(index,scope){
            // this.formTwo.dialogFormVisible = true;
            baseConfig.successTipMsg(this, "请联系服务端进行修改！")
        }
    },
    mounted() {
		var _this = this;
		this.$nextTick(function() {
			_this.tableHeight = baseConfig.lineNumber(pageHeight);
			_this.getPropData();
		})
	}
     
};
</script>

<style lang="css" scoped>
</style>

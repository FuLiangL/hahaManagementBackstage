<template>
    <section>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" style="overflow: hidden;" :model="formOne">
                <el-form-item>
                    <div class="block">
                        <span class="dataTime">日期</span>
                        <el-date-picker v-model="formOne.choiceDate" type="daterange" range-separator=" 至 " placeholder="选择日期范围"></el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item>
                    <span>类型</span>
                    <el-select v-model="formOne.type">
                        <el-option label="全部" value="0"></el-option>
                        <el-option label="豆币" value="1"></el-option>
                        <el-option label="豆票" value="2"></el-option>
                        <el-option label="体验" value="5"></el-option>
                        <el-option label="钻石" value="6"></el-option>
                        <el-option label="至尊" value="7"></el-option>
                        <el-option label="圣尊" value="8"></el-option>
                        <el-option label="道具" value="9"></el-option>
                    </el-select>
                </el-form-item>                
                <el-form-item>
                    <div class="block">
                        <el-input placeholder="请输入uid查询" v-model="formOne.find"></el-input>                        
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addDialog.dialogShow=true;">赠送</el-button>
                    <el-button type="primary" @click="propData.dialogShow=true;">道具赠送</el-button>
                    <el-button type="primary" @click="dressUp.dialogShow=true;">装扮、座驾赠送</el-button>
                    <el-button type="primary" @click="getTableData">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <template>
            <el-table :data="onePageData" border fit highlight-current-row v-loading="listLoading" style="width: 100%;" :height="tableHeight">
                <el-table-column prop="time" label="日期" width="80" sortable></el-table-column>
                <el-table-column prop="uid" label="用户uid" width="100" sortable></el-table-column>
                <el-table-column prop="nickname" label="昵称" width="150" sortable></el-table-column>
                <el-table-column label="加减" width="100" sortable>
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <p v-if="scope.row.add_sub==0">加</p>
                            <p v-else-if="scope.row.type==1">减</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="num" label="申请数量" width="150" sortable>
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <p v-if="scope.row.type==1
                            ||scope.row.type==2">{{scope.row.num}}</p>
                            <p v-else-if="scope.row.type==5
                            ||scope.row.type==6
                            ||scope.row.type==7
                            ||scope.row.type==8">{{scope.row.num}}个月</p>
                            <p v-else-if="scope.row.type==9">{{scope.row.num}}张</p>
                            <p v-else-if="scope.row.type==10
                            ||scope.row.type==11">{{scope.row.num}}天</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="类型" width="100" sortable>
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <p v-if="scope.row.type==1">豆币</p>
                            <p v-else-if="scope.row.type==2">豆票</p>
                            <p v-else-if="scope.row.type==5">体验(会员)</p>
                            <p v-else-if="scope.row.type==6">钻石(会员)</p>
                            <p v-else-if="scope.row.type==7">至尊(会员)</p>
                            <p v-else-if="scope.row.type==8">圣尊(会员)</p>
                            <p v-else-if="scope.row.type==9">
                                {{oneChange(scope.row.prop_id)}}(道具)
                            </p>
                            <p v-else-if="scope.row.type==10">
                                {{twoChange(scope.row.prop_id)}}(装扮)
                            </p>
                            <p v-else-if="scope.row.type==11">
                                {{threeChange(scope.row.prop_id)}}(座驾)
                            </p>
                        </div>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="道具名称" width="100" sortable>
                    <template slot-scope="scope">
                        <p>{{countProp(scope.row.prop_id)}}</p>
                    </template>
                </el-table-column> -->
                <el-table-column prop="num" label="赠送数量" sortable></el-table-column>
                <el-table-column prop="operation_reason" label="赠送理由" min-width="200" sortable></el-table-column>
                <el-table-column label="状态" width="100" sortable>
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <p v-if="scope.row.status==0">未审核</p>
                            <p v-else-if="scope.row.status==1">通过</p>
                            <p v-else-if="scope.row.status==2">拒绝</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="operation_name" label="操作人" width="150" sortable></el-table-column>
            </el-table>
            <el-col :span="24" class="toolbar">
                <el-pagination 
                layout="total,prev,pager,next,jumper"
                @current-change="oneHandleCurrentChange" 
                :page-size="20" 
                :total="formOne.totalPage" 
                style="float:right;"></el-pagination>
            </el-col>
        </template>
        <el-dialog title="赠送申请" :visible.sync="addDialog.dialogShow">
            <el-form :model="addDialog">
                <el-form-item label="uid" :label-width="formLabelWidth">
                    <el-input v-model="addDialog.uid" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="类型" :label-width="formLabelWidth">
                    <el-select v-model="addDialog.type">
                        <el-option label="豆币" value="1"></el-option>
                        <el-option label="豆票" value="2"></el-option>
                        <el-option label="体验" value="5"></el-option>
                        <el-option label="钻石" value="6"></el-option>
                        <el-option label="至尊" value="7"></el-option>
                        <el-option label="圣尊" value="8"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="加减" :label-width="formLabelWidth">
                    <el-select v-model="addDialog.add_sub">
                        <el-option label="加" value="0"></el-option>
                        <el-option label="减" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数量" :label-width="formLabelWidth">
                    <el-input v-model="addDialog.num" placeholder="豆币豆票为数量，会员为月份" auto-complete="off"></el-input>						
                </el-form-item>
                <el-form-item label="赠送理由" :label-width="formLabelWidth">
                    <el-input v-model="addDialog.operation_reason" auto-complete="off"></el-input>						
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native.prevent="sendAdd(0)">取 消</el-button>
                <el-button type="primary" @click.native.prevent="sendAdd(1)">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 装扮、座驾赠送 -->
        <el-dialog title="装扮、座驾申请" :visible.sync="dressUp.dialogShow">
            <el-form :model="dressUp">
                <el-form-item label="uid" :label-width="formLabelWidth">
                    <el-input v-model="dressUp.uid" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="类型" :label-width="formLabelWidth">
                    <el-select v-model="dressUp.type">
                        <el-option label="装扮" value="10"></el-option>
                        <el-option label="座驾" value="11"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="dressUp.type==10" label="装扮详情" :label-width="formLabelWidth">
                    <el-select v-model="dressUp.prop_id_two">
                        <el-option 
                        v-for="item in dressUp.changeTwo" 
                        :key="item.id" 
                        :label="item.name" 
                        :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-else-if="dressUp.type==11" label="座驾详情" :label-width="formLabelWidth">
                    <el-select v-model="dressUp.prop_id_three">
                        <el-option 
                        v-for="itemOne in dressUp.changeThree" 
                        :key="itemOne.id" 
                        :label="itemOne.name" 
                        :value="itemOne.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="加减" :label-width="formLabelWidth">
                    <el-select v-model="dressUp.add_sub">
                        <el-option label="加" value="0"></el-option>
                        <el-option label="减" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数量" :label-width="formLabelWidth">
                    <el-input 
                    v-model="dressUp.num" 
                    placeholder="装扮、座驾的天数"></el-input>						
                </el-form-item>
                <el-form-item label="赠送理由" :label-width="formLabelWidth">
                    <el-input v-model="dressUp.operation_reason"></el-input>						
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button 
                @click.native.prevent="dressUpSendAdd(0)">取 消</el-button>
                <el-button 
                type="primary" 
                @click.native.prevent="dressUpSendAdd(1)">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 道具赠送 -->
        <el-dialog title="道具赠送" :visible.sync="propData.dialogShow">
            <el-form :model="propData">
                <el-form-item label="uid" :label-width="formLabelWidth">
                    <el-input v-model="propData.uid" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="道具列表" :label-width="formLabelWidth">
                    <el-select v-model="propData.prop_id">
                        <el-option 
                        v-for="item in propData.propList" 
                        :key="item.id" 
                        :label="item.name" 
                        :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="道具失效类型" :label-width="formLabelWidth">
                    <el-select v-model="propData.prescription_type">
                        <el-option label="永久有效" value="0"></el-option>
                        <el-option label="指定时间" value="1"></el-option>
                        <el-option label="领取后" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="道具数量" :label-width="formLabelWidth">
                    <el-input v-model="propData.num" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="propData.prescription_type == 1" label="指定时间" :label-width="formLabelWidth">
                    <el-date-picker v-model="propData.choiceDate" type="daterange" range-separator=" 至 " placeholder="选择日期范围"></el-date-picker>
                </el-form-item>
                <el-form-item v-if="propData.prescription_type == 2" label="有效时间(分钟)" :label-width="formLabelWidth">
                    <el-input v-model="propData.time_out" auto-complete="off"></el-input>						
                </el-form-item>
                <el-form-item label="赠送理由" :label-width="formLabelWidth">
                    <el-input v-model="propData.operation_reason" auto-complete="off"></el-input>						
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native.prevent="sendPropAdd(0)">取 消</el-button>
                <el-button type="primary" @click.native.prevent="sendPropAdd(1)">确 定</el-button>
            </div>
        </el-dialog>
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
            formOne: {
                choiceDate: [new Date()-2*24*60*60*1000,new Date()],                
                type: '0',
                find: '',
                tabData: [],
                totalPage: null,
                page: 0,
                star: '0',
                end: '20',
            },
            /* 豆币、豆票、会员的申请 */
            addDialog: {
                dialogShow: false,
                uid: '',
                type: '1',
                add_sub: '0',
                num: '',
                operation_name: '',
                operation_reason: '',
            },
            /* 道具的申请 */
            propData: {
                dialogShow: false,
                uid: "",
                prop_id: "",
                num: "",
                propList: [],
                prescription_type: "",
                choiceDate: [new Date(),new Date()],
                time_out: null,
                operation_reason: "",
            },
            /* 装扮、座驾的申请 */
            dressUp: {
                dialogShow: false,
                uid: '',
                type: '10',//10->装扮11->座驾
                add_sub: '0',
                num: '',
                operation_name: '',
                operation_reason: '',
                prop_id_two: "",
                prop_id_three: "",
                changeTwo: [],
                changeThree: [],
            },
            listLoading: false,
            formLabelWidth: '120px',
        }
    }, 
    computed: {
        /* 
            返回全部的数据，进行切割分页的处理
        */
        onePageData() {
            var _this = this;
            return _this.formOne.tabData.slice(_this.formOne.star, _this.formOne.end);
        },
    },
    methods:{
        /* 
            依据道具的id去得到对应的道具的名称
        */
        oneChange(id){
            var _this = this;
            for(var i=0; i<_this.propData.propList.length; i++) {
                if(_this.propData.propList[i].id==id) {
                    return _this.propData.propList[i].name;
                }
            }
        },
        twoChange(id) {
            var _this = this;
            for(var i=0; i<_this.dressUp.changeTwo.length; i++) {
                if(_this.dressUp.changeTwo[i].id==id) {
                    return _this.dressUp.changeTwo[i].name;
                }
            }
        },
        threeChange(id) {
            var _this = this;
            for(var i=0; i<_this.dressUp.changeThree.length; i++) {
                if(_this.dressUp.changeThree[i].id==id) {
                    return _this.dressUp.changeThree[i].name;
                }
            }
        },
        oneHandleCurrentChange(val) {
            var _this = this;
            _this.formOne.page = val-1;
            _this.formOne.star = (_this.formOne.page-0)*20;
            _this.formOne.end = _this.formOne.star-0+20;
        },
        /* 
            拉取全部的数据
        */
        getTableData() {
            var _this = this;
            _this.listLoading = true;
            var url = baseConfig.server+baseConfig.requestUrl+'/NewMoney/findSendMoneyTo';
            var params = {
                date_s: baseConfig.changeDateTime(_this.formOne.choiceDate[0], 0),
                date_e: baseConfig.changeDateTime(_this.formOne.choiceDate[1], 0),
                type: _this.formOne.type,
                find: _this.formOne.find,
            };
            axios.get(url, {params: params})
            .then((res) => {
                _this.listLoading = false;
                if(res.data.ret) {
                    _this.formOne.totalPage = res.data.data.length;
                    _this.formOne.tabData = res.data.data;
                } else {
                    baseConfig.errorTipMsg(_this, res.data.msg);
                }
            })
            .catch(function(error) {
                console.log(error);
            })
        },
        /* 
            豆币、豆票、会员的确认、取消按钮
        */
        sendAdd(type) {
            var _this = this;
            if(type==0) {
                _this.addDialog.dialogShow= false;
            } else if(type==1) {
                _this.listLoading = true;
                var url = baseConfig.server+baseConfig.requestUrl+'/NewMoney/SendMoneyToYou';
                let formData = new FormData();
                formData.append('uid', _this.addDialog.uid);
                formData.append('type', _this.addDialog.type);
                formData.append('add_sub', _this.addDialog.add_sub);
                formData.append('num', _this.addDialog.num);
                formData.append('operation_name', (_this.addDialog.operation_name));
                formData.append('operation_reason', (_this.addDialog.operation_reason));
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                };
                axios.post(url, formData, config)
                .then((res) => {
                    _this.addDialog.dialogShow= false;
                    _this.listLoading = false;
                    if(res.data.ret) {
                        baseConfig.successTipMsg(_this, '赠送成功！');                        
                        _this.getTableData();                        
                    } else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
            }
        },
        /*
            道具赠送的确认、取消的按钮
        */ 
        sendPropAdd(type) {
            var _this = this;
            if(type==0){
                _this.propData.dialogShow = false;
            }else if(type==1){
                var url = baseConfig.server+baseConfig.requestUrl+'/NewMoney/SendMoneyToYou';
                let formData = new FormData();
                let config = {headers: {'Content-Type': 'multipart/form-data'}};
                formData.append('uid', _this.propData.uid);
                formData.append('type', 9);
                formData.append('operation_name', _this.addDialog.operation_name);
                formData.append('operation_reason', _this.propData.operation_reason);
                formData.append('prop_id', _this.propData.prop_id);
                formData.append('num', _this.propData.num);
                formData.append('prescription_type', _this.propData.prescription_type);
                formData.append('start_time', baseConfig.changeDateTime(_this.propData.choiceDate[0], 0));
                formData.append('end_time', baseConfig.changeDateTime(_this.propData.choiceDate[1], 0));
                formData.append('time_out', _this.propData.time_out);
                if(_this.propData.prescription_type == 0){
                    formData.delete('start_time');
                    formData.delete('end_time');
                    formData.delete('time_out');
                }else if(_this.propData.prescription_type == 1){
                    formData.delete('time_out');
                }else if(_this.propData.prescription_type == 2){
                    formData.delete('start_time');
                    formData.delete('end_time');
                }
                axios.post(url, formData, config)
                .then((res) => {
                    if(res.data.ret){
                        baseConfig.successTipMsg(_this, res.data.msg);
                        _this.propData.dialogShow = false;
                        _this.getTableData();    
                    }else{
                        baseConfig.errorTipMsg(_this, res.data.msg);
                        _this.propData.dialogShow = false;
                    }
                }).catch((err) => {
                    console.log(err);
                })
            }
        },
        /* 
            装扮、座驾确认取消按钮
        */
        dressUpSendAdd(type) {
            var _this = this;
            if(type==0) {
                _this.dressUp.dialogShow = false;
            } else if(type==1) {
                var url = baseConfig.server+baseConfig.requestUrl+'NewMoney/SendMoneyToYou';
                let formData = new FormData();
                let config = {headers: {'Content-Type': 'multipart/form-data'}};
                formData.append('uid', _this.dressUp.uid);
                formData.append('type', _this.dressUp.type);
                formData.append('add_sub', _this.dressUp.add_sub);
                formData.append('num', _this.dressUp.num);
                formData.append('operation_name', _this.dressUp.operation_name);
                formData.append('operation_reason', _this.dressUp.operation_reason);
                if(_this.dressUp.type==10) {
                    formData.append('prop_id', _this.dressUp.prop_id_two);
                } else if(_this.dressUp.type==11) {
                    formData.append('prop_id', _this.dressUp.prop_id_three);
                }
                axios.post(url, formData, config)
                .then((res) => {
                    if(res.data.ret) {
                        baseConfig.successTipMsg(_this, res.data.msg);
                        _this.getTableData();    
                        _this.get
                    } else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                    _this.dressUp.dialogShow = false;
                })
                .catch((err) => {
                    console.log(err);
                })
            }
        },
        /*
            获取道具列表进行道具赠送
            得到整个返回的道具的列表的id、name
        */ 
        getOneId(){
            var _this = this;
            var url = baseConfig.server+baseConfig.requestUrl+'/NewProp/getPropList';
            axios.get(url, {params: {}})
            .then((res) => {
                if(res.data.ret) {
                    _this.propData.propList = res.data.data;
                    _this.getTableData();
                }else{
                    baseConfig.normalTipMsg(_this, "道具列表获取失败！");
                }
            }).catch(error=>{
                console.log(error);
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
                    _this.dressUp.changeTwo = arr;
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
                _this.dressUp.changeThree = arr;
			})
			.catch((err) => {
				console.log(err);
			})
        },
    },
    mounted() {
        var _this = this;
        _this.$nextTick(function() {
            _this.tableHeight = baseConfig.lineNumber(searchPageHeight);
            _this.addDialog.operation_name = store.state.user.name;
            _this.dressUp.operation_name = store.state.user.name;
            _this.getOneId();
            _this.getTwoId();
            _this.getThreeId();
        })
    },
    created() {
        var _this = this;
        _this.getOneId();
        _this.getTwoId();
        _this.getThreeId();
    },
}
</script>

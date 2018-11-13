<template>
	<!-- 家族账号管理 -->
	<section>
		<el-tabs v-model="tabActiveName" type="border-card" @tab-click="handleClick">
            <!-- 账号管理 -->
			<el-tab-pane label="账号管理" name="first">
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" style="overflow: hidden;" :model="formOne">
                        <el-form-item>
							<el-button type="primary" @click="formOne.addAccountInfo.dialogShow=true;">添加账号</el-button>
						</el-form-item>
					</el-form>
				</el-col>
				<template>
					<el-table 
                    ref="tableOneHeight" 
                    :data="onePageTabData" 
                    border fit highlight-current-row 
                    v-loading="listLoading" style="width: 100%;" 
                    :height="tableOneHeight">
                        <el-table-column type="index" width="50"></el-table-column>
						<el-table-column prop="phone" label="登录账号" width="200"></el-table-column>
						<el-table-column prop="uid" label="UID" width="200"></el-table-column>
						<el-table-column prop="nickname" label="昵称" width="200"></el-table-column>
                        <el-table-column label="操作" min-width="400">
							<template slot-scope="scope">
								<el-button 
                                type="primary" 
                                @click.native.prevent="formOne.btns.one.dialogShow=true; formOne.btns.one.uid=onePageTabData[scope.$index].uid;" 
                                size="small">添加成员</el-button>								
								<el-button 
                                type="primary" 
                                @click.native.prevent="twoBtn(onePageTabData[scope.$index])" 
                                size="small">成员列表</el-button>
                                <el-button 
                                type="primary" 
                                @click.native.prevent="formOne.btns.three.dialogShow=true; formOne.btns.three.uid=onePageTabData[scope.$index].uid;" 
                                size="small">重置密码</el-button>
                                <el-button 
                                type="primary" 
                                @click.native.prevent="formOne.btns.four.dialogShow=true; formOne.btns.four.uid=onePageTabData[scope.$index].uid;" 
                                size="small">删除账号</el-button>
							</template>
						</el-table-column>
					</el-table>
                    <el-col
                    :span="24"
                    class="toolbar">
                        <el-pagination
                        layout="total, prev, pager, next, jumper"
                        @current-change="oneHandleCurrentChange"
                        :page-size="20"
                        :total="formOne.totalPage"
                        style="float:right;">
                        </el-pagination>
                    </el-col>
				</template>
			</el-tab-pane>
            <!-- 成员列表 -->
			<el-tab-pane label="成员列表" name="second">
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" style="overflow: hidden;" :model="formTwo">
                        <el-form-item>
                            <span>快速查询被绑定关系</span>
                            <el-input style="width:150px;" placeholder="请输入内容" v-model="formTwo.condition_uid"></el-input>
                        </el-form-item>
						<el-form-item>
							<el-button type="primary" @click="getOneAccount">查询</el-button>
						</el-form-item>
					</el-form>
				</el-col>
				<template>
					<el-table ref="tableTwoHeight" :data="formTwo.tabData" border fit highlight-current-row v-loading="listLoading" style="width: 100%;" :height="tableTwoHeight">
						<el-table-column prop="bind_time" label="绑定时间" width="200"></el-table-column>
						<el-table-column prop="slave_uid" label="UID" width="100"></el-table-column>
						<el-table-column prop="slave_phone" label="账号" width="200"></el-table-column>
						<el-table-column prop="slave_nickname" label="昵称" width="150"></el-table-column>
						<el-table-column prop="master_uid" label="绑定者UID" width="100"></el-table-column>
						<el-table-column prop="master_nickname" label="绑定者昵称" width="150"></el-table-column>
						<el-table-column label="操作" min-width="100">
                            <template slot-scope="scope">
								<el-button 
                                type="primary" 
                                @click.native.prevent="Unbind(formTwo.tabData[scope.$index], scope.$index)" 
                                size="small">解除绑定</el-button>								
							</template>
                        </el-table-column>
					</el-table>
                    <!--工具条-->
                    <el-col
                    :span="24"
                    class="toolbar">
                        <el-pagination
                        layout="total, prev, pager, next, jumper"
                        @current-change="twoHandleCurrentChange"
                        :page-size="20"
                        :total="formTwo.totalPage"
                        style="float:right;">
                        </el-pagination>
                    </el-col>
				</template>
			</el-tab-pane>
            <!-- 账号添加弹窗 -->
            <el-dialog title="账号添加" :visible.sync="formOne.addAccountInfo.dialogShow">
				<el-form :model="formOne.addAccountInfo">
					<el-form-item label="账号" :label-width="formLabelWidth">
						<el-input v-model="formOne.addAccountInfo.account" placeholder="请填写手机号码~" auto-complete="off"></el-input>
					</el-form-item>
                    <el-form-item label="密码" :label-width="formLabelWidth">
						<el-input v-model="formOne.addAccountInfo.password" placeholder="请填写密码~" auto-complete="off"></el-input>
					</el-form-item>
                    <el-form-item label="UID" :label-width="formLabelWidth">
						<el-input v-model="formOne.addAccountInfo.uid" placeholder="请填写uid~" auto-complete="off"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native.prevent="addAccountSure(0)">取 消</el-button>
					<el-button type="primary" @click.native.prevent="addAccountSure(1)">确 定</el-button>
				</div>
			</el-dialog>
            <!-- 第一屏btns中添加成员、重置密码、删除账号 -->
            <el-dialog title="添加成员" :visible.sync="formOne.btns.one.dialogShow">
				<el-form :model="formOne.btns.one">
					<el-form-item label="UID" :label-width="formLabelWidth">
						<el-input v-model="formOne.btns.one.uid_list" placeholder="uid之间用英文状态输入的,隔开" auto-complete="off"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native.prevent="oneBtn(0)">取 消</el-button>
					<el-button type="primary" @click.native.prevent="oneBtn(1)">确 定</el-button>
				</div>
			</el-dialog>
            <el-dialog title="重置密码" :visible.sync="formOne.btns.three.dialogShow">
				<el-form :model="formOne.btns.three">
					<p>是否对账号为：{{formOne.btns.three.uid}}进行重置密码为123456？</p>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native.prevent="threeBtn(0)">取 消</el-button>
					<el-button type="primary" @click.native.prevent="threeBtn(1)">确 定</el-button>
				</div>
			</el-dialog>
            <el-dialog title="删除账号" :visible.sync="formOne.btns.four.dialogShow">
				<el-form :model="formOne.btns.four">
					<p>是否对账号为：{{formOne.btns.four.uid}}进行删除？</p>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native.prevent="fourBtn(0)">取 消</el-button>
					<el-button type="primary" @click.native.prevent="fourBtn(1)">确 定</el-button>
				</div>
			</el-dialog>
		</el-tabs>
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
			tableOneHeight: null, 
			tableTwoHeight: null,
			formOne: {
				tabData: [],
				page: 1,
                star: '0',
                end: '20',
                totalPage: null,
                addAccountInfo: {//添加账号
                    dialogShow: false,
                    account: '',
                    password: '',
                    uid: '',
                },
                btns: {
                    one: {
                        dialogShow: false,
                        uid: '',
                        uid_list: '',
                    },
                    three: {
                        dialogShow: false,
                        uid: '',
                    },
                    four: {
                        dialogShow: false,
                        uid: '',
                    },
                },
            },
            formTwo: {
                uid: '',
                condition_uid: '',
                tabData: [],
                page: '0',
                totalPage: 1000,
                unbind: {//解绑操作参数
                    uid: '',
                    slave_uid: '',
                }
            },
			listLoading: false, 
			tabActiveName: 'first', 
			formLabelWidth: '130px',
		};
    },
    computed: {
        onePageTabData() {
            var _this = this;
            return _this.formOne.tabData.slice(_this.formOne.star, _this.formOne.end);
        },
    },
	methods: {
        /*
            第一个tab页面对应的方法
            1、oneHandleCurrentChange：对应的页面翻转的方法
            2、getTableManage：获取到相应的列表数据的弹窗
            3、addAccountSure：添加账号的确定请求
            4、oneBtn：添加成员
            5、twoBtn：成员列表
            6、threeBtn：重置密码
            5、fourBtn：删除账号
        */ 
		oneHandleCurrentChange(val) {
			// val指的是当前点击是第一页
			var _this = this;
            val = val-1;
            _this.formOne.page = val;
            _this.formOne.star = (_this.formOne.page)*20;
            _this.formOne.end = _this.formOne.star+20;
        },
		getTableManage() {
			var _this = this ;
            _this.listLoading = true;
            var url = baseConfig.server+'/server/index.php/Family/getFamilyMasterInfoList';
            var params = {};
            axios.get(url, { params: params })
            .then((res) => {
                _this.listLoading = false;
                if(res.data.code) {
					_this.formOne.totalPage = res.data.data.length;
					_this.formOne.tabData = res.data.data;
                }
                else {
                    baseConfig.errorTipMsg(_this, res.data.msg);
                }
            })
            .catch((err) => {
                console.log(err);
            })
        },
        addAccountSure(type) {
            var _this = this;
            if(type==0) {//取消
                _this.formOne.addAccountInfo.dialogShow = false;
            }   
            else if(type==1) {//提交
                // 提交内容不能为空
                if(_this.formOne.addAccountInfo.account==''){ baseConfig.normalTipMsg(_this, '账号内容不能为空'); return; }
                if(_this.formOne.addAccountInfo.password==''){ baseConfig.normalTipMsg(_this, '密码内容不能为空'); return; }
                if(_this.formOne.addAccountInfo.uid==''){ baseConfig.normalTipMsg(_this, 'UID内容不能为空'); return; }
                var url = baseConfig.server + '/server/index.php/Family/addFamilyMasterPassTicket';
                var params = {
                    uid: _this.formOne.addAccountInfo.uid,
                    user_name: _this.formOne.addAccountInfo.account,
                    password: _this.formOne.addAccountInfo.password,
                }
                axios.get(url, { params: params })
                .then((res) => {
                    if(res.data.code) {
                        baseConfig.successTipMsg(_this, '新添账号成功,正在刷新列表信息~');
                        _this.formOne.addAccountInfo.dialogShow = false;
                        _this.formOne.addAccountInfo.uid = '';
                        _this.formOne.addAccountInfo.account = '';
                        _this.formOne.addAccountInfo.password = '';
                        setTimeout(function() {//给1s的延时，省得会影响弹出服务端的
                            _this.getTableManage();
                        }, 1000);
                    }
                    else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
            }
        },
        oneBtn(type) {
            var _this = this;
            if(type==0) {
                _this.formOne.btns.one.dialogShow = false;
            }
            else if(type==1) {
                var url = baseConfig.server+'/server/index.php/Family/addFamilyMasterMember';
                var params = {
                    uid: _this.formOne.btns.one.uid,
                    uid_list: _this.formOne.btns.one.uid_list,
                };
                axios.get(url, { params: params })
                .then((res) => {
                    if(res.data.code) {
                        _this.formOne.btns.one.dialogShow = false;
                        baseConfig.successTipMsg(_this, '添加账号成功~');
                    }
                    else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
            }
        },
        twoBtn(row) {
            var _this = this;
            _this.formTwo.uid = row.uid;
            _this.getAccountTable();
            _this.tabActiveName = 'second';
        },
        threeBtn(type) {
            var _this = this;
            if(type==0) {
                _this.formOne.btns.three.dialogShow = false;
            }
            else if(type==1) {
                var url = baseConfig.server+'/server/index.php/Family/resetFamilyMasterPassWord';
                var params = {
                    uid: _this.formOne.btns.three.uid,
                };
                axios.get(url, { params: params })
                .then((res) => {
                    if(res.data.code) {
                        _this.formOne.btns.three.dialogShow = false;
                        baseConfig.successTipMsg(_this, '密码重置成功~');
                    }
                    else {
                        baseConfig.errorTipMsg(_this, _this.data.msg);
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
            }
        },
        fourBtn(type) {
            var _this = this;
            if(type==0) {
                _this.formOne.btns.four.dialogShow = false;
            }
            else if(type==1) {
                var url = baseConfig.server+'/server/index.php/Family/delFamilyMasterPassTicket';
                var params = {
                    uid: _this.formOne.btns.four.uid,
                };
                axios.get(url, { params: params })
                .then((res) => {
                    if(res.data.code) {
                        _this.formOne.btns.four.dialogShow = false;
                        baseConfig.successTipMsg(_this, '删除账号成功~');
                        setTimeout(function() {
                            _this.getTableManage();
                        }, 1000);
                    }
                    else {
                        baseConfig.errorTipMsg(_this, _this.data.msg);
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
            }
        },
        /*
            第二个tab页面对应的方法
            1、twoHandleCurrentChange：对应的页面翻转的方法
            2、getAccountTable：获取成员列表内容
            3、getOneAccount：获取单个成员的内容
            4、Unbind：解除绑定
        */
        twoHandleCurrentChange(val) {
			// val指的是当前点击是第一页
			var _this = this;
            val = val - 1;
            _this.formTwo.page = val;
            _this.getAccountTable();
        },
        getAccountTable() {
            var _this = this;
            var url = baseConfig.server+'/server/index.php/Family/getFamilyMasterMemberInfoList';
            var params = {
                uid: _this.formTwo.uid,
                page: _this.formTwo.page,
            };
            axios.get(url, { params: params })
            .then((res) => {
                if(res.data.code) {
                    _this.formTwo.tabData = res.data.data;
                    // 第一次在第0页的时候无数据进行提示没有数据
                    if(res.data.data.length==0&&_this.formTwo.page=='0') {
                        baseConfig.warningTipMsg(_this, '该账号（'+_this.formTwo.uid+'）下面没有数据啦~');
                    }
                }
                else {
                    baseConfig.errorTipMsg(_this, res.data.msg);
                }
            })
            .catch((err) => {
                console.log(err);
            })
        },
        getOneAccount() {
            var _this = this;
            var url = baseConfig.server+'/server/index.php/Family/getFamilyMasterMemberDataList';
            var params = {
                condition_uid: _this.formTwo.condition_uid,
            };
            axios.get(url, { params: params })
            .then((res) => {
                if(res.data.code) {
                    _this.formTwo.tabData = res.data.data;
                }
            })
            .catch((err) => {
                console.log(err);
            })
        },
        Unbind(row, index) {
            var _this = this;
            _this.formTwo.unbind.uid = row.master_uid;
            _this.formTwo.unbind.slave_uid = row.slave_uid;
            var url = baseConfig.server+'/server/index.php/Family/delFamilyMasterMemberShip';
            var params = {
                uid: _this.formTwo.unbind.uid,
                slave_uid: _this.formTwo.unbind.slave_uid,
            };
            axios.get(url, { params: params })
            .then((res) => {
                if(res.data.code) {
                    baseConfig.successTipMsg(_this, res.data.msg);
                    // 不数据再次请求，直接将此条数据抹除掉
                    _this.formTwo.tabData.splice(index, 1);
                }
            })
            .catch((err) => {
                console.log(err);
            })
        },
        /*
            进行对应的顶部tab栏目的切换，在这里进行判断
        */
		handleClick(tab, event) {
			var _this = this;
            if(tab.label=='成员列表') {
                if(_this.formTwo.uid==''&&_this.formTwo.condition_uid=='') {
                    baseConfig.warningTipMsg(_this, '请在第一屏里面点击成员列表进入、或者快速查询~');
                }
            }
		},
	},
	mounted() {
		var _this = this;
		this.$nextTick(function() {
			_this.tableOneHeight = baseConfig.lineNumber(tabSearchPageHeight);
			_this.tableTwoHeight = baseConfig.lineNumber(tabSearchPageHeight);
			_this.getTableManage();
		})
	}
};
</script>

<style lang="css" scoped>
/* 引入的图片展示样式 */
.fileinput{
	float: left;
	margin-top: 8px;
}
</style>

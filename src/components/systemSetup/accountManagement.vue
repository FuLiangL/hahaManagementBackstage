<template>
    <!-- 账号管理 -->
    <section>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" style="overflow: hidden;">
                <el-form-item>
                    <el-button type="primary" @click="addDialog.dialogShow=true;">添加账号</el-button>
                    <el-button type="primary" @click="permissionDialog.dialogShow=true;">组别权限简介</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <template>
            <el-table :data="onePageData" border fit highlight-current-row v-loading="listLoading" style="width: 100%;" :height="tableHeight">
                <el-table-column prop="id" label="序号ID" width="80" sortable></el-table-column>
                <el-table-column prop="user_name" label="登录账号" width="100" sortable></el-table-column>
                <el-table-column prop="real_name" label="姓名" width="150" sortable></el-table-column>
                <el-table-column prop="add_time" label="添加时间" width="150" sortable></el-table-column>
                <el-table-column prop="channel_name_list" label="渠道列表" min-width="150" sortable></el-table-column>
                <el-table-column label="权限组别" width="100" sortable>
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <p v-if="scope.row.auth_code==1">T1</p>
                            <p v-else-if="scope.row.auth_code==2">T2</p>
                            <p v-else-if="scope.row.auth_code==3">P1</p>
                            <p v-else-if="scope.row.auth_code==4">P2</p>
                            <p v-else-if="scope.row.auth_code==5">O1</p>
                            <p v-else-if="scope.row.auth_code==6">O2</p>
                            <p v-else-if="scope.row.auth_code==7">M</p>
                            <p v-else-if="scope.row.auth_code==8">C</p>
                            <p v-else-if="scope.row.auth_code==9">G</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="页面权限" width="100" sortable>
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <p v-if="scope.row.page_auth_code==0">无权限</p>
                            <p v-else-if="scope.row.page_auth_code==1">有操作权限</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="400" sortable>
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <el-button type="primary" size="mini" @click.native.prevent="editDialogShow(scope.$index, formOne.tabData)">编辑管理员</el-button>
                            <el-button type="primary" size="mini" @click.native.prevent="changePassWordShow(scope.$index, formOne.tabData)">重置密码</el-button>
                            <el-button type="danger" size="mini" @click.native.prevent="delDialogShow(scope.$index, formOne.tabData)">删除账号</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-col :span="24" class="toolbar">
                <el-pagination layout="total,prev,pager,next,jumper" @current-change="oneHandleCurrentChange" :page-size="1000" :total="formOne.totalPage" style="float: right;"></el-pagination>
            </el-col>
        </template>
        <el-dialog title="添加账号" :visible.sync="addDialog.dialogShow">
            <el-form :model="addDialog">
                <el-form-item label="账号" :label-width="formLabelWidth">
                    <el-input v-model="addDialog.user_name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="addDialog.real_name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input disabled v-model="addDialog.pass_word" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="渠道权限" :label-width="formLabelWidth">
                    <el-input disabled type="textarea" :autosize="{ minRows: 1, maxRows: 4}" v-model="addDialog.channel_name_list" auto-complete="off"></el-input>
                    <el-button type="primary" size="mini" @click="channelAddSelect">渠道选择</el-button><span style="color: red;">默认为全渠道的</span>
                </el-form-item>
                <el-form-item label="页面权限" :label-width="formLabelWidth">
                    <el-select v-model="addDialog.auth_code">
                        <el-option label="T1" value="1"></el-option>
                        <el-option label="T2" value="2"></el-option>
                        <el-option label="P1" value="3"></el-option>
                        <el-option label="P2" value="4"></el-option>
                        <el-option label="O1" value="5"></el-option>
                        <el-option label="O2" value="6"></el-option>
                        <el-option label="M" value="7"></el-option>
                        <el-option label="C" value="8"></el-option>
                        <el-option label="G" value="9"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="操作权限" :label-width="formLabelWidth">
                    <el-select v-model="addDialog.page_auth_code">
                        <el-option label="无权限" value="0"></el-option>
                        <el-option label="有操作权限" value="1"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native.prevent="addDialogBtn(0)">取 消</el-button>
                <el-button type="primary" @click.native.prevent="addDialogBtn(1)">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="编辑管理员" :visible.sync="editDialog.dialogShow">
            <el-form :model="editDialog">
                <el-form-item label="ID" :label-width="formLabelWidth">
                    <el-input disabled v-model="editDialog.id" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="账号" :label-width="formLabelWidth">
                    <el-input disabled v-model="editDialog.user_name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input disabled v-model="editDialog.real_name" auto-complete="off"></el-input>
                </el-form-item>
                <!-- <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input v-model="editDialog.pass_word" auto-complete="off"></el-input>
                </el-form-item> -->
                <el-form-item label="渠道权限" :label-width="formLabelWidth">
                    <el-input disabled type="textarea" :autosize="{ minRows: 1, maxRows: 4}" v-model="editDialog.channel_name_list" auto-complete="off"></el-input>
                    <el-button type="primary" size="mini" @click="channelEditSelect">渠道选择</el-button>
                </el-form-item>
                <el-form-item label="页面权限" :label-width="formLabelWidth">
                    <el-select v-model="editDialog.auth_code">
                        <el-option label="T1" value="1"></el-option>
                        <el-option label="T2" value="2"></el-option>
                        <el-option label="P1" value="3"></el-option>
                        <el-option label="P2" value="4"></el-option>
                        <el-option label="O1" value="5"></el-option>
                        <el-option label="O2" value="6"></el-option>
                        <el-option label="M" value="7"></el-option>
                        <el-option label="C" value="8"></el-option>
                        <el-option label="G" value="9"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="操作权限" :label-width="formLabelWidth">
                    <el-select v-model="editDialog.page_auth_code">
                        <el-option label="无权限" value="0"></el-option>
                        <el-option label="有操作权限" value="1"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native.prevent="editDialogBtn(0)">取 消</el-button>
                <el-button type="primary" @click.native.prevent="editDialogBtn(1)">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="重置密码" :visible.sync="changePassWord.dialogShow">
            <el-form :model="changePassWord">
                <el-form-item label="ID" :label-width="formLabelWidth">
                    <el-input disabled v-model="changePassWord.id" auto-complete="off"></el-input>						
                </el-form-item>
                <el-form-item label="账号" :label-width="formLabelWidth">
                    <el-input disabled v-model="changePassWord.user_name" auto-complete="off"></el-input>						
                </el-form-item>
                <!-- <el-form-item label="原来的密码" :label-width="formLabelWidth">
                    <el-input v-model="changePassWord.old_pass_word" auto-complete="off"></el-input>						
                </el-form-item> -->
                <el-form-item label="默认重置密码" :label-width="formLabelWidth">
                    <el-input disabled v-model="changePassWord.new_pass_word" auto-complete="off"></el-input>						
                </el-form-item>
                <!-- <el-form-item label="再次输入密码" :label-width="formLabelWidth">
                    <el-input v-model="changePassWord.again_pass_word" auto-complete="off"></el-input>						
                </el-form-item> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native.prevent="changePassWordBtn(0)">取 消</el-button>
                <el-button type="primary" @click.native.prevent="changePassWordBtn(1)">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="删除管理员" :visible.sync="delDialog.dialogShow">
            <el-form :model="delDialog">
                <p style="width: 100%; text-align: center; color: red; font-size: 20px;">确定删除账号{{delDialog.user_name}}管理员?</p>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native.prevent="delDialogBtn(0)">取 消</el-button>
                <el-button type="primary" @click.native.prevent="delDialogBtn(1)">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="编辑页面渠道选择列表" :visible.sync="channelEditDialog.dialogShow">
            <el-checkbox :indeterminate="channelEditDialog.isIndeterminate" v-model="channelEditDialog.checkAll" @change="handleCheckAllChangeEdit">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="channelEditDialog.checkedchannels" @change="handleCheckedchannelsChangeEdit">
                <el-checkbox style="width: 200px; height: 35px; margin-left: 10px; margin-top: 2px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;" border size="medium" v-for="item in channelEditDialog.channels" :label="item.id" :key="item.id">{{item.annotation}}</el-checkbox>
            </el-checkbox-group>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native.prevent="channelEditDialogBtn(0)">取 消</el-button>
                <el-button type="primary" @click.native.prevent="channelEditDialogBtn(1)">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="添加页面渠道选择列表" :visible.sync="channelAddDialog.dialogShow">
            <el-checkbox :indeterminate="channelAddDialog.isIndeterminate" v-model="channelAddDialog.checkAll" @change="handleCheckAllChangeAdd">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="channelAddDialog.checkedchannels" @change="handleCheckedchannelsChangeAdd">
                <el-checkbox style="width: 200px; height: 35px; margin-left: 10px; margin-top: 2px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;" border size="medium" v-for="item in channelAddDialog.channels" :label="item.id" :key="item.id">{{item.annotation}}</el-checkbox>
            </el-checkbox-group>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native.prevent="channelAddDialogBtn(0)">取 消</el-button>
                <el-button type="primary" @click.native.prevent="channelAddDialogBtn(1)">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="组别权限简介" :visible.sync="permissionDialog.dialogShow">
            <el-form :model="permissionDialog">
                <el-table :data="permissionDialog.dataArr">
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column prop="name" label="权限组别" width="80"></el-table-column>
                    <el-table-column label="权限组别说明" min-width="200">
                        <template slot-scope="scope">
                            <div slot="reference" class="name-wrapper">
                                <div style="text-align: left;" v-for="(item, index) in scope.row.content" :key="index">{{item}}</div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
        </el-dialog>
    </section>
</template>

<script>
/* 逻辑交互js内容 */
import Event from './../../public_js/event.js';
import { allget } from '../../api/api';
import store from '../../vuex/store';
import axios from 'axios';
import md5 from '../../public_js/md5.js';
export default {
    data() {
        return {
            tableHeight: null,
            formOne: {
                tabData: [],
                totalPage: null,
                page: 0,
                star: '0',
                end: '1000',//直接给一个最大的1000的用户量
            },
            addDialog: {
                dialogShow: false,
                user_name: '',
                real_name: '',
                pass_word: '123456',
                channel_id_list: '',
                channel_name_list: '',
                auth_code: '',
                page_auth_code: '',
            },
            editDialog: {
                dialogShow: false,
                id: '',
                user_name: '',
                real_name: '',
                pass_word: '',
                channel_id_list: '',
                channel_name_list: '',
                auth_code: '',
                page_auth_code: '',
            },
            changePassWord: {
                dialogShow: false,
                id: '',
                user_name: '',
                old_pass_word: '',
                new_pass_word: '123456',     
                again_pass_word: '123456',
            },
            delDialog: {
                dialogShow: false,
                id: '',  
                user_name: '',
            },
            channelEditDialog: {//编辑渠道列表
                dialogShow: false,
                checkAll: false,
                checkedchannels: [],
                channels: [],
                isIndeterminate: true,
            },
            channelAddDialog: {//新增渠道列表
                dialogShow: false,
                checkAll: false,
                checkedchannels: [],
                channels: [],
                isIndeterminate: true,
            },
            permissionDialog: {//组别权限简介
                dialogShow: false,
                dataArr: [
                    {name: 'T1', content: [
                        '*所有页面*',
                    ]},
                    {name: 'T2', content: [
                        '*除去以下页面*', 
                        '1、运营支撑->财务管理->提现审核(二次审核)/货币申请审核/充值配置列表；', 
                        '2、系统设置->账号管理。',
                    ]},
                    {name: 'P1', content: [
                        '*所有页面*',
                    ]},
                    {name: 'P2', content: [
                        '*除去以下页面*', 
                        '1、运营支撑->财务管理->提现审核(二次审核)/货币申请审核/充值配置列表；', 
                        '2、系统设置->账号管理/全局参数/图片上传。',
                    ]},
                    {name: 'O1', content: [
                        '*除去以下页面*', 
                        '1、系统设置->账号管理/全局参数/图片上传。',
                    ]},
                    {name: 'O2', content: [
                        '*除去以下页面*', 
                        '1、运营支撑->财务管理->提现审核(二次审核)/货币申请审核/充值配置列表；', 
                        '2、系统设置->账号管理/全局参数/图片上传。',
                    ]},
                    {name: 'M', content: [
                        '*仅包含以下页面*', 
                        '1、运营数据->运营数据下所有页面；', 
                        '2、用户管理->用户信息管理->用户信息查询；',
                        '3、用户管理->代理推广管理下所有页面；',
                        '4、运营支撑->运营工具->版本更新管理；',
                        '5、运营支撑->财务管理->充值流水查询/提现记录；',
                        '6、系统设置->修改密码。',
                    ]},
                    {name: 'C', content: [
                        '*仅包含以下页面*',
                        '1、用户管理->用户信息管理下所有页面；',
                        '2、用户管理->家族管理->除解散家族/修改家族等级/家族后台账号管理之外的所有页面；',
                        '3、用户管理->代理推广管理->除代理绑定查询之外的所有页面；',
                        '4、运营支撑->财务管理->充值流水查询/提现记录；',
                        '5、运营支撑->通话日志/录音日志下所有页面；',
                        '6、系统设置->修改密码。',
                    ]},
                    {name: 'G', content: [
                        '*仅包含以下页面*',
                        '1、运营数据->渠道数据->分渠道数据；',
                        '2、系统设置->修改密码。',
                    ]},
                ],
            },
            listLoading: false,
            formLabelWidth: '120px',
            textAlign: 'left',
        }
    }, 
    computed: {
        onePageData() {
            var _this = this;
            return _this.formOne.tabData.slice(_this.formOne.star, _this.formOne.end);
        }
    },
    methods:{
        oneHandleCurrentChange(val) {
            var _this = this;
            _this.formOne.page = val;
            _this.formOne.star = (_this.formOne.page-0)*20;
            _this.formOne.end = _this.formOne.star-0+1000;
        },
        getTableData() {
            var _this = this;
            _this.listLoading = true;
            var url = '/NewLoginTpl/getAdminList';
            allget('', url)
            .then(res => {
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
        // 编辑管理员
        editDialogShow(index, rows) {
            var _this = this;
            _this.editDialog.dialogShow = true;
            _this.editDialog.id = rows[index].id;
            _this.editDialog.user_name = rows[index].user_name;
            _this.editDialog.real_name = rows[index].real_name;
            _this.editDialog.pass_word = rows[index].pass_word;
            _this.editDialog.channel_id_list = rows[index].channel_id_list;
            _this.editDialog.channel_name_list = rows[index].channel_name_list;
            _this.editDialog.auth_code = rows[index].auth_code;
            _this.editDialog.page_auth_code = rows[index].page_auth_code;
        },
        // 重置密码 
        changePassWordShow(index, rows) {
            var _this = this;
            _this.changePassWord.dialogShow = true;
            _this.changePassWord.id = rows[index].id;
            _this.changePassWord.user_name = rows[index].user_name;
            _this.changePassWord.old_pass_word = rows[index].pass_word;
        },
        // 重置密码取消确定操作
        changePassWordBtn(type) {
            var _this = this;
            if(type==0) {
                _this.changePassWord.dialogShow = false;
            } else if(type==1) {
                _this.listLoading = true;
                var url = '/NewLoginTpl/resetPassWord';               
                let formData = new FormData();
              	formData.append('id', _this.changePassWord.id);
              	let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'  //之前说的以表单传数据的格式来传递fromdata
                    }
                };
                axios.post(baseConfig.server+baseConfig.requestUrl+url, formData, config)
                .then( (res) => {
                    _this.listLoading = false;     
                    if(res.data.ret) {
                        _this.changePassWord.dialogShow = false;
                        _this.getTableData();
                        baseConfig.successTipMsg(_this, '重置密码成功啦~');
                    } else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                })
                .catch((error) =>{
                    console.log(error);
                });
            }
        },
        // 删除管理员
        delDialogShow(index, rows) {
            var _this = this;
            _this.delDialog.dialogShow = true;
            _this.delDialog.id = rows[index].id;
            _this.delDialog.user_name = rows[index].user_name;
        },
        // 删除管理员取消确定操作
        delDialogBtn(type) {
            var _this = this;
            if(type==0) {
                _this.delDialog.dialogShow = false;                
            } else if(type==1) {
                _this.listLoading = true;
                var url = '/NewLoginTpl/delAdmin';
                var params = {
                    id: _this.delDialog.id,
                };
                allget(params, url)
                .then(res => {
                    _this.delDialog.dialogShow = false;   
                    if(res.data.ret) {
                        _this.getTableData();
                        baseConfig.successTipMsg(_this, '删除管理员成功啦~');
                    } else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                })
                .catch(error => {
                    console.log(error);
                })
            }

        },
        // 编辑管理员的确定取消(编辑)
        editDialogBtn(type) {
            var _this = this;
            if(type==0) {
                _this.editDialog.dialogShow = false;
            } else if(type==1) {
                _this.listLoading = true;
                var url = '/NewLoginTpl/editAdmin';
                let formData = new FormData();
              	formData.append('id', _this.editDialog.id);
              	formData.append('user_name', _this.editDialog.user_name);
              	formData.append('real_name', _this.editDialog.real_name);
              	formData.append('pass_word', _this.editDialog.pass_word);
              	formData.append('channel_id_list', _this.editDialog.channel_id_list);
              	formData.append('channel_name_list', _this.editDialog.channel_name_list);
              	formData.append('auth_code', _this.editDialog.auth_code);
              	formData.append('page_auth_code', _this.editDialog.page_auth_code);
                console.log(formData.get('pass_word'));
              	let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'  //之前说的以表单传数据的格式来传递fromdata
                    }
                };
                axios.post(baseConfig.server+baseConfig.requestUrl+url, formData, config)
                .then( (res) => {
                    _this.listLoading = false;     
                    if(res.data.ret) {
                        _this.editDialog.dialogShow = false;
                        _this.getTableData();
                        baseConfig.successTipMsg(_this, '编辑管理成功啦~');
                    } else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                })
                .catch((error) =>{
                    console.log(error);
                });
            }
        },
        // 添加管理员的确定取消(添加)
        addDialogBtn(type) {
            var _this = this;
            if(type==0) {
                _this.addDialog.dialogShow = false;
            } else if(type==1) {
                _this.listLoading = true;
                var url = '/NewLoginTpl/addAdmin';
                let formData = new FormData();
              	formData.append('user_name', _this.addDialog.user_name);
              	formData.append('real_name', _this.addDialog.real_name);
              	formData.append('pass_word', md5(_this.addDialog.pass_word));
              	formData.append('channel_id_list', _this.addDialog.channel_id_list);
              	formData.append('channel_name_list', _this.addDialog.channel_name_list);
              	formData.append('auth_code', _this.addDialog.auth_code);
              	formData.append('page_auth_code', _this.addDialog.page_auth_code);
              	let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'  //之前说的以表单传数据的格式来传递fromdata
                    }
                };
                if(formData.get('user_name')!='' && formData.get('real_name')!='' && formData.get('pass_word')!='' && formData.get('auth_code')!='' && formData.get('page_auth_code')!='') {
                    axios.post(baseConfig.server+baseConfig.requestUrl+url, formData, config)
                    .then( (res) => {
                        _this.listLoading = false;     
                        if(res.data.ret) {
                            _this.addDialog.dialogShow = false;
                            _this.getTableData();
                            baseConfig.successTipMsg(_this, '添加管理成功啦~');
                        } else {
                            baseConfig.errorTipMsg(_this, res.data.msg);
                        }
                    })
                    .catch((error) =>{
                        console.log(error);
                    });
                } else {
                    baseConfig.errorTipMsg(_this, '请认真填写啦~');
                }
            }
        },
        // 渠道选择编辑的弹窗
        channelEditSelect() {
            var _this = this;
            _this.channelEditDialog.dialogShow = true;
            var arrChannelId= []; 
            arrChannelId = _this.editDialog.channel_id_list.split(',');
            console.log(arrChannelId);
            _this.channelEditDialog.checkedchannels = []; 
            for(var i=0; i<arrChannelId.length; i++) {
                _this.channelEditDialog.checkedchannels.push(arrChannelId[i]);
            }
        },
        // 渠道选择添加的弹窗
        channelAddSelect() {
            var _this = this;
            _this.channelAddDialog.dialogShow = true;
            var arrChannelId= []; 
            arrChannelId = _this.addDialog.channel_id_list.split(',');
            console.log(arrChannelId);
            _this.channelAddDialog.checkedchannels = []; 
            for(var i=0; i<arrChannelId.length; i++) {
                _this.channelAddDialog.checkedchannels.push(arrChannelId[i]);
            }
        },
        // 取出当前渠道的详细的信息
        getAllChannel() {
            var _this = this;
            var url = '/NewLoginTpl/getHtmlAskChannel';
            allget('', url)
            .then(res => {
                if(res.data.ret) {
                    _this.channelEditDialog.channels = res.data.data;
                    _this.channelAddDialog.channels = res.data.data;
                    _this.addDialog.channel_id_list = '';
                    _this.addDialog.channel_name_list = '';
                    for(var i=0; i<res.data.data.length; i++) {
                        if(_this.addDialog.channel_id_list=='') {
                            _this.addDialog.channel_id_list = res.data.data[i].id;
                        } else {
                            _this.addDialog.channel_id_list += ','+res.data.data[i].id;                            
                        }
                        if(_this.addDialog.channel_name_list=='') {
                            _this.addDialog.channel_name_list = res.data.data[i].annotation;                            
                        } else {
                            _this.addDialog.channel_name_list += ','+res.data.data[i].annotation;                        
                        }
                    }
                } else {
                    baseConfig.errorTipMsg(_this, res.data.msg);
                }
            })
            .catch(function(error) {
                console.log(error);
            })
        },
        // 是否全选的按钮（编辑）
        handleCheckAllChangeEdit(val) {
            var _this = this;
            var arrChannelId = [];//只需要进行当前的渠道id
            for(var i=0; i<_this.channelEditDialog.channels.length; i++) {
                arrChannelId.push(_this.channelEditDialog.channels[i].id);
            }
            _this.channelEditDialog.checkedchannels = val ? arrChannelId : [];
            _this.channelEditDialog.isIndeterminate = false;
        },
        // 是否全选的按钮（添加）
        handleCheckAllChangeAdd(val) {
            var _this = this;
            var arrChannelId = [];//只需要进行当前的渠道id
            for(var i=0; i<_this.channelAddDialog.channels.length; i++) {
                arrChannelId.push(_this.channelAddDialog.channels[i].id);
            }
            _this.channelAddDialog.checkedchannels = val ? arrChannelId : [];
            _this.channelAddDialog.isIndeterminate = false;
        },
        // 编辑渠道的弹窗的单个选择（编辑）
        handleCheckedchannelsChangeEdit(value) {
            var _this = this;
            var checkedCount = value.length;
            _this.channelEditDialog.checkAll = checkedCount === _this.channelEditDialog.channels.length;
            _this.channelEditDialog.isIndeterminate = checkedCount > 0 && checkedCount < _this.channelEditDialog.channels.length;
        },
        // 编辑渠道的弹窗的单个选择（添加）
        handleCheckedchannelsChangeAdd(value) {
            var _this = this;
            var checkedCount = value.length;
            _this.channelAddDialog.checkAll = checkedCount === _this.channelAddDialog.channels.length;
            _this.channelAddDialog.isIndeterminate = checkedCount > 0 && checkedCount < _this.channelAddDialog.channels.length;
        },
        // 编辑渠道的取消确定操作（编辑）
        channelEditDialogBtn(type) {
            var _this = this;
            if(type==0) {//取消的操作
                _this.channelEditDialog.dialogShow = false;
            } else if(type==1) {//确定的操作
                _this.channelEditDialog.dialogShow = false;                
                var strChannelId = '';//渠道的id
                var strChannelName = '';//渠道的名称
                for(var i=0; i<_this.channelEditDialog.checkedchannels.length; i++) {
                    if(strChannelId=='') {
                        strChannelId += _this.channelEditDialog.checkedchannels[i];
                    } else {
                        strChannelId += ','+_this.channelEditDialog.checkedchannels[i];                        
                    }
                    for(var j=0; j<_this.channelEditDialog.channels.length; j++) {
                        if(_this.channelEditDialog.checkedchannels[i]==_this.channelEditDialog.channels[j].id) {
                            if(strChannelName=='') {                                
                                strChannelName += _this.channelEditDialog.channels[j].annotation;
                            } else {
                                strChannelName += ','+_this.channelEditDialog.channels[j].annotation;
                            }
                        }
                    }
                }
                _this.editDialog.channel_id_list = strChannelId;
                _this.editDialog.channel_name_list = strChannelName;
            }
        },
        // 编辑渠道的取消确定操作（添加）
        channelAddDialogBtn(type) {
            var _this = this;
            if(type==0) {//取消的操作
                _this.channelAddDialog.dialogShow = false;
            } else if(type==1) {//确定的操作
                _this.channelAddDialog.dialogShow = false;                
                var strChannelId = '';//渠道的id
                var strChannelName = '';//渠道的名称
                for(var i=0; i<_this.channelAddDialog.checkedchannels.length; i++) {
                    if(strChannelId=='') {
                        strChannelId += _this.channelAddDialog.checkedchannels[i];
                    } else {
                        strChannelId += ','+_this.channelAddDialog.checkedchannels[i];                        
                    }
                    for(var j=0; j<_this.channelAddDialog.channels.length; j++) {
                        if(_this.channelAddDialog.checkedchannels[i]==_this.channelAddDialog.channels[j].id) {
                            if(strChannelName=='') {                                
                                strChannelName += _this.channelAddDialog.channels[j].annotation;
                            } else {
                                strChannelName += ','+_this.channelAddDialog.channels[j].annotation;
                            }
                        }
                    }
                }
                _this.addDialog.channel_id_list = strChannelId;
                _this.addDialog.channel_name_list = strChannelName;
            }
        },
    },
    mounted() {
        var _this = this;
        _this.$nextTick(function() {
            _this.tableHeight = baseConfig.lineNumber(searchPageHeight);
            _this.getTableData();
            _this.getAllChannel();
        });
    }
}
</script>

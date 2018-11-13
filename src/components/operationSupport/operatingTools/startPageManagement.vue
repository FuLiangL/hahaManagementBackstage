<template>
    <!-- 启动页查询 -->
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
                    <span>上线状态</span>
                    <el-select v-model="is_show">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="上线" value="1"></el-option>
                        <el-option label="下线" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getTableData(0)">查询</el-button>
                    <el-button type="primary" @click="dialogShow=true;">添加启动页</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--用户的数据展示列表-->
        <template>
            <el-table ref="tableHeight" :data="tabData" border fit highlight-current-row v-loading="listLoading" style="width: 100%;" :height="tableHeight">
                <el-table-column prop="add_time" label="添加时间"></el-table-column>
                <el-table-column prop="id" label="启动页ID"></el-table-column>
                <el-table-column prop="title" label="启动页名称"></el-table-column>
                <el-table-column prop="image_url" label="图片">
                    <template slot-scope="scope">
                        <el-popover trigger="click" placement="left">
                            <img :src="scope.row.image_url" alt="" style="width:300px;height:300px;">
                            <div slot="reference" class="name-wrapper">
                                <img :src="scope.row.image_url" alt="" style="width:100px;height:100px;">
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="jump_url" label="跳转地址" width="200"></el-table-column>
                <el-table-column prop="item" label="目标系统" :formatter="judgeItem"></el-table-column>
                <el-table-column prop="version_min" label="最小版本"></el-table-column>
                <el-table-column prop="version_max" label="最大版本"></el-table-column>
                <el-table-column prop="type" label="跳转类型" :formatter="judgeType"></el-table-column>
                <el-table-column prop="show_long_time" label="展示周期"></el-table-column>
                <el-table-column prop="is_show" label="上线状态" :formatter="judgeShow"></el-table-column>
                <el-table-column prop="operation_name" label="操作" width="200">
                    <template slot-scope="scope">
                        <div v-if="scope.row.is_show == 0">
                            <el-button type="primary" @click="editUserData(scope.$index, scope.row)" size="small">编辑</el-button>
                            <el-button type="primary" @click="setLine(scope.$index, scope.row, 1)" size="small">上线</el-button>
                            <el-button type="danger" @click="deleteData(scope.$index, scope.row)" size="small">删除</el-button>
                        </div>
                        <div v-else-if="scope.row.is_show == 1">
                            <el-button type="primary" @click="setLine(scope.$index, scope.row, 0)" size="small">下线</el-button>
                            <el-button type="danger" @click="deleteData(scope.$index, scope.row)" size="small">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 新加启动页 -->
            <el-dialog title="新加启动页" :visible.sync="dialogShow">
                <el-form :model="formData">

                    <el-form-item label="启动页名称" :label-width="formLabelWidth">
                        <el-input v-model="formData.title"></el-input>
                    </el-form-item>
                    <el-form-item label="图片上传" :label-width="formLabelWidth">
                        <input class="filepic fileinput" @change="uploading($event, 0)" type="file">
                        <img :src="formData.pic" style="width: 100px; height: auto;" />
                    </el-form-item>
                    <el-form-item label="目标系统" :label-width="formLabelWidth">
                        <el-select v-model="formData.item">
                            <el-option label="安卓" value="1"></el-option>
                            <el-option label="ios" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="最高版本号" :label-width="formLabelWidth">
                        <el-input v-model="formData.version_max" placeholder="请输入最高版本号" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="最低版本号" :label-width="formLabelWidth">
                        <el-input v-model="formData.version_min" placeholder="请输入最低版本号" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="跳转类型" :label-width="formLabelWidth">
                        <el-select v-model="formData.type">
                            <el-option label="不跳转" value="0"></el-option>
                            <el-option label="H5跳转" value="2"></el-option>
                            <el-option label="应用内" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="H5链接" :label-width="formLabelWidth">
                        <el-input v-model="formData.jump_url" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="排序ID" :label-width="formLabelWidth">
                        <el-input v-model="formData.sort" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="上下线" :label-width="formLabelWidth">
                        <el-select v-model="formData.is_show">
                            <el-option label="上线" value="1"></el-option>
                            <el-option label="下线" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="倒计时长（秒）" :label-width="formLabelWidth">
                        <el-input v-model="formData.show_long_time" placeholder="请输入展示时长" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="页面跳转参数" :label-width="formLabelWidth">
                        <el-input v-model="formData.page_param" placeholder="请输入跳转参数" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="addPageSure(0)">取 消</el-button>
                    <el-button type="primary" @click.native.prevent="addPageSure(1)">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 编辑启动页 -->
            <el-dialog title="编辑启动页" :visible.sync="editData.dialogShow">
                <el-form :model="editData">

                    <el-form-item label="启动页名称" :label-width="formLabelWidth">
                        <el-input v-model="editData.title"></el-input>
                    </el-form-item>
                    <el-form-item label="图片上传" :label-width="formLabelWidth">
                        <input class="filepic fileinput" @change="uploading($event, 1)" type="file">
                        <img :src="editData.pic" style="width: 100px; height: auto;" />
                    </el-form-item>
                    <el-form-item label="目标系统" :label-width="formLabelWidth">
                        <el-select v-model="editData.item">
                            <el-option label="安卓" value="1"></el-option>
                            <el-option label="ios" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="最高版本号" :label-width="formLabelWidth">
                        <el-input v-model="editData.version_max" placeholder="请输入最高版本号" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="最低版本号" :label-width="formLabelWidth">
                        <el-input v-model="editData.version_min" placeholder="请输入最低版本号" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="跳转类型" :label-width="formLabelWidth">
                        <el-select v-model="editData.type">
                            <el-option label="不跳转" value="0"></el-option>
                            <el-option label="H5跳转" value="2"></el-option>
                            <el-option label="应用内" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="H5链接" :label-width="formLabelWidth">
                        <el-input v-model="editData.jump_url" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="排序ID" :label-width="formLabelWidth">
                        <el-input v-model="editData.sort" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="上下线" :label-width="formLabelWidth">
                        <el-select v-model="editData.is_show">
                            <el-option label="上线" value="1"></el-option>
                            <el-option label="下线" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="倒计时长（秒）" :label-width="formLabelWidth">
                        <el-input v-model="editData.show_long_time" placeholder="请输入展示时长" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="页面跳转参数" :label-width="formLabelWidth">
                        <el-input v-model="editData.page_param" placeholder="请输入跳转参数" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="sureEdit(0)">取 消</el-button>
                    <el-button type="primary" @click.native.prevent="sureEdit(1)">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 工具条 -->
            <el-col :span="24" class="toolbar">
                <el-pagination layout="total,prev, pager, next,jumper" :page-size="20" @current-change="handleCurrentChange" :current-page="page+1" :total=totalpage style="float:right; ">
                </el-pagination>
            </el-col>
        </template>

    </section>
</template>

<script>
/* 逻辑交互js内容 */
import Event from "./../../../public_js/event.js";
import { allget } from "../../../api/api";
import store from "../../../vuex/store";
import axios from "axios";
export default {
    data() {
        return {
            tableHeight: null, // table展示的页面的高度多少
            // 搜索条件的组装字段
            formOne: {
                choiceDate: [new Date() - 90 * 24 * 60 * 60 * 1000, new Date()] // 对应选择的日期,给默认时间180之前到现在
            },

            listLoading: false, //动画加载时显示的动画
            tabData: [], //列表的所有数据，移除删除的功能用全部的数据进行移除
            totalpage: 1000, //下方工具条的总页数
            page: 0, //现在数据展示的页数，当返回的是全部的数据时，设置默认的页面为1
            formLabelWidth: "120px", // 设置dialog弹框的宽度
            is_show: null,
            operation_name: null,
            dialogShow: false,
            formData: {
                title: "",
                file_pic: "",
                pic: "",
                item: "",
                version_min: "",
                version_max: "",
                type: "",
                jump_url: "",
                sort: "",
                is_show: "",
                show_long_time: "",
                page_param: ""
            },
            editData: {
                dialogShow: false,
                title: "",
                file_pic: "",
                pic: "",
                item: "",
                version_min: "",
                version_max: "",
                type: "",
                jump_url: "",
                sort: "",
                is_show: "",
                show_long_time: "",
                page_param: ""
            }
        };
    },
    methods: {
        judgeItem(row) {
            if (row.item == 0) {
                return "ios";
            } else if (row.item == 1) {
                return "安卓";
            }
        },
        judgeType(row) {
            if (row.type == 1) {
                return "应用内";
            } else if (row.type == 2) {
                return "H5页面";
            } else if (row.type == 0) {
                return "不跳转";
            }
        },
        judgeShow(row) {
            if (row.is_show == 0) {
                return "下线";
            } else if (row.is_show == 1) {
                return "上线";
            }
        },
        handleCurrentChange(val) {
            //服务器的第一页是0 所以 这里要 -1
            this.page = val - 1;
            this.getTableData();
        },
        // 搜索条件
        searchCondition() {
            var _this = this;
            var obj = {};
            obj.date_s = baseConfig.changeDateTime(
                _this.formOne.choiceDate[0],
                0
            ); // 给对象添加键值对
            obj.date_e = baseConfig.changeDateTime(
                _this.formOne.choiceDate[1],
                0
            ); // 给对象添加键值对
            obj.page = _this.page;
            obj.is_show = _this.is_show;
            if (obj.is_show == null || obj.is_show == "") {
                delete obj.is_show;
            }
            return obj; // return出组装好的搜索条件
        },

        // 获取数据列表
        getTableData(type) {
            var _this = this;
            _this.listLoading = true;
            var url = "/GlobalSet/getStartPage";
            var params = _this.searchCondition();
            if (type == 0) {
                _this.page = 0;
            }
            // 进行get请求，(请求参数params, 请求地址url)
            allget(params, url)
                .then(res => {
                    // 数据请求成功
                    _this.listLoading = false;
                    if (res.data.ret) {
                        // 正常数据
                        _this.tabData = res.data.data;
                    } else {
                        // 返回ret==0，非正常数据
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        // 上下线
        setLine(index, rows, type) {
            var _this = this;
            var url = "/GlobalSet/upDownStartPage";
            var param = {
                id: rows.id,
                is_show: type
            };
            allget(param, url)
                .then(res => {
                    if (res.data.ret) {
                        baseConfig.successTipMsg(_this, res.data.msg);
                        _this.getTableData();
                    } else {
                        baseConfig.warningTipMsg(_this, res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 删除
        deleteData(index, rows) {
            var _this = this;
            var url = "/GlobalSet/delStartPage";
            var param = {
                id: rows.id
            };
            allget(param, url)
                .then(res => {
                    if (res.data.ret) {
                        baseConfig.successTipMsg(_this, res.data.msg);
                        _this.getTableData();
                    } else {
                        baseConfig.warningTipMsg(_this, res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 得到上传文件
        uploading(event, type) {
            var _this = this;
            if(type == 0){
                var windowURL = window.URL || window.webkitURL; //创建图片文件的url
                _this.formData.pic = windowURL.createObjectURL(
                    event.target.files[0]
                );
                _this.formData.file_pic = event.target.files[0]; //获取文件
            }else if(type ==1){
                var windowURL = window.URL || window.webkitURL; //创建图片文件的url
                _this.editData.pic = windowURL.createObjectURL(
                    event.target.files[0]
                );
                _this.editData.file_pic = event.target.files[0]; //获取文件
            }
                console.log(event.target.files[0])
                
        },
        // 添加启动页
        addPageSure(type) {
            var _this = this;
            // 取消添加
            if (type == 0) {
                this.dialogShow = false;
            } else if (type == 1) {
                let formData = new FormData();
				formData.append('title', _this.formData.title);
				formData.append('jump_url', _this.formData.jump_url);
				formData.append('type', _this.formData.type);
				formData.append('sort', _this.formData.sort);
				formData.append('is_show', _this.formData.is_show);
				formData.append('item', _this.formData.item);
				formData.append('version_min', _this.formData.version_min);
				formData.append('version_max', _this.formData.version_max);
				formData.append('show_long_time', _this.formData.show_long_time);
				formData.append('page_param', _this.formData.page_param);
				formData.append('pic', _this.formData.file_pic);
				let config = {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
                };	
                axios.post(baseConfig.server+baseConfig.requestUrl+'/GlobalSet/addStartPage', formData, config)
                .then(res =>{
                    if(res.data.ret){
                        baseConfig.successTipMsg(_this, res.data.msg);
                        _this.dialogShow = false;
                        _this.getTableData();
                        //完成后清空数据
                        _this.formData.title = "";
                        _this.formData.jump_url = "";
                        _this.formData.type = "";
                        _this.formData.sort = "";
                        _this.formData.is_show = "";
                        _this.formData.item = "";
                        _this.formData.version_min = "";
                        _this.formData.version_max = "";
                        _this.formData.show_long_time = "";
                        _this.formData.page_param = "";
                    }else{
                        baseConfig.warningTipMsg(_this, res.data.msg);
                    }
                }).catch(error => {
                    console.log(error);
                })
            }
        },
        // 编辑
        editUserData(index, row){
            this.editData.id = row.id;
            this.editData.title = row.title;
            this.editData.file_pic = row.image_url;
            this.editData.pic = row.image_url;
            this.editData.item = row.item;
            this.editData.version_min = row.version_min;
            this.editData.version_max = row.version_max;
            this.editData.type = row.type;
            this.editData.jump_url = row.jump_url;
            this.editData.sort = row.sort;
            this.editData.is_show = row.is_show;
            this.editData.show_long_time = row.show_long_time;
            this.editData.page_param = row.page_param;
            this.editData.dialogShow = true;

        },
        sureEdit(type) {
            var _this = this;
            if(type == 0){
                _this.editData.dialogShow = false;
            }else if( type ==1){
                let formData = new FormData();
				formData.append('id', _this.editData.id);
				formData.append('title', _this.editData.title);
				formData.append('jump_url', _this.editData.jump_url);
				formData.append('type', _this.editData.type);
				formData.append('sort', _this.editData.sort);
				formData.append('is_show', _this.editData.is_show);
				formData.append('item', _this.editData.item);
				formData.append('version_min', _this.editData.version_min);
				formData.append('version_max', _this.editData.version_max);
				formData.append('show_long_time', _this.editData.show_long_time);
				formData.append('page_param', _this.editData.page_param);
				formData.append('pic', _this.editData.file_pic);
				let config = {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
                };	
                console.log(_this.formData.file_pic)
                axios.post(baseConfig.server+baseConfig.requestUrl+'/GlobalSet/editStartPage', formData, config)
                .then(res =>{
                    if(res.data.ret){
                         baseConfig.successTipMsg(_this, res.data.msg);
                        this.editData.dialogShow = false;
                        _this.getTableData();
                    }else{
                        baseConfig.warningTipMsg(_this, res.data.msg);
                    }
                }).catch(error => {
                    console.log(error);
                })
            }
        }
    },
    mounted() {
        var _this = this;
        this.$nextTick(function() {
            _this.tableHeight = baseConfig.lineNumber(searchPageHeight);
            _this.getTableData();
            _this.operation_name = store.state.user.name; // 操作用户的昵称
        });
    }
};
</script>

<style lang="css" scoped>

</style>

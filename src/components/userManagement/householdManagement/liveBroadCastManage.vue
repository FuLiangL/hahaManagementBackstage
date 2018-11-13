<template>
    <!-- 房间数据和记录 -->
    <!-- dom结构内容 -->
    <section>
        <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane label="房间数据统计" name="first">
                <!-- 房间数据统计 -->
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true" style="overflow: hidden;">
                        <el-form-item>
                            <div class="block">
                                <span class="registerTime">日期</span>
                                <el-date-picker v-model="formOne.startDate1" type="daterange" range-separator=" 至 " start-placeholder="开始日期" end-placeholder="结束日期">
                                </el-date-picker>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <span>房间UID</span>
                            <el-input style="width:100px;" placeholder="请输入内容" v-model="room_id" clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <span>族长UID</span>
                            <el-input style="width:100px;" placeholder="请输入内容" v-model="owner_uid" clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <span>展示类型</span>
                            <el-select style="width: 100px;" v-model="room_type">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="家族房间" value="0"></el-option>
                                <el-option label="个人房间" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item style="float:right;margin-right: 100px;">
                            <el-button type="primary" @click="getTbData">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <!--用户的数据展示列表-->
                <template>
                    <el-table ref="tableHeight" :data="listData" border fit highlight-current-row v-loading="listLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" style="width: 100%;" :height="tableHeight">
                        <el-table-column prop="create_time" label="开启时间"></el-table-column>
                        <el-table-column prop="room_id" label="房间ID"></el-table-column>
                        <el-table-column prop="room_name" label="房间名称"></el-table-column>
                        <el-table-column prop="level" label="等级"></el-table-column>
                        <el-table-column prop="room_pic" label="展示图">
                            <template slot-scope="scope">
                                <el-popover trigger="hover" placement="left">
                                    <img :src="scope.row.room_pic" alt="" style="width: 300px; height: auto;">
                                    <div slot="reference" class="name-wrapper">
                                        <img :src="scope.row.room_pic" alt="" style="width: 100px; height: auto;">
                                    </div>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column prop="room_intro" label="房间公告"></el-table-column>
                        <el-table-column prop="room_type" :formatter="judgeRoom" label="房间类型"></el-table-column>
                        <el-table-column prop="owner_uid" label="族长UID"></el-table-column>
                        <el-table-column prop="nickname" label="创建者昵称"></el-table-column>
                        <!-- <el-table-column prop="owner_nickname" label="族长昵称"></el-table-column> -->
                        <el-table-column prop="room_background_pic" label="房间背景图">
                            <template slot-scope="scope">
                                <el-popover trigger="hover" placement="left">
                                    <img :src="scope.row.room_background_pic" alt="" style="width: 300px; height: auto;">
                                    <div slot="reference" class="name-wrapper">
                                        <img :src="scope.row.room_background_pic" alt="" style="width: 100px; height: 150px;">
                                    </div>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column prop="room_status" :formatter="judgeRoom" label="房间状态"></el-table-column>  -->
                        <!-- <el-table-column prop="use_time" label="单次时长"></el-table-column> -->
                        <el-table-column prop="pit_rate" label="入坑率"></el-table-column>

                        <!-- <el-table-column prop="total_use_time" label="累计时长"></el-table-column> -->
                        <!-- <el-table-column prop="this_money" label="单次流水（聊币）"></el-table-column> -->
                        <!-- <el-table-column prop="total_money" label="累计流水（聊币）"></el-table-column> -->
                        <!-- <el-table-column prop="this_man" label="消费人次"></el-table-column> -->
                        <!-- <el-table-column prop="total_man" label="累计消费人次"></el-table-column> -->
                        <!-- <el-table-column prop="total_num" label="用户进入数量"></el-table-column> -->
                        <!-- <el-table-column prop="all_total_num" label="用户累计数量"></el-table-column> -->

                        <el-table-column prop="last_open_time" label="最后直播时间"></el-table-column>
                        <el-table-column prop="total_honour" label="热力值"></el-table-column>
                        <el-table-column prop="num" label="直播次数"></el-table-column>
                        <el-table-column prop="total_time" label="直播时长"></el-table-column>
                        <el-table-column prop="total_cost_money" label="累积消费金额"></el-table-column>
                        <el-table-column prop="total_cost_num" label="累积消费次数"></el-table-column>
                        <el-table-column prop="total_cost_people" label="累积消费人数"></el-table-column>
                        <el-table-column prop="room_status" label="操作" width='130px;' fixed="right">
                            <template slot-scope="scope" style="width: 300px;">
                                <el-button size="mini" type="danger" @click="deleteBgImg(scope.$index, scope.row)">删除背景图</el-button>
                                <el-button size="mini" type="danger" @click="deleteRoomPic(scope.$index, scope.row)">删除展示图</el-button>
                                <div v-if="scope.row.room_status==0" style="display: inline-block;">
                                    <el-button size="mini" type="danger" style="margin-top: 2px;" @click="closeRoomModal(scope.$index, scope.row)">关闭房间</el-button>
                                </div>
                                <div v-else-if="scope.row.room_status==1" style="display: inline-block;">
                                    <el-button size="mini" type="primary" style="margin-top: 2px;" @click="openRoomModal(scope.$index, scope.row)">开启房间</el-button>
                                </div>
                                <div v-if="scope.row.room_status==2" style="display: inline-block;">
                                    <el-button size="mini" type="danger" style="margin-top: 2px;" @click="deblockRoomModal(scope.$index, scope.row)">解封房间</el-button>
                                </div>
                                <div v-else style="display: inline-block;">
                                    <el-button size="mini" type="primary" style="margin-top: 2px;" @click="benRoomModal(scope.$index, scope.row)">封禁房间</el-button>
                                </div>
                                <el-button size="mini" type="primary" style="margin-top: 2px;" @click="editRoom(scope.$index, scope.row)">编辑房间ID</el-button>
                                <el-button size="mini" type="primary" style="margin-top: 2px;" @click="changeName(scope.$index, scope.row)">改房名</el-button>
                                <el-button size="mini" type="primary" style="margin-top: 2px;" @click="changeIntro(scope.$index, scope.row)">改公告</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 工具条 -->
                    <el-col :span="24" class="toolbar">
                        <el-pagination layout="total,prev, pager, next,jumper" @current-change="handleCurrentChange" :page-size="20" :total=1000 :current-page="page+1" style="float:right; ">
                        </el-pagination>
                    </el-col>
                    <!-- 开启房间弹窗 -->
                    <el-dialog title="开启房间" :visible.sync="formInfo.dialogShow" center :before-close="handleClose">
                        <el-form :model="formInfo">
                            <div>
                                <span>你将要开启的房间--</span>{{roomName}}</div>
                            <el-form-item label="原因" width="120px">
                                <el-input v-model="formInfo.oppenReason" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="formInfo.dialogShow = false">取 消</el-button>
                            <el-button type="primary" @click="sureOpenRoom">确 定</el-button>
                        </span>
                    </el-dialog>
                    <!-- 关闭房间弹窗 -->
                    <el-dialog title="关闭房间" :visible.sync="closeFormInfo.dialogShow" center :before-close="handleClose">
                        <el-form :model="closeFormInfo">
                            <div>
                                <span>你将要关闭的房间--</span>{{roomName}}</div>
                            <el-radio v-model="radio" label="0">关闭</el-radio>
                            <el-radio v-model="radio" label="1">封禁</el-radio>
                            <el-form-item label="原因" width="120px">
                                <el-input v-model="closeFormInfo.oppenReason" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="closeFormInfo.dialogShow = false">取 消</el-button>
                            <el-button type="primary" @click="sureCloseRoom">确 定</el-button>
                        </span>
                    </el-dialog>
                    <!-- 编辑房间弹窗 -->
                    <el-dialog title="编辑房间" :visible.sync="editFormInfo.dialogShow" center>
                        <el-form :model="editFormInfo">
                            <div>
                                <span>你将要编辑的房间--</span>{{editFormInfo.editRoomName}}</div>
                            <el-form-item label="房间id" width="120px">
                                <el-input v-model="editFormInfo.editRoomId" style="width: 300px;" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="editFormInfo.dialogShow = false">取 消</el-button>
                            <el-button type="primary" @click="sureEditRoom">确 定</el-button>
                        </span>
                    </el-dialog>
                    <!-- 改房间名 -->
                    <el-dialog title="改房间名" :visible.sync="changeFormNameInfo.dialogShow" center>
                        <el-form :model="changeFormNameInfo">
                            <div>
                                <span>你将要改名的房间：</span>{{changeFormNameInfo.old_room_name}}</div>
                            <el-form-item label="房间名" width="120px">
                                <el-input v-model="changeFormNameInfo.room_name" style="width: 300px;" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="changeFormNameInfo.dialogShow = false">取 消</el-button>
                            <el-button type="primary" @click="sureChangeRoomName">确 定</el-button>
                        </span>
                    </el-dialog>
                    <!-- 改房间公告 -->
                    <!-- 该房间名 -->
                    <el-dialog title="改房间公告" :visible.sync="changeFormIntroInfo.dialogShow" center>
                        <el-form :model="changeFormIntroInfo">
                            <div>
                                <span>你将要改公告的房间：</span>{{changeFormIntroInfo.room_name}}</div>
                            <el-form-item label="房间公告" width="120px">
                                <el-input v-model="changeFormIntroInfo.room_intro" style="width: 300px;" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="changeFormIntroInfo.dialogShow = false">取 消</el-button>
                            <el-button type="primary" @click="sureChangeIntroName">确 定</el-button>
                        </span>
                    </el-dialog>
                    <!-- 封禁房间 -->
                    <el-dialog title="封禁房间" :visible.sync="deblockInfo.dialogShow" center>
                        <el-form :model="deblockInfo">
                            <span>封禁时长：</span>
                            <el-select style="width: 120px;margin: 0 0 10px 8px;" v-model="deblockInfo.day">
                                <el-option label="1天" value="1"></el-option>
                                <el-option label="5天" value="5"></el-option>
                                <el-option label="7天" value="7"></el-option>
                                <el-option label="15天" value="15"></el-option>
                                <el-option label="30天" value="30"></el-option>
                                <el-option label="永久封禁" value=""></el-option>
                            </el-select>
                            <el-form-item label="封禁原因：" width="120px">
                                <el-input v-model="deblockInfo.reason" style="width: 400px;" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="deblockInfo.dialogShow = false">取 消</el-button>
                            <el-button type="primary" @click="sureBen">确 定</el-button>
                        </span>
                    </el-dialog>
                    <!-- 解封房间 -->
                    <el-dialog title="解封房间" :visible.sync="noBlockInfo.dialogShow" center>
                        <el-form :model="noBlockInfo">
                            <el-form-item label="解封原因：" width="120px">
                                <el-input v-model="noBlockInfo.reason" style="width: 400px;" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="noBlockInfo.dialogShow = false">取 消</el-button>
                            <el-button type="primary" @click="sureDeblock">确 定</el-button>
                        </span>
                    </el-dialog>
                </template>
            </el-tab-pane>
            <el-tab-pane label="房间封禁记录" name="second">
                <!-- 房间封禁记录 -->
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true" style="overflow: hidden;">
                        <el-form-item>
                            <div class="block">
                                <span class="registerTime">日期</span>
                                <el-date-picker v-model="formOne.startDate" type="daterange" range-separator=" 至 " start-placeholder="开始日期" end-placeholder="结束日期">
                                </el-date-picker>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <span>房间UID</span>
                            <el-input style="width:100px;" placeholder="请输入内容" v-model="room_id1" clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <span>族长UID</span>
                            <el-input style="width:100px;" placeholder="请输入内容" v-model="owner_uid1" clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item style="float:right;margin-right: 100px;">
                            <el-button type="primary" @click="getTbData1">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <!--用户的数据展示列表-->
                <template>
                    <el-table ref="tableHeight" :data="listData1" border fit highlight-current-row v-loading="listLoading1" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" style="width: 100%;" :height="tableHeight">
                        <el-table-column prop="operate_time" label="操作时间"></el-table-column>
                        <el-table-column prop="room_id" label="房间ID"></el-table-column>
                        <el-table-column prop="room_name" label="房间名称"></el-table-column>
                        <el-table-column prop="family_name" label="所属家族"></el-table-column>
                        <el-table-column prop="owner_uid" label="族长UID"></el-table-column>
                        <el-table-column prop="nickname" label="族长昵称"></el-table-column>
                        <el-table-column prop="status" :formatter="judgeState" label="状态"></el-table-column>
                        <el-table-column prop="reason" label="原因"></el-table-column>
                        <el-table-column prop="operate_user" label="操作人"></el-table-column>
                    </el-table>
                    <!-- 工具条 -->
                    <el-col :span="24" class="toolbar">
                        <el-pagination layout="total,prev, pager, next,jumper" @current-change="handleCurrentChange1" :page-size="20" :total=1000 :current-page="page1+1" style="float:right; ">
                        </el-pagination>
                    </el-col>
                </template>
            </el-tab-pane>
        </el-tabs>
    </section>
</template>
<script>
import { allget } from "../../../api/api";
import store from "../../../vuex/store.js";
export default {
    data() {
        return {
            sex: "",
            listData: [],
            listData1: [],
            listLoading: false,
            listLoading1: false,
            tableHeight: null,
            activeName: "first",
            room_type: "",
            formOne: {
                startDate: [new Date() - 13 * 24 * 60 * 60 * 1000, new Date()], // 对应选择的日期,给默认时间180之前到现在
                startDate1: [new Date() - 13 * 24 * 60 * 60 * 1000, new Date()] // 对应选择的日期,给默认时间180之前到现在
            },
            room_id: null,
            owner_uid: null,
            room_id1: null,
            owner_uid1: null,
            totalpage: null,
            totalpage1: null,
            page: 0,
            page1: 0,
            tableHeight: null, // table展示的页面的高度多少，第二页中对应高度
            formInfo: {
                dialogShow: false,
                oppenReason: "" // 关闭原因
            },
            closeFormInfo: {
                dialogShow: false,
                oppenReason: "" // 关闭原因
            },
            editFormInfo: {
                dialogShow: false,
                editRoomId: "", // 编辑房间id
                editRoomName: "", // 编辑房间name
                yun_xin_room_id: "" // 编辑房间云信id
            },
            changeFormNameInfo: {
                dialogShow: false,
                old_room_name: "",
                room_name: "",
                yun_xin_room_id: "",
            },
            changeFormIntroInfo: {
                dialogShow: false,
                room_name: "",
                yun_xin_room_id: "",
                room_intro: "",
            },
            deblockInfo: {
                dialogShow: false,  
                yun_xin_room_id: "",
                day: "",
                reason: "",
            },
            noBlockInfo: {
                dialogShow: false,
                yun_xin_room_id: "",
                reason: "",
            },
            roomName: null, // 房间名
            yun_xin_room_id: null, //云信id
            type: null, // 关闭类型
            operate_user: null, // 操作者
            radio: "0"
        };
    },
    methods: {
        //页面的页数
        handleCurrentChange(val) {
            //服务器的第一页是0 所以 这里要 -1
            this.page = val - 1;
            this.getTbData();
        },
        //页面的页数
        handleCurrentChange1(val) {
            //服务器的第一页是0 所以 这里要 -1
            this.page1 = val - 1;
            this.getTbData1();
        },
        getTbData() {
            var _this = this;
            _this.listLoading = true;
            let url = "/NewFamily/getLiveBroadCastInfo";
            let param = {
                date_s: baseConfig.changeDateTime(
                    this.formOne.startDate1[0],
                    0
                ),
                date_e: baseConfig.changeDateTime(
                    this.formOne.startDate1[1],
                    0
                ),
                room_id: this.room_id,
                owner_uid: this.owner_uid,
                page: this.page,
                room_type: this.room_type,
            };
            param.room_type == "" ? delete(param.room_type) : param.room_type = param.room_type;
            console.log(param)
            allget(param, url)
                .then(res => {
                    _this.listLoading = false;
                    if (res.data.ret) {
                        this.listData = res.data.data;
                    } else {
                        baseConfig.errorTipMsg(this, res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        getTbData1() {
            var _this = this;
            _this.listLoading1 = true;
            let url = "/NewFamily/getLiveBroadCastKickRecord";
            let param = {
                date_s: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
                date_e: baseConfig.changeDateTime(this.formOne.startDate[1], 0),
                room_id: this.room_id1,
                owner_uid: this.owner_uid1,
                page: this.page1
            };
            this.uid1 == null || this.uid1 == ""
                ? delete param.uid1
                : (param.uid1 = this.uid1);
            allget(param, url)
                .then(res => {
                    _this.listLoading1 = false;
                    if (res.data.ret) {
                        this.listData1 = res.data.data;
                    } else {
                        baseConfig.errorTipMsg(this, res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        
        // 判断状态
        judgeState(row) {
            if (row.status == 0) {
                return "关闭";
            } else if (row.status == 1) {
                return "封禁";
            } else if (row.status == 2) {
                return "打开";
            }
        },
        judgeRoom(row) {
            if(row.room_type == 0){
                return "家族房间";
            }else if(row.room_type == 1){
                return "个人房间";
            }
        },
        // 删除展示图片
        deleteRoomPic(index, row) {
            var _this = this;
            let url = "/NewFamily/delRoomLiveBroadCastRoomPic";
            let param = {
                yun_xin_room_id: row.yun_xin_room_id
            };
            allget(param, url).then(res => {
                if (res.data.ret) {
                    baseConfig.successTipMsg(this, res.data.msg);
                    _this.getTbData();
                } else {
                    baseConfig.errorTipMsg(this, res.data.msg);
                }
            }).catch(err => {
                console.log(err);
            });
        },
        // 删除背景图
        deleteBgImg(index, row) {
            var _this = this;
            let url = "/NewFamily/delRoomLiveBroadCastBackGround";
            let param = {
                yun_xin_room_id: row.yun_xin_room_id
            };
            allget(param, url).then(res => {
                if (res.data.ret) {
                    baseConfig.successTipMsg(this, res.data.msg);
                    _this.getTbData();
                } else {
                    baseConfig.errorTipMsg(this, res.data.msg);
                }
            }).catch(err => {
                console.log(err);
            });
        },
        // before-close
        handleClose(done) {
            this.$confirm("确认关闭？")
                .then(_ => {
                    done();
                })
                .catch(_ => {});
        },
        // 开启房间
        openRoomModal(index, row) {
            this.formInfo.dialogShow = true;
            this.roomName = row.room_name;
            this.yun_xin_room_id = row.yun_xin_room_id;
        },
        // 确认开启房间
        sureOpenRoom() {
            var _this = this;
            let url = "/NewFamily/closeOrOpenLiveBroadCastRoomId";
            let param = {
                yun_xin_room_id: this.yun_xin_room_id,
                type: 2, // 打开房间
                reason: this.formInfo.oppenReason,
                operate_user: this.operate_user
            };
            allget(param, url).then(res => {
                if (res.data.ret) {
                    baseConfig.successTipMsg(this, res.data.msg);
                    _this.formInfo.dialogShow = false;
                    _this.getTbData();
                } else {
                    baseConfig.errorTipMsg(this, res.data.msg);
                }
            }).catch(err => {
                console.log(err);
            });
        },
        // 关闭房间
        closeRoomModal(index, row) {
            this.closeFormInfo.dialogShow = true;
            this.roomName = row.room_name;
            this.yun_xin_room_id = row.yun_xin_room_id;
        },
        // 确定关闭或者封禁房间
        sureCloseRoom() {
            var _this = this;
            let url = "/NewFamily/closeOrOpenLiveBroadCastRoomId";
            let param = {
                yun_xin_room_id: this.yun_xin_room_id,
                type: this.radio, // 关闭或者封禁房间
                reason: this.closeFormInfo.oppenReason,
                operate_user: this.operate_user
            };
            allget(param, url).then(res => {
                if (res.data.ret) {
                    baseConfig.successTipMsg(this, res.data.msg);
                    _this.closeFormInfo.dialogShow = false;
                    _this.getTbData();
                } else {
                    baseConfig.errorTipMsg(this, res.data.msg);
                }
            }).catch(err => {
                console.log(err);
            });
        },
        // 封禁房间
        benRoomModal(index, row){
            this.deblockInfo.dialogShow = true;
            this.deblockInfo.yun_xin_room_id = row.yun_xin_room_id;
        },
        sureBen(){
            var _this = this;
            var url = 'NewFamily/closeOrOpenLiveBroadCastRoomId';
            var param = {
                yun_xin_room_id: this.deblockInfo.yun_xin_room_id,
                type: 1,
                day: this.deblockInfo.day,
                reason: this.deblockInfo.reason,
                operate_user: this.operate_user,     
            }
            allget(param, url).then(res => {
                if (res.data.ret) {
                    baseConfig.successTipMsg(this, res.data.msg);
                    _this.deblockInfo.dialogShow = false;
                    _this.getTbData();
                    _this.deblockInfo.day = "";
                    _this.deblockInfo.reason = "";
                } else {
                    baseConfig.errorTipMsg(this, res.data.msg);
                }
            }).catch(err => {
                console.log(err);
            });
        },
        // 解封房间
        deblockRoomModal(index, row){
            this.noBlockInfo.dialogShow = true;
            this.noBlockInfo.yun_xin_room_id = row.yun_xin_room_id;
        },
        sureDeblock(){
            var _this = this;
            var url = 'NewFamily/closeOrOpenLiveBroadCastRoomId';
            var param = {
                yun_xin_room_id: this.noBlockInfo.yun_xin_room_id,
                type: 2,
                reason: this.noBlockInfo.reason,
                operate_user: this.operate_user,     
            }
            allget(param, url).then(res => {
                if (res.data.ret) {
                    baseConfig.successTipMsg(this, res.data.msg);
                    _this.noBlockInfo.dialogShow = false;
                    _this.getTbData();
                    _this.noBlockInfo.reason = "";
                } else {
                    baseConfig.errorTipMsg(this, res.data.msg);
                }
            }).catch(err => {
                console.log(err);
            });
        },
        // 编辑房间
        editRoom(index, row) {
            this.editFormInfo.dialogShow = true;
            this.editFormInfo.editRoomName = row.room_name;
            this.editFormInfo.editRoomId = row.room_id;
            this.editFormInfo.yun_xin_room_id = row.yun_xin_room_id;
        },
        // 确认编辑房间
        sureEditRoom() {
            var _this = this;
            let url = "/NewFamily/editLiveBroadCastRoomId";
            let param = {
                yun_xin_room_id: _this.editFormInfo.yun_xin_room_id,
                room_id: this.editFormInfo.editRoomId
            };
            allget(param, url).then(res => {
                if (res.data.ret) {
                    baseConfig.successTipMsg(this, res.data.msg);
                    _this.editFormInfo.dialogShow = false;
                    _this.getTbData();
                } else {
                    baseConfig.errorTipMsg(this, res.data.msg);
                }
            }).catch(err => {
                console.log(err)
            });
        },
        // 更改房间名
        changeName(index, row) {
            this.changeFormNameInfo.dialogShow = true;
            this.changeFormNameInfo.old_room_name = row.room_name;
            this.changeFormNameInfo.room_name = row.room_name;
            this.changeFormNameInfo.yun_xin_room_id = row.yun_xin_room_id;
        },
        // 确定更改房间名
        sureChangeRoomName() {
            var _this = this;
            var url = '/NewFamily/editOtherLiveBroadCastData';
            var param = {
                yun_xin_room_id: this.changeFormNameInfo.yun_xin_room_id,
                room_name: this.changeFormNameInfo.room_name
            }
            allget(param, url).then(res => {
                if(res.data.ret){
                    baseConfig.successTipMsg(_this, res.data.msg);
                    _this.changeFormNameInfo.dialogShow = false;
                    _this.getTbData();
                }else{
                    baseConfig.errorTipMsg(_this, res.data.msg);
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 更改房间公告
        changeIntro(index, row) {
            this.changeFormIntroInfo.dialogShow = true;
            this.changeFormIntroInfo.room_name = row.room_name;
            this.changeFormIntroInfo.yun_xin_room_id = row.yun_xin_room_id;
            this.changeFormIntroInfo.room_intro = row.room_intro;
        },
        // 确定更改房间公告
        sureChangeIntroName() {
            var _this = this;
            var url = '/NewFamily/editOtherLiveBroadCastData';
            var param = {
                yun_xin_room_id: this.changeFormIntroInfo.yun_xin_room_id,
                room_intro: this.changeFormIntroInfo.room_intro
            }
            if(param.room_intro == '' || param.room_intro == null) {
                baseConfig.warningTipMsg(_this, "请输入房间公告！");
                return;
            }
            allget(param, url).then(res => {
                if(res.data.ret){
                    baseConfig.successTipMsg(_this, res.data.msg);
                    _this.changeFormIntroInfo.dialogShow = false;
                    _this.getTbData();
                }else{
                    baseConfig.errorTipMsg(_this, res.data.msg);
                }
            }).catch(err => {
                console.log(err);
            })
        }
    },
    mounted() {
        this.tableHeight = tabSearchPageHeight;
        this.getTbData();
        this.getTbData1();
        this.operate_user = store.state.user.name; // 操作用户的昵称
    }
};
</script>
<style lang="css" scoped>

</style>


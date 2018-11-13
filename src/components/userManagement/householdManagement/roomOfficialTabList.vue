<template>
    <!-- 官方标签列表 -->
    <!-- dom结构内容 -->
    <section>
        <!-- 工具条/头部的搜索条件搜索 -->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" style="overflow: hidden;">
                <el-form-item>
                    <span>房间ID</span>
                    <el-input style="width:120px;" clearable placeholder="房间ID" v-model="room_id">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <span>房间ID</span>
                    <el-input style="width:120px;" clearable placeholder="房间名称" v-model="room_name">
                    </el-input>
                </el-form-item>
                <el-form-item style="margin-left: 100px;">
                    <el-button type="primary" @click="getTableData(0)">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--用户的数据展示列表-->
        <template>
            <el-table ref="tableHeight" :data="tabData" border fit highlight-current-row v-loading="listLoading" style="width: 100%;height: 100%;" :height="tableHeight">
                <el-table-column prop="room_id" label="房间ID"></el-table-column>
                <el-table-column prop="room_name" label="房间名称"></el-table-column>
                <el-table-column prop="room_type" label="房间类型">
                    <template slot-scope="scope">
                        <p v-if="scope.row.room_type == 0">家族</p>
                        <p v-else-if="scope.row.room_type == 1">个人</p>
                    </template>
                </el-table-column>
                <el-table-column label="官方标签列表">
                    <template slot-scope="scope">
                        <el-tag :key="tag" v-for="(tag, index) in scope.row.labels_json" closable :disable-transitions="false" @close="handleClose(tag,index,scope.row.yun_xin_room_id)">
                            {{tag}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="140" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="addRoomOfficialTab(scope.$index, scope)" size="small">新增标签</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-pagination layout="total,prev, pager, next,jumper" @current-change="handleCurrentChange" :page-size="20" :total=1000 :current-page="page+1" style="float:right; ">
                </el-pagination>
            </el-col>
            <el-dialog title="新增标签" :visible.sync="formTwo.dialogFormVisible">
                <el-form :model="formTwo">
                    <el-form-item label="房间id"  :label-width="formLabelWidth">
                        <el-input disabled v-model="formTwo.room_id" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="官方标签内容" :label-width="formLabelWidth">
                        <el-input v-model="formTwo.content" placeholder="请输入标签内容" auto-complete="off"></el-input>
                    </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="sureAdd(0)">取 消</el-button>
                    <el-button type="primary" @click="sureAdd(1)">确 定</el-button>
                </div>
            </el-dialog>
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
            tableHeight: null,
            formTwo: {
                dialogFormVisible: false,
                room_id: "",
                content: ""
            },
            listLoading: false,
            tabData: null,
            totalpage: 1000,
            page: 0,
            star: "0",
            end: "20",
            formLabelWidth: "120px",
            propList: {},
            dynamicTags: ["标签一", "标签二", "标签三"],
            inputVisible: true,
            inputValue: "",
            room_id: "",
            room_name: "",
        };
    },
    methods: {
        // 删除标签
        handleClose(tag,index,yun_xin_room_id) {
            var _this = this;
            console.log(tag,index,yun_xin_room_id)
            var url = "/NewFamily/deleteRoomOfficialTab";
            var param ={
                yun_xin_room_id: yun_xin_room_id,
                num: index,
            }
            allget(param, url).then(res => {
                if(res.data.ret){
                    console.log(res.data);
                    _this.getTableData();
                }else{
                    baseConfig.successTipMsg(_this, res.data.msg);
                }
            }).catch(err=>{
                console.log(err);
            })
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        },
        // 新增标签
        addRoomOfficialTab(index, scope){
            this.formTwo.room_id = scope.row.room_id;
            this.formTwo.dialogFormVisible = true;

        },
        sureAdd(type){
            var _this = this;
            if(type==0){
                _this.formTwo.dialogFormVisible = false;
                _this.formTwo.content = "";
            }else if(type == 1){
                var url = "/NewFamily/addRoomOfficialTab";
                var param = {
                    room_id: _this.formTwo.room_id,
                    content: _this.formTwo.content,
                }
                allget(param, url).then(res=>{
                    if(res.data.ret){
                        _this.getTableData();
                        _this.formTwo.dialogFormVisible = false;
                        _this.formTwo.content = "";
                    }else{
                        baseConfig.successTipMsg(_this, res.data.msg);
                    }
                }).catch(err=>{
                    console.log(err);
                })
            }
        },
        handleCurrentChange(val) {
            this.page = val - 1;
            this.getTableData();
        },
        getTableData(type) {
            if(type == 0){
                this.page = 0;
            }
            var _this = this;
            _this.listLoading = true;
            var param = {
                page: this.page,
                room_id: this.room_id,
                room_name: this.room_name
            };
            var url = "/NewFamily/getRoomOfficialTabList";
            allget(param, url)
                .then(res => {
                    _this.listLoading = false;
                    if (res.data.ret) {
                        _this.tabData = res.data.data;
                        for(var i=0; i<_this.tabData.length;i++){
                            _this.tabData[i].labels_json = JSON.parse(_this.tabData[i].labels_json);
                            _this.tabData[i].inputVisible = false;
                            _this.tabData[i].inputValue = "";
                            // console.log(_this.tabData)
                        }
                    } else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    },
    mounted() {
        var _this = this;
        this.$nextTick(function() {
            _this.tableHeight = baseConfig.lineNumber(searchPageHeight);
            _this.getTableData();
        });
    }
};
</script>

<style lang="css" scoped>
.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>

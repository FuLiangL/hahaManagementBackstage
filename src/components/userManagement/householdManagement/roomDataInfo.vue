<template>
    <!-- 房间详细数据 -->
    <!-- dom结构内容 -->
    <section>
        <!-- 工具条/头部的搜索条件搜索 -->
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
                    <span>展示类型</span>
                    <el-select style="width: 130px;" v-model="type" @change="getData(0)">
                        <el-option label="按单次" value="0"></el-option>
                        <el-option label="按日期分日展示" value="1"></el-option>
                        <el-option label="按日期合计展示" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <span>房间ID</span>
                    <el-input style="width:90px;" clearable placeholder="房间id" v-model="room_id">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <span>族长UID</span>
                    <el-input style="width:90px;" clearable placeholder="族长UID" v-model="owner_uid">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <span>房间名称</span>
                    <el-input style="width:90px;" clearable placeholder="房间名称" v-model="room_name">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <span>房间类型</span>
                    <el-select style="width: 90px;" v-model="room_type">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="家族房间" value="0"></el-option>
                        <el-option label="个人房间" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="search-span" style="float:right;">
                    <el-button id="searchBtn" type="primary" @click="getData(0)">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!-- 用户的数据展示列表 -->
        <template>
            <!-- 按单次显示 -->
            <el-table :data="listData" v-if="type==0" v-loading="listLoading" key="times" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" border fit highlight-current-row style="width: 100%;" :height="tableHeight">
                <el-table-column prop="date" label="时间"></el-table-column>
                <el-table-column prop="room_id" label="房间ID"></el-table-column>
                <el-table-column prop="room_name" label="房间名称"></el-table-column>
                <el-table-column prop="label_name" label="功能标签"></el-table-column>
                <el-table-column prop="family_id" label="所属家族"></el-table-column>
                <el-table-column prop="owner_uid" label="族长UID"></el-table-column>
                <el-table-column prop="room_status" :formatter="judgeStatus" label="当前房间状态"></el-table-column>
                <el-table-column prop="end_time" label="关闭时间"></el-table-column>
                <el-table-column prop="total_honour" label="热力值"></el-table-column>
                <el-table-column prop="use_time" label="单次直播时长">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <p>{{timeChange(scope.row.use_time)}}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="cost_num" label="消费人次"></el-table-column>
                <el-table-column prop="cost_people" label="消费人数"></el-table-column>
            </el-table>
            <!-- 按日期分日显示  按日期合计显示 -->
            <el-table :data="listData" v-else-if="type==1 || type==2" key="days" v-loading="listLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" border fit highlight-current-row style="width: 100%;" :height="tableHeight">
                <el-table-column prop="date" label="时间"></el-table-column>
                <el-table-column prop="room_id" label="房间ID"></el-table-column>
                <el-table-column prop="room_name" label="房间名称"></el-table-column>
                <el-table-column prop="family_id" label="所属家族"></el-table-column>
                <el-table-column prop="owner_uid" label="族长UID"></el-table-column>
                <el-table-column prop="total_honour" label="热力值"></el-table-column>
                <el-table-column prop="use_time" label="直播时长">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <p>{{timeChange(scope.row.use_time)}}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="total_honour" label="消费(聊币)"></el-table-column>
                <el-table-column prop="cost_num" label="消费人次"></el-table-column>
                <el-table-column prop="cost_people" label="消费人数"></el-table-column>
                <el-table-column label="补贴">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <el-button type="primary" size="mini" @click="checkSubsidy(scope.row.room_name,scope.row.yun_xin_room_id)">补贴</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 补贴 -->
            <el-dialog title="补贴" :visible.sync="dialogShow" center>
                <el-form :model="subsidy_info">
                    <div>
                        <span>  </span>{{subsidy_info.name}} 房间的补贴为：{{subsidy_info.num}}</div>
                </el-form>
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
import { allget } from "../../../api/api";
export default {
    data() {
        return {
            tableHeight: null, // table展示的页面的高度多少，第二页中对应高度
            formOne: {
                startDate: [new Date() - 2 * 24 * 60 * 60 * 1000, new Date()]
            },
            listData: [],
            formLabelWidth: "120px",
            listLoading: false,
            page: 0,
            totalpage: 1000,
            type: "0",
            room_id: "",
            room_name: "",
            owner_uid: "",
            room_type: "",
            dialogShow: false,
            subsidy_info: {
                name: "",
                num: "",
            }
        };
    },
    methods: {
        timeChange(val) {
            return baseConfig.changeTime(val);
        },
        //页面的页数
        handleCurrentChange(val) {
            //服务器的第一页是0 所以 这里要 -1
            this.page = val - 1;
            this.getData();
        },
        // 获取数据
        getData(type) {
            var _this = this;
            _this.listLoading = true;
            if (type == 0) {
                _this.page = 0;
            }
            let url = "/NewFamily/getRoomDataInfo";
            let param = {
                date_s: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
                date_e: baseConfig.changeDateTime(this.formOne.startDate[1], 0),
                room_name: this.room_name,
                room_id: this.room_id,
                owner_uid: this.owner_uid,
                type: this.type,
                page: this.page,
                room_type: this.room_type,
            };
            if(param.family_id=="" || param.family_id==null){
                delete param.family_id;
            }
            if(param.family_name=="" || param.family_name==null){
                delete param.family_name;
            }
            if(param.owner_uid=="" || param.owner_uid==null){
                delete param.owner_uid;
            }
            allget(param, url)
                .then(res => {
                    _this.listLoading = false;
                    if (res.data.ret) {
                        _this.listData = res.data.data;
                    } else {
                        baseConfig.successTipMsg(_this, res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        judgeStatus(row) {
            if(row.room_status == 0){
                return "开启";
            }else if(row.room_status == 1){
                return "未开启";
            }else if(row.room_status == 2){
                return "封禁";
            }
        },
        // 查看补贴
        checkSubsidy(name,yunid){
            var _this = this;
            this.subsidy_info.name = name; 
            this.dialogShow = true;
            var url = '/NewFamily/getRoomSubsidyData';
            var param = {
                date_s: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
                date_e: baseConfig.changeDateTime(this.formOne.startDate[1], 0),
                yun_xin_room_id: yunid,
            }
            allget(param, url).then(res => {
                if(res.data.ret){
                    this.subsidy_info.num = res.data.num; 
                    this.subsidy_info.num = this.subsidy_info.num == null ? 0 : this.subsidy_info.num;
                }else{
                    baseConfig.successTipMsg(_this, res.data.msg);
                }
            }).catch(err => {
                console.log(err)
            })
        }
    },
    mounted() {
        var _this = this;
        _this.tableHeight = baseConfig.lineNumber(searchPageHeight);
        _this.getData();
    }
};
</script>

<style lang="css" scoped>
.search-span {
    float: right;
}
#searchBtn {
    margin-right: 50px;
}
</style>

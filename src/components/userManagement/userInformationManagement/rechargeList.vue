<template>
    <!-- 充值排行榜 -->
    <!-- dom结构内容 -->
    <section>
        <!-- 工具条/头部的搜索条件搜索 -->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" style="overflow: hidden;">
                <el-form-item>
                    <span>渠道</span>
                    <el-select v-model="channelId" multiple filterable collapse-tags style="margin-left: 20px;" placeholder="请选择">
                        <el-option v-for="(item, key) of channelData" :key="item" :label="item" :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <span>性别</span>
                    <el-select v-model="sex">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="男" value="1"></el-option>
                        <el-option label="女" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <span>UID</span>
                    <el-input style="width:150px;" clearable placeholder="请输入uid" v-model="uid">
                    </el-input>
                </el-form-item>
                <el-form-item class="search-span" style="float:right;">
                    <el-button id="searchBtn" type="primary" @click="getData(0)">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!-- 用户的数据展示列表 -->
        <template>
            <el-table :data="listData" v-loading="listLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" border fit highlight-current-row style="width: 100%;" :height="tableHeight">
                <el-table-column type="index" :index="indexMethod" label="排名"></el-table-column>
                <el-table-column prop="channel" label="渠道"></el-table-column>
                <el-table-column prop="uid" label="UID"></el-table-column>
                <el-table-column prop="nickname" label="昵称"></el-table-column>
                <el-table-column prop="sex" :formatter="judgeSex" label="性别"></el-table-column>
                <el-table-column prop="pay_times" label="充值次数"></el-table-column>
                <el-table-column prop="pay_num" label="累计充值金额（元）">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <p>{{scope.row.pay_num/100}}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="addtime" label="注册时间"></el-table-column>
                <el-table-column prop="lasttime" label="最后一次登录时间"></el-table-column>
                <el-table-column prop="last_recharge_time" label="最后一次充值时间"></el-table-column>
            </el-table>
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
import store from '../../../vuex/store';
export default {
    data() {
        return {
            tableHeight: null, // table展示的页面的高度多少，第二页中对应高度
            channelData: {},
            channelId: null,
            sex:"",
            listData: [],
            formLabelWidth: "120px",
            listLoading: false,
            page: 0,
            totalpage: 1000,
            uid: "",
        };
    },
    methods: {
        judgeSex(row){
            if(row.sex==1){
                return "男";
            }else if(row.sex==2){
                return "女";
            }
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
            let url = "/NewMoney/getRechargeList";
            let param = {
                uid: this.uid,
                sex: this.sex,
                page: this.page,
                channel: this.channelId.join(',')
            };
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
        indexMethod(index) {
            return index + this.page * 20 + 1;
        }
    },
    mounted() {
        var _this = this;
        _this.tableHeight = baseConfig.lineNumber(searchPageHeight);
        _this.getData();
        var id = store.state.user.channelid.split(",");
        var name = store.state.user.channelname.split(","); 
        for(var i = 0; i<id.length; i++){
            this.channelData[id[i]] = name[i];
        }
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

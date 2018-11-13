<template>
    <!-- 家族荣耀榜单 -->
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
                    <span>家族ID</span>
                    <el-input style="width:130px;" clearable placeholder="请输入家族id" v-model="family_id">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <span>家族名称</span>
                    <el-input style="width:130px;" clearable placeholder="请输入家族名称" v-model="family_name">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <span>族长UID</span>
                    <el-input style="width:130px;" clearable placeholder="请输入族长UID" v-model="owner_uid">
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
                <el-table-column prop="family_id" label="家族ID"></el-table-column>
                <el-table-column prop="family_name" label="家族名称"></el-table-column>
                <el-table-column prop="owner_uid" label="族长UID"></el-table-column>
                <el-table-column prop="nickname" label="族长昵称"></el-table-column>
                <el-table-column prop="level" label="家族等级"></el-table-column>
                <el-table-column prop="total_honour" label="荣耀值"></el-table-column>
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
export default {
    data() {
        return {
            tableHeight: null, // table展示的页面的高度多少，第二页中对应高度
            formOne: {
                startDate: [new Date() - 7 * 24 * 60 * 60 * 1000, new Date()]
            },
            listData: [],
            formLabelWidth: "120px",
            listLoading: false,
            page: 0,
            totalpage: 1000,
            uid: "",
            family_id: "",
            family_name: "",
            owner_uid: ""
        };
    },
    methods: {
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
            let url = "/NewFamily/getFamilyHonourList";
            let param = {
                date_s: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
                date_e: baseConfig.changeDateTime(this.formOne.startDate[1], 0),
                family_name: this.family_name,
                family_id: this.family_id,
                owner_uid: this.owner_uid,
                page: this.page
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

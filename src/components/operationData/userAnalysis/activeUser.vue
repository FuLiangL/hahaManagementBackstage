<template>
    <!-- 活跃用户 -->
    <section>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" style="overflow: hidden;">
                <el-form-item>
                    <div class="block">
                        <span class="registerTime">日期</span>
                        <el-date-picker 
                        v-model="formOne.params.startDate" 
                        type="daterange" 
                        range-separator=" 至 " 
                        start-placeholder="开始日期" 
                        end-placeholder="结束日期"></el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item style="margin-left: 100px;">
                    <span>渠道</span>
                    <el-select 
                    v-model="formOne.params.channelId" 
                    multiple 
                    collapse-tags 
                    style="margin-left:20px;" 
                    placeholder="请选择">
                        <el-option 
                        v-for="(item, key) of formOne.params.channelData" 
                        :key="item" 
                        :label="item" 
                        :value="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="search-span" style="float:right;">
                    <el-button 
                    id="searchBtn" 
                    type="primary" 
                    @click="getData()">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <template>
            <el-table 
            :data="onePageTabData" 
            border fit highlight-current-row 
            style="width:100%;" 
            :height="searchPageHeight">
                <el-table-column prop="date" label="日期"></el-table-column>
                <el-table-column prop="active" label="日活跃"></el-table-column>
                <el-table-column prop="old_active" label="老用户"></el-table-column>
                <el-table-column prop="active_rate" label="DAU/MAU"></el-table-column>
            </el-table>
            <el-col :span="24" class="toolbar">
				<el-pagination 
                background
                layout="total,prev,pager,next,jumper" 
                @current-change="handleCurrentChange" 
                :page-size="20" 
                :total="formOne.totalpage" 
                style="float:right;"></el-pagination>
			</el-col>
        </template>
    </section>
</template>

<script>
import store from "../../../vuex/store";
import axios from 'axios';
export default {
    data() {
        return {
            searchPageHeight: null,
            formOne: {
                params: {
                    startDate: [new Date()-20*24*60*60*1000, new Date()],
                    channelData: {},
                    channelId: null,
                },
                tabData: [],
                totalpage: null,
                page: 1,
                star: '0',
                end: '20',
            },
        };
    },
    computed:{
        /*
            1、onePageTabData：计算的属性
        */ 
		onePageTabData() {
			var _this = this;
			return _this.formOne.tabData.slice(_this.formOne.star, _this.formOne.end);
		},
	},
    methods: {
        /*
            1、handleCurrentChange：每一次进行翻页时候触发的方法
            2、getData：获取到全部的数据
        */ 
        handleCurrentChange(val) {
			var _this = this;
			_this.formOne.page = val;
			_this.formOne.star = (_this.formOne.page-1)*20;
			_this.formOne.end = _this.formOne.star+20;
		},
        getData() {
            var _this = this;
            let url = baseConfig.server+baseConfig.requestUrl+"/Base/getActiveUserNew";
            let params = {
                date_s: baseConfig.changeDateTime(this.formOne.params.startDate[0], 0),
                date_e: baseConfig.changeDateTime(this.formOne.params.startDate[1], 0),
                channel: _this.formOne.params.channelId.join(','),
            };
            axios.get(url, { params: params })
            .then((res) => {
                if(res.data.ret) {
                    var arr = [];
                    res.data.data.data.forEach((item, index) => {
                        arr.unshift(item);
                    });
                    _this.formOne.tabData = arr;
                    _this.formOne.totalpage = arr.length;
                } else {
                    baseConfig.errorTipMsg(_this, res.data.msg);
                }
            })
            .catch((err) => {
                console.log(err);
            })
        },
    },
    mounted() {
        var _this = this;
        _this.searchPageHeight = searchPageHeight;
        _this.getData();
        var id = store.state.user.channelid.split(",");
        var name = store.state.user.channelname.split(","); 
        for(var i=0; i<id.length; i++){
            _this.formOne.params.channelData[id[i]] = name[i];
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

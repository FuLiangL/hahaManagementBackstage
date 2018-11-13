<template>
	<!-- 道具列表 -->
	<section>
        <el-tabs 
        v-model="tabActiveName" 
        type="border-card" 
        @tab-click="handleClick">
			<el-tab-pane 
            label="商城明细" 
            name="one" 
            :style="{height:tabHeight+'px'}">
                <template>
                    <el-table 
                    ref="tableHeight" 
                    :data="onePageTabData" 
                    border fit highlight-current-row 
                    v-loading="listLoading" 
                    style="width:100%;" :height="tabPageHeight">
                        <el-table-column prop="product_name" label="商城名称" ></el-table-column>
                        <el-table-column prop="num" label="购买数量" ></el-table-column>
                        <el-table-column prop="price" label="价格" ></el-table-column>
                        <el-table-column prop="total" label="总价格" ></el-table-column>
                    </el-table>
                    <el-col :span="24" class="toolbar">
                        <el-pagination 
                        layout="total,prev,pager,next,jumper" 
                        @current-change="oneHandleCurrentChange" 
                        :page-size="20" 
                        :total="formOne.totalpage" 
                        style="float:right;"></el-pagination>
                    </el-col>
                </template>
			</el-tab-pane>
            <el-tab-pane 
            label="销售统计" 
            name="two" 
            :style="{height:tabHeight+'px'}">
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" style="overflow: hidden;" :model="formTwo">
                        <el-form-item>
                            <div class="block">
                                <span class="registerTime">日 期</span>
                                <el-date-picker 
                                style="width:300px;" 
                                v-model="formTwo.startDate" 
                                type="daterange" 
                                range-separator=" 至 " 
                                start-placeholder="开始日期" 
                                end-placeholder="结束日期">
                                </el-date-picker>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <span>渠道</span>
                            <el-select 
                            v-model="formTwo.channelId" 
                            multiple 
                            filterable 
                            collapse-tags 
                            style="margin-left:20px;width:180px;" 
                            placeholder="请选择">
                                <el-option 
                                v-for="(item, key) of formTwo.channelData" 
                                :key="item" 
                                :label="item" 
                                :value="key"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <span>显示类型</span>
                            <el-select v-model="formTwo.show_type">
                                <el-option label="按日" value="0"></el-option>
                                <el-option label="按月" value="1"></el-option>
                            </el-select>
                        </el-form-item>
						<el-form-item>
							<el-button 
                            type="primary" 
                            @click="getTwoData">查 询</el-button>
						</el-form-item>
					</el-form>
				</el-col>
                <template>
                    <el-table 
                    ref="tabSearchPageHeight" 
                    :data="twoPageTabData" 
                    border fit highlight-current-row 
                    v-loading="listLoading" 
                    style="width:100%;" :height="tabSearchPageHeight">
                        <el-table-column prop="date" label="日期" ></el-table-column>
                        <el-table-column prop="num" label="购买数量" ></el-table-column>
                        <el-table-column prop="price" label="价格(豆币)" ></el-table-column>
                        <el-table-column prop="total" label="总价格" ></el-table-column>
                        <el-table-column label="操作" width="140">
                            <template slot-scope="scope">
                                <el-button 
                                type="primary" 
                                @click="goOneHtml(twoPageTabData[scope.$index])" 
                                size="small">明细</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-col :span="24" class="toolbar">
                        <el-pagination 
                        layout="total,prev,pager,next,jumper" 
                        @current-change="twoHandleCurrentChange" 
                        :page-size="20" 
                        :total="formTwo.totalpage" 
                        style="float:right;"></el-pagination>
                    </el-col>
                </template>
			</el-tab-pane>
		</el-tabs>
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
            tabHeight: '',
            tabPageHeight: null,
            tabSearchPageHeight: null,
			formOne: {
                tabData: [], 
                totalpage: null, 
                page: 1, 
                star: '0',
                end: '20',
                date: '',
                show_type: '',
                channel: '',
            },
            formTwo: {
                tabData: [],
                totalpage: null, 
                page: 1,
                star: '0',
                end: '20', 
                startDate: [new Date()-7*24*60*60*1000,new Date()],
                channelId: null,
                channelData: {},
                show_type: '0',
            },
			listLoading: false,
			formLabelWidth: '120px',
            tabActiveName: 'two',
		};
	},
	computed:{
		onePageTabData() {
			var _this = this;
			return _this.formOne.tabData.slice(_this.formOne.star, _this.formOne.end);
        },
        twoPageTabData() {
			var _this = this;
			return _this.formTwo.tabData.slice(_this.formTwo.star, _this.formTwo.end);
        },
	},
	methods: {
        /*
            道具-第一屏的页面
            1、getTableData：获取数据列表
            2、oneHandleCurrentChange：配合onePageTabData展示需要展示当前页面的数据
        */ 
		getTableData() {
			var _this = this ;
            var url = baseConfig.server+baseConfig.requestUrl+'/NewProp/getProductGoldInfo';
            var params = {
                date: _this.formOne.date,
                show_type: _this.formOne.show_type,
                channel: _this.formOne.channel,
            };
            axios.get(url, { params: params })
            .then((res) => {
                if(res.data.ret) {
                    _this.formOne.tabData = res.data.data;
                    _this.formOne.totalpage = res.data.data.length;
                }
                else {
                    baseConfig.errorTipMsg(_this, res.data.msg);
                }
            })
            .catch((err) => {
                console.log(err);
            })
		},
        oneHandleCurrentChange(val) {
			var _this = this;
            _this.formOne.page = val;
            // val与page有一个-1的关系
			_this.formOne.star = (_this.formOne.page-1)*20;
			_this.formOne.end = _this.formOne.star+20;
        },
        /*
            装扮-第二屏的页面
            1、getTwoData: 获取装扮的全部的内容
            2、twoHandleCurrentChange：配合进行翻页时候使用
            3、goOneHtml：进入第一屏的页面
        */ 
        getTwoData() {
            var _this = this;
            var url = baseConfig.server+baseConfig.requestUrl+'/NewProp/getProductGoldData';
            var params = {
                date_s: baseConfig.changeDateTime(_this.formTwo.startDate[0], 0),
                date_e: baseConfig.changeDateTime(_this.formTwo.startDate[1], 0),
                show_type: _this.formTwo.show_type,
                channel: _this.formTwo.channelId.join(','),
            };
            axios.get(url, { params: params })
            .then((res) => {
                if(res.data.ret) {
                    _this.formTwo.totalpage = res.data.data.length;
                    _this.formTwo.tabData = res.data.data;
                } 
                else {
                    baseConfig.errorTipMsg(_this, res.data.msg);
                }
            })
            .catch((err) => {
                console.log(err);
            })
        },
        twoHandleCurrentChange(val) {
			var _this = this;
            _this.formTwo.page = val;
            // val与page有一个-1的关系
			_this.formTwo.star = (_this.formTwo.page-1)*20;
			_this.formTwo.end = _this.formTwo.star+20;
        },
        goOneHtml(obj) {
            var _this = this;
            _this.formOne.date = obj.date;
            _this.formOne.show_type = _this.formTwo.show_type;
            _this.formOne.channel = _this.formTwo.channelId.join(',');
            _this.tabActiveName = 'one';
            _this.getTableData();
        },
        /*
            1、handleClick：顶部tab进行页面的切换
        */ 
		handleClick(tab, event) {
			var _this = this;
            // console.log(tab.label);
            if(tab.label=='商城明细') {
                baseConfig.errorTipMsg(_this, '不可以直接进入，请点击明细进入~');
            }
        },
	},
	mounted() {
		var _this = this;
		_this.$nextTick(function() {
			_this.tabHeight = baseConfig.lineNumber(tabHeight);            
            _this.tabPageHeight = baseConfig.lineNumber(tabPageHeight);
			_this.tabSearchPageHeight = baseConfig.lineNumber(tabSearchPageHeight);            
            _this.getTwoData();
        })
        var id = store.state.user.channelid.split(",");
        var name = store.state.user.channelname.split(",");
        for (var i = 0; i < id.length; i++) {
            _this.formTwo.channelData[id[i]] = name[i];
        }
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

<template>
	<!-- 房间标签 -->
	<!-- dom结构内容 -->
	<section>
		<!-- 工具条/头部的搜索条件搜索 -->
		<el-tabs v-model="tabActiveName" type="border-card" @tab-click="handleClick">
			<el-tab-pane label="功能标签" name="first" :style="{ height: tabSearchHeight+'px' }">
				<el-table ref="tableHeight" :data="onePageTabData" border fit highlight-current-row v-loading="listLoading" style="width: 100%;height:100%;">
					<el-table-column prop="id" label="标签ID" sortable></el-table-column>
					<el-table-column prop="label_name" label="标签名称" sortable></el-table-column>
					<el-table-column prop="position" label="位置" sortable></el-table-column>
					<el-table-column prop="create_time" label="添加日期" sortable></el-table-column>
					<el-table-column prop="status" :formatter="judgeStatus" label="状态" sortable></el-table-column>
					<el-table-column prop="sort" label="当前排序" sortable></el-table-column>
					<el-table-column prop="is_room_show" :formatter="judgeRoomShow" label="是否房间设置标签" sortable></el-table-column>

					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button type="danger" @click.native.prevent="deleteOneUserData(scope.$index, tabData)" size="small">删除</el-button>
							<el-button type="primary" @click.native.prevent="editOneUserData(scope.$index, tabData)" size="small">编辑</el-button>
						</template>
					</el-table-column>
				</el-table>
				<!--工具条-->
				<el-col :span="24" class="toolbar">
					<el-pagination layout="total,prev,pager,next,jumper" @current-change="handleCurrentChange" :page-size="20" :total="totalpage" style="float:right;"></el-pagination>
				</el-col>
				<el-dialog title="编辑标签" :visible.sync="formTwo.dialogFormVisible">
					<el-form :model="formTwo">
						<el-form-item label="标签名称：" :label-width="formLabelWidth">
							<el-input v-model="formTwo.label_name" auto-complete="off"></el-input>
						</el-form-item>
						<el-form-item label="状态" :label-width="formLabelWidth">
							<el-select v-model="formTwo.status">
								<el-option label="下架" value="0"></el-option>
								<el-option label="上架" value="1"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="标签sort：" placeholder="标签名称" :label-width="formLabelWidth">
							<el-input v-model="formTwo.sort" placeholder="sort"></el-input>
						</el-form-item>
						<el-form-item label="房间设置标签" :label-width="formLabelWidth">
							<el-select v-model="formTwo.is_room_show">
								<el-option label="否" value="0"></el-option>
								<el-option label="是" value="1"></el-option>
							</el-select>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click="formTwo.dialogFormVisible = false">取 消</el-button>
						<el-button type="primary" @click="sureEditUser()">确 定</el-button>
					</div>
				</el-dialog>
			</el-tab-pane>
			<!-- <el-tab-pane label="官方标签" name="second" :style="{ height: tabSearchHeight+'px' }">
				<el-table ref="tableHeight" :data="tabData1" border fit highlight-current-row v-loading="listLoading1" style="width: 100%;height:100%;">

				</el-table>
			</el-tab-pane> -->

		</el-tabs>
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
			tabSearchHeight: null,
            form: {
                tab_name: "",
                sort: ""
            },
            formTwo: {
                dialogFormVisible: false,
                id: "",
                label_name: "",
                sort: "",
                status: "",
                is_room_show: ""
            },
            listLoading: false, //动画加载时显示的动画listLoading1
            listLoading1: false, //动画加载时显示的动画listLoading1
            tabData: [],  
            tabData1: [],  
            totalpage: null, //下方工具条的总页数
            page: 1, //现在数据展示的页数，当返回的是全部的数据时，设置默认的页面为1
            star: "0", //每一页的开始数据
            end: "20", //每一页的结束数据
            dialogFormVisible: false, // 控制dialog弹框的显示和隐藏
            formLabelWidth: "120px", // 设置dialog弹框的宽度
            tabActiveName: 'first',
        };
    },
    computed: {
        // 对某一页码展示某一页的数据，对返回的所有的数据进行切割处理，对当前的页码显示20条当前页码的数据
        onePageTabData() {
            var _this = this;
            return _this.tabData.slice(_this.star, _this.end);
        },
    },
    methods: {
        handleClick() {
            console.log(1);
        },
        // 下方页数进行翻页的页码时，返回的是全部的数据，配合onePageTabData展示需要展示当前页面的数据
        handleCurrentChange(val) {
            // val指的是当前点击是第一页
            var _this = this;
            _this.page = val;
            _this.star = (_this.page - 1) * 20;
            _this.end = _this.star + 20;
        },
        judgeRoomShow(row) {
            if (row.is_room_show == 0) {
                return "否";
            } else if (row.is_room_show == 1) {
                return "是";
            }
        },
        judgeStatus(row) {
            if (row.status == 0) {
                return "下架";
            } else if (row.status == 1) {
                return "上架";
            }
        },
        // 获取数据列表
        getTableData() {
            var _this = this;
            _this.listLoading = true;
            var url = "/NewFamily/getRoomTabList";
            allget("", url)
                .then(res => {
                    _this.listLoading = false;
                    if (res.data.ret) {
                        _this.tabData = res.data.data;
                        _this.totalpage = res.data.data.length;
                    } else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
		},
		etTableData() {
            var _this = this;
            _this.listLoading = true;
            var url = "/NewFamily/getRoomOfficialTabList";
            allget("", url)
                .then(res => {
                    _this.listLoading = false;
                    if (res.data.ret) {
                        _this.tabData = res.data.data;
                        _this.totalpage = res.data.data.length;
                    } else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 编辑标签页
        editOneUserData(index, row) {
            this.formTwo.id = row[index].id;
            this.formTwo.label_name = row[index].label_name;
            this.formTwo.sort = row[index].sort;
            this.formTwo.status = row[index].status;
            this.formTwo.is_room_show = row[index].is_room_show;
            this.formTwo.dialogFormVisible = true;
        },
        sureEditUser() {
            var _this = this;
            var url = "/NewFamily/editRoomTabList";
            var param = {
                id: this.formTwo.id,
                label_name: this.formTwo.label_name,
                sort: this.formTwo.sort,
                status: this.formTwo.status,
                is_room_show: this.formTwo.is_room_show
            };
            allget(param, url)
                .then(res => {
                    if (res.data.ret) {
                        _this.formTwo.dialogFormVisible = false;
                        baseConfig.normalTipMsg(_this, res.data.msg);
                        _this.getTableData();
                    } else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 删除
        deleteOneUserData() {
            baseConfig.warningTipMsg(this, "请联系服务端进行删除！谢谢。。。");
        }
    },
    mounted() {
        var _this = this;
        this.$nextTick(function() {
			_this.tabSearchHeight = baseConfig.lineNumber(tabPageHeight);
			console.log(_this.tabSearchHeight)
            _this.getTableData();
        });
    }
};
</script>

<style lang="css" scoped>
/* 引入的图片展示样式 */
.fileinput {
    float: left;
    margin-top: 8px;
}
/* 页面样式css内容 */
.excelBox {
    width: 500px;
    height: 270px;
    margin-left: -150px;
    background: #f1f7ff;
    position: absolute;
    left: 50%;
    top: 15%;
    z-index: 1000;
}
p {
    margin: 0;
}
.excelBox > p {
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-weight: bold;
    background: #e3efff;
    text-align: center;
}
.excelBox .excelInput {
    width: 100%;
    height: 60px;
}
.excelBox .select {
    width: 100%;
    height: 80px;
}
.excelBox .excelInput p,
.excelBox .select p {
    width: 100%;
    height: 36px;
    text-indent: 20px;
    line-height: 36px;
}
.excelBox .excelInput input {
    width: 300px;
    display: block;
    margin: 0 auto;
}
.excelBox .select > div {
    width: 300px;
    display: block;
    margin: 0 auto;
}
.btns {
    width: 100%;
    height: 50px;
}
.btns button {
    width: 80px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border: none;
    border-radius: 5px;
    background-color: #78b2ff;
    margin-top: 20px;
    color: #fff;
}
.btns button:nth-of-type(1) {
    margin-left: 150px;
    cursor: pointer;
}
.btns button:nth-of-type(2) {
    margin-left: 50px;
    cursor: pointer;
}
.demo-ruleForm {
    width: 500px;
}
.el-tab-pane {
    height: 800px;
}
</style>

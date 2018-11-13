<template>
	<!-- 道具列表 -->
	<section>
        <el-tabs 
        v-model="tabActiveName" 
        type="border-card" 
        @tab-click="handleClick">
			<el-tab-pane 
            label="道具" 
            name="one" 
            :style="{height:tabHeight+'px'}">
                <template>
                    <el-table 
                    ref="tableHeight" 
                    :data="onePageTabData" 
                    border fit highlight-current-row 
                    v-loading="listLoading" 
                    style="width:100%;" :height="tabPageHeight">
                        <el-table-column prop="id" label="道具ID" ></el-table-column>
                        <!-- <el-table-column prop="type" label="道具类型" sortable >
                            <template slot-scope="scope">
                                <p v-if="scope.row.type==0">直接使用</p>
                                <p v-else-if="scope.row.type==1">开门卡</p>
                                <p v-else-if="scope.row.type==2">经验值卡</p>
                                <p v-else-if="scope.row.type==3">偷听卡</p>
                                <p v-else-if="scope.row.type==4">告白卡</p>
                                <p v-else-if="scope.row.type==5">转盘卡</p>
                                <p v-else-if="scope.row.type==6">充值优惠卡</p>
                                <p v-else-if="scope.row.type==7">抢聊卡</p>
                                <p v-else-if="scope.row.type==8">财富卡</p>
                                <p v-else-if="scope.row.type==9">通话卡</p>
                                <p v-else-if="scope.row.type==10">经验加速卡</p>
                                <p v-else-if="scope.row.type==11">体验会员卡</p>
                            </template>
                        </el-table-column> -->
                        <el-table-column prop="name" label="道具名称" ></el-table-column>
                        <el-table-column prop="icon" label="道具图片" width="120">
                            <template slot-scope="scope">
                                <div slot="reference" class="name-wrapper">
                                    <img :src="scope.row.icon" alt="" style="width: 100px; height: auto;">
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="coming_icon" width="120" label="即将可使用道具icon" >
                            <template slot-scope="scope">
                                <div slot="reference" class="name-wrapper">
                                    <img :src="scope.row.coming_icon" alt="" style="width: 100px; height: auto;">
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="lose_icon" label="失效道具icon" >
                            <template slot-scope="scope">
                                <div slot="reference" class="name-wrapper">
                                    <img :src="scope.row.lose_icon" alt="" style="width: 100px; height: auto;">
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="role_value" label="作用数值" ></el-table-column>
                        <el-table-column prop="role_time" label="作用时长（分）" ></el-table-column>
                        <el-table-column prop="description" label="道具描述" ></el-table-column>
                        <el-table-column prop="price" label="道具价格" sortable ></el-table-column>
                        <el-table-column prop="status" label="上架状态" >
                            <template slot-scope="scope">
                                <p v-if="scope.row.status==0">未上架</p>
                                <p v-if="scope.row.status==1">上架</p>
                            </template>
                        </el-table-column>
                        <el-table-column prop="effective_time" label="有效时长（小时）" >
                            <template slot-scope="scope">
                                <p v-if="scope.row.effective_time==0">永久有效</p>
                                <p v-else>{{scope.row.effective_time}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column prop="prop_value" label="道具卡数值" sortable ></el-table-column>
                        <el-table-column prop="letter_sort" label="道具首字母" sortable ></el-table-column>
                        <el-table-column prop="is_share" label="可否分享" >
                            <template slot-scope="scope">
                                <p v-if="scope.row.is_share==0">不能</p>
                                <p v-if="scope.row.is_share==1">能</p>
                            </template>
                        </el-table-column>
                        <el-table-column prop="is_overlay_grid" label="可否叠加" >
                            <template slot-scope="scope">
                                <p v-if="scope.row.is_overlay_grid==0">否</p>
                                <p v-if="scope.row.is_overlay_grid==1">是</p>
                            </template>
                        </el-table-column>
                        <el-table-column prop="is_overlay" label="可否叠加使用" >
                            <template slot-scope="scope">
                                <p v-if="scope.row.is_overlay==0">否</p>
                                <p v-if="scope.row.is_overlay==1">是</p>
                            </template>
                        </el-table-column>
                        <el-table-column prop="on_sale_time" label="上架时间" ></el-table-column>
                        <el-table-column prop="down_sale_time" label="下架时间"></el-table-column>
                        <el-table-column prop="create_time" label="添加时间" ></el-table-column>
                        
                        <el-table-column label="操作" width="140" fixed="right">
                            <template slot-scope="scope">
                                <el-button type="primary" @click="editOneUserData(scope.$index, formOne.tabData)" size="small">编辑</el-button>
                                <el-button type="danger" v-if="scope.row.status == 0" @click="upDownProp(scope.$index, formOne.tabData, 1)" size="small">上架</el-button>
                                <el-button type="danger" v-else-if="scope.row.status == 1" @click="upDownProp(scope.$index, formOne.tabData, 0)" size="small">下架</el-button>
                            </template>
                        </el-table-column>
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
            label="装扮" 
            name="two" 
            :style="{height:tabHeight+'px'}">
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" style="overflow: hidden;" :model="formTwo">
						<el-form-item>
							<el-button 
                            type="primary" 
                            @click="formTwo.add.dialogFormVisible=true;">新增</el-button>
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
                        <el-table-column prop="id" label="ID" ></el-table-column>
                        <el-table-column prop="create_time" label="添加时间" ></el-table-column>
                        <el-table-column label="类型" sortable >
                            <template slot-scope="scope">
                                <p v-if="scope.row.type==0">麦位框</p>
                                <p v-else-if="scope.row.type==1">麦位冠</p>
                                <p v-else-if="scope.row.type==2">经验值卡</p>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="名称" ></el-table-column>
                        <el-table-column label="装扮图" width="120">
                            <template slot-scope="scope">
                                <div slot="reference" class="name-wrapper">
                                    <img 
                                    :src="scope.row.icon" 
                                    style="width:100px;height:auto;">
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column width="260" label="特效图" >
                            <template slot-scope="scope">
                                <div slot="reference" class="name-wrapper">
                                    <el-button 
                                    v-if="scope.row.dynamic_effect_url!=''&&scope.row.dynamic_effect_url!=null" 
                                    @click.native.prevent="downDemo(scope.row.dynamic_effect_url)">下载文件</el-button>
                                    <el-button 
                                    v-if="scope.row.dynamic_effect_url!=''&&scope.row.dynamic_effect_url!=null" 
                                    @click.native.prevent="lookDemo()">特效图页面</el-button>
                                    <el-button
                                    v-else
                                    plain>无特效</el-button>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="role_time" label="作用时长（小时）" ></el-table-column>
                        <el-table-column prop="description" label="描述" ></el-table-column>

                        <el-table-column label="操作" width="140">
                            <template slot-scope="scope">
                                <el-button 
                                type="primary" 
                                @click="editChange(twoPageTabData[scope.$index])" 
                                size="small">编辑</el-button>
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
            <el-tab-pane 
            label="座驾" 
            name="three" 
            :style="{height:tabHeight+'px'}">
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" style="overflow: hidden;" :model="formThree">
						<el-form-item>
							<el-button 
                            type="primary" 
                            @click="formThree.add.dialogFormVisible=true;">新增</el-button>
						</el-form-item>
					</el-form>
				</el-col>
                <template>
                    <el-table 
                    ref="tabSearchPageHeight" 
                    :data="threePageTabData" 
                    border fit highlight-current-row 
                    v-loading="listLoading" 
                    style="width:100%;" :height="tabSearchPageHeight">
                        <el-table-column prop="id" label="ID" ></el-table-column>
                        <el-table-column prop="create_time" label="添加时间" ></el-table-column>
                        <!-- <el-table-column label="类型" sortable >
                            <template slot-scope="scope">
                                <p v-if="scope.row.type==0">默认（0）</p>
                            </template>
                        </el-table-column> -->
                        <el-table-column prop="name" label="名称" ></el-table-column>
                        <el-table-column label="座驾图" width="120">
                            <template slot-scope="scope">
                                <div slot="reference" class="name-wrapper">
                                    <img 
                                    :src="scope.row.icon" 
                                    style="width:100px;height:auto;">
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column width="260" label="特效图" >
                            <template slot-scope="scope">
                                <div slot="reference" class="name-wrapper">
                                    <el-button 
                                    v-if="scope.row.dynamic_effect_url!=''&&scope.row.dynamic_effect_url!=null" 
                                    @click.native.prevent="downDemo(scope.row.dynamic_effect_url)">下载文件</el-button>
                                    <el-button 
                                    v-if="scope.row.dynamic_effect_url!=''&&scope.row.dynamic_effect_url!=null" 
                                    @click.native.prevent="lookDemo()">特效图页面</el-button>
                                    <el-button
                                    v-else
                                    plain>无特效</el-button>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="role_time" label="作用时长（小时）" ></el-table-column>
                        <el-table-column prop="description" label="描述" ></el-table-column>

                        <el-table-column label="操作" width="140">
                            <template slot-scope="scope">
                                <el-button 
                                type="primary" 
                                @click="editChangeThree(threePageTabData[scope.$index])" 
                                size="small">编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-col :span="24" class="toolbar">
                        <el-pagination 
                        layout="total,prev,pager,next,jumper" 
                        @current-change="threeHandleCurrentChange" 
                        :page-size="20" 
                        :total="formThree.totalpage" 
                        style="float:right;"></el-pagination>
                    </el-col>
                </template>
			</el-tab-pane>
            <el-dialog title="道具  编辑" :visible.sync="formOne.dialogFormVisible" width="80%">
                <el-form :model="formOne">
                    <el-form-item label="道具名称：" :label-width="formLabelWidth">
                        <el-input v-model="formOne.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="道具描述：" :label-width="formLabelWidth">
                        <el-input v-model="formOne.description" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="可否分享" :label-width="formLabelWidth">
                        <el-select v-model="formOne.is_share">
                            <el-option label="不能" value="0"></el-option>
                            <el-option label="能" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="道具图片：" :label-width="formLabelWidth">
                        <img :src="formOne.icon" style="width:100px;height:100px;">
                        <input class="select_f" type="file"  @change="uploading($event, 1)">
                    </el-form-item>
                    <el-form-item label="即将可使用道具icon：" :label-width="formLabelWidth">
                        <img :src="formOne.coming_icon" style="width:100px;height:100px;">
                        <input class="select_f" type="file"  @change="uploading($event, 2)">
                    </el-form-item>
                    <el-form-item label="失效道具icon：" :label-width="formLabelWidth">
                        <img :src="formOne.lose_icon" style="width:100px;height:100px;">
                        <input class="select_f" type="file"  @change="uploading($event, 3)">
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="sureEditUser(0)">取 消</el-button>
                    <el-button type="primary" @click="sureEditUser(1)">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 装扮 -->
            <el-dialog title="装扮  新增" :visible.sync="formTwo.add.dialogFormVisible" width="80%">
                <el-form :model="formTwo.add">
                    <el-form-item label="类型" :label-width="formLabelWidth">
                        <el-select v-model="formTwo.add.type">
                            <el-option label="麦位框" value="0"></el-option>
                            <el-option label="卖位冠" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="装扮名称：" :label-width="formLabelWidth">
                        <el-input v-model="formTwo.add.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="作用时长：" :label-width="formLabelWidth">
                        <el-input 
                        placeholder="单位：小时;" 
                        v-model="formTwo.add.role_time" 
                        auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="描述：" :label-width="formLabelWidth">
                        <el-input v-model="formTwo.add.description" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="装扮图：" :label-width="formLabelWidth">
                        <input 
                        class="fileinput"
                        type="file"  
                        @change="uploadingTwo($event, 1, 'add')">
                        <img 
                        :src="formTwo.add.attire_icon_show" 
                        style="width:100px;height:auto;">
                    </el-form-item>
                    <el-form-item label="特效图：" :label-width="formLabelWidth">
                        <input 
                        class="fileinput"
                        type="file"  
                        @change="uploadingTwo($event, 2, 'add')">
                        <el-button @click.native.prevent="lookDemo()">特效图页面</el-button>
						<p style="color:red;display:inline-block;">可以打开特效图页面，将文件拖入查看效果~</p>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="sureAddTwo(0)">取 消</el-button>
                    <el-button type="primary" @click="sureAddTwo(1)">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="装扮  编辑" :visible.sync="formTwo.edit.dialogFormVisible" width="80%">
                <el-form :model="formTwo.edit">
                    <el-form-item label="类型" :label-width="formLabelWidth">
                        <el-select v-model="formTwo.edit.type">
                            <el-option label="麦位框" value="0"></el-option>
                            <el-option label="卖位冠" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="装扮名称：" :label-width="formLabelWidth">
                        <el-input v-model="formTwo.edit.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="作用时长：" :label-width="formLabelWidth">
                        <el-input 
                        placeholder="单位：小时;" 
                        v-model="formTwo.edit.role_time" 
                        auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="描述：" :label-width="formLabelWidth">
                        <el-input type="textarea" v-model="formTwo.edit.description" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="装扮图：" :label-width="formLabelWidth">
                        <input 
                        class="fileinput"
                        type="file"  
                        @change="uploadingTwo($event, 1, 'edit')">
                        <img 
                        :src="formTwo.edit.attire_icon_show" 
                        style="width:100px;height:auto;">
                    </el-form-item>
                    <el-form-item label="特效图：" :label-width="formLabelWidth">
                        <input 
                        class="fileinput"
                        type="file"  
                        @change="uploadingTwo($event, 2, 'edit')">
                        <el-button 
                        v-if="formTwo.edit.dynamic_effect_url!=''&&formTwo.edit.dynamic_effect_url!=null" 
                        @click.native.prevent="downDemo(formTwo.edit.dynamic_effect_url)">下载文件</el-button>
						<el-button 
                        @click.native.prevent="lookDemo()">特效图页面</el-button>
						<p style="color:red;display:inline-block;">可以打开特效图页面，将文件拖入查看效果~</p>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="sureEditTwo(0)">取 消</el-button>
                    <el-button type="primary" @click="sureEditTwo(1)">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 座驾 -->
            <el-dialog title="座驾  新增" :visible.sync="formThree.add.dialogFormVisible" width="80%">
                <el-form :model="formThree.add">
                    <!-- <el-form-item label="类型" :label-width="formLabelWidth">
                        <el-select disabled="disabled" v-model="formThree.add.type">
                            <el-option label="默认" value="0"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="座驾名称：" :label-width="formLabelWidth">
                        <el-input v-model="formThree.add.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="作用时长：" :label-width="formLabelWidth">
                        <el-input 
                        placeholder="单位：小时;" 
                        v-model="formThree.add.role_time" 
                        auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="描述：" :label-width="formLabelWidth">
                        <el-input v-model="formThree.add.description" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="座驾图：" :label-width="formLabelWidth">
                        <input 
                        class="fileinput"
                        type="file"  
                        @change="uploadingThree($event, 1, 'add')">
                        <img 
                        :src="formThree.add.car_icon_show" 
                        style="width:100px;height:auto;">
                    </el-form-item>
                    <el-form-item label="特效图：" :label-width="formLabelWidth">
                        <input 
                        class="fileinput"
                        type="file"  
                        @change="uploadingThree($event, 2, 'add')">
						<el-button @click.native.prevent="lookDemo()">特效图页面</el-button>
						<p style="color:red;display:inline-block;">可以打开特效图页面，将文件拖入查看效果~</p>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="sureAddThree(0)">取 消</el-button>
                    <el-button type="primary" @click="sureAddThree(1)">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="座驾  编辑" :visible.sync="formThree.edit.dialogFormVisible" width="80%">
                <el-form :model="formThree.edit">
                    <!-- <el-form-item label="类型" :label-width="formLabelWidth">
                        <el-select disabled="disabled" v-model="formThree.edit.type">
                            <el-option label="默认" value="0"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="座驾名称：" :label-width="formLabelWidth">
                        <el-input v-model="formThree.edit.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="作用时长：" :label-width="formLabelWidth">
                        <el-input 
                        placeholder="单位：小时;" 
                        v-model="formThree.edit.role_time" 
                        auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="描述：" :label-width="formLabelWidth">
                        <el-input type="textarea" v-model="formThree.edit.description" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="座驾图：" :label-width="formLabelWidth">
                        <input 
                        class="fileinput"
                        type="file"  
                        @change="uploadingThree($event, 1, 'edit')">
                        <img 
                        :src="formThree.edit.car_icon_show" 
                        style="width:100px;height:auto;">
                    </el-form-item>
                    <el-form-item label="特效图：" :label-width="formLabelWidth">
                        <input 
                        class="fileinput"
                        type="file"  
                        @change="uploadingThree($event, 2, 'edit')">
                        <el-button 
                        v-if="formThree.edit.dynamic_effect_url!=''&&formThree.edit.dynamic_effect_url!=null" 
                        @click.native.prevent="downDemo(formThree.edit.dynamic_effect_url)">下载文件</el-button>
						<el-button 
                        @click.native.prevent="lookDemo()">特效图页面</el-button>
						<p style="color:red;display:inline-block;">可以打开特效图页面，将文件拖入查看效果~</p>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="sureEditThree(0)">取 消</el-button>
                    <el-button type="primary" @click="sureEditThree(1)">确 定</el-button>
                </div>
            </el-dialog>
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
                dialogFormVisible: false,
                id: "",
                name: "",
                description: "",
                is_share: "",
                icon: "",
                file_A: "",
                coming_icon: "",
                file_B: "",
                lose_icon: "",
                file_C: "",
                tabData: [], 
                totalpage: null, 
                page: 1, 
                star: '0',
                end: '20',
            },
            formTwo: {
                tabData: [],
                totalpage: null, 
                page: 1,
                star: '0',
                end: '20', 
                edit: {
                    dialogFormVisible: false,
                    id: '',
                    type: '',
                    name: '',
                    role_time: '',
                    description: '',
                    attire_icon: '',
                    attire_icon_show: '',
                    dynamic_effect_url: '',
                    dynamic_effect_url_show: '',
                },
                add: {
                    dialogFormVisible: false,
                    type: '0',
                    name: '',
                    role_time: '',
                    description: '',
                    attire_icon: '',
                    attire_icon_show: '',
                    dynamic_effect_url: '',
                    dynamic_effect_url_show: '',
                },
            },
            formThree: {
                tabData: [],
                totalpage: null, 
                page: 1,
                star: '0',
                end: '20', 
                edit: {
                    dialogFormVisible: false,
                    id: '',
                    type: '0',
                    name: '',
                    role_time: '',
                    description: '',
                    car_icon: '',
                    car_icon_show: '',
                    dynamic_effect_url: '',
                    dynamic_effect_url_show: '',
                },
                add: {
                    dialogFormVisible: false,
                    type: '0',
                    name: '',
                    role_time: '',
                    description: '',
                    car_icon: '',
                    car_icon_show: '',
                    dynamic_effect_url: '',
                    dynamic_effect_url_show: '',
                },
            },
			listLoading: false, //动画加载时显示的动画
			formLabelWidth: '120px', // 设置dialog弹框的宽度
            tabActiveName: 'one',
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
        threePageTabData() {
			var _this = this;
			return _this.formThree.tabData.slice(_this.formThree.star, _this.formThree.end);
        },
	},
	methods: {
        /*
            道具-第一屏的页面
            1、getTableData：获取数据列表
            2、editOneUserData：编辑
            3、sureEditUser：编辑确定
            4、upDownProp：上下架
            5、uploading：得到文件 type==1 道具图片 type==2 即将可使用道具icon type==3 失效道具icon
            6、oneHandleCurrentChange：配合onePageTabData展示需要展示当前页面的数据
            7、judgeRoomShow：根据返回状态展示是否
            8、judgeStatus：根据返回状态展示上架下架
        */ 
        
		getTableData() {
			var _this = this ;
			_this.listLoading = true;
			var url = '/NewProp/getPropList';
            allget("", url).then(res=>{
                _this.listLoading = false;
                if(res.data.ret){
                    _this.formOne.tabData = res.data.data;
                    _this.formOne.totalpage = res.data.data.length;
                }else{
                    baseConfig.errorTipMsg(_this, res.data.msg);
                }
            }).catch(err=>{
                console.log(err);
            })
		},
        editOneUserData(index, row){
            this.formOne.id = row[index].id;
            this.formOne.name = row[index].name;
            this.formOne.description = row[index].description;
            this.formOne.is_share = row[index].is_share;
            this.formOne.icon = row[index].icon;
            this.formOne.coming_icon = row[index].coming_icon;
            this.formOne.lose_icon = row[index].lose_icon;
            this.formOne.dialogFormVisible = true;
        },
        sureEditUser(type){
            var _this = this;
            if(type==0) {
                _this.resetForm();
            }
            else if(type==1) {
                var url = "/NewProp/editProp";
                var formData = new FormData();
                var config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                };
                formData.append('id', _this.formOne.id);
                formData.append('name', _this.formOne.name);
                formData.append('description', _this.formOne.description);
                formData.append('is_share', _this.formOne.is_share);
                formData.append('icon', _this.formOne.file_A);
                formData.append('coming_icon', _this.formOne.file_B);
                formData.append('lose_icon', _this.formOne.file_C);
                axios.post(baseConfig.server+baseConfig.requestUrl+url, formData, config)
                .then((res) => {
                    if(res.data.ret){
                        baseConfig.normalTipMsg(_this, res.data.msg);
                        _this.getTableData();
                        _this.resetForm();
                    }else{
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                    _this.formOne.dialogFormVisible = false;
                }).catch((eror) => {
                    console.log(err);
                })
            }
        },
        upDownProp(index, row, type){
            var _this = this;
            var url = '/NewProp/upDownProp';
            var param = {
                id: row[index].id,
                status: type,
            }
            allget(param, url).then(res => {
                if(res.data.ret){
                    baseConfig.successTipMsg(_this, res.data.msg);
                    _this.getTableData();
                }else{
                    baseConfig.errorTipMsg(_this, res.data.msg);
                }
            }).catch(err => {
                console.log(err);
            })
        },
        uploading(event, type){
            var _this = this;
            if(type==1) {
                var windowURL = window.URL||window.webkitURL;
                _this.formOne.file_A = event.target.files[0];
                _this.formOne.icon = windowURL.createObjectURL(event.target.files[0]);
            }else if(type==2) {
                var windowURL = window.URL||window.webkitURL;
                _this.formOne.file_B = event.target.files[0];
                _this.formOne.coming_icon = windowURL.createObjectURL(event.target.files[0]);
            }else if(type==3) {
                var windowURL = window.URL||window.webkitURL;
                _this.formOne.file_C = event.target.files[0];
                _this.formOne.lose_icon = windowURL.createObjectURL(event.target.files[0]);
            }
        },
        oneHandleCurrentChange(val) {
			var _this = this;
            _this.formOne.page = val;
            // val与page有一个-1的关系
			_this.formOne.star = (_this.formOne.page-1)*20;
			_this.formOne.end = _this.formOne.star+20;
        },
        judgeRoomShow(row){
            if(row.is_room_show == 0){
                return "否";
            }else if(row.is_room_show == 1){
                return "是";
            }
        },
        judgeStatus(row){
            if(row.status == 0){
                return "下架";
            }else if(row.status == 1){
                return "上架";
            }
        },
        /*
            装扮-第二屏的页面
            1、getTwoData: 获取装扮的全部的内容
            2、twoHandleCurrentChange：配合进行翻页时候使用
            3、sureAddTwo：确定新增装扮
            4、sureEditTwo：编辑装扮的
            5、editChange：编辑修改的内容
            6、uploadingTwo：上传文件
        */ 
        getTwoData() {
            var _this = this;
            var url = baseConfig.server+baseConfig.requestUrl+'/NewProp/getPropAttireList';
            var params = {};
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
        sureAddTwo(type) {
            var _this = this;
            if(type==0) {
                _this.resetForm();
            }
            else if(type==1) {
                let formData = new FormData();
                formData.append('type', _this.formTwo.add.type);
                formData.append('name', _this.formTwo.add.name);
                formData.append('role_time', _this.formTwo.add.role_time);
                formData.append('description', _this.formTwo.add.description);
                formData.append('attire_icon', _this.formTwo.add.attire_icon);
                formData.append('dynamic_effect_url', _this.formTwo.add.dynamic_effect_url);
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                };
                var url = baseConfig.server+baseConfig.requestUrl+'/NewProp/addPropAttireList';
                axios.post(url, formData, config)
                .then((res) => {
                    if(res.data.ret) {
                        baseConfig.successTipMsg(_this, res.data.msg);
                        _this.getTwoData();
                        _this.resetForm();
                    }
                    else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                    _this.formTwo.add.dialogFormVisible = false;
                })
                .catch((err) => {
                    console.log(err);
                })
            }
        },
        sureEditTwo(type) {
            var _this = this;
            if(type==0) {
                _this.resetForm();
            }
            else if(type==1) {
                let formData = new FormData();
                formData.append('id', _this.formTwo.edit.id);
                formData.append('type', _this.formTwo.edit.type);
                formData.append('name', _this.formTwo.edit.name);
                formData.append('role_time', _this.formTwo.edit.role_time);
                formData.append('description', _this.formTwo.edit.description);
                formData.append('attire_icon', _this.formTwo.edit.attire_icon);
                formData.append('dynamic_effect_url', _this.formTwo.edit.dynamic_effect_url);
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                };
                var url = baseConfig.server+baseConfig.requestUrl+'/NewProp/editPropAttireList';
                axios.post(url, formData, config)
                .then((res) => {
                    if(res.data.ret) {
                        baseConfig.successTipMsg(_this, res.data.msg);
                        _this.getTwoData();
                        _this.resetForm();
                    }
                    else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                    _this.formTwo.add.dialogFormVisible = false;
                })
                .catch((err) => {
                    console.log(err);
                })
            }
        },
        editChange(val) {
            var _this = this;
            _this.formTwo.edit.id = val.id;
            _this.formTwo.edit.type = val.type;
            _this.formTwo.edit.name = val.name;
            _this.formTwo.edit.role_time = val.role_time;
            _this.formTwo.edit.description = val.description;
            // 在这里只有图片进行对应的文件、图片icon展示
            // 特效图直接返回的链接为下载链接
            _this.formTwo.edit.attire_icon_show = val.icon;
            _this.formTwo.edit.attire_icon = '';
            _this.formTwo.edit.dynamic_effect_url = val.dynamic_effect_url;
            _this.formTwo.edit.dialogFormVisible = true;
        },
        uploadingTwo(a, b, c) {
            var _this = this;
            // a指代的文件，b指代的（1装扮道具、2特效），指代的（'add'、'edit'）
            if(c=='add') {
                if(b=='1') {
                    _this.formTwo.add.attire_icon = event.target.files[0];
			  	    var windowURL = window.URL || window.webkitURL;
					_this.formTwo.add.attire_icon_show = windowURL.createObjectURL(event.target.files[0]);
                }
                else if(b=='2') {
                    _this.formTwo.add.dynamic_effect_url = event.target.files[0];
                }
            }
            else if(c=='edit') {
                if(b=='1') {
                    _this.formTwo.edit.attire_icon = event.target.files[0];
			  	    var windowURL = window.URL || window.webkitURL;
					_this.formTwo.edit.attire_icon_show = windowURL.createObjectURL(event.target.files[0]);
                }
                else if(b=='2') {
                    _this.formTwo.edit.dynamic_effect_url = event.target.files[0];
                }
            }
        },
        /*
            座驾-第三屏的页面
            1、getThreeData: 获取装扮的全部的内容
            2、threeHandleCurrentChange：配合进行翻页时候使用
            3、sureAddThree：确定新增装扮
            4、sureEditThree：编辑装扮的
            5、editChangeThree：编辑修改的内容
            6、uploadingThree：上传文件
        */ 
        getThreeData() {
            var _this = this;
            var url = baseConfig.server+baseConfig.requestUrl+'/NewProp/getPropCarList';
            var params = {};
            axios.get(url, { params: params })
            .then((res) => {
                if(res.data.ret) {
                    _this.formThree.totalpage = res.data.data.length;
                    _this.formThree.tabData = res.data.data;
                } 
                else {
                    baseConfig.errorTipMsg(_this, res.data.msg);
                }
            })
            .catch((err) => {
                console.log(err);
            })
        },
        threeHandleCurrentChange(val) {
			var _this = this;
            _this.formThree.page = val;
            // val与page有一个-1的关系
			_this.formThree.star = (_this.formThree.page-1)*20;
			_this.formThree.end = _this.formThree.star+20;
        },
        sureAddThree(type) {
            var _this = this;
            if(type==0) {
                _this.resetForm();
            }
            else if(type==1) {
                let formData = new FormData();
                formData.append('type', _this.formThree.add.type);
                formData.append('name', _this.formThree.add.name);
                formData.append('role_time', _this.formThree.add.role_time);
                formData.append('description', _this.formThree.add.description);
                formData.append('car_icon', _this.formThree.add.car_icon);
                formData.append('dynamic_effect_url', _this.formThree.add.dynamic_effect_url);
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                };
                var url = baseConfig.server+baseConfig.requestUrl+'/NewProp/addPropCarList';
                axios.post(url, formData, config)
                .then((res) => {
                    if(res.data.ret) {
                        baseConfig.successTipMsg(_this, res.data.msg);
                        _this.getThreeData();
                        _this.resetForm();
                    }
                    else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                    _this.formThree.add.dialogFormVisible = false;
                })
                .catch((err) => {
                    console.log(err);
                })
            }
        },
        sureEditThree(type) {
            var _this = this;
            if(type==0) {
                _this.resetForm();
            }
            else if(type==1) {
                let formData = new FormData();
                formData.append('id', _this.formThree.edit.id);
                formData.append('type', _this.formThree.edit.type);
                formData.append('name', _this.formThree.edit.name);
                formData.append('role_time', _this.formThree.edit.role_time);
                formData.append('description', _this.formThree.edit.description);
                formData.append('car_icon', _this.formThree.edit.car_icon);
                formData.append('dynamic_effect_url', _this.formThree.edit.dynamic_effect_url);
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                };
                var url = baseConfig.server+baseConfig.requestUrl+'/NewProp/editPropCarList';
                axios.post(url, formData, config)
                .then((res) => {
                    if(res.data.ret) {
                        baseConfig.successTipMsg(_this, res.data.msg);
                        _this.getThreeData();
                        _this.resetForm();
                    }
                    else {
                        baseConfig.errorTipMsg(_this, res.data.msg);
                    }
                    _this.formThree.add.dialogFormVisible = false;
                })
                .catch((err) => {
                    console.log(err);
                })
            }
        },
        editChangeThree(val) {
            var _this = this;
            _this.formThree.edit.id = val.id;
            _this.formThree.edit.type = val.type;
            _this.formThree.edit.name = val.name;
            _this.formThree.edit.role_time = val.role_time;
            _this.formThree.edit.description = val.description;
            // 在这里只有对应的icon有展示图片，特效图没有对应的内容展示
            _this.formThree.edit.car_icon_show = val.icon;
            _this.formThree.edit.car_icon = '';
            _this.formThree.edit.dynamic_effect_url = val.dynamic_effect_url;
            _this.formThree.edit.dialogFormVisible = true;
        },
        uploadingThree(a, b, c) {
            var _this = this;
            // a指代的文件，b指代的（1装扮道具、2特效），指代的（'add'、'edit'）
            if(c=='add') {
                if(b=='1') {
                    _this.formThree.add.car_icon = event.target.files[0];
			  	    var windowURL = window.URL || window.webkitURL;
					_this.formThree.add.car_icon_show = windowURL.createObjectURL(event.target.files[0]);
                }
                else if(b=='2') {
                    _this.formThree.add.dynamic_effect_url = event.target.files[0];
                }
            }
            else if(c=='edit') {
                if(b=='1') {
                    _this.formThree.edit.car_icon = event.target.files[0];
			  	    var windowURL = window.URL || window.webkitURL;
					_this.formThree.edit.car_icon_show = windowURL.createObjectURL(event.target.files[0]);
                }
                else if(b=='2') {
                    _this.formThree.edit.dynamic_effect_url = event.target.files[0];
                }
            }
        },
        /*
            1、handleClick：顶部tab进行页面的切换
            2、resetForm：重新设置form的数据表格
            3、downDemo：下载文件
			4、lookDemo：进入浏览的页面
        */ 
		handleClick(tab, event) {
			var _this = this;
			// console.log(tab.label);
        },
        resetForm() {
            var _this = this;
            _this.formOne.icon = '';
            _this.formOne.file_A = '';
            _this.formOne.coming_icon = '';
            _this.formOne.file_B = '';
            _this.formOne.lose_icon = '';
            _this.formOne.file_C = '';
            _this.formTwo.edit = {
                dialogFormVisible: false,
                id: '',
                type: '',
                name: '',
                role_time: '',
                description: '',
                attire_icon: '',
                attire_icon_show: '',
                dynamic_effect_url: '',
                dynamic_effect_url_show: '',
            };
            _this.formTwo.add = {
                dialogFormVisible: false,
                type: '0',
                name: '',
                role_time: '',
                description: '',
                attire_icon: '',
                attire_icon_show: '',
                dynamic_effect_url: '',
                dynamic_effect_url_show: '',
            };
            _this.formThree.edit = {
                dialogFormVisible: false,
                id: '',
                type: '0',
                name: '',
                role_time: '',
                description: '',
                car_icon: '',
                car_icon_show: '',
                dynamic_effect_url: '',
                dynamic_effect_url_show: '',
            };
            _this.formThree.add = {
                dialogFormVisible: false,
                type: '0',
                name: '',
                role_time: '',
                description: '',
                car_icon: '',
                car_icon_show: '',
                dynamic_effect_url: '',
                dynamic_effect_url_show: '',
            };
        },
		downDemo(val) {
			var _this = this;
			window.open(val);
		},
		lookDemo() {
			window.open('http://svga.io/svga-preview.html');
		},
	},
	mounted() {
		var _this = this;
		this.$nextTick(function() {
            _this.tabPageHeight = baseConfig.lineNumber(tabPageHeight);
			_this.tabHeight = baseConfig.lineNumber(tabHeight);            
			_this.tabSearchPageHeight = baseConfig.lineNumber(tabSearchPageHeight);            
            _this.getTableData();
            _this.getTwoData();
            _this.getThreeData();
        })
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

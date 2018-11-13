<template>
	<!-- 礼物管理->table为指的是数据table展示页面 -->
	<!-- dom结构内容 -->
	<section>
		<!-- 工具条/头部的搜索条件搜索 -->
		<el-tabs v-model="tabActiveName" type="border-card" @tab-click="handleClick">
			<!-- 普通礼物 -->
			<el-tab-pane label="普通礼物" name="first" :style="{ height: tabSearchHeight+'px' }">
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" style="overflow: hidden;" :model="formOne">
						<el-form-item>
							<div class="block">
								<span class="registerTime">注册时间</span>
								<el-date-picker v-model="formOne.choiceDate" type="daterange" range-separator=" 至 " placeholder="选择日期范围"></el-date-picker>
							</div>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="giftUploading.dialogShow = true;">新增礼物</el-button>
							<el-button type="primary" @click="getTableNormalGiftData">查询</el-button>
						</el-form-item>
					</el-form>
				</el-col>
				<!--用户的数据展示列表-->
				<template>
					<el-table ref="tableHeight" :data="onePageData" border fit highlight-current-row v-loading="listLoading" style="width: 100%;" :height="tableHeight">
						<el-table-column prop="id" label="礼物ID" width="50"></el-table-column>
						<el-table-column prop="name" label="礼物名称" width="100"></el-table-column>
						<el-table-column label="礼物图标" width="150">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<img :src="scope.row.icon" alt="" style="width: 100px; height: auto;">
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="price" label="礼物价格" width="50"></el-table-column>
						<el-table-column label="礼物类型" width="50">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<p v-if="scope.row.type==1">聊币</p>									
								</div>
							</template>
						</el-table-column>
						<el-table-column label="动态图标" width="150">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<img :src="scope.row.dynamic_icon" alt="" style="width: 100px; height: auto;">
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="on_sale_time" label="上架时间" width="80"></el-table-column>
						<el-table-column prop="create_time" label="创建时间" width="80"></el-table-column>
						<el-table-column label="上架状态" width="100">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<p v-if="scope.row.status==1">上架了</p>
									<p v-else-if="scope.row.status==0">已下架</p>
									<p v-else-if="scope.row.status==2">等待上架</p>									
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="sort" label="排序" width="50"></el-table-column>
						<el-table-column prop="second_id" label="二级ID" width="50"></el-table-column>
						<el-table-column prop="name" label="会员专属？" width="50">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<p v-if="scope.row.is_vip==1">是</p>
									<p v-else>否</p>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="down_sale_time" label="礼物下架时间" width="80">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<p v-if="scope.row.down_sale_time==null">无</p>
									<p v-else>{{scope.row.down_sale_time}}</p>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="name" label="转盘礼物？" width="50">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<p v-if="scope.row.is_turntable==0">否</p>
									<p v-else-if="scope.row.is_turntable==1">是</p>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="probability" label="转盘几率" width="80"></el-table-column>
						<el-table-column label="位置" width="80">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<p v-if="scope.row.position==1">普通礼物</p>
									<p v-else-if="scope.row.position==2">活动礼物</p>
									<p v-if="scope.row.position==3">房间礼物</p>
								</div>
							</template>
						</el-table-column>							
						<el-table-column label="特殊礼物？" width="50">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<p v-if="scope.row.is_special==1">是</p>
									<p v-else-if="scope.row.is_special==0">否</p>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="stock_num" label="库存数量" width="50"></el-table-column>										
						<el-table-column label="操作" fixed="right" min-width="200">
							<template slot-scope="scope">
								<el-button type="primary" @click.native.prevent="changeOneUserData(scope.$index, formOne.TabData, '1')" size="mini">编辑</el-button>								
								<el-button v-if="scope.row.status=='0'" plain size="mini" @click.native.prevent="tipUndercarriage()">下架</el-button>
								<el-button v-else type="primary" @click.native.prevent="undercarriage(scope.$index, formOne.TabData, '1')" size="mini">下架</el-button>
							</template>
						</el-table-column>
					</el-table>
					<!--工具条-->
					<el-col :span="24" class="toolbar">
						<el-pagination layout="total,prev,pager,next,jumper" @current-change="oneHandleCurrentChange" :page-size="20" :total="formOne.TotalPage" style="float:right;"></el-pagination>
					</el-col>
				</template>
			</el-tab-pane>
			<!-- 活动礼物 -->
			<el-tab-pane label="活动礼物" name="second" :style="{ height: tabSearchHeight+'px' }">
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" style="overflow: hidden;" :model="formTwo">
						<el-form-item>
							<div class="block">
								<span class="registerTime">注册时间</span>
								<el-date-picker v-model="formTwo.choiceDate" type="daterange" range-separator=" 至 " placeholder="选择日期范围"></el-date-picker>
							</div>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="giftUploading.dialogShow = true;">新增礼物</el-button>							
							<el-button type="primary" @click="getTableActivityGiftData">查询</el-button>
						</el-form-item>
					</el-form>
				</el-col>
				<!--用户的数据展示列表-->
				<template>
					<el-table ref="tableHeight" :data="twoPageData" border fit highlight-current-row v-loading="listLoading" style="width: 100%;" :height="tableHeight">
						<el-table-column prop="id" label="礼物ID" width="50"></el-table-column>
						<el-table-column prop="name" label="礼物名称" width="100"></el-table-column>
						<el-table-column label="礼物图标" width="150">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<img :src="scope.row.icon" alt="" style="width: 100px; height: auto;">
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="price" label="礼物价格" width="50"></el-table-column>
						<el-table-column label="礼物类型" width="50">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<p v-if="scope.row.type==1">聊币</p>									
								</div>
							</template>
						</el-table-column>
						<el-table-column label="动态图标" width="150">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<img :src="scope.row.dynamic_icon" alt="" style="width: 100px; height: auto;">
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="on_sale_time" label="上架时间" width="80"></el-table-column>
						<el-table-column prop="create_time" label="创建时间" width="80"></el-table-column>
						<el-table-column label="上架状态" width="100">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<p v-if="scope.row.status==1">上架了</p>
									<p v-else-if="scope.row.status==0">已下架</p>
									<p v-else-if="scope.row.status==2">等待上架</p>									
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="sort" label="排序" width="50"></el-table-column>
						<el-table-column prop="second_id" label="二级ID" width="50"></el-table-column>
						<el-table-column prop="name" label="会员专属？" width="50">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<p v-if="scope.row.is_vip==1">是</p>
									<p v-else>否</p>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="down_sale_time" label="礼物下架时间" width="80">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<p v-if="scope.row.down_sale_time==null">无</p>
									<p v-else>{{scope.row.down_sale_time}}</p>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="name" label="转盘礼物？" width="50">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<p v-if="scope.row.is_turntable==0">否</p>
									<p v-else-if="scope.row.is_turntable==1">是</p>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="probability" label="转盘几率" width="80"></el-table-column>
						<el-table-column label="位置" width="80">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<p v-if="scope.row.position==1">普通礼物</p>
									<p v-else-if="scope.row.position==2">活动礼物</p>
									<p v-if="scope.row.position==3">房间礼物</p>
								</div>
							</template>
						</el-table-column>	
						<el-table-column label="特殊礼物？" width="50">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<p v-if="scope.row.is_special==1">是</p>
									<p v-else-if="scope.row.is_special==0">否</p>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="stock_num" label="库存数量" width="50"></el-table-column>										
						<el-table-column label="操作" fixed="right" min-width="200">
							<template slot-scope="scope">
								<el-button type="primary" @click.native.prevent="changeOneUserData(scope.$index, formTwo.TabData, '2')" size="mini">编辑</el-button>								
								<el-button v-if="scope.row.status=='0'" plain size="mini" @click.native.prevent="tipUndercarriage()">下架</el-button>
								<el-button v-else type="primary" @click.native.prevent="undercarriage(scope.$index, formTwo.TabData, '2')" size="mini">下架</el-button>
							</template>
						</el-table-column>
					</el-table>
					<!--工具条-->
					<el-col :span="24" class="toolbar">
						<el-pagination layout="total,prev,pager,next,jumper" @current-change="twoHandleCurrentChange" :page-size="20" :total="formTwo.TotalPage" style="float:right;"></el-pagination>
					</el-col>
				</template>
			</el-tab-pane>
			<!-- 房间礼物 -->
			<el-tab-pane label="房间礼物" name="three" :style="{ height: tabSearchHeight+'px' }">
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" style="overflow: hidden;" :model="formThree">
						<el-form-item>
							<div class="block">
								<span class="registerTime">注册时间</span>
								<el-date-picker v-model="formThree.choiceDate" type="daterange" range-separator=" 至 " placeholder="选择日期范围"></el-date-picker>
							</div>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="giftUploading.dialogShow = true;">新增礼物</el-button>							
							<el-button type="primary" @click="getTableRoomGiftData">查询</el-button>
						</el-form-item>
					</el-form>
				</el-col>
				<!--用户的数据展示列表-->
				<template>
					<el-table ref="tableHeight" :data="threePageData" border fit highlight-current-row v-loading="listLoading" style="width: 100%;" :height="tableHeight">
						<el-table-column prop="id" label="礼物ID" width="50"></el-table-column>
						<el-table-column prop="name" label="礼物名称" width="100"></el-table-column>
						<el-table-column label="礼物图标" width="150">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<img :src="scope.row.icon" alt="" style="width: 100px; height: auto;">
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="price" label="礼物价格" width="50"></el-table-column>
						<el-table-column label="礼物类型" width="50">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<p v-if="scope.row.type==1">聊币</p>									
								</div>
							</template>
						</el-table-column>
						<el-table-column label="动态图标" width="150">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<img :src="scope.row.dynamic_icon" alt="" style="width: 100px; height: auto;">
								</div>
							</template>
						</el-table-column>
						<el-table-column label="角标图" width="100">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<p v-if="scope.row.superscript==null">暂无角标图</p>
									<img v-else :src="scope.row.superscript" alt="" style="width: 60px; height: auto;">
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="on_sale_time" label="上架时间" width="80"></el-table-column>
						<el-table-column prop="create_time" label="创建时间" width="80"></el-table-column>
						<el-table-column label="上架状态" width="100">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<p v-if="scope.row.status==1">上架了</p>
									<p v-else-if="scope.row.status==0">已下架</p>
									<p v-else-if="scope.row.status==2">等待上架</p>									
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="sort" label="排序" width="50"></el-table-column>
						<el-table-column prop="second_id" label="二级ID" width="50"></el-table-column>
						<el-table-column prop="name" label="会员专属？" width="50">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<p v-if="scope.row.is_vip==1">是</p>
									<p v-else>否</p>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="down_sale_time" label="礼物下架时间" width="80">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<p v-if="scope.row.down_sale_time==null">无</p>
									<p v-else>{{scope.row.down_sale_time}}</p>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="name" label="转盘礼物？" width="50">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<p v-if="scope.row.is_turntable==0">否</p>
									<p v-else-if="scope.row.is_turntable==1">是</p>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="probability" label="转盘几率" width="80"></el-table-column>
						<el-table-column label="位置" width="80">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<p v-if="scope.row.position==1">普通礼物</p>
									<p v-else-if="scope.row.position==2">活动礼物</p>
									<p v-if="scope.row.position==3">房间礼物</p>
								</div>
							</template>
						</el-table-column>	
						<el-table-column label="特殊礼物？" width="50">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<p v-if="scope.row.is_special==1">是</p>
									<p v-else-if="scope.row.is_special==0">否</p>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="stock_num" label="库存数量" width="50"></el-table-column>										
						<el-table-column label="操作" fixed="right" min-width="200">
							<template slot-scope="scope">
								<el-button type="primary" @click.native.prevent="changeOneUserData(scope.$index, formThree.TabData, '3')" size="mini">编辑</el-button>								
								<el-button type="primary" @click.native.prevent="specialData(scope.$index, formThree.TabData, '3')" size="mini">特效</el-button>								
								<el-button v-if="scope.row.status=='0'" plain size="mini" @click.native.prevent="tipUndercarriage()">下架</el-button>
								<el-button v-else type="primary" @click.native.prevent="undercarriage(scope.$index, formThree.TabData, '3')" size="mini">下架</el-button>
							</template>
						</el-table-column>
					</el-table>
					<!--工具条-->
					<el-col :span="24" class="toolbar">
						<el-pagination layout="total,prev,pager,next,jumper" @current-change="threeHandleCurrentChange" :page-size="20" :total="formThree.TotalPage" style="float:right;"></el-pagination>
					</el-col>
				</template>
			</el-tab-pane>
			<!-- 标签管理 -->
			<el-tab-pane label="标签管理" name="four" :style="{ height: tabSearchHeight+'px' }">
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" style="overflow: hidden;" :model="formFour">
						<el-form-item>
							<el-button type="primary" @click="formFour.addDialogShow=true;">新增标签</el-button>
						</el-form-item>
					</el-form>
				</el-col>
				<!--用户的数据展示列表-->
				<template>
					<el-table ref="tableHeight" :data="fourPageData" border fit highlight-current-row v-loading="listLoading" style="width: 100%;" :height="tableHeight">
						<el-table-column prop="id" label="ID" width="150"></el-table-column>
						<el-table-column prop="tab_name" label="礼物标签名" width="150"></el-table-column>
						<el-table-column prop="position" label="位置(值)" width="150"></el-table-column>
						<el-table-column prop="create_time" label="创建时间" width="200"></el-table-column>
						<el-table-column label="状态" width="150">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<p v-if="scope.row.status==0">下架</p>
									<p v-else-if="scope.row.status==1">上架</p>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="sort" label="排序" width="150"></el-table-column>
						<el-table-column label="操作" min-width="100">
							<template slot-scope="scope">
								<el-button type="primary" @click.native.prevent="changeLabelUserData(scope.$index, formFour.TabData)" size="mini">编辑</el-button>								
								<el-button type="primary" @click.native.prevent="deleteLabel(scope.$index, formFour.TabData)" size="mini">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
					<!--工具条-->
					<el-col :span="24" class="toolbar">
						<el-pagination layout="total,prev,pager,next,jumper" @current-change="fourHandleCurrentChange" :page-size="20" :total="formFour.TotalPage" style="float:right;"></el-pagination>
					</el-col>
					<!-- 编辑修改--对应的dialog -->
					<el-dialog title="修改礼物标签" :visible.sync="formFour.editorDialogShow" width="80%">
						<el-form :model="formFour.editor">
							<el-form-item label="标签ID" :label-width="formLabelWidth">
								<el-input v-model="formFour.editor.id" auto-complete="off" disabled></el-input>
							</el-form-item>
							<el-form-item label="标签名称" :label-width="formLabelWidth">
								<el-input v-model="formFour.editor.tab_name" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="标签排序" :label-width="formLabelWidth">
								<el-input v-model="formFour.editor.sort" auto-complete="off"></el-input>
							</el-form-item>
						</el-form>
						<div slot="footer" class="dialog-footer">
							<el-button @click.native.prevent="editorLabelSure(0)">取 消</el-button>
							<el-button type="primary" @click.native.prevent="editorLabelSure(1)">确 定</el-button>
						</div>
					</el-dialog>
					<!-- 新增修改--对应的dialog -->
					<el-dialog title="新增礼物标签" :visible.sync="formFour.addDialogShow">
						<el-form :model="formFour.add">
							<el-form-item label="标签名称" :label-width="formLabelWidth">
								<el-input v-model="formFour.add.tab_name" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="标签排序" :label-width="formLabelWidth">
								<el-input v-model="formFour.add.sort" auto-complete="off"></el-input>
							</el-form-item>
						</el-form>
						<div slot="footer" class="dialog-footer">
							<el-button @click.native.prevent="addLabelSure(0)">取 消</el-button>
							<el-button type="primary" @click.native.prevent="addLabelSure(3)">确 定</el-button>
						</div>
					</el-dialog>
				</template>
			</el-tab-pane>
			<!-- 礼物上传 -->
			<el-dialog title="礼物上传" :visible.sync="giftUploading.dialogShow" width="80%">
				<el-form :model="giftUploading.params">
					<el-form-item label="礼物排序" :label-width="formLabelWidth">
						<el-input v-model="giftUploading.params.sort" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="礼物名称" :label-width="formLabelWidth">
						<el-input v-model="giftUploading.params.name" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="礼物价格" :label-width="formLabelWidth">
						<el-input v-model="giftUploading.params.price" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="图片上传" :label-width="formLabelWidth">
						<input class="filepic fileinput" @change="uploading($event, 0, 0)" type="file">
				        <img :src="giftUploading.src_pic" style="width: 100px; height: auto;"/>
					</el-form-item>
					<el-form-item label="动态图上传" :label-width="formLabelWidth">
						<input class="filegif fileinput" @change="uploading($event, 1, 0)" type="file">
				        <img :src="giftUploading.src_gif" style="width: 100px; height: auto;"/>
					</el-form-item>
					<el-form-item label="角标图" :label-width="formLabelWidth">
						<input class="filegif fileinput" @change="uploading($event, 2, 0)" type="file">
				        <img :src="giftUploading.src_corner" style="width: 100px; height: auto;"/>
					</el-form-item>
					<el-form-item label="礼物位置" :label-width="formLabelWidth">
						<el-select v-model="giftUploading.params.position">
							<el-option label="普通礼物" value="1"></el-option>
							<el-option label="活动礼物" value="2"></el-option>
							<el-option label="房间礼物" value="3"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="礼物上架状态" :label-width="formLabelWidth">
						<el-select v-model="giftUploading.params.status">
							<el-option label="上架" value="1"></el-option>
							<el-option label="下架" value="0"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="礼物类型" :label-width="formLabelWidth">
						<el-select v-model="giftUploading.params.type">
							<el-option label="聊币" value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="礼物描述" :label-width="formLabelWidth">
						<el-input v-model="giftUploading.params.desc" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="上架时间" :label-width="formLabelWidth">
						<div class="block">
							<el-date-picker v-model="giftUploading.params.on_sale_time" type="datetime" placeholder="选择日期时间"></el-date-picker>
						</div>
					</el-form-item>
					<el-form-item label="是否为Vip专享" :label-width="formLabelWidth">
						<el-select v-model="giftUploading.params.is_vip">
							<el-option label="否" value="0"></el-option>
							<el-option label="是" value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="是否为转盘礼物" :label-width="formLabelWidth">
						<el-select v-model="giftUploading.params.is_turntable">
							<el-option label="否" value="0"></el-option>
							<el-option label="是" value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="转盘概率" :label-width="formLabelWidth">
						<el-input v-model="giftUploading.params.probability" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="是否为特殊礼物" :label-width="formLabelWidth">
						<el-select v-model="giftUploading.params.is_special">
							<el-option label="否" value="0"></el-option>
							<el-option label="是" value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="库存数量" :label-width="formLabelWidth">
						<el-input v-model="giftUploading.params.stock_num" auto-complete="off"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native.prevent="addGiftSure(0)">取 消</el-button>
					<el-button type="primary" @click.native.prevent="addGiftSure(1)">确 定</el-button>
				</div>
			</el-dialog>
			<!-- 礼物编辑 -->
			<el-dialog title="礼物编辑" :visible.sync="giftEditorloading.dialogShow" width="80%">
				<el-form :model="giftEditorloading.params">
					<el-form-item label="礼物ID" :label-width="formLabelWidth">
						<el-input disabled v-model="giftEditorloading.params.id" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="礼物排序" :label-width="formLabelWidth">
						<el-input v-model="giftEditorloading.params.sort" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="礼物名称" :label-width="formLabelWidth">
						<el-input v-model="giftEditorloading.params.name" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="礼物价格" :label-width="formLabelWidth">
						<el-input v-model="giftEditorloading.params.price" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="图片上传" :label-width="formLabelWidth">
						<input class="filepic fileinput" id="fileinput3" @change="uploading($event, 0, 1)" type="file">
				        <img :src="giftEditorloading.src_pic" style="width: 100px; height: auto;"/>
					</el-form-item>
					<el-form-item label="动态图上传" :label-width="formLabelWidth">
						<input class="filegif fileinput" id="fileinput4" @change="uploading($event, 1, 1)" type="file">
				        <img :src="giftEditorloading.src_gif" style="width: 100px; height: auto;"/>
					</el-form-item>
					<el-form-item label="角标图" :label-width="formLabelWidth">
						<input class="filegif fileinput" id="fileinput5" @change="uploading($event, 2, 1)" type="file">
				        <img :src="giftEditorloading.src_corner" style="width: 100px; height: auto;"/>
					</el-form-item>
					<el-form-item label="礼物位置" :label-width="formLabelWidth">
						<el-select v-model="giftEditorloading.params.position">
							<el-option label="普通礼物" value="1"></el-option>
							<el-option label="活动礼物" value="2"></el-option>
							<el-option label="房间礼物" value="3"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="礼物上架状态" :label-width="formLabelWidth">
						<el-select v-model="giftEditorloading.params.status">
							<el-option label="上架" value="1"></el-option>
							<el-option label="下架" value="0"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="礼物类型" :label-width="formLabelWidth">
						<el-select v-model="giftEditorloading.params.type">
							<el-option label="聊币" value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="添加时间" :label-width="formLabelWidth">
						<el-input disabled v-model="giftEditorloading.params.create_time" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="上架时间" :label-width="formLabelWidth">
						<div class="block">
							<el-date-picker v-model="giftEditorloading.params.on_sale_time" type="datetime" placeholder="选择日期时间"></el-date-picker>
						</div>
					</el-form-item>
					<el-form-item label="是否为Vip专享" :label-width="formLabelWidth">
						<el-select v-model="giftEditorloading.params.is_vip">
							<el-option label="否" value="0"></el-option>
							<el-option label="是" value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="是否为转盘礼物" :label-width="formLabelWidth">
						<el-select v-model="giftEditorloading.params.is_turntable">
							<el-option label="否" value="0"></el-option>
							<el-option label="是" value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="转盘概率" :label-width="formLabelWidth">
						<el-input v-model="giftEditorloading.params.probability" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="是否为特殊礼物" :label-width="formLabelWidth">
						<el-select v-model="giftEditorloading.params.is_special">
							<el-option label="否" value="0"></el-option>
							<el-option label="是" value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="库存数量" :label-width="formLabelWidth">
						<el-input v-model="giftEditorloading.params.stock_num" auto-complete="off"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native.prevent="editorGiftSure(0)">取 消</el-button>
					<el-button type="primary" @click.native.prevent="editorGiftSure(1)">确 定</el-button>
				</div>
			</el-dialog>
			<!-- 礼物特效的弹窗的table表框 -->
			<el-dialog title="礼物数量特效详情" :visible.sync="giftNumTable.dialogShow" width="80%">
				<el-table :data="giftNumTable.giftNumArr">
					<el-table-column property="gift_id" label="礼物ID" width="50"></el-table-column>
					<el-table-column property="num" label="数量" width="50"></el-table-column>
					<el-table-column property="num_name" label="礼物数字描述" min-width="100"></el-table-column>
					<el-table-column property="is_dynamic_effect" label="是否有特效" width="80">
						<template slot-scope="scope">
							<div slot="reference" class="name-wrapper">
								<p v-if="scope.row.is_dynamic_effect==0">无特效</p>
								<p v-else-if="scope.row.is_dynamic_effect==1">有特效</p>
							</div>
						</template>
					</el-table-column>
					<el-table-column property="num_status" label="是否显示" width="80">
						<template slot-scope="scope">
							<div slot="reference" class="name-wrapper">
								<p v-if="scope.row.num_status==0">显示</p>
								<p v-else-if="scope.row.num_status==1">不显示</p>
							</div>
						</template>
					</el-table-column>
					<el-table-column property="num_img_url" label="标识图" width="150">
						<template slot-scope="scope">
							<div slot="reference" class="name-wrapper">
								<p v-if="scope.row.num_img_url==''||scope.row.num_img_url==null">无标识图</p>
								<img v-else :src="scope.row.num_img_url" alt="" style="width: 100px; height: auto;">
							</div>
						</template>
					</el-table-column>
					<el-table-column property="dynamic_effect_url" label="特效图" width="150">
						<template slot-scope="scope">
							<div slot="reference" class="name-wrapper">
								<p v-if="scope.row.dynamic_effect_url==''||scope.row.dynamic_effect_url==null">无特效图</p>
								<p v-else style="color:red;">有特效图</p>
								<!-- <img v-else :src="scope.row.dynamic_effect_url" alt="" style="width: 100px; height: auto;"> -->
							</div>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="100">
						<template slot-scope="scope">
							<el-button type="primary" @click.native.prevent="changeNumGIft(scope.$index, giftNumTable.giftNumArr)" size="mini">编辑</el-button>								
						</template>
					</el-table-column>
				</el-table>
			</el-dialog>
			<!-- 礼物特效编辑 -->
			<el-dialog title="特效礼物添加编辑" :visible.sync="giftSpecial.dialogShow" width="80%">
				<el-form :model="giftSpecial">
					<el-form-item label="id" :label-width="formLabelWidth">
						<el-input disabled v-model="giftSpecial.id" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="数量" :label-width="formLabelWidth">
						<el-input disabled v-model="giftSpecial.num" auto-complete="off"></el-input>						
					</el-form-item>
					<el-form-item label="数字名称" :label-width="formLabelWidth">
						<el-input disabled v-model="giftSpecial.num_name" auto-complete="off"></el-input>						
					</el-form-item>
					<el-form-item label="是否显示" :label-width="formLabelWidth">
						<el-select v-model="giftSpecial.num_status">
							<el-option label="显示" value="0"></el-option>
							<el-option label="不显示" value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="是否特效" :label-width="formLabelWidth">
						<el-select v-model="giftSpecial.is_dynamic_effect">
							<el-option label="无特效" value="0"></el-option>
							<el-option label="有特效" value="1"></el-option>
						</el-select>				
					</el-form-item>
					<el-form-item label="标识图" :label-width="formLabelWidth">
						<input class="filegif fileinput" id="fileinput6" @change="uploading($event, 0, 2)" type="file">
				        <img :src="giftSpecial.src_num" style="width: 100px; height: auto;"/>
					</el-form-item>
					<el-form-item label="特效图" :label-width="formLabelWidth">
						<input class="filegif fileinput" id="fileinput7" @change="uploading($event, 1, 2)" type="file">
						<el-button v-if="giftSpecial.src_effect!=''" @click.native.prevent="downDemo(giftSpecial.src_effect)">下载文件</el-button>
						<el-button @click.native.prevent="lookDemo()">特效图页面</el-button>
						<p style="color:red;display:inline-block;">可以打开特效图页面，将文件拖入查看效果~</p>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native.prevent="specialGiftSure(0)">取 消</el-button>
					<el-button type="primary" @click.native.prevent="specialGiftSure(1)">确 定</el-button>
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
			tableHeight: null, // table展示的页面的高度多少，第二页中对应高度
			tabSearchHeight: '',
			// 各个tab页面的相应字段
			formOne: {
				choiceDate: [new Date()-180*24*60*60*1000,new Date()], // 对应选择的日期,给默认时间180之前到现在
				TabData: [], //列表的所有数据，移除删除的功能用全部的数据进行移除
				TotalPage: null, //下方工具条的总页数 
				Page: 1, //现在数据展示的页数，当返回的是全部的数据时，设置默认的页面为1
				star: '0', //每一页的开始数据
				end: '20', //每一页的结束数据
			},
			formTwo: {
				choiceDate: [new Date()-180*24*60*60*1000,new Date()], // 对应选择的日期,给默认时间180之前到现在
				TabData: [], //列表的所有数据，移除删除的功能用全部的数据进行移除
				TotalPage: null, //下方工具条的总页数 
				Page: 1, //现在数据展示的页数，当返回的是全部的数据时，设置默认的页面为1
				star: '0', //每一页的开始数据
				end: '20', //每一页的结束数据
			},
			formThree: {
				choiceDate: [new Date()-180*24*60*60*1000,new Date()], // 对应选择的日期,给默认时间180之前到现在
				TabData: [], //列表的所有数据，移除删除的功能用全部的数据进行移除
				TotalPage: null, //下方工具条的总页数 
				Page: 1, //现在数据展示的页数，当返回的是全部的数据时，设置默认的页面为1
				star: '0', //每一页的开始数据
				end: '20', //每一页的结束数据
			},
			formFour: {
				TabData: [], //列表的所有数据，移除删除的功能用全部的数据进行移除
				TotalPage: null, //下方工具条的总页数 
				Page: 1, //现在数据展示的页数，当返回的是全部的数据时，设置默认的页面为1
				star: '0', //每一页的开始数据
				end: '20', //每一页的结束数据
				editorDialogShow: false, // 修改弹窗的显示隐藏
				addDialogShow: false, // 新增弹窗的显示隐藏
				editor: { // 修改对应标签
					index: '',
					id: '',
					sort: '',
					tab_name: '',
				},
				add: { // 新增对应的标签
					sort: '',
					tab_name: '',
				},
			},
			giftUploading: {
				dialogShow: false,
				file_pic: '',//上传的图片
				src_pic: '',
				file_gif: '',//动态图
				src_gif: '',
				file_corner: '',//角标图
				src_corner: '',
				params: {
					sort: '',
					name: '',
					price: '',
					pic: '',
					gif: '',
					position: '2',
					status: '1',
					type: '1',
					desc: '',
					on_sale_time: '',
					is_vip: '0',
					is_turntable: '0',
					probability: '',
					is_special: '0',
					stock_num: '',
				},
			},
			giftEditorloading: {
				index: '',
				type: '',
				dialogShow: false,
				file_pic: '',
				src_pic: '',
				file_gif: '',
				src_gif: '',
				file_corner: '',//角标图
				src_corner: '',
				params: {
					id: '',
					sort: '',
					name: '',
					price: '',
					pic: '',
					gif: '',
					position: '',
					status: '',
					type: '',
					create_time: '',
					on_sale_time: '',
					is_vip: '',
					is_turntable: '',
					probability: '',
					is_special: '',
					stock_num: '',
				},
			},
			giftNumTable: {
				dialogShow: false,
				giftNumArr: [],
			},
			giftSpecial: {
				dialogShow: false,
				id: '',
				num: '',
				is_dynamic_effect: '',
				num_url: '',
				src_num: '',
				effect_url: '',
				src_effect: '',
				num_name: '',
				num_status: '',
			},
			listLoading: false, //动画加载时显示的动画
			tabActiveName: 'first', // 设置为tab切换栏的选中不同的状态(first、second、three、four)
			formLabelWidth: '120px', // 设置dialog弹框的宽度
		};
	},
	computed:{
		// 对某一页码展示某一页的数据，对返回的所有的数据进行切割处理，对当前的页码显示20条当前页码的数据
		onePageData() {
			var _this = this;
			return _this.formOne.TabData.slice(_this.formOne.star, _this.formOne.end);
		},
		twoPageData() {
			var _this = this;
			return _this.formTwo.TabData.slice(_this.formTwo.star, _this.formTwo.end);
		},
		threePageData() {
			var _this = this;
			return _this.formThree.TabData.slice(_this.formThree.star, _this.formThree.end);
		},
		fourPageData() {
			var _this = this;
			return _this.formFour.TabData.slice(_this.formFour.star, _this.formFour.end);
		},
	},
	methods: {
		// 下方页数进行翻页的页码时，返回的是全部的数据，配合onePageData展示需要展示当前页面的数据
		oneHandleCurrentChange(val) {
			// val指的是当前点击是第一页
			var _this = this;
			_this.formOne.Page = val;
			_this.formOne.star = (_this.formOne.Page-1)*20;
			_this.formOne.end = _this.formOne.star+20;
		},
		twoHandleCurrentChange(val) {
			// val指的是当前点击是第一页
			var _this = this;
			_this.formTwo.Page = val;
			_this.formTwo.star = (_this.formTwo.Page-1)*20;
			_this.formTwo.end = _this.formTwo.star+20;
		},
		threeHandleCurrentChange(val) {
			// val指的是当前点击是第一页
			var _this = this;
			_this.formThree.Page = val;
			_this.formThree.star = (_this.formThree.Page-1)*20;
			_this.formThree.end = _this.formThree.star+20;
		},
		fourHandleCurrentChange(val) {
			// val指的是当前点击是第一页
			var _this = this;
			_this.formFour.Page = val;
			_this.formFour.star = (_this.formFour.Page-1)*20;
			_this.formFour.end = _this.formFour.star+20;
		},
		// 提示早已经下架了
		tipUndercarriage() {
			var _this = this;
			baseConfig.warningTipMsg(_this, '早就已经下架了！');
		},
		// 搜索条件
		searchConditionNormalGift() {
			var _this = this;
			var obj = {};
			obj.date_s = baseConfig.changeDateTime(_this.formOne.choiceDate[0], 0);
			obj.date_e = baseConfig.changeDateTime(_this.formOne.choiceDate[1], 0);
			obj.position = '1';
			for(var key in obj) { // 对需要判断搜索值是否为空进行判断提示
				if(obj[key]=='') {
					baseConfig.warningTipMsg(_this, '搜索条件值不能为空！');
					return null;
				}
			}
			return obj; // return出组装好的搜索条件
		},
		searchConditionActiveGift() {
			var _this = this;
			var obj = {};
			obj.date_s = baseConfig.changeDateTime(_this.formTwo.choiceDate[0], 0);
			obj.date_e = baseConfig.changeDateTime(_this.formTwo.choiceDate[1], 0);
			obj.position = '2';
			for(var key in obj) { // 对需要判断搜索值是否为空进行判断提示
				if(obj[key]=='') {
					baseConfig.warningTipMsg(_this, '搜索条件值不能为空！');
					return null;
				}
			}
			return obj; // return出组装好的搜索条件
		},
		searchConditionRoomGift() {
			var _this = this;
			var obj = {};
			obj.date_s = baseConfig.changeDateTime(_this.formThree.choiceDate[0], 0);
			obj.date_e = baseConfig.changeDateTime(_this.formThree.choiceDate[1], 0);
			obj.position = '3';
			for(var key in obj) { // 对需要判断搜索值是否为空进行判断提示
				if(obj[key]=='') {
					baseConfig.warningTipMsg(_this, '搜索条件值不能为空！');
					return null;
				}
			}
			return obj; // return出组装好的搜索条件
		},
		// 获取普通礼物数据列表
		getTableNormalGiftData() {
			var _this = this ;
			_this.listLoading = true;
			var url = '/Gift/getGift';
			// var params = _this.searchConditionNormalGift();
			var params = {
				date_s: baseConfig.changeDateTime(_this.formOne.choiceDate[0], 0),
				date_e: baseConfig.changeDateTime(_this.formOne.choiceDate[1], 0),
				position: '1',
			};
			if(params==null) { // 如果得到的搜索为null，表示存在搜索条件为空，不进行数据请求
				_this.listLoading = false; // 不进行数据请求,直接关闭掉加载的图层
			} else {
				console.log(baseConfig.server+baseConfig.requestUrl+url);
				console.log(params);
				axios.get(baseConfig.server+baseConfig.requestUrl+url, { params: params })				
				.then(res => { // 进行get请求，(请求参数params, 请求地址url)
					// 数据请求成功
					_this.listLoading = false;
					if(res.data.ret) {
						_this.formOne.TotalPage = res.data.data.length; // 正常数据
						_this.formOne.TabData = res.data.data;
					} else {
						baseConfig.errorTipMsg(_this, res.data.msg); // 返回ret==0，非正常数据
					}
				}).catch(function(error){
					console.log(error);
				})
			}
		},
		getTableActivityGiftData() {
			var _this = this ;
			_this.listLoading = true;
			var url = '/Gift/getGift';
			var params = _this.searchConditionActiveGift();
			if(params==null) { // 如果得到的搜索为null，表示存在搜索条件为空，不进行数据请求
				_this.listLoading = false; // 不进行数据请求,直接关闭掉加载的图层
			} else {
				axios.get(baseConfig.server+baseConfig.requestUrl+url, { params: params })				
				.then(res => { // 进行get请求，(请求参数params, 请求地址url)
					// 数据请求成功
					_this.listLoading = false;
					if(res.data.ret) {
						_this.formTwo.TotalPage = res.data.data.length; // 正常数据
						_this.formTwo.TabData = res.data.data;
					} else {
						baseConfig.errorTipMsg(_this, res.data.msg); // 返回ret==0，非正常数据
					}
				}).catch(function(error){
					console.log(error);
				})
			}
		},
		getTableRoomGiftData() {
			var _this = this ;
			_this.listLoading = true;
			var url = '/Gift/getGift';
			// var params = _this.searchConditionRoomGift();
			var params = {
				date_s: baseConfig.changeDateTime(_this.formThree.choiceDate[0], 0),
				date_e: baseConfig.changeDateTime(_this.formThree.choiceDate[1], 0),
				position: '3',
			};
			console.log(params);
			if(params==null) { // 如果得到的搜索为null，表示存在搜索条件为空，不进行数据请求
				_this.listLoading = false; // 不进行数据请求,直接关闭掉加载的图层
			} else {
				axios.get(baseConfig.server+baseConfig.requestUrl+url, { params: params })
				.then(res => { // 进行get请求，(请求参数params, 请求地址url)
					// 数据请求成功
					_this.listLoading = false;
					if(res.data.ret) {
						_this.formThree.TotalPage = res.data.data.length; // 正常数据
						_this.formThree.TabData = res.data.data;
					} else {
						baseConfig.errorTipMsg(_this, res.data.msg); // 返回ret==0，非正常数据
					}
				}).catch(function(error){
					console.log(error);
				})
			}
		},
		// 下架的操作
		undercarriage(index, rows, type) {
			var _this = this;
			if(type=='1') {
				index = index + (_this.formOne.Page-1)*20; // 页数的相应操作，拿取之后翻页的页码的index值
			} else if(type=='2') {
				index = index + (_this.formTwo.Page-1)*20; // 页数的相应操作，拿取之后翻页的页码的index值
			} else if(type=='3') {
				index = index + (_this.formThree.Page-1)*20; // 页数的相应操作，拿取之后翻页的页码的index值
			}
			var id = rows[index].id; // 拿出对应内容的中value值	
			var url = 'Gift/downGift';
			var params = {
				id: id,
			};
			axios.get(baseConfig.server+baseConfig.requestUrl+url, { params: params })
			.then(res => { // 进行get请求，(请求参数params, 请求地址url)
				// 数据请求成功
				if(res.data.ret) {
					baseConfig.successTipMsg(_this, '下架成功！');
					if(type=='1') {
						_this.getTableNormalGiftData();
					} else if(type=='2') {
						_this.getTableActivityGiftData();
					} else if(type=='3') {
						_this.getTableRoomGiftData();
					}
				} else {
					baseConfig.errorTipMsg(_this, res.data.msg); // 返回ret==0，非正常数据
				}
			}).catch(function(error){
				console.log(error);
			})
		},
		// 礼物的编辑操作
		changeOneUserData(index, rows, type) {
			var _this = this;
			if(type=='1') {
				index = index + (_this.formOne.Page-1)*20; // 页数的相应操作，拿取之后翻页的页码的index值
			} else if(type=='2') {
				index = index + (_this.formTwo.Page-1)*20; // 页数的相应操作，拿取之后翻页的页码的index值
			} else if(type=='3') {
				index = index + (_this.formThree.Page-1)*20; // 页数的相应操作，拿取之后翻页的页码的index值
			}
			// 进行赋值操作
			_this.giftEditorloading.index = index;
			_this.giftEditorloading.type = type;
			_this.giftEditorloading.params.id = rows[index].id;
			_this.giftEditorloading.params.sort = rows[index].sort;
			_this.giftEditorloading.params.name = rows[index].name;
			_this.giftEditorloading.params.price = rows[index].price;
			_this.giftEditorloading.src_pic = rows[index].icon;
			_this.giftEditorloading.src_gif = rows[index].dynamic_icon;
			_this.giftEditorloading.src_corner = rows[index].superscript;
			_this.giftEditorloading.params.position = rows[index].position;
			_this.giftEditorloading.params.status = rows[index].status;
			_this.giftEditorloading.params.type = rows[index].type;
			_this.giftEditorloading.params.create_time = rows[index].create_time;
			_this.giftEditorloading.params.on_sale_time = rows[index].on_sale_time;
			_this.giftEditorloading.params.is_vip = rows[index].is_vip;
			_this.giftEditorloading.params.is_turntable = rows[index].is_turntable;
			_this.giftEditorloading.params.probability = rows[index].probability;
			_this.giftEditorloading.params.is_special = rows[index].is_special;
			_this.giftEditorloading.params.stock_num = rows[index].stock_num;
			// 在这里对相应的文件角标图、礼物图片、礼物动图置空
			_this.giftEditorloading.file_pic = '';
			_this.giftEditorloading.file_gif = '';
			_this.giftEditorloading.file_corner = '';
			_this.giftEditorloading.dialogShow = true;
		},
		// 确定礼物的编辑操作
		editorGiftSure(type) {
			var _this = this;
			if(type==0) {
				_this.giftEditorloading.dialogShow = false;
				_this.resetForm();
			} else if(type==1) {
				console.log('点击了确定按钮');
				_this.listLoading = true;
				// 进行编辑的操作
				let formData = new FormData();
			  	formData.append('id', _this.giftEditorloading.params.id);
			  	formData.append('sort', _this.giftEditorloading.params.sort);
			  	formData.append('name', _this.giftEditorloading.params.name);
			  	formData.append('price', _this.giftEditorloading.params.price);
			  	formData.append('pic', _this.giftEditorloading.file_pic);
			  	formData.append('gif', _this.giftEditorloading.file_gif);
			  	formData.append('corner', _this.giftEditorloading.file_corner);
			  	formData.append('position', _this.giftEditorloading.params.position);
			  	formData.append('status', _this.giftEditorloading.params.status);
			  	formData.append('type', _this.giftEditorloading.params.type);
			  	formData.append('create_time', _this.giftEditorloading.params.create_time);
			  	formData.append('on_sale_time', baseConfig.changeDateTime(_this.giftEditorloading.params.on_sale_time, 1));
			  	formData.append('is_vip', _this.giftEditorloading.params.is_vip);
			  	formData.append('is_turntable', _this.giftEditorloading.params.is_turntable);
			  	formData.append('probability', _this.giftEditorloading.params.probability);
			  	formData.append('is_special', _this.giftEditorloading.params.is_special);
			  	formData.append('stock_num', _this.giftEditorloading.params.stock_num);
				let config = {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				};		
				axios.post(baseConfig.server+baseConfig.requestUrl+'/Gift/editGift', formData, config)
				.then((res) => {
					console.log(res.data);
					_this.listLoading = false;	
					_this.giftEditorloading.dialogShow = false;									
					if(res.data.ret) {	
						baseConfig.successTipMsg(_this, '编辑修改成功！');
						// 对相应的table中的内容进行修改替换
						if(_this.giftEditorloading.type==1) {
							_this.getTableNormalGiftData();
						} else if(_this.giftEditorloading.type==2) {
							_this.getTableActivityGiftData();
						} else if(_this.giftEditorloading.type==3) {
							_this.getTableRoomGiftData();
						}
						_this.resetForm();
					} else {
						baseConfig.errorTipMsg(_this, res.data.msg);						
					}
				}).catch((error) => {
					console.log(error);
				});
			}
		},
		// 获取标签管理页面的数据
		getLabelData() {
			var _this = this;
			_this.listLoading = true;
			var url = '/Gift/getGiftTab';
			axios.get(baseConfig.server+baseConfig.requestUrl+url)					
			.then(res => { // 进行get请求，(请求参数params, 请求地址url)
				// 数据请求成功
				_this.listLoading = false;
				if(res.data.ret) {
					_this.formFour.TotalPage = res.data.data.length; // 正常数据
					_this.formFour.TabData = res.data.data;
				} else {
					baseConfig.errorTipMsg(_this, res.data.msg); // 返回ret==0，非正常数据
				}
			}).catch(function(error){
				console.log(error);
			})
		},
		// 添加标签的操作
		addLabelSure(type) {
			var _this = this;
			if(type==3) {
				baseConfig.warningTipMsg(_this, '请联系管理员进行添加！');
				_this.formFour.addDialogShow = false;
			} else if(type==0) {
				_this.formFour.addDialogShow = false;
			} else if(type==1) {
				_this.listLoading = true;
				var url = '/Gift/addGiftTab';
				var params = {
					tab_name: _this.formFour.add.tab_name,
					sort: _this.formFour.add.sort,
				};
				if(params.tab_name!=''&&params.sort!='') {
					_this.formFour.addDialogShow = false;
					axios.get(baseConfig.server+baseConfig.requestUrl+url, { params: params })					
					.then(res => {
						if(res.data.ret) {
							// 数据请求成功
							_this.listLoading = false;
							baseConfig.successTipMsg(_this, '新增成功！');
							_this.getLabelData();
						} else {
							baseConfig.errorTipMsg(_this, res.data.msg);
						}
					}).catch(function(error){
						console.log(error);
					})
				} else {
					_this.listLoading = false; 
					baseConfig.warningTipMsg(_this, '新增的标签名称、排序不能为空！');
				}
			}
		},
		// 编辑标签的操作
		changeLabelUserData(index, rows) {
			var _this = this;
			index = index + (_this.formFour.Page-1)*20; // 页数的相应操作，拿取之后翻页的页码的index值
			_this.formFour.editor.index = index;
			_this.formFour.editor.id = rows[index].id;
			_this.formFour.editor.tab_name = rows[index].tab_name;
			_this.formFour.editor.sort = rows[index].sort;
			_this.formFour.editorDialogShow = true; // 点击了编辑修改显示dialog框
		},
		// 编辑标签的确定,0->取消，1->确定
		editorLabelSure(type) {
			var _this = this;
			if(type==0) {
				_this.formFour.editorDialogShow = false; // 点击了取消按钮
			} else if(type==1){
				_this.listLoading = true;
				// 进行修改操作
				var url = 'Gift/editGiftTab';
				var params = {
					id: _this.formFour.editor.id,
					tab_name: _this.formFour.editor.tab_name,
					sort: _this.formFour.editor.sort,
				};
				if(params.id!=''&&params.tab_name!=''&&params.sort!='') {
					_this.formFour.editorDialogShow = false;
					axios.get(baseConfig.server+baseConfig.requestUrl+url, { params: params })
					.then(res => {
						if(res.data.ret) {
							// 数据请求成功
							_this.listLoading = false;
							baseConfig.successTipMsg(_this, '编辑修改成功！');
							// 直接对table表格的内容进行修改
							_this.formFour.TabData[_this.formFour.editor.index].id = params.id;
							_this.formFour.TabData[_this.formFour.editor.index].tab_name = params.tab_name;
							_this.formFour.TabData[_this.formFour.editor.index].sort = params.sort;
						} else {
							baseConfig.errorTipMsg(_this, res.data.msg);
						}
					}).catch(function(error){
						console.log(error);
					})
				} else {
					_this.listLoading = false; 
					baseConfig.warningTipMsg(_this, '编辑修改的标签名称、排序不能为空！');
				}
			}
		},
		// 删除标签的操作
		deleteLabel(index, rows) {
			var _this = this;
			index = index + (_this.formFour.Page-1)*20;
			var id = rows[index].id;
			_this.listLoading = true;
			var url = '/Gift/delGiftTab';
			var params = {
				id: id,
			};
			axios.get(baseConfig.server+baseConfig.requestUrl+url, { params: params })
			.then(res => {
				// 数据请求成功
				_this.listLoading = false;
				if(res.data.ret) {
					baseConfig.successTipMsg(_this, '删除成功');
					_this.formFour.TabData.splice(index, 1);
					_this.formFour.Totalpage--;
				} else {
					// 返回ret==0，非正常数据
					baseConfig.errorTipMsg(_this, res.data.msg);
				}

			}).catch(function(error) {
				console.log(error);
			})
		},	
		// 得到上传文件type(0->pic，1->gif),val(0->礼物新增，1->礼物编辑)
        uploading(event, type, val) {
			var _this = this;
			if(val==0) { // 礼物新增
				if(type==0) { // 静态图icon图标
					_this.giftUploading.file_pic = event.target.files[0];
			  	    var windowURL = window.URL || window.webkitURL;
					_this.giftUploading.src_pic = windowURL.createObjectURL(event.target.files[0]);
				} else if(type==1) { // 动态图icon图标
					_this.giftUploading.file_gif = event.target.files[0];
			  	    var windowURL = window.URL || window.webkitURL;
					_this.giftUploading.src_gif = windowURL.createObjectURL(event.target.files[0]);
				} else if(type==2) { // 角标图
					_this.giftUploading.file_corner = event.target.files[0];
			  	    var windowURL = window.URL || window.webkitURL;
					_this.giftUploading.src_corner = windowURL.createObjectURL(event.target.files[0]);			
				}
			} else if(val==1) { // 礼物编辑
				if(type==0) { // 静态图icon图标
					_this.giftEditorloading.file_pic = event.target.files[0];//获取文件
			  	    var windowURL = window.URL || window.webkitURL;
					_this.giftEditorloading.src_pic = windowURL.createObjectURL(event.target.files[0]);
				} else if(type==1) { // 动态图icon图标
					_this.giftEditorloading.file_gif = event.target.files[0];//获取文件
			  	    var windowURL = window.URL || window.webkitURL;
					_this.giftEditorloading.src_gif = windowURL.createObjectURL(event.target.files[0]);
				} else if(type==2) { // 角标图
					_this.giftEditorloading.file_corner = event.target.files[0];
			  	    var windowURL = window.URL || window.webkitURL;
					_this.giftEditorloading.src_corner = windowURL.createObjectURL(event.target.files[0]);					
				}
			} else if(val==2) { // 礼物特效
				if(type==0) { // 标识图
					_this.giftSpecial.num_url = event.target.files[0];//获取文件
			  	    var windowURL = window.URL || window.webkitURL;
					_this.giftSpecial.src_num = windowURL.createObjectURL(event.target.files[0]);
				} else if(type==1) { // 特效图
					_this.giftSpecial.effect_url = event.target.files[0];//获取文件
			  	    var windowURL = window.URL || window.webkitURL;
					// 特效图在这里src进行置空处理
					_this.giftSpecial.src_effect = '';
				}
			}
      	}, 
		// 添加礼物的操作
		addGiftSure(type) {
			var _this = this;
			if(type==0) {
				// 点击了取消按钮
				_this.giftUploading.dialogShow = false;
				_this.resetForm();
			} else if(type==1) {
				_this.listLoading = true;
				// 进行添加的操作
				let formData = new FormData();
			  	formData.append('sort', _this.giftUploading.params.sort);
			  	formData.append('status', _this.giftUploading.params.status);
			  	formData.append('name', _this.giftUploading.params.name);
			  	formData.append('pic', _this.giftUploading.file_pic);
			  	formData.append('gif', _this.giftUploading.file_gif);
			  	formData.append('corner', _this.giftUploading.file_corner);
			  	formData.append('price', _this.giftUploading.params.price);
			  	formData.append('type', _this.giftUploading.params.type);
			  	formData.append('on_sale_time', baseConfig.changeDateTime(_this.giftUploading.params.on_sale_time, 1));
			  	formData.append('is_vip', _this.giftUploading.params.is_vip);
			  	formData.append('position', _this.giftUploading.params.position);
			  	formData.append('is_turntable', _this.giftUploading.params.is_turntable);
			  	formData.append('probability', _this.giftUploading.params.probability);
			  	formData.append('is_special', _this.giftUploading.params.is_special);
			  	formData.append('stock_num', _this.giftUploading.params.stock_num);
				let config = {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				};		
				axios.post(baseConfig.server+baseConfig.requestUrl+'/Gift/addGift', formData, config)
				.then((res) => {
					console.log(res.data);
					_this.listLoading = false;	
					_this.giftUploading.dialogShow = false;								
					if(res.data.ret) {	
						baseConfig.successTipMsg(_this, '新增成功！');
						if(formData.get('position')==1) {
							_this.getTableNormalGiftData();
						} else if(formData.get('position')==2) {
							_this.getTableActivityGiftData();
						} else if(formData.get('position')==3) {
							_this.getTableRoomGiftData();
						}
						_this.resetForm();
					} else {
						baseConfig.errorTipMsg(_this, res.data.msg);						
					}
				}).catch((error) => {
					console.log(error);
				});
			}		
		},
		// 房间礼物添加特效
		specialData(index, rows, type) {
			var _this = this;
			if(type=='3') {
				index = index + (_this.formThree.Page-1)*20; // 页数的相应操作，拿取之后翻页的页码的index值
			} else {
				baseConfig.errorTipMsg(_this, '只有房间礼物可以添加特效啦~');				
			}
			_this.getNumGift(rows[index].id);	
		},			
		// 进行房间礼物请求对应数量的详情
		getNumGift(id) {
			var _this = this;
			var url = 'Gift/getGetEffects';
			var params = {
				id: id,
			};
			axios.get(baseConfig.server+baseConfig.requestUrl+url, { params: params })
			.then(res => {
				// 数据请求成功
				_this.listLoading = false;
				if(res.data.ret) {
					_this.giftNumTable.dialogShow = true;
					_this.giftNumTable.giftNumArr = res.data.data;
				} else {
					baseConfig.errorTipMsg(_this, res.data.msg); // 返回ret==0，非正常数据
				}
			}).catch(function(error){
				console.log(error);
			})
		},
		// 礼物数量进行相对应的编辑
		changeNumGIft(index, row) {
			var _this = this;
			console.log(row[index]);
			_this.giftSpecial.id = row[index].gift_id;
			_this.giftSpecial.num = row[index].num;
			_this.giftSpecial.is_dynamic_effect = row[index].is_dynamic_effect;
			_this.giftSpecial.num_name = row[index].num_name;
			_this.giftSpecial.num_status = row[index].num_status;
			_this.giftSpecial.src_num = row[index].num_img_url ? row[index].num_img_url : '';
			_this.giftSpecial.src_effect = row[index].dynamic_effect_url ? row[index].dynamic_effect_url : '';
			// 在这里进行对应的文件置空，选中的也进行置空
			_this.giftSpecial.num_url = '';
			_this.giftSpecial.effect_url = '';
			_this.giftSpecial.dialogShow = true;
		},
		// 进行特效礼物的上传
		specialGiftSure(type) {
			var _this = this;
			if(type==0) {
				_this.giftSpecial.dialogShow = false;
				_this.resetForm();				
			} else if(type==1) {
				_this.listLoading = true;
				let formData = new FormData();
				formData.append('id', _this.giftSpecial.id);
				formData.append('num', _this.giftSpecial.num);
				formData.append('is_dynamic_effect', _this.giftSpecial.is_dynamic_effect);
				formData.append('num_name', _this.giftSpecial.num_name);
				formData.append('num_status', _this.giftSpecial.num_status);
				formData.append('num_url', _this.giftSpecial.num_url);
				formData.append('effect_url', _this.giftSpecial.effect_url);
				let config = {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				};
				axios.post(baseConfig.server+baseConfig.requestUrl+'/Gift/editGetEffects', formData, config)
				.then((res) => {
					_this.listLoading = false;	
					_this.giftSpecial.dialogShow = false;							
					if(res.data.ret) {	
						baseConfig.successTipMsg(_this, '新增成功！');
						// 本身的房间的数据进行更新、然后对相应的弹窗内容进行修改展示
						_this.getTableRoomGiftData();
						_this.getNumGift(_this.giftSpecial.id);
						_this.resetForm();
					} else {
						baseConfig.errorTipMsg(_this, res.data.msg);						
					}
				}).catch((error) => {
					console.log(error);
				});
			}
		},
		// 顶部tab进行页面的切换
		handleClick(tab, event) {
			var _this = this;
			// 进行请求的兼容处理
			if(tab.label=="普通礼物"&&_this.formOne.TabData.length==0) {
				_this.getTableNormalGiftData();
			}
			else if(tab.label=="活动礼物"&&_this.formTwo.TabData.length==0) {
				_this.getTableActivityGiftData();
			}
			else if(tab.label=="房间礼物"&&_this.formThree.TabData.length==0) {
				_this.getTableRoomGiftData();
			}
			else if(tab.label=="标签管理"&&_this.formFour.TabData.length==0) {
				_this.getLabelData();
			}
		},
		resetForm() {
			var _this = this;
			_this.giftUploading = {
				dialogShow: false,
				file_pic: '',
				src_pic: '',
				file_gif: '',
				src_gif: '',
				file_corner: '',
				src_corner: '',
				params: {
					sort: '',
					name: '',
					price: '',
					pic: '',
					gif: '',
					position: '2',
					status: '1',
					type: '1',
					desc: '',
					on_sale_time: '',
					is_vip: '0',
					is_turntable: '0',
					probability: '',
					is_special: '0',
					stock_num: '',
				},
			};
			_this.giftEditorloading = {
				index: '',
				type: '',
				dialogShow: false,
				file_pic: '',
				src_pic: '',
				file_gif: '',
				src_gif: '',
				file_corner: '',
				src_corner: '',
				params: {
					id: '',
					sort: '',
					name: '',
					price: '',
					pic: '',
					gif: '',
					position: '',
					status: '',
					type: '',
					create_time: '',
					on_sale_time: '',
					is_vip: '',
					is_turntable: '',
					probability: '',
					is_special: '',
					stock_num: '',
				},
			};
			_this.giftSpecial = {
				dialogShow: false,
				id: '',
				num: '',
				is_dynamic_effect: '',
				num_url: '',
				src_num: '',
				effect_url: '',
				src_effect: '',
				num_name: '',
				num_status: '',
			};
		},
		/*
			downDemo：下载文件
			lookDemo：进入浏览的页面
		*/ 
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
		_this.$nextTick(function() {
			_this.tableHeight = baseConfig.lineNumber(tabSearchPageHeight);
			_this.tabSearchHeight = baseConfig.lineNumber(tabSearchHeight);
			_this.getTableNormalGiftData();
			_this.getTableActivityGiftData();
			_this.getTableRoomGiftData();
			_this.getLabelData();
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
.el-tab-pane{
	height: 800px;
}
</style>

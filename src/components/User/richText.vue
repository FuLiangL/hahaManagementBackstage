<template>
	<!-- 引用的相对应vue富文本编辑器 -->
	<div>
		<el-row class="warp">
			<el-col :span="24" class="warp-main">
				<el-form ref="infoForm" :model="infoForm" label-width="120px">
					<el-form-item label="标题" prop="title">
						<el-input v-model="infoForm.title"></el-input>
					</el-form-item>
					<el-form-item label="详细">
						<div class="edit_container">
							<quill-editor class="editer" v-model="infoForm.content" ref="myQuillEditor" :options="editorOption" @ready="onEditorReady($event)"></quill-editor>
						</div>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onSubmit">确认提交</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import axios from 'axios';
import { quillEditor } from "vue-quill-editor"; //调用编辑器
export default {
	data() {
		return {
			infoForm: {
				id: '14',
				title: "test",
				// 编辑器的内容
				content: "",
			},
			// 编辑器配置相对应的图片的提交上传
			editorOption: {},
		};
	},
	computed: {
		editor() {
			return this.$refs.myQuillEditor.quill;
		}
	},
	mounted() {
		// 初始化对应拿取相对应的值
		// 进行拿取出对应的值

	},
	methods: {
		onEditorReady(editor) {
			console.log(editor);
		},
		// 请求接口进行提交的操作
		onSubmit() {
			var _this = this;
			console.log(_this.infoForm);
			let formData = new FormData();
			let config = {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			};	
			formData.append('id', _this.infoForm.id);
			formData.append('title', _this.infoForm.title);
			formData.append('content', _this.infoForm.content);
			axios.post(baseConfig.server+baseConfig.requestUrl+'Anchor/editArticle', formData, config)
				.then(function (res) {
					console.log(res);
					// 成功之后进行信息的提示、其他的跳转

				})
				.catch(function (err) {
					console.log(err);
					// 失败直接进行资料的打印

				});
		},
	},
	components: {
		//使用编辑器
		quillEditor
	}
};
</script>
<style>
.edit_container{
	height: 700px;
}
.quill-editor {
  height: 600px;
}
</style>
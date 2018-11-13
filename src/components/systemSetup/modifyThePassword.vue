<template>
<!-- 修改密码 -->
<!-- dom结构内容 -->
<section>
    <div style="padding: 20px;">
        <el-form label-position="right" :model="formOne">
            <el-form-item label="用户名">
                <el-input name="inputObj" v-model="formOne.userid"></el-input>
            </el-form-item>
            <el-form-item label="原密码">
                <el-input name="inputObj" type="password" v-model="formOne.userpwd"></el-input>
            </el-form-item>
            <el-form-item label="新密码">
                <el-input name="inputObj" type="password" v-model="formOne.newuserpwd"></el-input>
            </el-form-item>
            <el-form-item label="再次输入新密码">
                <el-input name="inputObj" type="password" v-model="formOne.pwd"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button style="margin-left: 100px;" @click="editorSure(0)">重 置</el-button>
            <el-button type="primary" @click="editorSure(1)">确 定</el-button>
        </div>       
    </div>
</section>
</template>
<script>
/* 逻辑交互js内容 */
import Event from '../../public_js/event.js';
import { allget } from '../../api/api';
import store from '../../vuex/store';
import axios from 'axios';
import en_md from '../../public_js/md5.js';
export default {
	data() {
		return {
			tableHeight: null, // table展示的页面的高度多少
			formOne: { // 编辑
				userid: '',
				userpwd: '',
                newuserpwd: '',
                pwd: '',
			},
			listLoading: false, //动画加载时显示的动画
		};
	},
	methods: {
        editorSure(type) {
            var _this = this;
            var inputObj = document.getElementsByName('inputObj');
            if(type==0) {//重置的选择
                _this.userid = '';
                _this.userpwd = '';
                _this.newuserpwd = '';
                _this.pwd = '';
            } else if(type==1) {
                _this.listLoading = true;
                if(_this.formOne.userid=='') {
                    baseConfig.warningTipMsg(_this, '请填写用户名！');
                    inputObj[0].focus();                    
                } else if(_this.formOne.userpwd=='') {
                    baseConfig.warningTipMsg(_this, '请填写原密码啦！');
                    inputObj[1].focus();
                } else if(_this.formOne.newuserpwd=='') {
                    baseConfig.warningTipMsg(_this, '新密码为空，不可以啦！');
                    inputObj[2].focus();                    
                } else if(_this.formOne.newuserpwd!=_this.formOne.pwd) {
                    baseConfig.warningTipMsg(_this, '新密码验证错误啦！');                    
                    _this.formOne.pwd = '';
                    inputObj[3].focus();                    
                } else {
                    let formData = new FormData();
                    formData.append('user_name', _this.formOne.userid);
                    formData.append('old_pass_word', en_md(_this.formOne.userpwd));
                    formData.append('new_pass_word', en_md(_this.formOne.newuserpwd));
                    console.log(formData.get('old_pass_word'));
                    let config = {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    };
                    axios.post(baseConfig.server+baseConfig.requestUrl+'/NewLoginTpl/changePassWord', formData, config)
                    .then((res) => {
                        _this.listLoading = false;	
                        if(res.data.ret) {	
                            baseConfig.successTipMsg(_this, '编辑修改密码成功！');
                            _this.formOne.userid = '';
                            _this.formOne.userpwd = '';
                            _this.formOne.newuserpwd = '';
                            _this.formOne.pwd = '';
                            baseConfig.normalTipMsg(_this, '正在跳转到登录页面');
                            setTimeout(function() {
                                _this.$router.replace({
                                    path: '/login', 
                                    replace: true,
                                });
                            }, 1500);
                        } else {
                            baseConfig.errorTipMsg(_this, res.data.msg);						
                        }
                    }).catch((error) => {
                        console.log(error);
                    });
                }
            }
        },
    },
	mounted() {
		var _this = this;
		_this.$nextTick(function() {
            _this.tableHeight = baseConfig.lineNumber(searchPageHeight); // 固定table的自适应的高度
            _this.formOne.userid = store.state.user.user;
		});
	},
};
</script>
<style lang="css" scoped>
/* 页面样式css内容 */
.excelBox{
	width: 500px; height: 190px; margin-left: -150px; background: #f1f7ff;
	position: absolute; left: 50%; top: 15%; z-index: 1000;
}
p{ margin: 0; }
.excelBox>p{
	width: 100%; height: 50px; line-height: 50px; font-weight: bold;
	background: #e3efff; text-align: center;
}
.excelBox .excelInput{
	width: 100%; height: 60px;
}
.excelBox .select{
	width: 100%; height: 80px;
}
.excelBox .excelInput p,
.excelBox .select p{
	width: 100%; height: 36px; text-indent: 20px; line-height: 36px;
}
.excelBox .excelInput input{
    width: 300px; display: block; margin: 0 auto;
}
.excelBox .select>div{
	width: 300px; display: block; margin: 0 auto;
}
.btns{
    width: 100%; height: 50px;
}
.btns button{
    width: 80px; height: 40px; text-align: center; line-height: 40px;
    border: none; border-radius: 5px;
    background-color: #78B2FF; margin-top: 20px; color: #fff;
}
.btns button:nth-of-type(1){
    margin-left: 150px; cursor: pointer;
}
.btns button:nth-of-type(2){
    margin-left: 50px; cursor: pointer;
}
</style>
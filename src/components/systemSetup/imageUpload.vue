<template>
    <!-- 图片上传 -->
    <div class="imageUpload">
        <div class="title">图片上传</div>
        <div class="top">
            <!--accept定义接收的文件类型,这里只接受图片-->
            <!--<input id="fileinput" @change="uploading($event)" type="file" accept="image/*">-->
            <!-- 定义可以上传任何的文件类型 -->
         	<input id="fileinput" @change="uploading($event)" type="file">
            <!--图片展示-->
            <img :src="src"/>
        </div>
        <div class="btns">
            <!-- 按钮操作部分 -->
            <button  @click="refreshPage($event)">重置</button>
            <button  @click="submit($event)">提交</button>
        </div>
        <div class="url">
            <span>得到图片的链接:</span>
            <span class="add">{{imgAliYunSrc}}</span>
            <span class="btn" @click="copyImgSrc">复制链接</span>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            file: '',
            src: '',
            imgAliYunSrc: "",
        };
    },
    mounted() {
        var _this = this;
    },  
    methods: {
        // 得到文件
        uploading(event) {
            var _this = this;
      		_this.file = event.target.files[0];//获取文件
      	    var windowURL = window.URL || window.webkitURL;
            _this.file = event.target.files[0];
            //创建图片文件的url
            _this.src = windowURL.createObjectURL(event.target.files[0]);
      	},
        // 文件的上传的功能
      	submit() {
            var _this = this;
          	let formData = new FormData();
          	formData.append('pic', _this.file); // 设置为数据库查找的对应字段
          	let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'  //之前说的以表单传数据的格式来传递fromdata
                }
            };
            // console.log(_this.file);
            // console.log(formData);
            // console.log(formData.get('pic'));
            axios.post(baseConfig.server+baseConfig.requestUrl+'/Test/getTestPictureUrl', formData, config)
            .then( (res) => {
               	// 对返回的数据进行处理，得到返回的图片链接
                console.log(res.data);
                baseConfig.successTipMsg(_this, '图片上传成功！');
                _this.imgAliYunSrc = res.data; 
            }).catch((error) =>{
                console.log(error);
            });
      	},
        // 进行页面刷新功能
        refreshPage() {
            var _this = this;
            //location.reload();// 页面刷新,不能直接进行刷新，路由会重新获取直接跳转到/login
            // 跳转到空页面，进行传参进行跳转到空组建里面，将需要返回的路由页面链接进行传值
            _this.$router.replace({
                path: '/empty', 
                query: {from: '/systemSetup/imageUpload'},
            });
        },
        // 复制到剪切板的功能
        copyImgSrc() {
            var _this = this;
            //复制到剪切板，点击复制口令
            var clipboard = new Clipboard('.btn', {
                text: function() {
                    return _this.imgAliYunSrc;
                }
            });
            clipboard.on('success', function(e) {
                baseConfig.successTipMsg(_this, '已复制图片的链接地址');
                console.log('success');
            });

            clipboard.on('error', function(e) {
                baseConfig.errorTipMsg(_this, e);
                // console.log(e);
                console.log('error');
            });
        },
    },  
}
</script>

<style lang="css" scoped>
.title{
    width: 100%; height: 50px; line-height: 50px;  text-align: center; 
    background-color: #c9dbf4;
}
.top{
    width: 100%;
    height: 200px; 
    margin: 0 auto;
}
.imageUpload #fileinput{
    display: block; float: left;
    width: 200px; height: 24px; line-height: 24px; 
    margin-top: 88px; margin-left: 400px;
}
.imageUpload img{
    display: block; float: left;
    width: 300px; 
    height: 150px;
    margin-top: 25px;
}
.btns{
    width: 100%; height: 50px;
    background-color: #e3efff;
}
.btns button{
    width: 80px; height: 40px;
    background-color: #78B2FF; color: #fff;
    text-align: center; line-height: 40px;
    border: none; border-radius: 5px;
    margin-top: 5px;
}
.btns button:nth-of-type(1){
    margin-left: 500px;
    cursor: pointer;
}
.btns button:nth-of-type(2){
    margin-left: 50px;
    cursor: pointer;
}
.url{
    width: 100%; height: 30px; line-height: 30px;
    margin-top: 30px;
}
.url span{
    display: block; float: left;
}
.url span:nth-of-type(1){
    width: 120px; height: 30px; line-height: 30px; text-align: center;
}
.url span:nth-of-type(2){
    width: 600px; height: 30px; line-height: 30px;
    background: #f1f7ff;
}
.url span:nth-of-type(3){
    width: 80px; height: 30px; line-height: 30px; text-align: center;
    color: #fff; background: #78B2FF;
    border-radius: 5px; margin-left: 10px; cursor: pointer;
}
</style>


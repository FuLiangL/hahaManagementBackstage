<template>
	<div id="app" >
		<transition name="fade" mode="out-in">
			<router-view></router-view>
		</transition>
	</div>
</template>
<script>
import 'babel-polyfill';
export default {
	name: 'app',
	components: {
	},
	mounted(){
		var _this = this;
		this.$nextTick(function(){
			// if (document.addEventListener) {
			// 	let resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
			// 	window.addEventListener(resizeEvt, _this.canvas, false);
			// 	document.addEventListener('DOMContentLoaded', _this.canvas, false);
			// 	_this.canvas();
			// } 
		});
	},
	methods:{
		canvas(){
			let canvas = document.getElementById('canvas'),
		    ctx = canvas.getContext('2d'),
		    width = window.innerWidth,
		    height = window.innerHeight,
		    //实例化月亮和星星。流星是随机时间生成，所以只初始化数组
		    moon = new Moon(ctx, width, height),
		    stars = new Stars(ctx, width, height, 200),
		    meteors = [],
		    count = 0
		    canvas.width = width;
		    canvas.height = height;
			const meteorGenerator = ()=> {
				//x位置偏移，以免经过月亮
				let x = Math.random() * width + 800
				meteors.push(new Meteor(ctx, x, height))
				//每隔随机时间，生成新流星
				setTimeout(()=> {
					meteorGenerator();
				}, Math.random() * 2000)
			}
			const frame = ()=>{
				count++
				count % 10 == 0 && stars.blink()
				moon.draw();
				stars.draw();
				meteors.forEach((meteor, index, arr)=> {
					//如果流星离开视野之内，销毁流星实例，回收内存
					if (meteor.flow()) {
						meteor.draw()
					} else {
						arr.splice(index, 1)
					}
				});
				requestAnimationFrame(frame);
			}
			meteorGenerator();
			frame();
		}
	}
}
</script>
<style lang="css">
/*#app {
	background: url(assets/bg1.jpg) center !important;
	background-size: cover;
}*/
.canvas {
    position: fixed;
    z-index: -1;
}
html {
	width: 100%;
	height: 100%;
}
a:hover, a:visited, a:link, a:active {
    text-decoration: none;
	color: #48576a;
}
body {

	margin: 0px;
	padding: 0px;
	/*background: url(assets/bg1.jpg) center !important;
	background-size: cover;*/
	background: #fdfdfd;
	font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
	font-size: 14px;
	-webkit-font-smoothing: antialiased;
}
#app {
	position: absolute;
	top: 0px;
	bottom: 0px;
	width: 100%;
	height: 100%;
}
.el-submenu [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}
.el-menu-item [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}
/* 设置左边导航栏的最少宽度为156px，不是为设置的200px */
.el-submenu .el-menu-item {
    min-width: 156px !important;
}
/* 设置工具toolbar的背景颜色进行调整 */
.toolbar {
	background: #c9dbf4;
	padding: 10px;
	/* //border:1px solid #dfe6ec; */
	/* margin: 5px 0px; */
}
/* 设置为表格的基本统一样式 */
.el-form-item {
	margin-bottom: 10px !important;
}
.el-table th {
	background-color: #e3efff !important;
}
.el-table__header-wrapper thead div{
	background-color: #e3efff !important;
}
.el-table .cell, .el-table th>div{
	text-align: center !important;
	padding-left: 0 !important;
    padding-right: 0 !important;
}
.fade-enter-active,
.fade-leave-active {
	transition: all .2s ease;
}
.moon {
	width: 100px;
	height: 100px;
	position: absolute;
	z-index:-1;
	left: 100px;
	top: 100px;
	background: url('assets/moon.png') no-repeat;
	background-size: cover;
	/* box-shadow: 0 0 25px #cac6c6; */
}
.fade-enter,
.fade-leave-active {
	opacity: 0;
}
/* 设置让有对应的tab切换的padding取消掉 */
.el-tabs--border-card>.el-tabs__content{
	/* 将head、content之间的padding值取消掉 */
	padding: 0 !important;
}
.el-tabs__header{
	/* 取消掉tab切换中的border */
	border: none !important;
}
.el-tabs--border-card>.el-tabs__header {
	/* 这里设置的是具体组建当中tab切换的颜色 */
    background-color: #bef0ff !important;
}
/* 设置上面、左边导航栏的背景颜色 */
.el-menu--horizontal{
    background-color: #324157 !important;	
	border-bottom: none !important;
}
.el-menu--horizontal>.el-menu-item{
	color: #bfcbd9 !important;
}
.el-menu--horizontal>.el-menu-item.is-active{
	color: #409EFF !important;
	border-bottom: 5px solid transparent !important;	
	background-color: #324157 !important;	
}
.el-menu--horizontal>.el-menu-item.is-active:hover{
	color: #409EFF !important;	
}
.el-menu--horizontal>.el-menu-item:hover{
	background-color: #324157 !important;
	color: #bfcbd9 !important;
	border-bottom: 5px solid #409EFF !important;
}
/* 左边导航栏 */ 
.el-menu-vertical-demo{
    background-color: #324157 !important;
}
.el-menu-vertical-demo .el-menu-item,
.el-menu-vertical-demo .el-submenu__title{
    color: #bfcbd9;
}
.el-menu-vertical-demo .el-submenu .el-menu{
    background-color: #1f2d3d !important;
}
.el-submenu__title:hover{
	background-color: #48566A !important;
}
.el-menu-vertical-demo .el-menu-item{
    background-color: #1f2d3d !important;
}
.el-menu-item:hover{
	background-color: #48566A !important;
}
.el-menu-vertical-demo{
	width: 100%;
}
/* 弹出dialog添加上背景色 */ 
.el-dialog__wrapper{
	background-color: rgba(0, 134, 139, 0.5);
}
/* 将左边导航栏对应的li设置为40px，将对应的上下padding设置为0 */ 
.el-menu-item-group__title{
	padding-top: 0 !important;
	padding-bottom: 0 !important;
}
.el-menu-item-group{
	height: 38px !important; line-height: 38px !important;
}
</style>


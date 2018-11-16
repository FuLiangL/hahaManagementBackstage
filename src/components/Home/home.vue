<template lang="html">
    <el-row class="container">
        <!-- 头部的导航栏 -->
        <el-menu theme="dark" :default-active="indexPath" class="el-menu-demo" mode="horizontal" router @select="handleSelect">
            <!-- 前面的logo -->
            <div class="el_logo">
                <div class="logo"></div>
            </div>
            <!-- 链接的跳转，几个大类 -->
            <!-- <el-menu-item index="/operationData" :route="{path: '/operationData'}">运营数据</el-menu-item>
            <el-menu-item index="/userManagement" :route="{path: '/userManagement'}">用户管理</el-menu-item>
            <el-menu-item index="/operationSupport" :route="{path: '/operationSupport'}">运营支撑</el-menu-item>
            <el-menu-item index="/activities" :route="{path: '/activities'}">活动专区</el-menu-item>
            <el-menu-item index="/systemSetup" :route="{path: '/systemSetup'}">系统设置</el-menu-item> -->
            <el-menu-item v-for="(item, indexs) in dataView" :key="indexs" :index="item.path" :router="{path: item.path}">{{item.name}}</el-menu-item>
            <!-- 加上uid查询的功能 -->
            <div class="uidFind">
                <input v-model="uidFind" placeholder="请输入uid(1000+)查询" />
                <!-- <div @click="goToShowUidContent()">用户详情</div> -->
                <div @click="goToShowUidContent()">用户详情</div>
            </div>
            <!-- 用户头像、用户简介 -->
            <el-col :span="4" class="userinfo">
                <el-dropdown trigger="hover">
                    <span class="el-dropdown-link userinfo-inner"><img :src="sysUserAvatar" /> {{sysUserName}}</span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>我的消息</el-dropdown-item>
                        <el-dropdown-item>设置</el-dropdown-item>
                        <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-menu>
        <!-- 个人信息展示组件 -->
		<!-- <oneUserContent></oneUserContent> -->
        <oneUserContentInfo></oneUserContentInfo>
        <!-- 路由容器 -->
        <el-col :span="24" class="content-all-wrapper">
            <transition name="el-fade-in-linear" mode="out-in" >
                <router-view  class="nav-view"></router-view>
            </transition>
        </el-col>
    </el-row>
</template>

<script>
import Event from './../../public_js/event.js';
import oneUserContent from './../rootGlobal/oneUserContent.vue'; // 个人信息内容弹窗
import oneUserContentInfo from './../rootGlobal/oneUserContentInfo.vue';
import store from '../../vuex/store';
export default {
     data() {
        return {
            sysUserName: '',
            sysUserAvatar: 'http://imgtu.5011.net/uploads/content/20170410/2880121491810236.jpg',
            indexPath: '', // 页面刷新时，直接页面路由的跳转，设置默认打开的页面 
            indexPathArr: ['/operationData', '/userManagement', '/operationSupport', '/activities', '/systemSetup'], // 设置home上面导航栏的默认路由集合
            // routes:"",
            uidFind: '', //uid的查询信息
        };
    },
    computed: {
        dataView() {
            // 拿取store中的路由表的相应内容
            let thatDdta = store.getters.addRouters;
            // console.log(store.getters.addRouters);            
            return store.getters.addRouters;
        }
    },
    components: {
        oneUserContent,
        oneUserContentInfo,
	},
    mounted: function(){
        var _this = this;
        _this.$nextTick(function(){
            var strPath = location.href;
            if(strPath.indexOf('http://')==0) {
                strPath = strPath.substring(strPath.indexOf('#/')+1, strPath.length);
            }
            var index = strPath.indexOf('/');
            strPath = strPath.substring(index, strPath.length);
            for(var i=0; i<_this.indexPathArr.length; i++) {
                if(strPath.indexOf(_this.indexPathArr[i])!=-1) {
                    _this.indexPath = _this.indexPathArr[i];
                    break;
                }
            }
        })
    },
    updated() {
        // home的路由直接切换的更新操作
        var _this = this;
        _this.$nextTick(function(){
            var strPath = location.href;
            if(strPath.indexOf('http://')==0) {
                strPath = strPath.substring(strPath.indexOf('#/')+1, strPath.length);
            }
            var index = strPath.indexOf('/');
            strPath = strPath.substring(index, strPath.length);
            for(var i=0; i<_this.indexPathArr.length; i++) {
                if(strPath.indexOf(_this.indexPathArr[i])!=-1) {
                    _this.indexPath = _this.indexPathArr[i];
                    break;
                }
            }
        })
    },
    methods: {
        handleSelect(key, keyPath) {
            // console.log(key, keyPath);
        },
        logout: function () {
            var _this = this;
            _this.$confirm('确认退出吗?', '提示', {
                //type: 'warning'
            }).then(() => {
                _this.$router.push({ path: '/login', });
                //这个不能动
                location.reload();
            }).catch((error) => {
                console.log(error);
            });
        },
        handleOpen(key, keyPath) {
            // console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            // console.log(key, keyPath);
        },
        // 点击查询之后进行用户信息的显示
        goToShowUidContent() {
            var _this = this;
            if(baseConfig.server.indexOf('test')=='-1') {
                // 正式服，进行6为有效数字的匹配
                if(/^[0-9]{10}$/.test(_this.uidFind)) {
                    Event.$emit('show-one-user', {
                        uid : _this.uidFind,
                    });
                } else {
                    baseConfig.normalTipMsg(_this, 'uid输入有误，请输入正确的uid！');
                }
            } else {
                // 测试服的数据，进行5的uid的查询
                if(/^[0-9]{5}$/.test(_this.uidFind)) {
                    Event.$emit('show-one-user', {
                        uid : _this.uidFind,
                    });
                } else {
                    baseConfig.normalTipMsg(_this, 'uid输入有误，请输入正确的uid！');
                }
            }
         },
    }
}
</script>

<style lang="css">
.el-select__tags{
    max-width: auto !important;
    /* width: 1000px !important; */
}
/* 设置uid查询的样式问题 */
.uidFind{
    position: absolute;
    right: 15%; top: 10px;
    width: 220px; height: 40px;
}
.uidFind input{
    width: 150px; height: 40px;
    padding: 0; margin: 0;
    text-align: left; line-height: 40px;
    position: absolute; left: 0; top: 0;
    border: none; outline: none;
    text-indent: 20px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
}
.uidFind div{
    width: 70px; height: 40px;
    text-align: center; line-height: 40px;
    position: absolute; left: 150px; top: 0;
    background: cadetblue; color: #fff;
    cursor: pointer;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
}
/* 后面的样式问题 */
.userinfo {
    height: 60px;
    text-align: right;
    padding-right: 35px;
    float: right !important;
}
.userinfo-inner {
    cursor: pointer;
    color:#fff;
}
.userinfo-inner img {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    margin: 10px 0px 10px 10px;
    float: right;
}
/* 设置logo宽度自适应，和下面的左边导航栏进行匹配,宽度设置为13% */
.el_logo{
    width: 13%; 
    height: 60px;
    min-width: 150px;
    display: block;
    float: left;
}
.logo {
    display: block;
    float: left;
    width: 50px;
    height: 50px;
    background-image: url(https://tools.dianliaoapp.com/test/test-2018-11-06-4174.png) ;
    background-size: cover;
    margin:5px 0px 0 80px;
}
.nav-view {
    /*height: 100%;*/
    width: 100%;
    /* min-width: 1080px; */
}
/* .nav-head {
    min-width: 1080px;
} */
.container　{
    /* min-width: 1080px; */
    min-height: 660px;
}
/* 设置面包屑的样式 */
/* .el-breadcrumb__item{
    height: 60px !important; 
    background-color: #f1f7ff !important; 
    float: left !important; 
    line-height: 60px !important;
}
.el-breadcrumb__item:nth-of-type(1){
    margin-left: 200px;
    padding-left: 40px;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
}
.el-breadcrumb__item:nth-last-of-type(1){
    padding-right: 40px;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
} */
@media screen and (min-height: 660px) {
    .left_active {
        width: 13%;
        min-width: 150px;
        /* min-height: 660px; */
        height: 100% ;
        background-color: #eef1f6;
        float: left;
    }
}
.left_active {
    width: 13%;
    min-width: 150px;
    /* min-height: 944px; */
    /* min-height: 914px; */
    height: 100% ;
    background-color: #324157;
    float: left;
}
.content-all-wrapper {
    /*margin-top: 2px;*/
    height: 100%;
    /* min-width: 1200px; */
}
.content-container {
    display: inline-block;
    overflow-y: scroll;
    padding: 20px;
}
.content-wrapper {
    width: 87% !important;
    height: 100%;
    background-color: #fff;
    float: left;
}
/*  */
.el-menu-item-group__title{
    padding-top: 0 !important;
}
.el-submenu__title{
    height: 40px !important;
    line-height: 40px !important;
}
/* 设置为相应左边导航选中的item高度以及行高，对应为三级路由的行高进行设置 */
.el-submenu .el-menu-item{
    height: 40px !important;
    line-height: 40px !important;
}
/* 设置为相应左边导航选中的item高度以及行高，对应为二级路由的行高进行设置 */
/* el-menu */
.left_active .el-menu-item{
    height: 40px !important;
    line-height: 40px !important;
}
.el-dialog__body{
    padding-top: 10px !important;
}
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
</style>

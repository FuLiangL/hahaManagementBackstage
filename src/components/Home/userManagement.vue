<!-- 主播管理的总体的框架 -->
<template lang="html">
    <!-- 左侧的导航栏 -->
    <el-row>
        <div class="left_active" ref="leftnav">
            <!-- 循环相应的路由表生成左侧的路由表二级路由表 -->
            <el-menu theme="dark" :default-active="indexPath" class="el-menu-vertical-demo " @open="handleOpen" @close="handleClose" unique-opened router>
                <div v-for="(item, indexs) in dataView">
                    <el-submenu :index="indexs+''">
                        <template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
                        <template v-for="child in item.children">
                            <el-menu-item-group >
                                <!-- 判断进行设置了为hidden: true;不进行展示 -->                                
                                <el-menu-item :index="child.path" v-show="!child.hidden">{{child.name}}</el-menu-item>
                            </el-menu-item-group>
                        </template>
                    </el-submenu>
                </div>
            </el-menu>
        </div>
        <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
                <router-view></router-view>
            </transition>
        </el-col>
    </el-row>
</template>

<script>
import store from '../../vuex/store';
export default {
    data() {
        return {
            indexPath: '', // 页面刷新时，直接页面路由的跳转，设置默认打开的页面 
            indexPathArr: [],            
        };
    },
    computed: {
        dataView() {
            var _this = this;
            // 拿取store中的路由表的相应内容，必须判断为相应的name值进行展示
            let thatDdta = store.getters.addRouters;
            let data =  thatDdta.filter(data => {
                if(data.name=='用户管理'){
                    return  data;
                }
            });
            var arr = data[0].children;            
            for(var i=0; i<arr.length; i++) {
                for(var j=0; j<arr[i].children.length; j++) {
                    _this.indexPathArr.push(arr[i].children[j].path);
                }
            } 
            return data[0].children;
        }
    },
    methods: {
        handleOpen(key, keyPath) {
            //console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            //console.log(key, keyPath);
        },
    },
    mounted() {
        var _this = this;
        _this.$nextTick(function() {
            _this.$refs.leftnav.style.height = leftNavHeight +'px';
            var strPath = location.href;
            if(strPath.indexOf('http://')==0) {
                strPath = strPath.substring(strPath.indexOf('#/')+1, strPath.length);                
            }
            var index = strPath.indexOf('/');
            strPath = strPath.substring(index, strPath.length);
            _this.indexPath = strPath;
		})
    },
    updated() {
        var _this = this;
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
    },
}
</script>

<style lang="css">

</style>

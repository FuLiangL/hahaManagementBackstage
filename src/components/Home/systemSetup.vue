<!-- 系统设置的总体的框架 -->
<template lang="html">
    <el-row>
        <!-- 左侧的导航栏 -->
        <div class="left_active" ref="leftnav">
            <el-menu theme="dark" :default-active="indexPath" class="el-menu-vertical-demo " @open="handleOpen" @close="handleClose" router>
                <!-- 循环相应的路由表生成左侧的路由表一级路由表 -->
                <!-- 判断进行设置了为hidden: true;不进行展示 -->                                
                <el-menu-item v-for="(item, indexs) in dataView" :key="indexs" :index="item.path" v-show="!item.hidden">
                    <i :class="item.iconCls"></i>
                    <span slot="title">{{item.name}}</span>
                </el-menu-item>
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
            // 拿取store中的路由表的相应内容
            let thatDdta = store.getters.addRouters;
            let data =  thatDdta.filter(data => {
                if(data.name=='系统设置'){
                    return  data;
                }
            });
            var arr = data[0].children[0].children;            
            for(var i=0; i<arr.length; i++) {
                _this.indexPathArr.push(arr[i].path);
            }
            return data[0].children[0].children;
        }
    },
    methods: {
        handleOpen(key, keyPath) {
            //console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            //console.log(key, keyPath);
        }
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

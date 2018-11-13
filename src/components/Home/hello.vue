<template lang="html">
    <el-row>
        <div class="welcome">
            <div class="welcome-left">
                <div class="hello-nav">欢迎回来，<span>{{username | name}}</span></div>
                <div class="time-nav el-icon-time">{{time}}<span>{{week}}</span></div>
            </div>
        </div>
    </el-row>
</template>

<script>
import store from '../../vuex/store';
export default {
    data() {
        return {
            username: "",
            time: "",
            week: "",
        }
    },
    filters:{
        // 没有名字定义为超管员，其它的全部是管理员+name
        name: function(name) {
            if(name=='admin'){
                return '超管员';
            }else {
                return '管理员'+name; 
            }
        },
    },
    methods:{
        // hello组建中拿取用户信息
        getStorage() {
            var _this = this;
            if(store.state.user.name){
                _this.username = store.state.user.name;
            } else {
                baseConfig.errorTipMsg(_this, '发生了错误，请进行页面刷新啦~');
            }
        },
        // 输出当前的时间地点
        newTime() {
            var _this = this;
            var weekall = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六']
            var time = new Date();
            var month = time.getMonth() + 1;
			var year = time.getFullYear();
			var week = time.getDay();
            var day = time.getDate();
            _this.time = year+'-'+ month +'-'+day;
            _this.week = weekall[week];
        },
    },
    mounted:function(){
        var _this = this;
        _this.$nextTick(function(){
            _this.getStorage();
            _this.newTime();
        })
    },
}
</script>

<style lang="css">
.hello-nav {
    color: #8492a6;
    font-size: 40px;
}
.time-nav{
    color: #000;
    font-size: 40px;
    margin: 20px auto 0;
    display: block !important;
    color: #8492a6;
}
.welcome {
    height: 120px;
    margin: 12% 0 0 10%;
}
.welcome-left {
    width: 500px;
}
.welcome-right {
    width: 200px;
}
</style>

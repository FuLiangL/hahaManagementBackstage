<template>
    <div class="empty">

    </div>
</template>

<script>
/* 
    这个空页面的主要用于页面刷新的作用使用
    在其他页面需要刷新的页面中，进行$router带参数跳转
    例如：   _this.$router.replace({
                path: '/operationSupportOne/empty', 
                query: {from: '/operationSupportOne/imageUpload'},
            });
*/ 
import Event from '../../public_js/event.js';
export default {
    data() {
        return {
            
            };
    },
    mounted() {
        var _this = this;
        var historyRoute = _this.$route.query.from;
        _this.$router.replace(historyRoute);//监听到属于哪个页面跳转过来，进行跳转回去 
    },
    methods: {
        
    },
}
</script>

<style lang="css" scoped>

</style>
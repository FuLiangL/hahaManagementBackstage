import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import router from './router';
import ElementUI from 'element-ui';
import vueQuillEditor from 'vue-quill-editor';
// require styles 引入样式
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import 'element-ui/lib/theme-chalk/index.css';
import store from './vuex/store';

Vue.use(ElementUI);
Vue.use(vueQuillEditor);

function hasPermission(roles, permissionRoles) {
    if(!permissionRoles) return true;
    return roles.some(role => permissionRoles.indexOf(role) >= 0);
}
const whiteList = ['/login', '/401'];
router.beforeEach((to, from, next) => {
    if(store.getters.token) {
        if(to.path==='/login') {
            next();
            location.reload();
        } else {
            if(store.getters.roles.length===0) {
                store.dispatch('GetInfo').then(res => {
                    const roles = store.state.user.roles;
                    store.dispatch('GenerateRoutes', {
                        roles
                    }).then(() => {
                        router.addRoutes();
                        next(to.path);
                    });
                }).catch(err => {
                    console.log(err);
                });
            } else {
                // 没有动态改变权限的需求可直接next()
                // 加上预处理的过程，判断在最外层的三个的判断，存在多级的不同选择
                var twoParam = null;
                if(to.path=='/operationData' || to.path=='/userManagement' || to.path=='/operationSupport') {
                    for(var i=0; i<store.getters.addRouters.length; i++) {
                        if(store.getters.addRouters[i].path==to.path) {
                            twoParam = store.getters.addRouters[i].meta.role;
                        }
                    }
                } else {
                    twoParam = to.meta.role;                    
                }
                if(hasPermission(store.getters.roles, twoParam)) {
                    // 在这里进行判断相应的如果只是进行了几个大的tab切换时进行相应的选择默认
                    // 大的版块的进行保存相应的路由信息的
                    if(to.path=='/operationData') {
                        next({ path:  store.getters.allroute[0]});                        
                    } else if(to.path=='/userManagement') {
                        next({ path:  store.getters.allroute[1]});                                                
                    } else if(to.path=='/operationSupport') {
                        next({ path:  store.getters.allroute[2]});                        
                    } else if(to.path=='/activities') {
                        next({ path:  store.getters.allroute[3]});                        
                    } else if(to.path=='/systemSetup') {
                        next({ path:  store.getters.allroute[4]});                        
                    } else if( to.path.indexOf('/operationData')==0 || to.path.indexOf('/userManagement')==0 || to.path.indexOf('/operationSupport')==0 || to.path.indexOf('/activities')==0 || to.path.indexOf('/systemSetup')==0 ){
                        store.dispatch('ChangeOneRoute', {path: to.path, data: store.getters.allroute})
                        .then((res) => {
                            // console.log(res);
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                        next();
                    } else {
                        // 不在大板块里面的路由进行随机的更换的
                        next();                        
                    }
                } else { 
                    // 跳转返回直接进行返回之前的页面
                    next({ path: '/401' });
                }
            }
        }
    } else {
        // 在免登录白名单，直接进入，否则全部重定向到登录
        if(whiteList.indexOf(to.path) !== -1) { 
            next();
        } else {
            next('/login');
        }
    }
});

/* eslint-disable no-new */
new Vue({
    //el: '#app',
    //template: '<App/>',
    router,
    store,
    //components: { App }
    render: h => h(App)
}).$mount('#app');
import { allget } from '../../api/api';
import md5 from '../../public_js/md5';

const user = {
    state: {
        user: '',
        name: '',
        status: '',
        roles: [],
        router: [],
        channelid: '',
        channelname: '',
        token: '',
        // 配置初始的页面的跳转
        allroute: [
            '/operationData/userAnalysis/heldOutData', 
            '/userManagement/householdManagement/familyManage',
            '/operationSupport/operatingTools/bannerManagement',
            '/activities/roomTopManagement',
            '/systemSetup/modifyThePassword',
        ],
    },
    mutations: {
        SET_NAME: (state, name) => {
            state.name = name;
        },
        SET_USER: (state, user) => {
            state.user = user;
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles;
        },
        SET_ROUTER: (state, router) => {
            state.router = router;
        },
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        SET_CHANNELID: (state, channelid) => {
            state.channelid = channelid;
        },
        SET_CHANNELNAME: (state, channelname) => {
            state.channelname = channelname;
        },
        SET_ALL_ROLES: (state, allroute) => {
            state.allroute = allroute;
        },
    },
    actions: {
        // 获取用户信息，请求接口数据，将信息保存在user中
        GetInfo({ commit }, ueserInfo) {
            return new Promise((resolve, reject) => {
                var url = '/NewLoginTpl/loginCheck';
                try {
                    allget({ user_name: ueserInfo.username, pass_word: md5(ueserInfo.password), }, url)
                    .then((res) => {
                        if(res.data.ret) {
                            var arr = [];
                            if(res.data.data.auth_code==0) { /* 无权限，不进行处理 */ } 
                            else if(res.data.data.auth_code==1) { arr.push('T1'); }
                            else if(res.data.data.auth_code==2) { arr.push('T2'); }
                            else if(res.data.data.auth_code==3) { arr.push('P1'); }
                            else if(res.data.data.auth_code==4) { arr.push('P2'); }
                            else if(res.data.data.auth_code==5) { arr.push('O1'); }
                            else if(res.data.data.auth_code==6) { arr.push('O2'); }
                            else if(res.data.data.auth_code==7) { arr.push('M'); }
                            else if(res.data.data.auth_code==8) { arr.push('C'); }
                            else if(res.data.data.auth_code==9) { arr.push('G'); }
                            commit('SET_ROLES', arr); // 可以在这里设置角色测试
                            commit('SET_USER', res.data.data.user_name);
                            commit('SET_NAME', res.data.data.real_name);
                            commit('SET_CHANNELID', res.data.data.channel_id_list);
                            commit('SET_CHANNELNAME', res.data.data.channel_name_list);
                            commit('SET_TOKEN', 'youwodianliaodoudou');
                            resolve(res);
                        } else {
                            baseConfig.warningTipMsg(ueserInfo.obj, res.data.msg);
                            resolve(res);
                        }
                    });
                } catch(e) {
                    console.log(e);
                } finally {  }
            })
            .catch(e => {
                reject(e);
            });
        },
        // 证明
        GetInfoId({ commit, state }) {
            commit('SET_TOKEN', 'youwodianliaodoudou');
        },
        // 登出
        LogOut({ commit, state }) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    commit('SET_ROLES', []);
                    Cookies.remove('Admin-Token');
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        },
        // 前端 登出
        FedLogOut({ commit }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '');
                Cookies.remove('Admin-Token');
                resolve();
            });
        },
        // 动态修改权限
        ChangeRole({ commit }, role) {
            return new Promise(resolve => {
                commit('SET_ROLES', [role]);
                Cookies.set('Admin-Token', role);
                resolve();
            });
        },
        // 保存用户在每一个版块的当前的路由,明天上午进行相应的值的替换计算，
        // 如果是路由跳转的地方进行拿取相应的值，之前的路由的大地址进行的切换，进行相应的改变
        // 在跳转成功之后进行相应的发起改变相应的值
        ChangeOneRoute({ commit }, param) {
            return new Promise((resolve, reject) => {
                var arr = param.data;
                if(param.path.indexOf('/operationData')==0) {
                    arr[0] = param.path;
                } else if(param.path.indexOf('/userManagement')==0) {
                    arr[1] = param.path;                    
                } else if(param.path.indexOf('/operationSupport')==0) {
                    arr[2] = param.path;                    
                } else if(param.path.indexOf('/activities')==0) {
                    arr[3] = param.path;                    
                } else if(param.path.indexOf('/systemSetup')==0) {
                    arr[4] = param.path;                    
                }
                commit('SET_ALL_ROLES', arr);
                resolve('成功');
            })
            .catch((error) => {
                reject(error);
            }); 
        },
    }
};
export default user;
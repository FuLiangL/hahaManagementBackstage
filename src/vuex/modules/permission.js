import { asyncRouterMap, constantRouterMap } from '../../router/index';
function hasPermission(roles, route) {
    if (route.meta && route.meta.role) {
        return roles.some(role => route.meta.role.indexOf(role) >= 0);
    } else if (route.path == '*') {
        return false;
    } else {
        return true;
    }
}
const permission = {
    state: {
        routers: constantRouterMap,
        addRouters: []
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.addRouters = routers;
            state.routers = constantRouterMap.concat(routers);
        }
    },
    actions: {
        GenerateRoutes({ commit }, rolesParam) {
            return new Promise(resolve => {
                var { roles } = rolesParam;
                const accessedRouters = asyncRouterMap.filter(v => {
                    if(hasPermission(roles, v)) {
                        v.children = v.children.filter(vv => {
                            if(hasPermission(roles, vv)) {
                                vv.children = vv.children.filter(vvv => {
                                    if(hasPermission(roles, vvv)) {
                                        return vvv;
                                    }
                                    return false;
                                });
                                return vv;
                            }
                            return false;
                        });
                        return v;           
                    }
                    return false;
                });
                commit('SET_ROUTERS', accessedRouters);
                resolve();
            });
        }
    }
};
export default permission;
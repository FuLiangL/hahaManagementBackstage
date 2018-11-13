const getters = {
    name: state => state.user.name,
    roles: state => state.user.roles,
    router: state => state.user.router,
    token: state => state.user.token,
    allroute: state => state.user.allroute,
    channelid: state => state.user.channelid,
    channelname: state => state.user.channelname,
    permission_routers: state => state.permission.routers,
    addRouters: state => state.permission.addRouters,
};
export default getters;
